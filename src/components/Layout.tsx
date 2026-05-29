import { useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // Scroll to top of page automatically whenever route path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-800" id="main-layout">
      <Header />
      <main className="flex-grow pb-16">{children}</main>
      <Footer />
    </div>
  );
}
