import { useState, useEffect, createContext, useContext, createElement } from 'react';

const translations = {
  en: {
    // Header & Navigation
    designSystemBuilder: 'Design System Builder',
    aiFriendly: 'AI Friendly',
    visual: 'Visual',
    code: 'Code',
    aiExport: 'AI Export',
    export: 'Export',
    saveAll: 'Save All',
    saving: 'Saving...',
    
    // Sidebar & Design Tokens
    designTokens: 'Design Tokens',
    addDesignToken: 'Add Design Token',
    
    // Colors
    colors: 'Colors',
    primaryColor: 'Primary Color',
    secondaryColor: 'Secondary Color',
    successColor: 'Success Color',
    dangerColor: 'Danger Color',
    addColor: 'Add Color',
    removeColor: 'Remove Color',
    
    // Typography
    typography: 'Typography',
    fontPreset: 'Font Preset',
    primaryFont: 'Primary Font',
    secondaryFont: 'Secondary Font',
    fontSize: 'Font Size',
    
    // Spacing
    spacing: 'Spacing',
    spacingPreset: 'Spacing Preset',
    addSpacing: 'Add Spacing',
    removeSpacing: 'Remove Spacing',
    
    // Branding
    branding: 'Branding',
    brandName: 'Brand Name',
    logoUrl: 'Logo URL',
    logoAlt: 'Logo Alt Text',
    logoPreview: 'Logo Preview',
    
    // Icons
    icons: 'Icons',
    iconSet: 'Icon Set',
    iconSize: 'Icon Size',
    defaultSize: 'Default Size',
    iconSetInfo: 'Icon Set Info',
    
    // Framework
    framework: 'Framework',
    cssFramework: 'CSS Framework',
    frameworkVersion: 'Framework Version',
    frameworkInfo: 'Framework Info',
    utilityBased: 'Utility-based',
    componentBased: 'Component-based',
    cssPrefix: 'CSS Prefix',
    current: 'Current',
    
    // Preview System
    refresh: 'Refresh',
    openInNewWindow: 'Open in new window',
    openExternal: 'Open External',
    loading: 'Loading',
    mobileView: 'Mobile View',
    tabletView: 'Tablet View',
    desktopView: 'Desktop View',
    shareComponent: 'Share Component',
    copyShareURL: 'Copy Share URL',
    previewMode: 'Preview Mode',
    componentPreview: 'Component Preview',
    frameworkLoaded: 'Framework loaded',
    frameworkError: 'Framework loading error',
    noFramework: 'No framework selected',
    viewport: 'Viewport',
    responsive: 'Responsive',
    fixedWidth: 'Fixed Width',
    noTemplate: 'No template defined',
    templateError: 'Template rendering error',
    propsError: 'Props validation error',
    renderingComponent: 'Rendering component...',
    openedInNewTab: 'Opened in new tab',
    shareURLCopied: 'Share URL copied to clipboard',
    previewLinkGenerated: 'Preview link generated',
    
    // Component Categories
    atoms: 'Atoms',
    molecules: 'Molecules',
    organisms: 'Organisms',
    templates: 'Templates',
    pages: 'Pages',
    basicUIElements: 'Basic UI elements',
    simpleComponentGroups: 'Simple component groups',
    complexUISections: 'Complex UI sections',
    pageLayouts: 'Page layouts',
    completeViews: 'Complete views',
    
    // Properties Panel
    properties: 'Properties',
    noPropertiesAvailable: 'No properties available for this component.',
    noComponentSelected: 'No component selected',
    selectComponent: 'Select a component from the sidebar to edit',
    realTimeUpdates: 'Real-time Updates',
    changesAppliedInstantly: 'Changes are applied instantly to the visual preview. Use Code mode to modify the props definition.',
    propsDefinition: 'Props Definition',
    save: 'Save',
    copy: 'Copy',
    propsSchema: 'Props Schema',
    enabled: 'Enabled',
    
    // Code Tab
    currentProps: 'Current Props',
    hasTemplate: 'Has Template',
    unsavedChanges: 'Unsaved Changes',
    templateValidationErrors: 'Template Validation Errors',
    template: 'Template',
    templateWithVariables: 'Template (with variables)',
    previewHTML: 'Preview HTML',
    previewHTMLGenerated: 'Preview HTML (Generated from Template + Props)',
    cssStyles: 'CSS/SCSS Styles',
    cssStylesComponentOnly: 'CSS/SCSS Styles (Component Only)',
    generatedHTML: 'Generated HTML will appear here...',
    templatePlaceholder: 'HTML template with variables...',
    cssPlaceholder: 'CSS/SCSS styles for your component...',
    
    // Help Text
    useVariables: 'Use {{propName}} for variables • {{#if propName}}...{{/if}} for conditionals • Use "Save All" to save everything at once',
    htmlGenerated: 'This HTML is automatically generated from your template + current props values • Changes in Template or Properties will update this preview',
    cssVariables: 'Use CSS variables like --color-primary for theming • Only component-specific styles (design tokens are injected automatically)',
    editPropsDefinition: 'Edit props definition • Save using the button above when you have changes • Use JSON format',
    
    // Visual Tab
    loadingComponents: 'Loading components...',
    componentNeedsTemplate: 'This component needs a template. Go to Code tab to add one.',
    noTemplateForComponent: 'No template defined for this component',
    templateValidationFailed: 'Template validation failed',
    
    // Add/Delete Components
    addComponent: 'Add Component',
    enterComponentName: 'Enter new {category} component name:',
    enterNewTokenName: 'Enter new token name',
    enterTokenValue: 'Enter token value',
    deleteComponent: 'Delete Component',
    deleteConfirmation: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    
    // AI Export
    aiTemplateGenerator: 'AI Template Generator',
    copyToClipboard: 'Copy to Clipboard',
    
    // Status Messages
    copied: 'Copied!',
    saved: 'Saved!',
    allSaved: 'All Saved!',
    saveFailed: 'Save Failed',
    error: 'Error',
    
    // Component Props
    variant: 'Variant',
    size: 'Size',
    text: 'Text',
    disabled: 'Disabled',
    loading: 'Loading',
    title: 'Title',
    content: 'Content',
    
    // Language & Forms
    language: 'Language',
    english: 'English',
    french: 'Français',
    name: 'Name',
    value: 'Value',
    placeholder: 'Placeholder',
    description: 'Description',
    choosePreset: 'Choose preset...',
    visit: 'Visit'
  },
  
  fr: {
    // Header & Navigation
    designSystemBuilder: 'Créateur de Design System',
    aiFriendly: 'Compatible IA',
    visual: 'Visuel',
    code: 'Code',
    aiExport: 'Export IA',
    export: 'Exporter',
    saveAll: 'Tout Sauvegarder',
    saving: 'Sauvegarde...',
    
    // Sidebar & Design Tokens
    designTokens: 'Tokens de Design',
    addDesignToken: 'Ajouter un Token',
    
    // Colors
    colors: 'Couleurs',
    primaryColor: 'Couleur Primaire',
    secondaryColor: 'Couleur Secondaire',
    successColor: 'Couleur de Succès',
    dangerColor: 'Couleur de Danger',
    addColor: 'Ajouter une Couleur',
    removeColor: 'Supprimer la Couleur',
    
    // Typography
    typography: 'Typographie',
    fontPreset: 'Preset de Police',
    primaryFont: 'Police Primaire',
    secondaryFont: 'Police Secondaire',
    fontSize: 'Taille de Police',
    
    // Spacing
    spacing: 'Espacement',
    spacingPreset: 'Preset d\'Espacement',
    addSpacing: 'Ajouter un Espacement',
    removeSpacing: 'Supprimer l\'Espacement',
    
    // Branding
    branding: 'Image de Marque',
    brandName: 'Nom de Marque',
    logoUrl: 'URL du Logo',
    logoAlt: 'Texte Alt du Logo',
    logoPreview: 'Aperçu du Logo',
    
    // Icons
    icons: 'Icônes',
    iconSet: 'Set d\'Icônes',
    iconSize: 'Taille d\'Icône',
    defaultSize: 'Taille par Défaut',
    iconSetInfo: 'Info du Set d\'Icônes',
    
    // Framework
    framework: 'Framework',
    cssFramework: 'Framework CSS',
    frameworkVersion: 'Version du Framework',
    frameworkInfo: 'Info du Framework',
    utilityBased: 'Basé sur les utilitaires',
    componentBased: 'Basé sur les composants',
    cssPrefix: 'Préfixe CSS',
    current: 'Actuel',
    
    // Preview System
    refresh: 'Actualiser',
    openInNewWindow: 'Ouvrir dans une nouvelle fenêtre',
    openExternal: 'Ouvrir en Externe',
    loading: 'Chargement',
    mobileView: 'Vue Mobile',
    tabletView: 'Vue Tablette',
    desktopView: 'Vue Bureau',
    shareComponent: 'Partager le Composant',
    copyShareURL: 'Copier l\'URL de Partage',
    previewMode: 'Mode Aperçu',
    componentPreview: 'Aperçu du Composant',
    frameworkLoaded: 'Framework chargé',
    frameworkError: 'Erreur de chargement du framework',
    noFramework: 'Aucun framework sélectionné',
    viewport: 'Viewport',
    responsive: 'Responsif',
    fixedWidth: 'Largeur Fixe',
    noTemplate: 'Aucun modèle défini',
    templateError: 'Erreur de rendu du modèle',
    propsError: 'Erreur de validation des propriétés',
    renderingComponent: 'Rendu du composant...',
    openedInNewTab: 'Ouvert dans un nouvel onglet',
    shareURLCopied: 'URL de partage copiée dans le presse-papiers',
    previewLinkGenerated: 'Lien d\'aperçu généré',
    
    // Component Categories
    atoms: 'Atomes',
    molecules: 'Molécules',
    organisms: 'Organismes',
    templates: 'Modèles',
    pages: 'Pages',
    basicUIElements: 'Éléments UI de base',
    simpleComponentGroups: 'Groupes de composants simples',
    complexUISections: 'Sections UI complexes',
    pageLayouts: 'Mises en page',
    completeViews: 'Vues complètes',
    
    // Properties Panel
    properties: 'Propriétés',
    noPropertiesAvailable: 'Aucune propriété disponible pour ce composant.',
    noComponentSelected: 'Aucun composant sélectionné',
    selectComponent: 'Sélectionnez un composant dans la barre latérale pour modifier',
    realTimeUpdates: 'Mises à Jour en Temps Réel',
    changesAppliedInstantly: 'Les modifications sont appliquées instantanément à l\'aperçu visuel. Utilisez le mode Code pour modifier la définition des propriétés.',
    propsDefinition: 'Définition des Propriétés',
    save: 'Sauvegarder',
    copy: 'Copier',
    propsSchema: 'Schéma des Propriétés',
    enabled: 'Activé',
    
    // Code Tab
    currentProps: 'Propriétés Actuelles',
    hasTemplate: 'A un Modèle',
    unsavedChanges: 'Modifications Non Sauvegardées',
    templateValidationErrors: 'Erreurs de Validation du Modèle',
    template: 'Modèle',
    templateWithVariables: 'Modèle (avec variables)',
    previewHTML: 'Aperçu HTML',
    previewHTMLGenerated: 'Aperçu HTML (Généré depuis Modèle + Propriétés)',
    cssStyles: 'Styles CSS/SCSS',
    cssStylesComponentOnly: 'Styles CSS/SCSS (Composant Uniquement)',
    generatedHTML: 'Le HTML généré apparaîtra ici...',
    templatePlaceholder: 'Modèle HTML avec variables...',
    cssPlaceholder: 'Styles CSS/SCSS pour votre composant...',
    
    // Help Text
    useVariables: 'Utilisez {{propName}} pour les variables • {{#if propName}}...{{/if}} pour les conditions • Utilisez "Tout Sauvegarder" pour tout sauvegarder d\'un coup',
    htmlGenerated: 'Ce HTML est automatiquement généré depuis votre modèle + les valeurs actuelles des propriétés • Les modifications dans le Modèle ou les Propriétés mettront à jour cet aperçu',
    cssVariables: 'Utilisez les variables CSS comme --color-primary pour le thème • Styles spécifiques au composant uniquement (les tokens de design sont injectés automatiquement)',
    editPropsDefinition: 'Modifiez la définition des propriétés • Sauvegardez avec le bouton ci-dessus quand vous avez des modifications • Utilisez le format JSON',
    
    // Visual Tab
    loadingComponents: 'Chargement des composants...',
    componentNeedsTemplate: 'Ce composant a besoin d\'un modèle. Allez dans l\'onglet Code pour en ajouter un.',
    noTemplateForComponent: 'Aucun modèle défini pour ce composant',
    templateValidationFailed: 'La validation du modèle a échoué',
    
    // Add/Delete Components
    addComponent: 'Ajouter un Composant',
    enterComponentName: 'Entrez le nom du nouveau composant {category} :',
    enterNewTokenName: 'Entrez le nom du nouveau token',
    enterTokenValue: 'Entrez la valeur du token',
    deleteComponent: 'Supprimer le Composant',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer "{name}" ? Cette action ne peut pas être annulée.',
    cancel: 'Annuler',
    delete: 'Supprimer',
    
    // AI Export
    aiTemplateGenerator: 'Générateur de Modèles IA',
    copyToClipboard: 'Copier dans le Presse-papiers',
    
    // Status Messages
    copied: 'Copié !',
    saved: 'Sauvegardé !',
    allSaved: 'Tout Sauvegardé !',
    saveFailed: 'Échec de la Sauvegarde',
    error: 'Erreur',
    
    // Component Props
    variant: 'Variante',
    size: 'Taille',
    text: 'Texte',
    disabled: 'Désactivé',
    loading: 'Chargement',
    title: 'Titre',
    content: 'Contenu',
    
    // Language & Forms
    language: 'Langue',
    english: 'English',
    french: 'Français',
    name: 'Nom',
    value: 'Valeur',
    placeholder: 'Placeholder',
    description: 'Description',
    choosePreset: 'Choisir un preset...',
    visit: 'Visiter'
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    // Récupérer la langue sauvegardée ou utiliser la langue du navigateur
    const saved = localStorage.getItem('design-system-locale');
    if (saved && translations[saved]) {
      return saved;
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  });

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('design-system-locale', locale);
  }, [locale]);

  const t = (key, params = {}) => {
    const translation = translations[locale]?.[key] || translations.en[key] || key;
    
    // Remplacer les paramètres dans la traduction
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return translation;
  };

  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  };

  const getAvailableLocales = () => {
    return Object.keys(translations).map(key => ({
      code: key,
      name: translations[key].language
    }));
  };

  return createElement(
    I18nContext.Provider,
    {
      value: {
        locale,
        t,
        changeLocale,
        getAvailableLocales,
        translations: translations[locale]
      }
    },
    children
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: 'en',
      t: (key) => key,
      changeLocale: () => {},
      getAvailableLocales: () => [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' }
      ],
      translations: {}
    };
  }
  return context;
};