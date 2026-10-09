import { useState } from 'react';
import type { QRSettings } from '../types';
import { PRESETS } from '../utils/presets';
import { Palette, Box, SlidersHorizontal, Image as ImageIcon, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CustomizationPanelProps {
  settings: QRSettings;
  onChange: (settings: QRSettings) => void;
}

export function CustomizationPanel({ settings, onChange }: CustomizationPanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>('colors');

  const applyPreset = (presetSettings: Partial<QRSettings>) => {
    onChange({ ...settings, ...presetSettings });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...settings, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSection = (id: string) => {
    setActiveSection(prev => prev === id ? null : id);
  };

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'shapes', label: 'Design Shapes', icon: Box },
    { id: 'logo', label: 'Logo / Image', icon: ImageIcon },
    { id: 'options', label: 'Advanced Options', icon: SlidersHorizontal },
    { id: 'presets', label: 'Quick Presets', icon: LayoutGrid },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">3</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Design & Customization</h2>
      </div>

      <div className="card-panel overflow-hidden">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isOpen = activeSection === section.id;
          
          return (
            <div key={section.id} className={`${index !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{section.label}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 bg-white dark:bg-slate-900">
                      
                      {section.id === 'colors' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">QR Color (Foreground)</label>
                            <div className="flex gap-4 items-center">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                <input
                                  type="color"
                                  value={settings.dotsOptions.color}
                                  onChange={(e) => onChange({ 
                                    ...settings, 
                                    dotsOptions: { ...settings.dotsOptions, color: e.target.value } 
                                  })}
                                  className="absolute inset-[-10px] w-20 h-20 cursor-pointer border-0 p-0"
                                />
                              </div>
                              <input 
                                type="text" 
                                value={settings.dotsOptions.color}
                                onChange={(e) => onChange({ 
                                  ...settings, 
                                  dotsOptions: { ...settings.dotsOptions, color: e.target.value } 
                                })}
                                className="input-clean flex-1 font-mono uppercase text-sm" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Background Color</label>
                            <div className="flex gap-4 items-center">
                              <div className={`relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 ${settings.backgroundOptions.transparent ? 'opacity-50 grayscale' : ''}`}>
                                <input
                                  type="color"
                                  value={settings.backgroundOptions.color === 'transparent' ? '#ffffff' : settings.backgroundOptions.color}
                                  disabled={settings.backgroundOptions.transparent}
                                  onChange={(e) => onChange({ 
                                    ...settings, 
                                    backgroundOptions: { color: e.target.value, transparent: false } 
                                  })}
                                  className="absolute inset-[-10px] w-20 h-20 cursor-pointer border-0 p-0"
                                />
                              </div>
                              <div className="flex-1 flex flex-col gap-2">
                                <label className="flex items-center gap-3 text-sm font-medium cursor-pointer text-slate-700 group">
                                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-500 transition-colors">
                                    <input 
                                      type="checkbox"
                                      checked={settings.backgroundOptions.transparent || false}
                                      onChange={(e) => onChange({
                                        ...settings,
                                        backgroundOptions: { ...settings.backgroundOptions, transparent: e.target.checked, color: e.target.checked ? 'transparent' : '#ffffff' }
                                      })}
                                      className="opacity-0 absolute inset-0 cursor-pointer"
                                    />
                                    {settings.backgroundOptions.transparent && <div className="w-3 h-3 bg-blue-500 rounded-sm" />}
                                  </div>
                                  <span className="text-slate-700 dark:text-slate-200">Transparent Background</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'shapes' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Dot Pattern</label>
                            <select
                              value={settings.dotsOptions.type}
                              onChange={(e) => onChange({
                                ...settings,
                                dotsOptions: { ...settings.dotsOptions, type: e.target.value as any }
                              })}
                              className="input-clean w-full appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]"
                            >
                              <option value="square">Square</option>
                              <option value="dots">Dots</option>
                              <option value="rounded">Rounded</option>
                              <option value="extra-rounded">Extra Rounded</option>
                              <option value="classy">Classy</option>
                              <option value="classy-rounded">Classy Rounded</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Corner Square Style</label>
                            <select
                              value={settings.cornersSquareOptions?.type || 'square'}
                              onChange={(e) => onChange({
                                ...settings,
                                cornersSquareOptions: { ...settings.cornersSquareOptions, type: e.target.value as any }
                              })}
                              className="input-clean w-full appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]"
                            >
                              <option value="square">Square</option>
                              <option value="dot">Dot</option>
                              <option value="extra-rounded">Extra Rounded</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {section.id === 'logo' && (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Embed Logo</label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="flex flex-col items-center justify-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full group-hover:scale-110 transition-transform">
                                  <ImageIcon size={24} />
                                </div>
                                <div>
                                  <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span>
                                  <span className="text-slate-500 dark:text-slate-400"> or drag and drop</span>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, SVG (Max. 2MB)</p>
                              </div>
                            </div>
                            
                            {settings.image && (
                              <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-1">
                                    <img src={settings.image} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Custom Logo Embedded</span>
                                </div>
                                <button 
                                  onClick={() => onChange({ ...settings, image: undefined })}
                                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {section.id === 'options' && (
                        <div className="space-y-8">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Error Correction Level (ECC)</label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Higher correction helps scanners read the code if it gets damaged or if you embed a logo.</p>
                            <select
                              value={settings.qrOptions.errorCorrectionLevel}
                              onChange={(e) => onChange({
                                ...settings,
                                qrOptions: { errorCorrectionLevel: e.target.value as any }
                              })}
                              className="input-clean w-full appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]"
                            >
                              <option value="L">Low (7%) - Least reliable for logos</option>
                              <option value="M">Medium (15%)</option>
                              <option value="Q">Quartile (25%) - Recommended</option>
                              <option value="H">High (30%) - Most reliable</option>
                            </select>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm font-semibold mb-3">
                              <label className="text-slate-700 dark:text-slate-200">Resolution Size</label>
                              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-xs">{settings.width} px</span>
                            </div>
                            <input
                              type="range"
                              min="200"
                              max="1000"
                              step="50"
                              value={settings.width}
                              onChange={(e) => onChange({ ...settings, width: Number(e.target.value), height: Number(e.target.value) })}
                              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm font-semibold mb-3">
                              <label className="text-slate-700 dark:text-slate-200">Padding (Quiet Zone Margin)</label>
                              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-xs">{settings.margin} px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="5"
                              value={settings.margin}
                              onChange={(e) => onChange({ ...settings, margin: Number(e.target.value) })}
                              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                      )}

                      {section.id === 'presets' && (
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => applyPreset(preset.settings)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all text-sm font-medium text-slate-600 dark:text-slate-300 group shadow-sm hover:shadow-md"
                              >
                                <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: preset.settings.dotsOptions?.color || '#000000' }}>
                                  <Palette size={18} className={preset.settings.dotsOptions?.color === '#ffffff' ? 'text-slate-400' : 'text-white'} />
                                </div>
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
