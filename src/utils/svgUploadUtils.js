/**
 * Utilitaires pour l'upload et la gestion des SVG
 */

/**
 * Valide si un fichier est un SVG valide
 * @param {File} file - Le fichier à valider
 * @returns {Promise<{isValid: boolean, error?: string}>}
 */
export const validateSVGFile = async (file) => {
  // Vérifier l'extension
  if (!file.name.toLowerCase().endsWith('.svg')) {
    return { isValid: false, error: 'Le fichier doit avoir une extension .svg' };
  }

  // Vérifier le type MIME
  if (!file.type.includes('svg')) {
    return { isValid: false, error: 'Le type de fichier doit être image/svg+xml' };
  }

  // Vérifier la taille (max 500KB pour un SVG)
  if (file.size > 500 * 1024) {
    return { isValid: false, error: 'Le fichier SVG est trop volumineux (max 500KB)' };
  }

  // Vérifier le contenu SVG
  try {
    const content = await file.text();
    
    // Vérifier que c'est bien du XML/SVG
    if (!content.trim().startsWith('<svg') && !content.includes('<svg')) {
      return { isValid: false, error: 'Le fichier ne contient pas de SVG valide' };
    }

    // Vérifier qu'il n'y a pas de scripts (sécurité)
    if (content.toLowerCase().includes('<script')) {
      return { isValid: false, error: 'Les SVG avec scripts ne sont pas autorisés' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Impossible de lire le contenu du fichier' };
  }
};

/**
 * Convertit un fichier SVG en Data URL
 * @param {File} file - Le fichier SVG
 * @returns {Promise<string>} - Data URL du SVG
 */
export const convertSVGToDataURL = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Optimise un SVG en supprimant les éléments inutiles
 * @param {string} svgContent - Le contenu SVG
 * @returns {string} - SVG optimisé
 */
export const optimizeSVG = (svgContent) => {
  let optimized = svgContent;
  
  // Supprimer les commentaires XML
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
  
  // Supprimer les espaces multiples
  optimized = optimized.replace(/\s+/g, ' ');
  
  // Supprimer les attributs inutiles courants
  const unnecessaryAttrs = [
    'xmlns:xlink',
    'xml:space',
    'enable-background',
    'data-name',
    'id="Layer_\\d+"'
  ];
  
  unnecessaryAttrs.forEach(attr => {
    const regex = new RegExp(`\\s*${attr}="[^"]*"`, 'gi');
    optimized = optimized.replace(regex, '');
  });
  
  // Nettoyer les espaces en début/fin
  optimized = optimized.trim();
  
  return optimized;
};

/**
 * Extrait les dimensions d'un SVG
 * @param {string} svgContent - Le contenu SVG
 * @returns {{width?: number, height?: number, viewBox?: string}}
 */
export const extractSVGDimensions = (svgContent) => {
  const dimensions = {};
  
  // Chercher width et height
  const widthMatch = svgContent.match(/width\s*=\s*["']?(\d+(?:\.\d+)?)/i);
  const heightMatch = svgContent.match(/height\s*=\s*["']?(\d+(?:\.\d+)?)/i);
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  
  if (widthMatch) dimensions.width = parseFloat(widthMatch[1]);
  if (heightMatch) dimensions.height = parseFloat(heightMatch[1]);
  if (viewBoxMatch) dimensions.viewBox = viewBoxMatch[1];
  
  return dimensions;
};

/**
 * Génère un aperçu SVG redimensionné
 * @param {string} dataURL - Data URL du SVG
 * @param {number} maxWidth - Largeur max pour l'aperçu
 * @param {number} maxHeight - Hauteur max pour l'aperçu
 * @returns {Promise<string>} - Data URL du SVG redimensionné
 */
export const generateSVGPreview = async (dataURL, maxWidth = 100, maxHeight = 100) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculer les nouvelles dimensions en gardant le ratio
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convertir en Data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject(new Error('Impossible de générer l\'aperçu'));
    };
    
    img.src = dataURL;
  });
};

/**
 * Valide une URL d'image
 * @param {string} url - URL à valider
 * @returns {Promise<boolean>}
 */
export const validateImageURL = async (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Vérifier le format URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Vérifier que l'image existe et est accessible
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout après 5 secondes
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * Nettoie une Data URL (supprime les métadonnées inutiles)
 * @param {string} dataURL - Data URL à nettoyer
 * @returns {string} - Data URL nettoyée
 */
export const cleanDataURL = (dataURL) => {
  if (!dataURL || !dataURL.startsWith('data:')) {
    return dataURL;
  }
  
  // Supprimer les paramètres inutiles du type MIME
  return dataURL.replace(/data:image\/svg\+xml[^,]*,/, 'data:image/svg+xml;base64,');
};

/**
 * Convertit une Data URL SVG en contenu SVG
 * @param {string} dataURL - Data URL du SVG
 * @returns {string} - Contenu SVG décodé
 */
export const dataURLToSVGContent = (dataURL) => {
  if (!dataURL || !dataURL.startsWith('data:image/svg+xml')) {
    return '';
  }
  
  try {
    const base64Data = dataURL.split(',')[1];
    if (!base64Data) return '';
    
    return atob(base64Data);
  } catch (error) {
    console.error('Erreur lors du décodage de la Data URL:', error);
    return '';
  }
};

/**
 * Formats de fichiers supportés
 */
export const SUPPORTED_FORMATS = {
  svg: {
    extensions: ['.svg'],
    mimeTypes: ['image/svg+xml'],
    maxSize: 500 * 1024, // 500KB
    description: 'Fichiers SVG uniquement'
  }
};

/**
 * Messages d'erreur localisés
 */
export const ERROR_MESSAGES = {
  en: {
    invalidExtension: 'File must have .svg extension',
    invalidMimeType: 'File type must be image/svg+xml',
    fileTooLarge: 'SVG file is too large (max 500KB)',
    invalidContent: 'File does not contain valid SVG',
    scriptsNotAllowed: 'SVG files with scripts are not allowed',
    readError: 'Unable to read file content',
    previewError: 'Unable to generate preview',
    networkError: 'Unable to load image from URL'
  },
  fr: {
    invalidExtension: 'Le fichier doit avoir une extension .svg',
    invalidMimeType: 'Le type de fichier doit être image/svg+xml',
    fileTooLarge: 'Le fichier SVG est trop volumineux (max 500KB)',
    invalidContent: 'Le fichier ne contient pas de SVG valide',
    scriptsNotAllowed: 'Les SVG avec scripts ne sont pas autorisés',
    readError: 'Impossible de lire le contenu du fichier',
    previewError: 'Impossible de générer l\'aperçu',
    networkError: 'Impossible de charger l\'image depuis l\'URL'
  }
};