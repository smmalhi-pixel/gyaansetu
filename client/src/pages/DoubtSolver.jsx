import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/language';

function DoubtSolver() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Namaste beta! Mai Gyaan Guru hoon. Apna koi bhi Maths ya Science ka doubt poocho — CBSE ho ya ICSE, mai Socratic method se guide karunga. Seedha answer nahi milega, sochna padega! 😊" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const board = localStorage.getItem('gyaansetu_board') || 'CBSE';
  const classLevel = localStorage.getItem('gyaansetu_class') || '10';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://gyaansetu-8b44.onrender.com/api/doubt/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          board,
          classLevel,
          userId: 'demo-user'
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Connection problem ho gaya, beta. Thoda wait karo. 🥲" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = true;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + ' ' + finalTranscript);
      }
    };
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 page-enter">
      <header className="bg-orange-500 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Bot size={24} /><div><h1 className="font-bold text-lg">Gyaan Guru</h1><p className="text-xs text-orange-100">{board} Class {classLevel}</p></div></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-orange-500'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><Bot size={16} className="text-white" /></div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder={t('doubtSolver')} className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" disabled={loading} />
          <button onClick={startListening} className={`px-3 py-2.5 rounded-xl ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
          <button onClick={handleSend} disabled={loading || !input.trim()} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}

export default DoubtSolver;