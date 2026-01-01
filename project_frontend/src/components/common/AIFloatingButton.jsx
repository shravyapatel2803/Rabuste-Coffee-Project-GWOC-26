import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Coffee, X, Send, Loader2, Sparkles, Bot, ArrowRight, Palette, SlidersHorizontal } from "lucide-react";
import { chatWithAI, getRecommendations, getAIFilters } from "../../api/ai.api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AIFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); 
 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return ( 
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onWheel={(e) => e.stopPropagation()}
            className="mb-4 w-[350px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[min(700px,80vh)] overscroll-contain"
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rabuste Coffee Assistance</h3>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> AI Powered
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X size={18} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 shrink-0">
              <button onClick={() => setActiveTab("chat")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "chat" ? "text-orange-600 border-b-2 border-orange-600 bg-white" : "text-gray-500 hover:bg-white/50"}`}>
                <MessageSquare size={16} /> Chat
              </button>
              <button onClick={() => setActiveTab("recommend")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "recommend" ? "text-orange-600 border-b-2 border-orange-600 bg-white" : "text-gray-500 hover:bg-white/50"}`}>
                <SlidersHorizontal size={16} /> Find My Coffee
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-white relative isolation-auto">
              {activeTab === "chat" ? <ChatView /> : <RecommendationView />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button onClick={() => setIsOpen(!isOpen)} className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen ? "bg-gray-800 rotate-90" : "bg-orange-600 hover:bg-orange-700"} text-white`}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

// chat view
const ChatView = () => {
    const [messages, setMessages] = useState([
      { id: 1, text: "Hello! I'm your Rabuste Coffee Assistance. Ask me about our Robusta  menu, arts, or upcoming workshops!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
  
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const handleSend = async (e) => {
      e.preventDefault();
      if (!input.trim()) return;
  
      const userMsg = { id: Date.now(), text: input, sender: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
  
      try {
        const { data } = await chatWithAI(input);
        const botMsg = { 
          id: Date.now() + 1, 
          text: data.data?.answer || "I'm still learning! You can ask our staff or check the menu.", 
          sender: "bot" 
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch  {
        const errorMsg = { id: Date.now() + 1, text: "My brain froze. Please try again.", sender: "bot" };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full scroll-smooth" style={{ overscrollBehavior: 'contain' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-orange-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm"><Loader2 size={16} className="animate-spin text-orange-600" /></div></div>}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          <button type="submit" disabled={loading || !input.trim()} className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"><Send size={18} /></button>
        </form>
      </div>
    );
  };


  // reccomendation view
const RecommendationView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [results, setResults] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [options, setOptions] = useState({ moods: [], times: [], flavors: [] });

  const [prefs, setPrefs] = useState({
    mood: "", time: "", flavor: "",
    strength: "", bitterness: "", caffeine: ""
  });

  // Load Filters
  useEffect(() => {
    const loadData = async () => {
        try {
            const { data } = await getAIFilters();
            setOptions({ 
                moods: data.data.moods.length ? data.data.moods : ["Focused", "Energetic", "Calm", "Cozy"],
                times: data.data.times.length ? data.data.times : ["Morning", "Evening"],
                flavors: data.data.flavors.length ? data.data.flavors : []
            });
        } catch(e) { console.error(e); } finally { setFilterLoading(false); }
    };
    loadData();
  }, []);

  const handleRecommend = async () => {
    const hasSelection = Object.values(prefs).some(val => val !== "");
    if (!hasSelection) { setError("Please select at least one preference!"); return; }

    setLoading(true); setError("");
    try {
      const { data } = await getRecommendations(prefs);
      if(data.data?.length) { setResults(data.data); setSuggestion(data.suggestion); setStep(2); } 
      else { setError("No matches found. Try relaxing filters."); }
    } catch { setError("Service unavailable."); } finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setResults([]); setPrefs({ mood:"", time:"", flavor:"", strength:"", bitterness:"", caffeine:"" }); };

  const TasteSelector = ({ label, value, onChange }) => {
    const choices = [
      { label: "Low", val: "1" },
      { label: "Medium", val: "3" },
      { label: "High", val: "5" }
    ];

    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            {label}
        </label>
        <div className="flex gap-2">
          {choices.map((choice) => (
            <button
              key={choice.label}
              onClick={() => onChange(value === choice.val ? "" : choice.val)} // Toggle logic
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all duration-200 ${
                value === choice.val 
                  ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
              }`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="h-full flex flex-col items-center justify-center space-y-3"><Coffee size={48} className="text-orange-500 animate-bounce"/><p className="text-sm font-bold animate-pulse text-gray-500">Brewing your match...</p></div>;

  if (step === 2) {
    return (
      <div className="h-full flex flex-col p-4 overflow-y-auto w-full" style={{ overscrollBehavior: 'contain' }}>
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h4 className="font-bold text-gray-800">Perfect Matches</h4>
          <button onClick={reset} className="text-xs text-orange-600 font-bold hover:underline">Edit Filters</button>
        </div>
        <div className="space-y-4 pb-4">
            {results.map((coffee) => (
                <div key={coffee._id} onClick={() => navigate(`/menu/${coffee.slug}`)} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex gap-3 hover:border-orange-300 transition-all cursor-pointer group relative overflow-hidden">
                    <img src={coffee.image?.url} alt={coffee.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h5 className="font-bold text-gray-800 text-sm truncate pr-2">{coffee.name}</h5>
                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold whitespace-nowrap">{Math.round(coffee.score)}% Match</span>
                        </div>
                        <p className="text-[10px] text-gray-500 italic border-l-2 border-orange-400 pl-2 mb-2 line-clamp-2">"{coffee.matchReason}"</p>
                        <div className="flex justify-between items-center mt-auto"><span className="text-orange-600 font-bold text-xs">₹{coffee.price}</span><button className="bg-gray-900 text-white p-1 rounded-md group-hover:bg-orange-600 transition-colors"><ArrowRight size={12}/></button></div>
                    </div>
                </div>
            ))}
            
            {suggestion && (
               <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                   <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-purple-600"/>
                        <span className="text-xs font-bold text-gray-500 uppercase">Pairing Suggestion</span>
                   </div>
                   <div 
                        onClick={() => navigate(`/art/${suggestion.data.slug}`)}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100 flex gap-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
                   >
                       {suggestion.data.image && (
                           <img src={suggestion.data.image.url} className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                       )}
                       <div>
                           <p className="text-[10px] font-bold text-purple-600 uppercase mb-1 flex items-center gap-1">{suggestion.message}</p>
                           <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{suggestion.data.title}</h5>
                           <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 bg-white/50 w-fit px-2 py-0.5 rounded-full">
                                <Palette size={10}/>
                                <span className="uppercase font-bold tracking-wide">View Art</span>
                           </div>
                       </div>
                   </div>
               </div>
            )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto w-full" style={{ overscrollBehavior: 'contain' }}>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100">{error}</div>}
      
      <div className="space-y-6">
        
        {/* Moods */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">Mood {filterLoading && <Loader2 size={10} className="animate-spin"/>}</label>
          <div className="flex flex-wrap gap-2">
            {options.moods.length > 0 ? options.moods.map(m => (
              <button key={m} onClick={() => setPrefs({...prefs, mood: prefs.mood === m ? "" : m})} 
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${prefs.mood === m ? "bg-orange-500 text-white border-orange-500 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
                {m}
              </button>
            )) : <span className="text-xs text-gray-400">Loading...</span>}
          </div>
        </div>

        {/* Times */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Best Time</label>
          <div className="grid grid-cols-2 gap-2">
            {options.times.length > 0 ? options.times.map(t => (
              <button key={t} onClick={() => setPrefs({...prefs, time: prefs.time === t ? "" : t})} 
                className={`px-3 py-2 rounded-lg text-xs font-bold border text-center transition-all ${prefs.time === t ? "bg-orange-500 text-white border-orange-500 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
                {t}
              </button>
            )) : <span className="text-xs text-gray-400">Loading...</span>}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-5">
            <TasteSelector label="Strength Level" value={prefs.strength} onChange={(val) => setPrefs({...prefs, strength: val})} />
            <TasteSelector label="Bitterness Level" value={prefs.bitterness} onChange={(val) => setPrefs({...prefs, bitterness: val})} />
            <TasteSelector label="Caffeine Level" value={prefs.caffeine} onChange={(val) => setPrefs({...prefs, caffeine: val})} />
        </div>

        {/* Flavor Notes */}
        {options.flavors.length > 0 && (
            <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Flavor Notes</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {options.flavors.map(f => (
                <button key={f} onClick={() => setPrefs({...prefs, flavor: prefs.flavor === f ? "" : f})} 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${prefs.flavor === f ? "bg-stone-700 text-white border-stone-700" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
                    {f}
                </button>
                ))}
            </div>
            </div>
        )}

        <button onClick={handleRecommend} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2">
          <Sparkles size={16} /> Find My Coffee
        </button>
      </div>
    </div>
  );
};

export default AIFloatingButton;