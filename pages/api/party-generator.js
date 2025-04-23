import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, guests, state, homeZip, eventZip, vibe, description } = req.body;

  if (!name || !guests || !state || !vibe || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `
You are a cannabis party planning assistant for Dexter Co. Create a themed party plan with the following details:
- Host name: ${name}
- Email: ${email}
- Guests: ${guests}
- State: ${state}
- Home Zip: ${homeZip}
- Event Zip: ${eventZip}
- Party Vibe: ${vibe}
- Description: ${description}

Your response should include:
1. A clever name for the party
2. A short paragraph describing the theme
3. Recommended House of Kush cannabis strain (based on state and vibe)
4. A brief explanation of why that strain works
5. Gummy pairing suggestion
6. Serving style (tray, glass, etc.)
7. Food suggestion
8. Two wine pairings (one red, one white)
9. Two cocktails
10. Two non-alcoholic drinks
11. Music playlist theme
12. Scent recommendation (candles/incense)
13. Lighting vibe (e.g., warm, colorful, soft)
14. Any recommended Dexter Co. product presentation ideas (linked if possible)

Tone: Refined, cheeky, Southern Hospitality meets boutique cannabis concierge.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.data.choices[0].message.content;
    res.status(200).json({ plan: result });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'Failed to generate party plan' });
  }
}
