import React from 'react';

const AIExportTab = ({ tokens, components }) => {
  const generateAIPrompt = () => {
    return `# Design System - AI Template & Props Generator

## Current Components

${Object.entries(components).map(([category, comps]) => `### ${category.charAt(0).toUpperCase() + category.slice(1)}
${Object.entries(comps).map(([key, comp]) => `- **${comp.name}** (${key}): ${Object.keys(comp.props || {}).join(', ') || 'no props'}`).join('\n')}`).join('\n\n')}

## Design Tokens Available
- **Colors**: ${Object.keys(tokens.colors).join(', ')}
- **Spacing**: ${Object.keys(tokens.spacing).join(', ')}
- **Typography**: ${Object.keys(tokens.typography.sizes).join(', ')}

## Template System

This design system uses a **Template + Props** approach where:
- **Templates**: HTML with placeholders like \`{{propName}}\`
- **Props**: Variables that customize the template
- **Result**: Final HTML generated automatically

### Template Syntax:
- \`{{propName}}\` - Simple variable replacement
- \`{{#if propName}}content{{/if}}\` - Conditional content
- \`{{#unless propName}}content{{/unless}}\` - Inverted conditional
- \`{{#class propName}}class-name{{/class}}\` - Conditional CSS class

## AI Role: Generate Props & Templates

### For Props Requests:
Generate JSON that can be copy-pasted into Properties → Code mode:

**Example Request**: "Add icon support to button"
**AI Response**:
\`\`\`json
{
  "icon": {
    "type": "string",
    "default": "",
    "description": "Icon name (lucide icons)"
  },
  "iconPosition": {
    "type": "select",
    "options": ["left", "right"],
    "default": "left",
    "description": "Icon position"
  }
}
\`\`\`

### For Template Requests:
Generate HTML templates with placeholders:

**Example Request**: "Create a product card template"
**AI Response**:
\`\`\`html
<div class="product-card {{#class featured}}featured{{/class}}">
  {{#if image}}<img src="{{image}}" alt="{{title}}" class="product-image" />{{/if}}
  <div class="product-info">
    <h3 class="product-title">{{title}}</h3>
    {{#if description}}<p class="product-description">{{description}}</p>{{/if}}
    <div class="product-price">{{price}}</div>
    {{#if onSale}}<span class="sale-badge">Sale!</span>{{/if}}
    {{#unless outOfStock}}<button class="btn btn-primary">Add to Cart</button>{{/unless}}
  </div>
</div>
\`\`\`

### Guidelines:
1. **Templates**: Use semantic HTML with meaningful CSS classes
2. **Props**: Provide sensible defaults and descriptions
3. **Conditionals**: Use {{#if}} for optional elements
4. **Classes**: Use {{#class}} for conditional styling
5. **Variables**: Reference design tokens in CSS (--color-primary, --spacing-md)

### Workflow:
1. User describes what they need
2. You generate props JSON and/or template HTML
3. User copies into the app (Properties or Code tab)
4. User tests immediately in Visual mode

Generate code that works with this template system!`;
  };

  const aiPrompt = generateAIPrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiPrompt).then(() => {
      const button = document.getElementById('copy-ai');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
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
          AI Template Generator
        </h3>
        <button 
          id="copy-ai"
          onClick={copyToClipboard}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
        >
          📋 Copy to Clipboard
        </button>
      </div>
      
      <div className="bg-black rounded-lg p-6 border border-gray-700 font-mono text-sm">
        <pre className="text-gray-300 whitespace-pre-wrap">{aiPrompt}</pre>
      </div>
    </div>
  );
};

export default AIExportTab;