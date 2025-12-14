# Przygotowanie repozytorium Git

## Co NIE powinno być w repozytorium:

❌ **node_modules/** - zawsze ignorowane (zainstaluj przez `npm install`)
❌ **.env** - zmienne środowiskowe (dodaj ręcznie w Vercel)
❌ **.next/** - folder build Next.js
❌ **out/** - folder eksportu statycznego
❌ **test-results/** - wyniki testów Playwright
❌ **playwright-report/** - raporty Playwright

## Co POWINNO być w repozytorium:

✅ **package.json** - lista zależności
✅ **package-lock.json** - zablokowane wersje zależności
✅ **app/** - kod źródłowy aplikacji
✅ **public/** - pliki statyczne
✅ **next.config.mjs** - konfiguracja Next.js
✅ **.gitignore** - lista ignorowanych plików
✅ **README.md** - dokumentacja

## Jak sprawdzić co zostanie dodane do Git:

```bash
git status
```

## Jak dodać pliki do repozytorium:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Po sklonowaniu repozytorium:

```bash
npm install
```

To zainstaluje wszystkie zależności z `package.json`.

