// App.jsx - Version avec i18n
import React, { useState } from 'react';
import { Eye, Code, Wand2, Download, Save } from 'lucide-react';

// Import hooks
import { useTokens, useComponents } from './hooks';
import { useI18n } from './hooks/useI18n';

// Import utils
import { generateCSSVariables, generateAIPrompt } from './utils';

// Import components
import { Sidebar, Canvas, PropertiesPanel } from './components';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const [activeTab, setActiveTab] = useState('visual');
  const [isSavingAll, setIsSavingAll] = useState(false);
  
  // i18n hook
  const { t } = useI18n();
  
  // Custom hooks for state management
  const tokensHook = useTokens();
  const componentsHook = useComponents();

  const { tokens } = tokensHook;
  const { components, selectedComponent, currentProps, updateComponent } = componentsHook;

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

  // Nouvelle fonction Save All
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    
    try {
      // Déclencher l'événement custom pour sauvegarder tout
      const saveAllEvent = new CustomEvent('saveAll');
      window.dispatchEvent(saveAllEvent);
      
      // Feedback visuel
      const button = document.getElementById('save-all-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ ${t('allSaved')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Save All failed:', error);
      const button = document.getElementById('save-all-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `❌ ${t('saveFailed')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } finally {
      setIsSavingAll(false);
    }
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
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-3">
              {/* Sélecteur de langue */}
              <LanguageSwitcher />
              
              {/* Bouton Save All - Visible seulement en mode Code */}
              {activeTab === 'code' && (
                <button 
                  id="save-all-btn"
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} className="mr-2" />
                  {isSavingAll ? t('saving') : t('saveAll')}
                </button>
              )}
              
              <button 
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download size={16} className="mr-2" />
                {t('export')}
              </button>
            </div>
          </div>
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