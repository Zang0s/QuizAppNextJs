# Quiz App - Aplikacja do tworzenia i rozwiązywania quizów

Nowoczesna aplikacja webowa umożliwiająca tworzenie i rozwiązywanie quizów z różnymi typami pytań. Aplikacja została zbudowana z wykorzystaniem Next.js, React, Firebase i Flowbite.

## 🌐 Wersja Live

Aplikacja jest dostępna pod adresem: [https://quiz-app-next-js.web.app](https://quiz-app-next-js.web.app)

## 📋 Funkcjonalności

- **Tworzenie quizów** - Twórz quizy z różnymi typami pytań:
  - Pytania jednokrotnego wyboru (Single Choice)
  - Pytania wielokrotnego wyboru (Multiple Choice)
  - Uzupełnianie luk (Fill in the Blanks)
  - Dopasowywanie par (Matching Pairs)
- **Rozwiązywanie quizów** - Rozwiązuj quizy stworzone przez innych użytkowników
- **Zarządzanie quizami** - Przeglądaj, edytuj i usuwaj swoje quizy
- **System autentykacji** - Rejestracja, logowanie i zarządzanie profilem użytkownika
- **Weryfikacja email** - Weryfikacja adresu email przy rejestracji
- **Profil użytkownika** - Zarządzanie danymi profilu i adresem

## 🛠️ Technologie

### Frontend

- **Next.js 16** - Framework React z App Router
- **React 19** - Biblioteka do budowy interfejsów użytkownika
- **Tailwind CSS** - Framework CSS do stylowania
- **Flowbite React** - Komponenty UI oparte na Tailwind CSS

### Backend & Baza danych

- **Firebase Authentication** - Autentykacja użytkowników
- **Cloud Firestore** - Baza danych NoSQL
- **Firebase Hosting** - Hosting aplikacji
- **Firebase Admin SDK** - Weryfikacja email programowo

### Testy

- **Playwright** - Testy End-to-End (E2E)

## 🚀 Instalacja i uruchomienie

### Wymagania wstępne

- Node.js (wersja 18 lub nowsza)
- npm lub yarn
- Konto Firebase z utworzonym projektem

### Kroki instalacji

1. **Sklonuj repozytorium**

   ```bash
   git clone <url-repozytorium>
   cd quiz-app-next-js
   ```

2. **Zainstaluj zależności**

   ```bash
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe**

   Utwórz plik `.env` w katalogu głównym projektu z następującymi zmiennymi:

   ```env
   NEXT_PUBLIC_API_KEY=twoj_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=twoj_projekt.firebaseapp.com
   NEXT_PUBLIC_PROJECT_ID=twoj_projekt_id
   NEXT_PUBLIC_STORAGE_BUCKET=twoj_projekt.appspot.com
   NEXT_PUBLIC_MESSAGING_SENDER_ID=twoj_sender_id
   NEXT_PUBLIC_APP_ID=twoj_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=twoj_measurement_id
   SERVICE_ACCOUNT_KEY=twoj_service_account_key_json_lub_base64
   ```

4. **Uruchom aplikację w trybie deweloperskim**

   ```bash
   npm run dev
   ```

5. **Otwórz przeglądarkę**

   Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000)

## 📜 Dostępne skrypty

- `npm run dev` - Uruchamia serwer deweloperski
- `npm run build` - Buduje aplikację produkcyjną
- `npm run start` - Uruchamia zbudowaną aplikację produkcyjną
- `npm run lint` - Uruchamia linter ESLint
- `npm run test` - Uruchamia testy Playwright
- `npm run test:ui` - Uruchamia testy Playwright z interfejsem graficznym
- `npm run test:headed` - Uruchamia testy Playwright z widoczną przeglądarką
- `npm run test:report` - Wyświetla raport z testów Playwright

## 🧪 Testy

Aplikacja zawiera testy E2E napisane w Playwright. Aby uruchomić testy:

1. Upewnij się, że aplikacja działa w trybie deweloperskim (`npm run dev`)
2. W osobnym terminalu uruchom:
   ```bash
   npm run test
   ```

## 📦 Wdrażanie

Aplikacja jest wdrożona na Firebase Hosting. Aby wdrożyć nową wersję:

1. **Zaloguj się do Firebase CLI**

   ```bash
   firebase login
   ```

2. **Zbuduj aplikację**

   ```bash
   npm run build
   ```

3. **Wdróż aplikację**
   ```bash
   firebase deploy
   ```

## 📁 Struktura projektu

```
quiz-app-next-js/
├── app/                    # Główny katalog aplikacji Next.js
│   ├── api/               # API routes
│   ├── components/        # Komponenty React
│   ├── lib/               # Biblioteki i konfiguracja
│   ├── protected/         # Chronione strony (wymagają logowania)
│   ├── public/            # Publiczne strony
│   └── quiz/              # Strony związane z quizami
├── tests/                 # Testy Playwright
├── .env                   # Zmienne środowiskowe (nie w repo)
├── firebase.json          # Konfiguracja Firebase
└── package.json           # Zależności projektu
```

## 👤 Autor

**Olaf Ciuła**

- Projekt: na zaliczenie
- Rok: 2025

## 📄 Licencja

Ten projekt został stworzony w celach edukacyjnych.
