/**
 * Generates CSS custom properties from design tokens
 */
export const generateCSSVariables = (tokens) => {
  // Colors
  const colorVars = Object.entries(tokens.colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');

  // Spacing
  const spacingVars = Object.entries(tokens.spacing)
    .map(([key, value]) => `  --spacing-${key}: ${value};`)
    .join('\n');

  // Typography
  const typographyVars = `  --font-family: ${tokens.typography.fontFamily};
  --font-family-secondary: ${tokens.typography.secondaryFont};
${Object.entries(tokens.typography.sizes)
  .map(([key, value]) => `  --font-${key}: ${value};`)
  .join('\n')}`;

  // Icons
  const iconVars = `  --icon-size: ${tokens.icons.size};
  --icon-set: "${tokens.icons.set}";`;

  // Framework-specific variables
  const frameworkVars = `  --framework-type: "${tokens.framework.type}";
  --framework-version: "${tokens.framework.version}";`;

  return `:root {
${colorVars}
  
${spacingVars}
  
${typographyVars}
  
${iconVars}
  
${frameworkVars}
}`;
};

/**
 * Generates framework-specific CSS based on selected framework
 */
export const generateFrameworkCSS = (tokens) => {
  const { framework } = tokens;
  
  switch (framework.type) {
    case 'bootstrap':
      return generateBootstrapCSS(tokens);
    case 'tailwind':
      return generateTailwindCSS(tokens);
    case 'angular':
      return generateAngularMaterialCSS(tokens);
    case 'vanilla':
    default:
      return generateVanillaCSS(tokens);
  }
};

/**
 * Generates Bootstrap-compatible CSS
 */
const generateBootstrapCSS = (tokens) => {
  return `
/* Bootstrap 5 Custom Theme */
:root {
  --bs-primary: ${tokens.colors.primary};
  --bs-secondary: ${tokens.colors.secondary};
  --bs-success: ${tokens.colors.success};
  --bs-danger: ${tokens.colors.danger};
  
  --bs-font-sans-serif: ${tokens.typography.fontFamily};
  
  --bs-spacer: ${tokens.spacing.md};
}

/* Custom Bootstrap utilities */
.font-secondary {
  font-family: ${tokens.typography.secondaryFont} !important;
}

/* Brand utilities */
.brand-logo {
  height: 2rem;
  width: auto;
}

.brand-text {
  font-family: ${tokens.typography.fontFamily};
  font-weight: 600;
}
`;
};

/**
 * Generates Tailwind-compatible CSS
 */
const generateTailwindCSS = (tokens) => {
  return `
/* Tailwind CSS Custom Configuration */
@layer base {
  :root {
    --color-primary: ${tokens.colors.primary};
    --color-secondary: ${tokens.colors.secondary};
    --color-success: ${tokens.colors.success};
    --color-danger: ${tokens.colors.danger};
  }
}

@layer components {
  .btn-brand {
    @apply bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity;
  }
  
  .text-brand {
    color: var(--color-primary);
  }
  
  .bg-brand {
    background-color: var(--color-primary);
  }
  
  .font-secondary {
    font-family: ${tokens.typography.secondaryFont};
  }
}

@layer utilities {
  .brand-logo {
    height: 2rem;
    width: auto;
  }
}
`;
};

/**
 * Generates Angular Material-compatible CSS
 */
const generateAngularMaterialCSS = (tokens) => {
  return `
/* Angular Material Custom Theme */
@use '@angular/material' as mat;

// Define custom color palette
$custom-primary: mat.define-palette((
  50: #e3f2fd,
  100: #bbdefb,
  200: #90caf9,
  300: #64b5f6,
  400: #42a5f5,
  500: ${tokens.colors.primary},
  600: #1e88e5,
  700: #1976d2,
  800: #1565c0,
  900: #0d47a1,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: rgba(black, 0.87),
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));

$custom-accent: mat.define-palette((
  500: ${tokens.colors.secondary},
));

$custom-warn: mat.define-palette((
  500: ${tokens.colors.danger},
));

// Create theme
$custom-theme: mat.define-light-theme((
  color: (
    primary: $custom-primary,
    accent: $custom-accent,
    warn: $custom-warn,
  ),
  typography: mat.define-typography-config(
    $font-family: '${tokens.typography.fontFamily}',
  ),
));

@include mat.all-component-themes($custom-theme);

/* Custom utilities */
.font-secondary {
  font-family: ${tokens.typography.secondaryFont} !important;
}

.brand-logo {
  height: 2rem;
  width: auto;
}
`;
};

/**
 * Generates Vanilla CSS utilities
 */
const generateVanillaCSS = (tokens) => {
  return `
/* Vanilla CSS Design System */

/* Typography utilities */
.font-primary {
  font-family: ${tokens.typography.fontFamily};
}

.font-secondary {
  font-family: ${tokens.typography.secondaryFont};
}

${Object.entries(tokens.typography.sizes)
  .map(([key, value]) => `.text-${key} { font-size: ${value}; }`)
  .join('\n')}

/* Color utilities */
${Object.entries(tokens.colors)
  .map(([key, value]) => `
.text-${key} { color: ${value}; }
.bg-${key} { background-color: ${value}; }
.border-${key} { border-color: ${value}; }`)
  .join('')}

/* Spacing utilities */
${Object.entries(tokens.spacing)
  .map(([key, value]) => `
.p-${key} { padding: ${value}; }
.m-${key} { margin: ${value}; }
.px-${key} { padding-left: ${value}; padding-right: ${value}; }
.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }
.mx-${key} { margin-left: ${value}; margin-right: ${value}; }
.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }`)
  .join('')}

/* Brand utilities */
.brand-logo {
  height: 2rem;
  width: auto;
}

.brand-text {
  font-family: ${tokens.typography.fontFamily};
  font-weight: 600;
}

/* Icon utilities */
.icon {
  width: ${tokens.icons.size};
  height: ${tokens.icons.size};
  display: inline-block;
}

.icon-${tokens.icons.set} {
  /* Icon set specific styles */
}
`;
};

/**
 * Generates complete CSS output for the design system
 */
export const generateCompleteCSS = (tokens, components) => {
  const variables = generateCSSVariables(tokens);
  const frameworkCSS = generateFrameworkCSS(tokens);
  
  const componentStyles = Object.values(components)
    .flatMap(category => Object.values(category))
    .map(component => component.scss)
    .filter(scss => scss) // Filter out empty styles
    .join('\n\n');
  
  return `${variables}\n\n${frameworkCSS}\n\n/* Component Styles */\n${componentStyles}`;
};

/**
 * Generates Tailwind config based on tokens
 */
export const generateTailwindConfig = (tokens) => {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
${Object.entries(tokens.colors)
  .map(([key, value]) => `        '${key}': '${value}',`)
  .join('\n')}
      },
      fontFamily: {
        'primary': [${tokens.typography.fontFamily.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        'secondary': [${tokens.typography.secondaryFont.split(',').map(f => `'${f.trim()}'`).join(', ')}],
      },
      fontSize: {
${Object.entries(tokens.typography.sizes)
  .map(([key, value]) => `        '${key}': '${value}',`)
  .join('\n')}
      },
      spacing: {
${Object.entries(tokens.spacing)
  .map(([key, value]) => `        '${key}': '${value}',`)
  .join('\n')}
      }
    },
  },
  plugins: [],
}`;
};

/**
 * Generates framework installation instructions
 */
export const generateFrameworkInstructions = (tokens) => {
  const { framework } = tokens;
  
  switch (framework.type) {
    case 'bootstrap':
      return `# Bootstrap ${framework.version} Setup

## Installation
\`\`\`bash
npm install bootstrap@${framework.version}
\`\`\`

## Import in your CSS
\`\`\`css
@import "bootstrap/dist/css/bootstrap.min.css";
/* Your custom CSS with design tokens */
\`\`\`

## Usage
\`\`\`html
<button class="btn btn-primary">Primary Button</button>
<div class="text-primary">Primary colored text</div>
\`\`\`
`;

    case 'tailwind':
      return `# Tailwind CSS ${framework.version} Setup

## Installation
\`\`\`bash
npm install -D tailwindcss@${framework.version}
npx tailwindcss init
\`\`\`

## Add to your CSS
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Usage with custom colors
\`\`\`html
<button class="bg-primary text-white px-4 py-2 rounded">Button</button>
<div class="text-primary">Primary colored text</div>
\`\`\`
`;

    case 'angular':
      return `# Angular Material ${framework.version} Setup

## Installation
\`\`\`bash
ng add @angular/material@${framework.version}
\`\`\`

## Import theme in styles.scss
\`\`\`scss
@use '@angular/material' as mat;
@include mat.all-component-themes($custom-theme);
\`\`\`

## Usage
\`\`\`html
<button mat-raised-button color="primary">Primary Button</button>
<mat-card>Card content</mat-card>
\`\`\`
`;

    case 'vanilla':
    default:
      return `# Vanilla CSS Setup

## No installation required!

## Include the generated CSS in your HTML
\`\`\`html
<link rel="stylesheet" href="design-system.css">
\`\`\`

## Usage
\`\`\`html
<button class="btn bg-primary text-white p-md">Button</button>
<div class="text-primary font-primary">Styled text</div>
\`\`\`
`;
  }
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
.font-primary { font-family: ${tokens.typography.fontFamily}; }
.font-secondary { font-family: ${tokens.typography.secondaryFont}; }

/* Brand utilities */
.brand-logo {
  height: 2rem;
  width: auto;
}

.brand-text {
  font-family: ${tokens.typography.fontFamily};
  font-weight: 600;
}

/* Icon utilities */
.icon {
  width: ${tokens.icons.size};
  height: ${tokens.icons.size};
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
`;
};