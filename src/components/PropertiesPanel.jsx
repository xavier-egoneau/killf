// components/PropertiesPanel.jsx - Version avec i18n
import React, { useState, useEffect } from 'react';
import { Settings, Eye, Code, Save } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const PropertiesPanel = ({ componentsHook }) => {
  const { t } = useI18n();
  const { currentProps, updateComponentProp, getComponentProps, selectedComponent, getComponent, updateComponent } = componentsHook;
  const [activeTab, setActiveTab] = useState('visual');
  const [propsCode, setPropsCode] = useState('');
  const [hasUnsavedPropsChanges, setHasUnsavedPropsChanges] = useState(false);
  const [originalPropsCode, setOriginalPropsCode] = useState('');
  const [isSavingProps, setIsSavingProps] = useState(false);
  const [hasUnsavedVisualChanges, setHasUnsavedVisualChanges] = useState(false);
  const [lastSavedProps, setLastSavedProps] = useState({});

  const componentProps = getComponentProps();
  const selectedComp = getComponent(selectedComponent);

  // Mettre à jour le code des props quand le composant change
  useEffect(() => {
    if (selectedComp && selectedComp.props) {
      const formatted = JSON.stringify(selectedComp.props, null, 2);
      setPropsCode(formatted);
      setOriginalPropsCode(formatted);
      setHasUnsavedPropsChanges(false);
      setLastSavedProps({...currentProps});
      setHasUnsavedVisualChanges(false);
    }
  }, [selectedComponent, selectedComp?.props]);

  // Vérifier les changements dans le code des props (mode Code)
  useEffect(() => {
    const hasChanges = propsCode !== originalPropsCode;
    setHasUnsavedPropsChanges(hasChanges);
  }, [propsCode, originalPropsCode]);

  // Vérifier les changements dans les props visuelles (mode Visual)
  useEffect(() => {
    const hasChanges = JSON.stringify(currentProps) !== JSON.stringify(lastSavedProps);
    setHasUnsavedVisualChanges(hasChanges);
  }, [currentProps, lastSavedProps]);

  // Auto-save des props quand elles changent dans le mode visual (avec debounce)
  const updateComponentPropWithSave = (propKey, value) => {
    // Mettre à jour immédiatement l'UI
    updateComponentProp(propKey, value);
  };

  // Sauvegarde manuelle des props (mode Code)
  const savePropsChanges = async () => {
    if (!selectedComp || !hasUnsavedPropsChanges) {
      return;
    }

    setIsSavingProps(true);

    try {
      // Parser le JSON des props
      const newProps = JSON.parse(propsCode);
      
      console.log('💾 Saving props changes:', newProps);

      // Mettre à jour le composant avec les nouvelles props
      const category = selectedComp.category;
      const componentKey = selectedComponent.includes('.') ? selectedComponent.split('.')[1] : selectedComponent;

      await updateComponent(category, componentKey, {
        props: newProps
      });

      // Mettre à jour les états
      setOriginalPropsCode(propsCode);
      setHasUnsavedPropsChanges(false);
      showSaveSuccess('save-props');

      console.log('✅ Props saved successfully');

    } catch (error) {
      console.error('❌ Props save failed:', error);
      if (error.message.includes('JSON')) {
        showSaveError('save-props', 'Invalid JSON');
      } else {
        showSaveError('save-props');
      }
    } finally {
      setIsSavingProps(false);
    }
  };

  // Sauvegarde manuelle des valeurs de props (mode Visual)
  const saveVisualPropsChanges = async () => {
    if (!selectedComp || !hasUnsavedVisualChanges) {
      return;
    }

    setIsSavingProps(true);

    try {
      console.log('💾 Saving visual props changes:', currentProps);

      // Mettre à jour le composant avec les nouvelles valeurs par défaut
      const category = selectedComp.category;
      const componentKey = selectedComponent.includes('.') ? selectedComponent.split('.')[1] : selectedComponent;

      // Créer les nouvelles props avec les valeurs mises à jour
      const updatedProps = { ...selectedComp.props };
      Object.entries(currentProps).forEach(([key, value]) => {
        if (updatedProps[key]) {
          updatedProps[key] = {
            ...updatedProps[key],
            default: value
          };
        }
      });

      await updateComponent(category, componentKey, {
        props: updatedProps
      });

      // Mettre à jour les états
      setLastSavedProps({...currentProps});
      setHasUnsavedVisualChanges(false);
      showSaveSuccess('save-visual-props');

      console.log('✅ Visual props saved successfully');

    } catch (error) {
      console.error('❌ Visual props save failed:', error);
      showSaveError('save-visual-props');
    } finally {
      setIsSavingProps(false);
    }
  };

  const discardPropsChanges = () => {
    setPropsCode(originalPropsCode);
    setHasUnsavedPropsChanges(false);
  };

  // Écouter l'événement Save All
  useEffect(() => {
    const handleSaveAll = async () => {
      console.log('🔄 Save All triggered for PropertiesPanel');
      if (activeTab === 'code' && hasUnsavedPropsChanges) {
        await savePropsChanges();
      }
    };

    window.addEventListener('saveAll', handleSaveAll);
    
    return () => {
      window.removeEventListener('saveAll', handleSaveAll);
    };
  }, [activeTab, hasUnsavedPropsChanges, savePropsChanges]);

  const showSaveSuccess = (buttonId) => {
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
  };

  const showSaveError = (buttonId, customMessage = null) => {
    const button = document.getElementById(buttonId);
    if (button) {
      const originalText = button.textContent;
      const originalBg = button.style.backgroundColor;
      button.textContent = customMessage || `❌ ${t('error')}`;
      button.style.backgroundColor = '#ef4444';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBg;
      }, 3000);
    }
  };

  const copyPropsToClipboard = () => {
    navigator.clipboard.writeText(propsCode).then(() => {
      const button = document.getElementById('copy-props');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ ${t('copied')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  const formatPropsCode = () => {
    try {
      const parsed = JSON.parse(propsCode);
      const formatted = JSON.stringify(parsed, null, 2);
      setPropsCode(formatted);
    } catch (error) {
      console.error('Invalid JSON, cannot format');
    }
  };

  if (!selectedComp) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Settings size={18} className="mr-2" />
          {t('properties')}
        </h3>
        <div className="text-gray-500 text-sm">
          {t('noComponentSelected')}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Settings size={18} className="mr-2" />
          {t('properties')}
        </h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors flex items-center justify-center ${
              activeTab === 'visual' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye size={14} className="mr-1" />
            {t('visual')}
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors flex items-center justify-center ${
              activeTab === 'code' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code size={14} className="mr-1" />
            {t('code')} {hasUnsavedPropsChanges && <span className="text-red-500 ml-1">●</span>}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'visual' && (
          <div className="p-4 space-y-4">
            {Object.entries(componentProps).map(([propKey, config]) => (
              <div key={propKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {t(propKey) !== propKey ? t(propKey) : propKey}
                  {config.description && (
                    <span className="text-xs text-gray-500 ml-2">({config.description})</span>
                  )}
                </label>
                
                {config.type === 'select' && (
                  <select
                    value={currentProps[propKey] || config.default}
                    onChange={(e) => updateComponentPropWithSave(propKey, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {config.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {config.type === 'string' && (
                  <input
                    type="text"
                    value={currentProps[propKey] || config.default}
                    onChange={(e) => updateComponentPropWithSave(propKey, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={config.default}
                  />
                )}

                {config.type === 'number' && (
                  <input
                    type="number"
                    value={currentProps[propKey] || config.default}
                    onChange={(e) => updateComponentPropWithSave(propKey, parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={config.default}
                  />
                )}
                
                {config.type === 'boolean' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentProps[propKey] !== undefined ? currentProps[propKey] : config.default}
                      onChange={(e) => updateComponentPropWithSave(propKey, e.target.checked)}
                      className="mr-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{t('enabled')}</span>
                  </label>
                )}
              </div>
            ))}
            
            {Object.keys(componentProps).length === 0 && (
              <div className="text-gray-500 text-sm">
                {t('noPropertiesAvailable')}
              </div>
            )}

            {/* Info sur l'application en temps réel */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-700 font-medium text-sm mb-1">
                ✅ {t('realTimeUpdates')}
              </div>
              <div className="text-green-600 text-xs">
                {t('changesAppliedInstantly')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="p-4 h-full flex flex-col">
            {/* Code Editor Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">{t('propsDefinition')}</span>
              <div className="flex gap-2">
                {hasUnsavedPropsChanges && (
                  <button 
                    id="save-props"
                    onClick={savePropsChanges}
                    disabled={isSavingProps}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <Save size={12} className="mr-1" />
                    {isSavingProps ? t('saving') : t('save')}
                  </button>
                )}
                <button 
                  id="copy-props"
                  onClick={copyPropsToClipboard}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  📋 {t('copy')}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <textarea
              value={propsCode}
              onChange={(e) => setPropsCode(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-900 text-gray-300"
              style={{
                minHeight: '300px',
                lineHeight: '1.6'
              }}
              placeholder="Props definition JSON..."
            />

            {/* Helper Text */}
            <div className="mt-2 text-xs text-gray-500">
              💡 {t('editPropsDefinition')}
            </div>

            {/* Props Schema Help */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-blue-700 font-medium text-sm mb-2">
                📋 {t('propsSchema')}
              </div>
              <div className="text-blue-600 text-xs space-y-1">
                <div><code>"type"</code>: "string" | "boolean" | "select" | "number"</div>
                <div><code>"default"</code>: Default value</div>
                <div><code>"options"</code>: Array (for select type)</div>
                <div><code>"description"</code>: Help text (optional)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;