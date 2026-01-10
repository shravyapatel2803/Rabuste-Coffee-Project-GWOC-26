import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, Bot, Sliders, ToggleLeft, ToggleRight, Loader2, AlertTriangle, Tag } from "lucide-react";import { 
  getAIConfig, updateAIConfig, getAllQAs, createQA, updateQA, deleteQA 
} from "../api/Ai"; 

const AIManagement = () => {
  const [activeTab, setActiveTab] = useState("config"); 
  
  return (
    // Removed outer padding/bg since Layout handles it
    <div className="max-w-6xl mx-auto">
      
      {/* Header aligned with other admin pages */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-rabuste-text">AI & Automation Control</h1>
        <p className="text-rabuste-muted text-sm mt-1">Manage Recommendation Logic and Chatbot Training</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-6 border-b border-rabuste-text/10">
        <button
          onClick={() => setActiveTab("config")}
          className={`pb-3 px-4 flex items-center gap-2 font-bold text-sm transition-colors ${
            activeTab === "config" 
              ? "border-b-2 border-rabuste-orange text-rabuste-orange" 
              : "text-rabuste-muted hover:text-rabuste-text"
          }`}
        >
          <Sliders size={18} /> Logic Configuration
        </button>
        <button
          onClick={() => setActiveTab("training")}
          className={`pb-3 px-4 flex items-center gap-2 font-bold text-sm transition-colors ${
            activeTab === "training" 
              ? "border-b-2 border-rabuste-orange text-rabuste-orange" 
              : "text-rabuste-muted hover:text-rabuste-text"
          }`}
        >
          <Bot size={18} /> Chatbot Training
        </button>
      </div>

      {activeTab === "config" ? <ConfigPanel /> : <TrainingPanel />}
    </div>
  );
};

const ConfigPanel = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await getAIConfig();
      const defaultWeights = { 
        moodWeight: 30, timeWeight: 15, flavorWeight: 20, 
        strengthWeight: 15, bitternessWeight: 10, caffeineWeight: 10 
      };
      
      setConfig({
        isEnabled: data?.isEnabled ?? true,
        config: { ...defaultWeights, ...(data?.config || {}) }
      });
      setError(null);
    } catch (error) {
      console.error("Config load failed", error);
      setError("Failed to load AI Configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAIConfig({ 
        config: config.config, 
        isEnabled: config.isEnabled 
      });
      alert("AI Logic Updated Successfully!");
    } catch {
      alert("Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleSliderChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      config: { ...prev.config, [key]: parseInt(value) || 0 }
    }));
  };

  if (loading) return <div className="p-10 text-center flex justify-center text-rabuste-muted"><Loader2 className="animate-spin mr-2" /> Loading AI Core...</div>;
  
  if (error) return <div className="p-10 text-center text-red-500 bg-red-500/5 rounded-lg border border-red-500/10">{error} <button onClick={fetchConfig} className="ml-2 underline font-bold">Retry</button></div>;

  if (!config) return null;

  const weightKeys = ['moodWeight', 'timeWeight', 'flavorWeight', 'strengthWeight', 'bitternessWeight', 'caffeineWeight'];
  const totalWeight = weightKeys.reduce((sum, key) => sum + (config.config[key] || 0), 0);

  return (
    <div className="bg-rabuste-surface rounded-xl shadow-sm border border-rabuste-text/5 p-8 max-w-3xl">
      
      {/* Master Toggle */}
      <div className="flex justify-between items-center mb-8 bg-rabuste-bg p-4 rounded-lg border border-rabuste-text/5">
        <div>
          <h3 className="font-bold text-rabuste-text">AI Recommendation Engine</h3>
          <p className="text-xs text-rabuste-muted">Master switch to enable/disable AI features on the website.</p>
        </div>
        <button 
          onClick={() => setConfig({ ...config, isEnabled: !config.isEnabled })}
          className={`transition-colors ${config.isEnabled ? "text-green-500" : "text-rabuste-muted"}`}
        >
          {config.isEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
        </button>
      </div>

      {/* Weight Controls */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-rabuste-text/5 pb-2 mb-4">
            <h4 className="font-bold text-rabuste-text">Matching Priorities (Weights)</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded ${totalWeight === 100 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                Total: {totalWeight}% {totalWeight !== 100 && "(Should be 100)"}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <SliderControl 
                label="Mood Match" value={config.config.moodWeight} 
                onChange={(v) => handleSliderChange("moodWeight", v)} desc="Emotional state priority."
            />
            <SliderControl 
                label="Time of Day" value={config.config.timeWeight} 
                onChange={(v) => handleSliderChange("timeWeight", v)} desc="Morning vs Evening logic."
            />
            <SliderControl 
                label="Flavor Profile" value={config.config.flavorWeight} 
                onChange={(v) => handleSliderChange("flavorWeight", v)} desc="Nutty vs Fruity matching."
            />
            <SliderControl 
                label="Strength" value={config.config.strengthWeight} 
                onChange={(v) => handleSliderChange("strengthWeight", v)} desc="Intensity preference."
            />
            <SliderControl 
                label="Bitterness" value={config.config.bitternessWeight} 
                onChange={(v) => handleSliderChange("bitternessWeight", v)} desc="Tolerance for bitter notes."
            />
            <SliderControl 
                label="Caffeine" value={config.config.caffeineWeight} 
                onChange={(v) => handleSliderChange("caffeineWeight", v)} desc="Caffeine kick importance."
            />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-rabuste-text/5 flex justify-between items-center">
        {totalWeight !== 100 && (
            <div className="flex items-center gap-2 text-xs text-orange-500 font-bold bg-orange-500/10 px-3 py-2 rounded-lg">
                <AlertTriangle size={16} /> Weights must sum to 100%
            </div>
        )}
        <button 
            onClick={handleSave}
            disabled={saving}
            className="ml-auto px-6 py-3 bg-rabuste-text text-rabuste-bg rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Algorithm
        </button>
      </div>
    </div>
  );
};

const SliderControl = ({ label, value, onChange, desc }) => (
    <div>
        <div className="flex justify-between mb-1">
            <label className="text-xs font-bold text-rabuste-text uppercase">{label}</label>
            <span className="text-xs font-mono font-bold text-rabuste-orange">{value}%</span>
        </div>
        <input 
            type="range" min="0" max="100" step="5"
            value={value || 0}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-1.5 bg-rabuste-bg rounded-lg appearance-none cursor-pointer accent-rabuste-orange"
        />
        <p className="text-[10px] text-rabuste-muted mt-1">{desc}</p>
    </div>
);

const TrainingPanel = () => {
  const [qas, setQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  
  // Added 'tags' to initial state
  const [formData, setFormData] = useState({ key: "", question: "", answer: "", category: "general", tags: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQAs();
  }, []);

  const fetchQAs = async () => {
    setLoading(true);
    try {
      const { data } = await getAllQAs();
      setQAs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setQAs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert comma-separated tags string to Array for backend
    const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean) // "wifi, pass" -> ["wifi", "pass"]
    };

    try {
      if (editingId) await updateQA(editingId, payload);
      else await createQA(payload);
      
      setFormOpen(false);
      setEditingId(null);
      setFormData({ key: "", question: "", answer: "", category: "general", tags: "" });
      fetchQAs(); 
    } catch  {
      alert("Operation failed. Key must be unique.");
    }
  };

  const handleEdit = (qa) => {
    // Convert Array back to string for Input field
    const tagsString = Array.isArray(qa.tags) ? qa.tags.join(", ") : "";
    setFormData({ 
        key: qa.key, 
        question: qa.question, 
        answer: qa.answer, 
        category: qa.category,
        tags: tagsString 
    });
    setEditingId(qa._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Q&A pair?")) {
      try { await deleteQA(id); fetchQAs(); } catch { alert("Failed to delete"); }
    }
  };

  return (
    <div className="bg-rabuste-surface rounded-xl shadow-sm border border-rabuste-text/5 overflow-hidden max-w-5xl">
      
      <div className="p-6 border-b border-rabuste-text/5 flex justify-between items-center bg-rabuste-bg/50">
        <div>
          <h3 className="font-bold text-rabuste-text">Chatbot Knowledge Base</h3>
          <p className="text-xs text-rabuste-muted">Train the AI with Questions & Keywords (Tags).</p>
        </div>
        <button 
          onClick={() => { setFormOpen(true); setEditingId(null); setFormData({ key: "", question: "", answer: "", category: "general", tags: "" }); }}
          className="bg-rabuste-orange hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Q&A
        </button>
      </div>

      {formOpen && (
        <div className="p-6 border-b border-rabuste-orange/20 bg-rabuste-orange/5 animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-rabuste-muted uppercase mb-1 block">Key (Unique ID)</label>
                <input required type="text" placeholder="wifi_access" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value.replace(/\s+/g, '_').toLowerCase()})} 
                  className="w-full p-2 border border-rabuste-text/10 rounded-lg text-sm focus:ring-2 focus:ring-rabuste-orange bg-rabuste-bg text-rabuste-text outline-none" 
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-rabuste-muted uppercase mb-1 block">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full p-2 border border-rabuste-text/10 rounded-lg text-sm focus:ring-2 focus:ring-rabuste-orange bg-rabuste-bg text-rabuste-text outline-none"
                >
                  <option value="general">General</option>
                  <option value="coffee">Coffee</option>
                  <option value="art">Art</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-rabuste-muted uppercase mb-1 block">Expected User Question</label>
                <input required type="text" placeholder="e.g. What is the wifi password?" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} 
                  className="w-full p-2 border border-rabuste-text/10 rounded-lg text-sm focus:ring-2 focus:ring-rabuste-orange bg-rabuste-bg text-rabuste-text outline-none"
                />
              </div>
            </div>

            {/* NEW TAGS INPUT */}
            <div>
               <label className="text-xs font-bold text-rabuste-muted uppercase mb-1 flex items-center gap-1">
                 <Tag size={12}/> Smart Tags (Keywords)
               </label>
               <input 
                  type="text" 
                  placeholder="e.g. wifi, internet, connect, password (comma separated)" 
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})} 
                  className="w-full p-2 border border-rabuste-text/10 rounded-lg text-sm focus:ring-2 focus:ring-rabuste-orange bg-rabuste-bg text-rabuste-text outline-none placeholder:text-gray-400"
               />
               <p className="text-[10px] text-rabuste-muted mt-1">Chatbot uses these keywords to find this answer even if the question doesn't match exactly.</p>
            </div>
            
            <div>
              <label className="text-xs font-bold text-rabuste-muted uppercase mb-1 block">AI Answer</label>
              <textarea required rows="2" placeholder="Bot response..." value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} 
                className="w-full p-2 border border-rabuste-text/10 rounded-lg text-sm focus:ring-2 focus:ring-rabuste-orange bg-rabuste-bg text-rabuste-text outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm text-rabuste-muted hover:text-rabuste-text font-bold">Cancel</button>
              <button type="submit" className="bg-rabuste-text hover:bg-black text-rabuste-bg px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE VIEW */}
      {loading ? (
        <div className="p-10 flex justify-center text-rabuste-muted"><Loader2 className="animate-spin mr-2" /> Loading Data...</div>
      ) : (
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-rabuste-bg/50 text-xs text-rabuste-muted uppercase tracking-wider border-b border-rabuste-text/5 sticky top-0">
              <tr>
                <th className="p-4 font-bold">Concept (Key / Tags)</th>
                <th className="p-4 font-bold">Q&A</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rabuste-text/5 text-sm">
              {qas.map(qa => (
                <tr key={qa._id} className="hover:bg-rabuste-bg/50 transition-colors group">
                  <td className="p-4 align-top w-1/3">
                    <div className="font-mono text-xs text-rabuste-muted bg-rabuste-bg px-1.5 py-0.5 rounded inline-block mb-1">{qa.key}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {qa.tags && qa.tags.map((t, i) => (
                            <span key={i} className="text-[10px] bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded border border-orange-500/20">{t}</span>
                        ))}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold text-rabuste-text mb-1">Q: {qa.question}</div>
                    <div className="text-rabuste-muted">A: {qa.answer}</div>
                  </td>
                  <td className="p-4 text-right align-top w-24">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(qa)} className="text-blue-500 p-1.5 hover:bg-blue-500/10 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(qa._id)} className="text-red-500 p-1.5 hover:bg-red-500/10 rounded"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {qas.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-rabuste-muted">No data found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AIManagement;