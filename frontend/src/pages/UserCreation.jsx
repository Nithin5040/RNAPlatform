import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { SummaryApi } from "../api/SummaryApi";
import Swal from 'sweetalert2';
import { useTheme } from "../contexts/ThemeContext";
import * as yup from 'yup';
import Select from 'react-select';
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUser,
    FaPhone,
    FaSpinner,
    FaUserPlus,
    FaEye,
    FaEyeSlash,
    FaLock
} from "react-icons/fa";

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1">
            <span className="inline-block mt-0.5">⚠️</span>
            <span>{message}</span>
        </p>
    );
};

// React Select Styling with Royal Blue & Lavender Theme
const getSelectStyles = (darkMode, error) => ({
    control: (base, state) => ({
        ...base,
        backgroundColor: darkMode ? '#13102e' : '#ffffff',
        borderColor: error ? '#EF4444' : (state.isFocused ? '#3b35c9' : (darkMode ? 'rgba(90,84,224,0.3)' : '#D1D5DB')),
        borderWidth: '1px',
        borderRadius: '0.5rem',
        minHeight: '44px',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 53, 201, 0.2)' : 'none',
        '&:hover': {
            borderColor: error ? '#EF4444' : '#3b35c9'
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: darkMode ? '#13102e' : '#ffffff',
        border: darkMode ? '1px solid rgba(90,84,224,0.2)' : '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 50
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? '#3b35c9'
            : isFocused
                ? (darkMode ? 'rgba(90,84,224,0.15)' : '#f3f4f6')
                : 'transparent',
        color: isSelected
            ? '#ffffff'
            : (darkMode ? '#e2e0ff' : '#111827'),
        cursor: 'pointer',
        '&:active': {
            backgroundColor: '#3b35c9'
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: darkMode ? '#e2e0ff' : '#111827'
    }),
    placeholder: (base) => ({
        ...base,
        color: darkMode ? 'rgba(165,160,255,0.5)' : '#9ca3af',
        fontSize: '0.875rem'
    })
});

export default function UserCreation() {
    const { theme } = useTheme();
    const darkMode = theme === 'dark';
    const navigate = useNavigate();

    // Initial empty form state
    const initialFormState = {
        name: "",
        mobile: "",
        password: "",
        role: "",
        zone: "",
        circle: "",
        division: "",
        district: "",
        taluk: "",
        gender: "",
    };

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Dropdown states
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [fetchingRoles, setFetchingRoles] = useState(false);
    const [fetchingGenders, setFetchingGenders] = useState(false);

    // Mock data for conditional location dropdowns
    const zones = [
        { value: "1", label: "Zone North" },
        { value: "2", label: "Zone South" },
        { value: "3", label: "Zone East" },
        { value: "4", label: "Zone West" }
    ];

    const circles = [
        { value: "1", label: "Circle Alpha" },
        { value: "2", label: "Circle Beta" },
        { value: "3", label: "Circle Gamma" },
        { value: "4", label: "Circle Delta" }
    ];

    const divisions = [
        { value: "1", label: "Division 1" },
        { value: "2", label: "Division 2" },
        { value: "3", label: "Division 3" },
        { value: "4", label: "Division 4" }
    ];

    const districts = [
        { value: "1", label: "Bangalore" },
        { value: "2", label: "Chennai" },
        { value: "3", label: "Mumbai" },
        { value: "4", label: "Hyderabad" },
        { value: "5", label: "Pune" }
    ];

    const taluks = [
        { value: "1", label: "Taluk East" },
        { value: "2", label: "Taluk West" },
        { value: "3", label: "Taluk North" },
        { value: "4", label: "Taluk South" }
    ];

    // Check authentication on component mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem("auth_user");
        if (!storedUser) {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch dropdowns on component mount
    useEffect(() => {
        fetchRoles();
        fetchGenders();
    }, []);

    // Fetch Roles from API
    const fetchRoles = async () => {
        try {
            setFetchingRoles(true);
            const payload = {
                flagId: 7
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                // Map roles to React Select format. Keep label as RoleName to match 'Driver(User)'
                const formattedRoles = response.data.result.map(role => ({
                    value: role.RoleId ? role.RoleId.toString() : (role.RoleCode || role.RoleName),
                    label: role.RoleName
                }));
                setRoles(formattedRoles);
            } else {
                setRoles([]);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setRoles([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch roles. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingRoles(false);
        }
    };

    // Fetch Genders from API
    const fetchGenders = async () => {
        try {
            setFetchingGenders(true);
            const payload = {
                flagId: 6
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const formattedGenders = response.data.result.map(gender => ({
                    value: gender.GenderId.toString(),
                    label: gender.GenderName
                }));
                setGenders(formattedGenders);
            } else {
                setGenders([]);
            }
        } catch (error) {
            console.error("Error fetching genders:", error);
            setGenders([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch genders. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingGenders(false);
        }
    };

    // Check if the selected role is "Driver(User)"
    const isDriverRole = useMemo(() => {
        const selectedRole = roles.find(option => option.value === form.role);
        return selectedRole && selectedRole.label === "Driver(User)";
    }, [form.role, roles]);

    // Reset conditional dropdown fields when selected role is changed from Driver(User)
    useEffect(() => {
        if (!isDriverRole) {
            setForm(prev => ({
                ...prev,
                zone: "",
                circle: "",
                division: "",
                district: "",
                taluk: ""
            }));
        }
    }, [form.role, isDriverRole]);

    // Auto-capitalize first letter of each word
    const capitalizeWords = (str) => {
        return str.split(' ').map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let validatedValue = value;

        if (name === "name") {
            validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
            if (validatedValue.startsWith(' ')) {
                validatedValue = validatedValue.trimStart();
            }
            validatedValue = validatedValue.slice(0, 50);
            validatedValue = capitalizeWords(validatedValue);
        } else if (name === "mobile") {
            validatedValue = value.replace(/\D/g, '').slice(0, 10);
        } else if (name === "password") {
            validatedValue = value.slice(0, 20);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setErrorMessage("");
        setForm((prev) => ({ ...prev, [name]: validatedValue }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setForm(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = async () => {
        try {
            // Build dynamic schema depending on whether the driver role is selected
            const activeSchema = yup.object().shape({
                name: yup
                    .string()
                    .required('Name is required')
                    .min(3, 'Name must be at least 3 characters')
                    .max(50, 'Name cannot exceed 50 characters'),

                mobile: yup
                    .string()
                    .required('Mobile number is required')
                    .matches(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit number starting with 6-9'),

                password: yup
                    .string()
                    .required('Password is required')
                    .min(8, 'Password must be at least 8 characters')
                    .max(20, 'Password cannot exceed 20 characters'),

                role: yup
                    .string()
                    .required('Role is required'),

                gender: yup
                    .string()
                    .required('Gender is required'),

                ...(isDriverRole ? {
                    zone: yup.string().required('Zone is required'),
                    circle: yup.string().required('Circle is required'),
                    division: yup.string().required('Division is required'),
                    district: yup.string().required('District is required'),
                    taluk: yup.string().required('Taluk is required'),
                } : {})
            });

            await activeSchema.validate(form, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach(error => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
        setErrors({});
        setSuccessMessage("");
        setErrorMessage("");
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedUser = sessionStorage.getItem("auth_user");
        if (!storedUser) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Your session has expired. Please login again.',
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            }).then(() => {
                navigate("/login");
            });
            return;
        }

        if (!await validateForm()) {
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Simulate API call with setTimeout
            await new Promise(resolve => setTimeout(resolve, 2000));

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: "User created successfully!",
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                confirmButtonColor: '#3b35c9'
            });

            setSuccessMessage("User created successfully!");
            resetForm();

            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);

        } catch (error) {
            console.error("Error submitting form:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: "An error occurred while creating user. Please try again.",
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                confirmButtonColor: '#3b35c9'
            });
            setErrorMessage("An error occurred while creating user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Options mapping
    const roleOptions = roles;
    const genderOptions = genders;
    const zoneOptions = zones;
    const circleOptions = circles;
    const divisionOptions = divisions;
    const districtOptions = districts;
    const talukOptions = taluks;

    return (
        <div className={`min-h-full py-12 px-6 transition-colors duration-300 ${darkMode ? 'bg-[#0d0b22]' : 'bg-gray-50'}`}>
            <div className="max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className={`${darkMode ? 'bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border p-8 mb-8`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-[#1e1b7a]'} flex items-center gap-3`}>
                                <FaUserPlus className="text-[#3b35c9]" size={28} />
                                User Creation
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                Fill out the details below to add a new user to the platform (<span className="text-red-500">*</span> Required fields)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                {successMessage && (
                    <div className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? 'bg-green-950/30 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'}`}>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? 'bg-red-950/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {errorMessage}
                    </div>
                )}

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} noValidate>
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${darkMode ? 'bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border overflow-hidden`}
                    >
                        {/* Gradient divider line at top */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff]" />
                        
                        <div className="p-8">
                            {/* Responsive 4-Column Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                
                                {/* Full Name */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        <span className="text-red-500 mr-1">*</span>Full Name
                                    </label>
                                    <div className="relative">
                                        <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                        <input
                                            placeholder="Enter full name"
                                            required
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            maxLength={50}
                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                } ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    <ErrorMessage message={errors.name} />
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        <span className="text-red-500 mr-1">*</span>Mobile Number
                                    </label>
                                    <div className="relative">
                                        <FaPhone className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                        <input
                                            placeholder="Enter mobile number"
                                            required
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                } ${errors.mobile ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    <ErrorMessage message={errors.mobile} />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        <span className="text-red-500 mr-1">*</span>Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            required
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            maxLength={20}
                                            className={`w-full rounded-lg border pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                } ${errors.password ? 'border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                        </button>
                                    </div>
                                    <ErrorMessage message={errors.password} />
                                </div>

                                {/* Select Role - From API */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Role
                                    </label>
                                    <Select
                                        name="role"
                                        options={roleOptions}
                                        value={roleOptions.find(option => option.value === form.role) || null}
                                        onChange={(option) => handleSelectChange(option, { name: 'role' })}
                                        isLoading={fetchingRoles}
                                        isDisabled={fetchingRoles}
                                        placeholder={fetchingRoles ? "Loading roles..." : "Select role..."}
                                        noOptionsMessage={() => fetchingRoles ? 'Loading...' : 'No roles found'}
                                        styles={getSelectStyles(darkMode, errors.role)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                    />
                                    <ErrorMessage message={errors.role} />
                                </div>

                                {/* Select Gender - From API */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Gender
                                    </label>
                                    <Select
                                        name="gender"
                                        options={genderOptions}
                                        value={genderOptions.find(option => option.value === form.gender) || null}
                                        onChange={(option) => handleSelectChange(option, { name: 'gender' })}
                                        isLoading={fetchingGenders}
                                        isDisabled={fetchingGenders}
                                        placeholder={fetchingGenders ? "Loading genders..." : "Select gender..."}
                                        noOptionsMessage={() => fetchingGenders ? 'Loading...' : 'No genders found'}
                                        styles={getSelectStyles(darkMode, errors.gender)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                    />
                                    <ErrorMessage message={errors.gender} />
                                </div>

                                {/* Conditional Driver Location Dropdowns */}
                                <AnimatePresence>
                                    {isDriverRole && (
                                        <>
                                            {/* Select Zone */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Select Zone
                                                </label>
                                                <Select
                                                    name="zone"
                                                    options={zoneOptions}
                                                    value={zoneOptions.find(option => option.value === form.zone) || null}
                                                    onChange={(option) => handleSelectChange(option, { name: 'zone' })}
                                                    placeholder="Select zone..."
                                                    noOptionsMessage={() => 'No zones found'}
                                                    styles={getSelectStyles(darkMode, errors.zone)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                                <ErrorMessage message={errors.zone} />
                                            </motion.div>

                                            {/* Select Circle */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Select Circle
                                                </label>
                                                <Select
                                                    name="circle"
                                                    options={circleOptions}
                                                    value={circleOptions.find(option => option.value === form.circle) || null}
                                                    onChange={(option) => handleSelectChange(option, { name: 'circle' })}
                                                    placeholder="Select circle..."
                                                    noOptionsMessage={() => 'No circles found'}
                                                    styles={getSelectStyles(darkMode, errors.circle)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                                <ErrorMessage message={errors.circle} />
                                            </motion.div>

                                            {/* Select Division */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Select Division
                                                </label>
                                                <Select
                                                    name="division"
                                                    options={divisionOptions}
                                                    value={divisionOptions.find(option => option.value === form.division) || null}
                                                    onChange={(option) => handleSelectChange(option, { name: 'division' })}
                                                    placeholder="Select division..."
                                                    noOptionsMessage={() => 'No divisions found'}
                                                    styles={getSelectStyles(darkMode, errors.division)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                                <ErrorMessage message={errors.division} />
                                            </motion.div>

                                            {/* Select District */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Select District
                                                </label>
                                                <Select
                                                    name="district"
                                                    options={districtOptions}
                                                    value={districtOptions.find(option => option.value === form.district) || null}
                                                    onChange={(option) => handleSelectChange(option, { name: 'district' })}
                                                    placeholder="Select district..."
                                                    noOptionsMessage={() => 'No districts found'}
                                                    styles={getSelectStyles(darkMode, errors.district)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                                <ErrorMessage message={errors.district} />
                                            </motion.div>

                                            {/* Select Taluk */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Select Taluk
                                                </label>
                                                <Select
                                                    name="taluk"
                                                    options={talukOptions}
                                                    value={talukOptions.find(option => option.value === form.taluk) || null}
                                                    onChange={(option) => handleSelectChange(option, { name: 'taluk' })}
                                                    placeholder="Select taluk..."
                                                    noOptionsMessage={() => 'No taluks found'}
                                                    styles={getSelectStyles(darkMode, errors.taluk)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                                <ErrorMessage message={errors.taluk} />
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                            </div>

                            {/* Submit Button */}
                            <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50 mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${darkMode
                                        ? 'bg-[#3b35c9] opacity-70 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] hover:from-[#2c28a0] hover:to-[#3b35c9] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            Creating User...
                                        </>
                                    ) : (
                                        "Create User"
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}