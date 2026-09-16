/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { PhotoWorkspace } from './components/tools/PhotoWorkspace';
import { SignatureWorkspace } from './components/tools/SignatureWorkspace';
import { PdfWorkspace } from './components/tools/PdfWorkspace';
import { CalculatorWorkspace } from './components/tools/CalculatorWorkspace';
import { ExamCatalog } from './components/exams/ExamCatalog';
import { GuideViewer } from './components/guides/GuideViewer';
import { AboutView } from './components/common/AboutView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { SettingsModal } from './components/common/SettingsModal';
import { ExamRequirement, SupportedLocale, UserSettings } from './types';
import { getExamBySlug, VERIFIED_EXAMS } from './data/exams';
import { getToolBySlug, ALL_TOOLS } from './data/tools';
import { setSoundEnabled } from './utils/audio';

export default function App() {
  // Navigation & Routing state
  const [currentView, setCurrentView] = useState<
    'home' | 'tools' | 'exams' | 'guides' | 'about' | 'tool-workspace'
  >('home');
  const [activeToolSlug, setActiveToolSlug] = useState<string>('photo-resizer');
  const [activeExamPreset, setActiveExamPreset] = useState<ExamRequirement | null>(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState<string | null>(null);

  // Settings State with LocalStorage persistence
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('toolcool_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      theme: 'system',
      reducedMotion: false,
      soundEnabled: true,
      locale: 'en',
    };
  });

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync sound settings to audio manager
  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
    try {
      localStorage.setItem('toolcool_settings', JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Tool Launcher
  const handleSelectTool = (slug: string) => {
    setActiveToolSlug(slug);
    setActiveExamPreset(null);
    setCurrentView('tool-workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exam Launcher
  const handleSelectExam = (slug: string) => {
    const exam = getExamBySlug(slug) || VERIFIED_EXAMS[0];
    setActiveExamPreset(exam);
    setCurrentView('exams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchPhotoFromExam = (exam: ExamRequirement) => {
    setActiveExamPreset(exam);
    setActiveToolSlug('photo-resizer');
    setCurrentView('tool-workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchSignatureFromExam = (exam: ExamRequirement) => {
    setActiveExamPreset(exam);
    setActiveToolSlug('signature-resizer');
    setCurrentView('tool-workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guide Launcher
  const handleSelectGuide = (slug: string) => {
    setActiveGuideSlug(slug);
    setCurrentView('guides');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which workspace component to mount
  const renderToolWorkspace = () => {
    // Signature tools
    if (
      activeToolSlug === 'signature-resizer' ||
      activeToolSlug === 'signature-compressor' ||
      activeToolSlug === 'signature-background-cleaner'
    ) {
      return (
        <SignatureWorkspace
          examPreset={activeExamPreset}
          initialToolSlug={activeToolSlug}
          onNavigateTool={handleSelectTool}
          onNavigateExam={handleSelectExam}
        />
      );
    }

    // PDF tools
    if (
      activeToolSlug === 'merge-pdf' ||
      activeToolSlug === 'split-pdf' ||
      activeToolSlug === 'compress-pdf' ||
      activeToolSlug === 'jpg-to-pdf' ||
      activeToolSlug === 'rotate-pdf'
    ) {
      return (
        <PdfWorkspace
          initialSubTool={activeToolSlug as any}
          onNavigateTool={handleSelectTool}
        />
      );
    }

    // Calculators
    if (
      activeToolSlug === 'age-calculator' ||
      activeToolSlug === 'dpi-calculator' ||
      activeToolSlug === 'aspect-ratio' ||
      activeToolSlug === 'unit-converter'
    ) {
      return (
        <CalculatorWorkspace
          initialCalc={activeToolSlug as any}
          onNavigateTool={handleSelectTool}
        />
      );
    }

    // Default to Photo Workspace
    return (
      <PhotoWorkspace
        examPreset={activeExamPreset}
        initialToolSlug={activeToolSlug}
        onNavigateTool={handleSelectTool}
        onNavigateExam={handleSelectExam}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#181A1B] font-sans antialiased selection:bg-[#FCEFE3] selection:text-[#C85A17]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        locale={settings.locale}
        onNavigate={(v) => {
          if (v === 'tools') {
            setActiveToolSlug('photo-resizer');
            setActiveExamPreset(null);
            setCurrentView('home');
          } else {
            setCurrentView(v as any);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <HomeView
            locale={settings.locale}
            onSelectTool={handleSelectTool}
            onSelectExam={handleSelectExam}
            onSelectGuide={handleSelectGuide}
            onNavigate={(v) => {
              setCurrentView(v as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'tool-workspace' && renderToolWorkspace()}

        {currentView === 'exams' && (
          <ExamCatalog
            selectedExamSlug={activeExamPreset?.slug}
            onSelectExam={(exam) => setActiveExamPreset(exam)}
            onLaunchPhoto={handleLaunchPhotoFromExam}
            onLaunchSignature={handleLaunchSignatureFromExam}
          />
        )}

        {currentView === 'guides' && (
          <GuideViewer
            selectedGuideSlug={activeGuideSlug}
            onNavigateTool={handleSelectTool}
            onNavigateExam={handleSelectExam}
          />
        )}

        {currentView === 'about' && <AboutView />}
      </main>

      {/* Reusable Footer */}
      <Footer
        onNavigateTool={handleSelectTool}
        onNavigateExam={handleSelectExam}
        onNavigate={(v) => {
          setCurrentView(v as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Search Palette (⌘K) */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
        onSelectExam={handleSelectExam}
        onSelectGuide={handleSelectGuide}
      />

      {/* User Preferences & Language Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
