import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto py-8 border-t border-gray-800" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-2 text-white font-bold text-xl">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          <span className="tracking-wider">DAW BOOKSTORE</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          © 2026 DAW BOOKSTORE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
