// App.jsx - Version avec export CSS
import React, { useState, useEffect } from 'react';
import { Eye, Code, Wand2, Download, Save, FileDown, Package } from 'lucide-react';

// Import hooks
import { useTokens, useComponents } from './hooks';
import { useI18n } from './hooks/useI18n';

// Import utils
import { generateCSSVariables, generateAIPrompt } from './utils';
import { downloadExportPackage, downloadFile, generateCompleteExport } from './utils/cssExportGenerator';

// Import components
import { Sidebar, Canvas, PropertiesPanel } from './components';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const [activeTab, setActiveTab] = useState('visual');
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isExportingCSS, setIsExportingCSS] = useState(false);
  const [saveResults, setSaveResults] = useState({});
  
  // i18n hook
  const { t } = useI18n();
  
  // Custom hooks for state management
  const tokensHook = useTokens();
  const componentsHook = useComponents();

  const { tokens, hasUnsavedTokenChanges } = tokensHook;
  const { components, selectedComponent, currentProps, updateComponent } = componentsHook;

  // Écouter les résultats de sauvegarde des tokens
  useEffect(() => {
    const handleTokensSaveResult = (event) => {
      setSaveResults(prev => ({
        ...prev,
        tokens: event.detail
      }));
    };

    window.addEventListener('tokensSaveResult', handleTokensSaveResult);
    
    return () => {
      window.removeEventListener('tokensSaveResult', handleTokensSaveResult);
    };
  }, []);

  const handleExport = () => {
    const aiPrompt = generateAIPrompt(tokens, components);
    
    // Create and download file
    const blob = new Blob([aiPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-system-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 🆕 Nouvelle fonction d'export CSS
  const handleCSSExport = async (type = 'complete') => {
    setIsExportingCSS(true);
    
    try {
      const cssExports = generateCompleteExport(tokens, components);
      
      switch (type) {
        case 'design-system':
          downloadFile(cssExports.designSystem, 'design-system.css');
          break;
        case 'components':
          downloadFile(cssExports.components, 'components.css');
          break;
        case 'framework':
          downloadFile(cssExports.framework, `${tokens.framework.type}-framework.css`);
          break;
        case 'complete':
          downloadFile(cssExports.combined, 'complete-design-system.css');
          break;
        case 'package':
          // Télécharger tout le package
          const packageInfo = downloadExportPackage(tokens, components);
          console.log('📦 Export package generated:', packageInfo);
          break;
        default:
          downloadFile(cssExports.combined, 'design-system.css');
      }
      
      // Feedback visuel
      const button = document.getElementById('css-export-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ CSS ${t('export')}ed!`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
      
    } catch (error) {
      console.error('CSS Export failed:', error);
      const button = document.getElementById('css-export-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `❌ Export Failed`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } finally {
      setIsExportingCSS(false);
    }
  };

  // Fonction Save All améliorée
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    setSaveResults({});
    
    try {
      console.log('🔄 Starting Save All process...');
      
      // Déclencher l'événement custom pour sauvegarder tout
      const saveAllEvent = new CustomEvent('saveAll');
      window.dispatchEvent(saveAllEvent);
      
      // Attendre un peu pour que les sauvegardes se terminent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Analyser les résultats
      const button = document.getElementById('save-all-btn');
      if (button) {
        const originalText = button.textContent;
        
        // Compter les succès
        const results = Object.values(saveResults);
        const successes = results.filter(r => r?.success).length;
        const failures = results.filter(r => r?.success === false).length;
        
        if (failures === 0) {
          button.textContent = `✅ ${t('allSaved')}`;
          button.style.backgroundColor = '#10b981';
          console.log('✅ Save All completed successfully');
        } else {
          button.textContent = `⚠️ ${successes}/${results.length} saved`;
          button.style.backgroundColor = '#f59e0b';
          console.log(`⚠️ Save All completed with ${failures} failures`);
        }
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 3000);
      }
      
    } catch (error) {
      console.error('Save All failed:', error);
      const button = document.getElementById('save-all-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `❌ ${t('saveFailed')}`;
        button.style.backgroundColor = '#ef4444';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 3000);
      }
    } finally {
      setIsSavingAll(false);
    }
  };

  // Indicateur des changements non sauvegardés
  const hasAnyUnsavedChanges = () => {
    return hasUnsavedTokenChanges; // On peut ajouter d'autres vérifications ici
  };

  return (
    <div className="min-h-screen bg-gray-50 flex app-container">
      {/* Inject CSS variables */}
      <style>{`
        ${generateCSSVariables(tokens)}
        .btn { transition: all 0.2s; }
        .btn:hover:not(:disabled) { transform: translateY(-1px); }
        
        /* Layout Classes */
        .panel-left {
          min-width: 320px;
          max-width: 320px;
          flex-shrink: 0;
        }
        
        .panel-right {
          min-width: 320px;
          max-width: 320px;
          flex-shrink: 0;
        }
        
        .content-block {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        
        .app-header {
          flex-shrink: 0;
        }
        
        .main-content {
          flex: 1;
          min-height: 0;
        }
        
        /* Unsaved changes indicator */
        .unsaved-indicator {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      
      {/* Sidebar - Panel Left */}
      <div className="panel-left">
        <Sidebar 
          tokensHook={tokensHook}
          componentsHook={componentsHook}
        />
      </div>

      {/* Main Content Block */}
      <div className="content-block flex flex-col">
        {/* Header */}
        <div className="app-header bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'visual' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={16} className="mr-2" />
                {t('visual')}
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'code' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Code size={16} className="mr-2" />
                {t('code')}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'ai' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 size={16} className="mr-2" />
                {t('aiExport')}
              </button>
            </div>
            
            {/* Status & Actions */}
            <div className="flex items-center space-x-3">
              {/* Unsaved changes indicator */}
              {hasAnyUnsavedChanges() && (
                <div className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full unsaved-indicator">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  {t('unsavedChanges')}
                </div>
              )}
              
              {/* Language switcher */}
              <LanguageSwitcher />
              
              {/* 🆕 CSS Export Dropdown */}
              <div className="relative group">
                <button 
                  id="css-export-btn"
                  disabled={isExportingCSS}
                  className={`flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ${
                    isExportingCSS ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FileDown size={16} className={`mr-2 ${isExportingCSS ? 'animate-bounce' : ''}`} />
                  {isExportingCSS ? 'Exporting...' : 'Export CSS'}
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleCSSExport('complete')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Download size={14} className="mr-2" />
                      Complete CSS
                      <span className="ml-auto text-xs text-gray-500">All-in-one</span>
                    </button>
                    <button
                      onClick={() => handleCSSExport('design-system')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Download size={14} className="mr-2" />
                      Design System
                      <span className="ml-auto text-xs text-gray-500">Tokens + Utils</span>
                    </button>
                    <button
                      onClick={() => handleCSSExport('components')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Download size={14} className="mr-2" />
                      Components Only
                      <span className="ml-auto text-xs text-gray-500">Components CSS</span>
                    </button>
                    <button
                      onClick={() => handleCSSExport('framework')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Download size={14} className="mr-2" />
                      Framework CSS
                      <span className="ml-auto text-xs text-gray-500">{tokens.framework.type}</span>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => handleCSSExport('package')}
                      className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center font-medium"
                    >
                      <Package size={14} className="mr-2" />
                      Complete Package
                      <span className="ml-auto text-xs text-purple-500">All files</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Save All button - Always visible but disabled if no changes */}
              <button 
                id="save-all-btn"
                onClick={handleSaveAll}
                disabled={isSavingAll || !hasAnyUnsavedChanges()}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  hasAnyUnsavedChanges()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isSavingAll ? 'opacity-50' : ''}`}
                title={hasAnyUnsavedChanges() ? t('saveAll') : 'No changes to save'}
              >
                <Save size={16} className={`mr-2 ${isSavingAll ? 'animate-spin' : ''}`} />
                {isSavingAll ? t('saving') : t('saveAll')}
                {hasUnsavedTokenChanges && (
                  <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                    {t('tokens')}
                  </span>
                )}
              </button>
              
              {/* Export AI button */}
              <button 
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                {t('export')} AI
              </button>
            </div>
          </div>
          
          {/* Save status bar */}
          {Object.keys(saveResults).length > 0 && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <span>Save Status:</span>
                <div className="flex space-x-4">
                  {saveResults.tokens && (
                    <span className={`flex items-center ${saveResults.tokens.success ? 'text-green-600' : 'text-red-600'}`}>
                      {saveResults.tokens.success ? '✅' : '❌'} Design Tokens
                    </span>
                  )}
                  {/* Ici on pourrait ajouter d'autres statuts de sauvegarde */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="main-content flex">
          {/* Canvas - Central Content */}
          <div className="flex-1 min-w-0">
            <Canvas 
              activeTab={activeTab}
              tokens={tokens}
              components={components}
              selectedComponent={selectedComponent}
              currentProps={currentProps}
              onUpdateComponent={updateComponent}
            />
          </div>

          {/* Properties Panel - Panel Right */}
          <div className="panel-right">
            <PropertiesPanel 
              componentsHook={componentsHook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;