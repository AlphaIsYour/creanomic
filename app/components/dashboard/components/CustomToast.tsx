import React, { useEffect, useState } from "react";
import { toast, Toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2, X } from "lucide-react";

interface CustomToastProps {
  t: Toast;
  message: string;
  type: "success" | "error" | "loading";
}

export const CustomToast: React.FC<CustomToastProps> = ({
  t,
  message,
  type,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = t.duration || 3000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [t.duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "loading":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-200 relative overflow-hidden min-w-[350px] border border-gray-100`}
    >
      <div className="flex-1 w-0 p-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="border-l border-gray-100 p-3 flex items-center justify-center text-gray-400 bg-gray-50 hover:text-gray-600 hover:bg-gray-50 focus:outline-none transition-all duration-150 ease-out"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gray-300 transition-all duration-55 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
