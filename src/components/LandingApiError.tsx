import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import logoAtj from "@/assets/logo-atj.png";

const LandingApiError = () => {
  const queryClient = useQueryClient();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await queryClient.invalidateQueries();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d1e4a 0%, #112250 50%, #1a3366 100%)" }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, #D8C18D 0%, transparent 50%), radial-gradient(circle at 80% 70%, #D8C18D 0%, transparent 50%)"
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        <img
          src={logoAtj}
          alt="The Journey Association"
          className="h-20 w-auto mb-10 opacity-90"
        />

        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full"
          style={{ background: "rgba(216,193,141,0.12)", border: "1.5px solid rgba(216,193,141,0.3)" }}
        >
          <WifiOff className="w-9 h-9" style={{ color: "#D8C18D" }} />
        </div>

        <h1 className="text-3xl font-bold mb-3 tracking-tight">
          Service Unavailable
        </h1>
        <p className="text-base mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          خدمة غير متاحة مؤقتاً
        </p>

        <div
          className="w-12 my-5"
          style={{ borderTop: "1px solid rgba(216,193,141,0.4)" }}
        />

        <p className="text-base leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          The server is temporarily unreachable. This may be due to maintenance
          or a network issue. Please try again in a moment.
        </p>

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-60"
          style={{
            background: "#D8C18D",
            color: "#112250",
          }}
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Retrying…" : "Try Again"}
        </button>

        <p className="mt-10 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Error 503 · The Journey Association
        </p>
      </div>
    </div>
  );
};

export default LandingApiError;
