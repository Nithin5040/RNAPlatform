import React, { useState, useEffect } from "react";
import axiosClient, { setToken } from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { SummaryApi } from "../api/SummaryApi";
import Swal from 'sweetalert2';
import { useTheme } from "../contexts/ThemeContext";
import Logo from '../assets/ANG Logo.png';
import * as yup from 'yup';

export default function Login() {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    employeeId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Yup validation schema with Employee ID - shows required first, then format validation
  const loginSchema = yup.object().shape({
    employeeId: yup
      .string()
      .required('Employee ID is required')
      .test('is-8-digits', 'Employee ID must be exactly 8 digits', (value) => {
        // Only check for 8 digits if value exists and is not empty
        if (!value || value.trim() === '') return true;
        return /^\d{8}$/.test(value);
      }),
    password: yup
      .string()
      .test('is-required', 'Password is required', (value) => {
        // Check if password exists and is not empty or whitespace only
        if (!value || value.trim() === '') {
          return false;
        }
        return true;
      })
      .test('min-length', 'Password must be at least 8 characters', (value) => {
        // Only check min length if password is not empty
        if (!value || value.trim() === '') return true;
        return value.length >= 8;
      })
      .test('max-length', 'Password must be maximum 20 characters', (value) => {
        // Only check max length if password is not empty
        if (!value || value.trim() === '') return true;
        return value.length <= 20;
      })
  });

  // Dark mode state based on theme
  const darkMode = theme === 'dark';

  // Check if device is mobile and adjust font size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setFontSize(mobile ? 12 : 14);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load saved credentials
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const { employeeId, password } = JSON.parse(savedCredentials);
      setForm({ employeeId, password });
      setRememberMe(true);
    }

    // Update greeting
    setTimeGreeting(getTimeBasedGreeting());

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    color: darkMode ? '#fff' : '#333',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  };

  // Styles matching the main footer
  const footerStyle = {
    backgroundColor: darkMode ? '#124545' : '#1a5f5f',
    color: '#fff',
    padding: isMobile ? '8px 16px' : '0 24px',
    fontSize: isMobile ? '11px' : '14px',
    fontWeight: 'bold',
    boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.15)',
    height: isMobile ? 'auto' : '48px',
    minHeight: isMobile ? '60px' : '48px',
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    marginTop: 'auto'
  };

  const inputStyle = {
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    color: darkMode ? '#fff' : '#333',
    fontSize: `${fontSize}px`,
    width: '100%',
    padding: isMobile ? '10px 12px' : '12px 16px',
    borderRadius: '8px',
    outline: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: darkMode ? '#4B5563' : '#D1D5DB',
    transition: 'all 0.2s ease',
  };

  const importantUpdates = [
    "Important Update: Only Admin access is available for now. Other roles will be enabled soon.",
    "Other roles are under development and will be available in the next release. Stay tuned for updates!"
  ];

  const scrollingText = importantUpdates.join(' • ') + ' • ';

  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % importantUpdates.length);
    }, 5000);
    return () => clearInterval(updateInterval);
  }, []);

  // Function to get device and browser information
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const platform = navigator.platform;

    let device = "Laptop";
    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
      if (/ipad|tablet/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        device = "Tablet";
      } else {
        device = "Mobile";
      }
    }

    let osName = "Unknown";
    if (platform.includes('Win')) osName = 'Windows';
    else if (platform.includes('Mac')) osName = 'macOS';
    else if (platform.includes('Linux')) osName = 'Linux';
    else if (/android/i.test(ua)) osName = 'Android';
    else if (/ios|iphone|ipad|ipod/i.test(ua)) osName = 'iOS';

    let browserName = "Unknown";
    let browserVersion = "Unknown";

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browserName = 'Chrome';
      const match = ua.match(/Chrome\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox';
      const match = ua.match(/Firefox\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browserName = 'Safari';
      const match = ua.match(/Version\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edg')) {
      browserName = 'Edge';
      const match = ua.match(/Edg\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }

    return {
      device,
      osName,
      browserName,
      browserVersion
    };
  };

  // Function to get IP address
  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'Unknown';
    }
  };

  // Function to get hostname
  const getHostName = () => {
    return window.location.hostname || 'Unknown';
  };

  // Function to get geolocation
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

  // Function to send login audit
  const sendLoginAudit = async (userId, tokenExpireTime, currentSessionId) => {
    try {
      const deviceInfo = getDeviceInfo();
      const ipAddress = await getIPAddress();
      const hostName = getHostName();
      const location = await getGeolocation();

      const now = new Date();
      const deviceDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

      const auditPayload = {
        flagId: 1,
        UserId: userId,
        DeviceDateTime: deviceDateTime,
        HostName: hostName,
        Device: deviceInfo.device,
        OSName: deviceInfo.osName,
        MacAddress: "00-00-00-00-00-00",
        IPAddress: ipAddress,
        BrowserName: deviceInfo.browserName,
        BrowserVersion: deviceInfo.browserVersion,
        Latitude: location.latitude,
        Longitude: location.longitude,
        TokenExpireTime: tokenExpireTime,
        CurrentSessionId: currentSessionId  
      };

      console.log('Login Audit Payload:', auditPayload);

      const response = await axiosClient({
        method: SummaryApi.loginDetails.method,
        url: SummaryApi.loginDetails.url,
        data: auditPayload
      });

      if (response.data?.status === true) {
        console.log('Login audit recorded successfully:', response.data);
        if (response.data.UserLoginDetailId) {
          sessionStorage.setItem("userLoginDetailId", response.data.UserLoginDetailId);
        }
      }
    } catch (error) {
      console.error('Error sending login audit:', error);
    }
  };

  const validateForm = async () => {
    try {
      await loginSchema.validate(form, { abortEarly: false });
      setErrors({ employeeId: "", password: "" });
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors({
        employeeId: validationErrors.employeeId || "",
        password: validationErrors.password || ""
      });
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Only allow digits for employeeId
    if (name === "employeeId") {
      processedValue = value.replace(/\D/g, '').slice(0, 8);
    }

    // Clear field-specific errors
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setEmployeeIdError("");
    setPasswordError("");

    setForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const getDashboardPath = (roleId) => {
    const numericRoleId = Number(roleId);

    switch (numericRoleId) {
      case 1:
        return "/admin_dashboard";
      case 2:
        return "/field-promoters";
      case 3:
        return "/field_executive";
      case 4:
        return "/reporting_manager_dashboard";
      case 5:
        return "/dashboard";
      default:
        return "/admin_dashboard";
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem('rememberedCredentials');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setEmployeeIdError("");
    setPasswordError("");

    // Validate form using Yup
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({
          employeeId: form.employeeId,
          password: form.password
        }));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

      // Send EmployeeId and password as per the API payload
      const loginRes = await axiosClient({
        method: SummaryApi.login.method,
        url: SummaryApi.login.url,
        data: {
          EmployeeId: form.employeeId,
          password: form.password
        }
      });

      if (!loginRes || !loginRes.data) {
        throw new Error("No response data received");
      }

      const responseData = loginRes.data;

      if (responseData.status === false) {
        throw new Error(responseData.message || "Login failed");
      }

      const { token, user, TokenExpireTime } = responseData;

      if (!token) throw new Error("Authentication token not received");
      if (!user) throw new Error("User profile not found");

      const checkRoleId = user.RoleId;
      if (Number(checkRoleId) !== 1 && Number(checkRoleId) !== 4) {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only Admin and Reporting Manager access is available at this time.',
          timer: 3000,
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
        });
        setLoading(false);
        return;
      }

      setToken(token);
      sessionStorage.setItem("auth_token", token);

      // Store token expiry time in sessionStorage
      if (TokenExpireTime) {
        sessionStorage.setItem("tokenExpiryTime", TokenExpireTime);
      }

      sessionStorage.setItem("auth_user", JSON.stringify(user));
      sessionStorage.setItem("userName", `${user.FirstName || ''} ${user.LastName || ''}`.trim() || user.name || '');
      sessionStorage.setItem("userEmail", user.Email || user.email || '');

      // Store EmployeeId in session
      sessionStorage.setItem("employeeId", form.employeeId);

      const roleId = user.RoleId || user.roleId;
      const roleName = user.RoleName || user.roleName || '';
      const userId = user.UserId || user.userId;
      const reportingToId = user.ReportingToId;
      const currentSessionId = user.CurrentSessionId; // Extract CurrentSessionId from user object

      sessionStorage.setItem("roleId", String(roleId));
      sessionStorage.setItem("userRole", roleName);
      if (reportingToId !== null && reportingToId !== undefined) {
        sessionStorage.setItem("ReportingToId", String(reportingToId));
      }
      sessionStorage.setItem("userId", userId);
      
      // Store CurrentSessionId in sessionStorage
      if (currentSessionId) {
        sessionStorage.setItem("currentSessionId", currentSessionId);
      }

      // Send login audit with token expiry time and current session ID
      await sendLoginAudit(userId, TokenExpireTime, currentSessionId);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
        timer: 2000,
        showConfirmButton: false,
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
      });

      window.dispatchEvent(new Event("auth"));
      window.dispatchEvent(new Event("storage"));

      const dashboardPath = getDashboardPath(roleId);

      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 100);

    } catch (error) {
      console.error("Full error object:", error);

      let errorMessage = "Invalid login credentials or server error.";

      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error: Unable to connect to the server.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please try again.";
      }

      setMessage(errorMessage);

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        timer: 3000,
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: darkMode ? '#1a1a1a' : '#f8fafc',
    }}>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        overflow: 'auto',
        margin: 0,
        padding: '20px 0',
        backgroundColor: darkMode ? '#1a1a1a' : '#f8fafc',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 24px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: isMobile ? '350px' : '450px',
            }}>
              {/* Card */}
              <div style={{
                ...cardStyle,
                backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backgroundImage: `url(${Logo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundRepeat: 'no-repeat',
                backdropFilter: 'blur(8px)',
                border: darkMode ? '1px solid rgba(55, 65, 81, 0.3)' : '1px solid rgba(226, 232, 240, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                height: isMobile ? 'auto' : 'auto',
                minHeight: isMobile ? '350px' : '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Darker Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                  zIndex: 0,
                  borderRadius: '12px'
                }}></div>

                {/* Scrollable Content Area */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  overflowY: 'auto',
                  height: '100%',
                  padding: isMobile ? '20px' : '32px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: darkMode ? '#1a5f5f #1f2937' : '#1a5f5f #e2e8f0',
                  WebkitOverflowScrolling: 'touch',
                }}>
                  {/* Greeting Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                      color: '#1a5f5f',
                      fontSize: isMobile ? '20px' : '24px',
                      margin: '0 0 8px 0',
                      fontWeight: '600'
                    }}>
                      Hello
                    </h2>
                    <h3 style={{
                      color: '#1a5f5f',
                      fontSize: isMobile ? '18px' : '20px',
                      margin: '0 0 12px 0',
                      fontWeight: '500'
                    }}>
                      {timeGreeting}
                    </h3>
                    <p style={{
                      color: darkMode ? '#9CA3AF' : '#6B7280',
                      fontSize: `${fontSize}px`,
                      margin: 0
                    }}>
                      Sign in to continue
                    </p>
                  </div>

                  {/* Error Message */}
                  {message && (
                    <div style={{
                      marginBottom: '20px',
                      padding: isMobile ? '10px' : '12px',
                      backgroundColor: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      borderRadius: '8px'
                    }}>
                      <p style={{
                        margin: 0,
                        color: '#DC2626',
                        fontSize: `${fontSize}px`,
                        textAlign: 'center'
                      }}>
                        {message}
                      </p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Employee ID Field */}
                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          color: darkMode ? '#E5E7EB' : '#4B5563',
                          fontSize: `${fontSize}px`,
                          fontWeight: '500'
                        }}
                      >
                        Employee ID
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      </label>
                      <input
                        name="employeeId"
                        placeholder="Enter 8-digit Employee ID"
                        type="text"
                        onChange={handleChange}
                        value={form.employeeId}
                        maxLength={8}
                        style={{
                          ...inputStyle,
                          borderColor: (errors.employeeId || employeeIdError) ? '#EF4444' : (darkMode ? '#4B5563' : '#D1D5DB'),
                        }}
                        onFocus={() => setEmployeeIdError("")}
                      />
                      {(errors.employeeId || employeeIdError) && (
                        <p style={{
                          margin: '4px 0 0 0',
                          color: '#EF4444',
                          fontSize: `${fontSize - 1}px`
                        }}>
                          {errors.employeeId || employeeIdError}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          color: darkMode ? '#E5E7EB' : '#4B5563',
                          fontSize: `${fontSize}px`,
                          fontWeight: '500'
                        }}
                      >
                        Password
                        <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          name="password"
                          value={form.password}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password"
                          onChange={handleChange}
                          style={{
                            ...inputStyle,
                            paddingRight: '40px',
                            borderColor: (errors.password || passwordError) ? '#EF4444' : (darkMode ? '#4B5563' : '#D1D5DB'),
                          }}
                          onFocus={() => setPasswordError("")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: darkMode ? '#9CA3AF' : '#6B7280',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          {showPassword ? <EyeOff size={isMobile ? 18 : 20} /> : <Eye size={isMobile ? 18 : 20} />}
                        </button>
                      </div>
                      {(errors.password || passwordError) && (
                        <p style={{
                          margin: '4px 0 0 0',
                          color: '#EF4444',
                          fontSize: `${fontSize - 1}px`
                        }}>
                          {errors.password || passwordError}
                        </p>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div style={{
                      marginBottom: isMobile ? '16px' : '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        style={{
                          marginRight: '8px',
                          width: isMobile ? '16px' : '18px',
                          height: isMobile ? '16px' : '18px',
                          cursor: 'pointer',
                          accentColor: '#1a5f5f'
                        }}
                      />
                      <label htmlFor="remember-me" style={{
                        color: darkMode ? '#E5E7EB' : '#4B5563',
                        fontSize: `${fontSize}px`,
                        cursor: 'pointer'
                      }}>
                        Remember me
                      </label>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: isMobile ? '12px' : '14px',
                        backgroundColor: '#1a5f5f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: `${fontSize}px`,
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.2s ease',
                        marginBottom: '16px'
                      }}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span style={{
                            width: isMobile ? '18px' : '20px',
                            height: isMobile ? '18px' : '20px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></span>
                          Signing in...
                        </span>
                      ) : (
                        'Sign in'
                      )}
                    </button>

                    {/* Forgot Password */}
                    <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                      <Link
                        to="/"
                        style={{
                          color: '#1a5f5f',
                          fontSize: `${fontSize}px`,
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Register Link */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        color: darkMode ? '#9CA3AF' : '#6B7280',
                        fontSize: `${fontSize}px`,
                        margin: 0
                      }}>
                        Don't have an account?{' '}
                        <Link
                          to="/"
                          style={{
                            color: '#1a5f5f',
                            fontWeight: '600',
                            textDecoration: 'none'
                          }}
                        >
                          Create Account
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Bar */}
      <div style={{
        backgroundColor: darkMode ? '#1f2937' : '#e2e8f0',
        color: darkMode ? '#fff' : '#333',
        padding: isMobile ? '8px 0' : '10px 0',
        borderTop: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
        borderBottom: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
        background: 'linear-gradient(90deg, #1a5f5f, rgb(101, 194, 116))',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        fontSize: isMobile ? '12px' : '14px',
        color: '#fff'
      }}>
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: isMobile ? 'scrollContinuous 20s linear infinite' : 'scrollContinuous 30s linear infinite',
          paddingRight: '100%'
        }}>
          <span style={{
            fontWeight: 'bold',
            marginRight: '8px'
          }}>
            🔔:
          </span>
          <span>
            {scrollingText}
          </span>
        </div>
      </div>

      {/* Footer - Matching main app footer */}
      <footer style={footerStyle}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? '8px' : '16px',
          padding: isMobile ? '8px 16px' : '0 24px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <span style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: '500',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            © Vishang {new Date().getFullYear()}-{new Date().getFullYear() + 1}
          </span>
          <span style={{
            color: '#ffffff',
            fontWeight: '600',
            fontSize: isMobile ? '13px' : '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            position: 'relative',
            padding: '0 16px'
          }}>
            ANG Manpower Solutions
          </span>
          <span style={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontWeight: '400',
            fontSize: isMobile ? '11px' : '12px'
          }}>
            All rights reserved
          </span>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes scrollContinuous {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          html, body, #root {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          * {
            overscroll-behavior: none;
          }
        `}
      </style>
    </div>
  );
}