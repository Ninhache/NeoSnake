const WidgetDisconnectedOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center backdrop-blur-sm">
      <p className="text-white font-bold text-lg bg-gray-900 bg-opacity-80 rounded-lg p-4 border border-gray-500 shadow-xl">
        You need to login to use that feature
      </p>
    </div>
  );
};

export default WidgetDisconnectedOverlay;
