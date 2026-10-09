import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRSettings, QRDataType } from '../types';
import { isContrastValid, isInverted, getContrastRatio } from '../utils/contrast';
import { Download, Copy, CheckCircle2, Info, ChevronDown, Smartphone, QrCode } from 'lucide-react';

interface QRPreviewProps {
  settings: QRSettings;
  qrType?: QRDataType | string;
}

export function QRPreview({ settings, qrType }: QRPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling(settings));
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  useEffect(() => {
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    if (settings.backgroundOptions.transparent) {
      qrCode.current.update({
        ...settings,
        backgroundOptions: { ...settings.backgroundOptions, color: 'transparent' }
      });
    } else {
      qrCode.current.update(settings);
    }
  }, [settings]);

  const handleDownload = () => {
    qrCode.current.download({ extension: downloadFormat });
  };

  const handleCopy = async () => {
    try {
      const blob = await qrCode.current.getRawData('png');
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Clipboard copy failed. Please try downloading instead.');
    }
  };

  const bgCol = settings.backgroundOptions.transparent ? '#ffffff' : settings.backgroundOptions.color;
  const fgCol = settings.dotsOptions.color;
  const contrastRatio = getContrastRatio(fgCol, bgCol);
  const isValid = isContrastValid(fgCol, bgCol);
  const isInvertedColors = isInverted(fgCol, bgCol);
  
  const eccWarning = settings.image && settings.qrOptions.errorCorrectionLevel === 'L';

  const hasData = settings.data && settings.data.trim() !== '';

  // Determine Reliability Score
  let scoreText = 'Excellent';
  let scoreColor = 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800/50';
  
  if (!hasData) {
    scoreText = 'Pending Data';
    scoreColor = 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  } else if (!isValid) {
    scoreText = 'Poor (Unreadable)';
    scoreColor = 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50';
  } else if (contrastRatio < 4.5 || isInvertedColors || eccWarning) {
    scoreText = 'Good (With warnings)';
    scoreColor = 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50';
  }

  return (
    <div className="space-y-6">
      {/* Mockup Frame Container */}
      <div className="relative mx-auto w-full max-w-sm">
        {/* Mobile Mockup Shell */}
        <div className="relative rounded-[2.5rem] bg-white dark:bg-slate-900 border-[8px] border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden aspect-[4/5] flex flex-col pt-8">
          
          {/* Top Notch / Speaker Mockup */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded-b-xl"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative">
            {/* Scan Me Badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
              Scan Me
            </div>
            
            {/* QR Canvas Container with fixed padding */}
            <div 
              className="mt-6 rounded-2xl overflow-hidden bg-white dark:bg-white shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center relative p-2"
              style={{ width: '100%', aspectRatio: '1/1' }}
            >
              <div 
                ref={ref} 
                className="w-full h-full flex items-center justify-center"
                style={{ display: (!settings.data || settings.data.trim() === '') ? 'none' : 'flex' }}
              />
              {(!settings.data || settings.data.trim() === '') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-3">
                    <QrCode size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No content</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enter data to generate QR</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom App-like bar */}
          <div className="h-14 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-slate-300 dark:text-slate-600">
            <Smartphone size={20} />
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
          </div>
        </div>
      </div>

      {/* Quality & Actions */}
      <div className="card-panel p-5 space-y-5">
        
        {/* Scan Quality Meter */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Scan Reliability</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${scoreColor}`}>
            {scoreText}
          </span>
        </div>

        {/* Warnings List */}
        {hasData && (!isValid || isInvertedColors || eccWarning) && (
          <div className="space-y-2">
            {!isValid && <p className="text-xs text-red-600 dark:text-red-400 font-medium">⚠️ Contrast is too low for scanners.</p>}
            {isInvertedColors && <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ Inverted colors (light on dark) may fail on native scanners.</p>}
            {eccWarning && <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ Low ECC used with a logo. Increase to Q or H.</p>}
          </div>
        )}

        {qrType === 'text' && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-800 dark:text-blue-300">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Note:</strong> Plain text QR codes will prompt scanners to copy or search the text.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} /> Download
            </button>
            <div className="relative">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as any)}
                className="appearance-none h-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 pr-8 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors uppercase"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <button
            onClick={handleCopy}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {copied ? <CheckCircle2 size={18} className="text-green-600 dark:text-green-500" /> : <Copy size={18} className="text-slate-400 dark:text-slate-500" />}
            {copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
