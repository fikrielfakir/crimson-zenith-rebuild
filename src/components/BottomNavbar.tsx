const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="mb-8 flex items-center justify-center">
        {/* Page indicator as shown in the image */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-white font-medium text-lg">0</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;