import React, { useState } from 'react';
import { api } from '../services/api';
import ProductModal from '../components/ProductModal';
import { Sparkles, Copy, Check, Send, Award, FileText, Globe, Volume2, Save } from 'lucide-react';

export default function AIStudio({ triggerRefreshLowStock }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    keywords: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Copied indicator triggers
  const [copiedSection, setCopiedSection] = useState(null);

  // Catalog publish states
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await api.ai.generateContent(formData);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'AI content generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePublishToCatalog = async (productData) => {
    try {
      const fullProductData = {
        ...productData,
        description: result.description,
        tags: result.tags,
        marketingCaption: result.marketingCaption,
      };

      const res = await api.products.create(fullProductData);
      if (res.success) {
        alert('Product successfully cataloged and published with AI optimization parameters!');
        setFormData({ title: '', category: '', keywords: '' });
        setResult(null);
        triggerRefreshLowStock();
      }
    } catch (err) {
      alert(`Publishing failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* Headings */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          AI Copywriter Studio
        </h1>
        <p className="text-gray-400 text-sm font-light mt-1">
          Generate optimized descriptions, high-conversion marketing captions, and strategic SEO keywords in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left: Input Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400 text-glow-cyan animate-pulse" />
              Content Creator Generator
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Name *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#0f1422] border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. Ergonomic Office Chair"
                />
              </div>

              {/* Product Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category *</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#0f1422] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. Office Furniture"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Keywords (optional)</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full bg-[#0f1422] border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. leather, lumbar-support, black, adjustable"
                />
                <span className="text-[10px] text-gray-500 block font-light leading-relaxed">
                  Provide descriptive keywords separated by commas to tailor custom AI text outcomes.
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.category}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    GENERATE AI OPTIMIZATIONS
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Output Results Panel */}
        <div className="lg:col-span-3 min-h-[400px]">
          
          {/* Default view */}
          {!loading && !result && !error && (
            <div className="h-full glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">AI Copywriter Output</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-sm font-light leading-relaxed">
                Fill out the generator details on the left and trigger optimization inputs to review AI written descriptions.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="h-full glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center border-red-500/20 bg-red-500/[0.01]">
              <span className="text-red-400 text-lg font-bold">Generation Attempt Failed</span>
              <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* Loading Animation Skeletons */}
          {loading && (
            <div className="glass-panel rounded-2xl p-6 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4 flex-1">
                <div className="h-6 w-1/3 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-800/60 rounded-md animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-800/60 rounded-md animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-800/60 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-800/40">
                <div className="h-4 w-1/4 bg-gray-800 rounded-md animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-800 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Result Output View */}
          {result && (
            <div className="glass-panel rounded-2xl p-6 space-y-6 animate-scale-up h-full flex flex-col justify-between">
              
              {/* Main Content Fields */}
              <div className="space-y-6">
                
                {/* 1. Description */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
                      <FileText className="w-4 h-4" />
                      Generated Product Description
                    </h4>
                    <button
                      onClick={() => handleCopyToClipboard(result.description, 'description')}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/60 transition-colors"
                    >
                      {copiedSection === 'description' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 font-light leading-relaxed bg-[#131926]/40 p-4 rounded-xl border border-gray-800">
                    {result.description}
                  </p>
                </div>

                {/* 2. SEO Tags */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
                      <Globe className="w-4 h-4" />
                      Optimized SEO Tags
                    </h4>
                    <button
                      onClick={() => handleCopyToClipboard(result.tags.join(', '), 'tags')}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/60 transition-colors"
                    >
                      {copiedSection === 'tags' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 bg-[#131926]/40 p-4 rounded-xl border border-gray-800">
                    {result.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-300 bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10 font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Marketing Caption */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
                      <Volume2 className="w-4 h-4" />
                      Social Media Marketing Caption
                    </h4>
                    <button
                      onClick={() => handleCopyToClipboard(result.marketingCaption, 'marketingCaption')}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/60 transition-colors"
                    >
                      {copiedSection === 'marketingCaption' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 font-light leading-relaxed bg-[#131926]/40 p-4 rounded-xl border border-gray-800">
                    {result.marketingCaption}
                  </p>
                </div>
              </div>

              {/* Publish to Catalog controls */}
              <div className="pt-6 border-t border-gray-800 flex justify-between items-center bg-[#111827]/30 -mx-6 -mb-6 p-6">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Award className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-gray-400 font-light">Happy with results? Add to store inventory!</span>
                </div>
                <button
                  onClick={() => setPublishModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold tracking-wide shadow-md shadow-emerald-500/10 transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  PUBLISH TO CATALOG
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Publish configuration Modal (pricing, stock levels) */}
      <ProductModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onSubmit={handlePublishToCatalog}
        product={formData.title ? { title: formData.title, category: formData.category } : null}
      />
    </div>
  );
}
