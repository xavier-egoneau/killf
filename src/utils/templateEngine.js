/**
 * Simple template engine for rendering HTML templates with props
 */

/**
 * Renders a template with given props
 * @param {string} template - HTML template with placeholders like {{propName}}
 * @param {object} props - Props values to inject
 * @returns {string} - Rendered HTML
 */
export const renderTemplate = (template, props = {}) => {
  if (!template) return '';
  
  let rendered = template;
  
  // Replace simple variables: {{propName}}
  rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, propName) => {
    return props[propName] !== undefined ? props[propName] : '';
  });
  
  // Handle conditional blocks: {{#if propName}}content{{/if}}
  rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, propName, content) => {
    return props[propName] ? content : '';
  });
  
  // Handle inverted conditional blocks: {{#unless propName}}content{{/unless}}
  rendered = rendered.replace(/\{\{#unless\s+(\w+)\}\}(.*?)\{\{\/unless\}\}/gs, (match, propName, content) => {
    return !props[propName] ? content : '';
  });
  
  // Handle class conditionals: {{#class propName}}class-name{{/class}}
  rendered = rendered.replace(/\{\{#class\s+(\w+)\}\}(.*?)\{\{\/class\}\}/gs, (match, propName, className) => {
    return props[propName] ? className : '';
  });
  
  // Handle attributes: {{#attr propName}}attribute-name="value"{{/attr}}
  rendered = rendered.replace(/\{\{#attr\s+(\w+)\}\}(.*?)\{\{\/attr\}\}/gs, (match, propName, attribute) => {
    return props[propName] ? attribute : '';
  });
  
  return rendered.trim();
};

/**
 * Generates a default template based on component category and props
 * @param {string} category - Component category (atoms, molecules, etc.)
 * @param {string} componentName - Component name
 * @param {object} props - Props definition
 * @returns {string} - Default template
 */
export const generateDefaultTemplate = (category, componentName, props = {}) => {
  const className = componentName.toLowerCase().replace(/\s+/g, '-');
  
  switch (category) {
    case 'atoms':
      if (componentName.toLowerCase().includes('button')) {
        return `<button class="${className} {{#class variant}}${className}-{{variant}}{{/class}} {{#class size}}${className}-{{size}}{{/class}}" {{#if disabled}}disabled{{/if}}>
  {{text}}
</button>`;
      }
      
      if (componentName.toLowerCase().includes('input')) {
        return `<input 
  type="{{type}}" 
  class="${className}" 
  placeholder="{{placeholder}}"
  {{#if disabled}}disabled{{/if}}
/>`;
      }
      
      return `<div class="${className}">
  {{text}}
</div>`;
    
    case 'molecules':
      return `<div class="${className}">
  {{#if title}}<h3 class="${className}__title">{{title}}</h3>{{/if}}
  {{#if content}}<p class="${className}__content">{{content}}</p>{{/if}}
  {{#if hasButton}}<button class="btn btn-primary">{{buttonText}}</button>{{/if}}
</div>`;
    
    case 'organisms':
      return `<section class="${className}">
  {{#if title}}<h2 class="${className}__title">{{title}}</h2>{{/if}}
  <div class="${className}__content">
    {{content}}
  </div>
</section>`;
    
    case 'templates':
      return `<div class="${className}">
  <header class="${className}__header">
    {{header}}
  </header>
  <main class="${className}__main">
    {{content}}
  </main>
  {{#if showFooter}}<footer class="${className}__footer">{{footer}}</footer>{{/if}}
</div>`;
    
    case 'pages':
      return `<div class="${className}-page">
  {{content}}
</div>`;
    
    default:
      return `<div class="${className}">
  {{content}}
</div>`;
  }
};

/**
 * Extracts prop names from a template
 * @param {string} template - HTML template
 * @returns {string[]} - Array of prop names used in template
 */
export const extractPropsFromTemplate = (template) => {
  if (!template) return [];
  
  const props = new Set();
  
  // Find simple variables: {{propName}}
  const simpleMatches = template.match(/\{\{(\w+)\}\}/g);
  if (simpleMatches) {
    simpleMatches.forEach(match => {
      const propName = match.replace(/\{\{|\}\}/g, '');
      props.add(propName);
    });
  }
  
  // Find conditional variables: {{#if propName}}
  const conditionalMatches = template.match(/\{\{#(?:if|unless|class|attr)\s+(\w+)\}\}/g);
  if (conditionalMatches) {
    conditionalMatches.forEach(match => {
      const propName = match.replace(/\{\{#(?:if|unless|class|attr)\s+|\}\}/g, '');
      props.add(propName);
    });
  }
  
  return Array.from(props);
};

/**
 * Validates if a template is syntactically correct
 * @param {string} template - HTML template to validate
 * @returns {object} - {isValid: boolean, errors: string[]}
 */
export const validateTemplate = (template) => {
  const errors = [];
  
  if (!template) {
    return { isValid: true, errors: [] };
  }
  
  // Check for unmatched opening/closing tags
  const openingTags = (template.match(/\{\{#\w+/g) || []).length;
  const closingTags = (template.match(/\{\{\/\w+\}\}/g) || []).length;
  
  if (openingTags !== closingTags) {
    errors.push('Unmatched opening/closing template tags');
  }
  
  // Check for invalid syntax
  const invalidSyntax = template.match(/\{\{[^}]*[^}]\{|\}[^{]*[^{]\}\}/g);
  if (invalidSyntax) {
    errors.push('Invalid template syntax detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Preview template with sample data
 * @param {string} template - HTML template
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