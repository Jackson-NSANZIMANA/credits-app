const MobileMenu = ({ toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
    >
      ☰
    </button>
  );
};

export default MobileMenu;
