chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "extractValues") {
     var text = document.body.innerText; 
      chrome.storage.local.set({ key: text }).then(() => { console.log("Data is stored" + text); });  
      chrome.storage.local.get(["key"]).then((result) => { console.log("Data is " + result.key); }); 

    }
    // const extractText = () => {
    //   // Collect text from the active tab
    //   const bodyText = document.body.innerText;
  
    //   // Send the text back to the background script or popup
    //   chrome.runtime.sendMessage({ text: bodyText });
    // };
  
    // extractText();

});