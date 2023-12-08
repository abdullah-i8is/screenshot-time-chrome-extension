// In background script
chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "content-script");
    port.onMessage.addListener((msg) => {
        console.log("Message from content script:", msg);
    });
});  