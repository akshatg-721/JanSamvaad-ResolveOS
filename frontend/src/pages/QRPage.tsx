import { QrCode, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QRPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans flex flex-col items-center">
      {/* Non-printable controls */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-12 print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          <Printer size={16} />
          Print Poster
        </button>
      </div>

      {/* Printable Poster Content */}
      <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-white border-[12px] border-black p-12 flex flex-col items-center justify-between shadow-2xl print:shadow-none print:border-[8px]">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-2xl rounded-xl">JS</div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">JanSamvaad</h1>
          </div>
          <p className="text-xl font-bold tracking-[0.2em] text-gray-400 uppercase">Municipal ResolveOS</p>
        </div>

        {/* Action Call */}
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-black leading-tight max-w-[15ch]">REPORT CIVIC ISSUES INSTANTLY</h2>
          <p className="text-2xl font-medium text-gray-600">Scan to initiate a voice report with your local ward operator</p>
        </div>

        {/* QR Code Placeholder (Using an SVG representation) */}
        <div className="relative p-8 border-4 border-black rounded-3xl">
          <QrCode size={320} strokeWidth={1.5} className="text-black" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-2">
               <div className="w-16 h-16 bg-black flex items-center justify-center text-white font-black text-xl rounded-lg">JS</div>
             </div>
          </div>
        </div>

        {/* Manual Number */}
        <div className="text-center space-y-2">
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Or Call Directly</p>
           <p className="text-4xl font-black font-mono tracking-tighter text-black">+1 (555) 012-3456</p>
        </div>

        {/* Footer */}
        <div className="w-full border-t-2 border-dashed border-gray-200 pt-8 flex justify-between items-end">
           <div className="space-y-1">
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Protocol</p>
             <p className="text-xs font-mono font-bold">ALPHA-7-RESOLVE-992</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Deployment City</p>
             <p className="text-xs font-bold font-serif italic text-black">New Delhi Municipal Council</p>
           </div>
        </div>

      </div>

      {/* Print Instructions */}
      <div className="mt-8 text-center print:hidden">
        <p className="text-sm text-gray-400 font-medium italic">Optimized for A4 Portrait paper. Use "Background Graphics" in print settings.</p>
      </div>
    </div>
  );
}
