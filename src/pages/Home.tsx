// Home.tsx
import { URLShortener } from "../components/URLShortener";
import ThemeToggle from "../components/ThemeToggle";
import { VisitsAnalytics } from "../components/VisitsAnalytics";

function Home() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="section min-h-screen transition-colors duration-300">
      <header className="w-full flex items-center justify-between px-4 py-4 sm:py-6 max-w-7xl mx-auto gap-2 sm:gap-4">
        <button
          onClick={handleLogoClick}
          className="text-lg sm:text-2xl font-bold text-zinc-800 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-400 transition focus:outline-none"
        >
          xCut
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
        </div>
      </header>
      <URLShortener />
      <hr className="w-full my-4 border-zinc-200 dark:border-zinc-800" />
      <VisitsAnalytics />
    </div>
  );
}

export default Home;