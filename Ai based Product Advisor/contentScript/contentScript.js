// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

async function fetchContent(sendResponse) {
  const elements = document.body.getElementsByClassName('review-content-sl');
  const contentArray = [];
  window.scrollTo(0, 700); 
  // await sleep(4000);
    
  if (elements.length < 2) {  
    sendResponse({ status: 'Not' });
    console.log('Not enough data about a product to make a recommendation.');
    return;
  }

  for (let i = 0; i < 3; i++) {
    contentArray.push(elements[i].innerText);
  }

  chrome.storage.local.set({ 'reviewContents': contentArray }, () => {
    console.log('Content stored in local storage:', contentArray);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchContent') {
    fetchContent(sendResponse);
    sendResponse({ status: 'Content fetched and stored.' });
    return true;
  }
})
