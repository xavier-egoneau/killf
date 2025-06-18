import { useState, useEffect } from 'react';
import { defaultComponents } from '../data/components';

const API_BASE = 'http://localhost:3001/api';

export const useComponents = () => {
  const [components, setComponents] = useState(defaultComponents);
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [currentProps, setCurrentProps] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // 🆕

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

  // 🔥 FIX: Fonction d'ajout avec gestion d'erreur et logging
  const addComponent = async (category, key, component) => {
    console.log(`🆕 addComponent called:`, { category, key, component: component.name });
    
    const newComponent = {
      ...component,
      category
    };

    try {
      // 🔥 FIX: Mise à jour locale APRÈS la sauvegarde réussie sur le serveur
      console.log('📤 Sending to server:', { category, key, component: newComponent.name });
      
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
          scss: newComponent.scss,
          template: newComponent.template // 🆕 Inclure le template dès la création
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`✅ Component ${key} saved successfully on server:`, result);

      // 🔥 FIX: Mise à jour locale seulement après succès serveur
      setComponents(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: newComponent
        }
      }));

      console.log(`✅ Component ${key} added locally`);
      return result;
      
    } catch (error) {
      console.error('❌ Add component failed:', error);
      throw error; // Re-throw pour que le caller puisse gérer l'erreur
    }
  };

  const removeComponent = async (category, key) => {
    console.log(`🗑️ removeComponent called:`, { category, key });
    
    try {
      // Suppression sur le serveur d'abord
      const response = await fetch(`${API_BASE}/components/${key}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete component on server: ${response.status}`);
      }
      
      console.log(`✅ Component ${key} deleted from server`);
      
      // Suppression locale après succès serveur
      setComponents(prev => {
        const newComponents = { ...prev };
        if (newComponents[category] && newComponents[category][key]) {
          delete newComponents[category][key];
        }
        return newComponents;
      });
      
      console.log(`✅ Component ${key} removed locally`);
      
    } catch (error) {
      console.error('❌ Remove component failed:', error);
      throw error;
    }
  };

  // 🔥 FIX: Fonction updateComponent avec gestion améliorée
  const updateComponent = async (category, key, updates) => {
    console.log('🔄 updateComponent called:', { category, key, updates });
    
    const currentComponent = components[category]?.[key];
    if (!currentComponent) {
      console.error('❌ Component not found:', { category, key });
      throw new Error(`Component ${key} not found in category ${category}`);
    }

    try {
      // Préparer le payload complet
      const payload = {
        id: key,
        name: currentComponent.name,
        category,
        props: updates.props || currentComponent.props,
        scss: updates.scss !== undefined ? updates.scss : currentComponent.scss,
        template: updates.template !== undefined ? updates.template : currentComponent.template
      };

      console.log('📤 Sending update to server:', {
        ...payload,
        template: payload.template ? `${payload.template.substring(0, 50)}...` : 'none',
        scss: payload.scss ? `${payload.scss.substring(0, 50)}...` : 'none'
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
      console.log(`✅ Component ${key} updated successfully on server:`, result);

      // 🔥 FIX: Mise à jour locale après succès serveur
      const updatedComponent = {
        ...currentComponent,
        ...updates
      };

      setComponents(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: updatedComponent
        }
      }));

      console.log(`✅ Component ${key} updated locally`);
      return result;
      
    } catch (error) {
      console.error('❌ Update component failed:', error);
      throw error; // Re-throw pour que le caller puisse gérer l'erreur
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

  // 🆕 Écouter les événements de création de composants
  useEffect(() => {
    const handleComponentCreated = (event) => {
      const { category, key, component } = event.detail;
      console.log('🎉 Component created event received:', { category, key, name: component.name });
      // Le composant est déjà ajouté via addComponent, pas besoin de mise à jour supplémentaire
    };

    window.addEventListener('componentCreated', handleComponentCreated);
    
    return () => {
      window.removeEventListener('componentCreated', handleComponentCreated);
    };
  }, []);

  return {
    components,
    selectedComponent,
    currentProps,
    isLoading,
    hasUnsavedChanges, // 🆕
    setComponents,
    setSelectedComponent,
    setCurrentProps,
    setHasUnsavedChanges, // 🆕
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