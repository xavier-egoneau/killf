export const defaultComponents = {
  atoms: {
    button: {
      name: 'Button',
      category: 'atoms',
      props: {
        variant: { type: 'select', options: ['primary', 'secondary', 'outline'], default: 'primary' },
        size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
        disabled: { type: 'boolean', default: false },
        text: { type: 'string', default: 'Click me' }
      },
      scss: `.btn {
  font-family: var(--font-family);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &.btn-primary {
    background: var(--color-primary);
    color: white;
  }
  
  &.btn-secondary {
    background: var(--color-secondary);
    color: white;
  }
  
  &.btn-outline {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  
  &.btn-sm { padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--font-sm); }
  &.btn-md { padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-md); }
  &.btn-lg { padding: var(--spacing-md) var(--spacing-lg); font-size: var(--font-lg); }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}`
    },
    input: {
      name: 'Input',
      category: 'atoms',
      props: {
        type: { type: 'select', options: ['text', 'email', 'password'], default: 'text' },
        placeholder: { type: 'string', default: 'Enter text...' },
        disabled: { type: 'boolean', default: false }
      },
      scss: `.input {
  font-family: var(--font-family);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: var(--font-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background: #f8f9fa;
    opacity: 0.6;
  }
}`
    }
  },
  molecules: {
    card: {
      name: 'Card',
      category: 'molecules',
      props: {
        title: { type: 'string', default: 'Card Title' },
        content: { type: 'string', default: 'Card content goes here...' },
        hasButton: { type: 'boolean', default: true }
      },
      scss: `.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: var(--spacing-lg);
  
  .card-title {
    font-size: var(--font-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: #333;
  }
  
  .card-content {
    color: #666;
    line-height: 1.5;
    margin-bottom: var(--spacing-md);
  }
}`
    }
  },
  organisms: {
    header: {
      name: 'Header',
      category: 'organisms',
      props: {
        title: { type: 'string', default: 'My Application' },
        showNav: { type: 'boolean', default: true },
        ctaText: { type: 'string', default: 'Get Started' }
      },
      scss: `.header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-title {
    font-size: var(--font-xl);
    font-weight: 600;
    color: #333;
  }
  
  .header-nav {
    display: flex;
    gap: var(--spacing-lg);
    
    a {
      color: #666;
      text-decoration: none;
      &:hover { color: var(--color-primary); }
    }
  }
}`
    },
    productList: {
      name: 'Product List',
      category: 'organisms',
      props: {
        itemCount: { type: 'select', options: ['3', '6', '9'], default: '3' },
        showPrices: { type: 'boolean', default: true }
      },
      scss: `.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}`
    }
  },
  templates: {
    dashboardLayout: {
      name: 'Dashboard Layout',
      category: 'templates',
      props: {
        sidebarWidth: { type: 'select', options: ['narrow', 'wide'], default: 'narrow' },
        showBreadcrumbs: { type: 'boolean', default: true }
      },
      scss: `.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  
  &.narrow { grid-template-columns: 200px 1fr; }
  &.wide { grid-template-columns: 300px 1fr; }
  
  .sidebar {
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
  }
  
  .main-content {
    padding: var(--spacing-lg);
  }
}`
    },
    landingPage: {
      name: 'Landing Page',
      category: 'templates',
      props: {
        heroStyle: { type: 'select', options: ['centered', 'split'], default: 'centered' },
        showTestimonials: { type: 'boolean', default: true }
      },
      scss: `.landing-page {
  .hero {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    
    &.split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: left;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl) var(--spacing-lg);
  }
}`
    }
  },
  pages: {
    homePage: {
      name: 'Home Page',
      category: 'pages',
      props: {
        theme: { type: 'select', options: ['light', 'dark'], default: 'light' },
        showPromo: { type: 'boolean', default: false }
      },
      scss: `.home-page {
  &.dark {
    background: #1a1a1a;
    color: white;
  }
  
  .promo-banner {
    background: var(--color-primary);
    color: white;
    text-align: center;
    padding: var(--spacing-sm);
  }
}`
    },
    profilePage: {
      name: 'Profile Page',
      category: 'pages',
      props: {
        layout: { type: 'select', options: ['tabs', 'sidebar'], default: 'tabs' },
        showActivity: { type: 'boolean', default: true }
      },
      scss: `.profile-page {
  .profile-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    border-bottom: 1px solid #e9ecef;
  }
  
  .profile-content {
    &.tabs {
      .tab-nav {
        border-bottom: 1px solid #e9ecef;
        padding: 0 var(--spacing-lg);
      }
    }
    
    &.sidebar {
      display: grid;
      grid-template-columns: 250px 1fr;
    }
  }
}`
    }
  }
};

export const componentCategories = [
  {
    key: 'atoms',
    name: 'Atoms',
    description: 'Basic UI elements',
    color: 'blue',
    icon: 'circle'
  },
  {
    key: 'molecules',
    name: 'Molecules',
    description: 'Simple component groups',
    color: 'green',
    icon: 'layers'
  },
  {
    key: 'organisms',
    name: 'Organisms',
    description: 'Complex UI sections',
    color: 'yellow',
    icon: 'layout'
  },
  {
    key: 'templates',
    name: 'Templates',
    description: 'Page layouts',
    color: 'purple',
    icon: 'file-text'
  },
  {
    key: 'pages',
    name: 'Pages',
    description: 'Complete views',
    color: 'red',
    icon: 'monitor'
  }
];