// hooks/useComponents.js - Version avec support Angular automatique

import { useState, useEffect } from 'react';
import { defaultComponents } from '../data/components';
import { addAngularExamplesToComponents } from '../data/angularExamples';

const API_BASE = 'http://localhost:3001/api';

export const useComponents = () => {
  const [components, setComponents] = useState(defaultComponents);
  const [selectedComponent, setSelectedComponent] = useState('button');
  const [currentProps, setCurrentProps] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentFramework, setCurrentFramework] = useState('vanilla');

  // 🆕 Écouter les changements de framework depuis les tokens
  useEffect(() => {
    const handleFrameworkChange = (event) => {
      if (event.detail && event.detail.framework) {
        const newFramework = event.detail.framework.type;
        
        if (newFramework !== currentFramework) {
          console.log(`🔄 Framework changed from ${currentFramework} to ${newFramework}`);
          setCurrentFramework(newFramework);
          
          // 🆕 Ajouter automatiquement les composants Angular si nécessaire
          if (newFramework === 'angular') {
            addAngularComponentsToSystem();
          }
        }
      }
    };

    window.addEventListener('frameworkChanged', handleFrameworkChange);
    
    return () => {
      window.removeEventListener('frameworkChanged', handleFrameworkChange);
    };
  }, [currentFramework]);

  // 🆕 Fonction pour ajouter les composants Angular
  const addAngularComponentsToSystem = async () => {
    console.log('🅰️ Adding Angular components to the system...');
    
    try {
      const enhancedComponents = addAngularExamplesToComponents(components);
      setComponents(enhancedComponents);
      
      // Sauvegarder les nouveaux composants sur le serveur
      const angularComponents = {
        'angular-button': enhancedComponents.atoms['angular-button'],
        'angular-input': enhancedComponents.atoms['angular-input'],
        'angular-card': enhancedComponents.molecules['angular-card'],
        'angular-toolbar': enhancedComponents.organisms['angular-toolbar']
      };

      // Sauvegarder chaque composant Angular
      for (const [key, component] of Object.entries(angularComponents)) {
        try {
          await addComponent(component.category, key, component);
          console.log(`✅ Angular component ${key} added successfully`);
        } catch (error) {
          console.warn(`⚠️ Failed to save Angular component ${key}:`, error.message);
          // Continue avec les autres composants même si un échoue
        }
      }

      // Sélectionner automatiquement le premier composant Angular
      setSelectedComponent('angular-button');
      
      // Notification à l'utilisateur
      const notification = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Angular Material components added to your design system!',
          duration: 4000
        }
      });
      window.dispatchEvent(notification);
      
    } catch (error) {
      console.error('❌ Failed to add Angular components:', error);
      
      const notification = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Failed to add Angular components. You can add them manually.',
          duration: 4000
        }
      });
      window.dispatchEvent(notification);
    }
  };

  // Charger les composants depuis l'API (code existant...)
  useEffect(() => {
    setIsLoading(true);
    
    fetch(`${API_BASE}/components`)
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
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

  // Update current props when selected component changes
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

  // 🆕 Fonction d'ajout avec détection de framework
  const addComponent = async (category, key, component) => {
    console.log(`🆕 addComponent called:`, { category, key, component: component.name });
    
    const newComponent = {
      ...component,
      category
    };

    try {
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
          template: newComponent.template
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`✅ Component ${key} saved successfully on server:`, result);

      // Mise à jour locale seulement après succès serveur
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
      throw error;
    }
  };

  const removeComponent = async (category, key) => {
    console.log(`🗑️ removeComponent called:`, { category, key });
    
    try {
      const response = await fetch(`${API_BASE}/components/${key}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete component on server: ${response.status}`);
      }
      
      console.log(`✅ Component ${key} deleted from server`);
      
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

  const updateComponent = async (category, key, updates) => {
    console.log('🔄 updateComponent called:', { category, key, updates });
    
    const currentComponent = components[category]?.[key];
    if (!currentComponent) {
      console.error('❌ Component not found:', { category, key });
      throw new Error(`Component ${key} not found in category ${category}`);
    }

    try {
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
      throw error;
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

  // 🆕 Fonction utilitaire pour créer un composant Angular rapide
  const createAngularComponent = async (componentType, customName) => {
    const { getAngularQuickTemplate, getAngularQuickProps } = await import('../data/angularExamples');
    
    const template = getAngularQuickTemplate(componentType);
    const props = getAngularQuickProps(componentType);
    
    const componentName = customName || `Angular ${componentType.charAt(0).toUpperCase() + componentType.slice(1)}`;
    const componentKey = componentName.toLowerCase().replace(/\s+/g, '-');
    
    const category = componentType === 'toolbar' ? 'organisms' : 
                    componentType === 'card' ? 'molecules' : 'atoms';
    
    const newComponent = {
      name: componentName,
      category,
      template,
      props,
      scss: `/* ${componentName} styles */\n/* Add your custom Angular Material styles here */`
    };
    
    try {
      await addComponent(category, componentKey, newComponent);
      setSelectedComponent(componentKey);
      
      return {
        success: true,
        componentKey,
        category
      };
    } catch (error) {
      console.error('Failed to create Angular component:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 🆕 Détection automatique du framework pour suggestions
  const getFrameworkSpecificSuggestions = (componentType) => {
    if (currentFramework === 'angular') {
      return {
        template: getAngularQuickTemplate(componentType),
        props: getAngularQuickProps(componentType),
        framework: 'angular'
      };
    }
    
    // Ajouter d'autres frameworks ici
    return null;
  };

  // Écouter les événements de création de composants
  useEffect(() => {
    const handleComponentCreated = (event) => {
      const { category, key, component } = event.detail;
      console.log('🎉 Component created event received:', { category, key, name: component.name });
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
    hasUnsavedChanges,
    currentFramework, // 🆕
    setComponents,
    setSelectedComponent,
    setCurrentProps,
    setHasUnsavedChanges,
    getComponent,
    addComponent,
    removeComponent,
    updateComponent,
    updateComponentProp,
    getComponentProps,
    getAllComponents,
    getComponentsByCategory,
    duplicateComponent,
    createAngularComponent, // 🆕
    getFrameworkSpecificSuggestions, // 🆕
    addAngularComponentsToSystem // 🆕
  };
};