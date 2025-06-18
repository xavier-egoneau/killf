// components/Sidebar.jsx - Version sans sélecteur spacing preset
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Palette, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Type,
  Move,
  Image,
  Star,
  Settings,
  Minus
} from 'lucide-react';
import { componentCategories } from '../data';
import { frameworkOptions, iconSetOptions, fontPresets } from '../data/tokens';
import { useI18n } from '../hooks/useI18n';

const Sidebar = ({ tokensHook, componentsHook }) => {
  const { t } = useI18n();
  
  const [expandedSections, setExpandedSections] = useState({
    tokens: true,
    colors: true,
    typography: false,
    spacing: false,
    branding: false,
    icons: false,
    framework: false,
    atoms: true,
    molecules: false,
    organisms: false,
    templates: false,
    pages: false
  });

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newTokenInputs, setNewTokenInputs] = useState({
    colorName: '',
    colorValue: '#000000',
    spacingName: '',
    spacingValue: '1rem'
  });

  const { 
    tokens, 
    updateColorToken, 
    updateTypographyToken,
    updateSpacingToken,
    updateBrandingToken,
    updateIconsToken,
    updateFrameworkToken,
    applyFontPreset,
    addColorToken,
    removeColorToken,
    addSpacingToken,
    removeSpacingToken,
    getCurrentSpacingPreset // 🆕 Nouvelle fonction
  } = tokensHook;
  
  const { components, selectedComponent, setSelectedComponent, addComponent, removeComponent } = componentsHook;

  // Traductions des catégories
  const getCategoryTranslation = (categoryKey) => {
    const categoryTranslations = {
      atoms: t('atoms'),
      molecules: t('molecules'),
      organisms: t('organisms'),
      templates: t('templates'),
      pages: t('pages')
    };
    return categoryTranslations[categoryKey] || categoryKey;
  };

  const getCategoryDescription = (categoryKey) => {
    const descriptions = {
      atoms: t('basicUIElements'),
      molecules: t('simpleComponentGroups'),
      organisms: t('complexUISections'),
      templates: t('pageLayouts'),
      pages: t('completeViews')
    };
    return descriptions[categoryKey] || '';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      atoms: 'bg-blue-100',
      molecules: 'bg-green-100',
      organisms: 'bg-yellow-100',
      templates: 'bg-purple-100',
      pages: 'bg-red-100'
    };
    return colors[category] || 'bg-gray-100';
  };

  // Gestion des nouveaux tokens
  const handleAddColorToken = () => {
    if (newTokenInputs.colorName && newTokenInputs.colorValue) {
      addColorToken(newTokenInputs.colorName, newTokenInputs.colorValue);
      setNewTokenInputs(prev => ({
        ...prev,
        colorName: '',
        colorValue: '#000000'
      }));
    }
  };

  const handleAddSpacingToken = () => {
    if (newTokenInputs.spacingName && newTokenInputs.spacingValue) {
      addSpacingToken(newTokenInputs.spacingName, newTokenInputs.spacingValue);
      setNewTokenInputs(prev => ({
        ...prev,
        spacingName: '',
        spacingValue: '1rem'
      }));
    }
  };

  const handleAddComponent = (category) => {
    const categoryName = getCategoryTranslation(category);
    const componentName = prompt(t('enterComponentName', { category: categoryName }));
    if (componentName) {
      const componentKey = componentName.toLowerCase().replace(/\s+/g, '');
      const newComponent = {
        name: componentName,
        category,
        props: {
          // Default props based on category
          ...(category === 'atoms' && {
            variant: { type: 'select', options: ['default', 'primary'], default: 'default' },
            size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md' }
          }),
          ...(category === 'molecules' && {
            title: { type: 'string', default: t('title') },
            content: { type: 'string', default: t('content') }
          }),
          ...(category === 'organisms' && {
            layout: { type: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' },
            showTitle: { type: 'boolean', default: true }
          }),
          ...(category === 'templates' && {
            columns: { type: 'select', options: ['1', '2', '3'], default: '2' },
            sidebar: { type: 'boolean', default: false }
          }),
          ...(category === 'pages' && {
            theme: { type: 'select', options: ['light', 'dark'], default: 'light' },
            fullWidth: { type: 'boolean', default: false }
          })
        },
        scss: `/* ${componentName} styles */
.${componentKey} {
  /* Add your styles here */
  padding: var(--spacing-md);
  border-radius: 4px;
}`
      };
      
      addComponent(category, componentKey, newComponent);
      
      // Select the new component
      const newComponentPath = ['atoms', 'molecules'].includes(category) 
        ? componentKey 
        : `${category}.${componentKey}`;
      setSelectedComponent(newComponentPath);
    }
  };

  const handleDeleteClick = (category, key, componentName) => {
    setDeleteConfirm({ category, key, name: componentName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const { category, key, name } = deleteConfirm;
    
    try {
      await removeComponent(category, key);
      
      // Si le composant supprimé était sélectionné, sélectionner le premier disponible
      const currentSelectedPath = ['atoms', 'molecules'].includes(category) ? key : `${category}.${key}`;
      if (selectedComponent === currentSelectedPath) {
        // Trouver le premier composant disponible
        const firstAvailable = findFirstAvailableComponent();
        setSelectedComponent(firstAvailable || null);
      }
      
      console.log(`✅ Component "${name}" deleted successfully`);
    } catch (error) {
      console.error(`❌ Failed to delete component "${name}":`, error);
      alert(`Failed to delete component "${name}". Please try again.`);
    }
    
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const findFirstAvailableComponent = () => {
    for (const [category, comps] of Object.entries(components)) {
      const componentKeys = Object.keys(comps);
      if (componentKeys.length > 0) {
        const firstKey = componentKeys[0];
        return ['atoms', 'molecules'].includes(category) ? firstKey : `${category}.${firstKey}`;
      }
    }
    return null;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{t('designSystemBuilder')}</h1>
        <p className="text-sm text-gray-500">{t('aiFriendly')}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Design Tokens */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => toggleSection('tokens')}
              className="flex items-center text-left text-sm font-medium text-gray-700 hover:text-gray-900 flex-1"
            >
              {expandedSections.tokens ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Settings size={16} className="ml-1 mr-2" />
              {t('designTokens')}
              {tokensHook.hasUnsavedTokenChanges && (
                <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Unsaved changes"></span>
              )}
            </button>
          </div>
          
          {expandedSections.tokens && (
            <div className="mt-2 ml-6 space-y-4">
              
              {/* Colors Section */}
              <div>
                <button 
                  onClick={() => toggleSection('colors')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.colors ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Palette size={14} className="ml-1 mr-2" />
                  {t('colors')}
                </button>
                
                {expandedSections.colors && (
                  <div className="mt-2 ml-4 space-y-2">
                    {/* Couleurs existantes */}
                    {Object.entries(tokens.colors).map(([key, value]) => {
                      const isProtected = ['primary', 'secondary', 'success', 'danger'].includes(key);
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                              {key}
                            </label>
                            <input 
                              type="color" 
                              value={value}
                              onChange={(e) => updateColorToken(key, e.target.value)}
                              className="w-full h-6 rounded border"
                            />
                          </div>
                          {!isProtected && (
                            <button
                              onClick={() => removeColorToken(key)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded mt-4"
                              title={`Remove ${key} color`}
                            >
                              <Minus size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Ajouter nouvelle couleur */}
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <div className="text-xs font-medium text-gray-600 mb-2">Add Color</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newTokenInputs.colorName}
                          onChange={(e) => setNewTokenInputs(prev => ({ ...prev, colorName: e.target.value }))}
                          className="flex-1 text-xs border rounded px-2 py-1"
                        />
                        <input
                          type="color"
                          value={newTokenInputs.colorValue}
                          onChange={(e) => setNewTokenInputs(prev => ({ ...prev, colorValue: e.target.value }))}
                          className="w-8 h-6 rounded border"
                        />
                        <button
                          onClick={handleAddColorToken}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Typography Section */}
              <div>
                <button 
                  onClick={() => toggleSection('typography')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.typography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Type size={14} className="ml-1 mr-2" />
                  Typography
                </button>
                
                {expandedSections.typography && (
                  <div className="mt-2 ml-4 space-y-3">
                    {/* Font Presets */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Font Preset</label>
                      <select
                        onChange={(e) => e.target.value && applyFontPreset(e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Choose preset...</option>
                        {Object.entries(fontPresets).map(([key, preset]) => (
                          <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Primary Font</label>
                      <input 
                        type="text" 
                        value={tokens.typography.fontFamily}
                        onChange={(e) => updateTypographyToken('fontFamily', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="Font family"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Font</label>
                      <input 
                        type="text" 
                        value={tokens.typography.secondaryFont}
                        onChange={(e) => updateTypographyToken('secondaryFont', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="Secondary font family"
                      />
                    </div>
                    
                    {/* Font Sizes */}
                    {Object.entries(tokens.typography.sizes).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                          Size {key}
                        </label>
                        <input 
                          type="text" 
                          value={value}
                          onChange={(e) => updateTypographyToken(key, e.target.value)}
                          className="w-full text-xs border rounded px-2 py-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Spacing Section - 🆕 Sans sélecteur preset, avec indicateur automatique */}
              <div>
                <button 
                  onClick={() => toggleSection('spacing')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.spacing ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Move size={14} className="ml-1 mr-2" />
                  Spacing
                </button>
                
                {expandedSections.spacing && (
                  <div className="mt-2 ml-4 space-y-3">
                    {/* 🆕 Indicateur du preset automatique appliqué */}
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        🔄 Auto-Applied Preset
                      </div>
                      <div className="text-xs text-blue-600">
                        Using <strong>{getCurrentSpacingPreset()}</strong> spacing from {tokens.framework.type} framework
                      </div>
                    </div>
                    
                    {/* Spacing values */}
                    {Object.entries(tokens.spacing).map(([key, value]) => {
                      const isProtected = ['xs', 'sm', 'md', 'lg', 'xl'].includes(key);
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                              {key}
                            </label>
                            <input 
                              type="text" 
                              value={value}
                              onChange={(e) => updateSpacingToken(key, e.target.value)}
                              className="w-full text-xs border rounded px-2 py-1"
                            />
                          </div>
                          {!isProtected && (
                            <button
                              onClick={() => removeSpacingToken(key)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded mt-4"
                              title={`Remove ${key} spacing`}
                            >
                              <Minus size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Ajouter nouveau spacing */}
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <div className="text-xs font-medium text-gray-600 mb-2">Add Spacing</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newTokenInputs.spacingName}
                          onChange={(e) => setNewTokenInputs(prev => ({ ...prev, spacingName: e.target.value }))}
                          className="flex-1 text-xs border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={newTokenInputs.spacingValue}
                          onChange={(e) => setNewTokenInputs(prev => ({ ...prev, spacingValue: e.target.value }))}
                          className="flex-1 text-xs border rounded px-2 py-1"
                        />
                        <button
                          onClick={handleAddSpacingToken}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Branding Section */}
              <div>
                <button 
                  onClick={() => toggleSection('branding')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.branding ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Image size={14} className="ml-1 mr-2" />
                  Branding
                </button>
                
                {expandedSections.branding && (
                  <div className="mt-2 ml-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Brand Name</label>
                      <input 
                        type="text" 
                        value={tokens.branding.brandName}
                        onChange={(e) => updateBrandingToken('brandName', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="My Brand"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Logo URL</label>
                      <input 
                        type="url" 
                        value={tokens.branding.logoUrl}
                        onChange={(e) => updateBrandingToken('logoUrl', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Logo Alt Text</label>
                      <input 
                        type="text" 
                        value={tokens.branding.logoAlt}
                        onChange={(e) => updateBrandingToken('logoAlt', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="Logo description"
                      />
                    </div>
                    
                    {/* Logo Preview */}
                    {tokens.branding.logoUrl && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <div className="text-xs font-medium text-gray-600 mb-1">Preview</div>
                        <img 
                          src={tokens.branding.logoUrl} 
                          alt={tokens.branding.logoAlt}
                          className="max-w-full h-8 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Icons Section - 🆕 Avec Material Icons */}
              <div>
                <button 
                  onClick={() => toggleSection('icons')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.icons ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Star size={14} className="ml-1 mr-2" />
                  Icons
                </button>
                
                {expandedSections.icons && (
                  <div className="mt-2 ml-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icon Set</label>
                      <select
                        value={tokens.icons.set}
                        onChange={(e) => updateIconsToken('set', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                      >
                        {Object.entries(iconSetOptions).map(([key, option]) => (
                          <option key={key} value={key}>{option.name}</option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        {iconSetOptions[tokens.icons.set]?.description}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Default Size</label>
                      <input 
                        type="text" 
                        value={tokens.icons.size}
                        onChange={(e) => updateIconsToken('size', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                        placeholder="1rem"
                      />
                    </div>
                    
                    {/* Icon Set Info */}
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs font-medium text-gray-600 mb-1">Icon Set Info</div>
                      <div className="text-xs text-gray-500">
                        <div><strong>Name:</strong> {iconSetOptions[tokens.icons.set]?.name}</div>
                        <div><strong>Prefix:</strong> {iconSetOptions[tokens.icons.set]?.prefix}</div>
                        {iconSetOptions[tokens.icons.set]?.usage && (
                          <div className="mt-1"><strong>Usage:</strong><br/>
                            <code className="text-xs bg-gray-200 px-1 rounded">
                              {iconSetOptions[tokens.icons.set].usage}
                            </code>
                          </div>
                        )}
                        <div><strong>URL:</strong> 
                          <a 
                            href={iconSetOptions[tokens.icons.set]?.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            Visit
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Framework Section - 🆕 Avec indication du spacing automatique */}
              <div>
                <button 
                  onClick={() => toggleSection('framework')}
                  className="flex items-center text-left text-xs font-medium text-gray-600 hover:text-gray-800 w-full"
                >
                  {expandedSections.framework ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Settings size={14} className="ml-1 mr-2" />
                  Framework
                </button>
                
                {expandedSections.framework && (
                  <div className="mt-2 ml-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CSS Framework</label>
                      <select
                        value={tokens.framework.type}
                        onChange={(e) => {
                          updateFrameworkToken('type', e.target.value);
                          // Auto-update version to first available
                          const firstVersion = frameworkOptions[e.target.value]?.versions[0];
                          if (firstVersion) {
                            updateFrameworkToken('version', firstVersion);
                          }
                        }}
                        className="w-full text-xs border rounded px-2 py-1"
                      >
                        {Object.entries(frameworkOptions).map(([key, option]) => (
                          <option key={key} value={key}>{option.name}</option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        {frameworkOptions[tokens.framework.type]?.description}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Version</label>
                      <select
                        value={tokens.framework.version}
                        onChange={(e) => updateFrameworkToken('version', e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1"
                      >
                        {frameworkOptions[tokens.framework.type]?.versions.map(version => (
                          <option key={version} value={version}>{version}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Framework Info */}
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs font-medium text-gray-600 mb-1">Framework Info</div>
                      <div className="text-xs text-gray-500">
                        <div><strong>Type:</strong> {frameworkOptions[tokens.framework.type]?.utilityBased ? 'Utility-based' : 'Component-based'}</div>
                        <div><strong>CSS Prefix:</strong> {frameworkOptions[tokens.framework.type]?.cssPrefix || 'None'}</div>
                        <div><strong>Current:</strong> {frameworkOptions[tokens.framework.type]?.name} {tokens.framework.version}</div>
                        <div><strong>Auto Spacing:</strong> <span className="text-green-600">{frameworkOptions[tokens.framework.type]?.spacingPreset}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Component Categories */}
        {componentCategories.map((category) => (
          <div key={category.key} className="p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => toggleSection(category.key)}
                className="flex items-center text-left text-sm font-medium text-gray-700 hover:text-gray-900"
                title={getCategoryDescription(category.key)}
              >
                {expandedSections[category.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <div className={`w-4 h-4 ml-1 mr-2 ${getCategoryColor(category.key)} rounded`}></div>
                {getCategoryTranslation(category.key)}
              </button>
              <button
                onClick={() => handleAddComponent(category.key)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title={`${t('addComponent')} ${getCategoryTranslation(category.key)}`}
              >
                <Plus size={14} />
              </button>
            </div>
            
            {expandedSections[category.key] && (
              <div className="mt-2 ml-6 space-y-1">
                {Object.entries(components[category.key] || {}).map(([key, comp]) => {
                  const componentPath = ['atoms', 'molecules'].includes(category.key) 
                    ? key 
                    : `${category.key}.${key}`;
                  
                  return (
                    <div key={key} className="flex items-center group">
                      <button
                        onClick={() => setSelectedComponent(componentPath)}
                        className={`flex-1 text-left text-sm py-1 px-2 rounded ${
                          selectedComponent === componentPath 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {comp.name}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(category.key, key, comp.name)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title={`${t('deleteComponent')} ${comp.name}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={cancelDelete}
          ></div>
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl pointer-events-auto">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
                <h3 className="text-lg font-medium text-gray-900">{t('deleteComponent')}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {t('deleteConfirmation', { name: deleteConfirm.name })}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 size={16} className="mr-2" />
                  {t('delete')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;