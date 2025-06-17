import { useState, useEffect } from 'react';
import { defaultComponents } from '../data/components';

const API_BASE = 'http://localhost:3001/api';

/**
 * Hook for managing components and their state
 */
export const useComponents = () => {
  const [components, setComponents] = useState({});
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [currentProps, setCurrentProps] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/components`)
      .then(res => res.json())
      .then(data => {
        setComponents(data);
      })
      .catch(err => {
        console.error('Failed to load components from API:', err);
        setComponents(defaultComponents); // fallback
      });
  }, []);


  // Helper function to get component by path
  const getComponent = (componentPath) => {
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return (components.atoms?.[componentPath] || components.molecules?.[componentPath]) || null;

  };


  // Update current props when selected component changes
  useEffect(() => {
    const comp = getComponent(selectedComponent);
    if (comp && comp.props) {
      const defaultProps = {};
      Object.entries(comp.props).forEach(([key, config]) => {
        defaultProps[key] = config.default;
      });
      setCurrentProps(defaultProps);
    }
  }, [selectedComponent, components]);

  const addComponent = (category, key, component) => {
    setComponents(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...component,
          category
        }
      }
    }));
  };

  const removeComponent = (category, key) => {
    setComponents(prev => {
      const newComponents = { ...prev };
      if (newComponents[category] && newComponents[category][key]) {
        delete newComponents[category][key];
      }
      return newComponents;
    });
  };

  const updateComponent = (category, key, updates) => {
    const updated = {
      ...components[category][key],
      ...updates
    };

    // Local update
    setComponents(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: updated
      }
    }));

    // Remote save
    fetch(`${API_BASE}/components/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: key,
        name: updated.name,
        category,
        props: updated.props,
        scss: updated.scss
      })
    }).then(res => {
      if (!res.ok) {
        console.warn('Failed to save component to backend');
      }
    }).catch(err => {
      console.error('Save error:', err);
    });
  };

  const updateComponentProp = (propKey, value) => {
    setCurrentProps(prev => ({
      ...prev,
      [propKey]: value
    }));
  };

  const getComponentProps = () => {
    const comp = getComponent(selectedComponent);
    return comp && comp.props ? comp.props : {};
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
