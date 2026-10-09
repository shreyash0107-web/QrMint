import { useState, useEffect, useCallback } from 'react';
import { QrCode, Moon, Sun } from 'lucide-react';
import type { QRData, QRSettings, QRHistoryItem } from './types';
import { formatQRData } from './utils/qrFormatter';
import { useLocalStorage } from './hooks/useLocalStorage';

import { InputForms } from './components/InputForms';
import { CustomizationPanel } from './components/CustomizationPanel';
import { QRPreview } from './components/QRPreview';
import { HistoryDrawer } from './components/HistoryDrawer';

const defaultSettings: QRSettings = {
  width: 300,
  height: 300,
  data: '',
  dotsOptions: { color: '#0f172a', type: 'rounded' },
  backgroundOptions: { color: '#ffffff', transparent: false },
  cornersSquareOptions: { type: 'extra-rounded', color: '#0f172a' },
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5, crossOrigin: 'anonymous' },
  qrOptions: { errorCorrectionLevel: 'Q' },
  margin: 20,
};

const defaultData: QRData = {
  type: 'url',
  url: ''
};

function App() {
  const [qrData, setQrData] = useState<QRData>(defaultData);
  const [settings, setSettings] = useState<QRSettings>({
    ...defaultSettings,
    data: formatQRData(defaultData)
  });
  
  const [history, setHistory] = useLocalStorage<QRHistoryItem[]>('qr-history', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('qr-theme-dark', false);

  // Sync formatted data when inputs change
  useEffect(() => {
    const formattedData = formatQRData(qrData);
    if (formattedData !== settings.data) {
      setSettings(prev => ({ ...prev, data: formattedData || ' ' }));
    }
  }, [qrData, settings.data]);

  // Handle dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Debounced save to history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!settings.data || settings.data === ' ' || settings.data === 'https://') return;
      
      setHistory(prev => {
        if (prev.length > 0) {
          const last = prev[0];
          if (JSON.stringify(last.qrData) === JSON.stringify(qrData) && 
              JSON.stringify(last.settings) === JSON.stringify(settings)) {
            return prev;
          }
        }
        
        const newItem: QRHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          qrData,
          settings,
        };
        
        return [newItem, ...prev].slice(0, 10);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [qrData, settings, setHistory]);

  const handleHistorySelect = useCallback((item: QRHistoryItem) => {
    setQrData(item.qrData);
    setSettings(item.settings);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return (
    <div className="min-h-screen transition-colors duration-200 relative selection:bg-blue-500/20">
      
      {/* Background Dots */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-10" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <QrCode size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">QRMint</h1>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Multi-Step Flow */}
          <div className="flex-1 w-full max-w-3xl space-y-10">
            <InputForms data={qrData} onChange={setQrData} />
            <CustomizationPanel settings={settings} onChange={setSettings} />
            <HistoryDrawer 
              history={history} 
              onSelect={handleHistorySelect} 
              onClear={handleClearHistory} 
            />
          </div>

          {/* Right Column: Live Preview Sticky */}
          <div className="w-full lg:w-[420px] shrink-0 sticky top-24">
            <QRPreview settings={settings} qrType={qrData.type} />
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
