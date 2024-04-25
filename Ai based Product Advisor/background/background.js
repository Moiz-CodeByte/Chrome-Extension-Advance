async function getRecommendation(reviewContents) {
    const apiKey = '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';  
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  
    const messages = [
      { role: 'system',
       content: 'You are a review analysis assistant, and i dont need any explanation of the reviews just tell me in two words that the product is recommended or not ,as well as rate the product overall out of 10 based on the reviews that user had provided' },
      {
        role: 'user',
        content: `Based on the following reviews,
                  Reviews: ${reviewContents.join(', ')}`,
      },
    ];
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'mixtral-8x7b-32768',
          temperature: 1,  
          max_tokens: 1024,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from Groq AI.';
      } else {
        return `Error: ${response.status} - ${response.statusText}`;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return 'An error occurred while fetching the recommendation.';
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getRecommendation') {
      getRecommendation(request.reviewContents).then((recommendation) => {
        sendResponse(recommendation);

      });
      return true;
    }
  });
  




//   tell me in two words that the product is recommended or not as well as  rate the product overall out of 10 based on the reviews that user had provided