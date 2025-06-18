import { useState, useEffect } from 'react';
import { defaultTokens, spacingPresets, fontPresets } from '../data/tokens';

const API_BASE = 'http://localhost:3001/api';

/**
 * Hook for managing design tokens with server persistence
 */
export const useTokens = () => {
  const [tokens, setTokens] = useState(defaultTokens);
  const [originalTokens, setOriginalTokens] = useState(defaultTokens);
  const [hasUnsavedTokenChanges, setHasUnsavedTokenChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les tokens depuis le serveur au démarrage
  useEffect(() => {
    setIsLoading(true);
    
    fetch(`${API_BASE}/tokens`)
      .then(res => {
        if (!res.ok) throw new Error('Tokens API not available');
        return res.json();
      })
      .then(data => {
        console.log('✅ Tokens loaded from server:', data);
        const loadedTokens = { ...defaultTokens, ...data };
        setTokens(loadedTokens);
        setOriginalTokens(loadedTokens);
        setHasUnsavedTokenChanges(false);
      })
      .catch(err => {
        console.warn('⚠️ Failed to load tokens from server, using defaults:', err.message);
        setTokens(defaultTokens);
        setOriginalTokens(defaultTokens);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Vérifier les changements dans les tokens
  useEffect(() => {
    const hasChanges = JSON.stringify(tokens) !== JSON.stringify(originalTokens);
    setHasUnsavedTokenChanges(hasChanges);
  }, [tokens, originalTokens]);

  // Sauvegarder les tokens sur le serveur
  const saveTokens = async () => {
    if (!hasUnsavedTokenChanges) {
      console.log('⚠️ No token changes to save');
      return { success: true, message: 'No changes to save' };
    }

    try {
      console.log('💾 Saving tokens to server...', tokens);
      
      const response = await fetch(`${API_BASE}/tokens`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tokens)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server responded with ${response.status}: ${errorData.error}`);
      }

      const result = await response.json();
      
      // Mettre à jour les états après une sauvegarde réussie
      setOriginalTokens({ ...tokens });
      setHasUnsavedTokenChanges(false);
      
      console.log('✅ Tokens saved successfully:', result);
      return { success: true, message: 'Tokens saved successfully', data: result };
      
    } catch (error) {
      console.error('❌ Failed to save tokens:', error);
      return { success: false, message: error.message };
    }
  };

  // Écouter l'événement Save All global
  useEffect(() => {
    const handleSaveAll = async () => {
      console.log('🔄 Save All triggered for Tokens');
      if (hasUnsavedTokenChanges) {
        const result = await saveTokens();
        
        // Dispatcher un événement pour informer les autres composants
        window.dispatchEvent(new CustomEvent('tokensSaveResult', { 
          detail: result 
        }));
      }
    };

    window.addEventListener('saveAll', handleSaveAll);
    
    return () => {
      window.removeEventListener('saveAll', handleSaveAll);
    };
  }, [hasUnsavedTokenChanges, tokens]);

  const updateToken = (path, value) => {
    setTokens(prev => {
      const newTokens = { ...prev };
      const keys = path.split('.');
      let current = newTokens;
      
      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the value
      current[keys[keys.length - 1]] = value;
      return newTokens;
    });
  };

  const updateColorToken = (colorKey, value) => {
    setTokens(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const updateSpacingToken = (spacingKey, value) => {
    setTokens(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value
      }
    }));
  };

  const updateTypographyToken = (typographyKey, value) => {
    if (typographyKey === 'fontFamily' || typographyKey === 'secondaryFont') {
      setTokens(prev => ({
        ...prev,
        typography: {
          ...prev.typography,
          [typographyKey]: value
        }
      }));
    } else {
      // Handle nested typography sizes
      setTokens(prev => ({
        ...prev,
        typography: {
          ...prev.typography,
          sizes: {
            ...prev.typography.sizes,
            [typographyKey]: value
          }
        }
      }));
    }
  };

  const updateBrandingToken = (brandingKey, value) => {
    setTokens(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [brandingKey]: value
      }
    }));
  };

  const updateIconsToken = (iconKey, value) => {
    setTokens(prev => ({
      ...prev,
      icons: {
        ...prev.icons,
        [iconKey]: value
      }
    }));
  };

  const updateFrameworkToken = (frameworkKey, value) => {
    setTokens(prev => ({
      ...prev,
      framework: {
        ...prev.framework,
        [frameworkKey]: value
      }
    }));
  };

  // Applique un preset de spacing
  const applySpacingPreset = (presetName) => {
    const preset = spacingPresets[presetName];
    if (preset) {
      setTokens(prev => ({
        ...prev,
        spacing: { ...preset }
      }));
    }
  };

  // Applique un preset de fonts
  const applyFontPreset = (presetName) => {
    const preset = fontPresets[presetName];
    if (preset) {
      setTokens(prev => ({
        ...prev,
        typography: {
          ...prev.typography,
          fontFamily: preset.primary,
          secondaryFont: preset.secondary
        }
      }));
    }
  };

  // Ajoute un nouveau token de couleur
  const addColorToken = (name, value) => {
    setTokens(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [name]: value
      }
    }));
  };

  // Supprime un token de couleur
  const removeColorToken = (name) => {
    // Ne pas supprimer les couleurs de base
    const protectedColors = ['primary', 'secondary', 'success', 'danger'];
    if (protectedColors.includes(name)) return;

    setTokens(prev => {
      const newColors = { ...prev.colors };
      delete newColors[name];
      return {
        ...prev,
        colors: newColors
      };
    });
  };

  // Ajoute un nouveau token de spacing
  const addSpacingToken = (name, value) => {
    setTokens(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [name]: value
      }
    }));
  };

  // Supprime un token de spacing
  const removeSpacingToken = (name) => {
    // Ne pas supprimer les tailles de base
    const protectedSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    if (protectedSizes.includes(name)) return;

    setTokens(prev => {
      const newSpacing = { ...prev.spacing };
      delete newSpacing[name];
      return {
        ...prev,
        spacing: newSpacing
      };
    });
  };

  const resetTokens = () => {
    setTokens(defaultTokens);
  };

  const getTokenValue = (path) => {
    const keys = path.split('.');
    let current = tokens;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  };

  return {
    tokens,
    originalTokens,
    hasUnsavedTokenChanges,
    isLoading,
    setTokens,
    updateToken,
    updateColorToken,
    updateSpacingToken,
    updateTypographyToken,
    updateBrandingToken,
    updateIconsToken,
    updateFrameworkToken,
    applySpacingPreset,
    applyFontPreset,
    addColorToken,
    removeColorToken,
    addSpacingToken,
    removeSpacingToken,
    resetTokens,
    getTokenValue,
    saveTokens
  };
};