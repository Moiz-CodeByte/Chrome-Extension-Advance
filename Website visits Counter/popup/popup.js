chrome.storage.local.get('websiteCounters', ({ websiteCounters }) => {
  const countersDiv = document.getElementById('counters');
  for (const website in websiteCounters) {
      const counterElement = document.createElement('p');
      counterElement.textContent = `${website}: ${websiteCounters[website]}`;
      countersDiv.appendChild(counterElement);
  }
});

// Add event listener to clear storage on button click (optional)
// document.getElementById('clearStorageBtn').addEventListener('click', () => {
//   chrome.storage.local.clear();
//   location.reload(); // Reloads the extension popup to reflect cleared data
// });
