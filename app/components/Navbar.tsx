import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
            <Link to="/" className="text-[#FF0000] text-2xl font-semibold tracking-tight">
                ResumAlze
            </Link>
            <Link
                to="/upload"
                className="bg-[#FF0000] hover:bg-[#cc0000] text-white text-sm font-medium py-2 px-4 rounded-md transition"
            >
                Upload Resume
            </Link>
        </nav>
    );
};

export default Navbar;
