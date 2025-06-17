import React, { useState, useEffect } from 'react';

// VisualTab component - Affichage visuel dynamique des composants
const VisualTab = ({ tokens, components, selectedComponent, currentProps }) => {
  const getComponent = (componentPath) => {
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return components.atoms?.[componentPath] || components.molecules?.[componentPath] || null;


  };

  const renderComponent = () => {
    const comp = getComponent(selectedComponent);
    if (!comp) return <div className="text-gray-500">No component selected</div>;

    if (!components || !components.atoms) {
      return <div className="text-gray-400 text-sm">Loading components...</div>;
    }
    if (!selectedComponent || !components?.atoms) {
      return <div className="text-gray-400 text-sm">Loading components…</div>;
    }


    // Rendu dynamique pour les atomes
    if (comp.category === 'atoms') {
      if (selectedComponent === 'button') {
        return (
          <button 
            className={`btn btn-${currentProps?.variant || 'primary'} btn-${currentProps?.size || 'md'}`}
            disabled={currentProps?.disabled}
            style={{
              fontFamily: tokens.typography.fontFamily,
              backgroundColor: currentProps?.variant === 'primary' ? tokens.colors.primary : 
                             currentProps?.variant === 'secondary' ? tokens.colors.secondary : 'transparent',
              borderColor: currentProps?.variant === 'outline' ? tokens.colors.primary : 'transparent',
              color: currentProps?.variant === 'outline' ? tokens.colors.primary : 'white',
              padding: currentProps?.size === 'sm' ? `${tokens.spacing.xs} ${tokens.spacing.sm}` :
                      currentProps?.size === 'lg' ? `${tokens.spacing.md} ${tokens.spacing.lg}` :
                      `${tokens.spacing.sm} ${tokens.spacing.md}`,
              fontSize: tokens.typography.sizes[currentProps?.size] || tokens.typography.sizes.md,
              border: currentProps?.variant === 'outline' ? `1px solid ${tokens.colors.primary}` : 'none',
              borderRadius: '4px',
              cursor: currentProps?.disabled ? 'not-allowed' : 'pointer',
              opacity: currentProps?.disabled ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {currentProps?.text || 'Click me'}
          </button>
        );
      }

      if (selectedComponent === 'input') {
        return (
          <input
            type={currentProps?.type || 'text'}
            placeholder={currentProps?.placeholder || 'Enter text...'}
            disabled={currentProps?.disabled}
            className="input"
            style={{
              fontFamily: tokens.typography.fontFamily,
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: tokens.typography.sizes.md,
              background: currentProps?.disabled ? '#f8f9fa' : 'white',
              opacity: currentProps?.disabled ? 0.6 : 1,
              outline: 'none',
              minWidth: '200px'
            }}
          />
        );
      }
    }

    // Rendu générique pour tous les autres composants dynamiques
    return (
      <div style={{
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: tokens.spacing.xl,
        textAlign: 'center',
        color: '#666',
        maxWidth: '600px'
      }}>
        <h3 style={{ margin: `0 0 ${tokens.spacing.md} 0` }}>{comp.name}</h3>
        <p style={{ margin: 0, marginBottom: tokens.spacing.md }}>
          {comp.category.charAt(0).toUpperCase() + comp.category.slice(1)} component
        </p>
        <div style={{
          marginTop: tokens.spacing.lg,
          padding: tokens.spacing.md,
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Props: {Object.keys(comp.props || {}).join(', ') || 'None'}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 h-full">
      <div className="flex items-center justify-center h-full">
        {renderComponent()}
      </div>
    </div>
  );
};

// CodeTab component avec HTML réel (pas de placeholders)
const CodeTab = ({ tokens, components, selectedComponent, currentProps, onUpdateComponent }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalHtmlCode, setOriginalHtmlCode] = useState('');
  const [originalCssCode, setOriginalCssCode] = useState('');

  const getComponent = (componentPath) => {
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return components.atoms[componentPath] || components.molecules[componentPath] || null;
  };

  const selectedComp = getComponent(selectedComponent);

  // Génération du HTML avec les valeurs réelles (pas de placeholders)
  const generateLiveHTML = () => {
    if (!selectedComp) return '<!-- No component selected -->';

    if (selectedComponent === 'button') {
      const variant = currentProps?.variant || 'primary';
      const size = currentProps?.size || 'md';
      const disabled = currentProps?.disabled ? ' disabled' : '';
      const text = currentProps?.text || 'Click me';
      
      return `<button class="btn btn-${variant} btn-${size}"${disabled}>
  ${text}
</button>`;
    }

    if (selectedComponent === 'input') {
      const type = currentProps?.type || 'text';
      const placeholder = currentProps?.placeholder || 'Enter text...';
      const disabled = currentProps?.disabled ? '\n  disabled' : '';
      
      return `<input 
  type="${type}" 
  class="input" 
  placeholder="${placeholder}"${disabled}
/>`;
    }

    if (selectedComponent === 'molecules.card') {
      const title = currentProps?.title || 'Card Title';
      const content = currentProps?.content || 'Card content goes here...';
      const button = currentProps?.hasButton ? '\n  <button class="btn btn-primary">Learn More</button>' : '';
      
      return `<div class="card">
  <h3 class="card-title">${title}</h3>
  <p class="card-content">${content}</p>${button}
</div>`;
    }

    if (selectedComponent === 'organisms.header') {
      const title = currentProps?.title || 'My Application';
      const ctaText = currentProps?.ctaText || 'Get Started';
      const nav = currentProps?.showNav ? `\n  <nav class="header-nav">
    <a href="#about">About</a>
    <a href="#features">Features</a>
    <a href="#contact">Contact</a>
  </nav>` : '';
      
      return `<header class="header">
  <h1 class="header-title">${title}</h1>${nav}
  <button class="btn btn-primary">${ctaText}</button>
</header>`;
    }

    // Pour les autres composants
    const componentKey = selectedComponent.includes('.') ? selectedComponent.split('.')[1] : selectedComponent;
    const propsDisplay = Object.keys(currentProps || {}).length > 0 
      ? `\n  <!-- Current props: ${Object.entries(currentProps).map(([k,v]) => `${k}="${v}"`).join(', ')} -->`
      : '\n  <!-- No props set -->';
    
    return `<div class="${componentKey}">
  <!-- ${selectedComp.name} markup -->${propsDisplay}
</div>`;
  };

  // Génération du CSS
  const generateCSS = () => {
    if (!selectedComp) return '/* No component selected */';

    let css = `:root {
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

    return css;
  };

  // Mettre à jour le code quand le composant ou les props changent
  useEffect(() => {
    const newHtmlCode = generateLiveHTML();
    const newCssCode = generateCSS();
    
    setHtmlCode(newHtmlCode);
    setCssCode(newCssCode);
    setOriginalHtmlCode(newHtmlCode);
    setOriginalCssCode(newCssCode);
    setHasUnsavedChanges(false);
  }, [selectedComponent, currentProps, tokens]);

  // Vérifier les changements
  useEffect(() => {
    const hasChanges = htmlCode !== originalHtmlCode || cssCode !== originalCssCode;
    setHasUnsavedChanges(hasChanges);
  }, [htmlCode, cssCode, originalHtmlCode, originalCssCode]);

  // Sauvegarder les modifications
  const saveChanges = () => {
    if (!selectedComp || !onUpdateComponent) {
      console.log('Cannot save: missing component or update function');
      return;
    }

    const category = selectedComp.category;
    const componentKey = selectedComponent.includes('.') ? selectedComponent.split('.')[1] : selectedComponent;

    console.log('Saving changes:', { category, componentKey, cssCode: cssCode.substring(0, 100) + '...' });

    // Mettre à jour le composant avec les nouvelles valeurs
    onUpdateComponent(category, componentKey, {
      scss: cssCode
    });

    // Marquer comme sauvegardé
    setOriginalHtmlCode(htmlCode);
    setOriginalCssCode(cssCode);
    setHasUnsavedChanges(false);

    // Feedback visuel
    const button = document.getElementById('save-changes');
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✅ Saved!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }

    console.log('Changes saved successfully');
  };

  const discardChanges = () => {
    setHtmlCode(originalHtmlCode);
    setCssCode(originalCssCode);
    setHasUnsavedChanges(false);
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Current Props Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="text-blue-700 font-medium text-sm mb-1">
          📋 Current Props ({selectedComp?.name || 'No component'})
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

      
     

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveCodeTab('html')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'html' 
              ? 'bg-white text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 HTML (Live)
        </button>
        <button
          onClick={() => setActiveCodeTab('css')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeCodeTab === 'css' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎨 CSS/SCSS
        </button>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 min-h-0">
        {activeCodeTab === 'html' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium text-sm">HTML (with live prop values)</span>
              <div className="flex gap-2">
                <button 
                  id="save-html"
                  onClick={saveChanges}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  💾 Save
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
              onChange={(e) => setHtmlCode(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                minHeight: '400px',
                lineHeight: '1.6'
              }}
              placeholder="HTML with actual prop values..."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 This HTML shows the actual values from your current props - ready to copy and use!
            </div>
          </div>
        )}

        {activeCodeTab === 'css' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
  <span className="text-gray-700 font-medium text-sm">CSS/SCSS Styles</span>
  <div className="flex gap-2">
    <button 
      id="save-css"
      onClick={saveChanges}
      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
    >
      💾 Save
    </button>
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
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                minHeight: '400px',
                lineHeight: '1.6'
              }}
              placeholder="CSS/SCSS styles for your component..."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 Use CSS variables like --color-primary for theming
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="text-green-700 font-medium text-sm mb-1">
          💡 How it works
        </div>
        <div className="text-green-600 text-xs space-y-1">
          <div>• HTML shows live values from your current props (auto-updated)</div>
          <div>• CSS can be edited and saved to update the component permanently</div>
          <div>• Change props in the right panel to see HTML update instantly</div>
          <div>• Only CSS changes are saved - HTML is always auto-generated</div>
        </div>
      </div>
    </div>
  );
};

// AIExportTab component
const AIExportTab = ({ tokens, components }) => {
  const generateAIPrompt = () => {
    const getComponentsByCategory = (category) => {
      return Object.entries(components[category] || {})
        .map(([key, comp]) => `- ${comp.name} (${Object.keys(comp.props || {}).join(', ') || 'no props'})`)
        .join('\n');
    };

    return `# Complete Design System Export for AI

## Design Tokens
### Colors
${Object.entries(tokens.colors).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

### Spacing Scale
${Object.entries(tokens.spacing).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

### Typography
- Font Family: ${tokens.typography.fontFamily}
${Object.entries(tokens.typography.sizes).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

## Available Components by Hierarchy

### Atoms (Basic UI Elements)
${getComponentsByCategory('atoms')}

### Molecules (Simple Component Groups)
${getComponentsByCategory('molecules')}

### Organisms (Complex UI Sections)
${getComponentsByCategory('organisms')}

### Templates (Page Layouts)
${getComponentsByCategory('templates')}

### Pages (Complete Views)
${getComponentsByCategory('pages')}

## Component Usage Guidelines
1. **Atoms**: Use for basic interactions (buttons, inputs, text)
2. **Molecules**: Use for simple UI patterns (cards, form fields)
3. **Organisms**: Use for major page sections (headers, product lists)
4. **Templates**: Use for defining page structure and layout
5. **Pages**: Use for complete user experiences

## Instructions for AI
Create interfaces using components from this design system. Always:
- Respect the atomic design hierarchy
- Use defined design tokens for consistency
- Ensure accessibility and responsive design
- Structure HTML using our component classes

Ready for AI integration!`;
  };

  const aiPrompt = generateAIPrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiPrompt).then(() => {
      const button = document.getElementById('copy-ai');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <span className="text-purple-400 mr-2">🤖</span>
          AI-Ready Export
        </h3>
        <button 
          id="copy-ai"
          onClick={copyToClipboard}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
        >
          📋 Copy to Clipboard
        </button>
      </div>
      
      <div className="bg-black rounded-lg p-6 border border-gray-700 font-mono text-sm">
        <pre className="text-gray-300 whitespace-pre-wrap">{aiPrompt}</pre>
      </div>
    </div>
  );
};

// Main Canvas component
const Canvas = ({ 
  activeTab, 
  tokens, 
  components, 
  selectedComponent, 
  currentProps,
  onUpdateComponent 
}) => {
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'visual':
        return (
          <VisualTab 
            tokens={tokens}
            components={components}
            selectedComponent={selectedComponent}
            currentProps={currentProps}
          />
        );
      case 'code':
        return (
          <CodeTab 
            tokens={tokens}
            components={components}
            selectedComponent={selectedComponent}
            currentProps={currentProps}
            onUpdateComponent={onUpdateComponent}
          />
        );
      case 'ai':
        return (
          <AIExportTab 
            tokens={tokens}
            components={components}
          />
        );
      default:
        return (
          <VisualTab 
            tokens={tokens} 
            components={components} 
            selectedComponent={selectedComponent} 
            currentProps={currentProps} 
          />
        );
    }
  };

  return (
    <div className="flex-1 p-6">
      {renderActiveTab()}
    </div>
  );
};

export default Canvas;