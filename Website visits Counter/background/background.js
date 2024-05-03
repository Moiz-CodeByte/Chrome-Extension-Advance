chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const updatedUrl = new URL(changeInfo.url);
    const hostname = updatedUrl.hostname;
    const parts = hostname.split('.');

    let keyword;
    if (parts.length >= 3) {
      keyword = parts[1];
    } else if (parts.length === 2) {
      keyword = parts[0];
    }

    // Check if the session storage contains the keyword
    chrome.storage.session.get('urls', ({ urls: sessionUrls = {} }) => {
      if (!Object.keys(sessionUrls).some((storedUrl) => storedUrl.includes(keyword))) {
        // If the keyword is not in session storage, it's a new session
        chrome.storage.local.get('urls', ({ urls = {} }) => {
          const matchingUrls = Object.keys(urls).filter((storedUrl) => {
            try {
              if (!storedUrl.startsWith('http://') && !storedUrl.startsWith('https://')) {
                storedUrl = 'https://' + storedUrl;
              }

              const storedHostname = new URL(storedUrl).hostname;
              return storedHostname.includes(keyword);
            } catch (e) {
              console.error('Invalid stored URL:', storedUrl);
              return false;
            }
          });

          if (matchingUrls.length > 0) {
            // Increment counts for all matching URLs
            matchingUrls.forEach((matchingUrl) => {
              urls[matchingUrl] = (urls[matchingUrl] || 0) + 1;
            });

            // Store the updated counts in local storage
            chrome.storage.local.set({ urls }, () => {
              console.log('Updated URL counts:', urls);
            });

            // Mark this keyword as visited in this session
            sessionUrls[changeInfo.url] = true;
            chrome.storage.session.set({ urls: sessionUrls });
          }
        });
      }
    });
  }
});
