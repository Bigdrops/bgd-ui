
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  ArrowRight,
  Plus,
  X,
  Eye,
  Truck,
  Check,
  LayoutDashboard,
  FileText,
  Folder,
  Menu,
  FileSpreadsheet,
  ClipboardCheck,
  Mail,
  CreditCard,
  FolderKanban,
  Users,
  ShieldCheck,
  Package,
  Layers,
  FileQuestion,
  Building2,
  ChevronDown,
  Settings,
  ShieldAlert,
  LogOut,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Chart from 'chart.js/auto';

// Morphing Sidebar Path Definitions
const PANEL_CLOSED = "M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z";
const PANEL_OPEN = "M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTenant, setActiveTenant] = useState<string>('BIGDROPS Nigeria Ltd');

  // Chart References
  const spark1Ref = useRef<HTMLCanvasElement | null>(null);
  const spark2Ref = useRef<HTMLCanvasElement | null>(null);
  const spark3Ref = useRef<HTMLCanvasElement | null>(null);
  const spark4Ref = useRef<HTMLCanvasElement | null>(null);
  const cashFlowRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleModuleSelect = (moduleName: string) => {
    setIsDrawerOpen(false);
    showToast(`Opened ${moduleName}`);
  };

  const handleTenantSwitch = () => {
    const nextTenant = activeTenant === 'BIGDROPS Nigeria Ltd' ? 'BIGDROPS Ghana Hub' : 'BIGDROPS Nigeria Ltd';
    setActiveTenant(nextTenant);
    showToast(`Switched workspace to ${nextTenant}`);
  };

  useEffect(() => {
    const chartInstances: Chart[] = [];

    const createSparkline = (canvas: HTMLCanvasElement | null, data: number[], color: string) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, i) => i),
          datasets: [{
            data,
            borderColor: color,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.35,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
      chartInstances.push(chart);
    };

    // Render Sparklines
    createSparkline(spark1Ref.current, [10, 14, 12, 18, 16, 22, 25], '#111118');
    createSparkline(spark2Ref.current, [4, 6, 8, 5, 9, 12, 9], '#111118');
    createSparkline(spark3Ref.current, [5, 8, 12, 14, 19, 22, 28], '#111118');
    createSparkline(spark4Ref.current, [12, 10, 14, 11, 8, 9, 6], '#111118');

    // Render Cash Flow Chart inside Ink Black Island
    if (cashFlowRef.current) {
      const cfCtx = cashFlowRef.current.getContext('2d');
      if (cfCtx) {
        const cfChart = new Chart(cfCtx, {
          type: 'line',
          data: {
            labels: ['W1 Aug', 'W2 Aug', 'W3 Aug', 'W4 Aug'],
            datasets: [
              {
                label: 'Expected',
                data: [3.2, 7.5, 12.1, 15.7],
                borderColor: '#fef199',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.35,
                pointBackgroundColor: '#fef199',
                pointRadius: 3
              },
              {
                label: 'Collected',
                data: [2.8, 5.9, 8.92, null],
                borderColor: '#ffffff',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.35,
                pointBackgroundColor: '#ffffff',
                pointRadius: 3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 9 }, color: '#7c7c7c' }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.08)' },
                ticks: {
                  font: { family: 'Inter', size: 9 },
                  color: '#7c7c7c',
                  callback: function(value) { return '₦' + value + 'M'; }
                }
              }
            }
          }
        });
        chartInstances.push(cfChart);
      }
    }

    return () => {
      chartInstances.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111118] flex items-center justify-center p-0 sm:p-4 md:p-6 antialiased font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');
        .font-editorial { font-family: 'Playfair Display', serif; }
        .font-mori { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Mobile Shell Frame (Paper Canvas #ffffff) */}
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-[#ffffff] relative overflow-hidden sm:rounded-[32px] border-0 sm:border-[8px] border-[#111118] flex flex-col justify-between font-mori">
        
        {/* Header Navigation */}
        <header className="bg-[#ffffff] px-4 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#dddddd]">
          <div className="flex items-center space-x-2.5">
            {/* Sidebar Toggle Icon Button */}
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-[24px] bg-[#ffffff] text-[#111118] transition-transform active:scale-95 border border-[#111118] flex items-center justify-center"
              aria-label="Toggle Sidebar Navigation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#111118]">
                <path
                  d="M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={isDrawerOpen ? PANEL_OPEN : PANEL_CLOSED}
                  fill="#ffffff"
                  style={{ transition: "d 0.35s ease" }}
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-editorial italic text-[#111118] text-xl tracking-tight">BIGDROPS</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => showToast('Search query initialized')}
              className="p-2 rounded-[24px] bg-[#ffffff] text-[#111118] hover:bg-[#fef199]/40 transition-transform active:scale-95 border border-[#dddddd] flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#111118]" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => showToast('8 updates in operational ledger')}
              className="relative p-2 rounded-[24px] bg-[#ffffff] text-[#111118] hover:bg-[#fef199]/40 transition-transform active:scale-95 border border-[#dddddd] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#111118]" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#111118]" />
            </button>

            {/* Profile Avatar */}
            <div
              className="relative w-8 h-8 rounded-full bg-[#ffffff] p-0.5 cursor-pointer transition-transform active:scale-95 border border-[#111118]"
              onClick={toggleDrawer}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Dashboard Container */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-4 space-y-5 pb-20">
          
          {/* 1. FINANCIAL OVERVIEW */}
          <section className="space-y-2">
            <h2 className="text-[12px] uppercase tracking-[0.107em] text-[#7c7c7c] font-mori font-light px-1">Financial Snapshot</h2>

            <div className="grid grid-cols-2 gap-2.5">
              {/* KPI 1 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[8px] border border-[#dddddd] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7c7c7c] font-normal">Outstanding</span>
                  <div className="w-7 h-7 rounded-[8px] bg-[#fef199] flex items-center justify-center text-[#111118]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-editorial text-2xl text-[#111118]">₦12.54M</div>
                  <span className="text-[10px] text-[#7c7c7c] font-mori tracking-[0.05em] uppercase">48 Active Invoices</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark1Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[8px] border border-[#dddddd] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7c7c7c] font-normal">Due This Week</span>
                  <div className="w-7 h-7 rounded-[8px] bg-[#fef199] flex items-center justify-center text-[#111118]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-editorial text-2xl text-[#111118]">₦3.24M</div>
                  <span className="text-[10px] text-[#111118] font-semibold tracking-[0.05em] uppercase bg-[#fef199] px-1 rounded">9 Action Needed</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark2Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[8px] border border-[#dddddd] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7c7c7c] font-normal">Payments Recv.</span>
                  <div className="w-7 h-7 rounded-[8px] bg-[#111118] flex items-center justify-center text-[#ffffff]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-editorial text-2xl text-[#111118]">₦8.92M</div>
                  <span className="text-[10px] text-[#7c7c7c] font-mori uppercase tracking-[0.05em]">+14% vs last month</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark3Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[8px] border border-[#dddddd] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7c7c7c] font-normal">Overdue</span>
                  <div className="w-7 h-7 rounded-[8px] bg-[#111118] flex items-center justify-center text-[#fef199]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="font-editorial text-2xl text-[#111118]">₦1.18M</div>
                  <span className="text-[10px] text-[#111118] font-semibold tracking-[0.05em] uppercase bg-[#fef199] px-1 rounded">6 Overdue</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark4Ref} className="w-full h-full" />
                </div>
              </div>
            </div>
          </section>

          {/* 2. HIGH IMPACT ACTIONS */}
          <section className="space-y-2">
            <h2 className="text-[12px] uppercase tracking-[0.107em] text-[#7c7c7c] font-mori font-light px-1">Collect These First</h2>

            <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5">
              {/* Card 1 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[8px] p-3.5 border border-[#111118] flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#fef199] text-[#111118] text-[10px] px-2.5 py-0.5 rounded-[24px] font-semibold uppercase tracking-[0.05em]">
                    4 Days Overdue
                  </span>
                  <span className="text-[11px] font-mono text-[#7c7c7c]">#INV-000042</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#111118] font-normal">Zenith Manufacturing Ltd</h3>
                  <div className="font-editorial text-2xl text-[#111118] mt-0.5">₦2,450,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#dddddd] flex items-center justify-between">
                  <span className="text-[11px] text-[#7c7c7c]">Due Aug 12</span>
                  <button
                    onClick={() => showToast('Reminder dispatched')}
                    className="bg-[#111118] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-semibold uppercase tracking-[0.107em]"
                  >
                    <span>Remind</span>
                    <ArrowRight className="w-3 h-3 text-[#fef199]" />
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[8px] p-3.5 border border-[#dddddd] flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ffffff] text-[#111118] text-[10px] px-2.5 py-0.5 rounded-[24px] font-normal border border-[#111118] uppercase tracking-[0.05em]">
                    Due Tomorrow
                  </span>
                  <span className="text-[11px] font-mono text-[#7c7c7c]">#INV-000048</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#111118] font-normal">Nova Logistics</h3>
                  <div className="font-editorial text-2xl text-[#111118] mt-0.5">₦820,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#dddddd] flex items-center justify-between">
                  <span className="text-[11px] text-[#7c7c7c]">Due Aug 17</span>
                  <button
                    onClick={() => showToast('WhatsApp link generated')}
                    className="bg-[#111118] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-semibold uppercase tracking-[0.107em]"
                  >
                    <span>WhatsApp</span>
                    <ArrowRight className="w-3 h-3 text-[#fef199]" />
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[8px] p-3.5 border border-[#dddddd] flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ffffff] text-[#111118] text-[10px] px-2.5 py-0.5 rounded-[24px] font-normal border border-[#dddddd] uppercase tracking-[0.05em]">
                    Awaiting Payment
                  </span>
                  <span className="text-[11px] font-mono text-[#7c7c7c]">#INV-000051</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#111118] font-normal">Apex Construction</h3>
                  <div className="font-editorial text-2xl text-[#111118] mt-0.5">₦1,950,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#dddddd] flex items-center justify-between">
                  <span className="text-[11px] text-[#7c7c7c]">Due Aug 22</span>
                  <button
                    onClick={() => showToast('Pay link copied')}
                    className="bg-[#ffffff] text-[#111118] text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-semibold border border-[#111118] uppercase tracking-[0.107em]"
                  >
                    <span>Pay Link</span>
                    <ArrowRight className="w-3 h-3 text-[#111118]" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. RECENTLY CREATED DOCUMENTS */}
          <section className="space-y-2">
            <h2 className="text-[12px] uppercase tracking-[0.107em] text-[#7c7c7c] font-mori font-light px-1">Recently Created Documents</h2>

            <div className="bg-[#ffffff] rounded-[8px] border border-[#dddddd] divide-y divide-[#dddddd] overflow-hidden">
              
              {/* Doc 1: Invoice */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Invoice #INV-000042')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#111118] text-[#ffffff] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#fef199]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">Invoice</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#INV-000042</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">Zenith Manufacturing Ltd</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 26, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-editorial text-lg text-[#111118]">₦2,450,000</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#fef199] px-2 py-0.5 rounded-[24px] font-semibold uppercase tracking-[0.05em] mt-0.5">
                    Active
                  </span>
                </div>
              </div>

              {/* Doc 2: Quotation */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Quotation #QUO-000128')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#ffffff] text-[#111118] flex items-center justify-center shrink-0 border border-[#dddddd]">
                    <FileSpreadsheet className="w-5 h-5 text-[#111118]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">Quotation</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#QUO-000128</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">Apex Construction</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 25, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-editorial text-lg text-[#111118]">₦4,120,000</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#ffffff] px-2 py-0.5 rounded-[24px] border border-[#dddddd] font-normal uppercase tracking-[0.05em] mt-0.5">
                    Approved
                  </span>
                </div>
              </div>

              {/* Doc 3: CSR */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening CSR #CSR-000089')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#ffffff] text-[#111118] flex items-center justify-center shrink-0 border border-[#dddddd]">
                    <ClipboardCheck className="w-5 h-5 text-[#111118]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">CSR Log</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#CSR-000089</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">GreenFarm Foods</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 24, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#111118] font-mori">Service Log</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#ffffff] px-2 py-0.5 rounded-[24px] border border-[#dddddd] font-normal uppercase tracking-[0.05em] mt-0.5">
                    Signed
                  </span>
                </div>
              </div>

              {/* Doc 4: Waybill */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Waybill #WBL-E-000054')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#111118] text-[#ffffff] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#fef199]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">Waybill (Ext)</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#WBL-E-000054</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">Nova Logistics</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 23, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#111118] font-mori">14 Items</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#fef199] px-2 py-0.5 rounded-[24px] font-semibold uppercase tracking-[0.05em] mt-0.5">
                    In Transit
                  </span>
                </div>
              </div>

              {/* Doc 5: Correspondence */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Correspondence #COR-000031')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#ffffff] text-[#111118] flex items-center justify-center shrink-0 border border-[#dddddd]">
                    <Mail className="w-5 h-5 text-[#111118]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">Correspondence</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#COR-000031</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">Sterling Supplies</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 22, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#111118] font-mori">SLA Rev</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#ffffff] px-2 py-0.5 rounded-[24px] border border-[#dddddd] font-normal uppercase tracking-[0.05em] mt-0.5">
                    Sent
                  </span>
                </div>
              </div>

              {/* Doc 6: RFQ */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#fef199]/20 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening RFQ #RFQ-000019')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#ffffff] text-[#111118] flex items-center justify-center shrink-0 border border-[#dddddd]">
                    <FileQuestion className="w-5 h-5 text-[#111118]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#111118] font-semibold">RFQ</span>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">#RFQ-000019</span>
                    </div>
                    <p className="text-[11px] text-[#333333]">Prime Energy</p>
                    <span className="text-[10px] text-[#7c7c7c] font-mono">Aug 21, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-editorial text-lg text-[#111118]">₦8,500,000</div>
                  <span className="inline-block text-[9px] text-[#111118] bg-[#fef199] px-2 py-0.5 rounded-[24px] font-semibold uppercase tracking-[0.05em] mt-0.5">
                    Tender
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* 4. INK BLACK DRAMATIC FOOTER PANEL FOR CASH FLOW */}
          <section className="bg-[#111118] rounded-[8px] p-4 text-[#ffffff] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="font-editorial text-base text-[#ffffff]">Cash Flow Forecast</span>
              <span className="text-[10px] text-[#fef199] font-mono tracking-[0.05em] uppercase">₦15.7M Total</span>
            </div>

            <div className="h-32 w-full relative">
              <canvas ref={cashFlowRef} className="w-full h-full" />
            </div>

            <div className="pt-2 border-t border-[#ffffff]/10 grid grid-cols-3 text-center gap-1.5">
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[8px]">
                <div className="text-[9px] text-[#7c7c7c] uppercase tracking-[0.05em]">Expected</div>
                <div className="font-editorial text-sm text-[#ffffff]">₦15.7M</div>
              </div>
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[8px]">
                <div className="text-[9px] text-[#fef199] uppercase tracking-[0.05em]">Collected</div>
                <div className="font-editorial text-sm text-[#fef199]">₦8.92M</div>
              </div>
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[8px]">
                <div className="text-[9px] text-[#7c7c7c] uppercase tracking-[0.05em]">Rate</div>
                <div className="font-editorial text-sm text-[#ffffff]">71.4%</div>
              </div>
            </div>
          </section>

          {/* 5. RECENT ACTIVITY & AUDIT TRAIL */}
          <section className="space-y-2 pt-1">
            <h2 className="text-[12px] uppercase tracking-[0.107em] text-[#7c7c7c] font-mori font-light px-1">Recent Activity</h2>

            <div className="bg-[#ffffff] rounded-[8px] p-3.5 border border-[#dddddd] space-y-3">
              {/* Item 1 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#dddddd]">
                <div className="w-5 h-5 rounded-full bg-[#fef199] border border-[#111118] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#111118]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#111118]">
                    Payment <span className="font-semibold">₦540,000</span> for <span className="font-normal">Prime Energy</span>
                  </p>
                  <span className="text-[10px] text-[#7c7c7c]">12m ago</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#dddddd]">
                <div className="w-5 h-5 rounded-full bg-[#ffffff] border border-[#111118] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-3 h-3 text-[#111118]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#111118]">
                    <span>Zenith Mfg</span> viewed Invoice <span className="font-mono text-[10px]">#INV-000043</span>
                  </p>
                  <span className="text-[10px] text-[#7c7c7c]">1h ago</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#dddddd]">
                <div className="w-5 h-5 rounded-full bg-[#ffffff] border border-[#111118] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3 h-3 text-[#111118]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#111118]">
                    Waybill <span className="font-mono text-[10px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span>
                  </p>
                  <span className="text-[10px] text-[#7c7c7c]">3h ago</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#fef199] border border-[#111118] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#111118]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#111118]">
                    Quotation <span className="font-mono text-[10px]">#QUO-000128</span> approved by <span>Apex Construction</span>
                  </p>
                  <span className="text-[10px] text-[#7c7c7c]">Yesterday 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="text-xs text-[#111118] font-semibold tracking-[0.107em] uppercase inline-flex items-center space-x-1.5 py-1.5 px-4 rounded-[24px] bg-[#ffffff] border border-[#111118] transition-transform active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#111118]" />
                <span>Open Compiled Audit Hub</span>
                <ArrowRight className="w-3 h-3 text-[#111118]" />
              </button>
            </div>
          </section>

        </main>

        {/* FLOATING INK BLACK CTA BUTTON */}
        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => showToast('Select Document Type to Create')}
            className="w-12 h-12 rounded-[24px] bg-[#111118] text-[#ffffff] flex items-center justify-center transition-transform active:scale-95 border border-[#111118]"
            aria-label="Create Document"
          >
            <Plus className="w-6 h-6 text-[#fef199]" />
          </button>
        </div>

        {/* SIDE DRAWER COMPONENT */}
        <div
          className={`absolute inset-0 bg-[#111118]/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[310px] bg-[#ffffff] text-[#111118] z-50 transition-transform duration-350 ease-out flex flex-col justify-between p-4 border-r border-[#111118] ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            {/* Drawer Header (NO BLUE DOT) */}
            <div className="flex justify-between items-center pb-2 border-b border-[#dddddd]">
              <h3 className="font-editorial italic text-lg text-[#111118]">BIGDROPS</h3>
              <button
                onClick={toggleDrawer}
                className="p-1.5 rounded-[24px] bg-[#ffffff] text-[#111118] transition-transform active:scale-95 border border-[#dddddd]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Workspace Switcher */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#7c7c7c] uppercase tracking-[0.107em] px-1 font-mori">Active Workspace</span>
              <button
                onClick={handleTenantSwitch}
                className="w-full bg-[#ffffff] border border-[#111118] rounded-[8px] p-2.5 flex items-center justify-between text-left transition-colors hover:bg-[#fef199]/20"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-[#111118] shrink-0" />
                  <span className="text-xs font-semibold text-[#111118] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#7c7c7c] shrink-0 ml-1" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="bg-[#ffffff] border border-[#dddddd] rounded-[8px] p-2.5 flex items-center space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Chinedu Okonkwo"
                className="w-9 h-9 rounded-full object-cover border border-[#111118]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-[#111118] truncate">Chinedu Okonkwo</h4>
                <p className="text-[10px] text-[#7c7c7c] truncate">Senior Operations Lead</p>
              </div>
            </div>

            {/* Drawer Module Links */}
            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="text-[10px] text-[#7c7c7c] uppercase tracking-[0.107em] mb-1 px-1 font-mori">Core Modules</div>

              <button
                onClick={() => handleModuleSelect('Invoices')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] bg-[#111118] text-[#ffffff] text-xs font-semibold uppercase tracking-[0.107em]"
              >
                <FileText className="w-3.5 h-3.5 text-[#fef199]" />
                <span>Invoices</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Quotations')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#111118]" />
                <span>Quotations</span>
              </button>

              <button
                onClick={() => handleModuleSelect('CSR')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-[#111118]" />
                <span>Customer Service Reports (CSR)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Waybills')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <Truck className="w-3.5 h-3.5 text-[#111118]" />
                <span>Waybills (Ext & Int)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Payments')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#111118]" />
                <span>Payments Ledger</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Projects')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <FolderKanban className="w-3.5 h-3.5 text-[#111118]" />
                <span>Projects Engagement</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Clients')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <Users className="w-3.5 h-3.5 text-[#111118]" />
                <span>Client Management</span>
              </button>

              <div className="text-[10px] text-[#7c7c7c] uppercase tracking-[0.107em] mt-3 mb-1 px-1 font-mori">Management & Governance</div>

              <button
                onClick={() => handleModuleSelect('Compliance')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#111118]" />
                <span>Compliance Hub</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#111118]" />
                <span>Audit Hub & Token Ledger</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Item Library')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <Package className="w-3.5 h-3.5 text-[#111118]" />
                <span>Item Library</span>
              </button>

              <button
                onClick={() => handleModuleSelect('BOQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <Layers className="w-3.5 h-3.5 text-[#111118]" />
                <span>Bill of Quantities (BOQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('RFQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <FileQuestion className="w-3.5 h-3.5 text-[#111118]" />
                <span>Request for Quotation (RFQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Settings')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-[#111118] hover:bg-[#fef199]/30 text-xs font-normal uppercase tracking-[0.107em]"
              >
                <Settings className="w-3.5 h-3.5 text-[#111118]" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Drawer Footer / Sign Out */}
          <div className="pt-3 border-t border-[#dddddd] space-y-2">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                showToast('Signed out successfully');
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-[24px] bg-[#111118] text-[#ffffff] text-xs font-semibold uppercase tracking-[0.107em] transition-transform active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-[#fef199]" />
              <span>Sign Out</span>
            </button>
            <div className="text-center text-[10px] text-[#7c7c7c] tracking-[0.05em] uppercase">
              <span>BIGDROPS Editorial v2.4</span>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-[#ffffff] border-t border-[#dddddd] px-2 py-2 flex justify-around items-center z-30 shrink-0">
          <button className="flex flex-col items-center justify-center text-[#111118] space-y-0.5 transition-transform active:scale-95 w-12">
            <LayoutDashboard className="w-4 h-4 text-[#111118]" />
            <span className="text-[10px] font-semibold text-[#111118]">Home</span>
          </button>

          <button
            onClick={() => showToast('Switched to Documents')}
            className="flex flex-col items-center justify-center text-[#7c7c7c] hover:text-[#111118] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-normal">Docs</span>
          </button>

          <button
            onClick={() => showToast('Switched to Logistics')}
            className="flex flex-col items-center justify-center text-[#7c7c7c] hover:text-[#111118] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Truck className="w-4 h-4" />
            <span className="text-[10px] font-normal">Dispatch</span>
          </button>

          <button
            onClick={() => showToast('Switched to Projects')}
            className="flex flex-col items-center justify-center text-[#7c7c7c] hover:text-[#111118] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Folder className="w-4 h-4" />
            <span className="text-[10px] font-normal">Projects</span>
          </button>

          <button
            onClick={toggleDrawer}
            className="flex flex-col items-center justify-center text-[#7c7c7c] hover:text-[#111118] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] font-normal">More</span>
          </button>
        </nav>

        {/* Home Indicator */}
        <div className="w-full bg-[#ffffff] pb-1.5 flex justify-center z-30">
          <div className="w-28 h-1 bg-[#111118]/20 rounded-full" />
        </div>

        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#111118] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] border border-[#111118] z-50 flex items-center space-x-1.5">
            <ArrowRight className="w-3 h-3 text-[#fef199]" />
            <span className="tracking-[0.05em]">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

`

