import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Redirector() {
  const { shortKey } = useParams();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    let isMounted = true;
  
    const redirect = async () => {
      if (!shortKey) {
        navigate("/NotFound", { replace: true });
        return;
      }
  
      try {
        const response = await api.get(`/${shortKey}`);
  
        const data = response.data;
  
        if (response.status !== 200 || !data.target_url) {
          console.error("Error response:", data);
          navigate("/NotFound", { replace: true });
          return;
        }
  
        let targetUrl = data.target_url;
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
          targetUrl = `https://${targetUrl}`;
        }
  
        if (isMounted) {
          window.location.href = targetUrl;
        }
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/NotFound", { replace: true });
      }
    };
  
    redirect();
  
    return () => {
      isMounted = false;
    };
  }, [shortKey, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
      Redirecting...
    </div>
  );
}

export default Redirector;