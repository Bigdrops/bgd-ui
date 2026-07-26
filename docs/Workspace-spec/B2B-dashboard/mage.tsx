```react
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
  AlertCircle,
  FileCode
} from 'lucide-react';
import Chart from 'chart.js/auto';

// Morphing Sidebar Path Definitions
const PANEL_CLOSED = "M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z";
const PANEL_OPEN = "M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTenant, setActiveTenant] = useState<string>('BIGDROPS Nigeria Ltd');

  // Chart Canvas Refs
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
    createSparkline(spark1Ref.current, [10, 14, 12, 18, 16, 22, 25], '#244cff');
    createSparkline(spark2Ref.current, [4, 6, 8, 5, 9, 12, 9], '#2b2b2b');
    createSparkline(spark3Ref.current, [5, 8, 12, 14, 19, 22, 28], '#244cff');
    createSparkline(spark4Ref.current, [12, 10, 14, 11, 8, 9, 6], '#2b2b2b');

    // Render Cash Flow Chart inside Dark Island
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
                borderColor: '#244cff',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.35,
                pointBackgroundColor: '#244cff',
                pointRadius: 3
              },
              {
                label: 'Collected',
                data: [2.8, 5.9, 8.92, null],
                borderColor: '#c3aeff',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.35,
                pointBackgroundColor: '#c3aeff',
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
                ticks: { font: { family: 'Inter', size: 9 }, color: '#b0b0b0' }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.08)' },
                ticks: {
                  font: { family: 'Inter', size: 9 },
                  color: '#b0b0b0',
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
    <div className="min-h-screen bg-[#1d1f21] flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans antialiased">
      {/* Mobile Shell Frame (Parchment Canvas #f7f7f1) */}
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-[#f7f7f1] relative overflow-hidden sm:rounded-[32px] border-0 sm:border-[8px] border-[#1d1f21] flex flex-col justify-between">
        
        {/* Top Header Navigation */}
        <header className="bg-[#f7f7f1] px-4 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#b0b0b0]/30">
          <div className="flex items-center space-x-2.5">
            {/* Sidebar Toggle Icon Button */}
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-[100px] bg-[#ffffff] text-[#1d1f21] transition-transform active:scale-95 border border-[#b0b0b0]/40 flex items-center justify-center shadow-sm"
              aria-label="Toggle Navigation Drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1d1f21]">
                <path
                  d="M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={isDrawerOpen ? PANEL_OPEN : PANEL_CLOSED}
                  fill="#f7f7f1"
                  style={{ transition: "d 0.35s ease" }}
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-normal text-[#000000] text-base tracking-tight uppercase">BIGDROPS</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              onClick={() => showToast('Search initialized')}
              className="p-2 rounded-[100px] bg-[#ffffff] text-[#1d1f21] hover:bg-[#e8f8ff] transition-transform active:scale-95 border border-[#b0b0b0]/40 flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#1d1f21]" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => showToast('8 operational updates')}
              className="relative p-2 rounded-[100px] bg-[#ffffff] text-[#1d1f21] hover:bg-[#e8f8ff] transition-transform active:scale-95 border border-[#b0b0b0]/40 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#1d1f21]" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#244cff]" />
            </button>

            {/* Profile Avatar */}
            <div
              className="relative w-8 h-8 rounded-[100px] bg-[#ffffff] p-0.5 cursor-pointer transition-transform active:scale-95 border border-[#1d1f21]"
              onClick={toggleDrawer}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-[100px] object-cover"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Dashboard */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-4 space-y-4 pb-20">
          
          {/* 1. FINANCIAL OVERVIEW */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-[#878787] font-normal px-1">Financial Snapshot</h2>

            <div className="grid grid-cols-2 gap-2.5">
              {/* KPI 1 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[6px] border border-[#b0b0b0]/30 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#878787] font-normal">Outstanding</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#e8f8ff] flex items-center justify-center text-[#244cff]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="text-xl text-[#000000] font-normal">₦12.54M</div>
                  <span className="text-[10px] text-[#244cff] font-medium">48 Active Invoices</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark1Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[6px] border border-[#b0b0b0]/30 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#878787] font-normal">Due This Week</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#fced9f]/50 flex items-center justify-center text-[#1d1f21]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="text-xl text-[#000000] font-normal">₦3.24M</div>
                  <span className="text-[10px] text-[#2b2b2b] font-medium">9 Invoices Pending</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark2Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[6px] border border-[#b0b0b0]/30 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#878787] font-normal">Payments Recv.</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#e8f8ff] flex items-center justify-center text-[#244cff]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="text-xl text-[#000000] font-normal">₦8.92M</div>
                  <span className="text-[10px] text-[#244cff] font-medium">+14% vs last month</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark3Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-[#ffffff] p-3.5 rounded-[6px] border border-[#b0b0b0]/30 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#878787] font-normal">Overdue</span>
                  <div className="w-7 h-7 rounded-[6px] bg-[#fcc2cd]/40 flex items-center justify-center text-[#1d1f21]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <div className="text-xl text-[#244cff] font-normal">₦1.18M</div>
                  <span className="text-[10px] text-[#1d1f21] font-medium">6 Invoices Overdue</span>
                </div>
                <div className="h-4 w-full">
                  <canvas ref={spark4Ref} className="w-full h-full" />
                </div>
              </div>
            </div>
          </section>

          {/* 2. HIGH IMPACT ACTIONS (COLLECT THESE FIRST) */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-[#878787] font-normal px-1">Collect These First</h2>

            <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5">
              {/* Card 1 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[6px] p-3.5 border border-[#b0b0b0]/30 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#fcc2cd]/40 text-[#1d1f21] text-[10px] px-2.5 py-0.5 rounded-[100px] font-medium">
                    4 Days Overdue
                  </span>
                  <span className="text-[11px] font-mono text-[#878787]">#INV-000042</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#2b2b2b] font-normal">Zenith Manufacturing Ltd</h3>
                  <div className="text-xl text-[#000000] font-normal mt-0.5">₦2,450,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#b0b0b0]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#878787]">Due Aug 12</span>
                  <button
                    onClick={() => showToast('Reminder dispatched')}
                    className="bg-[#244cff] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[100px] transition-transform active:scale-95 flex items-center space-x-1 font-medium"
                  >
                    <span>Remind</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[6px] p-3.5 border border-[#b0b0b0]/30 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#fced9f] text-[#1d1f21] text-[10px] px-2.5 py-0.5 rounded-[100px] font-medium">
                    Due Tomorrow
                  </span>
                  <span className="text-[11px] font-mono text-[#878787]">#INV-000048</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#2b2b2b] font-normal">Nova Logistics</h3>
                  <div className="text-xl text-[#000000] font-normal mt-0.5">₦820,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#b0b0b0]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#878787]">Due Aug 17</span>
                  <button
                    onClick={() => showToast('WhatsApp link generated')}
                    className="bg-[#1d1f21] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[100px] transition-transform active:scale-95 flex items-center space-x-1 font-medium"
                  >
                    <span>WhatsApp</span>
                    <ArrowRight className="w-3 h-3 text-[#c3aeff]" />
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="min-w-[250px] bg-[#ffffff] rounded-[6px] p-3.5 border border-[#b0b0b0]/30 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-[#e8f8ff] text-[#244cff] text-[10px] px-2.5 py-0.5 rounded-[100px] font-medium">
                    Awaiting Payment
                  </span>
                  <span className="text-[11px] font-mono text-[#878787]">#INV-000051</span>
                </div>
                <div>
                  <h3 className="text-xs text-[#2b2b2b] font-normal">Apex Construction</h3>
                  <div className="text-xl text-[#000000] font-normal mt-0.5">₦1,950,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#b0b0b0]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#878787]">Due Aug 22</span>
                  <button
                    onClick={() => showToast('Pay link copied')}
                    className="bg-[#ffffff] text-[#1d1f21] text-xs px-3.5 py-1.5 rounded-[100px] transition-transform active:scale-95 flex items-center space-x-1 font-medium border border-[#b0b0b0]/50"
                  >
                    <span>Pay Link</span>
                    <ArrowRight className="w-3 h-3 text-[#244cff]" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. RECENTLY CREATED DOCUMENTS (HUGE SERIOUS ICONS & DATES) */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-[#878787] font-normal px-1">Recently Created Documents</h2>

            <div className="bg-[#ffffff] rounded-[6px] border border-[#b0b0b0]/30 divide-y divide-[#b0b0b0]/20 overflow-hidden">
              
              {/* Doc 1: Invoice */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Invoice #INV-000042')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#e8f8ff] text-[#244cff] flex items-center justify-center shrink-0 border border-[#244cff]/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">Invoice</span>
                      <span className="text-[10px] font-mono text-[#878787]">#INV-000042</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">Zenith Manufacturing Ltd</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 26, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000] font-medium">₦2,450,000</div>
                  <span className="inline-block text-[9px] text-[#244cff] bg-[#e8f8ff] px-2 py-0.5 rounded-[100px] mt-0.5 font-medium">
                    Active
                  </span>
                </div>
              </div>

              {/* Doc 2: Quotation */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Quotation #QUO-000128')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#f7f7f1] text-[#1d1f21] flex items-center justify-center shrink-0 border border-[#b0b0b0]/30">
                    <FileSpreadsheet className="w-5 h-5 text-[#244cff]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">Quotation</span>
                      <span className="text-[10px] font-mono text-[#878787]">#QUO-000128</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">Apex Construction</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 25, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000] font-medium">₦4,120,000</div>
                  <span className="inline-block text-[9px] text-[#1d1f21] bg-[#f7f7f1] px-2 py-0.5 rounded-[100px] border border-[#b0b0b0]/30 mt-0.5">
                    Approved
                  </span>
                </div>
              </div>

              {/* Doc 3: CSR */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening CSR #CSR-000089')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#fced9f]/40 text-[#1d1f21] flex items-center justify-center shrink-0 border border-[#b0b0b0]/30">
                    <ClipboardCheck className="w-5 h-5 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">CSR Log</span>
                      <span className="text-[10px] font-mono text-[#878787]">#CSR-000089</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">GreenFarm Foods</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 24, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000]">Service Log</div>
                  <span className="inline-block text-[9px] text-[#1d1f21] bg-[#f7f7f1] px-2 py-0.5 rounded-[100px] border border-[#b0b0b0]/30 mt-0.5">
                    Signed
                  </span>
                </div>
              </div>

              {/* Doc 4: Waybill */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Waybill #WBL-E-000054')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#1d1f21] text-[#ffffff] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#c3aeff]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">Waybill (Ext)</span>
                      <span className="text-[10px] font-mono text-[#878787]">#WBL-E-000054</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">Nova Logistics</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 23, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000]">14 Items</div>
                  <span className="inline-block text-[9px] text-[#244cff] bg-[#e8f8ff] px-2 py-0.5 rounded-[100px] mt-0.5 font-medium">
                    In Transit
                  </span>
                </div>
              </div>

              {/* Doc 5: Correspondence */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Correspondence #COR-000031')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#f7f7f1] text-[#1d1f21] flex items-center justify-center shrink-0 border border-[#b0b0b0]/30">
                    <Mail className="w-5 h-5 text-[#244cff]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">Correspondence</span>
                      <span className="text-[10px] font-mono text-[#878787]">#COR-000031</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">Sterling Supplies</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 22, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000]">SLA Rev</div>
                  <span className="inline-block text-[9px] text-[#1d1f21] bg-[#f7f7f1] px-2 py-0.5 rounded-[100px] border border-[#b0b0b0]/30 mt-0.5">
                    Sent
                  </span>
                </div>
              </div>

              {/* Doc 6: RFQ */}
              <div
                className="p-3.5 flex items-center justify-between hover:bg-[#e8f8ff]/50 transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening RFQ #RFQ-000019')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[6px] bg-[#e8f8ff] text-[#244cff] flex items-center justify-center shrink-0 border border-[#244cff]/20">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#000000] font-medium">RFQ</span>
                      <span className="text-[10px] font-mono text-[#878787]">#RFQ-000019</span>
                    </div>
                    <p className="text-[11px] text-[#2b2b2b]">Prime Energy</p>
                    <span className="text-[10px] text-[#878787] font-mono">Aug 21, 2026</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#000000] font-medium">₦8,500,000</div>
                  <span className="inline-block text-[9px] text-[#244cff] bg-[#e8f8ff] px-2 py-0.5 rounded-[100px] mt-0.5 font-medium">
                    Tender
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* 4. MAGE DARK PRODUCT ISLAND FOR CASH FLOW */}
          <section className="bg-[#1d1f21] rounded-[12px] p-4 text-[#ffffff] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#ffffff] font-normal">Cash Flow Forecast</span>
              <span className="text-[10px] text-[#c3aeff] font-mono">₦15.7M Total</span>
            </div>

            <div className="h-32 w-full relative">
              <canvas ref={cashFlowRef} className="w-full h-full" />
            </div>

            <div className="pt-2 border-t border-[#ffffff]/10 grid grid-cols-3 text-center gap-1.5">
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[6px]">
                <div className="text-[9px] text-[#b0b0b0]">Expected</div>
                <div className="text-xs text-[#ffffff] font-normal">₦15.7M</div>
              </div>
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[6px]">
                <div className="text-[9px] text-[#c3aeff]">Collected</div>
                <div className="text-xs text-[#c3aeff] font-normal">₦8.92M</div>
              </div>
              <div className="bg-[#ffffff]/5 p-1.5 rounded-[6px]">
                <div className="text-[9px] text-[#b0b0b0]">Rate</div>
                <div className="text-xs text-[#ffffff] font-normal">71.4%</div>
              </div>
            </div>
          </section>

          {/* 5. RECENT ACTIVITY & AUDIT TRAIL AT THE BOTTOM */}
          <section className="space-y-2 pt-1">
            <h2 className="text-xs uppercase tracking-wider text-[#878787] font-normal px-1">Recent Activity</h2>

            <div className="bg-[#ffffff] rounded-[6px] p-3.5 border border-[#b0b0b0]/30 space-y-3">
              {/* Item 1 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#b0b0b0]/20">
                <div className="w-5 h-5 rounded-full bg-[#e8f8ff] border border-[#244cff] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#244cff]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#000000]">
                    Payment <span className="font-medium">₦540,000</span> for <span className="font-normal">Prime Energy</span>
                  </p>
                  <span className="text-[10px] text-[#878787]">12m ago</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#b0b0b0]/20">
                <div className="w-5 h-5 rounded-full bg-[#f7f7f1] border border-[#1d1f21] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-3 h-3 text-[#1d1f21]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#000000]">
                    <span>Zenith Mfg</span> viewed Invoice <span className="font-mono text-[10px]">#INV-000043</span>
                  </p>
                  <span className="text-[10px] text-[#878787]">1h ago</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#b0b0b0]/20">
                <div className="w-5 h-5 rounded-full bg-[#f7f7f1] border border-[#1d1f21] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-3 h-3 text-[#1d1f21]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#000000]">
                    Waybill <span className="font-mono text-[10px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span>
                  </p>
                  <span className="text-[10px] text-[#878787]">3h ago</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e8f8ff] border border-[#244cff] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#244cff]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#000000]">
                    Quotation <span className="font-mono text-[10px]">#QUO-000128</span> approved by <span>Apex Construction</span>
                  </p>
                  <span className="text-[10px] text-[#878787]">Yesterday 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="text-xs text-[#1d1f21] font-medium inline-flex items-center space-x-1.5 py-1.5 px-4 rounded-[100px] bg-[#ffffff] border border-[#1d1f21] transition-transform active:scale-95 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Open Compiled Audit Hub</span>
                <ArrowRight className="w-3 h-3 text-[#244cff]" />
              </button>
            </div>
          </section>

        </main>

        {/* FLOATING ELECTRIC COBALT CTA BUTTON */}
        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => showToast('Select Document Type to Create')}
            className="w-12 h-12 rounded-[100px] bg-[#244cff] text-[#ffffff] flex items-center justify-center transition-transform active:scale-95 shadow-lg"
            aria-label="Create Document"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* SIDE DRAWER COMPONENT */}
        <div
          className={`absolute inset-0 bg-[#1d1f21]/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[82%] max-w-[310px] bg-[#f7f7f1] text-[#1d1f21] z-50 transition-transform duration-350 ease-out flex flex-col justify-between p-4 border-r border-[#b0b0b0]/30 shadow-2xl ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            {/* Drawer Header (NO BLUE DOT) */}
            <div className="flex justify-between items-center pb-2 border-b border-[#b0b0b0]/30">
              <h3 className="text-base text-[#000000] font-normal tracking-tight uppercase">BIGDROPS</h3>
              <button
                onClick={toggleDrawer}
                className="p-1.5 rounded-[100px] bg-[#ffffff] text-[#1d1f21] transition-transform active:scale-95 border border-[#b0b0b0]/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tenant Switcher */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#878787] uppercase tracking-wider px-1 font-normal">Active Tenant</span>
              <button
                onClick={handleTenantSwitch}
                className="w-full bg-[#ffffff] border border-[#b0b0b0]/40 rounded-[6px] p-2.5 flex items-center justify-between text-left transition-colors hover:bg-[#e8f8ff]"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-[#244cff] shrink-0" />
                  <span className="text-xs font-medium text-[#000000] truncate">{activeTenant}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#878787] shrink-0 ml-1" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="bg-[#ffffff] border border-[#b0b0b0]/30 rounded-[6px] p-2.5 flex items-center space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Chinedu Okonkwo"
                className="w-9 h-9 rounded-full object-cover border border-[#1d1f21]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-[#000000] truncate">Chinedu Okonkwo</h4>
                <p className="text-[10px] text-[#878787] truncate">Operations Staff (Level 2)</p>
              </div>
            </div>

            {/* Drawer Module Links */}
            <div className="space-y-1 overflow-y-auto max-h-[360px] no-scrollbar pr-1">
              <div className="text-[10px] text-[#878787] uppercase tracking-wider mb-1 px-1 font-normal">Core Modules</div>

              <button
                onClick={() => handleModuleSelect('Invoices')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] bg-[#244cff] text-[#ffffff] text-xs font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-[#ffffff]" />
                <span>Invoices</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Quotations')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Quotations</span>
              </button>

              <button
                onClick={() => handleModuleSelect('CSR')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Customer Service Reports (CSR)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Waybills')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <Truck className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Waybills (Ext & Int)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Payments')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Payments Ledger</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Projects')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <FolderKanban className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Projects Engagement</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Clients')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <Users className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Client Management</span>
              </button>

              <div className="text-[10px] text-[#878787] uppercase tracking-wider mt-3 mb-1 px-1 font-normal">Management & Governance</div>

              <button
                onClick={() => handleModuleSelect('Compliance')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Compliance Hub</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Audit Hub')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Audit Hub & Token Ledger</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Item Library')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <Package className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Item Library</span>
              </button>

              <button
                onClick={() => handleModuleSelect('BOQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <Layers className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Bill of Quantities (BOQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('RFQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <FileQuestion className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Request for Quotation (RFQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Settings')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[100px] text-[#1d1f21] hover:bg-[#ffffff] text-xs font-normal"
              >
                <Settings className="w-3.5 h-3.5 text-[#244cff]" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Drawer Footer / Sign Out */}
          <div className="pt-3 border-t border-[#b0b0b0]/30 space-y-2">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                showToast('Signed out successfully');
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-[100px] bg-[#1d1f21] text-[#ffffff] text-xs font-medium transition-transform active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-[#c3aeff]" />
              <span>Sign Out</span>
            </button>
            <div className="text-center text-[10px] text-[#878787]">
              <span>BIGDROPS Systems v2.4</span>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-[#f7f7f1] border-t border-[#b0b0b0]/30 px-2 py-2 flex justify-around items-center z-30 shrink-0">
          <button className="flex flex-col items-center justify-center text-[#244cff] space-y-0.5 transition-transform active:scale-95 w-12">
            <LayoutDashboard className="w-4 h-4 text-[#244cff]" />
            <span className="text-[10px] font-medium text-[#244cff]">Home</span>
          </button>

          <button
            onClick={() => showToast('Switched to Documents')}
            className="flex flex-col items-center justify-center text-[#878787] hover:text-[#000000] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-normal">Docs</span>
          </button>

          <button
            onClick={() => showToast('Switched to Logistics')}
            className="flex flex-col items-center justify-center text-[#878787] hover:text-[#000000] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Truck className="w-4 h-4" />
            <span className="text-[10px] font-normal">Dispatch</span>
          </button>

          <button
            onClick={() => showToast('Switched to Projects')}
            className="flex flex-col items-center justify-center text-[#878787] hover:text-[#000000] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Folder className="w-4 h-4" />
            <span className="text-[10px] font-normal">Projects</span>
          </button>

          <button
            onClick={toggleDrawer}
            className="flex flex-col items-center justify-center text-[#878787] hover:text-[#000000] space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] font-normal">More</span>
          </button>
        </nav>

        {/* Home Indicator */}
        <div className="w-full bg-[#f7f7f1] pb-1.5 flex justify-center z-30">
          <div className="w-28 h-1 bg-[#1d1f21]/20 rounded-[100px]" />
        </div>

        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#1d1f21] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[100px] border border-[#b0b0b0]/30 z-50 flex items-center space-x-1.5">
            <ArrowRight className="w-3 h-3 text-[#244cff]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

```
