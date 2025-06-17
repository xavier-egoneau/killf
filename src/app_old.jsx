import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Eye, Code, Palette, Download, Wand2, Settings } from 'lucide-react';

const DesignSystemBuilder = () => {
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [activeTab, setActiveTab] = useState('visual');
  const [expandedSections, setExpandedSections] = useState({
    tokens: true,
    atoms: true,
    molecules: false,
    organisms: false,
    templates: false,
    pages: false
  });
  
  // Design tokens
  const [tokens, setTokens] = useState({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      sizes: {
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px'
      }
    }
  });

  // Component library
  const [components, setComponents] = useState({
    atoms: {
      button: {
        name: 'Button',
        props: {
          variant: { type: 'select', options: ['primary', 'secondary', 'outline'], default: 'primary' },
          size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
          disabled: { type: 'boolean', default: false },
          text: { type: 'string', default: 'Click me' }
        },
        scss: `.btn {
  font-family: var(--font-family);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &.btn-primary {
    background: var(--color-primary);
    color: white;
  }
  
  &.btn-secondary {
    background: var(--color-secondary);
    color: white;
  }
  
  &.btn-outline {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  
  &.btn-sm { padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-sm); }
  &.btn-md { padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-md); }
  &.btn-lg { padding: var(--spacing-md) var(--spacing-lg); font-size: var(--font-lg); }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}`
      },
      input: {
        name: 'Input',
        props: {
          type: { type: 'select', options: ['text', 'email', 'password'], default: 'text' },
          placeholder: { type: 'string', default: 'Enter text...' },
          disabled: { type: 'boolean', default: false }
        },
        scss: `.input {
  font-family: var(--font-family);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: var(--font-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background: #f8f9fa;
    opacity: 0.6;
  }
}`
      }
    },
    molecules: {
      card: {
        name: 'Card',
        props: {
          title: { type: 'string', default: 'Card Title' },
          content: { type: 'string', default: 'Card content goes here...' },
          hasButton: { type: 'boolean', default: true }
        },
        scss: `.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: var(--spacing-lg);
  
  .card-title {
    font-size: var(--font-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: #333;
  }
  
  .card-content {
    color: #666;
    line-height: 1.5;
    margin-bottom: var(--spacing-md);
  }
}`
      }
    },
    organisms: {
      header: {
        name: 'Header',
        props: {
          title: { type: 'string', default: 'My Application' },
          showNav: { type: 'boolean', default: true },
          ctaText: { type: 'string', default: 'Get Started' }
        },
        scss: `.header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-title {
    font-size: var(--font-xl);
    font-weight: 600;
    color: #333;
  }
  
  .header-nav {
    display: flex;
    gap: var(--spacing-lg);
    
    a {
      color: #666;
      text-decoration: none;
      &:hover { color: var(--color-primary); }
    }
  }
}`
      },
      productList: {
        name: 'Product List',
        props: {
          itemCount: { type: 'select', options: ['3', '6', '9'], default: '3' },
          showPrices: { type: 'boolean', default: true }
        },
        scss: `.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}`
      }
    },
    templates: {
      dashboardLayout: {
        name: 'Dashboard Layout',
        props: {
          sidebarWidth: { type: 'select', options: ['narrow', 'wide'], default: 'narrow' },
          showBreadcrumbs: { type: 'boolean', default: true }
        },
        scss: `.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  
  &.narrow { grid-template-columns: 200px 1fr; }
  &.wide { grid-template-columns: 300px 1fr; }
  
  .sidebar {
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
  }
  
  .main-content {
    padding: var(--spacing-lg);
  }
}`
      },
      landingPage: {
        name: 'Landing Page',
        props: {
          heroStyle: { type: 'select', options: ['centered', 'split'], default: 'centered' },
          showTestimonials: { type: 'boolean', default: true }
        },
        scss: `.landing-page {
  .hero {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    
    &.split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: left;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl) var(--spacing-lg);
  }
}`
      }
    },
    pages: {
      homePage: {
        name: 'Home Page',
        props: {
          theme: { type: 'select', options: ['light', 'dark'], default: 'light' },
          showPromo: { type: 'boolean', default: false }
        },
        scss: `.home-page {
  &.dark {
    background: #1a1a1a;
    color: white;
  }
  
  .promo-banner {
    background: var(--color-primary);
    color: white;
    text-align: center;
    padding: var(--spacing-sm);
  }
}`
      },
      profilePage: {
        name: 'Profile Page',
        props: {
          layout: { type: 'select', options: ['tabs', 'sidebar'], default: 'tabs' },
          showActivity: { type: 'boolean', default: true }
        },
        scss: `.profile-page {
  .profile-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    border-bottom: 1px solid #e9ecef;
  }
  
  .profile-content {
    &.tabs {
      .tab-nav {
        border-bottom: 1px solid #e9ecef;
        padding: 0 var(--spacing-lg);
      }
    }
    
    &.sidebar {
      display: grid;
      grid-template-columns: 250px 1fr;
    }
  }
}`
      }
    }
  });

  const [currentProps, setCurrentProps] = useState({});

  // Helper function to get component
  const getComponent = (componentPath) => {
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return components.atoms[componentPath] || components.molecules[componentPath] || null;
  };

  useEffect(() => {
    const comp = getComponent(selectedComponent);
    if (comp && comp.props) {
      const defaultProps = {};
      Object.entries(comp.props).forEach(([key, config]) => {
        defaultProps[key] = config.default;
      });
      setCurrentProps(defaultProps);
    }
  }, [selectedComponent, components]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateCSS = () => {
    return `:root {
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
}`;
  };

  const renderComponent = () => {
    const comp = getComponent(selectedComponent);
    if (!comp) return null;

    // Atoms
    if (selectedComponent === 'button') {
      return (
        <button 
          className={`btn btn-${currentProps.variant} btn-${currentProps.size}`}
          disabled={currentProps.disabled}
          style={{
            fontFamily: tokens.typography.fontFamily,
            backgroundColor: currentProps.variant === 'primary' ? tokens.colors.primary : 
                           currentProps.variant === 'secondary' ? tokens.colors.secondary : 'transparent',
            borderColor: currentProps.variant === 'outline' ? tokens.colors.primary : 'transparent',
            color: currentProps.variant === 'outline' ? tokens.colors.primary : 'white',
            padding: currentProps.size === 'sm' ? `${tokens.spacing.xs} ${tokens.spacing.sm}` :
                    currentProps.size === 'lg' ? `${tokens.spacing.md} ${tokens.spacing.lg}` :
                    `${tokens.spacing.sm} ${tokens.spacing.md}`,
            fontSize: tokens.typography.sizes[currentProps.size] || tokens.typography.sizes.md,
            border: currentProps.variant === 'outline' ? `1px solid ${tokens.colors.primary}` : 'none',
            borderRadius: '4px',
            cursor: currentProps.disabled ? 'not-allowed' : 'pointer',
            opacity: currentProps.disabled ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {currentProps.text}
        </button>
      );
    }

    if (selectedComponent === 'input') {
      return (
        <input
          type={currentProps.type}
          placeholder={currentProps.placeholder}
          disabled={currentProps.disabled}
          className="input"
          style={{
            fontFamily: tokens.typography.fontFamily,
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: tokens.typography.sizes.md,
            background: currentProps.disabled ? '#f8f9fa' : 'white',
            opacity: currentProps.disabled ? 0.6 : 1,
            outline: 'none',
            minWidth: '200px'
          }}
        />
      );
    }

    // Molecules
    if (selectedComponent === 'molecules.card') {
      return (
        <div className="card" style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: tokens.spacing.lg,
          maxWidth: '300px'
        }}>
          <h3 style={{
            fontSize: tokens.typography.sizes.lg,
            fontWeight: '600',
            marginBottom: tokens.spacing.md,
            color: '#333',
            margin: `0 0 ${tokens.spacing.md} 0`
          }}>
            {currentProps.title}
          </h3>
          <p style={{
            color: '#666',
            lineHeight: '1.5',
            marginBottom: tokens.spacing.md,
            margin: `0 0 ${tokens.spacing.md} 0`
          }}>
            {currentProps.content}
          </p>
          {currentProps.hasButton && (
            <button style={{
              backgroundColor: tokens.colors.primary,
              color: 'white',
              border: 'none',
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: tokens.typography.sizes.md
            }}>
              Learn More
            </button>
          )}
        </div>
      );
    }

    // Organisms
    if (selectedComponent === 'organisms.header') {
      return (
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e9ecef',
          padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: tokens.typography.sizes.xl,
            fontWeight: '600',
            color: '#333',
            margin: 0
          }}>
            {currentProps.title}
          </h1>
          {currentProps.showNav && (
            <nav style={{ display: 'flex', gap: tokens.spacing.lg }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>About</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Features</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Contact</a>
            </nav>
          )}
          <button style={{
            backgroundColor: tokens.colors.primary,
            color: 'white',
            border: 'none',
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {currentProps.ctaText}
          </button>
        </header>
      );
    }

    // Templates & Pages - Show placeholder layouts
    if (selectedComponent.startsWith('templates.') || selectedComponent.startsWith('pages.')) {
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
          <p style={{ margin: 0 }}>
            Complex layout component - would render full page/template structure
          </p>
          <div style={{
            marginTop: tokens.spacing.lg,
            padding: tokens.spacing.md,
            background: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            Props: {Object.keys(comp.props || {}).join(', ')}
          </div>
        </div>
      );
    }

    return null;
  };

  const generateAIPrompt = () => {
    const atomComponents = Object.entries(components.atoms).map(([key, comp]) => 
      `- ${comp.name} (${Object.keys(comp.props).join(', ')})`
    );
    const moleculeComponents = Object.entries(components.molecules).map(([key, comp]) => 
      `- ${comp.name} (${Object.keys(comp.props).join(', ')})`
    );
    const organismComponents = Object.entries(components.organisms).map(([key, comp]) => 
      `- ${comp.name} (${Object.keys(comp.props).join(', ')})`
    );
    const templateComponents = Object.entries(components.templates).map(([key, comp]) => 
      `- ${comp.name} (${Object.keys(comp.props).join(', ')})`
    );
    const pageComponents = Object.entries(components.pages).map(([key, comp]) => 
      `- ${comp.name} (${Object.keys(comp.props).join(', ')})`
    );

    return `# Complete Design System Export for AI

## Design Tokens
### Colors
- Primary: ${tokens.colors.primary}
- Secondary: ${tokens.colors.secondary}
- Success: ${tokens.colors.success}
- Danger: ${tokens.colors.danger}

### Spacing Scale
- XS: ${tokens.spacing.xs}, SM: ${tokens.spacing.sm}, MD: ${tokens.spacing.md}, LG: ${tokens.spacing.lg}, XL: ${tokens.spacing.xl}

### Typography
- Font Family: ${tokens.typography.fontFamily}
- Sizes: SM: ${tokens.typography.sizes.sm}, MD: ${tokens.typography.sizes.md}, LG: ${tokens.typography.sizes.lg}, XL: ${tokens.typography.sizes.xl}

## Available Components by Hierarchy

### Atoms (Basic UI Elements)
${atomComponents.join('\n')}

### Molecules (Simple Component Groups)
${moleculeComponents.join('\n')}

### Organisms (Complex UI Sections)
${organismComponents.join('\n')}

### Templates (Page Layouts)
${templateComponents.join('\n')}

### Pages (Complete Views)
${pageComponents.join('\n')}

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

## Example Usage
\`\`\`html
<!-- Organism: Header -->
<header class="header">
  <h1 class="header-title">My App</h1>
  <nav class="header-nav">
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
  </nav>
  <button class="btn btn-primary btn-md">Sign Up</button>
</header>

<!-- Template: Landing Page -->
<main class="landing-page">
  <section class="hero centered">
    <h2>Welcome to our platform</h2>
    <button class="btn btn-primary btn-lg">Get Started</button>
  </section>
</main>
\`\`\`

Your request: [USER_PROMPT_HERE]`;
  };

  // Helper function to get component props
  const getComponentProps = () => {
    const comp = getComponent(selectedComponent);
    return comp && comp.props ? comp.props : {};
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <style>{`
        ${generateCSS()}
        .btn { transition: all 0.2s; }
        .btn:hover:not(:disabled) { transform: translateY(-1px); }
      `}</style>
      
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Design System Builder</h1>
          <p className="text-sm text-gray-500">Build components, export to AI</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Design Tokens */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('tokens')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.tokens ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Palette size={16} className="ml-1 mr-2" />
              Design Tokens
            </button>
            
            {expandedSections.tokens && (
              <div className="mt-2 ml-6 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Primary Color</label>
                  <input 
                    type="color" 
                    value={tokens.colors.primary}
                    onChange={(e) => setTokens(prev => ({
                      ...prev,
                      colors: { ...prev.colors, primary: e.target.value }
                    }))}
                    className="w-full h-8 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Color</label>
                  <input 
                    type="color" 
                    value={tokens.colors.secondary}
                    onChange={(e) => setTokens(prev => ({
                      ...prev,
                      colors: { ...prev.colors, secondary: e.target.value }
                    }))}
                    className="w-full h-8 rounded border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Atoms */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('atoms')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.atoms ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="w-4 h-4 ml-1 mr-2 bg-blue-100 rounded"></div>
              Atoms
            </button>
            
            {expandedSections.atoms && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components.atoms).map(([key, comp]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedComponent(key)}
                    className={`block w-full text-left text-sm py-1 px-2 rounded ${
                      selectedComponent === key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Molecules */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('molecules')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.molecules ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="w-4 h-4 ml-1 mr-2 bg-green-100 rounded"></div>
              Molecules
            </button>
            
            {expandedSections.molecules && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components.molecules).map(([key, comp]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedComponent(`molecules.${key}`)}
                    className={`block w-full text-left text-sm py-1 px-2 rounded ${
                      selectedComponent === `molecules.${key}` ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Organisms */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('organisms')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.organisms ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="w-4 h-4 ml-1 mr-2 bg-yellow-100 rounded"></div>
              Organisms
            </button>
            
            {expandedSections.organisms && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components.organisms).map(([key, comp]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedComponent(`organisms.${key}`)}
                    className={`block w-full text-left text-sm py-1 px-2 rounded ${
                      selectedComponent === `organisms.${key}` ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Templates */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('templates')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.templates ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="w-4 h-4 ml-1 mr-2 bg-purple-100 rounded"></div>
              Templates
            </button>
            
            {expandedSections.templates && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components.templates).map(([key, comp]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedComponent(`templates.${key}`)}
                    className={`block w-full text-left text-sm py-1 px-2 rounded ${
                      selectedComponent === `templates.${key}` ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pages */}
          <div className="p-4">
            <button 
              onClick={() => toggleSection('pages')}
              className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.pages ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <div className="w-4 h-4 ml-1 mr-2 bg-red-100 rounded"></div>
              Pages
            </button>
            
            {expandedSections.pages && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components.pages).map(([key, comp]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedComponent(`pages.${key}`)}
                    className={`block w-full text-left text-sm py-1 px-2 rounded ${
                      selectedComponent === `pages.${key}` ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'visual' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={16} className="mr-2" />
                Visual
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'code' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Code size={16} className="mr-2" />
                Code
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'ai' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 size={16} className="mr-2" />
                AI Export
              </button>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 p-6">
            {activeTab === 'visual' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 h-full">
                <div className="flex items-center justify-center h-full">
                  {renderComponent()}
                </div>
              </div>
            )}
            
            {activeTab === 'code' && (
              <div className="bg-gray-900 rounded-lg text-green-400 font-mono text-sm p-6 h-full overflow-auto">
                <div className="mb-4">
                  <div className="text-gray-400 mb-2">/* CSS Variables */</div>
                  <pre>{generateCSS()}</pre>
                </div>
                
                <div className="mb-4">
                  <div className="text-gray-400 mb-2">/* Component SCSS */</div>
                  <pre>{getComponent(selectedComponent)?.scss || '/* No SCSS found */'}</pre>
                </div>
              </div>
            )}
            
            {activeTab === 'ai' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
                <h3 className="text-lg font-medium mb-4">AI-Ready Export</h3>
                <textarea 
                  readOnly
                  value={generateAIPrompt()}
                  className="w-full h-full border rounded p-4 font-mono text-sm resize-none"
                />
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Settings size={18} className="mr-2" />
              Properties
            </h3>
            
            <div className="space-y-4">
              {Object.entries(getComponentProps()).map(([propKey, config]) => (
                <div key={propKey}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {propKey}
                  </label>
                  
                  {config.type === 'select' && (
                    <select
                      value={currentProps[propKey] || config.default}
                      onChange={(e) => setCurrentProps(prev => ({ ...prev, [propKey]: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
                      onChange={(e) => setCurrentProps(prev => ({ ...prev, [propKey]: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  )}
                  
                  {config.type === 'boolean' && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentProps[propKey] !== undefined ? currentProps[propKey] : config.default}
                        onChange={(e) => setCurrentProps(prev => ({ ...prev, [propKey]: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Enabled</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemBuilder;