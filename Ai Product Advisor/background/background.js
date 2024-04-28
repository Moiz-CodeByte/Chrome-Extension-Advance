chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetch_recommendation') {
    const messages = [
      { role: 'system',
       content: 'Analyze the last three reviews for a product and its overall user rating. Provide a two-word recommendation (e.g., "Highly Recommended") and a rating out of 10. Only give the short answer."' },
      {
        role: 'user',
        content: `Based on the following reviews, rating and total number of reviews, please provide a two-word recommendation and a rating out of 10:
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
      }),
    })
      .then(response => response.json())
      .then(data => {
        const recommendation = data.choices[0].message.content;
        sendResponse({ success: true, recommendation });
      })
      .catch(error => {
        console.error('Error while fetching recommendation:', error);
        sendResponse({ success: false, message: 'Failed to fetch recommendation.' });
      });
    return true; // To keep the messaging channel open until we send a response
  }
});
