import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HistoryModal from './HistoryModal';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1050, // 🔥 above everything
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.3)"
        }}
      >


        <Link
          to="/"
          className="fw-bold text-success mb-0 text-decoration-none"
          style={{ fontSize: "1.25rem" }}
        >
          Diet Planner
        </Link>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3">

          {user ? (
            <>
              {/* History */}
              <button
                onClick={() => setShowHistory(true)}
                className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-semibold"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#059669",
                  backdropFilter: "blur(6px)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.25)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.74l.831-.556c.19.285.359.582.506.89zm1.102 1.154c-.134-.148-.278-.289-.431-.424l.659-.753c.188.165.364.339.527.521zm.71 1.37a7 7 0 0 0-.299-.985l.976-.219c.086.383.2.76.342 1.126zM16 8A8 8 0 1 1 8 0v1a7 7 0 1 0 7 7z" />
                  <path d="M8.5 4.466V8H11v1H7.5V4.5z" />
                </svg>


                History
              </button>

              {/* Username (hidden on small) */}
              <span className="d-none d-md-inline fw-semibold">
                {user.name}
              </span>

              {/* Logout Icon */}
              <button
                onClick={logout}
                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-success">
              Sign In
            </Link>
          )}

        </div>
      </nav>

      {/* Spacer to avoid content hiding under fixed navbar */}
      <div style={{ height: "70px" }} />

      {/* Modal */}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} />
      )}
    </>
  );
};

export default Navbar;