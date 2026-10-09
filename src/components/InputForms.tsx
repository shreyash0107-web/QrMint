import type { QRData, QRDataType } from '../types';
import { Link, Type, Mail, Phone, Wifi, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFormsProps {
  data: QRData;
  onChange: (data: QRData) => void;
}

const TABS: { id: QRDataType; label: string; icon: React.FC<any> }[] = [
  { id: 'url', label: 'URL', icon: Link },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export function InputForms({ data, onChange }: InputFormsProps) {
  const handleTypeChange = (type: QRDataType) => {
    onChange({ ...data, type });
  };

  const formAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10, position: "absolute" as any },
    transition: { duration: 0.2, ease: "easeOut" as const }
  };

  return (
    <div className="space-y-10">
      {/* Step 1: Select Content Type */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Select Content Type</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = data.type === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTypeChange(tab.id)}
                className={`relative flex flex-col items-center justify-center p-4 gap-3 rounded-2xl border-2 transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 text-blue-500">
                    <CheckCircle2 size={16} className="fill-blue-100 dark:fill-blue-900" />
                  </div>
                )}
                <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-sm font-semibold ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Enter Content Information */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">2</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Enter Content Information</h2>
        </div>
        
        <div className="card-panel p-6 sm:p-8 relative min-h-[160px]">
          <AnimatePresence mode="wait">
            {data.type === 'url' && (
              <motion.div key="url" {...formAnimation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Website URL</label>
                  <input
                    type="url"
                    placeholder="Enter Website URL"
                    value={data.url || ''}
                    onChange={(e) => onChange({ ...data, url: e.target.value })}
                    className="input-clean w-full"
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Your QR code will direct users to this web address.</p>
                </div>
              </motion.div>
            )}

            {data.type === 'text' && (
              <motion.div key="text" {...formAnimation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Plain Text</label>
                  <textarea
                    rows={4}
                    placeholder="Enter your message here..."
                    value={data.text || ''}
                    onChange={(e) => onChange({ ...data, text: e.target.value })}
                    className="input-clean w-full resize-none"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-2 font-medium">
                    {(data.text || '').length} characters
                  </div>
                </div>
              </motion.div>
            )}

            {data.type === 'email' && (
              <motion.div key="email" {...formAnimation} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    value={data.email?.to || ''}
                    onChange={(e) => onChange({ ...data, email: { ...data.email, to: e.target.value, subject: data.email?.subject || '', body: data.email?.body || '' } })}
                    className="input-clean w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Email Subject"
                    value={data.email?.subject || ''}
                    onChange={(e) => onChange({ ...data, email: { ...data.email, to: data.email?.to || '', subject: e.target.value, body: data.email?.body || '' } })}
                    className="input-clean w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Message Body</label>
                  <textarea
                    rows={3}
                    placeholder="Write your message..."
                    value={data.email?.body || ''}
                    onChange={(e) => onChange({ ...data, email: { ...data.email, to: data.email?.to || '', subject: data.email?.subject || '', body: e.target.value } })}
                    className="input-clean w-full resize-none"
                  />
                </div>
              </motion.div>
            )}

            {data.type === 'phone' && (
              <motion.div key="phone" {...formAnimation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your Phone Number"
                    value={data.phone || ''}
                    onChange={(e) => onChange({ ...data, phone: e.target.value })}
                    className="input-clean w-full"
                  />
                </div>
              </motion.div>
            )}

            {data.type === 'wifi' && (
              <motion.div key="wifi" {...formAnimation} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Network Name (SSID)</label>
                  <input
                    type="text"
                    placeholder="My WiFi Network"
                    value={data.wifi?.ssid || ''}
                    onChange={(e) => onChange({ ...data, wifi: { ...data.wifi, ssid: e.target.value, encryption: data.wifi?.encryption || 'WPA', hidden: data.wifi?.hidden || false } })}
                    className="input-clean w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Network Password"
                    value={data.wifi?.password || ''}
                    onChange={(e) => onChange({ ...data, wifi: { ...data.wifi, ssid: data.wifi?.ssid || '', password: e.target.value, encryption: data.wifi?.encryption || 'WPA', hidden: data.wifi?.hidden || false } })}
                    className="input-clean w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Encryption</label>
                    <select
                      value={data.wifi?.encryption || 'WPA'}
                      onChange={(e) => onChange({ ...data, wifi: { ...data.wifi, ssid: data.wifi?.ssid || '', encryption: e.target.value as any, hidden: data.wifi?.hidden || false } })}
                      className="input-clean w-full appearance-none cursor-pointer"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-2 sm:pt-7">
                    <label className="flex items-center gap-3 text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-200 group">
                      <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-500 transition-colors">
                        <input
                          type="checkbox"
                          checked={data.wifi?.hidden || false}
                          onChange={(e) => onChange({ ...data, wifi: { ...data.wifi, ssid: data.wifi?.ssid || '', encryption: data.wifi?.encryption || 'WPA', hidden: e.target.checked } })}
                          className="opacity-0 absolute inset-0 cursor-pointer"
                        />
                        {data.wifi?.hidden && <div className="w-3 h-3 bg-blue-500 rounded-sm" />}
                      </div>
                      Hidden Network
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
