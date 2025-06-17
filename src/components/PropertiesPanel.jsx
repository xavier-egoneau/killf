import React from 'react';
import { Settings } from 'lucide-react';

const PropertiesPanel = ({ componentsHook }) => {
  const { currentProps, updateComponentProp, getComponentProps } = componentsHook;
  const componentProps = getComponentProps();

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Settings size={18} className="mr-2" />
        Properties
      </h3>
      
      <div className="space-y-4">
        {Object.entries(componentProps).map(([propKey, config]) => (
          <div key={propKey}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {propKey}
            </label>
            
            {config.type === 'select' && (
              <select
                value={currentProps[propKey] || config.default}
                onChange={(e) => updateComponentProp(propKey, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {config.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {config.type === 'string' && (
              <input
                type="text"
                value={currentProps[propKey] || config.default}
                onChange={(e) => updateComponentProp(propKey, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            )}
            
            {config.type === 'boolean' && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentProps[propKey] !== undefined ? currentProps[propKey] : config.default}
                  onChange={(e) => updateComponentProp(propKey, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            )}
          </div>
        ))}
        
        {Object.keys(componentProps).length === 0 && (
          <div className="text-gray-500 text-sm">
            No properties available for this component.
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;