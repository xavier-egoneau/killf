// server/fix-database.js - Script pour corriger et migrer la base de données
import pkg from 'sqlite3';
const { Database } = pkg.verbose();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Database Fix & Migration Tool');
console.log('================================\n');

const dbPath = path.join(__dirname, 'design.db');
const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
  
  // Étape 1: Créer la table tokens si elle n'existe pas
  console.log('\n🔄 Step 1: Creating tokens table...');
  db.run(`CREATE TABLE IF NOT EXISTS tokens (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Failed to create tokens table:', err);
    } else {
      console.log('✅ Tokens table ready');
      
      // Étape 2: Vérifier et ajouter les colonnes manquantes dans components
      console.log('\n🔄 Step 2: Checking components table structure...');
      db.all("PRAGMA table_info(components)", (err, columns) => {
        if (err) {
          console.error('❌ Failed to check table structure:', err);
          return;
        }
        
        const columnNames = columns.map(col => col.name);
        console.log('📋 Current columns:', columnNames);
        
        let addTemplate = false;
        let addProps = false;
        
        // Vérifier template
        if (!columnNames.includes('template')) {
          addTemplate = true;
        }
        
        // Vérifier props
        if (!columnNames.includes('props')) {
          addProps = true;
        }
        
        // Vérifier updated_at
        let addUpdatedAt = false;
        if (!columnNames.includes('updated_at')) {
          addUpdatedAt = true;
        }
        
        // Vérifier created_at
        let addCreatedAt = false;
        if (!columnNames.includes('created_at')) {
          addCreatedAt = true;
        }
        
        if (addTemplate || addProps || addUpdatedAt || addCreatedAt) {
          console.log('\n🔄 Step 3: Adding missing columns...');
          
          const columnsToAdd = [];
          if (addTemplate) columnsToAdd.push('template');
          if (addProps) columnsToAdd.push('props');
          if (addCreatedAt) columnsToAdd.push('created_at');
          if (addUpdatedAt) columnsToAdd.push('updated_at');
          
          console.log(`📝 Adding columns: ${columnsToAdd.join(', ')}`);
          
          // Fonction pour ajouter les colonnes une par une
          let currentIndex = 0;
          
          function addNextColumn() {
            if (currentIndex >= columnsToAdd.length) {
              fixExistingComponents();
              return;
            }
            
            const column = columnsToAdd[currentIndex];
            let sql = '';
            
            switch (column) {
              case 'template':
                sql = "ALTER TABLE components ADD COLUMN template TEXT";
                break;
              case 'props':
                sql = "ALTER TABLE components ADD COLUMN props TEXT";
                break;
              case 'created_at':
                sql = "ALTER TABLE components ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP";
                break;
              case 'updated_at':
                sql = "ALTER TABLE components ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
                break;
            }
            
            db.run(sql, (err) => {
              if (err) {
                console.error(`❌ Failed to add ${column} column:`, err);
              } else {
                console.log(`✅ ${column} column added`);
              }
              currentIndex++;
              addNextColumn();
            });
          }
          
          addNextColumn();
        } else {
          console.log('✅ All columns present');
          fixExistingComponents();
        }
        
        function fixExistingComponents() {
          // Étape 4: Corriger les composants existants qui n'ont pas de template
          console.log('\n🔄 Step 4: Fixing existing components...');
          
          db.all("SELECT id, name, category FROM components WHERE template IS NULL OR template = ''", (err, components) => {
            if (err) {
              console.error('❌ Failed to fetch components:', err);
              closeAndFinish();
              return;
            }
            
            if (components.length === 0) {
              console.log('✅ All components have templates');
              closeAndFinish();
              return;
            }
            
            console.log(`🔧 Found ${components.length} components without templates`);
            
            let fixed = 0;
            
            components.forEach((comp, index) => {
              // Générer un template par défaut
              const defaultTemplate = generateDefaultTemplate(comp.category, comp.name, comp.id);
              
              db.run(
                "UPDATE components SET template = ? WHERE id = ?",
                [defaultTemplate, comp.id],
                function(err) {
                  if (err) {
                    console.error(`❌ Failed to update ${comp.id}:`, err);
                  } else {
                    console.log(`✅ Fixed ${comp.id} (${comp.name})`);
                    fixed++;
                  }
                  
                  // Si c'est le dernier composant
                  if (index === components.length - 1) {
                    console.log(`\n🎉 Fixed ${fixed}/${components.length} components`);
                    closeAndFinish();
                  }
                }
              );
            });
          });
        }
      });
    }
  });
});

// Fonction pour générer un template par défaut
function generateDefaultTemplate(category, name, id) {
  const className = id;
  
  switch (category) {
    case 'atoms':
      if (name.toLowerCase().includes('button')) {
        return `<button class="${className}{% if variant %} ${className}--{{ variant }}{% endif %}{% if size %} ${className}--{{ size }}{% endif %}"{% if disabled %} disabled{% endif %}>
  {{ text|default('${name}') }}
</button>`;
      }
      return `<div class="${className}">{{ text|default('${name}') }}</div>`;
      
    case 'molecules':
      return `<div class="${className}">
  {% if title %}<h3 class="${className}__title">{{ title }}</h3>{% endif %}
  {% if content %}<div class="${className}__content">{{ content }}</div>{% endif %}
</div>`;
      
    case 'organisms':
      return `<section class="${className}">
  {% if title %}<h2 class="${className}__title">{{ title }}</h2>{% endif %}
  <div class="${className}__content">
    {{ content|default('${name} content') }}
  </div>
</section>`;
      
    case 'templates':
      return `<div class="${className}">
  <header class="${className}__header">{{ header }}</header>
  <main class="${className}__main">{{ content }}</main>
  {% if showFooter %}<footer class="${className}__footer">{{ footer }}</footer>{% endif %}
</div>`;
      
    case 'pages':
      return `<div class="${className}-page">{{ content|default('${name} page content') }}</div>`;
      
    default:
      return `<div class="${className}">{{ content|default('${name}') }}</div>`;
  }
}

function closeAndFinish() {
  console.log('\n🔄 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    
    console.log('\n🎉 Database migration completed!');
    console.log('📋 What was fixed:');
    console.log('  ✅ Created tokens table');
    console.log('  ✅ Added missing columns (template, props)');
    console.log('  ✅ Generated default templates for components');
    console.log('\n💡 Now run: npm run dev');
    process.exit(0);
  });
}

// Gestion des erreurs
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});