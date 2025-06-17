// components/AIExportTab.jsx - Version avec i18n COMPLÈTE
import React from 'react';
import { useI18n } from '../hooks';

const AIExportTab = ({ tokens, components }) => {
  const { t, locale } = useI18n();
  
  const generateAIPrompt = () => {
    // Générer le prompt en fonction de la langue
    const isEnglish = locale === 'en';
    
    const intro = isEnglish 
      ? "# Design System - AI Template & Props Generator"
      : "# Système de Design - Générateur de Modèles et Propriétés IA";

    const currentComponentsTitle = isEnglish 
      ? "## Current Components" 
      : "## Composants Actuels";

    const availableTokensTitle = isEnglish 
      ? "## Design Tokens Available"
      : "## Tokens de Design Disponibles";

    const templateSystemTitle = isEnglish 
      ? "## Template System"
      : "## Système de Modèles";

    const templateSystemDesc = isEnglish 
      ? `This design system uses a **Template + Props** approach where:
- **Templates**: HTML with placeholders like \`{{propName}}\`
- **Props**: Variables that customize the template
- **Result**: Final HTML generated automatically`
      : `Ce système de design utilise une approche **Modèle + Propriétés** où :
- **Modèles** : HTML avec des espaces réservés comme \`{{propName}}\`
- **Propriétés** : Variables qui personnalisent le modèle
- **Résultat** : HTML final généré automatiquement`;

    const templateSyntaxTitle = isEnglish 
      ? "### Template Syntax:"
      : "### Syntaxe des Modèles :";

    const aiRoleTitle = isEnglish 
      ? "## AI Role: Generate Props & Templates"
      : "## Rôle de l'IA : Générer des Propriétés et Modèles";

    const propsRequestsTitle = isEnglish 
      ? "### For Props Requests:"
      : "### Pour les Demandes de Propriétés :";

    const propsRequestsDesc = isEnglish 
      ? "Generate JSON that can be copy-pasted into Properties → Code mode:"
      : "Générez du JSON qui peut être copié-collé dans Propriétés → Mode Code :";

    const templateRequestsTitle = isEnglish 
      ? "### For Template Requests:"
      : "### Pour les Demandes de Modèles :";

    const templateRequestsDesc = isEnglish 
      ? "Generate HTML templates with placeholders:"
      : "Générez des modèles HTML avec des espaces réservés :";

    const guidelinesTitle = isEnglish 
      ? "### Guidelines:"
      : "### Directives :";

    const guidelines = isEnglish 
      ? `1. **Templates**: Use semantic HTML with meaningful CSS classes
2. **Props**: Provide sensible defaults and descriptions
3. **Conditionals**: Use {{#if}} for optional elements
4. **Classes**: Use {{#class}} for conditional styling
5. **Variables**: Reference design tokens in CSS (--color-primary, --spacing-md)`
      : `1. **Modèles** : Utilisez du HTML sémantique avec des classes CSS significatives
2. **Propriétés** : Fournissez des valeurs par défaut et descriptions sensées
3. **Conditions** : Utilisez {{#if}} pour les éléments optionnels
4. **Classes** : Utilisez {{#class}} pour le style conditionnel
5. **Variables** : Référencez les tokens de design en CSS (--color-primary, --spacing-md)`;

    const workflowTitle = isEnglish 
      ? "### Workflow:"
      : "### Flux de Travail :";

    const workflow = isEnglish 
      ? `1. User describes what they need
2. You generate props JSON and/or template HTML
3. User copies into the app (Properties or Code tab)
4. User tests immediately in Visual mode

Generate code that works with this template system!`
      : `1. L'utilisateur décrit ce dont il a besoin
2. Vous générez le JSON des propriétés et/ou le HTML du modèle
3. L'utilisateur copie dans l'app (onglet Propriétés ou Code)
4. L'utilisateur teste immédiatement en mode Visuel

Générez du code qui fonctionne avec ce système de modèles !`;

    return `${intro}

${currentComponentsTitle}

${Object.entries(components).map(([category, comps]) => `### ${category.charAt(0).toUpperCase() + category.slice(1)}
${Object.entries(comps).map(([key, comp]) => `- **${comp.name}** (${key}): ${Object.keys(comp.props || {}).join(', ') || 'no props'}`).join('\n')}`).join('\n\n')}

${availableTokensTitle}
- **${isEnglish ? 'Colors' : 'Couleurs'}**: ${Object.keys(tokens.colors).join(', ')}
- **${isEnglish ? 'Spacing' : 'Espacement'}**: ${Object.keys(tokens.spacing).join(', ')}
- **${isEnglish ? 'Typography' : 'Typographie'}**: ${Object.keys(tokens.typography.sizes).join(', ')}

${templateSystemTitle}

${templateSystemDesc}

${templateSyntaxTitle}
- \`{{propName}}\` - ${isEnglish ? 'Simple variable replacement' : 'Remplacement de variable simple'}
- \`{{#if propName}}content{{/if}}\` - ${isEnglish ? 'Conditional content' : 'Contenu conditionnel'}
- \`{{#unless propName}}content{{/unless}}\` - ${isEnglish ? 'Inverted conditional' : 'Conditionnel inversé'}
- \`{{#class propName}}class-name{{/class}}\` - ${isEnglish ? 'Conditional CSS class' : 'Classe CSS conditionnelle'}

${aiRoleTitle}

${propsRequestsTitle}
${propsRequestsDesc}

**${isEnglish ? 'Example Request' : 'Exemple de Demande'}**: "${isEnglish ? 'Add icon support to button' : 'Ajouter le support d\'icônes au bouton'}"
**${isEnglish ? 'AI Response' : 'Réponse IA'}**:
\`\`\`json
{
  "icon": {
    "type": "string",
    "default": "",
    "description": "${isEnglish ? 'Icon name (lucide icons)' : 'Nom de l\'icône (icônes lucide)'}"
  },
  "iconPosition": {
    "type": "select",
    "options": ["left", "right"],
    "default": "left",
    "description": "${isEnglish ? 'Icon position' : 'Position de l\'icône'}"
  }
}
\`\`\`

${templateRequestsTitle}
${templateRequestsDesc}

**${isEnglish ? 'Example Request' : 'Exemple de Demande'}**: "${isEnglish ? 'Create a product card template' : 'Créer un modèle de carte produit'}"
**${isEnglish ? 'AI Response' : 'Réponse IA'}**:
\`\`\`html
<div class="product-card {{#class featured}}featured{{/class}}">
  {{#if image}}<img src="{{image}}" alt="{{title}}" class="product-image" />{{/if}}
  <div class="product-info">
    <h3 class="product-title">{{title}}</h3>
    {{#if description}}<p class="product-description">{{description}}</p>{{/if}}
    <div class="product-price">{{price}}</div>
    {{#if onSale}}<span class="sale-badge">${isEnglish ? 'Sale!' : 'Promo !'}</span>{{/if}}
    {{#unless outOfStock}}<button class="btn btn-primary">${isEnglish ? 'Add to Cart' : 'Ajouter au Panier'}</button>{{/unless}}
  </div>
</div>
\`\`\`

${guidelinesTitle}
${guidelines}

${workflowTitle}
${workflow}`;
  };

  const aiPrompt = generateAIPrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiPrompt).then(() => {
      const button = document.getElementById('copy-ai');
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ ${t('copied')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <span className="text-purple-400 mr-2">🤖</span>
          {t('aiTemplateGenerator')}
        </h3>
        <button 
          id="copy-ai"
          onClick={copyToClipboard}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
        >
          📋 {t('copyToClipboard')}
        </button>
      </div>
      
      <div className="bg-black rounded-lg p-6 border border-gray-700 font-mono text-sm">
        <pre className="text-gray-300 whitespace-pre-wrap">{aiPrompt}</pre>
      </div>
    </div>
  );
};

export default AIExportTab;