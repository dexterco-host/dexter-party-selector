import { OpenAI } from 'openai';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendPromptToAI(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    const aiMessage = response.choices[0].message.content;

    await addDoc(collection(db, 'ai_logs'), {
      conversationSummary: messages.map(m => m.content).join('\n'),
      aiResponse: aiMessage,
      createdAt: serverTimestamp(),
      origin: 'WEB'
    });

    return aiMessage;
  } catch (error) {
    console.error('AI Error:', error);
    return "Oops! Something went wrong. Try again.";
  }
}
