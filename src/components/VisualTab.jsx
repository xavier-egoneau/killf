// components/VisualTab.jsx - Version avec i18n
import React from 'react';
import { renderTemplate } from '../utils/templateEngine';
import { useI18n } from '../hooks/useI18n';

const VisualTab = ({ tokens, components, selectedComponent, currentProps }) => {
  const { t } = useI18n();
  
  const getComponent = (componentPath) => {
    if (componentPath.includes('.')) {
      const [category, key] = componentPath.split('.');
      return components[category] && components[category][key] ? components[category][key] : null;
    }
    return components.atoms?.[componentPath] || components.molecules?.[componentPath] || null;
  };

  const renderComponent = () => {
    const comp = getComponent(selectedComponent);
    if (!comp) return <div className="text-gray-500">{t('noComponentSelected')}</div>;

    if (!components || !components.atoms) {
      return <div className="text-gray-400 text-sm">{t('loadingComponents')}</div>;
    }

    // Si le composant a un template, l'utiliser
    if (comp.template) {
      const renderedHTML = renderTemplate(comp.template, currentProps);
      
      return (
        <div style={{ fontFamily: tokens.typography.fontFamily }}>
          {/* Injecter les styles du composant */}
          <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${tokens.colors.primary};
                --color-secondary: ${tokens.colors.secondary};
                --color-success: ${tokens.colors.success};
                --color-danger: ${tokens.colors.danger};
                
                --spacing-xs: ${tokens.spacing.xs};
                --spacing-sm: ${tokens.spacing.sm};
                --spacing-md: ${tokens.spacing.md};
                --spacing-lg: ${tokens.spacing.lg};
                --spacing-xl: ${tokens.spacing.xl};
                
                --font-family: ${tokens.typography.fontFamily};
                --font-sm: ${tokens.typography.sizes.sm};
                --font-md: ${tokens.typography.sizes.md};
                --font-lg: ${tokens.typography.sizes.lg};
                --font-xl: ${tokens.typography.sizes.xl};
              }
              ${comp.scss || ''}
            `
          }} />
          <div 
            className="rendered-component"
            dangerouslySetInnerHTML={{ __html: renderedHTML }}
          />
        </div>
      );
    }

    // Fallback pour les composants sans template (legacy)
    return (
      <div style={{
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: tokens.spacing.xl,
        textAlign: 'center',
        color: '#666',
        maxWidth: '600px'
      }}>
        <h3 style={{ margin: `0 0 ${tokens.spacing.md} 0` }}>{comp.name}</h3>
        <p style={{ margin: 0, marginBottom: tokens.spacing.md }}>
          {t(comp.category)} component
        </p>
        <div style={{
          marginTop: tokens.spacing.lg,
          padding: tokens.spacing.md,
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          Props: {Object.keys(comp.props || {}).join(', ') || 'None'}
        </div>
        <div className="mt-4 text-xs text-orange-600">
          ⚠️ {t('componentNeedsTemplate')}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 h-full">
      <div className="flex items-center justify-center h-full">
        {renderComponent()}
      </div>
    </div>
  );
};

export default VisualTab;