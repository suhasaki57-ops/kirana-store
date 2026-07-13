'use client';
import { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Cat { id:string; name:string; slug:string; emoji:string; items:number; status:'active'|'inactive'; }

const INIT: Cat[] = [
  { id:'1', name:'Grains & Pulses',    slug:'grains-pulses',    emoji:'🌾', items:85,  status:'active' },
  { id:'2', name:'Spices & Masala',    slug:'spices-masala',    emoji:'🌶️', items:120, status:'active' },
  { id:'3', name:'Oils & Ghee',        slug:'oils-ghee',        emoji:'🫙', items:45,  status:'active' },
  { id:'4', name:'Cleaning & Home',    slug:'cleaning-home',    emoji:'🧹', items:70,  status:'active' },
  { id:'5', name:'Personal Care',      slug:'personal-care',    emoji:'🧴', items:95,  status:'active' },
  { id:'6', name:'Snacks & Beverages', slug:'snacks-beverages', emoji:'🍵', items:110, status:'active' },
];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Cat[]>(INIT);
  const [editId, setEditId] = useState<string|null>(null);
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    setCats(p => p.map(c => c.id === id ? { ...c, name: editName } : c));
    setEditId(null);
    toast.success('Category updated');
  };

  const addCategory = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g,'-');
    setCats(p => [...p, { id: Date.now().toString(), name: newName, slug, emoji:'📦', items:0, status:'active' }]);
    setNewName('');
    setAdding(false);
    toast.success('Category added');
  };

  const deleteCategory = (id: string) => {
    setCats(p => p.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          <PlusCircle className="h-4 w-4" /> Add Category
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border bg-white p-4 shadow-sm flex gap-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name"
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          <button onClick={addCategory} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Save</button>
          <button onClick={() => { setAdding(false); setNewName(''); }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Category','Slug','Products','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {cats.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editId === c.id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus
                      onKeyDown={e => e.key === 'Enter' && saveEdit(c.id)}
                      className="rounded-lg border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  ) : (
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-lg">{c.emoji}</span> {c.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 font-semibold">{c.items}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {editId === c.id ? (
                      <button onClick={() => saveEdit(c.id)} className="text-xs font-semibold text-green-700 hover:underline">Save</button>
                    ) : (
                      <button onClick={() => { setEditId(c.id); setEditName(c.name); }}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 hover:bg-blue-50">
                        <Pencil className="h-3.5 w-3.5 text-blue-600" />
                      </button>
                    )}
                    <button onClick={() => deleteCategory(c.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
