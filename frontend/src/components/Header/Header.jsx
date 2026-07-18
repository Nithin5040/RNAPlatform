import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import axiosClient from "../../api/axiosClient";
import { SummaryApi } from "../../api/SummaryApi";
import Swal from 'sweetalert2';
import "./Header.css";

export default function Header({ toggleTheme, theme, toggleSidebar, sidebarOpen, showMobileMenu }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      if (isLoggingOut) return;

      const storedToken = sessionStorage.getItem("auth_token");
      const storedUser = sessionStorage.getItem("auth_user");
      const storedUserRole = sessionStorage.getItem("userRole");
      const storedUserName = sessionStorage.getItem("userName");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            name: storedUserName || userData.name || (userData.FirstName + ' ' + userData.LastName).trim() || 'User',
            role: storedUserRole || userData.role || userData.RoleName || 'User',
            email: sessionStorage.getItem("userEmail") || userData.email || userData.Email || ''
          });
          setLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          setLoggedIn(false);
        }
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    };

    loadUser();
    window.addEventListener("auth", loadUser);
    window.addEventListener("storage", loadUser);

    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("auth", loadUser);
      window.removeEventListener("storage", loadUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, isLoggingOut]);

  // Function to get geolocation (same as login)
  const getGeolocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            resolve({ latitude: null, longitude: null });
          }
        );
      } else {
        resolve({ latitude: null, longitude: null });
      }
    });
  };

  // Get current local datetime in YYYY-MM-DD HH:MM:SS format (same as login)
  const getCurrentLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout'
      });

      if (!result.isConfirmed) {
        setIsLoggingOut(false);
        return;
      }

      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const userLoginDetailId = sessionStorage.getItem("userLoginDetailId");
      
      // Get location (same as login)
      const location = await getGeolocation();
      const loggedOutTime = getCurrentLocalDateTime();

      if (userLoginDetailId) {
        const payload = {
          flagId: 3,
          UserLoginDetailId: parseInt(userLoginDetailId),
          LogOutLatitude: location.latitude ? location.latitude.toString() : null,
          LogOutLongitude: location.longitude ? location.longitude.toString() : null,
          LoggedOut: loggedOutTime
        };

        console.log('Logout Audit Payload:', payload);

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          await axiosClient({
            method: SummaryApi.loginDetails.method,
            url: SummaryApi.loginDetails.url,
            data: payload,
            signal: controller.signal
          });

          clearTimeout(timeoutId);
        } catch (auditError) {
          console.error("Error sending logout audit:", auditError);
        }
      }

      sessionStorage.clear();
      setUser(null);
      setLoggedIn(false);
      setMenuOpen(false);
      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Logged Out Successfully',
        text: 'Redirecting to login...',
        timer: 1000,
        showConfirmButton: false,
        willClose: () => {
          navigate("/login", { replace: true });
        }
      });

    } catch (error) {
      console.error("Error during logout:", error);
      sessionStorage.clear();
      setUser(null);
      setLoggedIn(false);
      setMenuOpen(false);
      Swal.close();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user || isLoggingOut) return "User";
    if (user.name) return user.name;
    if (user.FirstName && user.LastName) return `${user.FirstName} ${user.LastName}`.trim();
    if (user.FirstName) return user.FirstName;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };

  const getUserRole = () => {
    if (!user || isLoggingOut) return "User";
    if (user.role) return user.role;
    if (user.RoleName) return user.RoleName;
    return "User";
  };

  const getUserEmail = () => {
    if (!user || isLoggingOut) return "";
    if (user.email) return user.email;
    if (user.Email) return user.Email;
    return "";
  };

  const getUserInitials = () => {
    if (!user || isLoggingOut) return "U";
    const name = getUserDisplayName();
    if (name && name !== "User") {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <header className={`app-header ${theme}`}>
      <div className="header-container">
        <div className="header-content">
          {/* Logo Section */}
          <a
            href="https://angmanpower.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-logo"
            style={{
              height: '60px',
              width: 'auto',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="logo-image" style={{ height: '50px', width: '50px' }}>
              <img
                src={logo}
                alt="ANG Manpower Logo"
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/50x50?text=Logo";
                }}
              />
            </div>
            <div className="logo-text" style={{ marginLeft: '10px' }}>
              <span className="logo-title" style={{ fontSize: '1.2rem' }}>ANG Manpower</span>
              <span className="logo-subtitle" style={{ fontSize: '0.8rem' }}>Workforce Solutions</span>
            </div>
          </a>

          {/* Center Section - System Title */}
          <div className="header-title-container">
            <h1 className="header-system-title">
              <span className="full-title">WORKFORCE MANAGEMENT SYSTEM</span>
              <span className="short-title">WFMS</span>
              <span className="title-abbr">(WFMS)</span>
            </h1>
          </div>

          {/* Right Section - All controls aligned to right */}
          <div className="header-controls">
            {/* Date and Time Display */}
            <div className="datetime-display">
              <span className="date">{formatDate()}</span>
              <span className="time">{formatTime()}</span>
            </div>

            {/* Auth Section and Mobile Menu */}
            <div className="auth-and-menu">
              {showMobileMenu && (
                <button 
                  onClick={toggleSidebar} 
                  className="header-mobile-menu-btn"
                  aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}

              {loggedIn && !isLoggingOut ? (
                <div className="user-dropdown">
                  <button
                    ref={menuButtonRef}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="user-button"
                  >
                    <div className="user-avatar">
                      {getUserInitials()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{getUserDisplayName()}</span>
                      <span className="user-role">{getUserRole()}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`dropdown-arrow ${menuOpen ? 'open' : ''}`}
                    />
                  </button>

                  {menuOpen && (
                    <div ref={dropdownRef} className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="dropdown-user">
                          <div className="dropdown-avatar">
                            {getUserInitials()}
                          </div>
                          <div className="dropdown-user-info">
                            <p className="dropdown-user-name">{getUserDisplayName()}</p>
                            <p className="dropdown-user-role">{getUserRole()}</p>
                            <p className="dropdown-user-email">{getUserEmail()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="dropdown-items">
                        <Link
                          to="/admin_dashboard"
                          className="dropdown-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          <User size={16} />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/change-password"
                          className="dropdown-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Change Password</span>
                        </Link>
                      </div>

                      <div className="dropdown-divider"></div>

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="dropdown-item logout-item"
                      >
                        <LogOut size={16} />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : !isLoggingOut ? (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
