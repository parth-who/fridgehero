// netlify/functions/chat.js
exports.handler = async function(event, context) {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // 2. Grab the key from Netlify's secure environment variables
    const mySecretKey = process.env.GEMINI_API_KEY; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${mySecretKey}`;

    // Netlify sends the body as a string, so we must parse it into JSON
    const payload = JSON.parse(event.body);

    // 3. Securely knock on Google's door
    const aiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });

    const data = await aiResponse.json();

    // 4. Send the recipe back to your frontend
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Something went wrong' }) 
    };
  }
};