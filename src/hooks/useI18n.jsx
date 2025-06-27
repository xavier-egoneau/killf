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
    visit: 'Visit',

    // ==================== NOUVEAUX TEXTES IDENTIFIÉS ====================
    
    // AI Export Tab - Nouveaux textes
    aiCommunicationHub: 'AI Communication Hub',
    promptsOptimized: 'Prompts optimized with project rules and framework context',
    rules: 'Rules',
    createComponent: 'Create Component',
    improveComponent: 'Improve Component',
    createPage: 'Create Page',
    configuration: 'Configuration',
    currentFramework: 'Current Framework',
    customConfiguration: 'Custom configuration',
    category: 'Category',
    componentName: 'Component Name',
    modernButton: 'Modern Button',
    componentToImprove: 'Component to improve',
    selectComponent: 'Select...',
    validation: 'Validation',
    errors: 'error(s)',
    warnings: 'warning(s)',
    validComponent: 'Valid component',
    suggestions: 'Suggestions',
    pageType: 'Page type',
    landingPage: 'Landing Page, Dashboard, etc.',
    availableComponents: 'Available components',
    componentsInCategories: '{count} components in {categories} categories',
    requestToAI: 'Request to AI',
    exampleCreateComponent: 'Create a button with icons and loading states',
    exampleImproveComponent: 'Add animations and improve accessibility',
    exampleCreatePage: 'Create a homepage with header, hero section and footer',
    rulesApplied: 'Rules applied',
    namingConventions: 'Naming conventions',
    atomicDesignPrinciples: 'Atomic design principles',
    frameworkPatterns: 'Framework {framework} patterns',
    accessibilityGuidelines: 'Accessibility guidelines',
    designTokensIntegration: 'Design tokens integration',
    projectRules: 'Project Rules',
    namingComponents: 'Naming Components',
    cssClasses: 'CSS Classes',
    accessibility: 'Accessibility',
    completePrompt: 'Complete Prompt',
    aiPrompt: 'AI Prompt',
    howToUsePrompt: 'How to use this prompt',
    copyCompletePrompt: 'Copy the complete prompt generated above',
    pasteInAI: 'Paste it into your preferred AI (ChatGPT, Claude, etc.)',
    aiWillProvideCode: 'The AI will give you optimized code for your design system',
    copyCodeToTab: 'Copy the code into the Code or Properties tab according to the type',
    stats: 'Stats',
    componentsCount: 'Components',
    colorsCount: 'Colors',
    rulesCount: 'Rules',
    frameworkType: 'Framework',
    
    // Navbar Component - Nouveaux textes
    navbar: 'Navbar',
    visualStyleVariant: 'Visual style variant',
    light: 'Light',
    dark: 'Dark',
    transparent: 'Transparent',
    glass: 'Glass',
    stickToTop: 'Stick to top when scrolling',
    showBottomBorder: 'Show bottom border',
    logoImageURL: 'Logo image URL',
    logoAltText: 'Logo alt text',
    logo: 'Logo',
    brandTextNextToLogo: 'Brand text next to logo',
    myBrand: 'MyBrand',
    centerNavigationLinks: 'Center the navigation links',
    showHomeLink: 'Show Home link',
    homeLinkText: 'Home link text',
    home: 'Home',
    homeLinkURL: 'Home link URL',
    markHomeAsActive: 'Mark Home as active',
    showAboutLink: 'Show About link',
    aboutLinkText: 'About link text',
    about: 'About',
    aboutLinkURL: 'About link URL',
    markAboutAsActive: 'Mark About as active',
    showServicesLink: 'Show Services link',
    servicesLinkText: 'Services link text',
    services: 'Services',
    servicesLinkURL: 'Services link URL',
    markServicesAsActive: 'Mark Services as active',
    showContactLink: 'Show Contact link',
    contactLinkText: 'Contact link text',
    contact: 'Contact',
    contactLinkURL: 'Contact link URL',
    markContactAsActive: 'Mark Contact as active',
    userNameInDropdown: 'User name in dropdown',
    johnDoe: 'John Doe',
    userAvatarURL: 'User avatar URL',
    hideDropdownIcon: 'Hide dropdown arrow icon',
    showProfileItem: 'Show Profile item in dropdown',
    profileMenuItemText: 'Profile menu item text',
    profile: 'Profile',
    profilePageURL: 'Profile page URL',
    profileMenuIcon: 'Profile menu icon',
    showSettingsItem: 'Show Settings item in dropdown',
    settingsMenuItemText: 'Settings menu item text',
    settings: 'Settings',
    settingsPageURL: 'Settings page URL',
    settingsMenuIcon: 'Settings menu icon',
    showDividerInDropdown: 'Show divider in dropdown',
    showLogoutItem: 'Show Logout item in dropdown',
    logoutMenuItemText: 'Logout menu item text',
    logout: 'Logout',
    logoutURL: 'Logout URL',
    logoutMenuIcon: 'Logout menu icon',
    showMobileHamburger: 'Show mobile hamburger menu',
    showMobileNavigation: 'Show mobile navigation (toggleable)',
    
    // Logo Upload Component - Nouveaux textes
    uploadSVG: 'Upload SVG',
    url: 'URL',
    clickOrDragSVG: 'Click or drag SVG file',
    uploading: 'Uploading...',
    maxSize: 'Max 500KB',
    set: 'Set',
    logoUploaded: 'Logo uploaded successfully!',
    svgInformation: 'SVG Information',
    optimized: 'Optimized',
    logoDescription: 'Logo description',
    preview: 'Preview',
    removeLogo: 'Remove logo',
    uploadedSVG: 'Uploaded SVG',
    externalURL: 'External URL',
    
    // Framework Manager - Nouveaux textes
    runtimeFramework: 'Runtime Framework',
    jsFramework: 'JS',
    frameworkIntegration: 'Framework Integration',
    runtimeEnvironment: 'Runtime Environment',
    jsFrameworkType: 'JavaScript Framework',
    cssFramework: 'CSS Framework',
    cdnLoaded: 'CDN Loaded',
    multipleFiles: 'Multiple files',
    loaded: 'Loaded',
    none: 'None',
    runtimeActive: 'Runtime active',
    suggestedClasses: 'Suggested Classes',
    frameworkMismatch: 'Framework Mismatch',
    recommended: 'Recommended',
    frameworkSuggestions: 'Framework suggestions',
    templateSuggestions: 'Template Suggestions',
    templateHelp: 'Template Help',
    getTemplateSuggestion: 'Get template suggestion',
    angularBootstrapActive: 'Angular bootstrap active',
    lastUpdated: 'Last updated',
    
    // CSS Export - Nouveaux textes
    exportCSS: 'Export CSS',
    exporting: 'Exporting...',
    completeCSS: 'Complete CSS',
    allInOne: 'All-in-one',
    designSystem: 'Design System',
    tokensUtils: 'Tokens + Utils',
    componentsOnly: 'Components Only',
    componentsCSSOnly: 'Components CSS',
    frameworkCSS: 'Framework CSS',
    completePackage: 'Complete Package',
    allFiles: 'All files',
    cssExported: 'CSS exported!',
    exportFailed: 'Export Failed',
    
    // Unsaved Changes - Nouveaux textes
    modificationsWaiting: 'Modifications pending',
    everythingSaved: 'Everything saved',
    designTokensStatus: 'Design Tokens',
    componentsWaiting: 'Components pending',
    propsWaiting: 'Props pending',
    noChangesToSave: 'No changes to save',
    tokens: 'Tokens',
    props: 'Props',
    
    // Preview Frame - Nouveaux textes
    componentPreview: 'Component Preview',
    noComponent: 'No Component',
    templateSuggestion: 'Template Suggestion',
    
    // Sidebar - Nouveaux textes
    autoAppliedPreset: 'Auto-Applied Preset',
    usingSpacingFrom: 'Using {preset} spacing from {framework} framework',
    fontFamily: 'Font Family',
    fontFamilySecondary: 'Secondary Font Family',
    primaryFontSize: 'Primary Font Size',
    secondaryFontSize: 'Secondary Font Size',
    fontSizeXS: 'Size xs',
    fontSizeSM: 'Size sm',
    fontSizeMD: 'Size md',
    fontSizeLG: 'Size lg',
    fontSizeXL: 'Size xl',
    brandLogoAlt: 'Brand Logo',
    iconSetDescription: 'Icon set description',
    usage: 'Usage',
    version: 'Version',
    autoSpacing: 'Auto Spacing',
    
    // Properties Panel - Nouveaux textes
    jsonFormat: 'JSON format',
    invalidJSON: 'Invalid JSON',
    
    // Code Tab - Nouveaux textes
    templateValidationFailed: 'Template validation failed',
    cssVariablesNote: 'Use CSS variables like --color-primary for theming',
    onlyComponentSpecificStyles: 'Only component-specific styles (design tokens are injected automatically)',
    
    // Visual Tab - Nouveaux textes
    autoView: 'Auto view',
    angularMaterialIntegration: 'Angular Material Integration',
    loadingAngular: 'Loading Angular...',
    templateHelper: 'Template Helper',
    
    // App.jsx - Nouveaux textes
    changesDetected: 'Changes detected',
    status: 'Status',
    
    // Tokens Sidebar - Nouveaux textes spécifiques
    removeColorToken: 'Remove {color} color',
    removeSpacingToken: 'Remove {spacing} spacing',
    
    // Error Messages génériques
    failedToLoad: 'Failed to load',
    networkError: 'Network error',
    invalidData: 'Invalid data',
    operationFailed: 'Operation failed',
    tryAgain: 'Try again',
    
    // Success Messages génériques
    operationSuccess: 'Operation successful',
    dataLoaded: 'Data loaded',
    changesSaved: 'Changes saved',
    
    // Generic UI
    close: 'Close',
    open: 'Open',
    show: 'Show',
    hide: 'Hide',
    expand: 'Expand',
    collapse: 'Collapse',
    next: 'Next',
    previous: 'Previous',
    back: 'Back',
    continue: 'Continue',
    finish: 'Finish',
    apply: 'Apply',
    reset: 'Reset',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    new: 'New',
    edit: 'Edit',
    update: 'Update',
    create: 'Create',
    remove: 'Remove',
    duplicate: 'Duplicate',
    move: 'Move',
    rename: 'Rename',
    
    // Time & Dates
    now: 'Now',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    
    // File Operations
    upload: 'Upload',
    download: 'Download',
    import: 'Import',
    selectFile: 'Select file',
    chooseFile: 'Choose file',
    dropFileHere: 'Drop file here',
    fileSelected: 'File selected',
    fileUploaded: 'File uploaded',
    
    // Numbers & Statistics
    total: 'Total',
    count: 'Count',
    items: 'Items',
    results: 'Results',
    noResults: 'No results',
    showingResults: 'Showing {count} results',
    
    // Loading States
    pleaseWait: 'Please wait',
    processing: 'Processing',
    loadingData: 'Loading data',
    savingData: 'Saving data',
    
    // Validation
    required: 'Required',
    optional: 'Optional',
    invalid: 'Invalid',
    valid: 'Valid',
    fieldRequired: 'This field is required',
    invalidFormat: 'Invalid format',
    tooShort: 'Too short',
    tooLong: 'Too long',
    
    // Notifications
    notification: 'Notification',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
    attention: 'Attention',
    
    // Development/Debug
    debug: 'Debug',
    console: 'Console',
    logs: 'Logs',
    test: 'Test',
    development: 'Development',
    production: 'Production',

    // Textes spécifiques supplémentaires détectés dans le code
    clickMe: 'Click me',
    modernButtonComponent: 'Modern Button Component',
    cardTitle: 'Card Title',
    cardSubtitle: 'Card subtitle',
    cardContent: 'Card content',
    action: 'Action',
    angularMaterialButton: 'Angular Material Button',
    materialDesignColorVariant: 'Material Design color variant',
    primary: 'Primary',
    accent: 'Accent',
    warn: 'Warn',
    buttonTextContent: 'Button text content',
    materialIconName: 'Material icon name (e.g., home, search)',
    leftIcon: 'Left icon',
    rightIcon: 'Right icon',
    disableButtonInteraction: 'Disable button interaction',
    angularMaterialInput: 'Angular Material Input',
    inputFieldLabel: 'Input field label',
    enterText: 'Enter text',
    placeholderText: 'Placeholder text',
    typeSomething: 'Type something...',
    htmlInputType: 'HTML input type',
    email: 'Email',
    password: 'Password',
    number: 'Number',
    helperText: 'Helper text below the input',
    disableInputInteraction: 'Disable input interaction',
    markFieldAsRequired: 'Mark field as required',
    errorMessageToDisplay: 'Error message to display',
    angularMaterialCard: 'Angular Material Card',
    mainCardTitle: 'Main card title',
    mainCardContent: 'Main card content',
    thisIsCardContent: 'This is the card content. You can put any information here.',
    showActionButtons: 'Show action buttons',
    showPrimaryActionButton: 'Show primary action button',
    primaryActionButtonText: 'Primary action button text',
    showSecondaryActionButton: 'Show secondary action button',
    secondaryActionButtonText: 'Secondary action button text',

    // Messages d'erreur spécifiques aux fichiers
    fileMustHaveSvgExtension: 'File must have .svg extension',
    fileTypeMustBeSvgXml: 'File type must be image/svg+xml',
    svgFileTooLarge: 'SVG file is too large (max 500KB)',
    fileDoesNotContainValidSvg: 'File does not contain valid SVG',
    svgFilesWithScriptsNotAllowed: 'SVG files with scripts are not allowed',
    unableToReadFileContent: 'Unable to read file content',
    unableToGeneratePreview: 'Unable to generate preview',
    unableToLoadImageFromUrl: 'Unable to load image from URL',

    // Messages de développement et configuration
    generatedOn: 'Generated on',
    at: 'at',
    frameworkIntegrationOptimized: 'This design system is optimized for',
    quickStart: 'Quick Start',
    includeFrameworkCssJs: 'Include the framework CSS/JS',
    addDesignSystemCss: 'Add design-system.css',
    startUsingComponents: 'Start using components',
    filesIncluded: 'Files Included',
    coreDesignTokensUtilities: 'Core design tokens and utilities',
    allComponentStyles: 'All component styles',
    frameworkSpecificIntegration: 'Framework-specific integration',
    everythingCombined: 'Everything combined',
    supportQuestions: 'Support',
    forQuestionsDocumentation: 'For questions and documentation, visit your design system documentation.',

    // Messages de logs et développement
    configurationSuccessful: 'Configuration successful',
    loadingFromServer: 'Loading from server',
    usingDefaults: 'Using defaults',
    mergedWithDefaults: 'Merged with defaults',
    propsUpdatedFromDefinition: 'Props updated from definition',
    typeStringBooleanSelectNumber: 'type: "string" | "boolean" | "select" | "number"',
    defaultValue: 'Default value',
    arrayForSelectType: 'Array (for select type)',
    helpTextOptional: 'Help text (optional)',

    // Textes de l'interface utilisateur manqués
    chooseTemplate: 'Choose template',
    noSuggestionsAvailable: 'No suggestions available',
    loadingTemplate: 'Loading template',
    newComponentCreated: 'New component created',
    componentDeletedSuccessfully: 'Component deleted successfully',
    componentSavedSuccessfully: 'Component saved successfully',
    tokensSavedSuccessfully: 'Tokens saved successfully',
    noDataToSave: 'No data to save',
    operationCancelled: 'Operation cancelled',
    confirmAction: 'Confirm action',
    actionCannotBeUndone: 'This action cannot be undone',

    // Ajouts pour les textes manqués dans les composants
    componentKey: 'Component key',
    componentPath: 'Component path',
    categoryIcon: 'Category icon',
    componentIcon: 'Component icon',
    editComponent: 'Edit component',
    viewComponent: 'View component',
    previewComponent: 'Preview component',
    shareComponent: 'Share component',
    exportComponent: 'Export component',
    importComponent: 'Import component',
    cloneComponent: 'Clone component',

    // Interface utilisateur additionnelle
    maximize: 'Maximize',
    minimize: 'Minimize',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoom: 'Reset zoom',
    fitToScreen: 'Fit to screen',
    actualSize: 'Actual size'
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
    visit: 'Visiter',

    // ==================== NOUVEAUX TEXTES TRADUITS ====================
    
    // AI Export Tab - Traductions françaises
    aiCommunicationHub: 'Hub de Communication IA',
    promptsOptimized: 'Prompts optimisés avec règles projet et contexte framework',
    rules: 'Règles',
    createComponent: 'Créer un Composant',
    improveComponent: 'Améliorer un Composant',
    createPage: 'Créer une Page',
    configuration: 'Configuration',
    currentFramework: 'Framework Actuel',
    customConfiguration: 'Configuration personnalisée',
    category: 'Catégorie',
    componentName: 'Nom du Composant',
    modernButton: 'Bouton Moderne',
    componentToImprove: 'Composant à améliorer',
    selectComponent: 'Sélectionner...',
    validation: 'Validation',
    errors: 'erreur(s)',
    warnings: 'avertissement(s)',
    validComponent: 'Composant valide',
    suggestions: 'Suggestions',
    pageType: 'Type de page',
    landingPage: 'Page d\'accueil, Tableau de bord, etc.',
    availableComponents: 'Composants disponibles',
    componentsInCategories: '{count} composants dans {categories} catégories',
    requestToAI: 'Demande à l\'IA',
    exampleCreateComponent: 'Crée un bouton avec icônes et états de chargement',
    exampleImproveComponent: 'Ajoute des animations et améliore l\'accessibilité',
    exampleCreatePage: 'Crée une page d\'accueil avec header, hero section et footer',
    rulesApplied: 'Règles appliquées',
    namingConventions: 'Conventions de nommage',
    atomicDesignPrinciples: 'Principes du design atomique',
    frameworkPatterns: 'Patterns Framework {framework}',
    accessibilityGuidelines: 'Guidelines d\'accessibilité',
    designTokensIntegration: 'Intégration des design tokens',
    projectRules: 'Règles du Projet',
    namingComponents: 'Nommage des Composants',
    cssClasses: 'Classes CSS',
    accessibility: 'Accessibilité',
    completePrompt: 'Prompt Complet',
    aiPrompt: 'Prompt IA',
    howToUsePrompt: 'Comment utiliser ce prompt',
    copyCompletePrompt: 'Copiez le prompt complet généré ci-dessus',
    pasteInAI: 'Collez-le dans votre IA préférée (ChatGPT, Claude, etc.)',
    aiWillProvideCode: 'L\'IA vous donnera du code optimisé pour votre design system',
    copyCodeToTab: 'Copiez le code dans l\'onglet Code ou Propriétés selon le type',
    stats: 'Statistiques',
    componentsCount: 'Composants',
    colorsCount: 'Couleurs',
    rulesCount: 'Règles',
    frameworkType: 'Framework',
    
    // Navbar Component - Traductions françaises
    navbar: 'Barre de Navigation',
    visualStyleVariant: 'Variante de style visuel',
    light: 'Clair',
    dark: 'Sombre',
    transparent: 'Transparent',
    glass: 'Verre',
    stickToTop: 'Fixer en haut lors du défilement',
    showBottomBorder: 'Afficher la bordure du bas',
    logoImageURL: 'URL de l\'image du logo',
    logoAltText: 'Texte alt du logo',
    logo: 'Logo',
    brandTextNextToLogo: 'Texte de marque à côté du logo',
    myBrand: 'MaMarque',
    centerNavigationLinks: 'Centrer les liens de navigation',
    showHomeLink: 'Afficher le lien Accueil',
    homeLinkText: 'Texte du lien Accueil',
    home: 'Accueil',
    homeLinkURL: 'URL du lien Accueil',
    markHomeAsActive: 'Marquer Accueil comme actif',
    showAboutLink: 'Afficher le lien À propos',
    aboutLinkText: 'Texte du lien À propos',
    about: 'À propos',
    aboutLinkURL: 'URL du lien À propos',
    markAboutAsActive: 'Marquer À propos comme actif',
    showServicesLink: 'Afficher le lien Services',
    servicesLinkText: 'Texte du lien Services',
    services: 'Services',
    servicesLinkURL: 'URL du lien Services',
    markServicesAsActive: 'Marquer Services comme actif',
    showContactLink: 'Afficher le lien Contact',
    contactLinkText: 'Texte du lien Contact',
    contact: 'Contact',
    contactLinkURL: 'URL du lien Contact',
    markContactAsActive: 'Marquer Contact comme actif',
    userNameInDropdown: 'Nom d\'utilisateur dans le menu déroulant',
    johnDoe: 'Jean Dupont',
    userAvatarURL: 'URL de l\'avatar utilisateur',
    hideDropdownIcon: 'Masquer l\'icône de flèche du menu déroulant',
    showProfileItem: 'Afficher l\'élément Profil dans le menu déroulant',
    profileMenuItemText: 'Texte de l\'élément de menu Profil',
    profile: 'Profil',
    profilePageURL: 'URL de la page Profil',
    profileMenuIcon: 'Icône du menu Profil',
    showSettingsItem: 'Afficher l\'élément Paramètres dans le menu déroulant',
    settingsMenuItemText: 'Texte de l\'élément de menu Paramètres',
    settings: 'Paramètres',
    settingsPageURL: 'URL de la page Paramètres',
    settingsMenuIcon: 'Icône du menu Paramètres',
    showDividerInDropdown: 'Afficher le séparateur dans le menu déroulant',
    showLogoutItem: 'Afficher l\'élément Déconnexion dans le menu déroulant',
    logoutMenuItemText: 'Texte de l\'élément de menu Déconnexion',
    logout: 'Déconnexion',
    logoutURL: 'URL de déconnexion',
    logoutMenuIcon: 'Icône du menu Déconnexion',
    showMobileHamburger: 'Afficher le menu hamburger mobile',
    showMobileNavigation: 'Afficher la navigation mobile (basculable)',
    
    // Logo Upload Component - Traductions françaises
    uploadSVG: 'Télécharger SVG',
    url: 'URL',
    clickOrDragSVG: 'Cliquez ou glissez un fichier SVG',
    uploading: 'Téléchargement...',
    maxSize: 'Max 500Ko',
    set: 'Définir',
    logoUploaded: 'Logo téléchargé avec succès !',
    svgInformation: 'Informations SVG',
    optimized: 'Optimisé',
    logoDescription: 'Description du logo',
    preview: 'Aperçu',
    removeLogo: 'Supprimer le logo',
    uploadedSVG: 'SVG téléchargé',
    externalURL: 'URL externe',
    
    // Framework Manager - Traductions françaises
    runtimeFramework: 'Framework d\'Exécution',
    jsFramework: 'JS',
    frameworkIntegration: 'Intégration Framework',
    runtimeEnvironment: 'Environnement d\'Exécution',
    jsFrameworkType: 'Framework JavaScript',
    cssFramework: 'Framework CSS',
    cdnLoaded: 'CDN Chargé',
    multipleFiles: 'Fichiers multiples',
    loaded: 'Chargé',
    none: 'Aucun',
    runtimeActive: 'Runtime actif',
    suggestedClasses: 'Classes Suggérées',
    frameworkMismatch: 'Incompatibilité Framework',
    recommended: 'Recommandé',
    frameworkSuggestions: 'Suggestions Framework',
    templateSuggestions: 'Suggestions de Modèles',
    templateHelp: 'Aide Modèle',
    getTemplateSuggestion: 'Obtenir une suggestion de modèle',
    angularBootstrapActive: 'Bootstrap Angular actif',
    lastUpdated: 'Dernière mise à jour',
    
    // CSS Export - Traductions françaises
    exportCSS: 'Exporter CSS',
    exporting: 'Export en cours...',
    completeCSS: 'CSS Complet',
    allInOne: 'Tout-en-un',
    designSystem: 'Design System',
    tokensUtils: 'Tokens + Utils',
    componentsOnly: 'Composants Uniquement',
    componentsCSSOnly: 'CSS Composants',
    frameworkCSS: 'CSS Framework',
    completePackage: 'Package Complet',
    allFiles: 'Tous les fichiers',
    cssExported: 'CSS exporté !',
    exportFailed: 'Échec de l\'Export',
    
    // Unsaved Changes - Traductions françaises
    modificationsWaiting: 'Modifications en attente',
    everythingSaved: 'Tout sauvegardé',
    designTokensStatus: 'Design Tokens',
    componentsWaiting: 'Composants en attente',
    propsWaiting: 'Props en attente',
    noChangesToSave: 'Aucune modification à sauvegarder',
    tokens: 'Tokens',
    props: 'Props',
    
    // Preview Frame - Traductions françaises
    componentPreview: 'Aperçu du Composant',
    noComponent: 'Aucun Composant',
    templateSuggestion: 'Suggestion de Modèle',
    
    // Sidebar - Traductions françaises
    autoAppliedPreset: 'Preset Auto-Appliqué',
    usingSpacingFrom: 'Utilisation de l\'espacement {preset} du framework {framework}',
    fontFamily: 'Famille de Polices',
    fontFamilySecondary: 'Famille de Polices Secondaire',
    primaryFontSize: 'Taille de Police Primaire',
    secondaryFontSize: 'Taille de Police Secondaire',
    fontSizeXS: 'Taille xs',
    fontSizeSM: 'Taille sm',
    fontSizeMD: 'Taille md',
    fontSizeLG: 'Taille lg',
    fontSizeXL: 'Taille xl',
    brandLogoAlt: 'Logo de Marque',
    iconSetDescription: 'Description du set d\'icônes',
    usage: 'Utilisation',
    version: 'Version',
    autoSpacing: 'Espacement Auto',
    
    // Properties Panel - Traductions françaises
    jsonFormat: 'Format JSON',
    invalidJSON: 'JSON invalide',
    
    // Code Tab - Traductions françaises
    templateValidationFailed: 'La validation du modèle a échoué',
    cssVariablesNote: 'Utilisez les variables CSS comme --color-primary pour le thème',
    onlyComponentSpecificStyles: 'Styles spécifiques au composant uniquement (les design tokens sont injectés automatiquement)',
    
    // Visual Tab - Traductions françaises
    autoView: 'Vue auto',
    angularMaterialIntegration: 'Intégration Angular Material',
    loadingAngular: 'Chargement Angular...',
    templateHelper: 'Assistant de Modèle',
    
    // App.jsx - Traductions françaises
    changesDetected: 'Modifications détectées',
    status: 'Statut',
    
    // Tokens Sidebar - Traductions françaises spécifiques
    removeColorToken: 'Supprimer la couleur {color}',
    removeSpacingToken: 'Supprimer l\'espacement {spacing}',
    
    // Error Messages génériques - Traductions françaises
    failedToLoad: 'Échec du chargement',
    networkError: 'Erreur réseau',
    invalidData: 'Données invalides',
    operationFailed: 'Opération échouée',
    tryAgain: 'Réessayer',
    
    // Success Messages génériques - Traductions françaises
    operationSuccess: 'Opération réussie',
    dataLoaded: 'Données chargées',
    changesSaved: 'Modifications sauvegardées',
    
    // Generic UI - Traductions françaises
    close: 'Fermer',
    open: 'Ouvrir',
    show: 'Afficher',
    hide: 'Masquer',
    expand: 'Développer',
    collapse: 'Réduire',
    next: 'Suivant',
    previous: 'Précédent',
    back: 'Retour',
    continue: 'Continuer',
    finish: 'Terminer',
    apply: 'Appliquer',
    reset: 'Réinitialiser',
    clear: 'Effacer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    new: 'Nouveau',
    edit: 'Modifier',
    update: 'Mettre à jour',
    create: 'Créer',
    remove: 'Supprimer',
    duplicate: 'Dupliquer',
    move: 'Déplacer',
    rename: 'Renommer',
    
    // Time & Dates - Traductions françaises
    now: 'Maintenant',
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    thisWeek: 'Cette semaine',
    lastWeek: 'La semaine dernière',
    thisMonth: 'Ce mois',
    lastMonth: 'Le mois dernier',
    
    // File Operations - Traductions françaises
    upload: 'Télécharger',
    download: 'Télécharger',
    import: 'Importer',
    selectFile: 'Sélectionner un fichier',
    chooseFile: 'Choisir un fichier',
    dropFileHere: 'Déposer le fichier ici',
    fileSelected: 'Fichier sélectionné',
    fileUploaded: 'Fichier téléchargé',
    
    // Numbers & Statistics - Traductions françaises
    total: 'Total',
    count: 'Nombre',
    items: 'Éléments',
    results: 'Résultats',
    noResults: 'Aucun résultat',
    showingResults: 'Affichage de {count} résultats',
    
    // Loading States - Traductions françaises
    pleaseWait: 'Veuillez patienter',
    processing: 'Traitement en cours',
    loadingData: 'Chargement des données',
    savingData: 'Sauvegarde des données',
    
    // Validation - Traductions françaises
    required: 'Requis',
    optional: 'Optionnel',
    invalid: 'Invalide',
    valid: 'Valide',
    fieldRequired: 'Ce champ est requis',
    invalidFormat: 'Format invalide',
    tooShort: 'Trop court',
    tooLong: 'Trop long',
    
    // Notifications - Traductions françaises
    notification: 'Notification',
    warning: 'Avertissement',
    info: 'Info',
    success: 'Succès',
    attention: 'Attention',
    
    // Development/Debug - Traductions françaises
    debug: 'Debug',
    console: 'Console',
    logs: 'Logs',
    test: 'Test',
    development: 'Développement',
    production: 'Production',

    // Textes spécifiques supplémentaires détectés dans le code
    clickMe: 'Cliquez-moi',
    modernButtonComponent: 'Composant Bouton Moderne',
    cardTitle: 'Titre de Carte',
    cardSubtitle: 'Sous-titre de carte',
    cardContent: 'Contenu de carte',
    action: 'Action',
    angularMaterialButton: 'Bouton Angular Material',
    materialDesignColorVariant: 'Variante de couleur Material Design',
    primary: 'Primaire',
    accent: 'Accent',
    warn: 'Attention',
    buttonTextContent: 'Contenu texte du bouton',
    materialIconName: 'Nom d\'icône Material (ex: home, search)',
    leftIcon: 'Icône gauche',
    rightIcon: 'Icône droite',
    disableButtonInteraction: 'Désactiver l\'interaction du bouton',
    angularMaterialInput: 'Champ Angular Material',
    inputFieldLabel: 'Label du champ de saisie',
    enterText: 'Saisir du texte',
    placeholderText: 'Texte de substitution',
    typeSomething: 'Tapez quelque chose...',
    htmlInputType: 'Type de champ HTML',
    email: 'E-mail',
    password: 'Mot de passe',
    number: 'Nombre',
    helperText: 'Texte d\'aide en dessous du champ',
    disableInputInteraction: 'Désactiver l\'interaction du champ',
    markFieldAsRequired: 'Marquer le champ comme requis',
    errorMessageToDisplay: 'Message d\'erreur à afficher',
    angularMaterialCard: 'Carte Angular Material',
    mainCardTitle: 'Titre principal de la carte',
    mainCardContent: 'Contenu principal de la carte',
    thisIsCardContent: 'Ceci est le contenu de la carte. Vous pouvez mettre n\'importe quelle information ici.',
    showActionButtons: 'Afficher les boutons d\'action',
    showPrimaryActionButton: 'Afficher le bouton d\'action principal',
    primaryActionButtonText: 'Texte du bouton d\'action principal',
    showSecondaryActionButton: 'Afficher le bouton d\'action secondaire',
    secondaryActionButtonText: 'Texte du bouton d\'action secondaire',

    // Messages d'erreur spécifiques aux fichiers
    fileMustHaveSvgExtension: 'Le fichier doit avoir une extension .svg',
    fileTypeMustBeSvgXml: 'Le type de fichier doit être image/svg+xml',
    svgFileTooLarge: 'Le fichier SVG est trop volumineux (max 500Ko)',
    fileDoesNotContainValidSvg: 'Le fichier ne contient pas de SVG valide',
    svgFilesWithScriptsNotAllowed: 'Les fichiers SVG avec scripts ne sont pas autorisés',
    unableToReadFileContent: 'Impossible de lire le contenu du fichier',
    unableToGeneratePreview: 'Impossible de générer l\'aperçu',
    unableToLoadImageFromUrl: 'Impossible de charger l\'image depuis l\'URL',

    // Messages de développement et configuration
    generatedOn: 'Généré le',
    at: 'à',
    frameworkIntegrationOptimized: 'Ce design system est optimisé pour',
    quickStart: 'Démarrage Rapide',
    includeFrameworkCssJs: 'Inclure le CSS/JS du framework',
    addDesignSystemCss: 'Ajouter design-system.css',
    startUsingComponents: 'Commencer à utiliser les composants',
    filesIncluded: 'Fichiers Inclus',
    coreDesignTokensUtilities: 'Tokens de design et utilitaires de base',
    allComponentStyles: 'Tous les styles de composants',
    frameworkSpecificIntegration: 'Intégration spécifique au framework',
    everythingCombined: 'Tout combiné',
    supportQuestions: 'Support',
    forQuestionsDocumentation: 'Pour les questions et la documentation, visitez votre documentation de design system.',

    // Messages de logs et développement
    configurationSuccessful: 'Configuration réussie',
    loadingFromServer: 'Chargement depuis le serveur',
    usingDefaults: 'Utilisation des valeurs par défaut',
    mergedWithDefaults: 'Fusionné avec les valeurs par défaut',
    propsUpdatedFromDefinition: 'Props mises à jour depuis la définition',
    propsSchema: 'Schéma des props',
    typeStringBooleanSelectNumber: 'type: "string" | "boolean" | "select" | "number"',
    defaultValue: 'Valeur par défaut',
    arrayForSelectType: 'Tableau (pour le type select)',
    helpTextOptional: 'Texte d\'aide (optionnel)',

    // Textes de l'interface utilisateur manqués
    chooseTemplate: 'Choisir un modèle',
    noSuggestionsAvailable: 'Aucune suggestion disponible',
    loadingTemplate: 'Chargement du modèle',
    newComponentCreated: 'Nouveau composant créé',
    componentDeletedSuccessfully: 'Composant supprimé avec succès',
    componentSavedSuccessfully: 'Composant sauvegardé avec succès',
    tokensSavedSuccessfully: 'Tokens sauvegardés avec succès',
    noDataToSave: 'Aucune donnée à sauvegarder',
    operationCancelled: 'Opération annulée',
    confirmAction: 'Confirmer l\'action',
    actionCannotBeUndone: 'Cette action ne peut pas être annulée',

    // Ajouts pour les textes manqués dans les composants
    componentKey: 'Clé du composant',
    componentPath: 'Chemin du composant',
    categoryIcon: 'Icône de catégorie',
    componentIcon: 'Icône du composant',
    editComponent: 'Modifier le composant',
    viewComponent: 'Voir le composant',
    previewComponent: 'Prévisualiser le composant',
    shareComponent: 'Partager le composant',
    exportComponent: 'Exporter le composant',
    importComponent: 'Importer le composant',
    cloneComponent: 'Cloner le composant',

    // Interface utilisateur additionnelle
    maximize: 'Agrandir',
    minimize: 'Réduire',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    zoomIn: 'Zoom avant',
    zoomOut: 'Zoom arrière',
    resetZoom: 'Réinitialiser le zoom',
    fitToScreen: 'Ajuster à l\'écran',
    actualSize: 'Taille réelle'
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