import { useState, useEffect } from 'react';
import { defaultComponents } from '../data/components';

const API_BASE = 'http://localhost:3001/api';

export const useComponents = () => {
  const [components, setComponents] = useState(defaultComponents);
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [currentProps, setCurrentProps] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Charger les composants depuis l'API
  useEffect(() => {
    setIsLoading(true);
    
    fetch(`${API_BASE}/components`)
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        // Merger les données de l'API avec les defaults
        const mergedComponents = { ...defaultComponents };
        
        Object.keys(data).forEach(category => {
          if (!mergedComponents[category]) mergedComponents[category] = {};
          Object.keys(data[category]).forEach(key => {
            mergedComponents[category][key] = {
              ...mergedComponents[category][key],
              ...data[category][key]
            };
          });
        });
        
        setComponents(mergedComponents);
        console.log('✅ Components loaded from API and merged with defaults');
      })
      .catch(err => {
        console.warn('⚠️ Failed to load components from API, using defaults:', err.message);
        setComponents(defaultComponents);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getComponent = (componentPath) => {
    if (!componentPath) return null;
    
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category]?.[key] || null;
    }
    
    return components.atoms?.[componentPath] || 
           components.molecules?.[componentPath] || 
           null;
  };

  // Update current props when selected component changes OR when component props definition changes
  useEffect(() => {
    const comp = getComponent(selectedComponent);
    if (comp && comp.props) {
      const defaultProps = {};
      Object.entries(comp.props).forEach(([key, config]) => {
        defaultProps[key] = config.default;
      });
      setCurrentProps(defaultProps);
      console.log('🔄 Updated currentProps from component definition:', defaultProps);
    } else {
      setCurrentProps({});
    }
  }, [selectedComponent, components]);

  const addComponent = async (category, key, component) => {
    const newComponent = {
      ...component,
      category
    };

    // Mise à jour locale immédiate
    setComponents(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: newComponent
      }
    }));

    // Sauvegarde sur le serveur
    try {
      const response = await fetch(`${API_BASE}/components/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: key,
          name: newComponent.name,
          category,
          props: newComponent.props,
          scss: newComponent.scss
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save component');
      }
      
      console.log(`✅ Component ${key} saved successfully`);
    } catch (err) {
      console.error('❌ Save error:', err);
    }
  };

  const removeComponent = async (category, key) => {
    // Suppression locale
    setComponents(prev => {
      const newComponents = { ...prev };
      if (newComponents[category] && newComponents[category][key]) {
        delete newComponents[category][key];
      }
      return newComponents;
    });

    // Suppression sur le serveur
    try {
      await fetch(`${API_BASE}/components/${key}`, {
        method: 'DELETE'
      });
      console.log(`✅ Component ${key} deleted`);
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  const updateComponent = async (category, key, updates) => {
    console.log('🔄 updateComponent called:', { category, key, updates });
    
    const currentComponent = components[category]?.[key];
    if (!currentComponent) {
      console.error('❌ Component not found:', { category, key });
      return;
    }

    const updated = {
      ...currentComponent,
      ...updates
    };

    // Mise à jour locale immédiate
    setComponents(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: updated
      }
    }));

    // Sauvegarde sur le serveur avec template inclus
    try {
      const payload = {
        id: key,
        name: updated.name,
        category,
        props: updated.props,
        scss: updated.scss
      };

      // Inclure le template s'il existe dans les updates
      if ('template' in updates) {
        payload.template = updates.template;
      }

      console.log('📤 Sending to server:', {
        ...payload,
        template: payload.template ? `${payload.template.substring(0, 50)}...` : 'none'
      });

      const response = await fetch(`${API_BASE}/components/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server responded with ${response.status}: ${errorData.error}`);
      }
      
      const result = await response.json();
      console.log(`✅ Component ${key} updated successfully:`, result);
      
      return result;
    } catch (err) {
      console.error('❌ Update error:', err);
      throw err; // Re-throw pour que le caller puisse gérer l'erreur
    }
  };

  const updateComponentProp = (propKey, value) => {
    setCurrentProps(prev => ({
      ...prev,
      [propKey]: value
    }));
  };

  const getComponentProps = () => {
    const comp = getComponent(selectedComponent);
    return comp?.props || {};
  };

  const getAllComponents = () => {
    const allComponents = [];
    Object.entries(components).forEach(([category, categoryComponents]) => {
      Object.entries(categoryComponents).forEach(([key, component]) => {
        allComponents.push({
          key: category === 'atoms' || category === 'molecules' ? key : `${category}.${key}`,
          category,
          ...component
        });
      });
    });
    return allComponents;
  };

  const getComponentsByCategory = (category) => {
    return Object.entries(components[category] || {}).map(([key, component]) => ({
      key: category === 'atoms' || category === 'molecules' ? key : `${category}.${key}`,
      category,
      ...component
    }));
  };

  const duplicateComponent = (componentPath, newName) => {
    const comp = getComponent(componentPath);
    if (!comp) return;

    const category = comp.category;
    const newKey = newName.toLowerCase().replace(/\s+/g, '');

    const duplicatedComponent = {
      ...comp,
      name: newName
    };

    addComponent(category, newKey, duplicatedComponent);
  };

  return {
    components,
    selectedComponent,
    currentProps,
    isLoading,
    setComponents,
    setSelectedComponent,
    setCurrentProps,
    getComponent,
    addComponent,
    removeComponent,
    updateComponent,
    updateComponentProp,
    getComponentProps,
    getAllComponents,
    getComponentsByCategory,
    duplicateComponent
  };
};