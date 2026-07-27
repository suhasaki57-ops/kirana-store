'use client';

import React, { useState, useEffect } from 'react';
import {
  STORE_RAG_DATABASE, RAGDocument, getCustomKnowledge,
  saveCustomKnowledgeItem, deleteCustomKnowledgeItem, clearCustomKnowledge
} from '@/lib/ragEngine';
import {
  BrainCircuit, Plus, Trash2, Search, FileText, Upload,
  CheckCircle2, Sparkles, Database, Tag, ShieldCheck, RefreshCw, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminKnowledgePage() {
  const [customKnowledge, setCustomKnowledge] = useState<RAGDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // New item form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'custom_knowledge' | 'product' | 'policy' | 'coupon' | 'store_info'>('custom_knowledge');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load custom documents on mount
  useEffect(() => {
    refreshDocs();
  }, []);

  const refreshDocs = () => {
    setCustomKnowledge(getCustomKnowledge());
  };

  const handleCreateKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content text');
      return;
    }

    setIsSubmitting(true);
    try {
      const added = saveCustomKnowledgeItem(title, content, category, url);
      toast.success(`Added knowledge: "${added.title}" to RAG engine!`);
      setTitle('');
      setContent('');
      setUrl('');
      setCategory('custom_knowledge');
      refreshDocs();
    } catch (err) {
      toast.error('Failed to save knowledge document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, docTitle: string) => {
    if (confirm(`Are you sure you want to remove "${docTitle}" from RAG index?`)) {
      deleteCustomKnowledgeItem(id);
      toast.success('Knowledge item removed');
      refreshDocs();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileText = event.target?.result as string;
      if (fileText) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
        setContent(fileText);
        toast.success(`Uploaded "${file.name}". Click "Add to RAG Engine" to save.`);
      }
    };
    reader.readAsText(file);
  };

  const allDocuments: RAGDocument[] = [
    ...customKnowledge,
    ...STORE_RAG_DATABASE
  ];

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">AI RAG Knowledge Base Management</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage custom data, policies, and product details indexed by Gemini AI Chatbot across all pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> RAG Engine Active
          </span>
          <button
            onClick={refreshDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Sync RAG
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Indexed Docs</p>
            <p className="text-xl font-bold text-slate-900">{allDocuments.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Custom Admin Uploads</p>
            <p className="text-xl font-bold text-slate-900">{customKnowledge.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Products in RAG</p>
            <p className="text-xl font-bold text-slate-900">
              {allDocuments.filter(d => d.category === 'product').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Store Policies & Offers</p>
            <p className="text-xl font-bold text-slate-900">
              {allDocuments.filter(d => d.category === 'policy' || d.category === 'coupon').length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel: Add / Upload New RAG Knowledge */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-600" /> Add Knowledge Document
            </h2>
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md font-medium border border-emerald-200 transition">
              <Upload className="h-3.5 w-3.5" /> Upload File (.txt / .json)
              <input type="file" accept=".txt,.json,.md,.csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <form onSubmit={handleCreateKnowledge} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunday Super Discount Terms or New Organic Rice Launch"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="custom_knowledge">Custom Store Knowledge</option>
                <option value="product">Product Details</option>
                <option value="policy">Store Policy & Shipping</option>
                <option value="coupon">Discount Code & Coupon</option>
                <option value="store_info">Store Info & Contact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Page URL (Optional)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. /products/organic-basmati-rice or /deals"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Knowledge Content / Text (Indexed by Gemini RAG)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Enter detailed facts, prices, rules, terms, or descriptions here. Gemini AI will use this exact data to answer customer questions."
                className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" /> Add to RAG Engine
            </button>
          </form>
        </div>

        {/* List Panel: View & Search Indexed RAG Documents */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-600" /> RAG Knowledge Index ({filteredDocs.length})
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-slate-300 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Categories</option>
                <option value="custom_knowledge">Custom Only</option>
                <option value="product">Products</option>
                <option value="policy">Policies</option>
                <option value="coupon">Coupons</option>
                <option value="store_info">Store Info</option>
              </select>
            </div>
          </div>

          {/* Document List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed rounded-xl">
                No matching RAG documents found.
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isCustom = doc.id.startsWith('custom-');

                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 text-sm">{doc.title}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isCustom
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isCustom ? 'Admin Upload' : doc.category}
                          </span>
                        </div>
                        {doc.url && (
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">URL: {doc.url}</p>
                        )}
                      </div>

                      {isCustom && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Delete knowledge document"
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100">
                      {doc.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>ID: {doc.id}</span>
                      <span>Tags: {(doc.tags || []).slice(0, 4).join(', ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
