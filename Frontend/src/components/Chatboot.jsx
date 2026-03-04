import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RiSendPlaneFill, RiRobot2Line, RiUserLine, RiDeleteBin6Line, RiSparklingLine, RiLoaderLine } from "react-icons/ri";

const GEMINI_API_KEY = "w"; // 🔑 Yahan apni key daalo

async function callGemini(messages) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Pehle user message tak sab skip karo (AI welcome message ignore)
  const allPrev = messages.slice(0, -1);
  const firstUserIndex = allPrev.findIndex((m) => m.role === "user");
  const validHistory = firstUserIndex === -1 ? [] : allPrev.slice(firstUserIndex).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const chat = model.startChat({ history: validHistory });
  const lastMsg = messages[messages.length - 1].text;
  const result = await chat.sendMessage(lastMsg);
  return result.response.text();
}

export default function Chatboot() {
  const [messages, setMessages] = useState([
    { role: "model", text: "Assalam-o-Alaikum! 👋 Main aapka AI assistant hoon. Kuch poochhna chahte hain?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const reply = await callGemini(updated);
      setMessages([...updated, { role: "model", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...updated, { role: "model", text: "❌ Error: API call fail ho gayi. Key check karein." }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{ role: "model", text: "Chat clear ho gayi! Dobara shuru karein 🚀" }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl flex flex-col h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/20 backdrop-blur-xl bg-slate-900/80">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600/30 to-violet-600/20 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <RiSparklingLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Gemini AI Chat</h1>
              <p className="text-indigo-300 text-xs">Powered by Google Gemini 2.0</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-indigo-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            title="Chat saaf karein"
          >
            <RiDeleteBin6Line className="text-xl" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-indigo-500 to-violet-600"}`}>
                {msg.role === "user" ? <RiUserLine className="text-white text-sm" /> : <RiRobot2Line className="text-white text-sm" />}
              </div>
              {/* Bubble */}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-sm"
                  : "bg-slate-800/80 text-slate-100 border border-indigo-500/10 rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <RiRobot2Line className="text-white text-sm" />
              </div>
              <div className="bg-slate-800/80 border border-indigo-500/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                <RiLoaderLine className="text-indigo-400 text-lg animate-spin" />
                <span className="text-indigo-300 text-sm">Soch raha hoon...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-indigo-500/20 bg-slate-900/60">
          <div className="flex items-center gap-3 bg-slate-800/80 border border-indigo-500/20 rounded-2xl px-4 py-2 focus-within:border-indigo-500/60 transition-all duration-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Kuch poochhein... (Enter dabayein)"
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none py-1"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white hover:from-indigo-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/20 flex-shrink-0"
            >
              <RiSendPlaneFill className="text-base" />
            </button>
          </div>
          <p className="text-center text-slate-600 text-xs mt-2">Google Gemini 2.0 Flash</p>
        </div>

      </div>
    </div>
  );
}