import { Link } from "react-router-dom";
import logo from "@/assets/ta-logga-removebg.png";

const Footer = () => (
  <footer className="bg-white border-t border-border/30 py-10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Transfer Admin" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-900 transition-colors">About</Link>
          <Link to="/" className="hover:text-slate-900 transition-colors">Contact</Link>
          <Link to="/" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-slate-900 transition-colors">Terms</Link>
        </div>
        <span className="text-xs text-slate-400">© 2026 Transfer Admin</span>
      </div>
    </div>
  </footer>
);

export default Footer;
