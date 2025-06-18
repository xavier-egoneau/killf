/**
 * Générateur CSS complet pour export avec séparation framework
 * Version améliorée avec intégration du Framework Manager
 */

import { generateCSSVariables, generateUtilityClasses } from './cssGenerator';
import { generateSeparatedFrameworkCSS, FRAMEWORK_CONFIGS, generateFrameworkIntegrationGuide } from './frameworkManager';

/**
 * Génère un export CSS complet avec séparation claire framework/custom
 */
export const generateCompleteExport = (tokens, components) => {
  const separatedCSS = generateSeparatedFrameworkCSS(tokens);
  const currentFramework = FRAMEWORK_CONFIGS[tokens.framework.type];
  
  const exports = {
    // 1. Framework CSS (instructions seulement, pas le CSS complet)
    framework: generateFrameworkInstructionsCSS(tokens),
    
    // 2. Design Tokens + Utilitaires (notre CSS custom)
    designSystem: generateDesignSystemCSS(tokens),
    
    // 3. Composants CSS (styles des composants)
    components: generateComponentsCSS(components),
    
    // 4. CSS d'intégration framework (notre custom qui s'intègre au framework)
    integration: separatedCSS.custom,
    
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
  const guide = generateFrameworkIntegrationGuide(tokens);
  
  return `/* =========================================
   ${framework.name.toUpperCase()} FRAMEWORK
   Generated: ${new Date().toISOString()}
   Version: ${tokens.framework.version}
   ========================================= */

/*
  INSTALLATION INSTRUCTIONS:
  
  ${guide.installationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n  ')}
  
  CDN OPTION:
  ${framework.cdn.css ? `<link rel="stylesheet" href="${framework.cdn.css}">` : 'No CDN available'}
  ${framework.cdn.js ? `<script src="${framework.cdn.js}"></script>` : ''}
  
  NPM OPTION:
  npm install ${getFrameworkPackageName(tokens.framework.type)}
  
  USAGE EXAMPLE:
  ${guide.exampleUsage}
*/

/* Framework-specific integration CSS */
${framework.customCSS || '/* No custom CSS needed for this framework */'}`;
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
 * Génère le CSS combiné custom (sans framework)
 */
const generateCombinedCustomCSS = (tokens, components) => {
  const designSystem = generateDesignSystemCSS(tokens);
  const componentsCSS = generateComponentsCSS(components);
  const integration = generateSeparatedFrameworkCSS(tokens).custom;

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
 * Crée un package complet d'export avec séparation framework
 */
export const createExportPackage = (tokens, components) => {
  const cssExports = generateCompleteExport(tokens, components);
  const frameworkGuide = generateFrameworkIntegrationGuide(tokens);
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
    
    // Documentation enrichie
    readme: generateEnhancedReadme(tokens, frameworkGuide, currentFramework),
    
    // Guide d'intégration spécifique
    integrationGuide: generateIntegrationGuide(tokens, frameworkGuide),
    
    // Package info enrichi
    packageInfo: {
      name: `${tokens.branding.brandName || 'Design'} System`,
      framework: {
        name: currentFramework?.name,
        type: tokens.framework.type,
        version: tokens.framework.version,
        utilityBased: currentFramework?.utilityBased,
        requiresBuild: frameworkGuide.requirements.buildStep
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
 * Génère un README enrichi avec guide framework
 */
const generateEnhancedReadme = (tokens, frameworkGuide, currentFramework) => {
  return `# ${tokens.branding.brandName || 'Design'} System

Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

## 🚀 Framework Integration: ${currentFramework.name}

This design system is optimized for **${currentFramework.name} ${tokens.framework.version}**.

### 📁 Files Included

#### Core Files (Use These)
- **design-system.css** - Design tokens + base utilities
- **components.css** - All component styles
- **${tokens.framework.type}-integration.css** - Framework-specific integration

#### Reference Files
- **${tokens.framework.type}-setup.css** - Framework installation guide
- **custom-complete.css** - All custom CSS combined
- **complete-with-framework.css** - Everything with framework instructions

## ⚡ Quick Start

### 1. Install Framework

${frameworkGuide.installationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

### 2. Include CSS Files

\`\`\`html
<!-- Framework CSS -->
${currentFramework.cdn.css ? `<link rel="stylesheet" href="${currentFramework.cdn.css}">` : '<!-- Install framework locally -->'}

<!-- Design System CSS -->
<link rel="stylesheet" href="design-system.css">
<link rel="stylesheet" href="${tokens.framework.type}-integration.css">
<link rel="stylesheet" href="components.css">
\`\`\`

### 3. Use Components

${frameworkGuide.exampleUsage}

## 🎨 Design Tokens

### Colors
${Object.entries(tokens.colors).map(([key, value]) => `- **--color-${key}**: ${value}`).join('\n')}

### Spacing
${Object.entries(tokens.spacing).map(([key, value]) => `- **--spacing-${key}**: ${value}`).join('\n')}

### Typography
- **Primary Font**: ${tokens.typography.fontFamily}
- **Secondary Font**: ${tokens.typography.secondaryFont}

## 🔧 Framework Details

- **Type**: ${currentFramework.utilityBased ? 'Utility-based' : 'Component-based'}
- **Build Required**: ${frameworkGuide.requirements.buildStep ? 'Yes' : 'No'}
- **CSS Prefix**: ${currentFramework.cssPrefix || 'None'}

## 📱 Responsive Design

The design system includes responsive utilities and follows mobile-first principles.

## ♿ Accessibility

- Focus indicators using \`--color-primary\`
- Visually hidden utility class
- Semantic color naming

## 🔄 Updating

To update design tokens, edit the CSS custom properties at the top of \`design-system.css\`.

## 📄 License

Generated by Design System Builder - AI Friendly Design System Creator
`;
};

/**
 * Génère un guide d'intégration détaillé
 */
const generateIntegrationGuide = (tokens, frameworkGuide) => {
  return `# ${FRAMEWORK_CONFIGS[tokens.framework.type].name} Integration Guide

## Overview

This guide explains how to integrate the design system with ${frameworkGuide.framework.name}.

## Prerequisites

${frameworkGuide.requirements.buildStep ? '- Build process (webpack, Vite, etc.)' : '- No build process required'}
${frameworkGuide.requirements.postcss ? '- PostCSS setup' : ''}
${frameworkGuide.requirements.configFile ? `- ${frameworkGuide.requirements.configFile} configuration` : ''}

## Installation Steps

${frameworkGuide.installationSteps.map((step, i) => `### ${i + 1}. ${step}\n`).join('\n')}

## File Loading Order

1. **Framework CSS** (from CDN or local)
2. **design-system.css** (design tokens + utilities)
3. **${tokens.framework.type}-integration.css** (framework-specific styles)
4. **components.css** (component styles)

## Example Integration

### HTML
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <!-- Framework -->
  ${frameworkGuide.framework.cdn.css ? `<link rel="stylesheet" href="${frameworkGuide.framework.cdn.css}">` : '<!-- Framework CSS -->'}
  
  <!-- Design System -->
  <link rel="stylesheet" href="design-system.css">
  <link rel="stylesheet" href="${tokens.framework.type}-integration.css">
  <link rel="stylesheet" href="components.css">
</head>
<body>
  ${frameworkGuide.exampleUsage}
</body>
</html>
\`\`\`

## Notes

${frameworkGuide.requirements.note}

## Troubleshooting

- Ensure CSS files are loaded in the correct order
- Check that framework CSS is loaded before design system CSS
- Verify CSS custom properties are supported (IE11+)
`;
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
 * Télécharge un package complet avec séparation framework
 */
export const downloadExportPackage = (tokens, components) => {
  const exportPackage = createExportPackage(tokens, components);
  
  // Télécharger les fichiers CSS
  Object.entries(exportPackage.files).forEach(([filename, content], index) => {
    setTimeout(() => {
      downloadFile(content, filename, 'text/css');
    }, index * 150); // Délai entre les téléchargements
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