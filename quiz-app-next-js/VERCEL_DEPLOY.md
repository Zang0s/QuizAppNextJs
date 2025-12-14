# Wdrażanie na Vercel (Darmowe)

## Kroki wdrożenia:

1. **Umieść kod w repozytorium GitHub**
   - Utwórz repozytorium na GitHub
   - Wykonaj commit i push kodu

2. **Załóż konto na Vercel**
   - Przejdź na https://vercel.com
   - Zaloguj się używając konta GitHub

3. **Dodaj projekt**
   - W Vercel Dashboard kliknij "Add New..." → "Project"
   - Wybierz repozytorium z kodem projektu
   - Kliknij "Import"

4. **Skonfiguruj zmienne środowiskowe**
   - W ustawieniach projektu wybierz "Settings" → "Environment Variables"
   - Kliknij "Import .env" i zaimportuj plik `.env` z lokalnego projektu
   - Lub dodaj ręcznie wszystkie zmienne z prefiksem `NEXT_PUBLIC_`

5. **Wdróż**
   - Vercel automatycznie wykryje Next.js i skonfiguruje build
   - Kliknij "Deploy"
   - Po zakończeniu otrzymasz link do aplikacji

6. **Redeploy (jeśli potrzebne)**
   - W zakładce "Deployments" wybierz pierwsze wdrożenie
   - Kliknij menu (...) → "Redeploy"

7. **Otwórz aplikację**
   - W zakładce "Project" kliknij "Visit"

## Zalety Vercel:
- ✅ Darmowe dla projektów personalnych
- ✅ Automatyczna konfiguracja Next.js
- ✅ Automatyczne wdrożenia przy push do GitHub
- ✅ Wsparcie dla dynamicznych tras Next.js
- ✅ SSL i CDN wbudowane
- ✅ Nie wymaga planu płatnego

