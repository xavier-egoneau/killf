// server/server.js
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';

const app = express();
const PORT = 3001;
const DB_PATH = './design.db';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2).substring(0, 500) + '...');
  }
  next();
});

// Create database if not exists
let db;
try {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Table des composants
  db.exec(`CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    props TEXT,
    scss TEXT,
    template TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  // Nouvelle table pour les design tokens
  db.exec(`CREATE TABLE IF NOT EXISTS design_tokens (
  id INTEGER PRIMARY KEY,
  tokens TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

  // Migration : remplacer html par template
  try {
    const pragma = db.prepare("PRAGMA table_info(components)").all();
    const hasTemplate = pragma.some(col => col.name === 'template');
    
    if (!hasTemplate) {
      db.exec(`ALTER TABLE components ADD COLUMN template TEXT;`);
      console.log('✅ Added template column to database');
      
      // Migrer les données existantes html -> template
      const components = db.prepare('SELECT id, html FROM components WHERE html IS NOT NULL').all();
      const updateStmt = db.prepare('UPDATE components SET template = ? WHERE id = ?');
      
      components.forEach(comp => {
        updateStmt.run(comp.html, comp.id);
      });
      
      console.log(`✅ Migrated ${components.length} components from html to template`);
    }
  } catch (error) {
    console.log('ℹ️ Template column setup:', error.message);
  }
  
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

// ========== ENDPOINTS COMPONENTS ==========

// GET all components
app.get('/api/components', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM components');
    const rows = stmt.all();
    
    const components = {};
    rows.forEach(row => {
      if (!components[row.category]) components[row.category] = {};
      
      try {
        components[row.category][row.id] = {
          name: row.name,
          props: JSON.parse(row.props || '{}'),
          scss: row.scss || '',
          template: row.template || null,
          category: row.category
        };
      } catch (parseError) {
        console.error(`Error parsing props for component ${row.id}:`, parseError);
        components[row.category][row.id] = {
          name: row.name,
          props: {},
          scss: row.scss || '',
          template: row.template || null,
          category: row.category
        };
      }
    });
    
    console.log(`✅ Returning ${rows.length} components grouped by category`);
    res.json(components);
  } catch (error) {
    console.error('❌ Error fetching components:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single component
app.get('/api/components/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM components WHERE id = ?');
    const row = stmt.get(id);
    
    if (!row) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    const component = {
      name: row.name,
      props: JSON.parse(row.props || '{}'),
      scss: row.scss || '',
      template: row.template || null,
      category: row.category
    };
    
    res.json(component);
  } catch (error) {
    console.error('❌ Error fetching component:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT component by ID (create or update)
app.put('/api/components/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, props, scss, template } = req.body;
    
    // Validation
    if (!id || !name || !category || !props) {
      console.error('❌ Missing required fields:', { id: !!id, name: !!name, category: !!category, props: !!props });
      return res.status(400).json({ error: 'Missing required fields: id, name, category, props' });
    }
    
    // Vérifier que props est un objet
    if (typeof props !== 'object') {
      return res.status(400).json({ error: 'Props must be an object' });
    }
    
    const propsJson = JSON.stringify(props);
    const scssValue = scss || '';
    const templateValue = template || null;
    
    console.log(`💾 Saving component ${id}:`, {
      name,
      category,
      propsLength: propsJson.length,
      scssLength: scssValue.length,
      templateLength: templateValue ? templateValue.length : 0,
      hasTemplate: !!templateValue
    });
    
    const stmt = db.prepare(`
      INSERT INTO components (id, name, category, props, scss, template, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        props = excluded.props,
        scss = excluded.scss,
        template = excluded.template,
        updated_at = CURRENT_TIMESTAMP;
    `);
    
    const result = stmt.run(id, name, category, propsJson, scssValue, templateValue);
    
    console.log(`✅ Component ${id} saved successfully. Changes: ${result.changes}`);
    
    res.json({ 
      status: 'ok', 
      id: id,
      changes: result.changes,
      message: result.changes > 0 ? 'Component updated' : 'Component created',
      hasTemplate: !!templateValue
    });
    
  } catch (error) {
    console.error('❌ Error saving component:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// DELETE component
app.delete('/api/components/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM components WHERE id = ?');
    const result = stmt.run(id);
    
    console.log(`🗑️ Component ${id} deletion result:`, result);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json({ status: 'deleted', id: id, changes: result.changes });
  } catch (error) {
    console.error('❌ Error deleting component:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ENDPOINTS DESIGN TOKENS ==========




// ========== ENDPOINTS SYSTÈME ==========

// GET design tokens
app.get('/api/tokens', (req, res) => {
  try {
    const stmt = db.prepare('SELECT tokens FROM design_tokens ORDER BY updated_at DESC LIMIT 1');
    const row = stmt.get();
    
    if (!row) {
      console.log('📋 No tokens found in database, returning empty object');
      return res.json({});
    }
    
    const tokens = JSON.parse(row.tokens);
    console.log('✅ Returning latest design tokens');
    res.json(tokens);
  } catch (error) {
    console.error('❌ Error fetching tokens:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT design tokens (create or update)
app.put('/api/tokens', (req, res) => {
  try {
    const tokens = req.body;
    
    // Validation
    if (!tokens || typeof tokens !== 'object') {
      return res.status(400).json({ error: 'Invalid tokens data' });
    }
    
    const tokensJson = JSON.stringify(tokens);
    
    console.log('💾 Saving design tokens:', {
      hasColors: !!tokens.colors,
      hasSpacing: !!tokens.spacing,
      hasTypography: !!tokens.typography,
      hasBranding: !!tokens.branding,
      hasIcons: !!tokens.icons,
      hasFramework: !!tokens.framework,
      dataLength: tokensJson.length
    });
    
    // Supprimer les anciens tokens et insérer les nouveaux
    const deleteStmt = db.prepare('DELETE FROM design_tokens');
    const insertStmt = db.prepare(`
      INSERT INTO design_tokens (tokens, updated_at)
      VALUES (?, CURRENT_TIMESTAMP)
    `);
    
    // Transaction pour assurer la cohérence
    const transaction = db.transaction(() => {
      deleteStmt.run();
      return insertStmt.run(tokensJson);
    });
    
    const result = transaction();
    
    console.log('✅ Design tokens saved successfully');
    
    res.json({ 
      status: 'ok', 
      message: 'Design tokens saved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error saving tokens:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// 3. Mettre à jour le health check pour inclure les tokens :
app.get('/api/health', (req, res) => {
  try {
    const componentsStmt = db.prepare('SELECT COUNT(*) as count FROM components');
    const componentsResult = componentsStmt.get();
    
    const tokensStmt = db.prepare('SELECT COUNT(*) as count FROM design_tokens');
    const tokensResult = tokensStmt.get();
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      components_count: componentsResult.count,
      tokens_saved: tokensResult.count > 0
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

// GET database info (debug endpoint)
app.get('/api/debug', (req, res) => {
  try {
    const componentsStmt = db.prepare('SELECT id, category, name, LENGTH(scss) as scss_length, LENGTH(template) as template_length, template IS NOT NULL as has_template FROM components ORDER BY category, name');
    const components = componentsStmt.all();
    
    const tokensStmt = db.prepare('SELECT LENGTH(tokens) as tokens_length, updated_at FROM design_tokens ORDER BY updated_at DESC LIMIT 1');
    const tokensInfo = tokensStmt.get();
    
    res.json({
      total_components: components.length,
      components: components,
      categories: [...new Set(components.map(c => c.category))],
      tokens_info: tokensInfo || { tokens_length: 0, updated_at: null }
    });
  } catch (error) {
    console.error('❌ Debug endpoint failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Debug info: http://localhost:${PORT}/api/debug`);
  console.log(`💾 Database: ${DB_PATH}`);
  console.log(`🎨 Design tokens: http://localhost:${PORT}/api/tokens`);
});