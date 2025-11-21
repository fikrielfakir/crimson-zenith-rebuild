import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  example?: string;
}

const ErrorPage = ({ code, title, description, example }: ErrorPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(`${code} Error: ${title} - ${description}`);
  }, [code, title, description]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-gray-900 animate-pulse">{code}</h1>
          <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        </div>
        
        <div className="space-y-3">
          <p className="text-lg text-gray-600">{description}</p>
          {example && (
            <div className="bg-gray-200 rounded-lg p-4 text-left">
              <p className="text-sm font-mono text-gray-700">
                <span className="font-semibold">Example:</span> {example}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="px-6"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
