/**
 * Generates AI-friendly documentation from design system
 */
export const generateAIPrompt = (tokens, components) => {
  // Generate component listings by category
  const getComponentsByCategory = (category) => {
    return Object.entries(components[category] || {})
      .map(([key, comp]) => `- ${comp.name} (${Object.keys(comp.props).join(', ')})`)
      .join('\n');
  };

  const atomComponents = getComponentsByCategory('atoms');
  const moleculeComponents = getComponentsByCategory('molecules');
  const organismComponents = getComponentsByCategory('organisms');
  const templateComponents = getComponentsByCategory('templates');
  const pageComponents = getComponentsByCategory('pages');

  return `# Complete Design System Export for AI

## Design Tokens
### Colors
- Primary: ${tokens.colors.primary}
- Secondary: ${tokens.colors.secondary}
- Success: ${tokens.colors.success}
- Danger: ${tokens.colors.danger}

### Spacing Scale
- XS: ${tokens.spacing.xs}, SM: ${tokens.spacing.sm}, MD: ${tokens.spacing.md}, LG: ${tokens.spacing.lg}, XL: ${tokens.spacing.xl}

### Typography
- Font Family: ${tokens.typography.fontFamily}
- Sizes: SM: ${tokens.typography.sizes.sm}, MD: ${tokens.typography.sizes.md}, LG: ${tokens.typography.sizes.lg}, XL: ${tokens.typography.sizes.xl}

## Available Components by Hierarchy

### Atoms (Basic UI Elements)
${atomComponents}

### Molecules (Simple Component Groups)
${moleculeComponents}

### Organisms (Complex UI Sections)
${organismComponents}

### Templates (Page Layouts)
${templateComponents}

### Pages (Complete Views)
${pageComponents}

## Component Usage Guidelines
1. **Atoms**: Use for basic interactions (buttons, inputs, text)
2. **Molecules**: Use for simple UI patterns (cards, form fields)
3. **Organisms**: Use for major page sections (headers, product lists)
4. **Templates**: Use for defining page structure and layout
5. **Pages**: Use for complete user experiences

## Instructions for AI
Create interfaces using components from this design system. Always:
- Respect the atomic design hierarchy
- Use defined design tokens for consistency
- Ensure accessibility and responsive design
- Structure HTML using our component classes

## Example Usage
\`\`\`html
<!-- Organism: Header -->
<header class="header">
  <h1 class="header-title">My App</h1>
  <nav class="header-nav">
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
  </nav>
  <button class="btn btn-primary btn-md">Sign Up</button>
</header>

<!-- Template: Landing Page -->
<main class="landing-page">
  <section class="hero centered">
    <h2>Welcome to our platform</h2>
    <button class="btn btn-primary btn-lg">Get Started</button>
  </section>
</main>
\`\`\`

Your request: [USER_PROMPT_HERE]`;
};

/**
 * Generates component-specific documentation
 */
export const generateComponentDocs = (componentKey, component, tokens) => {
  const propsList = Object.entries(component.props)
    .map(([key, config]) => `- **${key}**: ${config.type} (default: ${config.default})`)
    .join('\n');

  return `# ${component.name} Component

## Description
${component.category.charAt(0).toUpperCase() + component.category.slice(1)} level component.

## Props
${propsList}

## SCSS
\`\`\`scss
${component.scss}
\`\`\`

## Usage Example
\`\`\`html
<div class="${componentKey}">
  <!-- Component markup here -->
</div>
\`\`\`
`;
};

/**
 * Generates design tokens documentation
 */
export const generateTokensDocs = (tokens) => {
  return `# Design Tokens

## Colors
${Object.entries(tokens.colors)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}

## Spacing
${Object.entries(tokens.spacing)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}

## Typography
- **Font Family**: ${tokens.typography.fontFamily}

### Font Sizes
${Object.entries(tokens.typography.sizes)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}
`;
};