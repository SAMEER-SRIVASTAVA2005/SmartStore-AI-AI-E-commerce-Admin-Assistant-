import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, DollarSign, Archive, Tag } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSubmit, product }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    tags: '',
    marketingCaption: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        marketingCaption: product.marketingCaption || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        tags: '',
        marketingCaption: '',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      tags: tagsArray,
    };

    try {
      await onSubmit(formattedData);
      onClose();
    } catch (err) {
      alert(`Error updating product details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim backdrop */}
      <div className="absolute inset-0 bg-[#070a12]/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Surface */}
      <div className="glass-panel-neon rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 animate-scale-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#0d121f]">
          <h3 className="text-lg font-bold text-white tracking-wide">
            {product ? 'Edit E-commerce Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#0b0f19]">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#131926]/75 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
              placeholder="e.g. UltraFit Wireless Earbuds"
            />
          </div>

          {/* Pricing & Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Price ($) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#131926]/75 border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                  placeholder="29.99"
                />
              </div>
            </div>

            {/* Stock Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Current Stock *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Archive className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-[#131926]/75 border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Category *</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#131926]/75 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
              placeholder="e.g. Electronics, Apparel, Home"
            />
          </div>

          {/* Product Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Product Description</label>
              <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                OPTIMIZE VIA AI COPYWRITER TAB
              </span>
            </div>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#131926]/75 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 resize-none"
              placeholder="Write a descriptions or generate automatically using AI copywriter panel..."
            />
          </div>

          {/* SEO Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">SEO Tags (comma-separated)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-[#131926]/75 border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="wireless, earbuds, audio, sound, noise-canceling"
              />
            </div>
          </div>

          {/* Marketing Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Social Marketing Caption</label>
            <textarea
              name="marketingCaption"
              rows="2"
              value={formData.marketingCaption}
              onChange={handleChange}
              className="w-full bg-[#131926]/75 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 resize-none"
              placeholder="Captivating social promotion tags to post to Instagram, TikTok or Facebook..."
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-800/40 flex justify-end gap-3 bg-[#0b0f19]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-800 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/10 flex items-center gap-1.5 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {product ? 'Save Changes' : 'Create Product'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
