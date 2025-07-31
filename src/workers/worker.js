// worker.js
self.onmessage = async function (e) {
  const { fn, data } = e.data;

  try {
    // Validate inputs
    if (!fn || typeof fn !== 'string') {
      throw new Error('Function code must be a string');
    }

    // Check if the code contains await to determine if it's async
    const isAsync = fn.includes('await') || fn.includes('Promise');

    // If the code contains await, wrap it in an async function
    const functionBody = isAsync
      ? `return (async () => { ${fn} })();`
      : fn;

    // Use Function constructor with explicit parameter and body
    // eslint-disable-next-line no-new-func
    const userFunc = new Function('data', functionBody);
    const result = isAsync ? await userFunc(data) : userFunc(data);

    self.postMessage({ result });
  } catch (error) {
    console.error('Error executing handler:', error);
    self.postMessage({
      error: error.message,
      stack: error.stack
    });
  }
};
