// worker.js
import { parse } from "flatted";

// Create a mock context for browser globals
const createMockContext = () => {
  const mockContext = {
    alert: (message) => {
      // Send alert message back to main thread
      self.postMessage({
        type: "alert",
        message
      });
    }
  };

  return mockContext;
};

function detectAsyncCode(code) {
  // Remove comments and strings to avoid false positives
  const cleanCode = code
    .replace(/"[^"]*"/g, '""') // Replace string content
    .replace(/'[^']*'/g, "''") // Replace string content
    .replace(/`[^`]*`/g, "``"); // Replace template literals

  // Check for async patterns
  const asyncPatterns = [
    /\bawait\b/, // await keyword
    /\bPromise\b/, // Promise constructor
    /\bfetch\b/, // fetch API
    /\bsetTimeout\b/, // setTimeout
    /\bsetInterval\b/, // setInterval
    /\brequestAnimationFrame\b/, // requestAnimationFrame
    /\brequestIdleCallback\b/, // requestIdleCallback
    /\bnew\s+Promise/, // new Promise
    /\b\.then\s*\(/, // .then() method
    /\b\.catch\s*\(/, // .catch() method
    /\b\.finally\s*\(/, // .finally() method
    /\bPromise\./, // Promise static methods
    /\basync\b/ // async keyword (in case it's used)
  ];

  // Check if any async pattern is found
  return asyncPatterns.some((pattern) => pattern.test(cleanCode));
}

self.onmessage = async function (e) {
  const { fn, dataRefs } = e.data;
  const { data, scope, parent } = parse(dataRefs);

  try {
    // Validate inputs
    if (!fn || typeof fn !== "string") {
      throw new Error("Function code must be a string");
    }

    // Basic security validation to prevent code injection
    const dangerousPatterns = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /import\s*\(/gi,
      /require\s*\(/gi,
      /window\./gi,
      /document\./gi,
      /localStorage/gi,
      /sessionStorage/gi,
      /fetch\s*\(/gi
    ];

    const hasDangerousCode = dangerousPatterns.some((pattern) =>
      pattern.test(fn)
    );
    if (hasDangerousCode) {
      throw new Error("Code contains potentially dangerous patterns");
    }

    // Limit code length to prevent abuse
    if (fn.length > 5000) {
      throw new Error("Code exceeds maximum length");
    }

    // Check if the code is asynchronous
    const isAsync = detectAsyncCode(fn);

    // Create mock context for browser globals
    const mockContext = createMockContext();

    // If the code contains await, wrap it in an async function
    const functionBody = isAsync ? `return (async () => { ${fn} })();` : fn;

    // Use Function constructor with explicit parameter and body
    // Security: Code is validated above for dangerous patterns and length limits
    // eslint-disable-next-line no-new-func
    const userFunc = new Function("data", "parent", "alert", functionBody);

    // Apply the function with the mock context
    const result = isAsync
      ? await userFunc.apply(scope, [data, parent, mockContext.alert])
      : userFunc.apply(scope, [data, parent, mockContext.alert]);

    self.postMessage({ result });
  } catch (error) {
    console.error("Error executing handler:", error);

    self.postMessage({
      error: error.message || error.toString(),
      stack: error.stack
    });
  }
};
