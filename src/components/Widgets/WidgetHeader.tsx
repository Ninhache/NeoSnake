import cobra from "../../assets/cobra.png";

type Props = {};
const WidgetHeader: React.FC<Props> = ({}) => {
  return (
    <>
      {import.meta.env.DEV && (
        <div className="bg-red-700 top-0 w-full text-center sticky shadow-md">
          <h1 className="text-2xl text-white">DEV BUILD</h1>
        </div>
      )}
      <header className="flex justify-center p-4">
        <img src={cobra} alt="placeholder" />
      </header>
    </>
  );
};

export default WidgetHeader;
