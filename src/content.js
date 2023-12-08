// In content script
const port = chrome.runtime.connect({ name: "content-script" });
port.postMessage({ message: "Hello from content script" });
