import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/video");
  };
  return (
    <>
      <div className="flex h-screen justify-center items-center ">
        <Button
          className="flex justify-center items-center bg-blue-600 rounded-full h-14 w-40 hover:bg-white hover:text-black"
          onClick={handleClick}
        >
          Start Video Call
        </Button>
      </div>
    </>
  );
}
