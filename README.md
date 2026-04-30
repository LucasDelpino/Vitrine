# 🛒 E-Commerce Fullstack Application

Application e-commerce complète développée en fullstack permettant la gestion de produits, commandes et paiements en ligne.

---

## 🚀 Stack technique

### Frontend
- React (Vite)
- HTML / CSS
- Axios

### Backend
- Node.js
- Express

### Base de données
- MySQL (Docker)

### DevOps / Outils
- Docker & Docker Compose
- Git / GitHub
- Stripe (paiement)
- API REST

---

## ⚙️ Fonctionnalités

### 👤 Utilisateur
- Consultation des produits
- Page produit dynamique
- Ajout au panier
- Passage de commande
- Paiement sécurisé via Stripe

### 🛠️ Administration
- Gestion des produits (CRUD)
- Gestion du stock
- Gestion des commandes
- Mise à jour dynamique des disponibilités

### 🔐 Sécurité
- API structurée
- Protection des routes
- Bonnes pratiques backend

---

## 📸 Aperçu

- Page d'accueil
- <img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/95c5226d-25b3-4faa-9ffd-842a8e42a08b" />

- Fiche produit
- <img width="1131" height="920" alt="image" src="https://github.com/user-attachments/assets/252e0a26-d379-46bd-a94c-9e9f5fe56644" />

- Panier
- <img width="672" height="777" alt="image" src="https://github.com/user-attachments/assets/3de1c774-1b43-4b85-9d84-ac3b261b859a" />

- Paiement
- <img width="999" height="918" alt="image" src="https://github.com/user-attachments/assets/7e72e9e0-252a-4041-9256-471a0f135a98" />

- Interface admin
- <img width="1121" height="679" alt="image" src="https://github.com/user-attachments/assets/382972b0-b88a-4855-9a3b-65c3cbddb777" />
- <img width="1091" height="536" alt="image" src="https://github.com/user-attachments/assets/b1c0bc62-0de5-41e2-b6a5-071b171acf70" />

## 📂 Structure du projet

```bash
Vitrine/
├── client/        # Frontend React / Vite
├── server/        # Backend Node.js / Express
├── db_init/       # Scripts SQL d'initialisation
├── docker-compose.yml

---

## 🔐 Variables d’environnement

### 1. Créer un fichier .env dans le dossier server/ :


PORT=3000
DB_HOST=localhost
DB_PORT=****
DB_USER=
DB_PASSWORD=
DB_NAME=
STRIPE_SECRET_KEY=your_stripe_secret_key

### 2. Créer un fichier .env dans le dossier client/ :

VITE_API_URL=http://localhost:3000/api

- ⚠️ Les fichiers .env ne doivent jamais être envoyés sur GitHub.

---

## 🧪 Installation & lancement

### 1. Cloner le projet

```bash
git clone https://github.com/LucasDelpino/Vitrine.git
cd Vitrine

### 2. Lancer la base de données avec Docker

docker-compose up -d

### 3. Lancer le backend
- cd server
- npm install
- npm run dev

API disponible sur :

- http://localhost:3000/api

### 4. Lancer le frontend

- cd client
- npm install
- npm run dev

Application disponible sur :

http://localhost:5173
---


├── Dockerfile
├── .gitignore
└── README.md

---

## 🧠 Compétences développées
- Développement fullstack (React / Node.js)
- Conception d’API REST
- Gestion de base de données MySQL
- Containerisation avec Docker
- Intégration de paiement (Stripe)
- Gestion du state frontend
- Debug et résolution de problèmes

---

## 🔄 Améliorations prévues
- Authentification utilisateur (JWT)
- Dashboard admin avancé
- Tests automatisés
- Optimisation SEO
- Déploiement en production
- Documentation API

---

## 👤 Auteur

Lucas Del Pino

- 💻 Développeur Web & Cybersécurité
- 🎯 Recherche contrat de professionnalisation — Septembre 2026

📫 Contact :

LinkedIn : www.linkedin.com/in/lucas-del-pino-b3820035b
Email : delpino.lucas@hotmail.fr

---

### ⭐ Support

Si le projet t’a plu, n’hésite pas à mettre une ⭐ sur le repo !

