import { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Art = () => {
  const [artworks, setArtworks] = useState([]);
  const [form, setForm] = useState({ title: '', artist: '', description: '', image: '', available: true });
  const [editingId, setEditingId] = useState(null);

  const fetchArt = async () => {
    try { const res = await api.get('/art'); setArtworks(res.data); } catch (e) {}
  };

  useEffect(() => { fetchArt(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/art/${editingId}`, form);
      setEditingId(null);
    } else {
      await api.post('/art', form);
    }
    setForm({ title: '', artist: '', description: '', image: '', available: true });
    fetchArt();
  };

  const handleEdit = (art) => {
    setForm(art);
    setEditingId(art._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this artwork?")) { await api.delete(`/art/${id}`); fetchArt(); }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-rabuste-text mb-8">Art Gallery Management</h1>
      
      <div className="bg-rabuste-surface border border-rabuste-text/5 rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-rabuste-gold uppercase tracking-wider mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={20} /> : <Plus size={20} />} {editingId ? 'Edit Artwork' : 'Add Artwork'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
          <input placeholder="Artist" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} className="input-field" required />
          <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" required />
          <select value={form.available} onChange={e => setForm({...form, available: e.target.value === 'true'})} className="input-field">
            <option value="true">For Sale</option>
            <option value="false">Display Only</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field md:col-span-2 h-24" />
          
          <div className="md:col-span-2 flex gap-4">
            <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({ title: '', artist: '', description: '', image: '', available: true });}} className="px-6 py-3 border border-rabuste-text/20 rounded font-bold uppercase tracking-widest text-rabuste-muted hover:bg-rabuste-text/5">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map(art => (
          <div key={art._id} className="bg-rabuste-surface rounded-lg overflow-hidden border border-rabuste-text/5 hover:border-rabuste-gold/30 transition-all">
            <div className="h-48 overflow-hidden bg-rabuste-bg">
              <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-serif font-bold text-lg text-rabuste-text">{art.title}</h4>
              <p className="text-rabuste-muted text-sm mb-2">by {art.artist}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-rabuste-text/5">
                <span className={`text-xs font-bold px-2 py-1 rounded ${art.available ? 'bg-green-500/10 text-green-500' : 'bg-rabuste-text/10 text-rabuste-muted'}`}>
                  {art.available ? "FOR SALE" : "DISPLAY"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(art)} className="text-blue-500 bg-blue-500/10 p-2 rounded hover:bg-blue-500/20"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(art._id)} className="text-red-500 bg-red-500/10 p-2 rounded hover:bg-red-500/20"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Art;