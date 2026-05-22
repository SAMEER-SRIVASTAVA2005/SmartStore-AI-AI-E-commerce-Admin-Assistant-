import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProductModal from '../components/ProductModal';
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle, Sparkles, ShoppingBag, Eye } from 'lucide-react';

export default function Inventory({ triggerRefreshLowStock }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [categories, setCategories] = useState([]);

  // Modal Control States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Detail Modal State (strictly for previewing AI generated descriptions / captions)
  const [detailProduct, setDetailProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.products.getAll();
      if (res.success) {
        setProducts(res.data);
        setFilteredProducts(res.data);

        // Extract unique categories
        const cats = [...new Set(res.data.map((p) => p.category))];
        setCategories(cats);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const handleCreateOrUpdate = async (productData) => {
    try {
      if (editingProduct) {
        // Edit product
        const res = await api.products.update(editingProduct._id, productData);
        if (res.success) {
          fetchProducts();
          triggerRefreshLowStock();
        }
      } else {
        // Create new product
        const res = await api.products.create(productData);
        if (res.success) {
          fetchProducts();
          triggerRefreshLowStock();
        }
      }
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this product?')) return;
    try {
      const res = await api.products.delete(id);
      if (res.success) {
        fetchProducts();
        triggerRefreshLowStock();
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-light text-sm tracking-wide">Syncing product inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="text-gray-400 text-sm font-light mt-1">
            Manage your store inventories and review AI content optimizers
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-indigo-500/10 transition-all hover:scale-105 active:scale-95 duration-200"
        >
          <Plus className="w-4 h-4" />
          ADD NEW PRODUCT
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f1422] border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-gray-500 outline-none transition-all"
            placeholder="Search catalog items by name..."
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Filter className="w-5 h-5" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0f1422] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all appearance-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/40 flex items-center justify-center mx-auto mb-4 border border-gray-800">
            <ShoppingBag className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">No Products Found</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto font-light leading-relaxed">
            {products.length === 0
              ? 'Your store is currently blank! Get started by adding a product or generating customized summaries.'
              : 'No matching entries fit your active search constraints.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stock <= 10;
            return (
              <div
                key={prod._id}
                className={`glass-panel rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                  isLowStock ? 'border-amber-500/30 bg-amber-500/[0.01]' : 'hover:border-gray-700/60'
                }`}
              >
                {/* Low Stock Warning Alert */}
                {isLowStock && (
                  <span className="absolute top-4 right-4 flex items-center bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold animate-pulse gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    LOW STOCK
                  </span>
                )}

                {/* Body details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/5 px-2.5 py-0.5 rounded-md border border-cyan-500/10 inline-block mb-2">
                      {prod.category}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-wide truncate max-w-[80%]">
                      {prod.title}
                    </h3>
                  </div>

                  {/* Price and Stock Stats */}
                  <div className="flex gap-8 py-3.5 border-y border-gray-800/40">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Price</span>
                      <span className="text-lg font-bold text-white">${prod.price}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Stock level</span>
                      <span className={`text-lg font-bold ${isLowStock ? 'text-amber-400' : 'text-white'}`}>
                        {prod.stock} units
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                    {prod.description || 'No description recorded. Open AI Copywriter to generate optimized content details!'}
                  </p>

                  {/* Dynamic Tags */}
                  {prod.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prod.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] text-gray-500 bg-[#0f1422] px-2 py-0.5 rounded border border-gray-800/60 font-medium">
                          #{tag}
                        </span>
                      ))}
                      {prod.tags.length > 3 && (
                        <span className="text-[9px] text-gray-600 bg-transparent px-1.5 py-0.5 rounded font-medium">
                          +{prod.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-800/40">
                  <button
                    onClick={() => setDetailProduct(prod)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview AI
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-2 rounded-xl text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10 transition-all duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal Component */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        product={editingProduct}
      />

      {/* AI Preview Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#070a12]/80 backdrop-blur-md" onClick={() => setDetailProduct(null)}></div>
          <div className="glass-panel-neon rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl z-10 p-6 space-y-6 max-h-[85vh] overflow-y-auto bg-[#0b0f19]">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{detailProduct.title}</h3>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">AI Generated Content Preview</span>
              </div>
              <button
                onClick={() => setDetailProduct(null)}
                className="text-gray-500 hover:text-white px-2.5 py-1 rounded bg-gray-800/40 border border-gray-800/60 hover:bg-gray-800 transition-all text-xs"
              >
                Close
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Description</h4>
              <p className="text-sm text-gray-300 font-light leading-relaxed bg-[#131926]/40 p-4 rounded-xl border border-gray-800">
                {detailProduct.description || 'No description recorded.'}
              </p>
            </div>

            {/* SEO Tags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">SEO Optimization Tags</h4>
              <div className="flex flex-wrap gap-2">
                {detailProduct.tags?.map((t, idx) => (
                  <span key={idx} className="text-xs text-gray-300 bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10 font-medium">
                    #{t}
                  </span>
                )) || <p className="text-xs text-gray-500">No tags recorded.</p>}
              </div>
            </div>

            {/* Marketing Caption */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-glow-cyan" />
                Social Marketing Caption
              </h4>
              <p className="text-sm text-gray-300 font-light leading-relaxed bg-[#131926]/40 p-4 rounded-xl border border-gray-800">
                {detailProduct.marketingCaption || 'No marketing caption recorded.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
