import { useState, useEffect } from 'react';
import api from '../api/api';
import { Calendar, Trash2, Edit2 } from 'lucide-react';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', price: 0, active: true });
  const [editingId, setEditingId] = useState(null);

  const fetchWorkshops = async () => { try { const res = await api.get('/workshops'); setWorkshops(res.data); } catch (e) {} };
  useEffect(() => { fetchWorkshops(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editingId) { await api.put(`/workshops/${editingId}`, form); setEditingId(null); } 
    else { await api.post('/workshops', form); }
    setForm({ title: '', description: '', date: '', price: 0, active: true });
    fetchWorkshops();
  };

  const handleEdit = (ws) => {
    setForm(ws);
    setEditingId(ws._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStatus = async (ws) => { await api.put(`/workshops/${ws._id}`, { active: !ws.active }); fetchWorkshops(); };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-rabuste-text mb-8">Workshops</h1>
      
      <div className="bg-rabuste-surface border border-rabuste-text/5 rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-rabuste-gold uppercase tracking-wider mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={20} /> : <Calendar size={20} />} {editingId ? 'Edit Event' : 'Create Event'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field md:col-span-2 h-24" required />
          
          <div className="md:col-span-2 flex gap-4">
            <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({ title: '', description: '', date: '', price: 0, active: true });}} className="px-6 py-3 border border-rabuste-text/20 rounded font-bold uppercase tracking-widest text-rabuste-muted hover:bg-rabuste-text/5">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {workshops.map(ws => (
          <div key={ws._id} className="bg-rabuste-surface p-5 rounded-lg border border-rabuste-text/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-serif font-bold text-xl text-rabuste-text">{ws.title}</h4>
              <p className="text-rabuste-muted text-sm mt-1">{ws.date} | {ws.price === 0 ? "Free Entry" : `₹${ws.price}`}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button onClick={() => toggleStatus(ws)} className={`flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${ws.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {ws.active ? "Active" : "Cancelled"}
              </button>
              <button onClick={() => handleEdit(ws)} className="text-blue-500 bg-blue-500/10 p-2 rounded hover:bg-blue-500/20"><Edit2 size={20} /></button>
              <button onClick={() => {if(confirm("Delete?")) api.delete(`/workshops/${ws._id}`).then(fetchWorkshops)}} className="text-red-500 bg-red-500/10 p-2 rounded hover:bg-red-500/20"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workshops;