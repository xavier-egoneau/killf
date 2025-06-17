import React, { useState, useEffect } from 'react';
import { renderTemplate, generateDefaultTemplate, validateTemplate } from '../utils/templateEngine';

const CodeTab = ({ tokens, components, selectedComponent, currentProps, onUpdateComponent }) => {
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

  // Génération du CSS complet avec tokens
  const generateCSS = () => {
    if (!selectedComp) return '/* No component selected */';

    const tokenCSS = `:root {
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  --color-success: ${tokens.colors.success};
  --color-danger: ${tokens.colors.danger};
  
  --spacing-xs: ${tokens.spacing.xs};
  --spacing-sm: ${tokens.spacing.sm};
  --spacing-md: ${tokens.spacing.md};
  --spacing-lg: ${tokens.spacing.lg};
  --spacing-xl: ${tokens.spacing.xl};
  
  --font-family: ${tokens.typography.fontFamily};
  --font-sm: ${tokens.typography.sizes.sm};
  --font-md: ${tokens.typography.sizes.md};
  --font-lg: ${tokens.typography.sizes.lg};
  --font-xl: ${tokens.typography.sizes.xl};
}

/* ${selectedComp.name} Component */
${selectedComp.scss || `/* No styles defined for ${selectedComp.name} */`}`;

    return tokenCSS;
  };

  // Génération du HTML final (template + props)
  const generateFinalHTML = () => {
    if (!selectedComp || !selectedComp.template) {
      return '<!-- No template defined for this component -->';
    }
    
    return renderTemplate(selectedComp.template, currentProps);
  };

  // Mettre à jour le code quand le composant change
  useEffect(() => {
    if (selectedComp) {
      const newTemplateCode = selectedComp.template || '';
      const newHtmlCode = generateFinalHTML();
      const newCssCode = generateCSS();
      
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
                      htmlCode !== originalHtmlCode || 
                      cssCode !== originalCssCode;
    setHasUnsavedChanges(hasChanges);
  }, [templateCode, htmlCode, cssCode, originalTemplateCode, originalHtmlCode, originalCssCode]);

  // Fonction de sauvegarde améliorée
  const saveChanges = async () => {
    if (!selectedComp || !onUpdateComponent || !hasUnsavedChanges) {
      console.log('⚠️ Cannot save: missing component, update function, or no changes');
      return;
    }

    if (!templateValidation.isValid) {
      console.log('⚠️ Cannot save: template has validation errors');
      showSaveError('Template validation failed');
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

      // Extraire seulement la partie SCSS (sans les tokens CSS)
      const lines = cssCode.split('\n');
      const componentStartIndex = lines.findIndex(line => line.includes(`/* ${selectedComp.name} Component */`));
      
      let scssOnly = selectedComp.scss || '';
      if (componentStartIndex !== -1 && componentStartIndex < lines.length - 1) {
        scssOnly = lines.slice(componentStartIndex + 1).join('\n').trim();
      }

      // Préparer les updates
      const updates = {
        scss: scssOnly
      };

      // Si le template a été modifié, l'inclure dans la sauvegarde
      if (templateCode !== originalTemplateCode) {
        updates.template = templateCode;
        console.log('📝 Template has been modified, saving template');
      }

      console.log('📤 Updates to send:', {
        scss: scssOnly.substring(0, 100) + '...',
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

  const showSaveSuccess = () => {
    const button = document.getElementById('save-code');
    if (button) {
      const originalText = button.textContent;
      const originalBg = button.style.backgroundColor;
      button.textContent = '✅ Saved!';
      button.style.backgroundColor = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBg;
      }, 2000);
    }
  };

  const showSaveError = (message = 'Save failed') => {
    const button = document.getElementById('save-code');
    if (button) {
      const originalText = button.textContent;
      const originalBg = button.style.backgroundColor;
      button.textContent = '❌ Error';
      button.style.backgroundColor = '#ef4444';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBg;
      }, 3000);
    }
  };

  const discardChanges = () => {
    setTemplateCode(originalTemplateCode);
    setHtmlCode(originalHtmlCode);
    setCssCode(originalCssCode);
    setHasUnsavedChanges(false);
  };

  const generateDefaultTemplate = () => {
    if (!selectedComp) return;
    
    const newTemplate = generateDefaultTemplate(selectedComp.category, selectedComp.name, selectedComp.props);
    setTemplateCode(newTemplate);
    console.log('🔄 Generated default template for', selectedComp.name);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      const button = document.getElementById(`copy-${type}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const formatCode = (type) => {
    try {
      if (type === 'html' || type === 'template') {
        // Simple HTML formatting
        const code = type === 'html' ? htmlCode : templateCode;
        const formatted = code
          .replace(/></g, '>\n<')
          .replace(/^\s+|\s+$/g, '')
          .split('\n')
          .map((line, index) => {
            const depth = (line.match(/</g) || []).length - (line.match(/\//g) || []).length;
            return '  '.repeat(Math.max(0, depth)) + line.trim();
          })
          .join('\n');
        
        if (type === 'html') {
          setHtmlCode(formatted);
        } else {
          setTemplateCode(formatted);
        }
      }
    } catch (error) {
      console.error(`Error formatting ${type}:`, error);
    }
  };

  if (!selectedComp) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-center">
          <div className="text-lg mb-2">No component selected</div>
          <div className="text-sm">Select a component from the sidebar to edit</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white p-4">
      {/* Current Props Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="text-blue-700 font-medium text-sm mb-1">
          📋 Current Props ({selectedComp.name})
          {selectedComp.template && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Has Template</span>}
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
            ❌ Template Validation Errors
          </div>
          <ul className="text-red-600 text-xs space-y-1">
            {templateValidation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="text-yellow-700 font-medium text-sm mb-2">
            ⚠️ You have unsaved changes
          </div>
          <div className="flex gap-2">
            <button 
              id="save-code"
              onClick={saveChanges}
              disabled={isSaving || !templateValidation.isValid}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
            <button 
              onClick={discardChanges}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            >
              🗑️ Discard
            </button>
          </div>
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
          🔧 Template {templateCode !== originalTemplateCode && <span className="text-red-500">●</span>}
        </button>
        <button
          onClick={() => setActiveCodeTab('html')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'html' 
              ? 'bg-white text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 Preview HTML
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
              <span className="text-gray-700 font-medium text-sm">Template (with variables)</span>
              <div className="flex gap-2">
                <button 
                  onClick={generateDefaultTemplate}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                  title="Generate default template"
                >
                  🔄 Generate
                </button>
                <button 
                  onClick={() => formatCode('template')}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  title="Format template"
                >
                  🎨 Format
                </button>
                <button 
                  id="copy-template"
                  onClick={() => copyToClipboard(templateCode, 'template')}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  📋 Copy
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
              placeholder="HTML template with variables..."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 Use <code>{'{{propName}}'}</code> for variables • <code>{'{{#if propName}}...{{/if}}'}</code> for conditionals • <code>{'{{#class propName}}class-name{{/class}}'}</code> for conditional classes
            </div>
          </div>
        )}

        {activeCodeTab === 'html' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">Preview HTML (Generated from Template + Props)</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => formatCode('html')}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                  title="Format HTML"
                >
                  🎨 Format
                </button>
                <button 
                  id="copy-html"
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                >
                  📋 Copy
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
              placeholder="Generated HTML will appear here..."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 This HTML is automatically generated from your template + current props values • Changes in Template or Properties will update this preview
            </div>
          </div>
        )}

        {activeCodeTab === 'css' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">CSS/SCSS Styles</span>
              <div className="flex gap-2">
                <button 
                  id="copy-css"
                  onClick={() => copyToClipboard(cssCode, 'css')}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  📋 Copy
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
              placeholder="CSS/SCSS styles for your component..."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 Use CSS variables like --color-primary for theming • Full SCSS support
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTab;