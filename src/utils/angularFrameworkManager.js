// utils/angularFrameworkManager.js - Version simple et fonctionnelle

/**
 * Environnements d'exécution pour les frameworks JavaScript
 */
export const FRAMEWORK_ENVIRONMENTS = {
  angular: {
    type: 'runtime',
    dependencies: [
      'https://unpkg.com/zone.js@0.14.2/dist/zone.min.js',
      'https://unpkg.com/@angular/core@17/bundles/core.umd.js',
      'https://unpkg.com/@angular/common@17/bundles/common.umd.js',
      'https://unpkg.com/@angular/platform-browser@17/bundles/platform-browser.umd.js',
      'https://unpkg.com/@angular/platform-browser-dynamic@17/bundles/platform-browser-dynamic.umd.js'
    ],
    css: [
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
      'https://unpkg.com/@angular/material@17/prebuilt-themes/indigo-pink.css'
    ]
  }
};

/**
 * Génère un iframe Angular simple avec fallback HTML
 */
export function generateAngularIframe(componentHTML, tokens, componentProps) {
  const designTokensCSS = generateDesignTokensCSS(tokens);
  
  // Pour l'instant, on utilise un fallback HTML simple au lieu du runtime Angular complexe
  return generateAngularFallback(componentHTML, tokens, componentProps, designTokensCSS);
}

/**
 * Génère un fallback HTML avec style Angular Material
 */
function generateAngularFallback(componentHTML, tokens, componentProps, designTokensCSS) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Angular Component Preview</title>
  
  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <!-- Roboto Font -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <!-- Angular Material Theme -->
  <link href="https://unpkg.com/@angular/material@17/prebuilt-themes/indigo-pink.css" rel="stylesheet">
  
  <style>
    ${designTokensCSS}
    
    body {
      margin: 0;
      padding: 20px;
      font-family: Roboto, "Helvetica Neue", sans-serif;
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .preview-container {
      background: white;
      padding: var(--spacing-lg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 300px;
    }
    
    /* Styles Material Design simulés */
    .mat-raised-button, [mat-raised-button] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: ${tokens.colors.primary};
      color: white;
      font-family: Roboto, sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      font-size: 14px;
      min-height: 36px;
    }
    
    .mat-raised-button:hover, [mat-raised-button]:hover {
      background: color-mix(in srgb, ${tokens.colors.primary} 85%, black);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .mat-card, [mat-card] {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12);
      padding: 16px;
      margin: 8px 0;
    }
    
    .mat-card-header, [mat-card-header] {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .mat-card-title, [mat-card-title] {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
      color: rgba(0,0,0,0.87);
    }
    
    .mat-card-content, [mat-card-content] {
      color: rgba(0,0,0,0.7);
      line-height: 1.5;
    }
    
    .mat-card-actions, [mat-card-actions] {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      padding-top: 8px;
    }
    
    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    
    /* Simulation des couleurs Material */
    [color="primary"] {
      background: ${tokens.colors.primary} !important;
    }
    
    [color="accent"] {
      background: ${tokens.colors.secondary} !important;
    }
    
    [color="warn"] {
      background: ${tokens.colors.danger} !important;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    ${componentHTML}
  </div>
  
  <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace; z-index: 9999;">
    Angular Material (Simulated) • Preview
  </div>
  
  <script>
    // Simple simulation des événements Angular
    document.addEventListener('DOMContentLoaded', function() {
      // Simuler les clics de boutons
      document.querySelectorAll('[mat-raised-button], .mat-raised-button').forEach(function(button) {
        button.addEventListener('click', function(e) {
          console.log('Angular button clicked:', e.target);
          
          // Animation de clic
          button.style.transform = 'translateY(1px)';
          setTimeout(function() {
            button.style.transform = '';
          }, 100);
        });
      });
      
      // Écouter les messages du parent pour les updates de props
      window.addEventListener('message', function(event) {
        if (event.data.type === 'UPDATE_PROPS') {
          console.log('Props updated:', event.data.props);
          // Ici on pourrait mettre à jour le contenu dynamiquement
        }
      });
      
      console.log('✅ Angular Material simulation loaded');
    });
  </script>
</body>
</html>`;
}

/**
 * Génère un iframe Vue.js simple
 */
export function generateVueIframe(componentHTML, tokens, componentProps) {
  const designTokensCSS = generateDesignTokensCSS(tokens);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vue Component Preview</title>
  <style>
    ${designTokensCSS}
    
    body {
      margin: 0;
      padding: 20px;
      font-family: var(--font-family);
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    
    .preview-container {
      background: white;
      padding: var(--spacing-lg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    ${componentHTML}
  </div>
  
  <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace;">
    Vue.js Preview
  </div>
</body>
</html>`;
}

/**
 * Génère un iframe React simple
 */
export function generateReactIframe(componentHTML, tokens, componentProps) {
  const designTokensCSS = generateDesignTokensCSS(tokens);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>React Component Preview</title>
  <style>
    ${designTokensCSS}
    
    body {
      margin: 0;
      padding: 20px;
      font-family: var(--font-family);
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    
    .preview-container {
      background: white;
      padding: var(--spacing-lg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    ${componentHTML}
  </div>
  
  <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-family: monospace;">
    React Preview
  </div>
</body>
</html>`;
}

/**
 * Générateur de CSS pour design tokens
 */
function generateDesignTokensCSS(tokens) {
  const colorVars = Object.entries(tokens.colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');

  const spacingVars = Object.entries(tokens.spacing)
    .map(([key, value]) => `  --spacing-${key}: ${value};`)
    .join('\n');

  const typographyVars = `  --font-family: ${tokens.typography.fontFamily};
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
 * Détecte si un framework nécessite un environnement d'exécution
 */
export function requiresRuntimeEnvironment(frameworkType) {
  return FRAMEWORK_ENVIRONMENTS[frameworkType]?.type === 'runtime';
}

/**
 * Génère l'iframe approprié selon le framework
 */
export function generateFrameworkIframe(frameworkType, componentHTML, tokens, componentProps) {
  switch (frameworkType) {
    case 'angular':
      return generateAngularIframe(componentHTML, tokens, componentProps);
    case 'vue':
      return generateVueIframe(componentHTML, tokens, componentProps);
    case 'react':
      return generateReactIframe(componentHTML, tokens, componentProps);
    default:
      console.warn(`Framework environment not found for: ${frameworkType}`);
      return null;
  }
}

/**
 * Met à jour les props d'un composant dans l'iframe
 */
export function updateIframeProps(iframeElement, newProps) {
  if (!iframeElement || !iframeElement.contentWindow) return;
  
  try {
    iframeElement.contentWindow.postMessage({
      type: 'UPDATE_PROPS',
      props: newProps
    }, '*');
  } catch (error) {
    console.warn('Failed to update iframe props:', error);
  }
}