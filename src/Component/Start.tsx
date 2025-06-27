import Button from "./ui/button";
import type { FC } from "react";
import {useNavigate} from "react-router-dom";
const Start: FC = () => {
 const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
    
      <div className="bg-gradient-to-br from-orange-300 to-orange-400 flex-1 lg:flex-none lg:w-1/2 min-h-[40vh] lg:min-h-screen" />

      
        <div className="flex-1 bg-gray-50 flex flex-col justify-center items-center px-6 py-12 lg:px-12">        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-light tracking-wide">
              <span className="text-orange-400 font-medium">S10</span>
              <span className="text-gray-600">.Clinic</span>
            </h1>
          </div>

          
          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate("/create-account")}
            >
              START CONSULTING
            </Button>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </Button>
          </div>

          
          <div className="flex justify-center space-x-2 pt-8">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;