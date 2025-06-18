/**
 * Gestionnaire centralisé des frameworks CSS
 * Gère le chargement, la configuration et l'intégration des frameworks
 */

import { frameworkOptions } from '../data/tokens';

/**
 * Configuration détaillée des frameworks avec CDN et composants
 */
export const FRAMEWORK_CONFIGS = {
  tailwind: {
    ...frameworkOptions.tailwind,
    cdn: {
      css: 'https://cdn.tailwindcss.com',
      js: `<script>
        if (typeof tailwind !== 'undefined') {
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: 'var(--color-primary)',
                  secondary: 'var(--color-secondary)',
                  success: 'var(--color-success)',
                  danger: 'var(--color-danger)'
                }
              }
            }
          }
        }
      </script>`
    },
    components: {
      button: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
      card: 'bg-white shadow-md rounded-lg p-6',
      alert: 'bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded'
    },
    utilities: {
      spacing: ['p-', 'm-', 'px-', 'py-', 'mx-', 'my-'],
      colors: ['text-', 'bg-', 'border-'],
      typography: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl']
    }
  },

  bootstrap: {
    ...frameworkOptions.bootstrap,
    cdn: {
      css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
      js: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
    },
    components: {
      button: 'btn btn-primary',
      card: 'card',
      alert: 'alert alert-primary'
    },
    utilities: {
      spacing: ['p-', 'm-', 'px-', 'py-', 'mx-', 'my-'],
      colors: ['text-', 'bg-', 'border-'],
      typography: ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6']
    },
    customCSS: `
      :root {
        --bs-primary: var(--color-primary);
        --bs-secondary: var(--color-secondary);
        --bs-success: var(--color-success);
        --bs-danger: var(--color-danger);
      }
    `
  },

  angular: {
    ...frameworkOptions.angular,
    cdn: {
      css: `
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
      `,
      js: ''
    },
    components: {
      button: 'mat-raised-button',
      card: 'mat-card',
      alert: 'mat-card mat-elevation-z2'
    },
    utilities: {
      spacing: [],
      colors: ['mat-primary', 'mat-accent', 'mat-warn'],
      typography: ['mat-headline-1', 'mat-headline-2', 'mat-body-1', 'mat-body-2']
    },
    customCSS: `
      body {
        font-family: Roboto, "Helvetica Neue", sans-serif;
        margin: 0;
      }
      
      .mat-primary {
        background-color: var(--color-primary) !important;
        color: white !important;
      }
      
      .mat-accent {
        background-color: var(--color-secondary) !important;
        color: white !important;
      }
    `
  },

  vanilla: {
    ...frameworkOptions.vanilla,
    cdn: {
      css: '',
      js: ''
    },
    components: {
      button: 'btn',
      card: 'card',
      alert: 'alert'
    },
    utilities: {
      spacing: ['p-xs', 'p-sm', 'p-md', 'p-lg', 'p-xl'],
      colors: ['text-primary', 'bg-primary', 'border-primary'],
      typography: ['text-sm', 'text-md', 'text-lg', 'text-xl']
    },
    customCSS: `
      /* Framework-agnostic utilities */
      .btn {
        display: inline-block;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      
      .btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
      }
      
      .alert {
        padding: var(--spacing-md);
        border-radius: 4px;
        background: rgba(var(--color-primary-rgb), 0.1);
        border: 1px solid var(--color-primary);
        color: var(--color-primary);
      }
    `
  }
};

/**
 * Génère le HTML complet avec framework pour le preview
 */
export const generateFrameworkPreviewHTML = (tokens, component, currentProps, componentHTML) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  if (!framework) return componentHTML;

  const designTokensCSS = generateDesignTokensCSS(tokens);
  const frameworkCSS = framework.customCSS || '';
  
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${component?.name || 'Component'} Preview - ${framework.name}</title>
    
    <!-- Framework CSS -->
    ${framework.cdn.css.startsWith('<') ? framework.cdn.css : `<link rel="stylesheet" href="${framework.cdn.css}">`}
    
    <!-- Design Tokens + Framework Integration -->
    <style>
      ${designTokensCSS}
      ${frameworkCSS}
      
      /* Preview container styles */
      body {
        margin: 0;
        padding: 20px;
        font-family: var(--font-family);
        background: #f8f9fa;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .preview-container {
        width: 100%;
        max-width: 100%;
        background: white;
        padding: var(--spacing-lg);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      /* Component styles */
      ${component?.scss || ''}
    </style>
    
    <!-- Framework JS -->
    ${framework.cdn.js.startsWith('<') ? framework.cdn.js : (framework.cdn.js ? `<script src="${framework.cdn.js}"></script>` : '')}
  </head>
  <body>
    <div class="preview-container">
      ${componentHTML}
    </div>
    
    <!-- Framework info overlay -->
    <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace; z-index: 9999;">
      ${framework.name} ${tokens.framework.version} • ${component?.name || 'Component'}
    </div>
  </body>
</html>`;
};

/**
 * Génère les design tokens CSS optimisés
 */
const generateDesignTokensCSS = (tokens) => {
  // CSS Variables de base
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

  // Variables RGB pour les frameworks qui en ont besoin (comme Material)
  const rgbVars = Object.entries(tokens.colors)
    .map(([key, value]) => {
      const rgb = hexToRgb(value);
      return rgb ? `  --color-${key}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};` : '';
    })
    .filter(Boolean)
    .join('\n');

  return `:root {
${colorVars}

${spacingVars}

${typographyVars}

${rgbVars}
}`;
};

/**
 * Convertit hex en RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Génère le CSS d'export séparé par framework
 */
export const generateSeparatedFrameworkCSS = (tokens) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  if (!framework) return { framework: '', custom: '' };

  const designTokens = generateDesignTokensCSS(tokens);
  const frameworkCustom = framework.customCSS || '';

  return {
    // CSS Framework pur (sans nos customizations)
    framework: `/* ${framework.name} ${tokens.framework.version} Framework CSS */
/* Include this from CDN or npm package */
/* CDN: ${framework.cdn.css} */

/* For local installation: */
/* npm install ${getFrameworkPackageName(tokens.framework.type)} */`,

    // Notre CSS custom qui s'intègre avec le framework
    custom: `/* Design System Integration for ${framework.name} */
${designTokens}

${frameworkCustom}

/* Design System Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`
  };
};

/**
 * Obtient le nom du package npm pour un framework
 */
const getFrameworkPackageName = (frameworkType) => {
  const packages = {
    tailwind: 'tailwindcss',
    bootstrap: 'bootstrap',
    angular: '@angular/material',
    vanilla: '' // No package needed
  };
  return packages[frameworkType] || '';
};

/**
 * Génère les classes suggérées selon le framework
 */
export const getFrameworkSuggestions = (tokens, componentType = 'button') => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  if (!framework) return [];

  const baseClasses = framework.components[componentType] || '';
  const utilities = framework.utilities;

  return {
    base: baseClasses,
    variants: {
      primary: `${baseClasses} ${getColorClass(framework, 'primary')}`,
      secondary: `${baseClasses} ${getColorClass(framework, 'secondary')}`,
      success: `${baseClasses} ${getColorClass(framework, 'success')}`,
      danger: `${baseClasses} ${getColorClass(framework, 'danger')}`
    },
    utilities: utilities
  };
};

/**
 * Obtient la classe de couleur selon le framework
 */
const getColorClass = (framework, colorType) => {
  switch (framework.utilityBased) {
    case true: // Tailwind
      return `bg-${colorType} text-white`;
    default: // Bootstrap, Angular, Vanilla
      return framework.cssPrefix ? `${framework.cssPrefix}${colorType}` : `${colorType}`;
  }
};

/**
 * Vérifie si un framework nécessite des imports spéciaux
 */
export const getFrameworkRequirements = (frameworkType) => {
  const requirements = {
    tailwind: {
      buildStep: true,
      configFile: 'tailwind.config.js',
      postcss: true,
      note: 'Requires build process with PostCSS'
    },
    bootstrap: {
      buildStep: false,
      configFile: null,
      postcss: false,
      note: 'Can be used directly from CDN'
    },
    angular: {
      buildStep: true,
      configFile: 'angular.json',
      postcss: false,
      note: 'Requires Angular CLI and Material setup'
    },
    vanilla: {
      buildStep: false,
      configFile: null,
      postcss: false,
      note: 'No build process required'
    }
  };

  return requirements[frameworkType] || requirements.vanilla;
};

/**
 * Génère les instructions d'intégration spécifiques
 */
export const generateFrameworkIntegrationGuide = (tokens) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  const requirements = getFrameworkRequirements(tokens.framework.type);
  
  return {
    framework: framework,
    requirements: requirements,
    cdn: framework.cdn,
    customCSS: framework.customCSS,
    installationSteps: generateInstallationSteps(tokens.framework.type, tokens.framework.version),
    exampleUsage: generateExampleUsage(tokens.framework.type, tokens.colors.primary)
  };
};

/**
 * Génère les étapes d'installation
 */
const generateInstallationSteps = (frameworkType, version) => {
  const steps = {
    tailwind: [
      `npm install -D tailwindcss@${version}`,
      'npx tailwindcss init',
      'Configure content paths in tailwind.config.js',
      'Add @tailwind directives to your CSS',
      'Include design-system.css after Tailwind'
    ],
    bootstrap: [
      `npm install bootstrap@${version}`,
      'Import Bootstrap CSS before your custom CSS',
      'Include design-system.css after Bootstrap',
      'Optionally import Bootstrap JS for components'
    ],
    angular: [
      `ng add @angular/material@${version}`,
      'Choose a theme during setup',
      'Import custom theme in styles.scss',
      'Include design-system.css in angular.json'
    ],
    vanilla: [
      'No installation required',
      'Include design-system.css in your HTML',
      'Start using the utility classes'
    ]
  };

  return steps[frameworkType] || steps.vanilla;
};

/**
 * Génère un exemple d'usage
 */
const generateExampleUsage = (frameworkType, primaryColor) => {
  const examples = {
    tailwind: `<button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
  Tailwind + Design System
</button>`,
    bootstrap: `<button class="btn btn-primary">
  Bootstrap + Design System
</button>`,
    angular: `<button mat-raised-button color="primary">
  Angular Material + Design System
</button>`,
    vanilla: `<button class="btn btn-primary">
  Vanilla + Design System
</button>`
  };

  return examples[frameworkType] || examples.vanilla;
};