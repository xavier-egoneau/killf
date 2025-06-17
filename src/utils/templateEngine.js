/**
 * Template engine using Twig.js - More robust than custom regex
 * 
 * Add this to your HTML head:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/twig.js/1.15.4/twig.min.js"></script>
 */

/**
 * Renders a Twig template with given props
 * @param {string} template - Twig template string
 * @param {object} props - Props values to inject
 * @returns {string} - Rendered HTML
 */
export const renderTemplate = (template, props = {}) => {
  if (!template) return '';
  
  try {
    // Check if Twig is available (loaded via CDN)
    if (typeof window !== 'undefined' && window.Twig) {
      const twigTemplate = window.Twig.twig({
        data: template
      });
      return twigTemplate.render(props);
    } else {
      console.warn('Twig.js not loaded, falling back to basic template rendering');
      return fallbackRender(template, props);
    }
  } catch (error) {
    console.error('Twig template rendering error:', error);
    return fallbackRender(template, props);
  }
};

/**
 * Fallback renderer for basic variable replacement (if Twig.js fails)
 */
const fallbackRender = (template, props = {}) => {
  let rendered = template;
  
  // Simple variable replacement: {{ propName }}
  rendered = rendered.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, propName) => {
    return props[propName] !== undefined ? props[propName] : '';
  });
  
  return rendered;
};

/**
 * Generates a default Twig template based on component category and props
 * @param {string} category - Component category (atoms, molecules, etc.)
 * @param {string} componentName - Component name
 * @param {object} props - Props definition
 * @returns {string} - Default Twig template
 */
export const generateDefaultTemplate = (category, componentName, props = {}) => {
  const className = componentName.toLowerCase().replace(/\s+/g, '-');
  
  switch (category) {
    case 'atoms':
      if (componentName.toLowerCase().includes('button')) {
        return `<button class="${className}{% if variant %} ${className}-{{ variant }}{% endif %}{% if size %} ${className}-{{ size }}{% endif %}"{% if disabled %} disabled{% endif %}>
  {% if iconLeft %}<span class="btn-icon btn-icon-left">{{ iconLeft }}</span>{% endif %}
  {% if text %}<span class="btn-text">{{ text }}</span>{% endif %}
  {% if iconRight %}<span class="btn-icon btn-icon-right">{{ iconRight }}</span>{% endif %}
</button>`;
      }
      
      if (componentName.toLowerCase().includes('input')) {
        return `<input type="{{ type|default('text') }}" 
  class="${className}" 
  placeholder="{{ placeholder }}"
  {% if disabled %}disabled{% endif %} />`;
      }
      
      return `<div class="${className}">{{ text }}</div>`;
    
    case 'molecules':
      return `<div class="${className}">
  {% if title %}<h3 class="${className}__title">{{ title }}</h3>{% endif %}
  {% if content %}<p class="${className}__content">{{ content }}</p>{% endif %}
  {% if hasButton %}<button class="btn btn-primary">{{ buttonText|default('Action') }}</button>{% endif %}
</div>`;
    
    case 'organisms':
      return `<section class="${className}">
  {% if title %}<h2 class="${className}__title">{{ title }}</h2>{% endif %}
  <div class="${className}__content">
    {{ content }}
  </div>
</section>`;
    
    case 'templates':
      return `<div class="${className}">
  <header class="${className}__header">{{ header }}</header>
  <main class="${className}__main">{{ content }}</main>
  {% if showFooter %}<footer class="${className}__footer">{{ footer }}</footer>{% endif %}
</div>`;
    
    case 'pages':
      return `<div class="${className}-page">{{ content }}</div>`;
    
    default:
      return `<div class="${className}">{{ content }}</div>`;
  }
};

/**
 * Converts old template syntax to Twig syntax
 * @param {string} oldTemplate - Template with custom syntax
 * @returns {string} - Twig-compatible template
 */
export const convertToTwigSyntax = (oldTemplate) => {
  if (!oldTemplate) return '';
  
  let twigTemplate = oldTemplate;
  
  // Convert {{#if prop}} to {% if prop %}
  twigTemplate = twigTemplate.replace(/\{\{#if\s+(\w+)\}\}/g, '{% if $1 %}');
  
  // Convert {{/if}} to {% endif %}
  twigTemplate = twigTemplate.replace(/\{\{\/if\}\}/g, '{% endif %}');
  
  // Convert {{#unless prop}} to {% if not prop %}
  twigTemplate = twigTemplate.replace(/\{\{#unless\s+(\w+)\}\}/g, '{% if not $1 %}');
  
  // Convert {{/unless}} to {% endif %}
  twigTemplate = twigTemplate.replace(/\{\{\/unless\}\}/g, '{% endif %}');
  
  // Convert {{#class prop}}class-name{{/class}} to {% if prop %}class-name{% endif %}
  twigTemplate = twigTemplate.replace(/\{\{#class\s+(\w+)\}\}([^{]+)\{\{\/class\}\}/g, '{% if $1 %}$2{% endif %}');
  
  // Variables remain the same: {{prop}} stays {{prop}}
  
  return twigTemplate;
};

/**
 * Extracts prop names from a Twig template
 * @param {string} template - Twig template
 * @returns {string[]} - Array of prop names used in template
 */
export const extractPropsFromTemplate = (template) => {
  if (!template) return [];
  
  const props = new Set();
  
  // Find Twig variables: {{ propName }}
  const variableMatches = template.match(/\{\{\s*(\w+)\s*(?:\|[^}]*)?\}\}/g);
  if (variableMatches) {
    variableMatches.forEach(match => {
      const propMatch = match.match(/\{\{\s*(\w+)/);
      if (propMatch) {
        props.add(propMatch[1]);
      }
    });
  }
  
  // Find Twig conditions: {% if propName %}
  const conditionMatches = template.match(/\{%\s*if\s+(?:not\s+)?(\w+)\s*%\}/g);
  if (conditionMatches) {
    conditionMatches.forEach(match => {
      const propMatch = match.match(/\{%\s*if\s+(?:not\s+)?(\w+)/);
      if (propMatch) {
        props.add(propMatch[1]);
      }
    });
  }
  
  return Array.from(props);
};

/**
 * Validates if a Twig template is syntactically correct
 * @param {string} template - Twig template to validate
 * @returns {object} - {isValid: boolean, errors: string[]}
 */
export const validateTemplate = (template) => {
  const errors = [];
  
  if (!template) {
    return { isValid: true, errors: [] };
  }
  
  try {
    // Try to compile with Twig.js if available
    if (typeof window !== 'undefined' && window.Twig) {
      window.Twig.twig({
        data: template
      });
      return { isValid: true, errors: [] };
    }
  } catch (error) {
    errors.push(`Twig syntax error: ${error.message}`);
  }
  
  // Basic validation checks
  const openingTags = (template.match(/\{%\s*if/g) || []).length;
  const closingTags = (template.match(/\{%\s*endif/g) || []).length;
  
  if (openingTags !== closingTags) {
    errors.push('Unmatched {% if %} / {% endif %} tags');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Preview template with sample data
 * @param {string} template - Twig template
 * @param {object} propsDefinition - Props definition with defaults
 * @returns {string} - Rendered template with default values
 */
export const previewTemplate = (template, propsDefinition = {}) => {
  const sampleProps = {};
  
  // Use default values from props definition
  Object.entries(propsDefinition).forEach(([key, config]) => {
    sampleProps[key] = config.default;
  });
  
  return renderTemplate(template, sampleProps);
};