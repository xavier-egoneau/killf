// components/CodeTab.jsx - Version avec i18n
import React, { useState, useEffect } from 'react';
import { renderTemplate, validateTemplate } from '../utils/templateEngine';
import { useI18n } from '../hooks/useI18n';

const CodeTab = ({ tokens, components, selectedComponent, currentProps, onUpdateComponent }) => {
  const { t } = useI18n();
  const [activeCodeTab, setActiveCodeTab] = useState('template');
  const [templateCode, setTemplateCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalTemplateCode, setOriginalTemplateCode] = useState('');
  const [originalHtmlCode, setOriginalHtmlCode] = useState('');
  const [originalCssCode, setOriginalCssCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [templateValidation, setTemplateValidation] = useState({ isValid: true, errors: [] });

  const getComponent = (componentPath) => {
    if (!componentPath) return null;
    
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category]?.[key] || null;
    }
    return components.atoms?.[componentPath] || components.molecules?.[componentPath] || null;
  };

  const selectedComp = getComponent(selectedComponent);

  // Génération du CSS spécifique au composant (sans les tokens CSS)
  const generateComponentCSS = () => {
    if (!selectedComp) return `/* ${t('noComponentSelected')} */`;
    return selectedComp.scss || `/* No styles defined for ${selectedComp.name} */`;
  };

  // Génération du HTML final (template + props)
  const generateFinalHTML = () => {
    if (!selectedComp || !selectedComp.template) {
      return `<!-- ${t('noTemplateForComponent')} -->`;
    }
    
    return renderTemplate(selectedComp.template, currentProps);
  };

  // Mettre à jour le code quand le composant change
  useEffect(() => {
    if (selectedComp) {
      const newTemplateCode = selectedComp.template || '';
      const newHtmlCode = generateFinalHTML();
      const newCssCode = generateComponentCSS();
      
      setTemplateCode(newTemplateCode);
      setHtmlCode(newHtmlCode);
      setCssCode(newCssCode);
      setOriginalTemplateCode(newTemplateCode);
      setOriginalHtmlCode(newHtmlCode);
      setOriginalCssCode(newCssCode);
      setHasUnsavedChanges(false);
      
      console.log(`📄 Code updated for component: ${selectedComponent}`, {
        hasTemplate: !!selectedComp.template,
        templateLength: newTemplateCode.length
      });
    }
  }, [selectedComponent, tokens, selectedComp?.scss, selectedComp?.template]);

  // Mettre à jour le HTML quand les props ou le template changent
  useEffect(() => {
    if (selectedComp && templateCode) {
      const newHtmlCode = renderTemplate(templateCode, currentProps);
      setHtmlCode(newHtmlCode);
    }
  }, [currentProps, templateCode]);

  // Valider le template quand il change
  useEffect(() => {
    const validation = validateTemplate(templateCode);
    setTemplateValidation(validation);
  }, [templateCode]);

  // Vérifier les changements 
  useEffect(() => {
    const hasChanges = templateCode !== originalTemplateCode || 
                      cssCode !== originalCssCode;
    setHasUnsavedChanges(hasChanges);
  }, [templateCode, cssCode, originalTemplateCode, originalCssCode]);

  // Fonction de sauvegarde principale
  const saveChanges = async () => {
    if (!selectedComp || !onUpdateComponent || !hasUnsavedChanges) {
      console.log('⚠️ Cannot save: missing component, update function, or no changes');
      return;
    }

    if (!templateValidation.isValid) {
      console.log('⚠️ Cannot save: template has validation errors');
      showSaveError(t('templateValidationFailed'));
      return;
    }

    setIsSaving(true);
    
    try {
      const category = selectedComp.category;
      const componentKey = selectedComponent.includes('.') ? selectedComponent.split('.')[1] : selectedComponent;

      console.log('💾 Saving changes:', { 
        category, 
        componentKey, 
        templateLength: templateCode.length,
        cssLength: cssCode.length,
        templateChanged: templateCode !== originalTemplateCode,
        cssChanged: cssCode !== originalCssCode
      });

      // Préparer les updates
      const updates = {
        scss: cssCode
      };

      // Si le template a été modifié, l'inclure dans la sauvegarde
      if (templateCode !== originalTemplateCode) {
        updates.template = templateCode;
        console.log('📝 Template has been modified, saving template');
      }

      console.log('📤 Updates to send:', {
        scss: updates.scss.substring(0, 100) + '...',
        template: updates.template ? updates.template.substring(0, 100) + '...' : 'not modified'
      });

      // Appeler la fonction de mise à jour
      const result = await onUpdateComponent(category, componentKey, updates);

      // Mettre à jour les états après une sauvegarde réussie
      setOriginalTemplateCode(templateCode);
      setOriginalHtmlCode(htmlCode);
      setOriginalCssCode(cssCode);
      setHasUnsavedChanges(false);

      // Feedback visuel
      showSaveSuccess();
      console.log('✅ Changes saved successfully:', result);
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      showSaveError();
    } finally {
      setIsSaving(false);
    }
  };

  // Écouter l'événement Save All
  useEffect(() => {
    const handleSaveAll = async () => {
      console.log('🔄 Save All triggered for CodeTab');
      if (hasUnsavedChanges) {
        await saveChanges();
      }
    };

    window.addEventListener('saveAll', handleSaveAll);
    
    return () => {
      window.removeEventListener('saveAll', handleSaveAll);
    };
  }, [hasUnsavedChanges, saveChanges]);

  const showSaveSuccess = () => {
    const buttons = ['save-code', 'save-html', 'save-template', 'save-css'];
    buttons.forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        button.textContent = `✅ ${t('saved')}`;
        button.style.backgroundColor = '#10b981';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = originalBg;
        }, 2000);
      }
    });
  };

  const showSaveError = (message = t('saveFailed')) => {
    const buttons = ['save-code', 'save-html', 'save-template', 'save-css'];
    buttons.forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button) {
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        button.textContent = `❌ ${message}`;
        button.style.backgroundColor = '#ef4444';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = originalBg;
        }, 3000);
      }
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      const button = document.getElementById(`copy-${type}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ ${t('copied')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  if (!selectedComp) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-center">
          <div className="text-lg mb-2">{t('noComponentSelected')}</div>
          <div className="text-sm">{t('selectComponent')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white p-4">
      {/* Current Props Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="text-blue-700 font-medium text-sm mb-1 flex items-center justify-between">
          <span>
            📋 {t('currentProps')} ({selectedComp.name})
            {selectedComp.template && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{t('hasTemplate')}</span>}
          </span>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></span>
              {t('unsavedChanges')}
            </span>
          )}
        </div>
        <div className="text-blue-600 text-xs font-mono">
          {Object.keys(currentProps || {}).length > 0 
            ? Object.entries(currentProps).map(([key, value]) => 
                `${key}: ${typeof value === 'string' ? `"${value}"` : value}`
              ).join(', ')
            : 'No props set'
          }
        </div>
      </div>

      {/* Template Validation */}
      {!templateValidation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-700 font-medium text-sm mb-2">
            ❌ {t('templateValidationErrors')}
          </div>
          <ul className="text-red-600 text-xs space-y-1">
            {templateValidation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveCodeTab('template')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'template' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔧 {t('template')} {templateCode !== originalTemplateCode && <span className="text-red-500">●</span>}
        </button>
        <button
          onClick={() => setActiveCodeTab('html')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'html' 
              ? 'bg-white text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 {t('previewHTML')}
        </button>
        <button
          onClick={() => setActiveCodeTab('css')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'css' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎨 CSS {cssCode !== originalCssCode && <span className="text-red-500">●</span>}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 min-h-0">
        {activeCodeTab === 'template' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">{t('templateWithVariables')}</span>
              <div className="flex gap-2">
                <button 
                  id="copy-template"
                  onClick={() => copyToClipboard(templateCode, 'template')}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  📋 {t('copy')}
                </button>
              </div>
            </div>
            <textarea
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-900 text-gray-300"
              style={{
                minHeight: '400px',
                lineHeight: '1.6'
              }}
              placeholder={t('templatePlaceholder')}
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 {t('useVariables')}
            </div>
          </div>
        )}

        {activeCodeTab === 'html' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">{t('previewHTMLGenerated')}</span>
              <div className="flex gap-2">
                <button 
                  id="copy-html"
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                >
                  📋 {t('copy')}
                </button>
              </div>
            </div>
            <textarea
              value={htmlCode}
              readOnly
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none bg-gray-100 text-gray-700"
              style={{
                minHeight: '400px',
                lineHeight: '1.6'
              }}
              placeholder={t('generatedHTML')}
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 {t('htmlGenerated')}
            </div>
          </div>
        )}

        {activeCodeTab === 'css' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">{t('cssStylesComponentOnly')}</span>
              <div className="flex gap-2">
                <button 
                  id="copy-css"
                  onClick={() => copyToClipboard(cssCode, 'css')}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  📋 {t('copy')}
                </button>
              </div>
            </div>
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-300"
              style={{
                minHeight: '400px',
                lineHeight: '1.6'
              }}
              placeholder={t('cssPlaceholder')}
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 {t('cssVariables')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTab;