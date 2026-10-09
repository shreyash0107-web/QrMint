import type { QRData } from '../types';

export const formatQRData = (data: QRData): string => {
  switch (data.type) {
    case 'url': {
      if (!data.url) return '';
      let url = data.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return url;
    }
    case 'text':
      return data.text || '';
    case 'email': {
      const email = data.email;
      if (!email || !email.to) return '';
      const cleanEmail = email.to.trim();
      if (!cleanEmail) return '';
      
      const subject = email.subject || '';
      const body = email.body || '';
      
      const params: string[] = [];
      if (subject.trim()) {
        params.push(`subject=${encodeURIComponent(subject.trim())}`);
      }
      if (body.trim()) {
        params.push(`body=${encodeURIComponent(body.trim())}`);
      }
      
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${cleanEmail}${queryString}`;
    }
    case 'phone':
      return data.phone ? `tel:${data.phone.trim()}` : '';
    case 'wifi': {
      const wifi = data.wifi;
      if (!wifi || !wifi.ssid) return '';
      const t = wifi.encryption === 'nopass' ? '' : wifi.encryption;
      const p = wifi.password || '';
      const h = wifi.hidden ? 'true' : 'false';
      return `WIFI:T:${t};S:${wifi.ssid};P:${p};H:${h};;`;
    }
    default:
      return '';
  }
};
