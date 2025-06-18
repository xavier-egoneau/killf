#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, prefix, message) {
  console.log(`${colors[color]}${colors.bright}[${prefix}]${colors.reset}${colors[color]} ${message}${colors.reset}`);
}

// Vérification des dépendances
function checkDependencies() {
  log('blue', 'CHECK', 'Vérification des dépendances...');
  
  // Vérifier node_modules frontend
  if (!existsSync('node_modules')) {
    log('red', 'ERROR', 'node_modules manquant. Exécutez: npm install');
    process.exit(1);
  }
  
  // Vérifier si le serveur existe
  if (!existsSync('server/server.js')) {
    log('red', 'ERROR', 'server/server.js introuvable. Vérifiez la structure du projet.');
    process.exit(1);
  }
  
  // Vérifier les fichiers CSS
  if (!existsSync('src/input.css')) {
    log('red', 'ERROR', 'src/input.css introuvable.');
    process.exit(1);
  }
  
  startServices();
}

// Fonction pour démarrer tous les services
function startServices() {
  log('green', 'START', 'Démarrage du Design System Builder...');
  
  // 🆕 Utiliser directement npm run pour éviter les problèmes de concurrently
  log('blue', 'INFO', 'Lancement via npm run dev (plus stable)...');
  
  const npmProcess = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit', // 🆕 Hériter des flux stdio (plus simple)
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  // Gestion propre de l'arrêt
  function cleanup() {
    log('yellow', 'CLEANUP', 'Arrêt des services...');
    if (npmProcess && !npmProcess.killed) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', npmProcess.pid, '/f', '/t'], { stdio: 'ignore' });
      } else {
        npmProcess.kill('SIGTERM');
      }
    }
    process.exit(0);
  }

  // Gestion des signaux d'arrêt
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  npmProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log('red', 'ERROR', `npm run dev s'est arrêté avec le code ${code}`);
      log('yellow', 'HELP', 'Essayez de lancer manuellement: npm run dev');
    }
  });

  npmProcess.on('error', (err) => {
    log('red', 'ERROR', `Erreur npm: ${err.message}`);
    log('yellow', 'HELP', 'Vérifiez que npm et Node.js sont installés correctement');
  });

  // Message de succès
  setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    log('green', 'SUCCESS', '🚀 Design System Builder lancé via npm!');
    log('blue', 'INFO', '📱 Frontend: http://localhost:3000');
    log('green', 'INFO', '🔧 Backend: http://localhost:3001/api/health');
    log('cyan', 'INFO', '🎨 Tailwind: Mode watch actif');
    console.log('='.repeat(60) + '\n');
    log('yellow', 'INFO', 'Utilisez Ctrl+C pour arrêter tous les services');
  }, 2000);
}

// Point d'entrée avec gestion d'erreur
try {
  checkDependencies();
} catch (error) {
  log('red', 'ERROR', `Erreur fatale: ${error.message}`);
  log('yellow', 'FALLBACK', 'Utilisez plutôt: npm run dev');
  process.exit(1);
}