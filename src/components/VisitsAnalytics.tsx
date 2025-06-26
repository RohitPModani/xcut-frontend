import { showError } from "../lib/toast";
import { getVisits } from "../services/api";
import { useState } from "react";
import { BarChart } from "lucide-react";

export function VisitsAnalytics() {
  const [visits, setVisits] = useState(0);
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleGetVisits = async () => {
    if (!shortUrl) {
      showError("No short URL provided");
      return;
    }

    if (!isValidUrl(shortUrl)) {
      showError("Invalid short URL");
      return;
    }

    const secret_key = shortUrl.split("/").pop();
    if (!secret_key) {
      showError("Invalid short URL");
      return;
    }

    setIsLoading(true);
    try {
      const visits = await getVisits(secret_key);
      setVisits(visits.visits);
    } catch (error) {
      showError("Failed to get visits");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12">
      <div className="text-center space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-900 dark:from-zinc-400 dark:to-zinc-100">
            Track Your Visits
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400">
            Get analytics for your shortened URLs
          </p>
        </div>

        <div className="result-box max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="url"
              placeholder="Enter your shortened URL here..."
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              className="input-field flex-1 min-w-0"
              disabled={isLoading}
            />
            <button
              onClick={handleGetVisits}
              disabled={isLoading}
              className="button-primary whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Get Visits
                </span>
              )}
            </button>
          </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                  Analytics Summary
                </h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Last updated: {new Date().toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    Total Visits
                  </p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {visits}
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}