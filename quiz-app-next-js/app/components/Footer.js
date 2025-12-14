export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 Quiz App. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              O nas
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Kontakt
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pomoc
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

