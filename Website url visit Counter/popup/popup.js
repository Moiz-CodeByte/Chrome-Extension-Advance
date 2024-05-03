document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('new-url');
  const addButton = document.getElementById('add-url');
  const urlList = document.getElementById('url-list');

  // Function to load the current URL counts
  const loadUrls = () => {
    chrome.storage.local.get('urls', ({ urls = {} }) => {
      urlList.innerHTML = ''; // Clear existing list
      for (const [url, count] of Object.entries(urls)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${url}: ${count}`;
        urlList.appendChild(listItem);
      }
    });
  };

  // Add URL to the storage and reload the list
  addButton.addEventListener('click', () => {
    const newUrl = urlInput.value.trim();
    if (newUrl) {
      chrome.storage.local.get('urls', ({ urls = {} }) => {
        urls[newUrl] = urls[newUrl] || 0;
        chrome.storage.local.set({ urls }, () => {
          urlInput.value = ''; // Clear the input
          loadUrls(); // Reload the URL list
        });
      });
    }
  });

  // Initial load of URLs
  loadUrls();
});
