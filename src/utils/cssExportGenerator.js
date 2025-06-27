/**
 * Générateur CSS complet pour export - Version corrigée
 */

import { generateCSSVariables, generateUtilityClasses } from './cssGenerator';
import { FRAMEWORK_CONFIGS } from './frameworkManager';

/**
 * Génère un export CSS complet avec séparation claire framework/custom
 */
export const generateCompleteExport = (tokens, components) => {
  const currentFramework = FRAMEWORK_CONFIGS[tokens.framework.type];
  
  const exports = {
    // 1. Framework CSS (instructions seulement, pas le CSS complet)
    framework: generateFrameworkInstructionsCSS(tokens),
    
    // 2. Design Tokens + Utilitaires (notre CSS custom)
    designSystem: generateDesignSystemCSS(tokens),
    
    // 3. Composants CSS (styles des composants)
    components: generateComponentsCSS(components),
    
    // 4. CSS d'intégration framework (notre custom qui s'intègre au framework)
    integration: generateFrameworkIntegrationCSS(tokens),
    
    // 5. CSS combiné (design system + components + integration)
    combined: generateCombinedCustomCSS(tokens, components),
    
    // 6. CSS complet avec framework (tout ensemble, mais séparé en sections)
    complete: generateCompleteWithFrameworkCSS(tokens, components)
  };

  return exports;
};

/**
 * Génère les instructions pour le framework (au lieu du CSS complet)
 */
const generateFrameworkInstructionsCSS = (tokens) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  
  const getCDNInstructions = (framework) => {
    switch (framework.type) {
      case 'angular':
        return `
  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <!-- Roboto Font -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <!-- Angular Material CSS (install via npm) -->`;
      case 'bootstrap':
        return `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@${tokens.framework.version}/dist/css/bootstrap.min.css" rel="stylesheet">`;
      case 'tailwind':
        return `
  <script src="https://cdn.tailwindcss.com"></script>`;
      default:
        return '<!-- No external CSS required -->';
    }
  };
  
  return `/* =========================================
   ${framework.name.toUpperCase()} FRAMEWORK INTEGRATION
   Generated: ${new Date().toISOString()}
   Version: ${tokens.framework.version}
   ========================================= */

/*
  OPTION 1: CDN INTEGRATION (Recommended)
  ========================================
  Add this to your HTML head:${getCDNInstructions(framework)}
  
  Then include this integration file.
  
  OPTION 2: FULL CSS DOWNLOAD
  ============================
  For Bootstrap: Full CSS is available via "Download Complete Framework CSS" option
  For Tailwind: Requires build process - use CDN or npm
  For Angular Material: Requires Angular CLI setup
  
  INSTALLATION STEPS:
  ${generateInstallationSteps(tokens.framework.type, tokens.framework.version).map((step, i) => `${i + 1}. ${step}`).join('\n  ')}
  
  NPM OPTION:
  npm install ${getFrameworkPackageName(tokens.framework.type)}
  
  USAGE EXAMPLE:
  ${generateExampleUsage(tokens.framework.type, tokens.colors.primary)}
*/

/* Framework-specific integration CSS */
${framework.customCSS || '/* No custom CSS needed for this framework */'}

/* Additional framework integration utilities */
${generateFrameworkUtilities(tokens.framework.type)}`;
};

/**
 * Génère le CSS du design system (tokens + utilitaires)
 */
const generateDesignSystemCSS = (tokens) => {
  const variables = generateCSSVariables(tokens);
  const utilities = generateUtilityClasses(tokens);
  
  return `/* =========================================
   DESIGN SYSTEM CSS
   Generated: ${new Date().toISOString()}
   Framework: ${tokens.framework.type} ${tokens.framework.version}
   
   USAGE: Include this AFTER your framework CSS
   ========================================= */

${variables}

${utilities}

/* Design System Base Styles */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
}

/* Focus utilities */
.focus-visible:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}`;
};

/**
 * Génère le CSS de tous les composants
 */
const generateComponentsCSS = (components) => {
  const componentStyles = [];
  
  Object.entries(components).forEach(([category, categoryComponents]) => {
    if (Object.keys(categoryComponents).length > 0) {
      componentStyles.push(`/* ========== ${category.toUpperCase()} ========== */`);
      
      Object.entries(categoryComponents).forEach(([key, component]) => {
        if (component.scss && component.scss.trim()) {
          componentStyles.push(`/* ${component.name} (${key}) */`);
          componentStyles.push(component.scss);
          componentStyles.push(''); // Ligne vide
        }
      });
      componentStyles.push(''); // Ligne vide entre catégories
    }
  });

  return `/* =========================================
   COMPONENTS CSS
   Generated: ${new Date().toISOString()}
   
   USAGE: Include this AFTER design-system.css
   ========================================= */

${componentStyles.join('\n')}`;
};

/**
 * Génère le CSS d'intégration framework
 */
const generateFrameworkIntegrationCSS = (tokens) => {
  const framework = FRAMEWORK_CONFIGS[tokens.framework.type];
  
  return `/* =========================================
   FRAMEWORK INTEGRATION CSS
   Generated: ${new Date().toISOString()}
   Framework: ${framework.name}
   ========================================= */

${framework.customCSS || '/* No framework integration CSS needed */'}

/* Design tokens integration */
${generateDesignTokensCSS(tokens)}

/* Framework-specific utilities */
${generateFrameworkUtilities(tokens.framework.type)}`;
};

/**
 * Génère le CSS combiné custom (sans framework)
 */
const generateCombinedCustomCSS = (tokens, components) => {
  const designSystem = generateDesignSystemCSS(tokens);
  const componentsCSS = generateComponentsCSS(components);
  const integration = generateFrameworkIntegrationCSS(tokens);

  return `/* =========================================
   COMPLETE CUSTOM CSS
   Generated: ${new Date().toISOString()}
   Framework: ${tokens.framework.type} ${tokens.framework.version}
   
   USAGE: Include this AFTER ${FRAMEWORK_CONFIGS[tokens.framework.type]?.name} framework
   ========================================= */

/* Design System Foundation */
${designSystem}

/* Framework Integration */
${integration}

/* Components */
${componentsCSS}`;
};

/**
 * Génère le CSS complet avec sections framework
 */
const generateCompleteWithFrameworkCSS = (tokens, components) => {
  const framework = generateFrameworkInstructionsCSS(tokens);
  const custom = generateCombinedCustomCSS(tokens, components);

  return `/* =========================================
   COMPLETE DESIGN SYSTEM WITH FRAMEWORK
   Generated: ${new Date().toISOString()}
   Framework: ${tokens.framework.type} ${tokens.framework.version}
   ========================================= */

${framework}

/* ========================================= */

${custom}`;
};

/**
 * Crée un package complet d'export
 */
export const createExportPackage = (tokens, components) => {
  const cssExports = generateCompleteExport(tokens, components);
  const currentFramework = FRAMEWORK_CONFIGS[tokens.framework.type];
  
  return {
    // Fichiers CSS séparés
    files: {
      // Fichiers principaux
      'design-system.css': cssExports.designSystem,
      'components.css': cssExports.components,
      
      // Fichiers d'intégration framework
      [`${tokens.framework.type}-integration.css`]: cssExports.integration,
      [`${tokens.framework.type}-setup.css`]: cssExports.framework,
      
      // Fichiers combinés
      'custom-complete.css': cssExports.combined,
      'complete-with-framework.css': cssExports.complete
    },
    
    // Documentation
    readme: generateEnhancedReadme(tokens, currentFramework),
    
    // Guide d'intégration
    integrationGuide: generateIntegrationGuide(tokens),
    
    // Package info
    packageInfo: {
      name: `${tokens.branding.brandName || 'Design'} System`,
      framework: {
        name: currentFramework?.name,
        type: tokens.framework.type,
        version: tokens.framework.version,
        utilityBased: currentFramework?.utilityBased,
        requiresRuntime: currentFramework?.requiresRuntime
      },
      generatedAt: new Date().toISOString(),
      stats: {
        componentsCount: Object.values(components).reduce((acc, cat) => acc + Object.keys(cat).length, 0),
        categoriesCount: Object.keys(components).filter(cat => Object.keys(components[cat]).length > 0).length,
        tokensCount: {
          colors: Object.keys(tokens.colors).length,
          spacing: Object.keys(tokens.spacing).length,
          typography: Object.keys(tokens.typography.sizes).length
        }
      }
    }
  };
};

/**
 * Génère des utilitaires CSS spécifiques au framework
 */
const generateFrameworkUtilities = (frameworkType) => {
  const utilities = {
    bootstrap: `
/* Bootstrap integration utilities */
.btn-brand { 
  --bs-btn-bg: var(--color-primary); 
  --bs-btn-border-color: var(--color-primary);
  --bs-btn-hover-bg: color-mix(in srgb, var(--color-primary) 85%, black);
  --bs-btn-hover-border-color: color-mix(in srgb, var(--color-primary) 85%, black);
}
.text-brand { color: var(--color-primary) !important; }
.bg-brand { background-color: var(--color-primary) !important; }`,

    tailwind: `
/* Tailwind integration utilities */
@layer utilities {
  .text-brand { color: var(--color-primary); }
  .bg-brand { background-color: var(--color-primary); }
  .border-brand { border-color: var(--color-primary); }
}`,

    angular: `
/* Angular Material theme variables */
:root {
  --mdc-theme-primary: var(--color-primary);
  --mdc-theme-secondary: var(--color-secondary);
  --mdc-theme-error: var(--color-danger);
}

.mat-mdc-button.mat-primary {
  --mdc-filled-button-container-color: var(--color-primary);
}`,

    vanilla: `
/* Vanilla CSS utilities */
.btn-brand { 
  background: var(--color-primary); 
  color: white; 
  border: 1px solid var(--color-primary);
}
.btn-brand:hover { 
  background: color-mix(in srgb, var(--color-primary) 85%, black); 
}
.text-brand { color: var(--color-primary); }
.bg-brand { background-color: var(--color-primary); color: white; }`
  };

  return utilities[frameworkType] || utilities.vanilla;
};

/**
 * Génère les design tokens CSS
 */
const generateDesignTokensCSS = (tokens) => {
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

/**
 * Obtient le nom du package npm
 */
const getFrameworkPackageName = (frameworkType) => {
  const packages = {
    tailwind: 'tailwindcss',
    bootstrap: 'bootstrap',
    angular: '@angular/material',
    vanilla: ''
  };
  return packages[frameworkType] || '';
};

/**
 * Génère le README
 */
const generateEnhancedReadme = (tokens, currentFramework) => {
  return `# ${tokens.branding.brandName || 'Design'} System

Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

## 🚀 Framework Integration: ${currentFramework?.name || 'Unknown'}

This design system is optimized for **${currentFramework?.name || 'Unknown'} ${tokens.framework.version}**.

## Quick Start

1. Include the framework CSS/JS
2. Add design-system.css
3. Start using components

## Files Included

- \`design-system.css\` - Core design tokens and utilities
- \`components.css\` - All component styles
- \`${tokens.framework.type}-integration.css\` - Framework-specific integration
- \`complete-design-system.css\` - Everything combined

## Support

For questions and documentation, visit your design system documentation.
`;
};

/**
 * Génère le guide d'intégration
 */
const generateIntegrationGuide = (tokens) => {
  return `# Integration Guide for ${tokens.framework.type}

## Installation

Follow the installation steps included in the CSS comments.

## Usage

Include the CSS files in this order:
1. Framework CSS (${tokens.framework.type})
2. design-system.css
3. components.css

## Customization

Modify the CSS custom properties in \`:root\` to customize colors, spacing, and typography.
`;
};

/**
 * Télécharge un fichier
 */
export const downloadFile = (content, filename, type = 'text/css') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Télécharge un package complet
 */
export const downloadExportPackage = (tokens, components) => {
  const exportPackage = createExportPackage(tokens, components);
  
  // Télécharger les fichiers CSS
  Object.entries(exportPackage.files).forEach(([filename, content], index) => {
    setTimeout(() => {
      downloadFile(content, filename, 'text/css');
    }, index * 150);
  });
  
  // Télécharger la documentation
  setTimeout(() => {
    downloadFile(exportPackage.readme, 'README.md', 'text/markdown');
  }, Object.keys(exportPackage.files).length * 150 + 200);
  
  // Télécharger le guide d'intégration
  setTimeout(() => {
    downloadFile(exportPackage.integrationGuide, `${tokens.framework.type}-integration-guide.md`, 'text/markdown');
  }, Object.keys(exportPackage.files).length * 150 + 400);
  
  return exportPackage.packageInfo;
};