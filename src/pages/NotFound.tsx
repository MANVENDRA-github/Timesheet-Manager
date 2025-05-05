
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md">
        <h1 className="text-6xl font-bold text-timesheet-blue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist</p>
        <Button asChild>
          <a href="/">Return to Timesheet</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
