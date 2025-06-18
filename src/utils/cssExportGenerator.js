/**
 * Générateur CSS complet pour export
 * Sépare framework CSS, design tokens, et composants
 */

import { generateCSSVariables, generateFrameworkCSS, generateUtilityClasses } from './cssGenerator';

/**
 * Génère un export CSS complet avec séparation claire
 */
export const generateCompleteExport = (tokens, components) => {
  const exports = {
    // 1. Framework CSS (séparé)
    framework: generateFrameworkCSS(tokens),
    
    // 2. Design Tokens + Utilitaires (custom)
    designSystem: generateDesignSystemCSS(tokens),
    
    // 3. Composants (custom)
    components: generateComponentsCSS(components),
    
    // 4. CSS combiné (tout ensemble)
    combined: generateCombinedCSS(tokens, components)
  };

  return exports;
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
   ========================================= */

${variables}

${utilities}

/* Design System Utilities */
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

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
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
          componentStyles.push(`/* ${component.name} */`);
          componentStyles.push(component.scss);
          componentStyles.push(''); // Ligne vide
        }
      });
    }
  });

  return `/* =========================================
   COMPONENTS CSS
   Generated: ${new Date().toISOString()}
   ========================================= */

${componentStyles.join('\n')}`;
};

/**
 * Génère le CSS combiné (tout ensemble)
 */
const generateCombinedCSS = (tokens, components) => {
  const framework = generateFrameworkCSS(tokens);
  const designSystem = generateDesignSystemCSS(tokens);
  const componentsCSS = generateComponentsCSS(components);

  return `/* =========================================
   COMPLETE DESIGN SYSTEM
   Generated: ${new Date().toISOString()}
   Framework: ${tokens.framework.type} ${tokens.framework.version}
   ========================================= */

/* Framework CSS */
${framework}

/* Design System */
${designSystem}

/* Components */
${componentsCSS}`;
};

/**
 * Génère les instructions d'installation pour le framework
 */
export const generateFrameworkInstructions = (tokens) => {
  const { framework } = tokens;
  
  const instructions = {
    tailwind: `# Tailwind CSS ${framework.version} Installation

## Option 1: CDN (pour prototypage rapide)
\`\`\`html
<script src="https://cdn.tailwindcss.com"></script>
\`\`\`

## Option 2: Installation complète
\`\`\`bash
npm install -D tailwindcss@${framework.version}
npx tailwindcss init
\`\`\`

### tailwind.config.js
\`\`\`javascript
module.exports = {
  content: ["./src/**/*.{html,js}"],
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
\`\`\``,

    bootstrap: `# Bootstrap ${framework.version} Installation

## Option 1: CDN
\`\`\`html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@${framework.version}/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@${framework.version}/dist/js/bootstrap.bundle.min.js"></script>
\`\`\`

## Option 2: NPM
\`\`\`bash
npm install bootstrap@${framework.version}
\`\`\`

### SCSS Variables Override
\`\`\`scss
$primary: ${tokens.colors.primary};
$secondary: ${tokens.colors.secondary};
$success: ${tokens.colors.success};
$danger: ${tokens.colors.danger};

@import "bootstrap/scss/bootstrap";
\`\`\``,

    angular: `# Angular Material ${framework.version} Installation

\`\`\`bash
ng add @angular/material@${framework.version}
\`\`\`

### Custom Theme (styles.scss)
\`\`\`scss
@use '@angular/material' as mat;

$primary: mat.define-palette((
  500: ${tokens.colors.primary},
));

$accent: mat.define-palette((
  500: ${tokens.colors.secondary},
));

$theme: mat.define-light-theme((
  color: (
    primary: $primary,
    accent: $accent,
  )
));

@include mat.all-component-themes($theme);
\`\`\``,

    vanilla: `# Vanilla CSS - No Installation Required

Simply include the design-system.css file in your HTML:

\`\`\`html
<link rel="stylesheet" href="design-system.css">
\`\`\`

The CSS uses modern features:
- CSS Custom Properties (IE11+ support)
- Flexbox and Grid
- CSS Color Module Level 4 (color-mix)`
  };

  return instructions[framework.type] || instructions.vanilla;
};

/**
 * Crée un package complet d'export
 */
export const createExportPackage = (tokens, components) => {
  const cssExports = generateCompleteExport(tokens, components);
  const instructions = generateFrameworkInstructions(tokens);
  
  return {
    // Fichiers CSS
    files: {
      'design-system.css': cssExports.designSystem,
      'components.css': cssExports.components,
      'complete.css': cssExports.combined,
      [`${tokens.framework.type}-framework.css`]: cssExports.framework
    },
    
    // Documentation
    readme: generateReadme(tokens, instructions),
    
    // Package info
    packageInfo: {
      name: `${tokens.branding.brandName || 'Design'} System`,
      framework: `${tokens.framework.type} ${tokens.framework.version}`,
      generatedAt: new Date().toISOString(),
      componentsCount: Object.values(components).reduce((acc, cat) => acc + Object.keys(cat).length, 0),
      tokensCount: {
        colors: Object.keys(tokens.colors).length,
        spacing: Object.keys(tokens.spacing).length,
        typography: Object.keys(tokens.typography.sizes).length
      }
    }
  };
};

/**
 * Génère un README pour l'export
 */
const generateReadme = (tokens, instructions) => {
  return `# ${tokens.branding.brandName || 'Design'} System

Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

## 📁 Files Included

- **design-system.css** - Design tokens + utilities (include this)
- **components.css** - All component styles
- **complete.css** - Everything combined
- **${tokens.framework.type}-framework.css** - Framework-specific CSS

## 🚀 Quick Start

### 1. Include Framework CSS (choose one option)

${instructions}

### 2. Include Design System CSS

\`\`\`html
<link rel="stylesheet" href="design-system.css">
<link rel="stylesheet" href="components.css">
\`\`\`

### 3. Use Components

\`\`\`html
<button class="btn btn-primary btn-md">Primary Button</button>
<div class="p-md m-lg bg-primary text-white">Styled with tokens</div>
\`\`\`

## 🎨 Design Tokens

### Colors
${Object.entries(tokens.colors).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Spacing
${Object.entries(tokens.spacing).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Typography
- **Primary Font**: ${tokens.typography.fontFamily}
- **Secondary Font**: ${tokens.typography.secondaryFont}

## 🔧 Customization

Edit the CSS custom properties at the top of design-system.css:

\`\`\`css
:root {
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  /* ... */
}
\`\`\`

## 📄 License

Generated by Design System Builder
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
 * Télécharge un ZIP de tous les fichiers (simulation)
 */
export const downloadExportPackage = (tokens, components) => {
  const exportPackage = createExportPackage(tokens, components);
  
  // Pour l'instant, on télécharge les fichiers un par un
  // TODO: Implémenter un vrai ZIP avec JSZip
  
  Object.entries(exportPackage.files).forEach(([filename, content]) => {
    setTimeout(() => {
      downloadFile(content, filename);
    }, 100); // Petit délai entre les téléchargements
  });
  
  // Télécharger aussi le README
  setTimeout(() => {
    downloadFile(exportPackage.readme, 'README.md', 'text/markdown');
  }, 500);
  
  return exportPackage.packageInfo;
};