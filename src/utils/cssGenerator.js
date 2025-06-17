/**
 * Generates CSS custom properties from design tokens
 */
export const generateCSSVariables = (tokens) => {
  return `:root {
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  --color-success: ${tokens.colors.success};
  --color-danger: ${tokens.colors.danger};
  
  --spacing-xs: ${tokens.spacing.xs};
  --spacing-sm: ${tokens.spacing.sm};
  --spacing-md: ${tokens.spacing.md};
  --spacing-lg: ${tokens.spacing.lg};
  --spacing-xl: ${tokens.spacing.xl};
  
  --font-family: ${tokens.typography.fontFamily};
  --font-sm: ${tokens.typography.sizes.sm};
  --font-md: ${tokens.typography.sizes.md};
  --font-lg: ${tokens.typography.sizes.lg};
  --font-xl: ${tokens.typography.sizes.xl};
}`;
};

/**
 * Generates complete CSS output for the design system
 */
export const generateCompleteCSS = (tokens, components) => {
  const variables = generateCSSVariables(tokens);
  
  const componentStyles = Object.values(components)
    .flatMap(category => Object.values(category))
    .map(component => component.scss)
    .join('\n\n');
  
  return `${variables}\n\n${componentStyles}`;
};

/**
 * Generates CSS class utilities based on tokens
 */
export const generateUtilityClasses = (tokens) => {
  const spacingClasses = Object.entries(tokens.spacing)
    .map(([key, value]) => `
.p-${key} { padding: ${value}; }
.m-${key} { margin: ${value}; }
.px-${key} { padding-left: ${value}; padding-right: ${value}; }
.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }
.mx-${key} { margin-left: ${value}; margin-right: ${value}; }
.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }`)
    .join('');

  const colorClasses = Object.entries(tokens.colors)
    .map(([key, value]) => `
.text-${key} { color: ${value}; }
.bg-${key} { background-color: ${value}; }
.border-${key} { border-color: ${value}; }`)
    .join('');

  const typographyClasses = Object.entries(tokens.typography.sizes)
    .map(([key, value]) => `
.text-${key} { font-size: ${value}; }`)
    .join('');

  return `
/* Utility Classes */
${spacingClasses}
${colorClasses}
${typographyClasses}
.font-family { font-family: ${tokens.typography.fontFamily}; }
`;
};