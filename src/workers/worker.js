// worker.js
self.onmessage = function (e) {
  const { fn, data } = e.data;

  try {
    // Execute the handler as a function with data as the context
    const func = new Function("data", fn);
    // const func = new Function('data', `return (${fn})(data)`)
    const result = func(data);

    self.postMessage({ result });
  } catch (error) {
    console.error("Error executing handler:", error);
    self.postMessage({ error: error.message });
  }
};
