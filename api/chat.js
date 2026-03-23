// api/chat.js
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Notice how we use the NAME of the variable, not the actual key!
    const mySecretKey = process.env.GEMINI_API_KEY; 
    
    // 2. Pointing to Google Gemini, not OpenRouter
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${mySecretKey}`;

    const aiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.body) 
    });

    const data = await aiResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: 'Something went wrong' });
  }
}