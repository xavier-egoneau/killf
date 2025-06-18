# 🎨 Design System Builder

Un outil moderne pour créer et gérer des design systems compatible avec l'IA.

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le repo
git clone <votre-repo>
cd design-system-builder

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server && npm install && cd ..
```

### Lancement (Option 1 - Recommandée)
```bash
# 🎯 Une seule commande pour tout démarrer !
npm run dev
```

### Lancement (Option 2 - Script intelligent)
```bash
# Script avec vérifications automatiques et logs colorés
node start-dev.js
```

### Lancement (Option 3 - Manuel)
Si vous préférez contrôler chaque processus séparément :
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
npm run dev:frontend

# Terminal 3 - Tailwind CSS
npm run dev:css
```

## 📱 URLs de Développement

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Debug Info**: http://localhost:3001/api/debug

## 🛠️ Scripts Disponibles

### Développement
- `npm run dev` - Démarre tout (frontend + backend + CSS)
- `npm run dev:frontend` - Frontend seulement (Vite)
- `npm run dev:backend` - Backend seulement (Express)
- `npm run dev:css` - Tailwind CSS watch seulement

### Production
- `npm run build` - Build complet (CSS + frontend)
- `npm run start` - Démarre en mode production
- `npm run preview` - Preview du build

### Maintenance
- `npm run lint` - Vérification ESLint
- `npm run test:server` - Test de connexion serveur

## 🔧 Configuration

### Frontend (Vite)
- **Port**: 3000
- **Proxy API**: `/api/*` → `http://localhost:3001`
- **Auto-ouverture**: Navigateur se lance automatiquement

### Backend (Express)
- **Port**: 3001
- **Base de données**: SQLite (`design.db`)
- **Mode watch**: Redémarre automatiquement sur les changements

### CSS (Tailwind)
- **Input**: `src/input.css`
- **Output**: `src/output.css`
- **Mode**: Watch automatique

## 📁 Structure du Projet

```
design-system-builder/
├── src/                    # Frontend React
│   ├── components/         # Composants React
│   ├── hooks/             # Hooks personnalisés
│   ├── utils/             # Utilitaires
│   ├── data/              # Données par défaut
│   ├── input.css          # CSS source Tailwind
│   └── main.jsx           # Point d'entrée
├── server/                # Backend Node.js
│   ├── server.js          # Serveur Express
│   ├── debug.js           # Script de test
│   └── design.db          # Base SQLite (généré)
├── start-dev.js           # Script de démarrage intelligent
└── package.json           # Dépendances et scripts
```

## 🚨 Résolution de Problèmes

### Port déjà utilisé
```bash
# Tuer les processus sur les ports 3000/3001
npx kill-port 3000 3001
```

### Base de données corrompue
```bash
cd server && npm run db:reset
```

### Dépendances manquantes
```bash
# Réinstaller tout
rm -rf node_modules server/node_modules
npm install && cd server && npm install
```

### CSS non généré
```bash
# Forcer la génération CSS
npm run build:css
```

## ✨ Nouvelles Fonctionnalités

### 🔄 Auto Spacing Framework
- Le spacing s'adapte automatiquement au framework CSS sélectionné
- Plus besoin de choisir manuellement le preset de spacing

### 🎨 Material Icons
- Nouveau set d'icônes Google Material Design
- Instructions d'utilisation intégrées

### 🚀 Démarrage Simplifié
- **Avant**: 3 terminaux à gérer
- **Maintenant**: 1 seule commande `npm run dev`

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Tester avec `npm run dev`
3. Vérifier avec `npm run lint`
4. Créer une Pull Request

## 📄 Licence

MIT# 🎨 Design System Builder

Un outil moderne pour créer et gérer des design systems compatible avec l'IA.

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le repo
git clone <votre-repo>
cd design-system-builder

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server && npm install && cd ..
```

### Lancement
```bash
# 🎯 Commande principale (recommandée)
npm run dev
```

### Lancement alternatif (script avec logs colorés)
```bash
# Si vous préférez des logs colorés
node start-dev.js
```

## 📱 URLs de Développement

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Debug Info**: http://localhost:3001/api/debug

## 🛠️ Scripts Disponibles

### Développement
- `npm run dev` - **Démarre tout** (frontend + backend + CSS) ⭐
- `npm run dev:frontend` - Frontend seulement (Vite)
- `npm run dev:backend` - Backend seulement (Express)
- `npm run dev:css` - Tailwind CSS watch seulement

### Production
- `npm run build` - Build complet (CSS + frontend)
- `npm run start` - Démarre en mode production
- `npm run preview` - Preview du build

### Maintenance
- `npm run lint` - Vérification ESLint
- `npm run test:server` - Test de connexion serveur

## ⚡ Troubleshooting

### Le CSS ne s'applique pas
```bash
# Vérifier que Tailwind génère le CSS
ls -la src/output.css

# Si le fichier n'existe pas
npx tailwindcss -i ./src/input.css -o ./src/output.css
```

### Port déjà utilisé
```bash
# Tuer les processus sur les ports 3000/3001
npx kill-port 3000 3001
```

### Redémarrage complet
```bash
# Arrêter tous les processus (Ctrl+C)
# Puis relancer
npm run dev
```

## ✨ Nouvelles Fonctionnalités

### 🔄 Auto Spacing Framework
- Le spacing s'adapte automatiquement au framework CSS sélectionné

### 🎨 Material Icons
- Nouveau set d'icônes Google Material Design

### 📁 Upload SVG Logo  
- Upload direct de fichiers SVG pour le logo
- Conversion automatique en Data URL

### 📦 Export CSS Séparé
- Export framework séparé du CSS custom
- 6 options d'export différentes
- Documentation automatique

### 🚀 Démarrage Simplifié
- **Avant**: 3 terminaux à gérer
- **Maintenant**: `npm run dev` et c'est tout !

## 🏗️ Framework Support

- **Tailwind CSS** (recommandé)
- **Bootstrap**  
- **Angular Material**
- **Vanilla CSS**

Le framework est détecté automatiquement et le CSS/CDN approprié est chargé.

## 📁 Structure du Projet

```
design-system-builder/
├── src/                    # Frontend React
├── server/                # Backend Node.js + SQLite
├── start-dev.js           # Script de démarrage (optionnel)
└── package.json           # Scripts et dépendances
```

## 🤝 Contribution

1. `npm run dev` pour développer
2. `npm run lint` pour vérifier
3. Tester les nouvelles fonctionnalités

## 📄 Licence

MIT