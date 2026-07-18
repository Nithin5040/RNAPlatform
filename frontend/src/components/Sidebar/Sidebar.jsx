import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  BarChart3,
  UserPlus,
  Shield,
  ClipboardList,
  Home,
  FileCheck,
  Stethoscope,
  ShieldCheck,
  Key,
  Wrench,
  DoorOpen,
  Clock,
  Calendar,
  TrendingUp,
  FileBarChart,
  UserCheck,
  LogIn,
  UserX,
  PlusCircle,
  Eye,
  List,
  ChevronDown,
  ChevronUp,
  Phone,
  PhoneCall,
  MessageSquare,
  Target,
  Filter,
  Bell,
  PieChart,
  History,
  Menu,
  X,
  Activity,
  MapPin,
  UserCog,
  Globe,
  GitBranch,
  Layers,
  MapPinned,
  Network,
  FolderTree,
  Share2,
  LogOut as ExitIcon,
  UserMinus,
  RotateCcw,
  Fingerprint,
} from "lucide-react";
import { FaChartLine } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { SummaryApi } from "../../api/SummaryApi";
import Swal from 'sweetalert2';
import "./Sidebar.css";
import { FaExchangeAlt } from "react-icons/fa";

export default function Sidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
  isMobile,
  theme
}) {
  const [user, setUser] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [activePath, setActivePath] = useState("");
  const [openAdminSubmenu, setOpenAdminSubmenu] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("auth_user");
    const storedRoleId = sessionStorage.getItem("roleId");

    console.log("Stored roleId:", storedRoleId); // Debug log

    if (storedRoleId) {
      setRoleId(parseInt(storedRoleId));
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
        setUser(null);
      }
    }
    setActivePath(window.location.pathname);
  }, []);

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

  // Handle logout with complete payload
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
      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Logged Out Successfully',
        text: 'Redirecting to login...',
        timer: 2000,
        showConfirmButton: false
      });

      window.location.href = "/login";

    } catch (error) {
      console.error("Error during logout:", error);
      sessionStorage.clear();
      Swal.close();
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    if (isMobile && onClose) {
      onClose();
    }
  };

  const toggleSubmenu = (key) => {
    setOpenAdminSubmenu(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Admin specific menu items (for roleId = 1)
  const adminMenu = [
    {
      path: "/admin_dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/create-user",
      label: "User Creation",
      icon: <PlusCircle size={20} />
    },
    {
      path: "/role-creation",
      label: "Role Management",
      icon: <Shield size={20} />
    },
    // {
    //   path: "/spoc-creation",
    //   label: "Spoc Management",
    //   icon: <Shield size={20} />
    // },
    {
      path: "/login-audit",
      label: "Login Audit",
      icon: <Fingerprint size={20} />
    },
    {
      path: "/market-mobilization",
      label: "Activity History",
      icon: <Activity size={20} />
    },
    {
      path: "/view-candidate-uploaded-list",
      label: "Candidate Uploaded list",
      icon: <Users size={20} />
    },
    {
      path: "/mainsite-creation",
      label: "MainSite Creation",
      icon: <Globe size={20} />
    },
    {
      path: "/subsite-creation",
      label: "SubSite Creation",
      icon: <Network size={20} />
    },
    {
      path: "/rejoin-candidate",
      label: "Rejoin Candidate",
      icon: <RotateCcw size={20} />
    },
    {
      path: "/onboard-candidate",
      label: "Onboard Candidate",
      icon: <UserPlus size={20} />
    },
    {
      path: "/transfer-candidate",
      label: "Transfer Candidate",
      icon: <FaExchangeAlt size={20} />
    },
    {
      path: "/candidate-history",
      label: "Candidate History",
      icon: <ClipboardList size={20} />
    },
    {
      key: "mis-reports",
      label: "MIS Report",
      icon: <BarChart3 size={20} />,
      children: [
        {
          key: "user-activity",
          label: "Login Report",
          path: "/Login-Report",
          icon: <LogIn size={16} />
        },
        {
          key: "user-activity",
          label: "FE Report",
          path: "/MisReport",
          icon: <UserCheck size={16} />
        },
        {
          key: "colony-site-entry",
          label: "SE Report",
          path: "/colony-site-entry-report",
          icon: <Building2 size={16} />
        }
      ]
    },
    {
      key: "exit-section",
      label: "Exit Management",
      icon: <ExitIcon size={20} />,
      children: [
        {
          key: "exit-candidate",
          label: "Exit Candidate",
          path: "/exit-candidate",
          icon: <UserMinus size={16} />
        },
        {
          key: "exited-list",
          label: "Exited List",
          path: "/exit-list",
          icon: <UserX size={16} />
        }
      ]
    }
  ];

  // RM specific menu items (for roleId = 4)
  const rmMenu = [
    {
      path: "/reporting_manager_dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/rm-login-audit",
      label: "Login Audit",
      icon: <Fingerprint size={20} />
    },
    {
      path: "/team-insights",
      label: "Team Insights",
      icon: <FaChartLine size={20} />   
    }
  ];

  // Common menu items (visible for all roles)
  const commonItems = [
    { path: "/change-password", label: "Change Password", icon: <Settings size={20} /> },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.name || user.FirstName || "User";
    return name.charAt(0).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.name) return user.name;
    if (user.FirstName && user.LastName) return `${user.FirstName} ${user.LastName}`;
    if (user.FirstName) return user.FirstName;
    return "User";
  };

  // Render menu item with hover effects
  const renderMenuItem = (item, index) => {
    const isActive = activePath === item.path;
    const isHovered = hoveredItem === item.path;

    return (
      <button
        key={item.path || index}
        onClick={() => handleNavigation(item.path)}
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`sidebar-nav-item ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'collapsed' : ''} ${isHovered ? 'hovered' : ''}`}
        title={collapsed && !isMobile ? item.label : ''}
      >
        <span className="nav-icon">{item.icon}</span>
        {(!collapsed || isMobile) && (
          <>
            <span className="nav-label">{item.label}</span>
            {isActive && <span className="nav-indicator" />}
          </>
        )}
        {isHovered && !collapsed && (
          <span className="nav-hover-effect" />
        )}
      </button>
    );
  };

  // Render submenu
  const renderSubMenu = (menu, level = 0) => {
    const isOpen = openAdminSubmenu[menu.key] || false;
    const hasActiveChild = menu.children?.some(child => {
      return activePath === child.path;
    });

    const showFull = !collapsed || isMobile;

    return (
      <div key={menu.key} className={`sidebar-submenu-container level-${level}`}>
        <button
          onClick={() => toggleSubmenu(menu.key)}
          onMouseEnter={() => setHoveredItem(menu.key)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`sidebar-nav-item ${hasActiveChild || isOpen ? 'active' : ''} ${collapsed && !isMobile ? 'collapsed' : ''}`}
          title={collapsed && !isMobile ? menu.label : ''}
        >
          <span className="nav-icon">{menu.icon}</span>
          {showFull && (
            <>
              <span className="nav-label">{menu.label}</span>
              <span className="submenu-arrow">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </>
          )}
        </button>

        {showFull && isOpen && (
          <div className={`sidebar-submenu level-${level}`}>
            {menu.children.map((child) => {
              const isChildActive = activePath === child.path;
              return (
                <button
                  key={child.key}
                  onClick={() => handleNavigation(child.path)}
                  onMouseEnter={() => setHoveredItem(child.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`sidebar-submenu-item ${isChildActive ? 'active' : ''}`}
                  style={{ paddingLeft: `${16 + (level + 1) * 12}px` }}
                >
                  {child.icon && <span className="submenu-icon">{child.icon}</span>}
                  <span className="submenu-label">{child.label}</span>
                  {isChildActive && <span className="submenu-indicator" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Close button for mobile
  const renderMobileCloseButton = () => {
    if (!isMobile) return null;

    return (
      <button
        className="sidebar-mobile-close"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={20} />
      </button>
    );
  };

  // Don't render sidebar if roleId is not 1 (Admin) or 4 (Reporting Manager)
  if (roleId !== 1 && roleId !== 4) {
    console.log("Sidebar not shown because roleId is:", roleId);
    return null;
  }

  console.log("Rendering sidebar for roleId:", roleId);
  const menuToRender = roleId === 1 ? adminMenu : rmMenu;

  return (
    <aside className={`sidebar ${collapsed && !isMobile ? 'sidebar-collapsed' : ''} ${isMobile ? 'sidebar-mobile-view' : ''} ${theme}`}>
      {/* Mobile Close Button */}
      {renderMobileCloseButton()}

      {/* User Profile Section - Show on mobile */}
      {isMobile && user && (
        <div className="sidebar-profile">
          <div className="profile-content">
            <div className="profile-avatar">
              {getUserInitials()}
            </div>
            <div className="profile-info">
              <p className="profile-name">{getUserDisplayName()}</p>
              <p className="profile-role">{roleId === 1 ? "Admin" : "Reporting Manager"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuToRender.map((menu) => {
          if (menu.children) {
            return renderSubMenu(menu, 0);
          } else {
            return renderMenuItem(menu);
          }
        })}
        {commonItems.map((item, index) => renderMenuItem(item, index))}
      </nav>

      {/* Sidebar Footer with Logout and Expand/Collapse */}
      <div className="sidebar-footer">
        {/* Expand/Collapse Button - Desktop only */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={`sidebar-footer-btn expand-collapse-btn ${collapsed ? 'collapsed' : ''}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`sidebar-footer-btn logout-btn ${collapsed && !isMobile ? 'collapsed' : ''}`}
          title={collapsed && !isMobile ? "Logout" : ""}
        >
          <LogOut size={18} />
          {(!collapsed || isMobile) && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
}