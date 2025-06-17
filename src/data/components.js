export const defaultComponents = {
  atoms: {
    button: {
      name: 'Modern Button',
      category: 'atoms',
      template: `<button class="btn{% if variant %} btn-{{ variant }}{% endif %}{% if size %} btn-{{ size }}{% endif %}{% if rounded %} btn-rounded{% endif %}{% if fullWidth %} btn-full-width{% endif %}" {% if disabled %}disabled{% endif %}{% if ariaLabel %} aria-label="{{ ariaLabel }}"{% endif %}>
  {% if iconLeft %}
    <span class="btn-icon btn-icon-left">{{ iconLeft }}</span>
  {% endif %}
  {% if text %}
    <span class="btn-text">{{ text }}</span>
  {% endif %}
  {% if iconRight %}
    <span class="btn-icon btn-icon-right">{{ iconRight }}</span>
  {% endif %}
  {% if loading %}
    <span class="btn-spinner">⏳</span>
  {% endif %}
</button>`,
      props: {
        variant: {
          type: 'select',
          options: ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost', 'link'],
          default: 'primary',
          description: 'Visual style variant'
        },
        size: {
          type: 'select',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
          description: 'Button size'
        },
        text: {
          type: 'string',
          default: 'Click me',
          description: 'Button text content'
        },
        iconLeft: {
          type: 'string',
          default: '',
          description: 'Left icon (emoji or icon name)'
        },
        iconRight: {
          type: 'string',
          default: '',
          description: 'Right icon (emoji or icon name)'
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable button interaction'
        },
        loading: {
          type: 'boolean',
          default: false,
          description: 'Show loading state'
        },
        rounded: {
          type: 'boolean',
          default: false,
          description: 'Fully rounded corners'
        },
        fullWidth: {
          type: 'boolean',
          default: false,
          description: 'Take full width of container'
        },
        ariaLabel: {
          type: 'string',
          default: '',
          description: 'Accessibility label (optional)'
        }
      },
      scss: `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  font-family: var(--font-family);
  font-weight: 500;
  line-height: 1;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  // Sizes
  &.btn-xs {
    padding: calc(var(--spacing-xs) * 0.5) var(--spacing-xs);
    font-size: calc(var(--font-sm) * 0.875);
    min-height: 24px;
  }
  
  &.btn-sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-sm);
    min-height: 32px;
  }
  
  &.btn-md {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-md);
    min-height: 40px;
  }
  
  &.btn-lg {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-lg);
    min-height: 48px;
  }
  
  &.btn-xl {
    padding: var(--spacing-lg) calc(var(--spacing-lg) * 1.5);
    font-size: var(--font-xl);
    min-height: 56px;
  }
  
  // Variants
  &.btn-primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-primary) 85%, black);
      border-color: color-mix(in srgb, var(--color-primary) 85%, black);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.btn-secondary {
    background: var(--color-secondary);
    color: white;
    border-color: var(--color-secondary);
    
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-secondary) 85%, black);
      border-color: color-mix(in srgb, var(--color-secondary) 85%, black);
      transform: translateY(-1px);
    }
  }
  
  &.btn-success {
    background: var(--color-success);
    color: white;
    border-color: var(--color-success);
    
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-success) 85%, black);
      border-color: color-mix(in srgb, var(--color-success) 85%, black);
      transform: translateY(-1px);
    }
  }
  
  &.btn-warning {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
    
    &:hover:not(:disabled) {
      background: #d97706;
      border-color: #d97706;
      transform: translateY(-1px);
    }
  }
  
  &.btn-danger {
    background: var(--color-danger);
    color: white;
    border-color: var(--color-danger);
    
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-danger) 85%, black);
      border-color: color-mix(in srgb, var(--color-danger) 85%, black);
      transform: translateY(-1px);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
    
    &:hover:not(:disabled) {
      background: var(--color-primary);
      color: white;
      transform: translateY(-1px);
    }
  }
  
  &.btn-ghost {
    background: transparent;
    color: var(--color-primary);
    border-color: transparent;
    
    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      transform: translateY(-1px);
    }
  }
  
  &.btn-link {
    background: transparent;
    color: var(--color-primary);
    border-color: transparent;
    text-decoration: underline;
    
    &:hover:not(:disabled) {
      text-decoration: none;
      color: color-mix(in srgb, var(--color-primary) 85%, black);
    }
  }
  
  // Modifiers
  &.btn-rounded {
    border-radius: 50px;
  }
  
  &.btn-full-width {
    width: 100%;
  }
  
  // States
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  // Icon styling
  .btn-icon {
    display: flex;
    align-items: center;
    
    &.btn-icon-left {
      margin-right: calc(var(--spacing-xs) * -0.5);
    }
    
    &.btn-icon-right {
      margin-left: calc(var(--spacing-xs) * -0.5);
    }
  }
  
  // Loading state
  .btn-spinner {
    animation: spin 1s linear infinite;
  }
  
  &:has(.btn-spinner) .btn-text {
    opacity: 0.7;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`
    }
  },
  molecules: {},
  organisms: {
    navbar: {
      name: 'Navbar',
      category: 'organisms',
      template: `<nav class="navbar{% if variant %} navbar-{{ variant }}{% endif %}{% if sticky %} navbar-sticky{% endif %}{% if bordered %} navbar-bordered{% endif %}">
  <div class="navbar-container">
    <!-- Logo Section -->
    <div class="navbar-brand">
      {% if logoUrl %}
        <img src="{{ logoUrl }}" alt="{{ logoAlt|default('Logo') }}" class="navbar-logo" />
      {% endif %}
      {% if brandText %}
        <span class="navbar-brand-text">{{ brandText }}</span>
      {% endif %}
    </div>

    <!-- Navigation Links (Center) -->
    <div class="navbar-nav{% if centerNav %} navbar-nav-center{% endif %}">
      {% if showHome %}
        <a href="{{ homeUrl|default('/') }}" class="navbar-link{% if activeHome %} navbar-link-active{% endif %}">
          {{ homeLabel|default('Home') }}
        </a>
      {% endif %}
      {% if showAbout %}
        <a href="{{ aboutUrl|default('/about') }}" class="navbar-link{% if activeAbout %} navbar-link-active{% endif %}">
          {{ aboutLabel|default('About') }}
        </a>
      {% endif %}
      {% if showServices %}
        <a href="{{ servicesUrl|default('/services') }}" class="navbar-link{% if activeServices %} navbar-link-active{% endif %}">
          {{ servicesLabel|default('Services') }}
        </a>
      {% endif %}
      {% if showContact %}
        <a href="{{ contactUrl|default('/contact') }}" class="navbar-link{% if activeContact %} navbar-link-active{% endif %}">
          {{ contactLabel|default('Contact') }}
        </a>
      {% endif %}
    </div>

    <!-- Dropdown Menu (Right) -->
    <div class="navbar-dropdown">
      <button class="navbar-dropdown-trigger" aria-expanded="false" aria-haspopup="true">
        {% if userAvatar %}
          <img src="{{ userAvatar }}" alt="{{ userName|default('User') }}" class="navbar-avatar" />
        {% endif %}
        {% if userName %}
          <span class="navbar-username">{{ userName }}</span>
        {% endif %}
        {% if not hideDropdownIcon %}
          <span class="navbar-dropdown-icon">▼</span>
        {% endif %}
      </button>
      
      <div class="navbar-dropdown-menu" role="menu">
        {% if showProfile %}
          <a href="{{ profileUrl|default('/profile') }}" class="navbar-dropdown-item" role="menuitem">
            <span class="navbar-dropdown-icon-item">{{ profileIcon|default('👤') }}</span>
            <span>{{ profileLabel|default('Profile') }}</span>
          </a>
        {% endif %}
        {% if showSettings %}
          <a href="{{ settingsUrl|default('/settings') }}" class="navbar-dropdown-item" role="menuitem">
            <span class="navbar-dropdown-icon-item">{{ settingsIcon|default('⚙️') }}</span>
            <span>{{ settingsLabel|default('Settings') }}</span>
          </a>
        {% endif %}
        {% if showDivider %}
          <div class="navbar-dropdown-divider"></div>
        {% endif %}
        {% if showLogout %}
          <a href="{{ logoutUrl|default('/logout') }}" class="navbar-dropdown-item navbar-dropdown-item-danger" role="menuitem">
            <span class="navbar-dropdown-icon-item">{{ logoutIcon|default('🚪') }}</span>
            <span>{{ logoutLabel|default('Logout') }}</span>
          </a>
        {% endif %}
      </div>
    </div>

    <!-- Mobile Menu Toggle -->
    {% if showMobileToggle %}
      <button class="navbar-mobile-toggle" aria-label="Toggle navigation">
        <span class="navbar-mobile-toggle-line"></span>
        <span class="navbar-mobile-toggle-line"></span>
        <span class="navbar-mobile-toggle-line"></span>
      </button>
    {% endif %}
  </div>

  <!-- Mobile Navigation -->
  {% if showMobileNav %}
    <div class="navbar-mobile-nav">
      {% if showHome %}
        <a href="{{ homeUrl|default('/') }}" class="navbar-mobile-link">{{ homeLabel|default('Home') }}</a>
      {% endif %}
      {% if showAbout %}
        <a href="{{ aboutUrl|default('/about') }}" class="navbar-mobile-link">{{ aboutLabel|default('About') }}</a>
      {% endif %}
      {% if showServices %}
        <a href="{{ servicesUrl|default('/services') }}" class="navbar-mobile-link">{{ servicesLabel|default('Services') }}</a>
      {% endif %}
      {% if showContact %}
        <a href="{{ contactUrl|default('/contact') }}" class="navbar-mobile-link">{{ contactLabel|default('Contact') }}</a>
      {% endif %}
    </div>
  {% endif %}
</nav>`,
      props: {
        variant: {
          type: 'select',
          options: ['light', 'dark', 'transparent', 'glass'],
          default: 'light',
          description: 'Visual style variant'
        },
        sticky: {
          type: 'boolean',
          default: true,
          description: 'Stick to top when scrolling'
        },
        bordered: {
          type: 'boolean',
          default: true,
          description: 'Show bottom border'
        },
        logoUrl: {
          type: 'string',
          default: '',
          description: 'Logo image URL'
        },
        logoAlt: {
          type: 'string',
          default: 'Logo',
          description: 'Logo alt text'
        },
        brandText: {
          type: 'string',
          default: 'MyBrand',
          description: 'Brand text next to logo'
        },
        centerNav: {
          type: 'boolean',
          default: true,
          description: 'Center the navigation links'
        },
        showHome: {
          type: 'boolean',
          default: true,
          description: 'Show Home link'
        },
        homeLabel: {
          type: 'string',
          default: 'Home',
          description: 'Home link text'
        },
        homeUrl: {
          type: 'string',
          default: '/',
          description: 'Home link URL'
        },
        activeHome: {
          type: 'boolean',
          default: false,
          description: 'Mark Home as active'
        },
        showAbout: {
          type: 'boolean',
          default: true,
          description: 'Show About link'
        },
        aboutLabel: {
          type: 'string',
          default: 'About',
          description: 'About link text'
        },
        aboutUrl: {
          type: 'string',
          default: '/about',
          description: 'About link URL'
        },
        activeAbout: {
          type: 'boolean',
          default: false,
          description: 'Mark About as active'
        },
        showServices: {
          type: 'boolean',
          default: true,
          description: 'Show Services link'
        },
        servicesLabel: {
          type: 'string',
          default: 'Services',
          description: 'Services link text'
        },
        servicesUrl: {
          type: 'string',
          default: '/services',
          description: 'Services link URL'
        },
        activeServices: {
          type: 'boolean',
          default: false,
          description: 'Mark Services as active'
        },
        showContact: {
          type: 'boolean',
          default: true,
          description: 'Show Contact link'
        },
        contactLabel: {
          type: 'string',
          default: 'Contact',
          description: 'Contact link text'
        },
        contactUrl: {
          type: 'string',
          default: '/contact',
          description: 'Contact link URL'
        },
        activeContact: {
          type: 'boolean',
          default: false,
          description: 'Mark Contact as active'
        },
        userName: {
          type: 'string',
          default: 'John Doe',
          description: 'User name in dropdown'
        },
        userAvatar: {
          type: 'string',
          default: '',
          description: 'User avatar URL'
        },
        hideDropdownIcon: {
          type: 'boolean',
          default: false,
          description: 'Hide dropdown arrow icon'
        },
        showProfile: {
          type: 'boolean',
          default: true,
          description: 'Show Profile item in dropdown'
        },
        profileLabel: {
          type: 'string',
          default: 'Profile',
          description: 'Profile menu item text'
        },
        profileUrl: {
          type: 'string',
          default: '/profile',
          description: 'Profile page URL'
        },
        profileIcon: {
          type: 'string',
          default: '👤',
          description: 'Profile menu icon'
        },
        showSettings: {
          type: 'boolean',
          default: true,
          description: 'Show Settings item in dropdown'
        },
        settingsLabel: {
          type: 'string',
          default: 'Settings',
          description: 'Settings menu item text'
        },
        settingsUrl: {
          type: 'string',
          default: '/settings',
          description: 'Settings page URL'
        },
        settingsIcon: {
          type: 'string',
          default: '⚙️',
          description: 'Settings menu icon'
        },
        showDivider: {
          type: 'boolean',
          default: true,
          description: 'Show divider in dropdown'
        },
        showLogout: {
          type: 'boolean',
          default: true,
          description: 'Show Logout item in dropdown'
        },
        logoutLabel: {
          type: 'string',
          default: 'Logout',
          description: 'Logout menu item text'
        },
        logoutUrl: {
          type: 'string',
          default: '/logout',
          description: 'Logout URL'
        },
        logoutIcon: {
          type: 'string',
          default: '🚪',
          description: 'Logout menu icon'
        },
        showMobileToggle: {
          type: 'boolean',
          default: true,
          description: 'Show mobile hamburger menu'
        },
        showMobileNav: {
          type: 'boolean',
          default: false,
          description: 'Show mobile navigation (toggleable)'
        }
      },
      scss: `.navbar {
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &.navbar-sticky {
    position: sticky;
    top: 0;
  }
  
  &.navbar-bordered {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  // Variants
  &.navbar-light {
    background: white;
    color: #333;
    
    .navbar-link {
      color: #666;
      
      &:hover {
        color: var(--color-primary);
      }
      
      &.navbar-link-active {
        color: var(--color-primary);
        font-weight: 600;
      }
    }
  }
  
  &.navbar-dark {
    background: #1a1a1a;
    color: white;
    
    .navbar-link {
      color: #ccc;
      
      &:hover {
        color: white;
      }
      
      &.navbar-link-active {
        color: white;
        font-weight: 600;
      }
    }
    
    .navbar-dropdown-trigger {
      color: white;
    }
  }
  
  &.navbar-transparent {
    background: transparent;
    backdrop-filter: blur(10px);
    
    &.navbar-bordered {
      border-bottom-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.navbar-glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
    min-height: 56px;
  }
}

// Brand/Logo Section
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  
  .navbar-logo {
    height: 32px;
    width: auto;
  }
  
  .navbar-brand-text {
    font-size: var(--font-lg);
    font-weight: 700;
    color: inherit;
  }
}

// Navigation Links
.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  
  &.navbar-nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
}

.navbar-link {
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 500;
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &.navbar-link-active {
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: var(--color-primary);
      border-radius: 1px;
    }
  }
}

// Dropdown Menu
.navbar-dropdown {
  position: relative;
  
  .navbar-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 8px;
    transition: all 0.2s ease;
    font-family: var(--font-family);
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-primary);
    }
  }
  
  .navbar-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .navbar-username {
    font-size: var(--font-sm);
    font-weight: 500;
  }
  
  .navbar-dropdown-icon {
    font-size: 10px;
    transition: transform 0.2s ease;
  }
  
  // Dropdown Menu
  .navbar-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 200px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-xs) 0;
    margin-top: var(--spacing-xs);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 1001;
  }
  
  // Show dropdown on hover
  &:hover .navbar-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  &:hover .navbar-dropdown-icon {
    transform: rotate(180deg);
  }
}

.navbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: #333;
  text-decoration: none;
  font-size: var(--font-sm);
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &.navbar-dropdown-item-danger {
    color: var(--color-danger);
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
  
  .navbar-dropdown-icon-item {
    width: 16px;
    text-align: center;
  }
}

.navbar-dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: var(--spacing-xs) 0;
}

// Mobile Menu Toggle
.navbar-mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  .navbar-mobile-toggle-line {
    width: 20px;
    height: 2px;
    background: currentColor;
    transition: all 0.3s ease;
  }
}

// Mobile Navigation
.navbar-mobile-nav {
  display: none;
  flex-direction: column;
  background: inherit;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--spacing-md);
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  .navbar-mobile-link {
    padding: var(--spacing-sm) 0;
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      color: var(--color-primary);
    }
  }
}`
    }
  },
  templates: {},
  pages: {}
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