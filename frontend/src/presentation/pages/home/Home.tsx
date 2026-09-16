import React from "react";
import { useNavigate } from "react-router-dom";
import TaskScrollAnimation from "../../components/home/TaskScrollAnimation";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0B1120] text-slate-100 overflow-hidden">

      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-transparent backdrop-blur-md">

        <div className="text-2xl font-bold tracking-tight cursor-pointer">
          ShoURL<span className="text-amber-400">AI</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-md border border-slate-600 hover:bg-slate-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 transition text-slate-950 font-medium"
          >
            Register
          </button>
        </div>
      </nav>

      <main className="relative pt-20">
        <TaskScrollAnimation />
      </main>

      <footer className="relative z-30 bg-[#0F1729]/80 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold">
              ShoURL<span className="text-amber-400">AI</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-sm">
              Shorten your URL.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex gap-6 text-sm text-slate-400">
            <button onClick={() => navigate("/login")} className="hover:text-white transition">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="hover:text-white transition">
              Register
            </button>
            <button className="hover:text-white transition">
              Privacy
            </button>
            <button className="hover:text-white transition">
              Terms
            </button>
          </div>

          {/* Right */}
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} ShoURL. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
