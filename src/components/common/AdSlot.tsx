import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'banner-horizontal' | 'rectangle-medium' | 'inline-guide';
  className?: string;
  enabled?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  format = 'banner-horizontal',
  className = '',
  enabled = true,
}) => {
  if (!enabled) return null;

  // Reserved min-heights matching IAB standard ad sizes to completely prevent Cumulative Layout Shift (CLS)
  const formatConfigs = {
    'banner-horizontal': {
      minHeight: '90px',
      maxWidth: '728px',
      label: 'Advertisement',
      aspect: '728/90',
    },
    'rectangle-medium': {
      minHeight: '250px',
      maxWidth: '300px',
      label: 'Advertisement',
      aspect: '300/250',
    },
    'inline-guide': {
      minHeight: '100px',
      maxWidth: '100%',
      label: 'Sponsor Message',
      aspect: 'auto',
    },
  };

  const config = formatConfigs[format];

  return (
    <aside
      aria-label="Advertisement container"
      className={`my-6 mx-auto w-full flex flex-col items-center justify-center ${className}`}
      style={{ maxWidth: config.maxWidth }}
    >
      <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8A8F95] font-medium mb-1 px-1">
        <span>{config.label}</span>
        <span className="text-[9px] text-[#A6ABB0]">Reserved Placement</span>
      </div>

      <div
        className="w-full rounded border border-[#E9E4DF] bg-[#F7F5F2] flex flex-col items-center justify-center text-center p-4 text-[#7A8086] transition-colors"
        style={{ minHeight: config.minHeight }}
      >
        <div className="text-xs font-medium text-[#5A6066]">
          Clean Ad Space (Reserved)
        </div>
        <p className="text-[11px] text-[#8C9298] max-w-sm mt-0.5">
          Non-intrusive placement configured for official Google AdSense and verified educational sponsors.
        </p>
      </div>
    </aside>
  );
};
