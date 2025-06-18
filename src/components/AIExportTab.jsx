// components/AIExportTab.jsx - Version enrichie avec système de prompts COMPLÈTE
import React, { useState } from 'react';
import { Copy, Download, Settings, Lightbulb, Code, FileText, Wand2 } from 'lucide-react';
import { useI18n } from '../hooks';
import { 
  generateSystemPrompt, 
  generateUserPrompt, 
  PROJECT_RULES, 
  FRAMEWORK_RULES,
  validateComponent,
  getSuggestions 
} from '../utils/aiSystemPrompt';

const AIExportTab = ({ tokens, components }) => {
  const { t, locale } = useI18n();
  const [activePromptType, setActivePromptType] = useState('createComponent');
  const [userRequest, setUserRequest] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [componentData, setComponentData] = useState({
    category: 'atoms',
    name: '',
    pageType: ''
  });

  // Types de prompts disponibles
  const promptTypes = [
    {
      id: 'createComponent',
      name: 'Create Component',
      icon: Code,
      description: 'Créer un nouveau composant',
      color: 'blue'
    },
    {
      id: 'improveComponent',
      name: 'Improve Component',
      icon: Wand2,
      description: 'Améliorer un composant existant',
      color: 'purple'
    },
    {
      id: 'createPage',
      name: 'Create Page',
      icon: FileText,
      description: 'Créer une page avec composants',
      color: 'green'
    }
  ];

  // Générer le prompt complet
  const generateCompletePrompt = () => {
    const systemPrompt = generateSystemPrompt(tokens, components, activePromptType);
    
    // Données du composant selon le type
    let compData = { ...componentData };
    if (activePromptType === 'improveComponent' && selectedComponent) {
      const comp = getComponentByPath(selectedComponent);
      if (comp) {
        compData = {
          name: comp.name,
          props: comp.props,
          template: comp.template,
          css: comp.scss
        };
      }
    }
    
    const userPrompt = generateUserPrompt(
      tokens, 
      components, 
      activePromptType, 
      userRequest, 
      compData
    );

    return {
      system: systemPrompt,
      user: userPrompt,
      complete: `${systemPrompt}\n\n---\n\n${userPrompt}`
    };
  };

  // Obtenir un composant par chemin
  const getComponentByPath = (path) => {
    if (!path) return null;
    
    if (path.includes('.')) {
      const [category, key] = path.split('.');
      return components[category]?.[key];
    }
    return components.atoms?.[path] || components.molecules?.[path];
  };

  // Obtenir tous les composants pour la sélection
  const getAllComponents = () => {
    const allComponents = [];
    Object.entries(components).forEach(([category, categoryComponents]) => {
      Object.entries(categoryComponents).forEach(([key, component]) => {
        allComponents.push({
          value: ['atoms', 'molecules'].includes(category) ? key : `${category}.${key}`,
          label: `${component.name} (${category})`,
          category
        });
      });
    });
    return allComponents;
  };

  // Copier vers le presse-papiers
  const copyToClipboard = (content, type = 'complete') => {
    const prompts = generateCompletePrompt();
    const textToCopy = prompts[type] || content;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const button = document.getElementById(`copy-${type}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = `✅ ${t('copied')}`;
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  // Télécharger le prompt
  const downloadPrompt = () => {
    const prompts = generateCompletePrompt();
    const content = `# Design System AI Prompt
Generated: ${new Date().toISOString()}
Framework: ${tokens.framework.type} ${tokens.framework.version}
Type: ${activePromptType}

## System Prompt
${prompts.system}

## User Prompt  
${prompts.user}

## Combined Prompt
${prompts.complete}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-system-prompt-${activePromptType}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Validation du composant sélectionné
  const selectedComp = getComponentByPath(selectedComponent);
  const validation = selectedComp ? validateComponent(selectedComp, tokens.framework) : null;
  const suggestions = selectedComp ? getSuggestions(selectedComp, tokens, tokens.framework) : [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="text-purple-500 mr-2">🤖</span>
              AI Communication Hub
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Prompts optimisés avec règles projet et contexte framework
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRules(!showRules)}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors flex items-center"
            >
              <Settings size={14} className="mr-1" />
              Règles
            </button>
            <button
              onClick={downloadPrompt}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex items-center"
            >
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Prompt Type Selector */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg">
          {promptTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActivePromptType(type.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors flex items-center justify-center ${
                  activePromptType === type.id
                    ? `bg-white text-${type.color}-600 shadow-sm`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={14} className="mr-2" />
                <span className="hidden sm:inline">{type.name}</span>
                <span className="sm:hidden">{type.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Configuration Panel */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h4 className="font-medium text-gray-900 mb-3">Configuration</h4>
          
          {/* Framework Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">
              Framework Actuel
            </div>
            <div className="text-blue-700 text-xs">
              {tokens.framework.type} {tokens.framework.version}
            </div>
            <div className="text-blue-600 text-xs mt-1">
              {FRAMEWORK_RULES[tokens.framework.type]?.naming?.pattern || 'Configuration personnalisée'}
            </div>
          </div>

          {/* Configuration selon le type */}
          {activePromptType === 'createComponent' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={componentData.category}
                  onChange={(e) => setComponentData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  <option value="atoms">Atoms</option>
                  <option value="molecules">Molecules</option>
                  <option value="organisms">Organisms</option>
                  <option value="templates">Templates</option>
                  <option value="pages">Pages</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du composant
                </label>
                <input
                  type="text"
                  value={componentData.name}
                  onChange={(e) => setComponentData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Modern Button"
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
            </div>
          )}

          {activePromptType === 'improveComponent' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Composant à améliorer
                </label>
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  <option value="">Sélectionner...</option>
                  {getAllComponents().map((comp) => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Validation du composant */}
              {validation && (
                <div className="p-2 bg-gray-50 rounded text-xs">
                  <div className="font-medium text-gray-700 mb-1">Validation</div>
                  {validation.errors.length > 0 && (
                    <div className="text-red-600 mb-1">
                      ❌ {validation.errors.length} erreur(s)
                    </div>
                  )}
                  {validation.warnings.length > 0 && (
                    <div className="text-orange-600 mb-1">
                      ⚠️ {validation.warnings.length} avertissement(s)
                    </div>
                  )}
                  {validation.isValid && (
                    <div className="text-green-600">✅ Composant valide</div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="font-medium text-yellow-800 mb-1 flex items-center">
                    <Lightbulb size={12} className="mr-1" />
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="text-yellow-700 mb-1">
                      <div className="font-medium">{suggestion.title}</div>
                      <ul className="ml-2 mt-1 space-y-1">
                        {suggestion.suggestions.slice(0, 3).map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePromptType === 'createPage' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de page
                </label>
                <input
                  type="text"
                  value={componentData.pageType}
                  onChange={(e) => setComponentData(prev => ({ ...prev, pageType: e.target.value }))}
                  placeholder="Landing Page, Dashboard, etc."
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
              
              <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                <div className="font-medium text-green-800 mb-1">Composants disponibles</div>
                <div className="text-green-700">
                  {Object.values(components).reduce((acc, cat) => acc + Object.keys(cat).length, 0)} composants dans {Object.keys(components).filter(cat => Object.keys(components[cat]).length > 0).length} catégories
                </div>
              </div>
            </div>
          )}

          {/* Request Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demande à l'IA
            </label>
            <textarea
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              placeholder={`Exemple: ${
                activePromptType === 'createComponent' ? 'Crée un bouton avec icônes et états loading' :
                activePromptType === 'improveComponent' ? 'Ajoute des animations et améliore l\'accessibilité' :
                'Crée une page d\'accueil avec header, hero section et footer'
              }`}
              className="w-full text-sm border rounded px-2 py-2 h-20 resize-none"
            />
          </div>

          {/* Règles résumé */}
          <div className="mt-4 p-2 bg-purple-50 border border-purple-200 rounded text-xs">
            <div className="font-medium text-purple-800 mb-1">Règles appliquées</div>
            <div className="text-purple-700 space-y-1">
              <div>✓ Naming conventions</div>
              <div>✓ Atomic design principles</div>
              <div>✓ Framework {tokens.framework.type} patterns</div>
              <div>✓ Accessibility guidelines</div>
              <div>✓ Design tokens integration</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Rules Panel (collapsible) */}
          {showRules && (
            <div className="bg-gray-800 text-gray-300 p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Règles du Projet</h4>
                <button
                  onClick={() => setShowRules(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-medium text-blue-400 mb-2">Naming Components</div>
                  <ul className="space-y-1">
                    {PROJECT_RULES.naming.components.rules.map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-green-400 mb-2">CSS Classes</div>
                  <ul className="space-y-1">
                    {PROJECT_RULES.naming.cssClasses.rules.map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-yellow-400 mb-2">Framework {tokens.framework.type}</div>
                  <ul className="space-y-1">
                    {(FRAMEWORK_RULES[tokens.framework.type]?.patterns || []).map((pattern, i) => (
                      <li key={i}>• {pattern}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-purple-400 mb-2">Accessibility</div>
                  <ul className="space-y-1">
                    {PROJECT_RULES.accessibility.rules.slice(0, 3).map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Prompt Display */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Prompt Tabs */}
              <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
                <button
                  className="flex-1 px-3 py-2 text-sm font-medium rounded bg-white text-purple-600 shadow-sm"
                >
                  Complete Prompt
                </button>
              </div>

              {/* Generated Prompt */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      AI Prompt - {promptTypes.find(t => t.id === activePromptType)?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tokens.framework.type} {tokens.framework.version}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      id="copy-complete"
                      onClick={() => copyToClipboard('', 'complete')}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Copy size={12} className="mr-1" />
                      {t('copyToClipboard')}
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {userRequest ? generateCompletePrompt().complete : (
                      <span className="text-gray-400 italic">
                        Configurez votre demande et elle apparaîtra ici...
                        
                        Le prompt inclura automatiquement :
                        • Les règles de naming du projet
                        • Les conventions du framework {tokens.framework.type}
                        • Les design tokens disponibles
                        • Les composants existants
                        • Les guidelines d'accessibilité
                        • Le contexte architectural (Atomic Design)
                      </span>
                    )}
                  </pre>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Lightbulb size={16} className="mr-2" />
                  Comment utiliser ce prompt
                </h5>
                <div className="text-blue-700 text-sm space-y-2">
                  <div>
                    <strong>1.</strong> Copiez le prompt complet généré ci-dessus
                  </div>
                  <div>
                    <strong>2.</strong> Collez-le dans votre IA préférée (ChatGPT, Claude, etc.)
                  </div>
                  <div>
                    <strong>3.</strong> L'IA vous donnera du code optimisé pour votre design system
                  </div>
                  <div>
                    <strong>4.</strong> Copiez le code dans l'onglet Code ou Properties selon le type
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(components).reduce((acc, cat) => acc + Object.keys(cat).length, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Composants</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(tokens.colors).length}
                  </div>
                  <div className="text-xs text-gray-500">Couleurs</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(PROJECT_RULES.naming.components.rules).length + Object.keys(PROJECT_RULES.accessibility.rules).length}
                  </div>
                  <div className="text-xs text-gray-500">Règles</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600">
                    {tokens.framework.type}
                  </div>
                  <div className="text-xs text-gray-500">Framework</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExportTab;