import { useEffect, useState } from "react";
import cobra from "../../assets/cobra.png";

type Props = {};
const WidgetHeader: React.FC<Props> = ({}) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolled]);

  return (
    <>
      {import.meta.env.DEV && (
        <div className="bg-red-700 top-0 w-full text-center sticky shadow-md">
          <h1 className="text-2xl text-white">DEV BUILD</h1>
        </div>
      )}
      <header className="flex justify-center p-4">
        <img
          src={cobra}
          className={`transition-height duration-300 ease-in-out ${
            hasScrolled ? "h-24" : "h-96"
          }`}
          alt="placeholder"
        />
      </header>
    </>
  );
};

export default WidgetHeader;
