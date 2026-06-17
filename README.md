# DevLearn

Eine rollenbasierte Lernplattform für Webentwicklung – entwickelt als IHK-Portfolioprojekt im Rahmen der Ausbildung zum Fachinformatiker für Anwendungsentwicklung.

## Über das Projekt

DevLearn ermöglicht es Dozenten, strukturierte Kurse mit Modulen und Lektionen zu erstellen, und Schülern, diese Inhalte zu konsumieren und ihren Lernfortschritt zu verfolgen. Die Plattform unterstützt zwei Rollen: **Student** und **Dozent**.

## Features

- 🔐 Authentifizierung mit Firebase Auth (E-Mail/Passwort)
- 👨‍🎓 Studentenbereich: Kurse durchsuchen, Lektionen absolvieren, Fortschritt verfolgen
- 👨‍🏫 Dozentenbereich: Kurse, Module und Lektionen erstellen und verwalten
- 🌙 Dark Mode / Light Mode
- 📱 Responsives Layout mit Mobile-Sidebar
- ✅ Formularvalidierung (Login, Registrierung)
- 🎨 Hero-Bereich mit DaisyUI-Komponenten

## Kurskategorien

- HTML / CSS / JavaScript
- React / Vite / TypeScript
- Figma
- Framer

## Tech Stack

| Technologie      | Verwendung              |
| ---------------- | ----------------------- |
| React 18         | UI-Framework            |
| TypeScript       | Typsicherheit           |
| Vite             | Build-Tool & Dev-Server |
| Firebase Auth    | Authentifizierung       |
| Firestore        | Datenbank (Echtzeit)    |
| React Router DOM | Client-seitiges Routing |
| DaisyUI          | UI-Komponenten (Hero)   |
| Tailwind CSS     | Utility-CSS für DaisyUI |
| Vercel           | Deployment              |

## Projektstruktur

```
src/
├── components/
│   └── ui/              # Wiederverwendbare Komponenten
│       ├── CourseCard.tsx
│       ├── DevLearnLogo.tsx
│       └── ThemeToggleButton.tsx
├── context/
│   ├── AuthContext.tsx  # Authentifizierung & Nutzerprofil
│   └── ThemeContext.tsx # Dark/Light Mode
├── firebase/
│   └── firebase.ts      # Firebase-Konfiguration
├── hooks/
│   ├── useAuth.ts       # Zugriff auf AuthContext
│   ├── useCourses.ts    # Firestore-Listener für Kurse
│   └── useProgress.ts   # Lernfortschritt des Nutzers
├── pages/
│   ├── auth/            # Login, Registrierung
│   ├── public/          # Landing, Über uns, Preise, Kontakt
│   ├── student/         # Dashboard, Kurse, Module, Lektionen
│   └── teacher/         # Dashboard, Kursverwaltung
├── styles/              # Globale CSS-Dateien
├── utils/               # Hilfsfunktionen (z.B. Slug-Generator)
├── types.ts             # TypeScript-Typen
└── App.tsx              # Router & geschützte Routen
```

## Installation

```bash
# Repository klonen
git clone https://github.com/dein-username/devlearn.git
cd devlearn

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen anlegen
cp .env.example .env.local
# Firebase-Konfiguration in .env.local eintragen

# Entwicklungsserver starten
npx vite
```

## Umgebungsvariablen

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Entwickelt von

Steffen — Syntax Institut  
Ausbildung: Web Developer
