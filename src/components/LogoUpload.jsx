// components/LogoUpload.jsx - Composant d'upload de logo SVG
import React, { useState, useRef } from 'react';
import { Upload, X, ExternalLink, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { 
  validateSVGFile, 
  convertSVGToDataURL, 
  optimizeSVG, 
  validateImageURL,
  extractSVGDimensions,
  ERROR_MESSAGES 
} from '../utils/svgUploadUtils';

const LogoUpload = ({ 
  logoUrl, 
  logoAlt, 
  onLogoChange, 
  onAltChange 
}) => {
  const { t, locale } = useI18n();
  const fileInputRef = useRef(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' ou 'url'
  const [urlInput, setUrlInput] = useState('');
  const [svgInfo, setSvgInfo] = useState(null);

  // Messages d'erreur localisés
  const getErrorMessage = (key) => {
    return ERROR_MESSAGES[locale]?.[key] || ERROR_MESSAGES.en[key];
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // Validation du fichier
      const validation = await validateSVGFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Conversion en Data URL
      const dataURL = await convertSVGToDataURL(file);
      
      // Optimisation du SVG
      const svgContent = await file.text();
      const optimizedSVG = optimizeSVG(svgContent);
      const dimensions = extractSVGDimensions(optimizedSVG);
      
      // Mise à jour des informations SVG
      setSvgInfo({
        name: file.name,
        size: file.size,
        dimensions,
        optimized: optimizedSVG.length < svgContent.length
      });

      // Mise à jour du logo
      onLogoChange(dataURL);
      
      // Message de succès
      setSuccess(`✅ Logo uploaded successfully! (${Math.round(file.size / 1024)}KB)`);
      
      console.log('✅ Logo SVG uploaded:', {
        name: file.name,
        size: file.size,
        dimensions,
        dataURLLength: dataURL.length
      });

    } catch (err) {
      console.error('❌ Logo upload failed:', err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Gestion du clic sur l'input file
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Gestion du drag & drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Gestion de l'URL
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const isValid = await validateImageURL(urlInput);
      if (!isValid) {
        throw new Error(getErrorMessage('networkError'));
      }

      onLogoChange(urlInput);
      setSuccess('✅ Logo URL updated successfully!');
      setSvgInfo(null); // Reset SVG info pour les URLs
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Suppression du logo
  const handleRemoveLogo = () => {
    onLogoChange('');
    setSvgInfo(null);
    setSuccess('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode selector */}
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={() => setMode('upload')}
          className={`px-2 py-1 rounded ${
            mode === 'upload' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📁 Upload SVG
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-2 py-1 rounded ${
            mode === 'url' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔗 URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <>
          {/* File input hidden */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Drop zone */}
          <div
            onClick={handleFileInputClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all
              ${dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex flex-col items-center text-center">
              <Upload 
                size={24} 
                className={`mb-2 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} 
              />
              <div className="text-xs text-gray-600">
                {isUploading ? (
                  <span className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <div className="font-medium">Click or drag SVG file</div>
                    <div className="text-gray-500">Max 500KB</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/logo.svg"
            className="flex-1 text-xs border rounded px-2 py-1"
            disabled={isUploading}
          />
          <button
            onClick={handleUrlSubmit}
            disabled={isUploading || !urlInput.trim()}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? '...' : 'Set'}
          </button>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <AlertCircle size={14} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          <CheckCircle size={14} className="mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* SVG Info */}
      {svgInfo && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <div className="font-medium text-blue-800 mb-1">SVG Information</div>
          <div className="text-blue-700 space-y-1">
            <div>📁 {svgInfo.name}</div>
            <div>📏 {Math.round(svgInfo.size / 1024)}KB</div>
            {svgInfo.dimensions.width && (
              <div>📐 {svgInfo.dimensions.width}×{svgInfo.dimensions.height}</div>
            )}
            {svgInfo.optimized && (
              <div className="text-green-600">✨ Optimized</div>
            )}
          </div>
        </div>
      )}

      {/* Logo Alt Text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Logo Alt Text
        </label>
        <input
          type="text"
          value={logoAlt}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Logo description"
          className="w-full text-xs border rounded px-2 py-1"
        />
      </div>

      {/* Preview */}
      {logoUrl && (
        <div className="p-2 bg-gray-50 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Preview</span>
            <button
              onClick={handleRemoveLogo}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Remove logo"
            >
              <X size={12} />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="max-w-full h-8 object-contain bg-white rounded border"
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load logo preview');
              }}
            />
            <div className="flex-1 text-xs text-gray-500">
              {logoUrl.startsWith('data:') ? (
                <div>
                  <div>📁 Uploaded SVG</div>
                  <div>💾 {Math.round(logoUrl.length * 0.75 / 1024)}KB</div>
                </div>
              ) : (
                <div>
                  <div>🔗 External URL</div>
                  <div className="truncate max-w-32" title={logoUrl}>
                    {logoUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;