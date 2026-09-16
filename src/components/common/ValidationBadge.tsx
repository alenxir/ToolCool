import React from 'react';
import { Check, X, Wand2 } from 'lucide-react';
import { ValidationResult } from '../../types';

interface ValidationBadgeProps {
  title?: string;
  result: ValidationResult;
  onAutoFix?: () => void;
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  title = 'DOCUMENT CHECK',
  result,
  onAutoFix,
  className = '',
}) => {
  const hasFailures = result.checks.some((c) => !c.passed);
  const fixableCount = result.checks.filter((c) => !c.passed && c.fixable).length;

  return (
    <div
      className={`rounded-lg border bg-[#FFFFFF] p-4 text-xs transition-colors duration-200 ${
        hasFailures ? 'border-[#E2D9D2] shadow-xs' : 'border-[#CDE3D5] bg-[#F9FCFA]'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F0EBE5]">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase text-[#181A1B]">
            {title}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              result.valid
                ? 'bg-[#E7F5ED] text-[#1E7245]'
                : 'bg-[#FDF0EC] text-[#B83E1C]'
            }`}
          >
            {result.valid ? 'Verified Ready' : 'Needs Adjustment'}
          </span>
        </div>

        {hasFailures && fixableCount > 0 && onAutoFix && (
          <button
            type="button"
            onClick={onAutoFix}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181A1B] hover:bg-[#2C2F33] active:scale-97 text-white text-[11px] font-medium transition-all duration-150 cursor-pointer shadow-xs"
          >
            <Wand2 className="w-3 h-3 text-[#E87A38]" />
            <span>Fix automatically</span>
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {result.checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start justify-between gap-3 text-[#3B4045]"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white ${
                  check.passed ? 'bg-[#22864C]' : 'bg-[#C84125]'
                }`}
              >
                {check.passed ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                )}
              </span>
              <span className="font-medium">{check.label}</span>
            </div>

            <div className="text-right">
              <span
                className={`font-mono text-[11px] ${
                  check.passed ? 'text-[#22864C]' : 'text-[#C84125] font-semibold'
                }`}
              >
                {check.currentValue}
              </span>
              {!check.passed && check.expectedValue && (
                <span className="text-[10px] text-[#71767B] block">
                  Req: {check.expectedValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
