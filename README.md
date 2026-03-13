# PAULYON Lab Hub

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Site web officiel de **PAULYON Lab Hub**, une plateforme moderne pour présenter des **produits digitaux, services technologiques et solutions IT** avec commande rapide via WhatsApp.

Le site est conçu pour être **rapide, modulaire et facilement configurable** grâce à l'utilisation de fichiers JSON.

---

# Aperçu

Site en ligne :

paulyon.vercel.app

Le site permet de :

• présenter des produits digitaux
• présenter des services technologiques
• ajouter des articles dans un panier
• envoyer une commande via WhatsApp
• gérer les contenus sans modifier le code

---

# Fonctionnalités

* Interface **Dark UI moderne**
* Architecture **JavaScript modulaire**
* **Panier dynamique**
* Commande **WhatsApp automatique**
* Données configurables via **JSON**
* Système de **traduction (i18n)**
* **Responsive design**
* Compatible **mobile / tablette / desktop**

---

# Technologies

Frontend :

* HTML5
* CSS3 (architecture modulaire)
* JavaScript ES6 Modules

Données :

* JSON

Icônes :

* Font Awesome

Déploiement :

* Vercel

---

# Structure du projet

```text
paulyon-site/
│
├── index.html
├── header.html
│
├── css/
│   ├── Normalize.css
│   ├── Base.css
│   ├── Layout.css
│   ├── Components.css
│   ├── Header.css
│   ├── Footer.css
│   ├── Form.css
│   ├── Produits.css
│   ├── Services.css
│   └── media.css
│
├── js/
│   ├── main.js
│   ├── state.js
│   ├── ui.js
│   ├── cart.js
│   ├── i18n.js
│   ├── produits.js
│   ├── services.js
│   └── parametres.js
│
├── data.json
├── traduction.json
└── README.md
```

---

# Installation

1 Cloner le projet

```bash
git clone https://github.com/ton-username/paulyon-site.git
```

2 Entrer dans le dossier

```bash
cd paulyon-site
```

3 Lancer un serveur local
(exemple avec **Live Server** dans VS Code)

---

# Configuration

## Modifier les produits

Dans :

data.json

Exemple :

```json
{
 "name": "Produit Exemple",
 "price": 2500,
 "iconClass": "fa-solid fa-box",
 "colorClass": "icon-blue",
 "imagePath": "images/product.jpg"
}
```

---

## Modifier les services

Dans :

data.json

```json
{
 "title": "Développement Web",
 "details": "Création de sites web modernes",
 "price": 5000
}
```

---

## Modifier le numéro WhatsApp

Dans :

data.json → generalSettings

```json
{
 "whatsappNumber": "+509XXXXXXXX"
}
```

---

# Internationalisation

Les traductions sont gérées dans :

traduction.json

Exemple :

```json
{
 "fr": {
  "home": "Accueil",
  "products": "Produits"
 },
 "en": {
  "home": "Home",
  "products": "Products"
 }
}
```

---

# Fonctionnement du panier

Le panier permet :

* d'ajouter des produits
* de calculer un total
* d'envoyer automatiquement une commande via WhatsApp

Le message est généré automatiquement avec :

* la liste des articles
* les prix
* le total

---

# Déploiement

Le projet peut être déployé facilement sur :

* Vercel
* Netlify
* GitHub Pages

Déploiement recommandé :

Vercel

https://vercel.com

---

# Roadmap

Améliorations prévues :

* sauvegarde du panier (localStorage)
* système de navigation SPA
* panneau d'administration
* animations UI avancées
* optimisation SEO

---

# Contribution

Les contributions sont les bienvenues.

Pour contribuer :

1 Fork le projet
2 Créer une branche

```bash
git checkout -b feature/nouvelle-fonction
```

3 Commit les modifications

```bash
git commit -m "Ajout nouvelle fonctionnalité"
```

4 Push

```bash
git push origin feature/nouvelle-fonction
```

5 Ouvrir une Pull Request

---

# Auteur

PAULYON

Projet développé pour **PAULYON Lab Hub**

---

# Licence

MIT License

Vous êtes libre d'utiliser, modifier et distribuer ce projet.
