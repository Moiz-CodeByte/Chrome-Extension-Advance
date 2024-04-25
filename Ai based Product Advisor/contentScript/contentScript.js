// Function to fetch content from the page
function fetchContent() {
  const elements = document.body.getElementsByClassName('review-content-sl');
  const contentArray = [];

  // Check if there are enough elements
  if (elements.length < 3) {
    console.log('Not enough elements with class "review-content-sl" found');
    return;
  }

  // Collect first three elements
  for (let i = 0; i < 3; i++) {
    contentArray.push(elements[i].innerText);
  }

  // Store in local storage
  chrome.storage.local.set({ 'reviewContents': contentArray }, () => {
    console.log('Content stored in local storage:', contentArray);
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchContent') {
    fetchContent();
    sendResponse({ status: 'Content fetched and stored.' });
  }
});
