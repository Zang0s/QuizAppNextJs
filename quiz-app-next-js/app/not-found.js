import Link from "next/link";
import { Button, Card } from "flowbite-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Strona nie została znaleziona
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        <Link href="/">
          <Button color="blue" className="w-full">
            Powrót do strony głównej
          </Button>
        </Link>
      </Card>
    </div>
  );
}

