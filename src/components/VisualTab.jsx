// components/VisualTab.jsx - Version avec Framework Manager intégré
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Maximize2, Smartphone, Tablet, Monitor, RefreshCw, Settings, Info } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { renderTemplate } from '../utils/templateEngine';
import { generateFrameworkPreviewHTML, FRAMEWORK_CONFIGS, getFrameworkSuggestions } from '../utils/frameworkManager';

const VisualTab = ({ tokens, components, selectedComponent, currentProps }) => {
  const { t } = useI18n();
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showFrameworkInfo, setShowFrameworkInfo] = useState(false);
  const [frameworkSuggestions, setFrameworkSuggestions] = useState(null);
  
  const getComponent = (componentPath) => {
    if (!componentPath) return null;
    
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return components.atoms?.[componentPath] || components.molecules?.[componentPath] || null;
  };

  const selectedComp = getComponent(selectedComponent);
  const currentFramework = FRAMEWORK_CONFIGS[tokens.framework.type];

  // Mettre à jour les suggestions du framework quand le composant change
  useEffect(() => {
    if (selectedComp) {
      const componentType = selectedComp.category === 'atoms' ? 'button' : 'card';
      const suggestions = getFrameworkSuggestions(tokens, componentType);
      setFrameworkSuggestions(suggestions);
    }
  }, [selectedComp, tokens.framework]);

  // Déterminer la hauteur optimale basée sur le type de composant
  const getOptimalHeight = () => {
    if (!selectedComp) return '400px';
    
    const componentType = selectedComp.category;
    const componentName = selectedComp.name.toLowerCase();
    
    const heightMap = {
      atoms: '200px',
      molecules: componentName.includes('card') ? '300px' : '250px',
      organisms: {
        navbar: '120px',
        header: '200px',
        footer: '150px',
        sidebar: '400px',
        default: '350px'
      },
      templates: '600px',
      pages: '800px'
    };
    
    if (componentType === 'organisms') {
      const orgHeights = heightMap.organisms;
      for (const [key, height] of Object.entries(orgHeights)) {
        if (componentName.includes(key)) {
          return height;
        }
      }
      return orgHeights.default;
    }
    
    return heightMap[componentType] || '300px';
  };

  // Responsive viewport sizes
  const viewportSizes = {
    mobile: { 
      width: '375px', 
      height: selectedComp?.category === 'organisms' && selectedComp.name.toLowerCase().includes('navbar') ? '120px' : '667px', 
      icon: Smartphone 
    },
    tablet: { 
      width: '768px', 
      height: selectedComp?.category === 'organisms' && selectedComp.name.toLowerCase().includes('navbar') ? '120px' : '1024px', 
      icon: Tablet 
    },
    desktop: { 
      width: '100%', 
      height: getOptimalHeight(), 
      icon: Monitor 
    },
    auto: {
      width: '100%',
      height: 'auto',
      icon: Monitor
    }
  };

  const currentViewport = viewportSizes[viewportSize] || viewportSizes.desktop;

  // 🆕 Génération du HTML avec framework intégré
  const generatePreviewHTML = () => {
    if (!selectedComp || !selectedComp.template) {
      return generateEmptyState();
    }

    const componentHTML = renderTemplate(selectedComp.template, currentProps);
    
    // Utiliser le nouveau gestionnaire de framework
    return generateFrameworkPreviewHTML(tokens, selectedComp, currentProps, componentHTML);
  };

  // État vide quand pas de template
  const generateEmptyState = () => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>No Template</title>
    <style>
      body {
        margin: 0;
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        color: #6b7280;
      }
      .empty-state {
        max-width: 400px;
      }
      .empty-state h3 {
        margin: 0 0 16px 0;
        color: #374151;
      }
      .empty-state p {
        margin: 0;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="empty-state">
      <h3>${selectedComp?.name || 'No Component'}</h3>
      <p>This component needs a template to be previewed.<br>Go to the Code tab to add one.</p>
    </div>
  </body>
</html>`;
  };

  // Mettre à jour l'iframe quand les props changent
  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const html = generatePreviewHTML();
      iframeRef.current.srcdoc = html;
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLastUpdate(Date.now());
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedComp, currentProps, tokens, selectedComponent]);

  // Ouvrir dans une nouvelle fenêtre
  const openInNewWindow = () => {
    const html = generatePreviewHTML();
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.document.title = `${selectedComp?.name || 'Component'} Preview - ${currentFramework?.name}`;
    }
  };

  // Actualiser l'iframe
  const refreshPreview = () => {
    setLastUpdate(Date.now());
    if (iframeRef.current) {
      const html = generatePreviewHTML();
      iframeRef.current.srcdoc = html;
    }
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

  if (!components || !components.atoms) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">{t('loadingComponents')}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Viewport selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(viewportSizes).map(([key, viewport]) => {
              const Icon = viewport.icon;
              return (
                <button
                  key={key}
                  onClick={() => setViewportSize(key)}
                  className={`p-2 rounded ${
                    viewportSize === key 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title={`${key} view`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* 🆕 Framework indicator avec info */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500 font-medium">
              {currentFramework?.name} {tokens.framework.version}
            </div>
            <button
              onClick={() => setShowFrameworkInfo(!showFrameworkInfo)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Framework info"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Refresh */}
          <button
            onClick={refreshPreview}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title={t('refresh')}
          >
            <RefreshCw size={16} />
          </button>

          {/* External link */}
          <button
            onClick={openInNewWindow}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
          >
            <ExternalLink size={14} className="mr-1" />
            {t('openExternal')}
          </button>
        </div>
      </div>

      {/* 🆕 Framework Info Panel */}
      {showFrameworkInfo && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-800 mb-2">
                🚀 {currentFramework?.name} Integration
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Type:</strong> {currentFramework?.utilityBased ? 'Utility-based' : 'Component-based'}</div>
                <div><strong>CDN:</strong> {currentFramework?.cdn.css ? '✅ Loaded' : '❌ None'}</div>
                {currentFramework?.cssPrefix && (
                  <div><strong>Prefix:</strong> {currentFramework.cssPrefix}</div>
                )}
              </div>
              
              {/* 🆕 Framework suggestions */}
              {frameworkSuggestions && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-blue-800 mb-1">Suggested Classes:</div>
                  <div className="text-xs text-blue-600">
                    <code className="bg-blue-100 px-1 rounded">{frameworkSuggestions.base}</code>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowFrameworkInfo(false)}
              className="text-blue-400 hover:text-blue-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 relative"
          style={{
            width: currentViewport?.width || '100%',
            height: viewportSize === 'auto' ? 'auto' : (currentViewport?.height || getOptimalHeight()),
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">{t('loading')}...</span>
              </div>
            </div>
          )}

          {/* 🆕 Framework badge */}
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Settings size={10} />
              <span>{currentFramework?.name}</span>
            </div>
          </div>

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title={`${selectedComp?.name || 'Component'} Preview`}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>{selectedComp?.name || 'No component'}</span>
          <span>•</span>
          <span>Framework: {currentFramework?.name} {tokens.framework.version}</span>
          <span>•</span>
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
        <div>
          {currentViewport?.width || '100%'} × {currentViewport?.height || 'auto'}
        </div>
      </div>
    </div>
  );
};

export default VisualTab;