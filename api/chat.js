// api/chat.js
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel grabs the secret key from your dashboard
    const mySecretKey = process.env.GEMINI_API_KEY; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${mySecretKey}`;

    // Securely knock on Google's door
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
