import { useState } from "react";
import {
  ExternalLink,
  QrCode,
  Share,
  Copy,
  X,
  Download,
  WandSparkles,
} from "lucide-react";
import { showError, showSuccess } from "../lib/toast";
import { shortenUrl } from "../services/api";
import { QRCodeSVG } from "qrcode.react";

export function URLShortener() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [showQR, setShowQR] = useState(false);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleShortenUrl = async () => {
    if (!url.trim()) {
      showError("Please enter a URL to shorten");
      return;
    }

    if (!isValidUrl(url)) {
      showError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await shortenUrl({ target_url: url });
      setShortenedUrl(response.short_url);
      showSuccess("URL shortened successfully");
    } catch (error) {
      showError("Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = (shortenedUrl: string) => {
    window.open(shortenedUrl, "_blank");
  };

  const handleGenerateQR = () => {
    setShowQR(true);
  };

  const handleShare = async (shortenedUrl: string) => {
    const fullUrl = `${shortenedUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortened URL",
          text: "Check out this shortened URL",
          url: fullUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullUrl);
        showSuccess("URL copied to clipboard");
      } catch (err) {
        showError("Failed to copy URL");
      }
    }
  };

  const handleCopy = async (shortenedUrl: string) => {
    const fullUrl = `${shortenedUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      showSuccess("URL copied to clipboard");
    } catch (err) {
      showError("Failed to copy URL");
    }
  };

  const handleDownloadQR = async (type: "png" | "svg") => {
    const qrCodeElement = document.querySelector("svg.qrcode-svg");

    if (!qrCodeElement) {
      showError("QR code element not found");
      return;
    }

    if (type === "svg") {
      try {
        const svgClone = qrCodeElement.cloneNode(true) as SVGElement;
        svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qrcode.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess("SVG downloaded successfully");
      } catch (error) {
        showError("Failed to download SVG");
        console.error("Error downloading SVG:", error);
      }
    } else {
      try {
        const svgData = new XMLSerializer().serializeToString(qrCodeElement);
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx?.drawImage(img, 20, 20, 360, 360);
          try {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(svgUrl);
            showSuccess("PNG downloaded successfully");
          } catch (error) {
            showError("Failed to generate PNG");
            console.error("Error generating PNG:", error);
          }
        };

        img.src = svgUrl;
      } catch (error) {
        showError("Failed to generate PNG");
        console.error("Error generating PNG:", error);
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-zinc-600 dark:from-white dark:to-zinc-400">
              Shorten Your URLs
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400">
              Transform long URLs into short, shareable links in a click
            </p>
          </div>

          <div className="result-box max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field flex-1 min-w-0"
                disabled={isLoading}
              />
              <button
                onClick={handleShortenUrl}
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
                    Shortening...
                  </span>
                ) : (
                  "Shorten URL"
                )}
              </button>
            </div>

            {shortenedUrl && (
              <div className="space-y-6">
                <div className="text-center mt-4 mb-2">
                  <h3 className="text-2xl font-semibold">
                    <WandSparkles className="h-6 w-6 inline-block" /> Your
                    Shortened URL
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Shortened URL */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-zinc-800 p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                      <button
                        onClick={() => handleCopy(shortenedUrl)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors truncate">
                          {shortenedUrl}
                        </p>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleCopy(shortenedUrl)}
                          className="button-primary"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRedirect(shortenedUrl)}
                          className="button-primary"
                          title="Open original URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGenerateQR()}
                          className="button-primary"
                          title="Generate QR code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleShare(shortenedUrl)}
                          className="button-primary"
                          title="Share link"
                        >
                          <Share className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-sm w-full">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                  QR Code
                </h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-zinc-500 dark:text-zinc-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg flex items-center justify-center border border-zinc-200">
                <QRCodeSVG
                  value={shortenedUrl}
                  size={200}
                  level="H"
                  className="w-full max-w-[200px] qrcode-svg"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  marginSize={2}
                />
              </div>

              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => handleDownloadQR("png")}
                  className="button-primary flex-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> PNG
                  </div>
                </button>
                <button
                  onClick={() => handleDownloadQR("svg")}
                  className="button-primary flex-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> SVG
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}