import { useState } from 'react';
import type { QRHistoryItem, QRData } from '../types';
import { Clock, Trash2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface HistoryDrawerProps {
  history: QRHistoryItem[];
  onSelect: (item: QRHistoryItem) => void;
  onClear: () => void;
}

export function HistoryDrawer({ history, onSelect, onClear }: HistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const getLabel = (data: QRData) => {
    switch(data.type) {
      case 'url': return data.url || 'Empty URL';
      case 'text': return data.text ? data.text.substring(0, 20) + (data.text.length > 20 ? '...' : '') : 'Empty Text';
      case 'email': return data.email?.to || 'Empty Email';
      case 'phone': return data.phone || 'Empty Phone';
      case 'wifi': return data.wifi?.ssid || 'Empty WiFi';
      default: return 'Unknown';
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">4</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent QR Codes</h2>
      </div>

      <div className="card-panel overflow-hidden">
        <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
              <Clock size={18} />
            </div>
            View History ({history.length})
            {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          
          <button 
            onClick={onClear}
            className="text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 bg-slate-50 dark:bg-slate-950 space-y-3 max-h-[300px] overflow-y-auto">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {item.qrData.type}
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                        {getLabel(item.qrData)}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <ArrowRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
