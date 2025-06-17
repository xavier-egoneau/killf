// components/Sidebar.jsx - Version avec i18n
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Palette, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { componentCategories } from '../data';
import { useI18n } from '../hooks/useI18n';

const Sidebar = ({ tokensHook, componentsHook }) => {
  const { t } = useI18n();
  
  const [expandedSections, setExpandedSections] = useState({
    tokens: true,
    atoms: true,
    molecules: false,
    organisms: false,
    templates: false,
    pages: false
  });

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { tokens, updateColorToken } = tokensHook;
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

  const handleAddToken = () => {
    const tokenName = prompt(`${t('enterNewTokenName')} (ex: "accent"):`);
    if (tokenName) {
      const tokenValue = prompt(`${t('enterTokenValue')} (ex: "#ff6b6b"):`);
      if (tokenValue) {
        updateColorToken(tokenName, tokenValue);
      }
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

  const isDefaultComponent = (category, key) => {
    return false;
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
              className="flex items-center text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {expandedSections.tokens ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Palette size={16} className="ml-1 mr-2" />
              {t('designTokens')}
            </button>
            <button
              onClick={handleAddToken}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title={t('addDesignToken')}
            >
              <Plus size={14} />
            </button>
          </div>
          
          {expandedSections.tokens && (
            <div className="mt-2 ml-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('primaryColor')}</label>
                <input 
                  type="color" 
                  value={tokens.colors.primary}
                  onChange={(e) => updateColorToken('primary', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('secondaryColor')}</label>
                <input 
                  type="color" 
                  value={tokens.colors.secondary}
                  onChange={(e) => updateColorToken('secondary', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('successColor')}</label>
                <input 
                  type="color" 
                  value={tokens.colors.success}
                  onChange={(e) => updateColorToken('success', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('dangerColor')}</label>
                <input 
                  type="color" 
                  value={tokens.colors.danger}
                  onChange={(e) => updateColorToken('danger', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              {/* Show additional colors dynamically */}
              {Object.entries(tokens.colors)
                .filter(([key]) => !['primary', 'secondary', 'success', 'danger'].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {key} Color
                    </label>
                    <input 
                      type="color" 
                      value={value}
                      onChange={(e) => updateColorToken(key, e.target.value)}
                      className="w-full h-8 rounded border"
                    />
                  </div>
                ))}
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
                  
                  const isDefault = isDefaultComponent(category.key, key);
                  
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