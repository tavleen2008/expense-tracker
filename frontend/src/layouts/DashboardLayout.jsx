import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F1DE]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/60 bg-[#F4F1DE]/90 px-6 backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#3D405B]">
            Expense Tracker
          </h1>

          <p className="mt-1 text-sm text-[#3D405B]/70">
            Welcome back, {user?.name || "User"} 👋
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-full bg-[#E07A5F] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#E07A5F]/20 transition hover:-translate-y-0.5 hover:bg-[#cf6d55]"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>

          <div
            className="grid h-11 w-11 place-items-center rounded-full bg-[#81B29A] text-white font-bold shadow-lg"
          >
            {(user?.name?.charAt(0) || "U").toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
