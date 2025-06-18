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
  
  startServices();
}

// Fonction pour démarrer tous les services
function startServices() {
  log('green', 'START', 'Démarrage du Design System Builder...');
  
  const services = [
    {
      name: 'Backend',
      command: 'node',
      args: ['server.js'],
      cwd: 'server',
      color: 'green',
      port: 3001
    },
    {
      name: 'Frontend',
      command: 'npm',
      args: ['run', 'dev:frontend'],
      cwd: '.',
      color: 'blue',
      port: 3000
    },
    {
      name: 'Tailwind',
      command: 'npx',
      args: ['tailwindcss', '-i', './src/input.css', '-o', './src/output.css', '--watch'],
      cwd: '.',
      color: 'cyan',
      port: null
    }
  ];

  const processes = [];

  // Fonction pour arrêter tous les processus
  function cleanup() {
    log('yellow', 'CLEANUP', 'Arrêt des services...');
    processes.forEach(proc => {
      if (proc && !proc.killed) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t'], { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      }
    });
    process.exit(0);
  }

  // Gestion des signaux d'arrêt
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Démarrer chaque service
  services.forEach((service, index) => {
    setTimeout(() => {
      log(service.color, service.name.toUpperCase(), `Démarrage${service.port ? ` sur port ${service.port}` : ''}...`);
      
      const proc = spawn(service.command, service.args, {
        cwd: service.cwd,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
      });

      processes.push(proc);

      // Gestion des logs avec préfixe coloré
      proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.trim()) {
            log(service.color, service.name, line.trim());
          }
        });
      });

      proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.trim() && !line.includes('DeprecationWarning')) {
            log('red', `${service.name}-ERR`, line.trim());
          }
        });
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          log('red', service.name.toUpperCase(), `Processus arrêté avec le code ${code}`);
        }
      });

      proc.on('error', (err) => {
        log('red', service.name.toUpperCase(), `Erreur: ${err.message}`);
      });

    }, index * 1000); // Délai de 1s entre chaque service
  });

  // Message de succès après 4 secondes
  setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    log('green', 'SUCCESS', '🚀 Design System Builder démarré !');
    log('blue', 'FRONTEND', '📱 http://localhost:3000');
    log('green', 'BACKEND', '🔧 http://localhost:3001/api/health');
    log('cyan', 'TAILWIND', '🎨 Mode watch actif');
    console.log('='.repeat(60) + '\n');
    log('yellow', 'INFO', 'Utilisez Ctrl+C pour arrêter tous les services');
  }, 4000);
}

// Point d'entrée
checkDependencies();