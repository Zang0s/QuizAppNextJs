import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quiz App - Twórz i rozwiązuj quizy",
  description:
    "Aplikacja do tworzenia i rozwiązywania quizów z różnymi typami pytań",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <TopBar />
              <main className="flex-1 overflow-auto">{children}</main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
