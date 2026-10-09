import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const GoogleAd: React.FC = () => {
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, []);

  return (
    <div className="w-full shrink-0 px-4 pb-2 pt-1">
      <ins
        className="adsbygoogle block min-h-[90px] w-full overflow-hidden rounded-2xl bg-white/[0.02]"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1736883984616829"
        data-ad-slot="7266691398"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAd;
