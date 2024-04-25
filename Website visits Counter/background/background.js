let websites = [ 
  "https://afluencer.com", 
  "https://ads.microsoft.com",  
  "https://www.adobe.com",
  "https://stackoverflow.com",
  "https://keep.google.com",
  "https://www.producthunt.com",
  "https://dribbble.com",
  "https://www.designernews.co",
  "https://www.indiehackers.com",
  "https://dev.to"
]; 

chrome.runtime.onInstalled.addListener(() => {
  initializeCounters();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
      updateCounter(tab.url);
  }
});

function initializeCounters() {
  let websiteCounters = {};
  websites.forEach(website => {
      websiteCounters[website] = 0;
  });
  chrome.storage.local.set({ websiteCounters });
}

function updateCounter(url) {
  let domain = (new URL(url)).origin;

  if (!websites.includes(domain)) {
      return; // Skip counting if the domain is not in the specified websites
  }

  chrome.storage.local.get('websiteCounters', ({ websiteCounters }) => {
      if (websiteCounters.hasOwnProperty(domain)) {
          websiteCounters[domain]++;
      } else {
          websiteCounters[domain] = 1;
      }
      chrome.storage.local.set({ websiteCounters }, () => {
          console.log(`Counter for ${domain}: ${websiteCounters[domain]}`);
      });
  });
}
