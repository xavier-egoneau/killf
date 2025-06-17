import React from 'react';
import VisualTab from './VisualTab';
import CodeTab from './CodeTab';
import AIExportTab from './AIExportTab';

// Main Canvas component
const Canvas = ({ 
  activeTab, 
  tokens, 
  components, 
  selectedComponent, 
  currentProps,
  onUpdateComponent 
}) => {
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'visual':
        return (
          <VisualTab 
            tokens={tokens}
            components={components}
            selectedComponent={selectedComponent}
            currentProps={currentProps}
          />
        );
      case 'code':
        return (
          <CodeTab 
            tokens={tokens}
            components={components}
            selectedComponent={selectedComponent}
            currentProps={currentProps}
            onUpdateComponent={onUpdateComponent}
          />
        );
      case 'ai':
        return (
          <AIExportTab 
            tokens={tokens}
            components={components}
          />
        );
      default:
        return (
          <VisualTab 
            tokens={tokens} 
            components={components} 
            selectedComponent={selectedComponent} 
            currentProps={currentProps} 
          />
        );
    }
  };

  return (
    <div className="flex-1 p-6">
      {renderActiveTab()}
    </div>
  );
};

export default Canvas;