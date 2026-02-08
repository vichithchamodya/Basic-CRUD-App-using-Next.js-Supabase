const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700 font-semibold text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
