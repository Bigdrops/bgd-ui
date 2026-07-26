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
  HelpCircle,
  CreditCard,
  FolderKanban,
  Users,
  ShieldCheck,
  Package,
  Layers,
  FileKey2
} from 'lucide-react';
import Chart from 'chart.js/auto';

// Morphing Sidebar Path Definitions
const PANEL_CLOSED = "M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z";
const PANEL_OPEN = "M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sparkline Chart Canvas Refs
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
            tension: 0.3,
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

    // Render Sparkline Charts
    createSparkline(spark1Ref.current, [10, 14, 12, 18, 16, 22, 25], '#000000');
    createSparkline(spark2Ref.current, [4, 6, 8, 5, 9, 12, 9], '#ff6600');
    createSparkline(spark3Ref.current, [5, 8, 12, 14, 19, 22, 28], '#00cc88');
    createSparkline(spark4Ref.current, [12, 10, 14, 11, 8, 9, 6], '#ff6600');

    // Render Cash Flow Chart
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
                borderColor: '#ff6600',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.3,
                pointBackgroundColor: '#ff6600',
                pointRadius: 2.5
              },
              {
                label: 'Collected',
                data: [2.8, 5.9, 8.92, null],
                borderColor: '#5c2999',
                borderWidth: 2,
                backgroundColor: 'transparent',
                tension: 0.3,
                pointBackgroundColor: '#5c2999',
                pointRadius: 2.5
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
                ticks: { font: { family: 'Inter', size: 9 }, color: '#000000' }
              },
              y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                  font: { family: 'Inter', size: 9 },
                  color: '#000000',
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
    <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans antialiased tracking-[-0.02em]">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-[430px] h-[100vh] sm:h-[900px] bg-[#ffffff] relative overflow-hidden sm:rounded-[40px] border-0 sm:border-[8px] border-black flex flex-col justify-between">
        
        {/* Header Navigation */}
        <header className="bg-[#ffffff] px-4 py-3.5 flex items-center justify-between z-30 shrink-0 border-b border-[#e5e5e5]">
          <div className="flex items-center space-x-2.5">
            {/* Sidebar Toggle Icon Button */}
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-[24px] bg-[#ffffff] text-black transition-transform active:scale-95 border border-black flex items-center justify-center shadow-sm"
              aria-label="Toggle Sidebar Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black">
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
              <span className="font-medium text-black text-base tracking-tight uppercase">BIGDROPS</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              onClick={() => showToast('Search opened')}
              className="p-2 rounded-[800px] bg-[#f6f3ee] text-black hover:bg-[#e5e5e5] transition-transform active:scale-95 border border-[#e5e5e5] flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-black" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => showToast('8 notifications')}
              className="relative p-2 rounded-[800px] bg-[#f6f3ee] text-black hover:bg-[#e5e5e5] transition-transform active:scale-95 border border-[#e5e5e5] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-black" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff6600]" />
            </button>

            {/* Profile Avatar */}
            <div
              className="relative w-8 h-8 rounded-[800px] bg-[#f6f3ee] p-0.5 cursor-pointer transition-transform active:scale-95 border border-black"
              onClick={toggleDrawer}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Profile"
                className="w-full h-full rounded-[800px] object-cover"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3.5 space-y-4 pb-20">
          
          {/* 1. FINANCIAL OVERVIEW */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-tight text-[#888888] font-medium px-1">Financial Snapshot</h2>

            <div className="grid grid-cols-2 gap-2.5">
              {/* KPI 1 */}
              <div className="bg-[#f6f3ee] p-3.5 rounded-[24px] relative overflow-hidden flex flex-col justify-between shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
                <svg className="absolute -right-3 -bottom-3 w-16 h-16 opacity-15 text-[#aa8855]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="100" cy="100" r="80" />
                  <circle cx="100" cy="100" r="60" />
                  <circle cx="100" cy="100" r="40" />
                </svg>

                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs text-[#888888] font-medium">Outstanding</span>
                  <span className="bg-[#ffffff] text-black text-[10px] font-medium px-2 py-0.5 rounded-[800px] border border-[#e5e5e5]">48 Inv</span>
                </div>
                <div className="my-2 relative z-10">
                  <div className="text-xl text-black font-medium">₦12.54M</div>
                </div>
                <div className="h-4 w-full relative z-10">
                  <canvas ref={spark1Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-[#f6f3ee] p-3.5 rounded-[24px] relative overflow-hidden flex flex-col justify-between shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs text-[#888888] font-medium">Due This Week</span>
                  <span className="bg-[#ffffff] text-black text-[10px] font-medium px-2 py-0.5 rounded-[800px] border border-[#e5e5e5]">9 Inv</span>
                </div>
                <div className="my-2 relative z-10">
                  <div className="text-xl text-black font-medium">₦3.24M</div>
                </div>
                <div className="h-4 w-full relative z-10">
                  <canvas ref={spark2Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-[#f6f3ee] p-3.5 rounded-[24px] relative overflow-hidden flex flex-col justify-between shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs text-[#888888] font-medium">Payments Recv.</span>
                  <span className="bg-[#ebfef6] text-[#00cc88] text-[10px] font-medium px-2 py-0.5 rounded-[800px] border border-[#00cc88]/30">+14%</span>
                </div>
                <div className="my-2 relative z-10">
                  <div className="text-xl text-black font-medium">₦8.92M</div>
                </div>
                <div className="h-4 w-full relative z-10">
                  <canvas ref={spark3Ref} className="w-full h-full" />
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-[#f6f3ee] p-3.5 rounded-[24px] relative overflow-hidden flex flex-col justify-between shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs text-[#888888] font-medium">Overdue</span>
                  <span className="bg-[#ffffff] text-[#ff6600] text-[10px] font-medium px-2 py-0.5 rounded-[800px] border border-[#ff6600]/30">6 Inv</span>
                </div>
                <div className="my-2 relative z-10">
                  <div className="text-xl text-[#ff6600] font-medium">₦1.18M</div>
                </div>
                <div className="h-4 w-full relative z-10">
                  <canvas ref={spark4Ref} className="w-full h-full" />
                </div>
              </div>
            </div>
          </section>

          {/* 2. HIGH IMPACT ACTIONS */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-tight text-[#888888] font-medium px-1">Collect These First</h2>

            <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5">
              {/* Action Card 1 */}
              <div className="min-w-[250px] bg-[#f6f3ee] rounded-[24px] p-4 flex flex-col justify-between space-y-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] border border-[#e5e5e5]">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ffffff] text-[#ff6600] text-[10px] px-2.5 py-0.5 rounded-[800px] font-medium border border-[#ff6600]/20">
                    4 Days Overdue
                  </span>
                  <span className="text-[11px] font-mono text-[#888888]">#INV-000042</span>
                </div>
                <div>
                  <h3 className="text-xs text-black font-medium">Zenith Manufacturing Ltd</h3>
                  <div className="text-xl text-black font-medium mt-0.5">₦2,450,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#e5e5e5] flex items-center justify-between">
                  <span className="text-[11px] text-[#888888]">Due Aug 12</span>
                  <button
                    onClick={() => showToast('Reminder sent')}
                    className="bg-[#ff6600] text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-medium shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]"
                  >
                    <span>Remind</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action Card 2 */}
              <div className="min-w-[250px] bg-[#f6f3ee] rounded-[24px] p-4 flex flex-col justify-between space-y-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] border border-[#e5e5e5]">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ffffff] text-black text-[10px] px-2.5 py-0.5 rounded-[800px] font-medium border border-[#e5e5e5]">
                    Due Tomorrow
                  </span>
                  <span className="text-[11px] font-mono text-[#888888]">#INV-000048</span>
                </div>
                <div>
                  <h3 className="text-xs text-black font-medium">Nova Logistics</h3>
                  <div className="text-xl text-black font-medium mt-0.5">₦820,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#e5e5e5] flex items-center justify-between">
                  <span className="text-[11px] text-[#888888]">Due Aug 17</span>
                  <button
                    onClick={() => showToast('WhatsApp sent')}
                    className="bg-black text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-medium"
                  >
                    <span>WhatsApp</span>
                    <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                  </button>
                </div>
              </div>

              {/* Action Card 3 */}
              <div className="min-w-[250px] bg-[#f6f3ee] rounded-[24px] p-4 flex flex-col justify-between space-y-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] border border-[#e5e5e5]">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ffffff] text-black text-[10px] px-2.5 py-0.5 rounded-[800px] font-medium border border-[#e5e5e5]">
                    Awaiting Payment
                  </span>
                  <span className="text-[11px] font-mono text-[#888888]">#INV-000051</span>
                </div>
                <div>
                  <h3 className="text-xs text-black font-medium">Apex Construction</h3>
                  <div className="text-xl text-black font-medium mt-0.5">₦1,950,000</div>
                </div>
                <div className="pt-2.5 border-t border-[#e5e5e5] flex items-center justify-between">
                  <span className="text-[11px] text-[#888888]">Due Aug 22</span>
                  <button
                    onClick={() => showToast('Pay link copied')}
                    className="bg-[#ffffff] text-black text-xs px-3.5 py-1.5 rounded-[24px] transition-transform active:scale-95 flex items-center space-x-1 font-medium border border-black"
                  >
                    <span>Pay Link</span>
                    <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. RECENTLY CREATED DOCUMENTS (STRICTLY 6 DIFFERENT TYPES) */}
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-tight text-[#888888] font-medium px-1">Recently Created Documents</h2>

            <div className="bg-[#f6f3ee] rounded-[24px] border border-[#e5e5e5] divide-y divide-[#e5e5e5] overflow-hidden shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
              {/* Doc 1: Invoice */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Invoice #INV-000042')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">Invoice</span>
                      <span className="text-[10px] font-mono text-[#888888]">#INV-000042</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Zenith Manufacturing Ltd</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black font-medium">₦2,450,000</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    Active
                  </span>
                </div>
              </div>

              {/* Doc 2: Quotation */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Quotation #QUO-000128')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">Quotation</span>
                      <span className="text-[10px] font-mono text-[#888888]">#QUO-000128</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Apex Construction</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black font-medium">₦4,120,000</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    Approved
                  </span>
                </div>
              </div>

              {/* Doc 3: CSR */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening CSR #CSR-000089')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">CSR</span>
                      <span className="text-[10px] font-mono text-[#888888]">#CSR-000089</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">GreenFarm Foods</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black">Service Log</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    Signed
                  </span>
                </div>
              </div>

              {/* Doc 4: Waybill */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Waybill #WBL-E-000054')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">Waybill (Ext)</span>
                      <span className="text-[10px] font-mono text-[#888888]">#WBL-E-000054</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Nova Logistics</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black">14 Items</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    In Transit
                  </span>
                </div>
              </div>

              {/* Doc 5: Correspondence */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening Correspondence #COR-000031')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">Correspondence</span>
                      <span className="text-[10px] font-mono text-[#888888]">#COR-000031</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Sterling Supplies</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black">SLA Rev</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    Sent
                  </span>
                </div>
              </div>

              {/* Doc 6: RFQ */}
              <div
                className="p-3 flex items-center justify-between hover:bg-[#ffffff] transition-colors cursor-pointer active:scale-97"
                onClick={() => showToast('Opening RFQ #RFQ-000019')}
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-black font-medium">RFQ</span>
                      <span className="text-[10px] font-mono text-[#888888]">#RFQ-000019</span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Prime Energy</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-black font-medium">₦8,500,000</div>
                  <span className="inline-block text-[9px] text-black bg-[#ffffff] px-2 py-0.5 rounded-[800px] border border-[#e5e5e5] mt-0.5">
                    Tender
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. LAVENDER FEATURE PANEL FOR CASH FLOW */}
          <section className="bg-[#f6f1fe] rounded-[24px] p-4 border border-[#5c2999]/20 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] space-y-2.5 relative overflow-hidden">
            <div className="flex justify-between items-baseline relative z-10">
              <span className="text-xs text-black font-medium">Cash Flow Forecast</span>
              <span className="text-[10px] text-[#5c2999] font-mono">₦15.7M Total</span>
            </div>

            <div className="h-32 w-full relative z-10">
              <canvas ref={cashFlowRef} className="w-full h-full" />
            </div>

            <div className="pt-2 border-t border-[#5c2999]/10 grid grid-cols-3 text-center gap-1.5 relative z-10">
              <div className="bg-[#ffffff] p-1.5 rounded-[24px] border border-[#e5e5e5]">
                <div className="text-[9px] text-[#888888]">Expected</div>
                <div className="text-xs text-black font-medium">₦15.7M</div>
              </div>
              <div className="bg-[#ffffff] p-1.5 rounded-[24px] border border-[#e5e5e5]">
                <div className="text-[9px] text-[#5c2999] font-medium">Collected</div>
                <div className="text-xs text-[#5c2999] font-medium">₦8.92M</div>
              </div>
              <div className="bg-[#ffffff] p-1.5 rounded-[24px] border border-[#e5e5e5]">
                <div className="text-[9px] text-[#888888]">Rate</div>
                <div className="text-xs text-black font-medium">71.4%</div>
              </div>
            </div>
          </section>

          {/* 5. RECENT ACTIVITY & AUDIT TRAIL AT THE BOTTOM */}
          <section className="space-y-2 pt-1">
            <h2 className="text-xs uppercase tracking-tight text-[#888888] font-medium px-1">Recent Activity</h2>

            <div className="bg-[#f6f3ee] rounded-[24px] p-3.5 border border-[#e5e5e5] space-y-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)]">
              {/* Item 1 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#e5e5e5]">
                <div className="w-4 h-4 rounded-full bg-[#ebfef6] border border-[#00cc88] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00cc88]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-black">
                    Payment <span className="font-medium">₦540,000</span> for <span className="font-medium">Prime Energy</span>
                  </p>
                  <span className="text-[10px] text-[#888888]">12m ago</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#e5e5e5]">
                <div className="w-4 h-4 rounded-full bg-[#ffffff] border border-black flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-2.5 h-2.5 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-black">
                    <span>Zenith Mfg</span> viewed Invoice <span className="font-mono text-[10px]">#INV-000043</span>
                  </p>
                  <span className="text-[10px] text-[#888888]">1h ago</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-2.5 pb-2.5 border-b border-[#e5e5e5]">
                <div className="w-4 h-4 rounded-full bg-[#ffffff] border border-black flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-2.5 h-2.5 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-black">
                    Waybill <span className="font-mono text-[10px]">#WBL-E-000054</span> generated for <span>Nova Logistics</span>
                  </p>
                  <span className="text-[10px] text-[#888888]">3h ago</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-2.5">
                <div className="w-4 h-4 rounded-full bg-[#f6f1fe] border border-[#5c2999] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[#5c2999]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-black">
                    Quotation <span className="font-mono text-[10px]">#QUO-000128</span> approved by <span>Apex Construction</span>
                  </p>
                  <span className="text-[10px] text-[#888888]">Yesterday 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => showToast('Audit log token ledger opened')}
                className="text-xs text-black font-medium inline-flex items-center space-x-1 py-1.5 px-4 rounded-[24px] bg-[#ffffff] border border-black shadow-sm transition-transform active:scale-95"
              >
                <span>Full Audit Trail Log</span>
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
              </button>
            </div>
          </section>

        </main>

        {/* FLOATING PRIMARY CTA BUTTON */}
        <div className="absolute bottom-16 right-4 z-30">
          <button
            onClick={() => showToast('Select Document Type')}
            className="w-12 h-12 rounded-[24px] bg-[#ff6600] text-[#ffffff] flex items-center justify-center transition-transform active:scale-95 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]"
            aria-label="Create Document"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* SIDE DRAWER */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-[#ffffff] text-black z-50 transition-transform duration-350 ease-out flex flex-col justify-between p-4 border-r border-[#e5e5e5] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6600]" />
                <h3 className="text-base text-black font-medium tracking-tight uppercase">BIGDROPS</h3>
              </div>
              <button
                onClick={toggleDrawer}
                className="p-1.5 rounded-[24px] bg-[#f6f3ee] text-black transition-transform active:scale-95 border border-[#e5e5e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Module Links */}
            <div className="space-y-1 overflow-y-auto max-h-[560px] no-scrollbar pr-1">
              <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-2 px-1 font-medium">Core Modules</div>

              <button
                onClick={() => handleModuleSelect('Invoices')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] bg-[#f6f3ee] text-black text-xs font-medium border border-[#e5e5e5]"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Invoices</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Quotations')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Quotations</span>
              </button>

              <button
                onClick={() => handleModuleSelect('CSR')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Customer Service Reports (CSR)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Waybills')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Waybills (Ext & Int)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Payments')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Payments Ledger</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Projects')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Projects Engagement</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Clients')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Client Management</span>
              </button>

              <div className="text-[10px] text-[#888888] uppercase tracking-wider mt-3 mb-2 px-1 font-medium">Management & Audit</div>

              <button
                onClick={() => handleModuleSelect('Compliance')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Compliance Hub</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Item Library')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Item Library</span>
              </button>

              <button
                onClick={() => handleModuleSelect('BOQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Bill of Quantities (BOQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('RFQ')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Request for Quotation (RFQ)</span>
              </button>

              <button
                onClick={() => handleModuleSelect('Audit Logs')}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-[24px] text-black hover:bg-[#f6f3ee] text-xs font-medium"
              >
                <ArrowRight className="w-3 h-3 text-[#ff6600]" />
                <span>Blank Waybill Token Audit</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e5e5e5] text-center text-xs text-[#888888]">
            <span>BIGDROPS Operations</span>
          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-[#ffffff] border-t border-[#e5e5e5] px-2 py-2 flex justify-around items-center z-30 shrink-0">
          <button className="flex flex-col items-center justify-center text-black space-y-0.5 transition-transform active:scale-95 w-12">
            <LayoutDashboard className="w-4 h-4 text-[#ff6600]" />
            <span className="text-[10px] font-medium text-black">Home</span>
          </button>

          <button
            onClick={() => showToast('Switched to Documents')}
            className="flex flex-col items-center justify-center text-[#888888] hover:text-black space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-medium">Docs</span>
          </button>

          <button
            onClick={() => showToast('Switched to Logistics')}
            className="flex flex-col items-center justify-center text-[#888888] hover:text-black space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Truck className="w-4 h-4" />
            <span className="text-[10px] font-medium">Dispatch</span>
          </button>

          <button
            onClick={() => showToast('Switched to Projects')}
            className="flex flex-col items-center justify-center text-[#888888] hover:text-black space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Folder className="w-4 h-4" />
            <span className="text-[10px] font-medium">Projects</span>
          </button>

          <button
            onClick={toggleDrawer}
            className="flex flex-col items-center justify-center text-[#888888] hover:text-black space-y-0.5 transition-transform active:scale-95 w-12"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </nav>

        {/* Home Indicator Bar */}
        <div className="w-full bg-[#ffffff] pb-1.5 flex justify-center z-30">
          <div className="w-28 h-1 bg-black/20 rounded-[800px]" />
        </div>

        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black text-[#ffffff] text-xs px-3.5 py-1.5 rounded-[24px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.08)] z-50 flex items-center space-x-1.5 border border-[#e5e5e5]">
            <ArrowRight className="w-3 h-3 text-[#ff6600]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}