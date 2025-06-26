import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md space-y-6">
        <h1 className="text-6xl font-bold text-zinc-800 dark:text-zinc-100">404</h1>
        <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-200">
          Page Not Found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          The shortened URL you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="button-primary mt-6 px-6 py-2 text-base"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}