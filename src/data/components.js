export const defaultComponents = {
  atoms: {
    button: {
      name: 'Button',
      category: 'atoms',
      template: `<button class="btn {{#class variant}}btn-{{variant}}{{/class}} {{#class size}}btn-{{size}}{{/class}}" {{#if disabled}}disabled{{/if}}>
  {{text}}
</button>`,
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
      template: `<input 
  type="{{type}}" 
  class="input" 
  placeholder="{{placeholder}}"
  {{#if disabled}}disabled{{/if}}
/>`,
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
      template: `<div class="card">
  {{#if title}}<h3 class="card-title">{{title}}</h3>{{/if}}
  {{#if content}}<p class="card-content">{{content}}</p>{{/if}}
  {{#if hasButton}}<button class="btn btn-primary">{{buttonText}}</button>{{/if}}
</div>`,
      props: {
        title: { type: 'string', default: 'Card Title' },
        content: { type: 'string', default: 'Card content goes here...' },
        hasButton: { type: 'boolean', default: true },
        buttonText: { type: 'string', default: 'Learn More' }
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
      template: `<header class="header">
  <h1 class="header-title">{{title}}</h1>
  {{#if showNav}}
  <nav class="header-nav">
    <a href="#about">About</a>
    <a href="#features">Features</a>
    <a href="#contact">Contact</a>
  </nav>
  {{/if}}
  <button class="btn btn-primary">{{ctaText}}</button>
</header>`,
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
      template: `<section class="product-list {{#class layout}}layout-{{layout}}{{/class}}">
  {{#if title}}<h2 class="product-list__title">{{title}}</h2>{{/if}}
  <div class="product-list__grid">
    {{content}}
  </div>
</section>`,
      props: {
        title: { type: 'string', default: 'Our Products' },
        layout: { type: 'select', options: ['grid', 'list'], default: 'grid' },
        content: { type: 'string', default: 'Product items will go here...' }
      },
      scss: `.product-list {
  padding: var(--spacing-lg);
  
  &__title {
    font-size: var(--font-xl);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
  
  &__grid {
    display: grid;
    gap: var(--spacing-lg);
  }
  
  &.layout-grid &__grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  &.layout-list &__grid {
    grid-template-columns: 1fr;
  }
}`
    }
  },
  templates: {
    dashboardLayout: {
      name: 'Dashboard Layout',
      category: 'templates',
      template: `<div class="dashboard-layout {{#class sidebarWidth}}sidebar-{{sidebarWidth}}{{/class}}">
  <aside class="dashboard-sidebar">
    {{sidebar}}
  </aside>
  <main class="dashboard-main">
    {{#if showBreadcrumbs}}<nav class="breadcrumbs">{{breadcrumbs}}</nav>{{/if}}
    <div class="dashboard-content">
      {{content}}
    </div>
  </main>
</div>`,
      props: {
        sidebarWidth: { type: 'select', options: ['narrow', 'wide'], default: 'narrow' },
        showBreadcrumbs: { type: 'boolean', default: true },
        sidebar: { type: 'string', default: 'Sidebar content...' },
        breadcrumbs: { type: 'string', default: 'Home > Dashboard' },
        content: { type: 'string', default: 'Main content...' }
      },
      scss: `.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  
  &.sidebar-narrow { grid-template-columns: 200px 1fr; }
  &.sidebar-wide { grid-template-columns: 300px 1fr; }
  
  .dashboard-sidebar {
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    padding: var(--spacing-lg);
  }
  
  .dashboard-main {
    padding: var(--spacing-lg);
  }
  
  .breadcrumbs {
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-sm);
    color: #666;
  }
}`
    },
    landingPage: {
      name: 'Landing Page',
      category: 'templates',
      template: `<div class="landing-page">
  <section class="hero {{#class heroStyle}}hero-{{heroStyle}}{{/class}}">
    <h1>{{heroTitle}}</h1>
    <p>{{heroDescription}}</p>
    <button class="btn btn-primary btn-lg">{{ctaText}}</button>
  </section>
  
  <section class="features">
    {{features}}
  </section>
  
  {{#if showTestimonials}}
  <section class="testimonials">
    {{testimonials}}
  </section>
  {{/if}}
</div>`,
      props: {
        heroStyle: { type: 'select', options: ['centered', 'split'], default: 'centered' },
        showTestimonials: { type: 'boolean', default: true },
        heroTitle: { type: 'string', default: 'Welcome to Our Platform' },
        heroDescription: { type: 'string', default: 'The best solution for your needs' },
        ctaText: { type: 'string', default: 'Get Started' },
        features: { type: 'string', default: 'Features content...' },
        testimonials: { type: 'string', default: 'Testimonials content...' }
      },
      scss: `.landing-page {
  .hero {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    
    &.hero-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: left;
      align-items: center;
    }
    
    h1 {
      font-size: var(--font-xl);
      margin-bottom: var(--spacing-md);
    }
    
    p {
      margin-bottom: var(--spacing-lg);
      color: #666;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .testimonials {
    background: #f8f9fa;
    padding: var(--spacing-xl) var(--spacing-lg);
    text-align: center;
  }
}`
    }
  },
  pages: {
    homePage: {
      name: 'Home Page',
      category: 'pages',
      template: `<div class="home-page {{#class theme}}theme-{{theme}}{{/class}}">
  {{#if showPromo}}
  <div class="promo-banner">
    {{promoText}}
  </div>
  {{/if}}
  
  <main class="home-content">
    {{content}}
  </main>
</div>`,
      props: {
        theme: { type: 'select', options: ['light', 'dark'], default: 'light' },
        showPromo: { type: 'boolean', default: false },
        promoText: { type: 'string', default: 'Special offer - 50% off!' },
        content: { type: 'string', default: 'Home page content...' }
      },
      scss: `.home-page {
  &.theme-dark {
    background: #1a1a1a;
    color: white;
  }
  
  .promo-banner {
    background: var(--color-primary);
    color: white;
    text-align: center;
    padding: var(--spacing-sm);
    font-weight: 600;
  }
  
  .home-content {
    padding: var(--spacing-lg);
  }
}`
    },
    profilePage: {
      name: 'Profile Page',
      category: 'pages',
      template: `<div class="profile-page">
  <header class="profile-header">
    <img src="{{avatar}}" alt="{{name}}" class="profile-avatar" />
    <div class="profile-info">
      <h1>{{name}}</h1>
      <p>{{bio}}</p>
    </div>
  </header>
  
  <div class="profile-content {{#class layout}}layout-{{layout}}{{/class}}">
    {{#if layout === 'tabs'}}
    <nav class="tab-nav">
      <button class="tab-button active">Profile</button>
      <button class="tab-button">Settings</button>
      {{#if showActivity}}<button class="tab-button">Activity</button>{{/if}}
    </nav>
    {{/if}}
    
    <div class="profile-main">
      {{content}}
    </div>
    
    {{#if layout === 'sidebar'}}
    <aside class="profile-sidebar">
      {{sidebar}}
    </aside>
    {{/if}}
  </div>`,
      props: {
        layout: { type: 'select', options: ['tabs', 'sidebar'], default: 'tabs' },
        showActivity: { type: 'boolean', default: true },
        name: { type: 'string', default: 'John Doe' },
        bio: { type: 'string', default: 'Software Developer' },
        avatar: { type: 'string', default: '/avatar-placeholder.jpg' },
        content: { type: 'string', default: 'Profile content...' },
        sidebar: { type: 'string', default: 'Sidebar content...' }
      },
      scss: `.profile-page {
  .profile-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    border-bottom: 1px solid #e9ecef;
    
    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .profile-info h1 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-xl);
    }
    
    .profile-info p {
      margin: 0;
      color: #666;
    }
  }
  
  .profile-content {
    &.layout-tabs {
      .tab-nav {
        border-bottom: 1px solid #e9ecef;
        padding: 0 var(--spacing-lg);
        
        .tab-button {
          background: none;
          border: none;
          padding: var(--spacing-md);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          
          &.active {
            border-bottom-color: var(--color-primary);
            color: var(--color-primary);
          }
        }
      }
    }
    
    &.layout-sidebar {
      display: grid;
      grid-template-columns: 1fr 250px;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
    }
  }
  
  .profile-main {
    padding: var(--spacing-lg);
  }
  
  .profile-sidebar {
    background: #f8f9fa;
    padding: var(--spacing-lg);
    border-radius: 8px;
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