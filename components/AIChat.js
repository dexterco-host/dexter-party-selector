import { useState } from 'react';
import { sendPromptToAI } from '../lib/ai';

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const aiResponse = await sendPromptToAI(updatedMessages);
    setMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-4">
      <div className="flex-1 overflow-y-scroll space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-lg ${
              msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Dexter is typing…</div>}
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 border p-2 rounded-xl mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your party…"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-xl"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
