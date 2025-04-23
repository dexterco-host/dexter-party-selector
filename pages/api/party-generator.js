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
You are a cannabis hospitality expert at Dexter Co. Based on the following inputs, create a custom cannabis party plan in the brand’s tone (Southern charm, cheeky sophistication, no stoner clichés). Include all sections and tailor them to the vibe:

Name: ${name}
State: ${state}
Home Zip: ${homeZip}
Event Zip: ${eventZip}
Guest Count: ${guests}
Party Vibe: ${vibe}
Description: ${description}

Return as JSON with:
{
  partyName,
  description,
  strain,
  effect,
  strainReason,
  gummy,
  servingStyle,
  food,
  winePairings,
  cocktails,
  nonAlcoholicDrinks,
  music,
  scent,
  lighting,
  recommendedProducts
}
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = completion.data.choices[0].message.content;
    const result = JSON.parse(responseText);
    return res.status(200).json(result);
  } catch (err) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ error: 'Something went wrong generating your party plan' });
  }
}

