// worker.js
import { parse } from 'flatted';

self.onmessage = async function (e) {
  const { fn, dataRefs } = e.data;
  const { data, scope, parent } = parse(dataRefs);

  try {
    // Validate inputs
    if (!fn || typeof fn !== 'string') {
      throw new Error('Function code must be a string');
    }

    // Check if the code is asynchronous
    const isAsync = detectAsyncCode(fn);

    // If the code contains await, wrap it in an async function
    const functionBody = isAsync
      ? `return (async () => { ${fn} })();`
      : fn;

    // Use Function constructor with explicit parameter and body
    // eslint-disable-next-line no-new-func
    const userFunc = new Function('data', 'parent', functionBody);
    const result = isAsync ? await userFunc.apply(scope, [data, parent]) : userFunc.apply(scope, [data, parent]);

    self.postMessage({ result });
  } catch (error) {
    console.error('❌ Error executing handler:', error);

    self.postMessage({
      error: error.message || error.toString(),
      stack: error.stack
    });
  }
};

function detectAsyncCode(code) {
  // Remove comments and strings to avoid false positives
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Replace string content
    .replace(/'[^']*'/g, "''") // Replace string content
    .replace(/`[^`]*`/g, '``'); // Replace template literals

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
    /\basync\b/, // async keyword (in case it's used)
  ];

  // Check if any async pattern is found
  return asyncPatterns.some((pattern) => pattern.test(cleanCode));
}
