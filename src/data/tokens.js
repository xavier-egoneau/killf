export const defaultTokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondaryFont: 'Georgia, "Times New Roman", serif',
    sizes: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  branding: {
    logoUrl: '',
    logoAlt: 'Logo',
    brandName: 'My Brand'
  },
  icons: {
    set: 'lucide', // lucide, heroicons, feather, fontawesome
    size: '1rem'
  },
  framework: {
    type: 'tailwind', // bootstrap, angular, tailwind, vanilla
    version: '3.x'
  }
};

// Configuration des frameworks disponibles
export const frameworkOptions = {
  tailwind: {
    name: 'Tailwind CSS',
    versions: ['3.x', '4.x'],
    cssPrefix: '',
    utilityBased: true,
    description: 'Utility-first CSS framework'
  },
  bootstrap: {
    name: 'Bootstrap',
    versions: ['5.x', '4.x'],
    cssPrefix: 'bs-',
    utilityBased: false,
    description: 'Component-based CSS framework'
  },
  angular: {
    name: 'Angular Material',
    versions: ['17.x', '16.x'],
    cssPrefix: 'mat-',
    utilityBased: false,
    description: 'Angular Material Design components'
  },
  vanilla: {
    name: 'Vanilla CSS',
    versions: ['CSS3'],
    cssPrefix: '',
    utilityBased: false,
    description: 'Pure CSS without framework'
  }
};

// Configuration des sets d'icônes
export const iconSetOptions = {
  lucide: {
    name: 'Lucide',
    description: 'Beautiful & consistent icon toolkit',
    url: 'https://lucide.dev',
    prefix: 'lucide-'
  },
  heroicons: {
    name: 'Heroicons',
    description: 'Beautiful hand-crafted SVG icons',
    url: 'https://heroicons.com',
    prefix: 'hero-'
  },
  feather: {
    name: 'Feather',
    description: 'Simply beautiful open source icons',
    url: 'https://feathericons.com',
    prefix: 'feather-'
  },
  fontawesome: {
    name: 'Font Awesome',
    description: 'The web\'s most popular icon set',
    url: 'https://fontawesome.com',
    prefix: 'fa-'
  },
  tabler: {
    name: 'Tabler Icons',
    description: 'Free and open source icons',
    url: 'https://tablericons.com',
    prefix: 'tabler-'
  }
};

// Presets de spacing populaires
export const spacingPresets = {
  tailwind: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  bootstrap: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem'
  },
  material: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  custom: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};

// Presets de fonts populaires
export const fontPresets = {
  system: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Georgia, "Times New Roman", serif'
  },
  google: {
    primary: '"Inter", sans-serif',
    secondary: '"Playfair Display", serif'
  },
  modern: {
    primary: '"Poppins", sans-serif',
    secondary: '"Merriweather", serif'
  },
  classic: {
    primary: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    secondary: '"Times New Roman", Times, serif'
  }
};