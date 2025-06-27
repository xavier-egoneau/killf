// utils/frameworkManager.js - Version complètement propre et fonctionnelle

import { frameworkOptions } from '../data/tokens';
import { 
  requiresRuntimeEnvironment, 
  generateFrameworkIframe,
  updateIframeProps 
} from './angularFrameworkManager';

/**
 * Configuration détaillée des frameworks
 */
export const FRAMEWORK_CONFIGS = {
  tailwind: {
    ...frameworkOptions.tailwind,
    type: 'css-framework',
    requiresRuntime: false,
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
      card: 'bg-white shadow-md rounded-lg p-6'
    }
  },

  bootstrap: {
    ...frameworkOptions.bootstrap,
    type: 'css-framework',
    requiresRuntime: false,
    cdn: {
      css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
      js: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
    },
    components: {
      button: 'btn btn-primary',
      card: 'card'
    },
    customCSS: `:root {
  --bs-primary: var(--color-primary);
  --bs-secondary: var(--color-secondary);
  --bs-success: var(--color-success);
  --bs-danger: var(--color-danger);
}`
  },

  angular: {
    ...frameworkOptions.angular,
    type: 'js-framework',
    requiresRuntime: true,
    cdn: {
      css: [
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
        'https://unpkg.com/@angular/material@17/prebuilt-themes/indigo-pink.css'
      ],
      js: [
        'https://unpkg.com/zone.js@0.14.2/dist/zone.min.js',
        'https://unpkg.com/@angular/core@17/bundles/core.umd.js'
      ]
    },
    components: {
      button: 'mat-raised-button color="primary"',
      card: 'mat-card'
    },
    customCSS: `body {
  font-family: Roboto, "Helvetica Neue", sans-serif;
  margin: 0;
}

:root {
  --mdc-theme-primary: var(--color-primary);
  --mdc-theme-secondary: var(--color-secondary);
  --mdc-theme-error: var(--color-danger);
}`
  },

  vanilla: {
    ...frameworkOptions.vanilla,
    type: 'css-framework',
    requiresRuntime: false,
    cdn: { css: '', js: '' },
    components: {
      button: 'btn',
      card: 'card'
    },
    customCSS: `.btn {
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
}`
  }
};

/**
 * Génère le HTML complet avec framework pour le preview
 */
export const generateFrameworkPreviewHTML = (tokens, component, currentProps, componentHTML) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  if (!framework) return componentHTML;

  // Si le framework nécessite un runtime (Angular, React, Vue)
  if (framework.requiresRuntime) {
    console.log(`🚀 Generating runtime environment for ${framework.name}`);
    return generateFrameworkIframe(tokens.framework.type, componentHTML, tokens, currentProps);
  }

  // Pour les frameworks CSS classiques
  return generateStandardFrameworkHTML(tokens, component, currentProps, componentHTML, framework);
};

/**
 * Génère le HTML pour les frameworks CSS standard
 */
function generateStandardFrameworkHTML(tokens, component, currentProps, componentHTML, framework) {
  const designTokensCSS = generateDesignTokensCSS(tokens);
  const frameworkCSS = framework.customCSS || '';
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${component?.name || 'Component'} Preview - ${framework.name}</title>
    
    <!-- Framework CSS -->
    ${Array.isArray(framework.cdn.css) 
      ? framework.cdn.css.map(url => `<link rel="stylesheet" href="${url}">`).join('\n    ')
      : (framework.cdn.css ? `<link rel="stylesheet" href="${framework.cdn.css}">` : '')
    }
    
    <!-- Design Tokens + Framework Integration -->
    <style>
      ${designTokensCSS}
      ${frameworkCSS}
      
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
      
      ${component?.scss || ''}
    </style>
    
    <!-- Framework JS -->
    ${Array.isArray(framework.cdn.js)
      ? framework.cdn.js.map(url => `<script src="${url}"></script>`).join('\n    ')
      : (framework.cdn.js || '')
    }
  </head>
  <body>
    <div class="preview-container">
      ${componentHTML}
    </div>
    
    <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace; z-index: 9999;">
      ${framework.name} ${tokens.framework.version} • ${component?.name || 'Component'}
    </div>
  </body>
</html>`;
}

/**
 * Met à jour les props dans un iframe runtime
 */
export const updateFrameworkProps = (iframeElement, newProps, frameworkType) => {
  const framework = FRAMEWORK_CONFIGS[frameworkType];
  
  if (framework?.requiresRuntime) {
    updateIframeProps(iframeElement, newProps);
  }
};

/**
 * Obtient les suggestions de classes selon le framework
 */
export const getFrameworkSuggestions = (tokens, componentType = 'button') => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  if (!framework) return null;

  const baseClasses = framework.components[componentType] || '';

  return {
    base: baseClasses,
    variants: {
      primary: baseClasses,
      secondary: baseClasses.replace('primary', 'secondary'),
      success: baseClasses.replace('primary', 'success'),
      danger: baseClasses.replace('primary', 'danger')
    }
  };
};

/**
 * Obtient les suggestions de template selon le framework
 */
export const getFrameworkTemplateSuggestions = (frameworkType, componentType = 'button') => {
  const suggestions = {
    tailwind: {
      button: `<button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90{% if disabled %} opacity-50 cursor-not-allowed{% endif %}">
  {{ text|default('Button') }}
</button>`,
      card: `<div class="bg-white rounded-lg shadow-md p-6">
  {% if title %}<h3 class="text-lg font-semibold mb-4">{{ title }}</h3>{% endif %}
  <div class="text-gray-600">{{ content }}</div>
</div>`
    },
    
    bootstrap: {
      button: `<button class="btn btn-primary{% if size %} btn-{{ size }}{% endif %}"{% if disabled %} disabled{% endif %}>
  {{ text|default('Button') }}
</button>`,
      card: `<div class="card">
  {% if title %}<div class="card-header"><h5 class="card-title">{{ title }}</h5></div>{% endif %}
  <div class="card-body">
    <p class="card-text">{{ content }}</p>
  </div>
</div>`
    },
    
    angular: {
      button: `<button mat-raised-button 
  [color]="variant|default:'primary'"
  [disabled]="disabled"
  (click)="onClick($event)">
  <mat-icon *ngIf="iconLeft">{{ iconLeft }}</mat-icon>
  {{ text|default('Button') }}
  <mat-icon *ngIf="iconRight">{{ iconRight }}</mat-icon>
</button>`,
      card: `<mat-card>
  <mat-card-header *ngIf="title">
    <mat-card-title>{{ title }}</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    {{ content }}
  </mat-card-content>
  <mat-card-actions *ngIf="hasActions">
    <button mat-button color="primary">Action</button>
  </mat-card-actions>
</mat-card>`
    },
    
    vanilla: {
      button: `<button class="btn{% if variant %} btn-{{ variant }}{% endif %}"{% if disabled %} disabled{% endif %}>
  {{ text|default('Button') }}
</button>`,
      card: `<div class="card">
  {% if title %}<h3 class="card-title">{{ title }}</h3>{% endif %}
  <div class="card-content">{{ content }}</div>
</div>`
    }
  };

  return suggestions[frameworkType]?.[componentType] || null;
};

/**
 * Convertit un template générique vers un framework spécifique
 */
export const convertTemplateToFramework = (genericTemplate, fromFramework, toFramework) => {
  if (fromFramework === toFramework) return genericTemplate;
  
  let converted = genericTemplate;
  
  // Conversions basiques
  const conversions = {
    'tailwind-to-angular': {
      'bg-primary': 'color="primary"',
      'text-white': '',
      'px-4 py-2': '',
      'rounded': ''
    },
    'bootstrap-to-angular': {
      'btn btn-primary': 'mat-raised-button color="primary"',
      'card': 'mat-card'
    },
    'angular-to-tailwind': {
      'mat-raised-button': 'bg-primary text-white px-4 py-2 rounded',
      'mat-card': 'bg-white rounded-lg shadow-md p-6'
    }
  };
  
  const conversionKey = `${fromFramework}-to-${toFramework}`;
  const conversionMap = conversions[conversionKey];
  
  if (conversionMap) {
    Object.entries(conversionMap).forEach(([from, to]) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      converted = converted.replace(regex, to);
    });
  }
  
  return converted;
};

/**
 * Détecte si un composant nécessite une mise à jour du framework
 */
export const requiresFrameworkUpdate = (currentFramework, component) => {
  if (!component || !component.template) return null;
  
  const angularSyntax = /(\*ngIf|\*ngFor|\(click\)|\[.*\]|mat-)/;
  const vueSyntax = /(v-if|v-for|@click|:.*=)/;
  const reactSyntax = /(className=|onClick=|\{.*\})/;
  
  if (angularSyntax.test(component.template) && currentFramework !== 'angular') {
    return { 
      recommended: 'angular', 
      reason: 'Template contains Angular-specific syntax' 
    };
  }
  
  if (vueSyntax.test(component.template) && currentFramework !== 'vue') {
    return { 
      recommended: 'vue', 
      reason: 'Template contains Vue-specific syntax' 
    };
  }
  
  if (reactSyntax.test(component.template) && currentFramework !== 'react') {
    return { 
      recommended: 'react', 
      reason: 'Template contains React-specific syntax' 
    };
  }
  
  return null;
};

/**
 * Génère des props par défaut selon le framework
 */
export const generateFrameworkDefaultProps = (frameworkType, componentType) => {
  const frameworkProps = {
    angular: {
      button: {
        variant: { type: 'select', options: ['primary', 'accent', 'warn'], default: 'primary' },
        text: { type: 'string', default: 'Click me' },
        disabled: { type: 'boolean', default: false },
        iconLeft: { type: 'string', default: '' },
        iconRight: { type: 'string', default: '' }
      },
      card: {
        title: { type: 'string', default: 'Card Title' },
        content: { type: 'string', default: 'Card content goes here...' },
        hasActions: { type: 'boolean', default: true }
      }
    },
    
    tailwind: {
      button: {
        variant: { type: 'select', options: ['primary', 'secondary', 'success', 'danger'], default: 'primary' },
        size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
        text: { type: 'string', default: 'Button' },
        disabled: { type: 'boolean', default: false }
      }
    },
    
    bootstrap: {
      button: {
        variant: { type: 'select', options: ['primary', 'secondary', 'success', 'danger'], default: 'primary' },
        size: { type: 'select', options: ['sm', '', 'lg'], default: '' },
        text: { type: 'string', default: 'Button' },
        disabled: { type: 'boolean', default: false }
      }
    }
  };
  
  return frameworkProps[frameworkType]?.[componentType] || {};
};

/**
 * Obtient les instructions d'installation pour un framework
 */
export const getFrameworkInstallationGuide = (frameworkType) => {
  const guides = {
    angular: {
      title: 'Angular Material Setup',
      steps: [
        'npm install @angular/core @angular/material @angular/cdk',
        'ng add @angular/material',
        'Import required modules in your app.module.ts',
        'Include a prebuilt theme in styles.css'
      ],
      documentation: 'https://material.angular.io/guide/getting-started'
    },
    
    tailwind: {
      title: 'Tailwind CSS Setup',
      steps: [
        'npm install -D tailwindcss',
        'npx tailwindcss init',
        'Configure content paths in tailwind.config.js',
        'Add Tailwind directives to your CSS'
      ],
      documentation: 'https://tailwindcss.com/docs/installation'
    },
    
    bootstrap: {
      title: 'Bootstrap Setup',
      steps: [
        'npm install bootstrap',
        'Import Bootstrap CSS and JS',
        'Use Bootstrap components',
        'Customize with CSS variables'
      ],
      documentation: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/'
    },
    
    vanilla: {
      title: 'Vanilla CSS Setup',
      steps: [
        'No installation required',
        'Include design-system.css in your HTML',
        'Start using the utility classes'
      ],
      documentation: null
    }
  };
  
  return guides[frameworkType] || guides.vanilla;
};

/**
 * Génère les design tokens CSS optimisés
 */
function generateDesignTokensCSS(tokens) {
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
}

/**
 * Export des fonctions utilitaires depuis angularFrameworkManager
 */
export {
  requiresRuntimeEnvironment,
  generateFrameworkIframe,
  updateIframeProps
};