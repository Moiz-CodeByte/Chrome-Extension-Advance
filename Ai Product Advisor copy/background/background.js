chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetch_recommendation') {
    const messages = [
      { role: 'system',
       content: 'Analyze the last three reviews for a product and its overall user rating. Provide a two-word recommendation (e.g., "Highly Recommended") and a rating out of 10. Only give the short answer."' },
      {
        role: 'user',
        content: `Based on the following reviews, rating and total number of reviews, please provide a two-word recommendation and a rating out of 10 only:
                  Reviews: ${request.content.join('\n')}, 
                  Rating: ${request.score},
                  total number of reviews: ${request.rateNum}`
                  ,
      },
    ]
    // Send the content to the Groq API
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + request.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'mixtral-8x7b-32768',
        temperature: 1.2,  
        max_tokens: 1024,
        stream: true,
      }),
    })
    .then(response => {
      // Get the readable stream from the response body
      const stream = response.body;
      // Get the reader from the stream
      const reader = stream.getReader();
      // Define a function to read each chunk
      const readChunk = () => {
          // Read a chunk from the reader
          reader.read()
              .then(({
                  value,
                  done
              }) => {
                  // Check if the stream is done
                  if (done) {
                      // Log a message
                      console.log('Stream finished');
                      // Return from the function
                      return;
                  }
                  // Convert the chunk value to a string
                  let chunkString = new TextDecoder().decode(value);
                  // Log the chunk string
                  

                  // var parsedResponse = null;
                  // try {
                    console.log(chunkString);
                  //   chunkString = chunkString.replaceAll('data: ','');
                  //   console.log(chunkString);
                  //   chunkString = chunkString.split('/n');
                  //   console.log(chunkString);
                  //   chunkString.forEach((res) => {
                  //     console.log(res);
                  //     parsedResponse = JSON.parse(res.trim());
                  //     sendToTab(parsedResponse?.choices[0]?.delta?.content ?? '')
                  //   });
                  // } catch (error) {
                  //   console.error('Error parsing JSON:', error);
                  //   return;
                  // }

                  sendToTab(chunkString);
                  

                  // sendResponse({success: true, recommendation: chunkString});
                  // Read the next chunk
                  readChunk();
              })
              .catch(error => {
                  // Log the error
                  console.error(error);
              });
      };
      // Start reading the first chunk
      readChunk();
  })
  .catch(error => {
      // Log the error
      console.error(error);
  });
  return true;
}})
  // //     .then(response =>
  // //       response.text())
  // //     .then(data => {
  // //       console.log('Raw response body:', data);
  // //       //const jsonData = JSON.parse(data);
  // //       //const recommendation = jsonData.choices[0].message.content;
  // //       const recommendation = response.text();
  // //       sendResponse({ success: true, recommendation });
  // //     })
  // //     .catch(error => {
  // //       console.error('Error while fetching recommendation:', error);
  // //       sendResponse({ success: false, message: 'Failed to fetch recommendation.' });
  // //     });
  // //   return true; 
  // // }
  // return true;
  // }

  function sendToTab (text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log(tabs, text)
      chrome.tabs.sendMessage(tabs[0].id, {action: 'show_recommendation', recommendation: text});
    });
  }
  
