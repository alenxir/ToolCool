import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Maximize,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Wand2
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../utils/audio';

interface CalculatorWorkspaceProps {
  initialCalc?: 'age-calculator' | 'aspect-ratio' | 'dpi-calculator' | 'unit-converter';
  onNavigateTool?: (slug: string) => void;
}

export const CalculatorWorkspace: React.FC<CalculatorWorkspaceProps> = ({
  initialCalc = 'age-calculator',
  onNavigateTool,
}) => {
  const [activeTab, setActiveTab] = useState<
    'age-calculator' | 'aspect-ratio' | 'dpi-calculator' | 'unit-converter'
  >(initialCalc);

  // 1. Age Calculator State
  const [dob, setDob] = useState<string>('2001-05-15');
  const [asOfDate, setAsOfDate] = useState<string>('2024-08-01');
  const [minAgeCutoff, setMinAgeCutoff] = useState<number>(21);
  const [maxAgeCutoff, setMaxAgeCutoff] = useState<number>(32);

  // 2. Aspect Ratio Calculator State
  const [ratioW, setRatioW] = useState<number>(3.5);
  const [ratioH, setRatioH] = useState<number>(4.5);
  const [targetWidthPx, setTargetWidthPx] = useState<number>(350);

  // 3. DPI / Print Size Calculator State
  const [cmW, setCmW] = useState<number>(3.5);
  const [cmH, setCmH] = useState<number>(4.5);
  const [dpi, setDpi] = useState<number>(200);

  // 4. Unit Converter State
  const [unitValue, setUnitValue] = useState<number>(3.5);
  const [fromUnit, setFromUnit] = useState<'cm' | 'mm' | 'in' | 'px'>('cm');
  const [toUnit, setToUnit] = useState<'px' | 'cm' | 'mm' | 'in'>('px');
  const [conversionDpi, setConversionDpi] = useState<number>(200);

  // Calculate age
  const calculatedAge = React.useMemo(() => {
    if (!dob || !asOfDate) return null;
    const birth = new Date(dob);
    const cutoff = new Date(asOfDate);
    if (isNaN(birth.getTime()) || isNaN(cutoff.getTime()) || birth > cutoff) return null;

    let years = cutoff.getFullYear() - birth.getFullYear();
    let months = cutoff.getMonth() - birth.getMonth();
    let days = cutoff.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((cutoff.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const isEligible = years >= minAgeCutoff && (years < maxAgeCutoff || (years === maxAgeCutoff && months === 0 && days === 0));

    return {
      years,
      months,
      days,
      totalDays,
      isEligible,
    };
  }, [dob, asOfDate, minAgeCutoff, maxAgeCutoff]);

  // DPI calculation
  const calculatedDpiPixels = React.useMemo(() => {
    // pixels = (cm / 2.54) * DPI
    const pxW = Math.round((cmW / 2.54) * dpi);
    const pxH = Math.round((cmH / 2.54) * dpi);
    return { pxW, pxH };
  }, [cmW, cmH, dpi]);

  // Unit conversion
  const convertedResult = React.useMemo(() => {
    // convert fromUnit to inches first
    let inches = 0;
    if (fromUnit === 'in') inches = unitValue;
    else if (fromUnit === 'cm') inches = unitValue / 2.54;
    else if (fromUnit === 'mm') inches = unitValue / 25.4;
    else if (fromUnit === 'px') inches = unitValue / conversionDpi;

    // convert inches to toUnit
    if (toUnit === 'in') return Number(inches.toFixed(3));
    if (toUnit === 'cm') return Number((inches * 2.54).toFixed(3));
    if (toUnit === 'mm') return Number((inches * 25.4).toFixed(2));
    if (toUnit === 'px') return Math.round(inches * conversionDpi);
    return 0;
  }, [unitValue, fromUnit, toUnit, conversionDpi]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
          Exam Ready Calculators & Utilities
        </h1>
        <p className="text-sm text-[#61666B] mt-1.5">
          Verify cutoff age eligibility, compute exact DPI pixels, and convert physical dimensions with zero guesswork.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-[#F0ECE6] border border-[#E5DFD8] text-xs font-semibold text-[#4A4F54] overflow-x-auto max-w-full">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('age-calculator');
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'age-calculator'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Age & Cutoff Check
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('dpi-calculator');
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dpi-calculator'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            DPI to Pixels
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('aspect-ratio');
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'aspect-ratio'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Aspect Ratio
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('unit-converter');
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'unit-converter'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Unit Converter (cm/mm/px)
          </button>
        </div>
      </div>

      {/* 1. Age Calculator */}
      {activeTab === 'age-calculator' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-[#F0EBE5]">
            <Calendar className="w-5 h-5 text-[#C85A17]" />
            <div>
              <h2 className="text-base font-bold text-[#181A1B]">
                Exam Cutoff Age Eligibility Calculator
              </h2>
              <p className="text-xs text-[#71767B]">
                Calculates precise age down to days as of the official exam cutoff date.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">
                Date of Birth (as per Class 10 Certificate)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-bold text-xs text-[#181A1B]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">
                Age Calculation Cutoff Date (Notification date)
              </label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-bold text-xs text-[#181A1B]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#71767B] block mb-1">
                Minimum Eligibility Age (Years)
              </label>
              <input
                type="number"
                value={minAgeCutoff}
                onChange={(e) => setMinAgeCutoff(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] text-xs font-semibold text-[#181A1B]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#71767B] block mb-1">
                Maximum Eligibility Age (Years)
              </label>
              <input
                type="number"
                value={maxAgeCutoff}
                onChange={(e) => setMaxAgeCutoff(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] text-xs font-semibold text-[#181A1B]"
              />
            </div>
          </div>

          {calculatedAge && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#71767B] mb-2">
                Exact Age Result
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#181A1B]">
                {calculatedAge.years} Years, {calculatedAge.months} Months, {calculatedAge.days} Days
              </div>
              <div className="text-xs text-[#71767B] mt-1">
                Total living duration: {calculatedAge.totalDays.toLocaleString()} days
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE3DA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {calculatedAge.isEligible ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1E7245]">
                      <CheckCircle2 className="w-4 h-4" /> Eligible (Within {minAgeCutoff}–{maxAgeCutoff} Years)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#B83E1C]">
                      <AlertCircle className="w-4 h-4" /> Not within eligibility range ({minAgeCutoff}–{maxAgeCutoff} Years)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DPI to Pixels */}
      {activeTab === 'dpi-calculator' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B]">
            DPI / Physical Size to Pixels Calculator
          </h2>
          <p className="text-xs text-[#71767B] mt-0.5">
            Convert passport requirements like "3.5 × 4.5 cm at 200 DPI" into required digital screen pixels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-xs">
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">
                Width (Centimeters)
              </label>
              <input
                type="number"
                step="0.1"
                value={cmW}
                onChange={(e) => setCmW(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">
                Height (Centimeters)
              </label>
              <input
                type="number"
                step="0.1"
                value={cmH}
                onChange={(e) => setCmH(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">
                Resolution (DPI / PPI)
              </label>
              <select
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-bold text-xs"
              >
                <option value={150}>150 DPI (Draft)</option>
                <option value={200}>200 DPI (Exam Standard)</option>
                <option value={300}>300 DPI (High-Res Print)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#71767B] mb-1">
              Required Pixel Resolution
            </div>
            <div className="text-2xl font-bold font-mono text-[#181A1B]">
              {calculatedDpiPixels.pxW} × {calculatedDpiPixels.pxH} pixels
            </div>
            <p className="text-xs text-[#5C6166] mt-2">
              Formula: (cm / 2.54) × DPI = ({cmW} / 2.54) × {dpi} = {calculatedDpiPixels.pxW} px
            </p>
          </div>
        </div>
      )}

      {/* 3. Aspect Ratio */}
      {activeTab === 'aspect-ratio' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B]">Aspect Ratio Calculator</h2>
          <p className="text-xs text-[#71767B] mt-0.5">
            Keep images proportional without stretching faces or signatures.
          </p>

          <div className="grid grid-cols-3 gap-3 my-6 text-xs">
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">Ratio W</label>
              <input
                type="number"
                step="0.1"
                value={ratioW}
                onChange={(e) => setRatioW(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-bold text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">Ratio H</label>
              <input
                type="number"
                step="0.1"
                value={ratioH}
                onChange={(e) => setRatioH(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-bold text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">Given Width (px)</label>
              <input
                type="number"
                value={targetWidthPx}
                onChange={(e) => setTargetWidthPx(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-bold text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#71767B] mb-1">
              Resulting Proportional Height
            </div>
            <div className="text-2xl font-bold font-mono text-[#181A1B]">
              {Math.round(targetWidthPx * (ratioH / ratioW))} pixels
            </div>
          </div>
        </div>
      )}

      {/* 4. Unit Converter */}
      {activeTab === 'unit-converter' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B]">
            Document Unit Converter (cm, mm, inches, px)
          </h2>
          <p className="text-xs text-[#71767B] mt-0.5">
            Convert seamlessly between digital pixels and real-world physical measurements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6 text-xs">
            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">Value</label>
              <input
                type="number"
                step="0.1"
                value={unitValue}
                onChange={(e) => setUnitValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-bold text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">From Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-medium text-xs"
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="in">Inches (in)</option>
                <option value="px">Pixels (px)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#181A1B] block mb-1">To Unit</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-medium text-xs"
              >
                <option value="px">Pixels (px)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#71767B] block mb-1">Target DPI</label>
              <input
                type="number"
                value={conversionDpi}
                onChange={(e) => setConversionDpi(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] bg-[#FAF8F5] font-mono font-medium text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#71767B] mb-1">
              Converted Result
            </div>
            <div className="text-2xl font-bold font-mono text-[#181A1B]">
              {convertedResult} {toUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
