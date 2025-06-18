// components/PreviewFrame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Maximize2, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { renderTemplate } from '../utils/templateEngine';

const PreviewFrame = ({ tokens, component, currentProps, selectedComponent }) => {
  const { t } = useI18n();
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Générer le HTML complet pour l'iframe
  const generatePreviewHTML = () => {
    if (!component || !component.template) {
      return generateEmptyState();
    }

    const frameworkCSS = getFrameworkCDN(tokens.framework);
    const customCSS = generateCSSVariables(tokens);
    const componentCSS = component.scss || '';
    const componentHTML = renderTemplate(component.template, currentProps);
    
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${component.name} Preview</title>
    
    <!-- Framework CSS -->
    ${frameworkCSS}
    
    <!-- Custom Design Tokens -->
    <style>
      ${customCSS}
      
      /* Component-specific styles */
      ${componentCSS}
      
      /* Preview container styles */
      body {
        margin: 0;
        padding: 20px;
        font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        background: #f8f9fa;
        min-height: 100vh;
      }
      
      .preview-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 40px);
        padding: 20px;
      }
      
      .preview-content {
        max-width: 100%;
        width: 100%;
      }
      
      /* Framework-specific adjustments */
      ${getFrameworkAdjustments(tokens.framework)}
    </style>
    
    <!-- Framework JS if needed -->
    ${getFrameworkJS(tokens.framework)}
  </head>
  <body>
    <div class="preview-container">
      <div class="preview-content">
        ${componentHTML}
      </div>
    </div>
    
    <!-- Component info overlay (dev mode) -->
    <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace; z-index: 9999;">
      ${component.name} • ${tokens.framework.type} ${tokens.framework.version}
    </div>
  </body>
</html>`;
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
      <h3>${component?.name || 'No Component'}</h3>
      <p>This component needs a template to be previewed.<br>Go to the Code tab to add one.</p>
    </div>
  </body>
</html>`;
  };

  // CDN links pour chaque framework
  const getFrameworkCDN = (framework) => {
    const cdnLinks = {
      bootstrap: `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      `,
      tailwind: `
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '${tokens.colors.primary}',
                  secondary: '${tokens.colors.secondary}',
                  success: '${tokens.colors.success}',
                  danger: '${tokens.colors.danger}'
                }
              }
            }
          }
        </script>
      `,
      angular: `
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
      `,
      vanilla: ''
    };
    return cdnLinks[framework?.type] || '';
  };

  // JS pour les frameworks qui en ont besoin
  const getFrameworkJS = (framework) => {
    const jsLinks = {
      bootstrap: `
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      `,
      angular: `
        <!-- Angular Material would need full Angular setup -->
      `,
      tailwind: '',
      vanilla: ''
    };
    return jsLinks[framework?.type] || '';
  };

  // Ajustements CSS spécifiques par framework
  const getFrameworkAdjustments = (framework) => {
    const adjustments = {
      bootstrap: `
        /* Bootstrap adjustments */
        .preview-content {
          /* Bootstrap container behavior */
        }
      `,
      tailwind: `
        /* Tailwind adjustments */
        .preview-content {
          /* Tailwind specific styles */
        }
      `,
      angular: `
        /* Angular Material adjustments */
        body {
          font-family: Roboto, "Helvetica Neue", sans-serif;
        }
      `,
      vanilla: `
        /* Vanilla CSS adjustments */
      `
    };
    return adjustments[framework?.type] || '';
  };

  // Générer les CSS variables depuis les tokens
  const generateCSSVariables = (tokens) => {
    const colorVars = Object.entries(tokens.colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join('\n');

    const spacingVars = Object.entries(tokens.spacing)
      .map(([key, value]) => `  --spacing-${key}: ${value};`)
      .join('\n');

    const typographyVars = `  --font-family: ${tokens.typography.fontFamily};
  --font-family-secondary: ${tokens.typography.secondaryFont};
${Object.entries(tokens.typography.sizes)
  .map(([key, value]) => `  --font-${key}: ${value};`)
  .join('\n')}`;

    return `:root {
${colorVars}

${spacingVars}

${typographyVars}
}`;
  };

  // Mettre à jour l'iframe quand les props changent
  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const html = generatePreviewHTML();
      iframeRef.current.srcdoc = html;
      
      // Simuler le loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLastUpdate(Date.now());
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [component, currentProps, tokens, selectedComponent]);

  // Ouvrir dans une nouvelle fenêtre
  const openInNewWindow = () => {
    const html = generatePreviewHTML();
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.document.title = `${component?.name || 'Component'} Preview`;
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

  // Responsive viewport sizes
  const viewportSizes = {
    mobile: { width: '375px', height: '667px', icon: Smartphone },
    tablet: { width: '768px', height: '1024px', icon: Tablet },
    desktop: { width: '100%', height: '100%', icon: Monitor }
  };

  const currentViewport = viewportSizes[viewportSize];
  const ViewportIcon = currentViewport.icon;

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

          {/* Framework indicator */}
          <div className="text-sm text-gray-500 font-medium">
            {tokens.framework.type} {tokens.framework.version}
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

          {/* Maximize */}
          <button
            onClick={openInNewWindow}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title={t('openInNewWindow')}
          >
            <Maximize2 size={16} />
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

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 relative"
          style={{
            width: currentViewport.width,
            height: currentViewport.height,
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

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title={`${component?.name || 'Component'} Preview`}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div>
          {component?.name || 'No component'} • Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
        <div>
          {currentViewport.width} × {currentViewport.height}
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;