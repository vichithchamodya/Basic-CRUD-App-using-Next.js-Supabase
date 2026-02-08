const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-auto border-t border-gray-700">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Basic CRUD App. Built with Next.js &
        Supabase
      </p>
    </footer>
  );
};

export default Footer;
