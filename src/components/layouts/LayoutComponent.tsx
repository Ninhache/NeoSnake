type Props = {
  children: React.ReactNode;
};

const LayoutComponent: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-center items-center flex-col min-w-96 w-full pt-1 md:p-2  max-w-screen-xl">
      <div className="bg-gray-700 md:rounded-lg p-4 w-full text-white">
        {children}
      </div>
    </div>
  );
};

export default LayoutComponent;
