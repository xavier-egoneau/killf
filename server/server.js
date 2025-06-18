// server/server.js - Version ES Modules avec gestion complète des templates
import express from 'express';
import pkg from 'sqlite3';
const { Database } = pkg.verbose();
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// 🔥 FIX: ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database initialization avec gestion d'erreur améliorée
const dbPath = path.join(__dirname, 'design.db');
console.log('📂 Database path:', dbPath);

const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// 🔥 FIX: Table creation avec colonnes template et props
db.serialize(() => {
  // Table pour les design tokens
  db.run(`CREATE TABLE IF NOT EXISTS tokens (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Failed to create tokens table:', err);
    } else {
      console.log('✅ Tokens table ready');
    }
  });

  // 🔥 FIX: Table pour les composants avec template ET props
  db.run(`CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    template TEXT,
    props TEXT,
    scss TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Failed to create components table:', err);
    } else {
      console.log('✅ Components table ready');
      
      // 🆕 Vérifier et ajouter les colonnes manquantes si nécessaire
      db.all("PRAGMA table_info(components)", (err, columns) => {
        if (err) {
          console.error('❌ Failed to check table structure:', err);
          return;
        }
        
        const columnNames = columns.map(col => col.name);
        console.log('📋 Current columns:', columnNames);
        
        // Ajouter la colonne template si elle n'existe pas
        if (!columnNames.includes('template')) {
          db.run("ALTER TABLE components ADD COLUMN template TEXT", (err) => {
            if (err) {
              console.error('❌ Failed to add template column:', err);
            } else {
              console.log('✅ Template column added');
            }
          });
        }
        
        // Ajouter la colonne props si elle n'existe pas
        if (!columnNames.includes('props')) {
          db.run("ALTER TABLE components ADD COLUMN props TEXT", (err) => {
            if (err) {
              console.error('❌ Failed to add props column:', err);
            } else {
              console.log('✅ Props column added');
            }
          });
        }
      });
    }
  });
});

// Routes de base
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

app.get('/api/debug', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      tables,
      dbPath,
      timestamp: new Date().toISOString()
    });
  });
});

// 🔥 FIX: Routes tokens
app.get('/api/tokens', (req, res) => {
  db.get("SELECT data FROM tokens WHERE id = 'main'", (err, row) => {
    if (err) {
      console.error('❌ Failed to fetch tokens:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      try {
        const tokens = JSON.parse(row.data);
        console.log('✅ Tokens fetched successfully');
        res.json(tokens);
      } catch (parseErr) {
        console.error('❌ Failed to parse tokens JSON:', parseErr);
        res.status(500).json({ error: 'Invalid tokens data' });
      }
    } else {
      console.log('📝 No tokens found, returning empty object');
      res.json({});
    }
  });
});

app.put('/api/tokens', (req, res) => {
  const tokensData = JSON.stringify(req.body);
  
  db.run(
    "INSERT OR REPLACE INTO tokens (id, data, updated_at) VALUES (?, ?, datetime('now'))",
    ['main', tokensData],
    function(err) {
      if (err) {
        console.error('❌ Failed to save tokens:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log('✅ Tokens saved successfully');
      res.json({ 
        success: true, 
        message: 'Tokens saved successfully',
        rowsAffected: this.changes 
      });
    }
  );
});

// 🔥 FIX: Routes components avec gestion complète
app.get('/api/components', (req, res) => {
  db.all("SELECT * FROM components ORDER BY category, name", (err, rows) => {
    if (err) {
      console.error('❌ Failed to fetch components:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Organiser par catégorie
    const components = {};
    
    rows.forEach(row => {
      if (!components[row.category]) {
        components[row.category] = {};
      }
      
      try {
        // 🔥 FIX: Parser props et inclure template
        const component = {
          name: row.name,
          category: row.category,
          template: row.template || '', // 🆕
          props: row.props ? JSON.parse(row.props) : {},
          scss: row.scss || ''
        };
        
        components[row.category][row.id] = component;
      } catch (parseErr) {
        console.error(`❌ Failed to parse component ${row.id}:`, parseErr);
        // Garder le composant avec des valeurs par défaut
        components[row.category][row.id] = {
          name: row.name,
          category: row.category,
          template: row.template || '',
          props: {},
          scss: row.scss || ''
        };
      }
    });
    
    console.log('✅ Components fetched successfully:', Object.keys(components));
    res.json(components);
  });
});

// 🔥 FIX: Créer/Mettre à jour un composant avec template
app.put('/api/components/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, template, props, scss } = req.body;
  
  console.log(`💾 Saving component ${id}:`, {
    name,
    category,
    hasTemplate: !!template,
    templateLength: template ? template.length : 0,
    hasProps: !!props,
    propsKeys: props ? Object.keys(props) : [],
    hasScss: !!scss,
    scssLength: scss ? scss.length : 0
  });
  
  // Validation des données requises
  if (!name || !category) {
    console.error('❌ Missing required fields:', { name: !!name, category: !!category });
    res.status(400).json({ error: 'Name and category are required' });
    return;
  }
  
  // Préparer les données
  const propsJson = props ? JSON.stringify(props) : '{}';
  const templateText = template || '';
  const scssText = scss || '';
  
  // 🔥 FIX: Vérifier d'abord quelles colonnes existent
  db.all("PRAGMA table_info(components)", (err, columns) => {
    if (err) {
      console.error('❌ Failed to check table structure:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    const columnNames = columns.map(col => col.name);
    const hasUpdatedAt = columnNames.includes('updated_at');
    const hasCreatedAt = columnNames.includes('created_at');
    
    // Construire la requête en fonction des colonnes disponibles
    let query = '';
    let params = [];
    
    if (hasUpdatedAt && hasCreatedAt) {
      query = `
        INSERT OR REPLACE INTO components 
        (id, name, category, template, props, scss, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `;
      params = [id, name, category, templateText, propsJson, scssText];
    } else if (hasCreatedAt) {
      query = `
        INSERT OR REPLACE INTO components 
        (id, name, category, template, props, scss) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [id, name, category, templateText, propsJson, scssText];
    } else {
      // Table basique sans colonnes de timestamp
      query = `
        INSERT OR REPLACE INTO components 
        (id, name, category, template, props, scss) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [id, name, category, templateText, propsJson, scssText];
    }
    
    console.log('📝 Using query with columns:', columnNames);
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('❌ Failed to save component:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log(`✅ Component ${id} saved successfully (${this.changes} rows affected)`);
      res.json({ 
        success: true, 
        message: 'Component saved successfully',
        id,
        rowsAffected: this.changes,
        data: {
          name,
          category,
          template: templateText,
          props,
          scss: scssText
        }
      });
    });
  });
});

// Supprimer un composant
app.delete('/api/components/:id', (req, res) => {
  const { id } = req.params;
  
  console.log(`🗑️ Deleting component ${id}`);
  
  db.run("DELETE FROM components WHERE id = ?", [id], function(err) {
    if (err) {
      console.error('❌ Failed to delete component:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      console.log(`⚠️ Component ${id} not found`);
      res.status(404).json({ error: 'Component not found' });
      return;
    }
    
    console.log(`✅ Component ${id} deleted successfully`);
    res.json({ 
      success: true, 
      message: 'Component deleted successfully',
      id,
      rowsAffected: this.changes 
    });
  });
});

// 🆕 Route pour obtenir un composant spécifique
app.get('/api/components/:id', (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM components WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error('❌ Failed to fetch component:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Component not found' });
      return;
    }
    
    try {
      const component = {
        name: row.name,
        category: row.category,
        template: row.template || '',
        props: row.props ? JSON.parse(row.props) : {},
        scss: row.scss || ''
      };
      
      res.json(component);
    } catch (parseErr) {
      console.error('❌ Failed to parse component data:', parseErr);
      res.status(500).json({ error: 'Invalid component data' });
    }
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🔄 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Debug info: http://localhost:${PORT}/api/debug`);
});

// 🔥 FIX: Export ES Modules
export default app;