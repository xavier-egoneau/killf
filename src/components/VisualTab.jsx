// components/VisualTab.jsx - Version avec support Angular runtime
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Maximize2, Smartphone, Tablet, Monitor, RefreshCw, Settings, Info, Code, Zap } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { renderTemplate } from '../utils/templateEngine';
import { 
  generateFrameworkPreviewHTML, 
  FRAMEWORK_CONFIGS, 
  getFrameworkSuggestions,
  updateFrameworkProps,
  requiresFrameworkUpdate,
  getFrameworkTemplateSuggestions,
  convertTemplateToFramework,
  generateFrameworkDefaultProps
} from '../utils/frameworkManager';

const VisualTab = ({ tokens, components, selectedComponent, currentProps }) => {
  const { t } = useI18n();
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showFrameworkInfo, setShowFrameworkInfo] = useState(false);
  const [frameworkSuggestions, setFrameworkSuggestions] = useState(null);
  const [showTemplateHelper, setShowTemplateHelper] = useState(false);
  const [frameworkCompatibility, setFrameworkCompatibility] = useState(null);
  
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

  // 🆕 Vérifier la compatibilité du framework avec le composant
  useEffect(() => {
    if (selectedComp) {
      const compatibility = requiresFrameworkUpdate(tokens.framework.type, selectedComp);
      setFrameworkCompatibility(compatibility);
    }
  }, [selectedComp, tokens.framework.type]);

  // Mettre à jour les suggestions du framework quand le composant change
  useEffect(() => {
    if (selectedComp) {
      const componentType = selectedComp.category === 'atoms' ? 'button' : 'card';
      const suggestions = getFrameworkSuggestions(tokens, componentType);
      setFrameworkSuggestions(suggestions);
    }
  }, [selectedComp, tokens.framework]);

  // 🆕 Mettre à jour les props dans l'iframe pour les frameworks runtime
  useEffect(() => {
    if (iframeRef.current && currentFramework?.requiresRuntime) {
      updateFrameworkProps(iframeRef.current, currentProps, tokens.framework.type);
    }
  }, [currentProps, tokens.framework.type, currentFramework]);

  // Déterminer la hauteur optimale basée sur le type de composant
  const getOptimalHeight = () => {
    if (!selectedComp) return '400px';
    
    const componentType = selectedComp.category;
    const componentName = selectedComp.name.toLowerCase();
    
    // 🆕 Heights spécifiques pour Angular
    if (tokens.framework.type === 'angular') {
      const angularHeights = {
        atoms: '200px',
        molecules: '300px',
        organisms: '400px',
        templates: '600px',
        pages: '800px'
      };
      return angularHeights[componentType] || '350px';
    }
    
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

  // 🆕 Génération du HTML avec support runtime amélioré
  const generatePreviewHTML = () => {
    if (!selectedComp || !selectedComp.template) {
      return generateEmptyState();
    }

    const componentHTML = renderTemplate(selectedComp.template, currentProps);
    
    // 🆕 Utiliser le gestionnaire de framework enrichi
    const previewHTML = generateFrameworkPreviewHTML(tokens, selectedComp, currentProps, componentHTML);
    
    // Pour Angular et autres frameworks runtime, on retourne directement l'iframe généré
    if (currentFramework?.requiresRuntime) {
      return previewHTML;
    }
    
    return previewHTML;
  };

  // État vide quand pas de template
  const generateEmptyState = () => {
    const templateSuggestion = getFrameworkTemplateSuggestions(tokens.framework.type, 'button');
    
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
        max-width: 500px;
      }
      .empty-state h3 {
        margin: 0 0 16px 0;
        color: #374151;
      }
      .empty-state p {
        margin: 0 0 16px 0;
        line-height: 1.5;
      }
      .template-suggestion {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        text-align: left;
        margin-top: 16px;
        color: #374151;
      }
    </style>
  </head>
  <body>
    <div class="empty-state">
      <h3>${selectedComp?.name || 'No Component'}</h3>
      <p>This component needs a template to be previewed.<br>Go to the Code tab to add one.</p>
      ${templateSuggestion ? `
        <div class="template-suggestion">
          <strong>💡 ${currentFramework?.name} Template Suggestion:</strong><br><br>
          <code>${templateSuggestion.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
        </div>
      ` : ''}
    </div>
  </body>
</html>`;
  };

  // Mettre à jour l'iframe quand les props changent
  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const html = generatePreviewHTML();
      
      // 🆕 Pour les frameworks runtime, on gère différemment
      if (currentFramework?.requiresRuntime) {
        console.log(`🚀 Loading ${currentFramework.name} runtime environment...`);
      }
      
      iframeRef.current.srcdoc = html;
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLastUpdate(Date.now());
      }, currentFramework?.requiresRuntime ? 800 : 300); // Plus de temps pour Angular
      
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

  // 🆕 Convertir le template vers le framework actuel
  const convertTemplateToCurrentFramework = () => {
    if (!selectedComp?.template) return;
    
    const suggestion = getFrameworkTemplateSuggestions(tokens.framework.type, 'button');
    if (suggestion) {
      setShowTemplateHelper(true);
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

          {/* 🆕 Framework indicator avec type */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500 font-medium flex items-center">
              {currentFramework?.requiresRuntime && (
                <Zap size={14} className="mr-1 text-yellow-500" title="Runtime Framework" />
              )}
              {currentFramework?.name} {tokens.framework.version}
              {currentFramework?.type === 'js-framework' && (
                <span className="ml-1 px-1 bg-purple-100 text-purple-600 text-xs rounded">JS</span>
              )}
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
          {/* 🆕 Template Helper Button */}
          {!selectedComp.template && (
            <button
              onClick={convertTemplateToCurrentFramework}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors flex items-center"
              title="Get template suggestion"
            >
              <Code size={14} className="mr-1" />
              Template Help
            </button>
          )}

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

      {/* 🆕 Framework Compatibility Warning */}
      {frameworkCompatibility && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              <div className="text-sm text-orange-800">
                <strong>Framework Mismatch:</strong> {frameworkCompatibility.reason}
              </div>
            </div>
            <div className="text-sm text-orange-600">
              Recommended: <strong>{frameworkCompatibility.recommended}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Framework Info Panel */}
      {showFrameworkInfo && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-800 mb-2">
                🚀 {currentFramework?.name} Integration
                {currentFramework?.requiresRuntime && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded">
                    Runtime Environment
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Type:</strong> {currentFramework?.type === 'js-framework' ? 'JavaScript Framework' : 'CSS Framework'}</div>
                <div><strong>CDN:</strong> {Array.isArray(currentFramework?.cdn.css) ? '✅ Multiple files' : (currentFramework?.cdn.css ? '✅ Loaded' : '❌ None')}</div>
                {currentFramework?.requiresRuntime && (
                  <div><strong>Runtime:</strong> ✅ Angular bootstrap active</div>
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

      {/* 🆕 Template Helper Modal */}
      {showTemplateHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {currentFramework?.name} Template Suggestions
              </h3>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">
                Here are some template suggestions for {currentFramework?.name}:
              </div>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {getFrameworkTemplateSuggestions(tokens.framework.type, 'button') || 'No suggestions available'}
              </pre>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowTemplateHelper(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
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
                <span className="text-sm">
                  {currentFramework?.requiresRuntime ? `Loading ${currentFramework.name}...` : t('loading')}
                </span>
              </div>
            </div>
          )}

          {/* 🆕 Framework badge enrichi */}
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Settings size={10} />
              <span>{currentFramework?.name}</span>
              {currentFramework?.requiresRuntime && (
                <Zap size={10} className="text-yellow-400" />
              )}
            </div>
          </div>

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title={`${selectedComp?.name || 'Component'} Preview - ${currentFramework?.name}`}
          />
        </div>
      </div>

      {/* Status bar enrichi */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>{selectedComp?.name || 'No component'}</span>
          <span>•</span>
          <span className="flex items-center">
            Framework: {currentFramework?.name} {tokens.framework.version}
            {currentFramework?.requiresRuntime && (
              <span className="ml-1 px-1 bg-purple-100 text-purple-600 rounded">Runtime</span>
            )}
          </span>
          <span>•</span>
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
          {currentFramework?.requiresRuntime && (
            <>
              <span>•</span>
              <span className="text-green-600">Angular Bootstrap Active</span>
            </>
          )}
        </div>
        <div>
          {currentViewport?.width || '100%'} × {currentViewport?.height || 'auto'}
        </div>
      </div>
    </div>
  );
};

export default VisualTab;