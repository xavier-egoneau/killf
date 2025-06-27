// data/angularExamples.js - Exemples de composants Angular simplifiés

export const angularExampleComponents = {
  atoms: {
    'angular-button': {
      name: 'Angular Material Button',
      category: 'atoms',
      template: `<button mat-raised-button color="{{ variant }}"{% if disabled %} disabled{% endif %}>
  {% if iconLeft %}<span class="material-icons">{{ iconLeft }}</span>{% endif %}
  {{ text }}
  {% if iconRight %}<span class="material-icons">{{ iconRight }}</span>{% endif %}
</button>`,
      props: {
        variant: {
          type: 'select',
          options: ['primary', 'accent', 'warn'],
          default: 'primary',
          description: 'Material Design color variant'
        },
        text: {
          type: 'string',
          default: 'Click Me',
          description: 'Button text content'
        },
        iconLeft: {
          type: 'string',
          default: '',
          description: 'Material icon name for left icon (e.g., home, search)'
        },
        iconRight: {
          type: 'string',
          default: '',
          description: 'Material icon name for right icon'
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable button interaction'
        }
      },
      scss: `
.mat-raised-button {
  font-family: var(--font-family);
  font-weight: 500;
  text-transform: uppercase;
}

.mat-raised-button .material-icons {
  font-size: 18px;
  margin: 0 4px;
  vertical-align: middle;
}

.mat-raised-button[color="primary"] {
  background-color: var(--color-primary);
  color: white;
}

.mat-raised-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
      `
    },

    'angular-input': {
      name: 'Angular Material Input',
      category: 'atoms',
      template: `<div class="mat-form-field">
  {% if label %}<label class="mat-label">{{ label }}</label>{% endif %}
  <input type="{{ inputType }}" 
         placeholder="{{ placeholder }}"
         {% if disabled %}disabled{% endif %}
         {% if required %}required{% endif %}
         class="mat-input">
  {% if hint %}<div class="mat-hint">{{ hint }}</div>{% endif %}
  {% if errorMessage %}<div class="mat-error">{{ errorMessage }}</div>{% endif %}
</div>`,
      props: {
        label: {
          type: 'string',
          default: 'Enter text',
          description: 'Input field label'
        },
        placeholder: {
          type: 'string',
          default: 'Type something...',
          description: 'Placeholder text'
        },
        inputType: {
          type: 'select',
          options: ['text', 'email', 'password', 'number'],
          default: 'text',
          description: 'HTML input type'
        },
        hint: {
          type: 'string',
          default: '',
          description: 'Helper text below the input'
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable input interaction'
        },
        required: {
          type: 'boolean',
          default: false,
          description: 'Mark field as required'
        },
        errorMessage: {
          type: 'string',
          default: '',
          description: 'Error message to display'
        }
      },
      scss: `
.mat-form-field {
  width: 100%;
  margin: 8px 0;
  font-family: var(--font-family);
}

.mat-label {
  color: var(--color-primary);
  font-size: var(--font-sm);
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.mat-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: var(--font-md);
  transition: border-color 0.2s;
}

.mat-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.mat-hint {
  font-size: var(--font-sm);
  color: #666;
  margin-top: 4px;
}

.mat-error {
  font-size: var(--font-sm);
  color: var(--color-danger);
  margin-top: 4px;
}
      `
    }
  },

  molecules: {
    'angular-card': {
      name: 'Angular Material Card',
      category: 'molecules',
      template: `<div class="mat-card">
  {% if title or subtitle %}
    <div class="mat-card-header">
      {% if title %}<h3 class="mat-card-title">{{ title }}</h3>{% endif %}
      {% if subtitle %}<p class="mat-card-subtitle">{{ subtitle }}</p>{% endif %}
    </div>
  {% endif %}
  
  {% if content %}
    <div class="mat-card-content">
      <p>{{ content }}</p>
    </div>
  {% endif %}
  
  {% if showActions %}
    <div class="mat-card-actions">
      {% if primaryAction %}
        <button mat-raised-button color="primary">{{ primaryActionText }}</button>
      {% endif %}
      {% if secondaryAction %}
        <button mat-raised-button>{{ secondaryActionText }}</button>
      {% endif %}
    </div>
  {% endif %}
</div>`,
      props: {
        title: {
          type: 'string',
          default: 'Card Title',
          description: 'Main card title'
        },
        subtitle: {
          type: 'string',
          default: 'Card subtitle',
          description: 'Card subtitle'
        },
        content: {
          type: 'string',
          default: 'This is the card content. You can put any information here.',
          description: 'Main card content'
        },
        showActions: {
          type: 'boolean',
          default: true,
          description: 'Show action buttons'
        },
        primaryAction: {
          type: 'boolean',
          default: true,
          description: 'Show primary action button'
        },
        primaryActionText: {
          type: 'string',
          default: 'Action',
          description: 'Primary action button text'
        },
        secondaryAction: {
          type: 'boolean',
          default: true,
          description: 'Show secondary action button'
        },
        secondaryActionText: {
          type: 'string',
          default: 'Cancel',
          description: 'Secondary action button text'
        }
      },
      scss: `
.mat-card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 
              0 1px 1px 0 rgba(0,0,0,0.14), 
              0 1px 3px 0 rgba(0,0,0,0.12);
  margin: 8px 0;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.mat-card:hover {
  box-shadow: 0 4px 5px -2px rgba(0,0,0,0.2), 
              0 7px 10px 1px rgba(0,0,0,0.14), 
              0 2px 16px 1px rgba(0,0,0,0.12);
}

.mat-card-header {
  padding: 16px 16px 0;
}

.mat-card-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: var(--color-primary);
}

.mat-card-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.mat-card-content {
  padding: 16px;
  color: rgba(0,0,0,0.7);
  line-height: 1.5;
}

.mat-card-actions {
  padding: 8px 16px 16px;
  display: flex;
  gap: 8px;
}
      `
    }
  }
};

// Fonction pour ajouter les composants Angular au design system
export const addAngularExamplesToComponents = (existingComponents) => {
  const mergedComponents = { ...existingComponents };
  
  Object.entries(angularExampleComponents).forEach(([category, components]) => {
    if (!mergedComponents[category]) {
      mergedComponents[category] = {};
    }
    
    Object.entries(components).forEach(([key, component]) => {
      mergedComponents[category][key] = component;
    });
  });
  
  return mergedComponents;
};

// Template de création rapide pour Angular
export const getAngularQuickTemplate = (componentType) => {
  const templates = {
    button: angularExampleComponents.atoms['angular-button'].template,
    input: angularExampleComponents.atoms['angular-input'].template,
    card: angularExampleComponents.molecules['angular-card'].template
  };
  
  return templates[componentType] || templates.button;
};

// Props par défaut pour Angular
export const getAngularQuickProps = (componentType) => {
  const propsMap = {
    button: angularExampleComponents.atoms['angular-button'].props,
    input: angularExampleComponents.atoms['angular-input'].props,
    card: angularExampleComponents.molecules['angular-card'].props
  };
  
  return propsMap[componentType] || propsMap.button;
};