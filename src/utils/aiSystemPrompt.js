/**
 * Système de prompts et règles pour l'IA
 * Définit les conventions du projet, naming, patterns, etc.
 */

/**
 * Règles générales du projet
 */
export const PROJECT_RULES = {
  // Naming conventions
  naming: {
    components: {
      pattern: 'PascalCase pour les noms, kebab-case pour les IDs',
      examples: {
        correct: ['Modern Button → modern-button', 'User Card → user-card'],
        incorrect: ['modernButton', 'Modern_Button', 'MODERN-BUTTON']
      },
      rules: [
        'Noms descriptifs et explicites',
        'Éviter les abréviations sauf si évidentes',
        'Utiliser des termes métier quand approprié',
        'Préfixer les composants complexes (ex: "Advanced Search Form")'
      ]
    },
    cssClasses: {
      pattern: 'BEM methodology + design tokens',
      examples: {
        correct: ['.btn', '.btn--primary', '.btn__icon', '.card', '.card__header'],
        incorrect: ['.button1', '.redButton', '.big-card-with-shadow']
      },
      rules: [
        'Bloc: .component-name',
        'Element: .component__element',
        'Modifier: .component--modifier',
        'Utiliser les tokens CSS: var(--color-primary)',
        'Classes utilitaires: .p-md, .text-primary'
      ]
    },
    variables: {
      pattern: 'CSS Custom Properties avec préfixes',
      examples: {
        colors: '--color-primary, --color-success',
        spacing: '--spacing-xs, --spacing-lg',
        typography: '--font-family, --font-lg'
      }
    }
  },

  // Architecture patterns
  architecture: {
    atomicDesign: {
      atoms: {
        description: 'Éléments UI de base non décomposables',
        examples: ['Button', 'Input', 'Label', 'Icon', 'Avatar'],
        rules: [
          'Un seul élément HTML principal',
          'Props simples et claires',
          'Réutilisable partout',
          'Pas de logique métier'
        ]
      },
      molecules: {
        description: 'Groupes simples d\'atomes',
        examples: ['SearchBox', 'FormField', 'Card', 'AlertBox'],
        rules: [
          'Combine 2-4 atomes',
          'Fonction spécifique et claire',
          'Props orientées données',
          'Logique simple'
        ]
      },
      organisms: {
        description: 'Sections complexes d\'interface',
        examples: ['Navbar', 'Header', 'ProductList', 'UserProfile'],
        rules: [
          'Combine molécules et atomes',
          'Représente une section métier',
          'Peut contenir de la logique',
          'Réutilisable dans différents contextes'
        ]
      },
      templates: {
        description: 'Structure et layout des pages',
        examples: ['PageLayout', 'DashboardLayout', 'AuthLayout'],
        rules: [
          'Définit la structure générale',
          'Slots pour le contenu',
          'Responsive design',
          'Pas de contenu spécifique'
        ]
      },
      pages: {
        description: 'Instances complètes avec données',
        examples: ['HomePage', 'UserDashboard', 'ProductDetail'],
        rules: [
          'Template + contenu spécifique',
          'Gestion des données',
          'États de loading/error',
          'SEO et métadonnées'
        ]
      }
    }
  },

  // Code quality
  codeQuality: {
    props: {
      rules: [
        'Valeurs par défaut pour toutes les props',
        'Types explicites (string, boolean, select)',
        'Descriptions claires',
        'Options limitées pour les selects',
        'Props nommées de manière intuitive'
      ],
      examples: {
        good: {
          variant: {
            type: 'select',
            options: ['primary', 'secondary', 'danger'],
            default: 'primary',
            description: 'Visual style variant'
          }
        },
        bad: {
          v: {
            type: 'string',
            default: 'p'
          }
        }
      }
    },
    css: {
      rules: [
        'Utiliser les design tokens (variables CSS)',
        'Mobile-first responsive design',
        'Prefixer les classes par le nom du composant',
        'États hover, focus, disabled',
        'Transitions fluides',
        'Accessibilité (focus visible, contraste)'
      ],
      patterns: [
        'Utiliser color-mix() pour les variations',
        'calc() pour les espacements relatifs',
        'clamp() pour la typographie responsive',
        ':where() pour réduire la spécificité'
      ]
    },
    templates: {
      rules: [
        'HTML sémantique',
        'Structure logique et accessible',
        'Classes conditionnelles avec {{#if}}',
        'Attributs ARIA quand nécessaire',
        'Performance (lazy loading, etc.)'
      ],
      patterns: [
        'Twig syntax: {{variable}} pour les valeurs',
        '{% if condition %} pour les conditions',
        'Classes: class="base {% if variant %}base--{{variant}}{% endif %}"',
        'Attributs dynamiques: {% if disabled %}disabled{% endif %}'
      ]
    }
  },

  // Accessibility
  accessibility: {
    rules: [
      'Contraste minimum WCAG AA (4.5:1)',
      'Focus visible sur tous les éléments interactifs',
      'Utilisation appropriée des landmarks',
      'Labels et descriptions pour les éléments de formulaire',
      'États des composants communiqués aux lecteurs d\'écran'
    ],
    patterns: [
      'aria-label pour les boutons sans texte',
      'role="button" pour les éléments non-button interactifs',
      'aria-expanded pour les éléments collapsibles',
      'aria-describedby pour les descriptions',
      'tabindex="-1" pour les éléments non-focusables'
    ]
  },

  // Performance
  performance: {
    rules: [
      'CSS optimisé (pas de sélecteurs trop spécifiques)',
      'Images optimisées et responsive',
      'Lazy loading pour le contenu non-critique',
      'Éviter les animations coûteuses',
      'Utiliser transform au lieu de changer layout'
    ]
  }
};

/**
 * Règles spécifiques par framework
 */
export const FRAMEWORK_RULES = {
  tailwind: {
    naming: {
      pattern: 'Utiliser les classes Tailwind + custom properties',
      examples: [
        'bg-primary au lieu de bg-blue-500',
        'p-md au lieu de p-4',
        'text-primary au lieu de text-blue-600'
      ]
    },
    patterns: [
      'Utiliser @apply pour grouper les utilitaires',
      'Custom properties pour les couleurs du design system',
      'Responsive prefixes: sm:, md:, lg:',
      'States: hover:, focus:, disabled:'
    ],
    conventions: [
      'Classes dans l\'ordre: layout → spacing → colors → typography → effects',
      'Éviter les valeurs arbitraires sauf cas spéciaux',
      'Utiliser les modifiers de couleur opacity',
      'Grouper les classes similaires'
    ]
  },

  bootstrap: {
    naming: {
      pattern: 'Classes Bootstrap + variables CSS custom',
      examples: [
        'btn btn-primary au lieu de button',
        'card au lieu de panel',
        'form-control au lieu de input'
      ]
    },
    patterns: [
      'Utiliser les composants Bootstrap existants',
      'Override avec des variables CSS',
      'Classes utilitaires: p-3, m-2, text-center',
      'Grid system: container, row, col-*'
    ],
    conventions: [
      'Préfixer les customs avec le nom du projet',
      'Utiliser les breakpoints Bootstrap',
      'Respecter la hiérarchie des composants',
      'Ne pas surcharger les styles de base'
    ]
  },

  angular: {
    naming: {
      pattern: 'Material Design + Angular conventions',
      examples: [
        'mat-button au lieu de button',
        'mat-card au lieu de card',
        'mat-form-field pour les inputs'
      ]
    },
    patterns: [
      'Utiliser les composants Material existants',
      'Theming avec Angular Material',
      'Custom selectors avec préfixe',
      'ViewEncapsulation pour l\'isolation'
    ],
    conventions: [
      'Suivre les guidelines Material Design',
      'Utiliser les élévations standard',
      'Respecter les spacings Material',
      'Animations Material standard'
    ]
  },

  vanilla: {
    naming: {
      pattern: 'BEM + design tokens CSS',
      examples: [
        '.btn, .btn--primary, .btn__icon',
        '.card, .card__header, .card--elevated',
        'Utiliser var(--color-primary)'
      ]
    },
    patterns: [
      'CSS moderne (grid, flexbox, custom properties)',
      'Progressive enhancement',
      'Fallbacks pour les anciennes versions',
      'Modularité et réutilisabilité'
    ],
    conventions: [
      'Mobile-first media queries',
      'Logical properties (margin-inline)',
      'Cascade layers (@layer) si supporté',
      'Container queries pour les composants'
    ]
  }
};

/**
 * Templates de prompts par type de demande
 */
export const AI_PROMPT_TEMPLATES = {
  createComponent: {
    system: `Tu es un expert en design systems et développement frontend. Tu suis ces règles strictement :

NAMING:
${PROJECT_RULES.naming.components.rules.join('\n')}

ARCHITECTURE:
Tu travailles avec l'Atomic Design. Voici les règles par niveau :
{ATOMIC_RULES}

FRAMEWORK:
Le projet utilise {FRAMEWORK_NAME} {FRAMEWORK_VERSION}. Règles spécifiques :
{FRAMEWORK_RULES}

CODE QUALITY:
${PROJECT_RULES.codeQuality.props.rules.join('\n')}

ACCESSIBILITÉ:
${PROJECT_RULES.accessibility.rules.join('\n')}`,

    user: `Crée un composant {COMPONENT_TYPE} pour {COMPONENT_NAME}.

CONTEXTE:
- Framework: {FRAMEWORK_NAME}
- Design tokens disponibles: {AVAILABLE_TOKENS}
- Composants existants: {EXISTING_COMPONENTS}

DEMANDE:
{USER_REQUEST}

RÉPONDS avec :
1. Props JSON (format exact pour copy-paste)
2. Template HTML (avec Twig syntax)
3. CSS/SCSS (avec design tokens)
4. Explication des choix
`
  },

  improveComponent: {
    system: `Tu améliores un composant existant en suivant les règles du projet.`,
    user: `Améliore ce composant :

COMPOSANT ACTUEL:
- Nom: {COMPONENT_NAME}
- Props: {CURRENT_PROPS}
- Template: {CURRENT_TEMPLATE}
- CSS: {CURRENT_CSS}

AMÉLIORATION DEMANDÉE:
{IMPROVEMENT_REQUEST}

Fournis le code mis à jour en respectant les conventions.`
  },

  createPage: {
    system: `Tu crées des pages complètes en utilisant les composants existants du design system.`,
    user: `Crée une page {PAGE_TYPE} en utilisant ces composants :

COMPOSANTS DISPONIBLES:
{AVAILABLE_COMPONENTS_WITH_TEMPLATES}

PAGE DEMANDÉE:
{PAGE_DESCRIPTION}

Fournis le HTML en utilisant les composants avec leurs props.`
  }
};

/**
 * Générateur de prompt système contextualisé
 */
export const generateSystemPrompt = (tokens, components, requestType = 'createComponent') => {
  const framework = tokens.framework;
  const frameworkRules = FRAMEWORK_RULES[framework.type] || FRAMEWORK_RULES.vanilla;
  const template = AI_PROMPT_TEMPLATES[requestType];
  
  const atomicRules = Object.entries(PROJECT_RULES.architecture.atomicDesign)
    .map(([level, config]) => `${level.toUpperCase()}: ${config.description}\n${config.rules.join('\n')}`)
    .join('\n\n');

  return template.system
    .replace('{ATOMIC_RULES}', atomicRules)
    .replace('{FRAMEWORK_NAME}', frameworkRules.naming?.pattern || framework.type)
    .replace('{FRAMEWORK_VERSION}', framework.version)
    .replace('{FRAMEWORK_RULES}', frameworkRules.patterns?.join('\n') || 'Pas de règles spécifiques');
};

/**
 * Générateur de prompt utilisateur contextualisé
 */
export const generateUserPrompt = (tokens, components, requestType, userRequest, componentData = {}) => {
  const template = AI_PROMPT_TEMPLATES[requestType];
  const framework = tokens.framework;
  
  // Tokens disponibles
  const availableTokens = {
    colors: Object.keys(tokens.colors),
    spacing: Object.keys(tokens.spacing),
    typography: Object.keys(tokens.typography.sizes)
  };

  // Composants existants simplifiés
  const existingComponents = Object.entries(components)
    .map(([category, comps]) => 
      `${category}: ${Object.keys(comps).join(', ')}`
    )
    .join(' | ');

  // Composants avec templates (pour créer des pages)
  const componentsWithTemplates = Object.entries(components)
    .flatMap(([category, comps]) => 
      Object.entries(comps)
        .filter(([key, comp]) => comp.template)
        .map(([key, comp]) => ({
          name: comp.name,
          key: key,
          category: category,
          props: Object.keys(comp.props || {}),
          template: comp.template.substring(0, 200) + '...'
        }))
    );

  let prompt = template.user
    .replace('{FRAMEWORK_NAME}', framework.type)
    .replace('{FRAMEWORK_VERSION}', framework.version)
    .replace('{AVAILABLE_TOKENS}', JSON.stringify(availableTokens, null, 2))
    .replace('{EXISTING_COMPONENTS}', existingComponents)
    .replace('{USER_REQUEST}', userRequest);

  // Remplacements spécifiques par type
  if (requestType === 'createComponent') {
    prompt = prompt
      .replace('{COMPONENT_TYPE}', componentData.category || 'composant')
      .replace('{COMPONENT_NAME}', componentData.name || 'nouveau composant');
  }

  if (requestType === 'improveComponent') {
    prompt = prompt
      .replace('{COMPONENT_NAME}', componentData.name || '')
      .replace('{CURRENT_PROPS}', JSON.stringify(componentData.props || {}, null, 2))
      .replace('{CURRENT_TEMPLATE}', componentData.template || '')
      .replace('{CURRENT_CSS}', componentData.css || '')
      .replace('{IMPROVEMENT_REQUEST}', userRequest);
  }

  if (requestType === 'createPage') {
    prompt = prompt
      .replace('{PAGE_TYPE}', componentData.pageType || 'page')
      .replace('{AVAILABLE_COMPONENTS_WITH_TEMPLATES}', 
        JSON.stringify(componentsWithTemplates, null, 2))
      .replace('{PAGE_DESCRIPTION}', userRequest);
  }

  return prompt;
};

/**
 * Validation des règles sur un composant
 */
export const validateComponent = (component, framework) => {
  const errors = [];
  const warnings = [];

  // Validation du naming
  if (component.name) {
    const namePattern = /^[A-Z][a-zA-Z\s]*$/;
    if (!namePattern.test(component.name)) {
      errors.push('Le nom du composant doit être en PascalCase avec des espaces');
    }
  }

  // Validation des props
  if (component.props) {
    Object.entries(component.props).forEach(([key, prop]) => {
      if (!prop.default) {
        warnings.push(`Prop "${key}" n'a pas de valeur par défaut`);
      }
      if (!prop.description) {
        warnings.push(`Prop "${key}" n'a pas de description`);
      }
      if (prop.type === 'select' && (!prop.options || prop.options.length === 0)) {
        errors.push(`Prop select "${key}" n'a pas d'options`);
      }
    });
  }

  // Validation CSS
  if (component.scss) {
    if (!component.scss.includes('var(--')) {
      warnings.push('Le CSS n\'utilise pas les design tokens (var(--...))');
    }
  }

  return { errors, warnings, isValid: errors.length === 0 };
};

/**
 * Suggestions d'amélioration
 */
export const getSuggestions = (component, tokens, framework) => {
  const suggestions = [];

  // Suggestions basées sur le framework
  const frameworkRules = FRAMEWORK_RULES[framework.type];
  if (frameworkRules) {
    suggestions.push({
      type: 'framework',
      title: `Optimisation ${framework.type}`,
      suggestions: frameworkRules.conventions || []
    });
  }

  // Suggestions d'accessibilité
  if (component.template && !component.template.includes('aria-')) {
    suggestions.push({
      type: 'accessibility',
      title: 'Améliorer l\'accessibilité',
      suggestions: [
        'Ajouter des attributs ARIA appropriés',
        'Vérifier le contraste des couleurs',
        'Assurer une navigation au clavier'
      ]
    });
  }

  return suggestions;
};