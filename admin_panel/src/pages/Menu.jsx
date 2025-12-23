import { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Eye, EyeOff, Edit2 } from 'lucide-react';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'coffee',
    image: { url: '' }, availability: { isAvailable: true }
  });
  const [editingId, setEditingId] = useState(null); // Track if editing

  const fetchItems = async () => {
    try {
      const res = await api.get('/admin/items');
      setItems(res.data);
    } catch (err) { console.error("Failed to fetch items"); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE Existing Item
        await api.put(`/admin/items/${editingId}`, form);
        setEditingId(null);
      } else {
        // CREATE New Item
        await api.post('/admin/items', form);
      }
      // Reset Form
      setForm({ name: '', description: '', price: '', category: 'coffee', image: { url: '' }, availability: { isAvailable: true } });
      fetchItems();
    } catch (error) { alert("Error saving item"); }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: { url: item.image.url },
      availability: item.availability
    });
    setEditingId(item._id);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this item?")) {
      await api.delete(`/admin/items/${id}`);
      fetchItems();
    }
  };

  const toggleStatus = async (item) => {
    await api.put(`/admin/items/${item._id}`, {
      ...item, availability: { isAvailable: !item.availability.isAvailable }
    });
    fetchItems();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-rabuste-text mb-8">Menu Management</h1>

      <div className="bg-rabuste-surface border border-rabuste-text/5 rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-rabuste-gold uppercase tracking-wider mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={20} /> : <Plus size={20} />} 
          {editingId ? 'Edit Item' : 'Add New Item'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input placeholder="Item Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="input-field" required />
          <input type="number" placeholder="Price (INR)" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="input-field" required />
          <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="input-field">
            <option value="coffee">Coffee</option>
            <option value="beans">Beans</option>
            <option value="special">Special</option>
          </select>
          <input placeholder="Image URL" value={form.image.url} onChange={e=>setForm({...form, image: {url: e.target.value}})} className="input-field" />
          <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="input-field md:col-span-2 h-24" />
          
          <div className="md:col-span-2 flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              {editingId ? 'Update Item' : 'Add to Menu'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: 'coffee', image: { url: '' }, availability: { isAvailable: true } }); }}
                className="px-6 py-3 border border-rabuste-text/20 rounded font-bold uppercase tracking-widest text-rabuste-muted hover:bg-rabuste-text/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-rabuste-surface p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between border border-rabuste-text/5 hover:border-rabuste-gold/30 transition-all gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-rabuste-bg rounded overflow-hidden flex-shrink-0">
                <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-rabuste-text">{item.name}</h4>
                <p className="text-rabuste-muted text-sm">{item.category} | ₹{item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button onClick={() => toggleStatus(item)} className={`p-2 rounded ${item.availability.isAvailable ? 'text-green-500 bg-green-500/10' : 'text-rabuste-muted bg-rabuste-text/5'}`} title="Toggle Visibility">
                {item.availability.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 rounded" title="Edit Item">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded" title="Delete Item">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;