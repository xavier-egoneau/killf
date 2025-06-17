import { useState } from 'react';
import { defaultTokens } from '../data/tokens';

/**
 * Hook for managing design tokens
 */
export const useTokens = () => {
  const [tokens, setTokens] = useState(defaultTokens);

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
    if (typographyKey === 'fontFamily') {
      setTokens(prev => ({
        ...prev,
        typography: {
          ...prev.typography,
          fontFamily: value
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
    setTokens,
    updateToken,
    updateColorToken,
    updateSpacingToken,
    updateTypographyToken,
    resetTokens,
    getTokenValue
  };
};