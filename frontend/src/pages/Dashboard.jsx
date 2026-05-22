import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import { DollarSign, Archive, AlertTriangle, TrendingUp, Sparkles, RefreshCcw, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js structures
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard({ triggerRefreshLowStock }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (showRefIndicator = false) => {
    if (showRefIndicator) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const analyticRes = await api.sales.getAnalytics();
      const suggestionRes = await api.sales.getSuggestions();

      if (analyticRes.success) setAnalytics(analyticRes.data);
      if (suggestionRes.success) setSuggestions(suggestionRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyPriceAdvice = async (prodId, newPrice) => {
    try {
      const res = await api.products.update(prodId, { price: newPrice });
      if (res.success) {
        // Trigger dashboard reload and sidebar badge checks
        fetchDashboardData(true);
        triggerRefreshLowStock();
      }
    } catch (err) {
      alert(`Could not update price recommendation: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-light text-sm tracking-wide">Aggregating real-time analytics...</p>
        </div>
      </div>
    );
  }

  // 1. Chart Configuration: Line Chart for Revenue Trends
  const lineChartData = {
    labels: analytics?.monthlyRevenue?.map((r) => r.month) || [],
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: analytics?.monthlyRevenue?.map((r) => r.revenue) || [],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        borderRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  // 2. Chart Configuration: Doughnut Chart for Categories
  const doughnutChartData = {
    labels: analytics?.categoryBreakdown?.map((c) => c.category) || [],
    datasets: [
      {
        data: analytics?.categoryBreakdown?.map((c) => c.count) || [],
        backgroundColor: [
          '#6366f1', // Electric Indigo
          '#06b6d4', // Cyber Cyan
          '#a855f7', // Purple
          '#f59e0b', // Amber
          '#10b981', // Emerald
        ],
        borderWidth: 1,
        borderColor: 'rgba(17, 24, 39, 0.7)',
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
          font: { family: 'Outfit', size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
    },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* Title & Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sales Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-light mt-1">
            Real-time analytics monitor and e-commerce suggestives
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-[#0f1422] text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold tracking-wide">
            {refreshing ? 'REFRESHING...' : 'SYNC DATA'}
          </span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="ACCUMULATED REVENUE"
          value={`$${analytics?.totalRevenue?.toLocaleString() || '0'}`}
          subtitle="Aggregated total product revenues"
          icon={DollarSign}
          colorClass="bg-gradient-to-b from-cyan-400 to-indigo-500"
        />
        <MetricCard
          title="ACTIVE CATALOG ITEMS"
          value={analytics?.totalProducts || 0}
          subtitle="Unique categories registered"
          icon={Archive}
          colorClass="bg-gradient-to-b from-indigo-500 to-purple-500"
        />
        <MetricCard
          title="LOW STOCK WARNINGS"
          value={analytics?.lowStockCount || 0}
          subtitle="Stock items remaining <= 10 units"
          icon={AlertTriangle}
          colorClass="bg-gradient-to-b from-amber-400 to-orange-500"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Revenue Over Time
            </h3>
            <span className="text-xs text-gray-500 block font-light">
              Aggregated monthly timeline sales chart
            </span>
          </div>
          <div className="h-[250px] mt-6">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Category Distribution
            </h3>
            <span className="text-xs text-gray-500 block font-light">
              Product volume count per category
            </span>
          </div>
          <div className="h-[200px] flex items-center justify-center mt-6">
            {analytics?.categoryBreakdown?.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            ) : (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No category distributions recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI SUGGESTION ENGINE BOARD */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-indigo-500/10">
        
        {/* Glow behind section */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-5 h-5 text-glow-indigo" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              AI Sales Insights & suggestions
            </h3>
            <span className="text-xs text-gray-400 block font-light">
              Autonomous suggestions optimization advice
            </span>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Pricing Advises */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Margin & Pricing advice
            </h4>

            <div className="space-y-3">
              {suggestions?.pricing?.map((item, index) => {
                if (item.type === 'stable' || item.type === 'info') {
                  return (
                    <div key={index} className="p-4 rounded-xl bg-gray-800/20 border border-gray-800 text-sm text-gray-400">
                      {item.message}
                    </div>
                  );
                }
                return (
                  <div key={index} className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-500/10 space-y-3 relative hover:scale-[1.01] transition-transform duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-gray-400">{item.productTitle}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-white">${item.currentPrice}</span>
                          <span className="text-xs text-gray-400">➔</span>
                          <span className="text-sm font-bold text-indigo-400">${item.recommendedPrice}</span>
                        </div>
                      </div>
                      <span className="flex items-center text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        OPPORTUNITY
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {item.reason}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-gray-800/40">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">{item.impact}</span>
                      <button
                        onClick={() => handleApplyPriceAdvice(item.productId, item.recommendedPrice)}
                        className="text-[10px] font-bold text-indigo-300 hover:text-white px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/30 transition-all"
                      >
                        Apply Price
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Inventory & Restocks alerts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4" />
              Supply Chain & Restocks
            </h4>

            <div className="space-y-3">
              {suggestions?.inventory?.map((item, index) => {
                if (item.type === 'healthy' || item.type === 'info') {
                  return (
                    <div key={index} className="p-4 rounded-xl bg-gray-800/20 border border-gray-800 text-sm text-gray-400">
                      {item.message}
                    </div>
                  );
                }
                return (
                  <div key={index} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-3 hover:scale-[1.01] transition-transform duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-gray-400">{item.productTitle}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Current Stock:</span>
                          <span className="text-sm font-bold text-amber-300">{item.currentStock} units</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${item.urgency === 'HIGH' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'}`}>
                        {item.urgency} RISK
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {item.reason}
                    </p>
                    <div className="pt-2 border-t border-gray-800/40 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Restock recommendation:</span>
                      <span className="font-bold text-white">Order {item.suggestedRestockQuantity} units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Trending insights */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
            Trending Product Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions?.trends?.map((item, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-[#131926]/40 border border-gray-800 text-xs flex gap-3 items-start">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold flex-shrink-0 uppercase text-[9px]">
                  {item.category}
                </span>
                <span className="text-gray-400 leading-relaxed font-light">{item.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
