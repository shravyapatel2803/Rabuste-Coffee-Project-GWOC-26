import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, Bot, Sliders, ToggleLeft, ToggleRight, Loader2, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";
import { 
  getAIConfig, updateAIConfig,getAllQAs, createQA, updateQA, deleteQA 
} from "../api/Ai"; 
import { useNavigate } from "react-router-dom";

const AIManagement = () => {
  const [activeTab, setActiveTab] = useState("config"); 
  const navigate = useNavigate(); 
  
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      
      <div className="mb-8 flex items-start gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="mt-1 p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI & Automation Control</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Recommendation Logic and Chatbot Training</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("config")}
          className={`pb-3 px-4 flex items-center gap-2 font-bold text-sm transition-colors ${
            activeTab === "config" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sliders size={18} /> Logic Configuration
        </button>
        <button
          onClick={() => setActiveTab("training")}
          className={`pb-3 px-4 flex items-center gap-2 font-bold text-sm transition-colors ${
            activeTab === "training" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500 hover:text-gray-700"
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
        ...data,
        config: { ...defaultWeights, ...data.config }
      });
    } catch (error) {
      console.error("Config load failed", error);
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
      config: { ...prev.config, [key]: parseInt(value) }
    }));
  };

  // Calculate Total Weight to warn user
  const totalWeight = config?.config ? Object.values(config.config).reduce((a, b) => a + b, 0) : 0;

  if (loading) return <div className="p-10 text-center flex justify-center text-gray-500"><Loader2 className="animate-spin mr-2" /> Loading AI Core...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl">
      
      {/* Master Toggle */}
      <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800">AI Recommendation Engine</h3>
          <p className="text-xs text-gray-500">Master switch to enable/disable AI features on the website.</p>
        </div>
        <button 
          onClick={() => setConfig({ ...config, isEnabled: !config.isEnabled })}
          className={`transition-colors ${config.isEnabled ? "text-green-600" : "text-gray-400"}`}
        >
          {config.isEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
        </button>
      </div>

      {/* Weight Controls */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-2 mb-4">
            <h4 className="font-bold text-gray-700">Matching Priorities (Weights)</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded ${totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                Total: {totalWeight}% {totalWeight !== 100 && "(Should be 100)"}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Mood */}
            <SliderControl 
                label="Mood Match Priority" 
                value={config.config.moodWeight} 
                onChange={(v) => handleSliderChange("moodWeight", v)} 
                desc="How important is the user's emotional state?"
            />
            
            {/* Time */}
            <SliderControl 
                label="Time of Day Priority" 
                value={config.config.timeWeight} 
                onChange={(v) => handleSliderChange("timeWeight", v)} 
                desc="Importance of Morning vs Evening logic."
            />

            {/* Flavor */}
            <SliderControl 
                label="Flavor Note Priority" 
                value={config.config.flavorWeight} 
                onChange={(v) => handleSliderChange("flavorWeight", v)} 
                desc="Importance of Nutty, Fruity, etc. matching."
            />

            {/* Strength */}
            <SliderControl 
                label="Strength Priority" 
                value={config.config.strengthWeight} 
                onChange={(v) => handleSliderChange("strengthWeight", v)} 
                desc="Importance of Low/Med/High Strength preference."
            />

            {/* Bitterness */}
            <SliderControl 
                label="Bitterness Priority" 
                value={config.config.bitternessWeight} 
                onChange={(v) => handleSliderChange("bitternessWeight", v)} 
                desc="Importance of Bitterness tolerance."
            />

            {/* Caffeine */}
            <SliderControl 
                label="Caffeine Priority" 
                value={config.config.caffeineWeight} 
                onChange={(v) => handleSliderChange("caffeineWeight", v)} 
                desc="Importance of Caffeine kick preference."
            />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        {totalWeight !== 100 && (
            <div className="flex items-center gap-2 text-xs text-orange-600 font-bold bg-orange-50 px-3 py-2 rounded-lg">
                <AlertTriangle size={16} /> Weights do not sum to 100%. Results might be skewed.
            </div>
        )}
        <button 
            onClick={handleSave}
            disabled={saving}
            className="ml-auto px-6 py-3 bg-gray-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-colors"
        >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Algorithm
        </button>
      </div>
    </div>
  );
};

// Helper Component for Sliders
const SliderControl = ({ label, value, onChange, desc }) => (
    <div>
        <div className="flex justify-between mb-1">
            <label className="text-xs font-bold text-gray-700 uppercase">{label}</label>
            <span className="text-xs font-mono font-bold text-orange-600">{value}%</span>
        </div>
        <input 
            type="range" min="0" max="100" step="5"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
    </div>
);


const TrainingPanel = () => {
  const [qas, setQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ key: "", question: "", answer: "", category: "general" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQAs();
  }, []);

  const fetchQAs = async () => {
    setLoading(true);
    try {
      const { data } = await getAllQAs();
      setQAs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateQA(editingId, formData);
      } else {
        await createQA(formData);
      }
      setFormOpen(false);
      setEditingId(null);
      setFormData({ key: "", question: "", answer: "", category: "general" });
      fetchQAs(); 
    } catch  {
      alert("Operation failed. Key must be unique.");
    }
  };

  const handleEdit = (qa) => {
    setFormData({ key: qa.key, question: qa.question, answer: qa.answer, category: qa.category });
    setEditingId(qa._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Q&A pair?")) {
      try {
        await deleteQA(id);
        fetchQAs();
      } catch  {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="font-bold text-gray-800">Chatbot Knowledge Base</h3>
          <p className="text-xs text-gray-500">Train the AI to answer common questions.</p>
        </div>
        <button 
          onClick={() => { setFormOpen(true); setEditingId(null); setFormData({ key: "", question: "", answer: "", category: "general" }); }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Q&A
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="p-6 border-b border-orange-100 bg-orange-50/50 animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Key (ID)</label>
                <input required type="text" placeholder="wifi_pass" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value.replace(/\s+/g, '_').toLowerCase()})} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                >
                  <option value="general">General</option>
                  <option value="coffee">Coffee</option>
                  <option value="art">Art</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">User Question</label>
                <input required type="text" placeholder="e.g. What is the wifi password?" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">AI Answer</label>
              <textarea required rows="2" placeholder="Bot response..." value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancel</button>
              <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-10 flex justify-center text-gray-500"><Loader2 className="animate-spin mr-2" /> Loading Data...</div>
      ) : (
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0">
              <tr>
                <th className="p-4 font-bold">Question / Key</th>
                <th className="p-4 font-bold">Answer</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {qas.map(qa => (
                <tr key={qa._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 align-top w-1/3">
                    <div className="font-bold text-gray-800">{qa.question}</div>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono mt-1 inline-block">{qa.key}</span>
                    <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">{qa.category}</span>
                  </td>
                  <td className="p-4 text-gray-600 align-top">
                    {qa.answer}
                  </td>
                  <td className="p-4 text-right align-top w-24">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(qa)} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(qa._id)} className="text-red-600 p-1.5 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {qas.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-400">No data found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AIManagement;