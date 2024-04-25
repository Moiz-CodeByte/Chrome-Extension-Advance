document.getElementById('fetch-content').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchContent' }, (response) => {
      if(response && response.status === 'Not'){
        displayErr('Not enough data about a product to make a recommendation.')
      }
      if (response && response.status === 'Content fetched and stored.') {
        chrome.storage.local.get('reviewContents', (data) => {
          if (data.reviewContents) {
            chrome.runtime.sendMessage(
              {
                action: 'getRecommendation',
                reviewContents: data.reviewContents,
              },
              (recommendation) => {
                displayRecommendation(recommendation);
              }
            );
          }
        });
      }
    });
  });
});
function displayErr(message){
  const resultContainer = document.getElementById('recommendation-result');
  resultContainer.textContent = message;

}

function displayRecommendation(recommendation) {
  const resultContainer = document.getElementById('recommendation-result');
  resultContainer.textContent = recommendation;
  chrome.storage.local.remove('reviewContents', () => {
    console.log('Review content cleared from local storage.');
  });
}
