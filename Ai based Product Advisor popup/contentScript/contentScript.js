function fetchContent(sendResponse) {
  window.scrollTo(0, 500); 

  const checkElementsLoaded = setInterval(() => {
    const elements = document.body.getElementsByClassName('review-content-sl');
    if (elements.length < 2) {
      console.log('Not enough data about a product to make a recommendation.');
      clearInterval(checkElementsLoaded); 
      sendResponse({ status: 'Not' });
      return;
    }

    clearInterval(checkElementsLoaded); 

    const contentArray = [];
    for (let i = 0; i < 2; i++) {
      contentArray.push(elements[i].innerText);
    }

    chrome.storage.local.set({ 'reviewContents': contentArray }, () => {
      console.log('Content stored in local storage:', contentArray);
      sendResponse({ status: 'Content fetched and stored.' });
    });
  }, 1000); 
 }
 
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchContent') {
    fetchContent(sendResponse);
    return true; // Keep sendResponse valid for asynchronous use
  }
});