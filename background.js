/**
 * Unxnow Cookie Editor - Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Unxnow Cookie Editor installed successfully.');
});

// Broadcast cookie change events to active popup views if listening
chrome.cookies.onChanged.addListener((changeInfo) => {
  chrome.runtime.sendMessage({
    type: 'COOKIE_CHANGED',
    data: changeInfo
  }).catch(() => {
    // Popup might not be open, ignore errors when sending message
  });
});
