function injectButton() {
  const button = document.createElement('button');
  button.textContent = 'Fetch Result!';
  button.id = 'fetch-content';
  button.className = 'fetch-button';
  button.style.position = 'fixed';
  button.style.top = '75%';
  button.style.right = '0px';
  button.style.zIndex = '9999';


  button.addEventListener('click', () => {
    window.scrollTo(0, 600); 
    const checkElementsLoaded = setInterval(() => {
      const elements = document.body.getElementsByClassName('review-content-sl');
      const scoreElement = document.querySelectorAll('.review-info-rate .score')[0];
      const rateNumElement = document.querySelectorAll('.review-info-left .rate-num')[0];
  
    
      clearInterval(checkElementsLoaded);
    
       contentArray = [];
      for (let i = 0; i < elements.length; i++) {
        contentArray.push(elements[i].innerText);
      }

      const score = scoreElement ? scoreElement.innerText : '';
      const rateNum = rateNumElement ? rateNumElement.innerText : '';
       // Get content from local storage
  chrome.storage.local.set({ 'reviewContents': contentArray,'score': score, 'rateNum': rateNum }, () => {
    console.log('Content stored in local storage:', contentArray, score, rateNum);
  
    // Get content from local storage
    chrome.storage.local.get(['reviewContents', 'score', 'rateNum'], (result) => {
      const contentArray = result.reviewContents || [];
      const score = result.score;
      const rateNum = result.rateNum;
  
      if (contentArray.length < 2) {
        displayErr('Not enough data about a product to make a recommendation.');
        return;
      }
  
      // Send a message to the background script with the content and API key
      const apiKey = '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'; // Replace with your Groq API key
      chrome.runtime.sendMessage({
        action: 'fetch_recommendation',
        content: contentArray,
        apiKey: apiKey,
        score : score, 
        rateNum : rateNum
      }, (response) => {
        if (response.success) {
          displayRecommendation(response.recommendation);
        } else {
          displayErr(response.message);
        }
      });
    });
  })
        
    }, 3000);
   ;
  });

  document.body.appendChild(button);
}

function displayErr(message) {
  const messageContainer = document.createElement("div");
  messageContainer.id = "recommendation-result";
  messageContainer.textContent = message;

  document.body.appendChild(messageContainer);
  // chrome.storage.local.remove('reviewContents', () => {
  //   console.log('Review content cleared from local storage.');
  // });
  setTimeout(() => {
    messageContainer.remove();
  }, 10000);
  
}

function displayRecommendation(recommendation) {
  const messageContainer = document.createElement("div");
  messageContainer.id = "recommendation-result";
  messageContainer.textContent = recommendation;
  document.body.appendChild(messageContainer);
  chrome.storage.local.remove('reviewContents', () => {
    console.log('Review content cleared from local storage.');
  });
  const closeButton = document.createElement("span");
  closeButton.textContent = "x"; 
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px"; 
  closeButton.style.right = "5px";
  closeButton.style.fontSize = "30px"; 
  closeButton.style.cursor = "pointer"; 
  closeButton.style.color = "aliceblue"; 
  closeButton.style.fontWeight = "bold"; 

  // Add event listener to close the notification when clicked
  closeButton.addEventListener("click", () => {
    messageContainer.remove();
  });
  messageContainer.appendChild(closeButton);
  setTimeout(() => {
    messageContainer.remove();
  }, 10000);

  
}


  injectButton();

  var text = '';

  displayRecommendation('');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    if(message.action === 'show_recommendation') {
      const resultElement = document.querySelector('#recommendation-result');
      // Append the incoming recommendation to the existing text content
      const messageContainer = document.createElement("div");
  messageContainer.id = "recommendation-result";
  messageContainer.textContent  += message.recommendation;
  document.body.appendChild(messageContainer);
      //resultElement.textContent ;
      //text += message.recommendation;
      // document.querySelector('#recommendation-result').textContent = text;
    }
  })