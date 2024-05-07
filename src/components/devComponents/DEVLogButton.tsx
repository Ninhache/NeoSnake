type Props = {
  obj: any;
};
const DEVLogButton: React.FC<Props> = ({ obj }) => {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <button
        className="border-4 border-red-500 rounded-lg p-2 hover:bg-red-400 transition-colors duration-300 font-bold text-xl"
        onClick={() => console.table(obj)}
      >
        *DEV* Log result
      </button>
    </>
  );
};

export default DEVLogButton;
