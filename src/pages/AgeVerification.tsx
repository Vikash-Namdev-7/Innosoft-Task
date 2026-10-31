
import { useNavigate } from "react-router-dom";

const AgeVerification = () => {
  const navigate = useNavigate();

  const handleVerify = () => {
    sessionStorage.setItem("ageVerified", "true");
    navigate("/home");
  };

  const handleExit = () => {
    window.location.replace("about:blank");
  };

  return (
    <div className="bg-[#0c1a37] flex justify-center items-center w-full min-h-screen overflow-hidden text-white">
      <div className="flex flex-col max-w-[280px] justify-center items-center gap-9">
        <img
          src="https://kailash.insoftdemo.site/images/logo.png"
          alt="Logo"
          className="h-11"
        />

        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">
            Age <span className="text-yellow-400">Verification</span> !
          </h1>

          <p className="text-[12px]">
            You must be 18 years older to access this platform!
            Please confirm your age to continue.
          </p>
        </div>

        <button
          onClick={handleVerify}
          className="bg-yellow-400 border rounded-full py-2 px-32 text-black font-semibold"
        >
          18+
        </button>

        <button onClick={handleExit} className="font-semibold">
          Exit
        </button>
      </div>
    </div>
  );
};

export default AgeVerification;
