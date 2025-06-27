// utils/index.js - Export all utilities (version propre)

// Export AI and template utilities
export * from './aiPromptGenerator';
export * from './templateEngine';
export * from './aiSystemPrompt';

// Export CSS utilities
export * from './cssGenerator';
export * from './cssExportGenerator';

// Export SVG utilities
export * from './svgUploadUtils';

// Export framework utilities - imports explicites pour éviter les conflits
export { 
  FRAMEWORK_CONFIGS,
  generateFrameworkPreviewHTML,
  updateFrameworkProps,
  getFrameworkSuggestions,
  getFrameworkTemplateSuggestions,
  convertTemplateToFramework,
  requiresFrameworkUpdate,
  generateFrameworkDefaultProps,
  getFrameworkInstallationGuide,
  requiresRuntimeEnvironment,
  generateFrameworkIframe,
  updateIframeProps
} from './frameworkManager';

// Export des fonctions Angular spécifiques
export { 
  generateAngularIframe,
  generateVueIframe,
  generateReactIframe
} from './angularFrameworkManager';

// Export des fonctions principales
export { generateCSSVariables, generateCompleteCSS } from './cssGenerator';
export { generateCompleteExport, downloadExportPackage, downloadFile } from './cssExportGenerator';
export { renderTemplate, validateTemplate } from './templateEngine';
export { generateAIPrompt } from './aiPromptGenerator';