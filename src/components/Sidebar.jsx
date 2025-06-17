import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Palette, Plus } from 'lucide-react';
import { componentCategories } from '../data';

const Sidebar = ({ tokensHook, componentsHook }) => {
  const [expandedSections, setExpandedSections] = useState({
    tokens: true,
    atoms: true,
    molecules: false,
    organisms: false,
    templates: false,
    pages: false
  });

  const { tokens, updateColorToken } = tokensHook;
  const { components, selectedComponent, setSelectedComponent, addComponent } = componentsHook;

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
    const tokenName = prompt('Enter new token name (e.g., "accent"):');
    if (tokenName) {
      const tokenValue = prompt('Enter token value (e.g., "#ff6b6b"):');
      if (tokenValue) {
        updateColorToken(tokenName, tokenValue);
      }
    }
  };

  const handleAddComponent = (category) => {
    const componentName = prompt(`Enter new ${category} component name:`);
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
            title: { type: 'string', default: 'Title' },
            content: { type: 'string', default: 'Content' }
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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Design System Builder</h1>
        <p className="text-sm text-gray-500">AI Friendly</p>
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
              Design Tokens
            </button>
            <button
              onClick={handleAddToken}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Add Design Token"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {expandedSections.tokens && (
            <div className="mt-2 ml-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Primary Color</label>
                <input 
                  type="color" 
                  value={tokens.colors.primary}
                  onChange={(e) => updateColorToken('primary', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Color</label>
                <input 
                  type="color" 
                  value={tokens.colors.secondary}
                  onChange={(e) => updateColorToken('secondary', e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
              {/* Show additional colors dynamically */}
              {Object.entries(tokens.colors)
                .filter(([key]) => !['primary', 'secondary'].includes(key))
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
              >
                {expandedSections[category.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <div className={`w-4 h-4 ml-1 mr-2 ${getCategoryColor(category.key)} rounded`}></div>
                {category.name}
              </button>
              <button
                onClick={() => handleAddComponent(category.key)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title={`Add ${category.name} Component`}
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
                    <button
                      key={key}
                      onClick={() => setSelectedComponent(componentPath)}
                      className={`block w-full text-left text-sm py-1 px-2 rounded ${
                        selectedComponent === componentPath 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {comp.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;