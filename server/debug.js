// server/debug.js - Script de test et debug du serveur
import pkg from 'sqlite3';
const { Database } = pkg.verbose();
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Design System Server Debug Tool');
console.log('===================================\n');

// Test 1: Vérifier le chemin de la base de données
const dbPath = path.join(__dirname, 'design.db');
console.log('📂 Database path:', dbPath);
console.log('📁 Database exists:', fs.existsSync(dbPath));

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('📊 Database size:', (stats.size / 1024).toFixed(2), 'KB');
  console.log('📅 Last modified:', stats.mtime.toISOString());
}

console.log('\n');

// Test 2: Connexion à la base de données
const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Database connection successful');
  
  // Test 3: Vérifier les tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Failed to fetch tables:', err);
      return;
    }
    
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // Test 4: Vérifier la structure de la table components
    if (tables.some(t => t.name === 'components')) {
      console.log('\n🔍 Components table structure:');
      db.all("PRAGMA table_info(components)", (err, columns) => {
        if (err) {
          console.error('❌ Failed to get table info:', err);
          return;
        }
        
        columns.forEach(col => {
          console.log(`  - ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : ''} ${col.pk ? '(PRIMARY KEY)' : ''}`);
        });
        
        // Test 5: Compter les composants
        db.get("SELECT COUNT(*) as count FROM components", (err, row) => {
          if (err) {
            console.error('❌ Failed to count components:', err);
            return;
          }
          
          console.log(`\n📊 Total components: ${row.count}`);
          
          if (row.count > 0) {
            // Afficher les composants existants
            db.all("SELECT id, name, category, LENGTH(template) as template_length, LENGTH(scss) as scss_length FROM components", (err, components) => {
              if (err) {
                console.error('❌ Failed to fetch components:', err);
                return;
              }
              
              console.log('\n📝 Existing components:');
              components.forEach(comp => {
                console.log(`  - ${comp.id} (${comp.name}) [${comp.category}]`);
                console.log(`    Template: ${comp.template_length || 0} chars, CSS: ${comp.scss_length || 0} chars`);
              });
              
              checkTokensAndExit();
            });
          } else {
            checkTokensAndExit();
          }
        });
      });
    } else {
      console.log('\n⚠️ Components table not found');
      checkTokensAndExit();
    }
  });
});

function checkTokensAndExit() {
  // Test 6: Vérifier les tokens (vérifier d'abord si la table existe)
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='tokens'", (err, tables) => {
    if (err) {
      console.error('❌ Failed to check tokens table:', err);
      closeAndExit();
      return;
    }
    
    if (tables.length > 0) {
      db.get("SELECT COUNT(*) as count FROM tokens", (err, row) => {
        if (err) {
          console.error('❌ Failed to count tokens:', err);
        } else {
          console.log(`\n📊 Total tokens: ${row.count}`);
        }
        closeAndExit();
      });
    } else {
      console.log('\n⚠️ Tokens table not found');
      closeAndExit();
    }
  });
}

function closeAndExit() {
  console.log('\n🔄 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    
    console.log('\n🎯 Debug completed!');
    console.log('💡 To start the server: npm run dev');
    console.log('🌐 Health check: http://localhost:3001/api/health');
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