import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";
import * as yup from "yup";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { SummaryApi } from "../api/SummaryApi";
import {
    FaUser,
    FaPhone,
    FaTruck,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaUserPlus,
    FaCamera,
    FaTachometerAlt,
    FaIdCard,
    FaAddressCard,
    FaFileContract,
    FaCertificate,
    FaTrashAlt,
    FaCheckCircle,
    FaUpload,
    FaFolderOpen,
    FaTimes,
    FaPaperclip
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

// Format File Size
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const ALLOWED_ACCEPT = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf";

// Map API FileTypeName to field keys
const mapFileTypeToFieldKey = (fileTypeName) => {
    const mapping = {
        "DriverPhoto": "driverPhoto",
        "DriverAadhar": "aadhaarPhoto",
        "OdometerPhoto": "odometerPhoto",
        "TruckPhoto": "truckPhoto",
        "RC Card": "rcCardPhoto",
        "FC File": "fcFile",
        "Permit File": "permitFile"
    };
    return mapping[fileTypeName] || fileTypeName;
};

// Map API FileTypeName to icon
const getIconForFileType = (fileTypeName) => {
    const iconMap = {
        "DriverPhoto": FaCamera,
        "DriverAadhar": FaIdCard,
        "OdometerPhoto": FaTachometerAlt,
        "TruckPhoto": FaTruck,
        "RC Card": FaAddressCard,
        "FC File": FaFileContract,
        "Permit File": FaCertificate
    };
    return iconMap[fileTypeName] || FaFileContract;
};

// Get label for file type
const getFileTypeLabel = (fileTypeName) => {
    const labelMap = {
        "DriverPhoto": "Driver Photo Upload",
        "DriverAadhar": "Driver Aadhaar Card Photo",
        "OdometerPhoto": "Odometer Photo Upload",
        "TruckPhoto": "Truck Photo Upload",
        "RC Card": "RC Card Photo Upload",
        "FC File": "FC File Upload",
        "Permit File": "Permit File Upload"
    };
    return labelMap[fileTypeName] || fileTypeName;
};

// Compact Clean Upload Row Component inside Modal
const ModalUploadRow = ({
    id,
    label,
    icon: Icon,
    file,
    previewUrl,
    error,
    onChange,
    darkMode
}) => {
    const fileInputRef = useRef(null);

    const isImage = file && (file.type.startsWith("image/") || (previewUrl && !file.type.includes("pdf")));

    const getExtBadge = (name) => {
        if (!name) return "";
        return name.split(".").pop().toUpperCase();
    };

    return (
        <div className={`p-3.5 rounded-xl border transition-all ${darkMode
            ? "bg-[#0d0b22]/80 border-gray-800 hover:border-gray-700"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
            }`}>
            <input
                ref={fileInputRef}
                type="file"
                id={id}
                accept={ALLOWED_ACCEPT}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                className="hidden"
            />

            <div className="flex items-center justify-between gap-3">
                {/* Field Label & Icon */}
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 rounded-lg shrink-0 ${file
                        ? "bg-emerald-500/20 text-emerald-400"
                        : darkMode
                            ? "bg-indigo-500/15 text-[#a5a0ff]"
                            : "bg-indigo-50 text-[#3b35c9]"
                        }`}>
                        <Icon size={16} />
                    </div>
                    <div className="truncate">
                        <p className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {label}
                        </p>
                        {file && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-emerald-500 font-semibold truncate max-w-[150px] sm:max-w-[220px]">
                                    {file.name}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 shrink-0">
                                    {getExtBadge(file.name)}
                                </span>
                                <span className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    ({formatFileSize(file.size)})
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Action Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                    {file ? (
                        <div className="flex items-center gap-2">
                            {isImage && previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt={label}
                                    className="w-8 h-8 rounded object-cover border border-gray-600/30 shadow-sm"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Remove File"
                            >
                                <FaTrashAlt size={13} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${error
                                ? "border-red-500 text-red-500 bg-red-500/5"
                                : darkMode
                                    ? "border-gray-700 text-gray-200 hover:border-[#5a54e0] hover:bg-[#5a54e0]/15"
                                    : "border-gray-300 text-gray-700 hover:border-[#3b35c9] hover:bg-indigo-50/60"
                                }`}
                        >
                            <FaUpload size={11} />
                            Upload
                        </button>
                    )}
                </div>
            </div>

            <ErrorMessage message={error} />
        </div>
    );
};

// React Select Styling matching UserCreation style
const getSelectStyles = (darkMode, error) => ({
    control: (base, state) => ({
        ...base,
        backgroundColor: darkMode ? "#13102e" : "#ffffff",
        borderColor: error ? "#EF4444" : (state.isFocused ? "#3b35c9" : (darkMode ? "rgba(90,84,224,0.3)" : "#D1D5DB")),
        borderWidth: "1px",
        borderRadius: "0.5rem",
        minHeight: "44px",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 53, 201, 0.2)" : "none",
        "&:hover": {
            borderColor: error ? "#EF4444" : "#3b35c9"
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: darkMode ? "#13102e" : "#ffffff",
        border: darkMode ? "1px solid rgba(90,84,224,0.2)" : "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        zIndex: 9999
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? "#3b35c9"
            : isFocused
                ? (darkMode ? "rgba(90,84,224,0.15)" : "#f3f4f6")
                : "transparent",
        color: isSelected
            ? "#ffffff"
            : (darkMode ? "#e2e0ff" : "#111827"),
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#3b35c9"
        }
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: darkMode ? "rgba(90,84,224,0.2)" : "#e0e7ff",
        borderRadius: "4px"
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: darkMode ? "#e2e0ff" : "#3b35c9",
        fontSize: "0.75rem",
        fontWeight: "600"
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: darkMode ? "#a5a0ff" : "#3b35c9",
        "&:hover": {
            backgroundColor: darkMode ? "rgba(90,84,224,0.3)" : "#c7d2fe",
            color: darkMode ? "#ffffff" : "#1e1b4b"
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: darkMode ? "#e2e0ff" : "#111827"
    }),
    placeholder: (base) => ({
        ...base,
        color: darkMode ? "rgba(165,160,255,0.5)" : "#9ca3af",
        fontSize: "0.875rem"
    })
});

const initialFormState = {
    name: "",
    mobileNumber: "",
    truckNumber: "",
    password: "",
    fileTypes: [] // Array of selected file type values (FileTypeId)
};

const initialFilesState = {};

// Create dynamic files state based on API response
const createInitialFilesState = (fileTypes) => {
    const state = {};
    fileTypes.forEach(ft => {
        const key = mapFileTypeToFieldKey(ft.FileTypeName);
        state[key] = null;
    });
    return state;
};

export default function DriverCreation() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    // State for dropdown options from API
    const [fileTypeOptions, setFileTypeOptions] = useState([]);
    const [loadingDropdown, setLoadingDropdown] = useState(true);

    const [form, setForm] = useState(initialFormState);
    const [files, setFiles] = useState(initialFilesState);
    const [filePreviews, setFilePreviews] = useState({});
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fallback options in case API fails
    const setFallbackOptions = useCallback(() => {
        const fallbackOptions = [
            { value: 1, label: "DriverPhoto", fileTypeName: "DriverPhoto" },
            { value: 2, label: "DriverAadhar", fileTypeName: "DriverAadhar" },
            { value: 3, label: "OdometerPhoto", fileTypeName: "OdometerPhoto" },
            { value: 4, label: "TruckPhoto", fileTypeName: "TruckPhoto" },
            { value: 5, label: "RC Card", fileTypeName: "RC Card" },
            { value: 6, label: "FC File", fileTypeName: "FC File" },
            { value: 7, label: "Permit File", fileTypeName: "Permit File" }
        ];
        setFileTypeOptions(fallbackOptions);
        const fallbackFileTypes = [
            { FileTypeName: "DriverPhoto" },
            { FileTypeName: "DriverAadhar" },
            { FileTypeName: "OdometerPhoto" },
            { FileTypeName: "TruckPhoto" },
            { FileTypeName: "RC Card" },
            { FileTypeName: "FC File" },
            { FileTypeName: "Permit File" }
        ];
        setFiles(createInitialFilesState(fallbackFileTypes));
    }, []);

    // Fetch file types from API
    const fetchFileTypes = useCallback(async () => {
        setLoadingDropdown(true);
        try {
            const response = await axiosClient({
                method: SummaryApi.drivercreationdpdwns.method,
                url: SummaryApi.drivercreationdpdwns.url,
                data: { flagId: 1 }
            });

            // Check if we have data in the result
            if (response.data?.result && response.data.result.length > 0) {
                // Map API response to react-select options
                const options = response.data.result.map(item => ({
                    value: item.FileTypeId,
                    label: item.FileTypeName,
                    fileTypeId: item.FileTypeId,
                    fileTypeName: item.FileTypeName
                }));
                setFileTypeOptions(options);

                // Initialize files state based on API response
                const initialFiles = createInitialFilesState(response.data.result);
                setFiles(initialFiles);
                setFilePreviews({});
            } else {
                // If no data, use fallback
                console.warn("No file types received from API, using fallback");
                setFallbackOptions();
            }
        } catch (error) {
            console.error("Error fetching file types:", error);
            // Use fallback options on error
            setFallbackOptions();
        } finally {
            setLoadingDropdown(false);
        }
    }, [setFallbackOptions]);

    // Fetch file types on component mount
    useEffect(() => {
        fetchFileTypes();
    }, [fetchFileTypes]);

    // Revoke preview URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(filePreviews).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobileNumber") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setForm((prev) => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
        setErrorMessage("");
    };

    // Handle File Type Multi-Select
    const handleFileTypeChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setForm((prev) => ({ ...prev, fileTypes: values }));
        setErrors((prev) => ({ ...prev, fileTypes: "" }));
        setErrorMessage("");
    };

    // Handle File Field Upload & Image Preview logic with format validation
    const handleFileChange = (fieldKey, selectedFile) => {
        if (selectedFile) {
            const fileName = selectedFile.name.toLowerCase();
            const validExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
            const isExtensionValid = validExtensions.some((ext) => fileName.endsWith(ext));
            const isMimeValid = selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf";

            if (!isExtensionValid && !isMimeValid) {
                setErrors((prev) => ({
                    ...prev,
                    [fieldKey]: "Invalid format. Please upload JPG, JPEG, PNG or PDF format."
                }));
                return;
            }

            if (selectedFile.size > 10 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, [fieldKey]: "File size exceeds 10MB limit" }));
                return;
            }

            if (filePreviews[fieldKey]) {
                URL.revokeObjectURL(filePreviews[fieldKey]);
            }

            if (selectedFile.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(selectedFile.name)) {
                const url = URL.createObjectURL(selectedFile);
                setFilePreviews((prev) => ({ ...prev, [fieldKey]: url }));
            } else {
                setFilePreviews((prev) => ({ ...prev, [fieldKey]: null }));
            }

            setFiles((prev) => ({ ...prev, [fieldKey]: selectedFile }));
            setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
        } else {
            if (filePreviews[fieldKey]) {
                URL.revokeObjectURL(filePreviews[fieldKey]);
            }
            setFilePreviews((prev) => ({ ...prev, [fieldKey]: null }));
            setFiles((prev) => ({ ...prev, [fieldKey]: null }));
            setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
        }
        setErrorMessage("");
    };

    const validateForm = async () => {
        try {
            const schema = yup.object().shape({
                name: yup.string().required("Driver Name is required").max(100, "Driver name cannot exceed 100 characters"),
                mobileNumber: yup.string().required("Mobile Number is required").matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number"),
                truckNumber: yup.string().required("Truck Number is required").max(20, "Truck number cannot exceed 20 characters"),
                password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
                fileTypes: yup.array().min(1, "Please select at least one file type")
            });

            await schema.validate(form, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            if (err.inner) {
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
            }
            setErrors(validationErrors);
            return false;
        }
    };

    const resetAllFields = () => {
        setForm(initialFormState);
        Object.values(filePreviews).forEach((url) => {
            if (url) URL.revokeObjectURL(url);
        });
        // Reset files to initial state with all file types null
        const resetFiles = {};
        Object.keys(files).forEach(key => {
            resetFiles[key] = null;
        });
        setFiles(resetFiles);
        setFilePreviews({});
    };

    // Get file fields for selected types
    const getSelectedFileFields = useCallback(() => {
        const selectedFields = [];
        form.fileTypes.forEach(fileTypeId => {
            const option = fileTypeOptions.find(opt => opt.value === fileTypeId);
            if (option) {
                const fieldKey = mapFileTypeToFieldKey(option.fileTypeName);
                const label = getFileTypeLabel(option.fileTypeName);
                const Icon = getIconForFileType(option.fileTypeName);
                selectedFields.push({
                    id: fieldKey,
                    label: label,
                    icon: Icon,
                    fileTypeName: option.fileTypeName,
                    fileTypeId: option.fileTypeId
                });
            }
        });
        return selectedFields;
    }, [form.fileTypes, fileTypeOptions]);

    // Get file label mapping
    const getFileLabels = useCallback(() => {
        const labels = {};
        fileTypeOptions.forEach(option => {
            const key = mapFileTypeToFieldKey(option.fileTypeName);
            labels[key] = getFileTypeLabel(option.fileTypeName);
        });
        return labels;
    }, [fileTypeOptions]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const fileLabels = getFileLabels();

            // Get selected file type IDs and their names
            const selectedFileTypes = form.fileTypes.map(fileTypeId => {
                const option = fileTypeOptions.find(opt => opt.value === fileTypeId);
                return option ? option.fileTypeName : fileTypeId;
            });

            // Get files only for selected types
            const selectedFiles = {};
            const selectedFieldsList = getSelectedFileFields();
            selectedFieldsList.forEach(({ id }) => {
                if (files[id]) {
                    selectedFiles[id] = files[id];
                }
            });

            const uploadedFilesSummary = Object.entries(selectedFiles)
                .map(([key, file]) => {
                    const label = fileLabels[key] || key;
                    return `<li><b>${label}:</b> ${file.name} (${formatFileSize(file.size)})</li>`;
                })
                .join("");

            // Get CreatedByUserId from sessionStorage
            const createdByUserId = sessionStorage.getItem("userId") || 1;

            // Build multipart/form-data matching the API schema
            const formData = new FormData();
            formData.append("flagId", "1");
            formData.append("DriverName", form.name);
            formData.append("MobileNumber", form.mobileNumber);
            formData.append("TruckNumber", form.truckNumber);
            formData.append("Password", form.password);
            formData.append("CreatedByUserId", String(createdByUserId));
            formData.append("FileTypeIds", JSON.stringify(form.fileTypes));

            // Append each selected file under the key "files"
            Object.values(selectedFiles).forEach(file => {
                formData.append("files", file);
            });

            const response = await axiosClient({
                method: SummaryApi.drivercreation.method,
                url: SummaryApi.drivercreation.url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data?.status) {
                await Swal.fire({
                    icon: "success",
                    title: "Driver Created Successfully!",
                    html: `
                        <div style="text-align: left; font-size: 14px; margin-top: 10px; line-height: 1.6;">
                            <p><b>Driver Name:</b> ${form.name}</p>
                            <p><b>Mobile Number:</b> ${form.mobileNumber}</p>
                            <p><b>Truck Number:</b> ${form.truckNumber}</p>
                            <p><b>File Types Selected:</b> ${selectedFileTypes.join(", ")}</p>
                            ${uploadedFilesSummary
                            ? `<hr style="margin: 10px 0; border-color: rgba(120,120,120,0.2);"/>
                                       <p><b>Uploaded Documents:</b></p>
                                       <ul style="padding-left: 18px; margin-top: 4px;">${uploadedFilesSummary}</ul>`
                            : `<p style="color: #9ca3af; font-size: 12px; margin-top: 6px;">No document files attached</p>`
                        }
                        </div>
                    `,
                    confirmButtonText: "Done",
                    confirmButtonColor: "#3b35c9",
                    background: darkMode ? "#13102e" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000"
                });

                resetAllFields();
            } else {
                throw new Error(response.data?.message || "Failed to create driver");
            }
        } catch (error) {
            console.error("Driver Creation Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.Message || error.message || "An error occurred while creating driver.";
            Swal.fire({
                icon: "error",
                title: "Creation Failed!",
                text: errorMsg,
                confirmButtonColor: "#ef4444",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
        } finally {
            setLoading(false);
        }
    };

    const uploadedCount = Object.values(files).filter(Boolean).length;
    const selectedFields = getSelectedFileFields();

    return (
        <div className={`min-h-full py-12 px-6 transition-colors duration-300 ${darkMode ? "bg-[#0d0b22]" : "bg-gray-50"}`}>
            <div className="max-w-[1600px] mx-auto">

                {/* Status Banners */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? "bg-green-950/30 border-green-800 text-green-300" : "bg-green-50 border-green-200 text-green-700"}`}
                        >
                            {successMessage}
                        </motion.div>
                    )}

                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? "bg-red-950/30 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Form Container */}
                <form onSubmit={handleSubmit} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-sm"} rounded-2xl border min-h-[220px]`}
                    >
                        {/* Top Gradient Divider Line */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff] rounded-t-2xl" />

                        <div className="p-8 space-y-8">

                            {/* Basic Information Form Fields */}
                            <div>
                                <div className="flex flex-wrap items-start gap-6">

                                    {/* Field 1: Driver Name */}
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            <span className="text-red-500 mr-1">*</span>Driver Name
                                        </label>
                                        <div className="relative">
                                            <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={14} />
                                            <input
                                                placeholder="Enter driver name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                maxLength={100}
                                                className={`w-full h-[44px] rounded-lg border pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                    ? "bg-[#13102e] border-[rgba(90,84,224,0.3)] text-white placeholder-gray-500 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    : "bg-white border-[#D1D5DB] text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    } ${errors.name ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        <ErrorMessage message={errors.name} />
                                    </div>

                                    {/* Field 2: Mobile Number */}
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            <span className="text-red-500 mr-1">*</span>Mobile Number
                                        </label>
                                        <div className="relative">
                                            <FaPhone className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={14} />
                                            <input
                                                placeholder="Enter 10-digit mobile"
                                                name="mobileNumber"
                                                value={form.mobileNumber}
                                                onChange={handleChange}
                                                maxLength={10}
                                                className={`w-full h-[44px] rounded-lg border pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                    ? "bg-[#13102e] border-[rgba(90,84,224,0.3)] text-white placeholder-gray-500 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    : "bg-white border-[#D1D5DB] text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    } ${errors.mobileNumber ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        <ErrorMessage message={errors.mobileNumber} />
                                    </div>

                                    {/* Field 3: Truck Number */}
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            <span className="text-red-500 mr-1">*</span>Truck Number
                                        </label>
                                        <div className="relative">
                                            <FaTruck className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={14} />
                                            <input
                                                placeholder="Enter truck number"
                                                name="truckNumber"
                                                value={form.truckNumber}
                                                onChange={handleChange}
                                                maxLength={20}
                                                className={`w-full h-[44px] rounded-lg border pl-10 pr-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                    ? "bg-[#13102e] border-[rgba(90,84,224,0.3)] text-white placeholder-gray-500 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    : "bg-white border-[#D1D5DB] text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    } ${errors.truckNumber ? "border-red-500" : ""}`}
                                            />
                                        </div>
                                        <ErrorMessage message={errors.truckNumber} />
                                    </div>

                                    {/* Field 4: Password */}
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            <span className="text-red-500 mr-1">*</span>Password
                                        </label>
                                        <div className="relative">
                                            <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={14} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className={`w-full h-[44px] rounded-lg border pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                    ? "bg-[#13102e] border-[rgba(90,84,224,0.3)] text-white placeholder-gray-500 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    : "bg-white border-[#D1D5DB] text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]"
                                                    } ${errors.password ? "border-red-500" : ""}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                                            >
                                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                            </button>
                                        </div>
                                        <ErrorMessage message={errors.password} />
                                    </div>

                                    {/* Field 5: File Type Multi-Select Dropdown - Dynamic from API */}
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            <span className="text-red-500 mr-1">*</span>Select File Types
                                        </label>
                                        <Select
                                            name="fileTypes"
                                            options={fileTypeOptions}
                                            value={fileTypeOptions.filter(option => form.fileTypes.includes(option.value))}
                                            onChange={handleFileTypeChange}
                                            placeholder={loadingDropdown ? "Loading file types..." : "Select file types..."}
                                            noOptionsMessage={() => loadingDropdown ? "Loading..." : "No file types available"}
                                            styles={getSelectStyles(darkMode, errors.fileTypes)}
                                            classNamePrefix="react-select"
                                            isMulti
                                            isSearchable
                                            isLoading={loadingDropdown}
                                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                        />
                                        <ErrorMessage message={errors.fileTypes} />
                                    </div>

                                </div>
                            </div>

                            {/* Upload Section - Only show when file types are selected */}
                            {form.fileTypes.length > 0 && (
                                <div className={`pt-6 border-t flex flex-col items-start gap-4 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                                    {/* Single Upload Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 border shadow-sm ${uploadedCount > 0
                                            ? darkMode
                                                ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50"
                                                : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                            : darkMode
                                                ? "bg-[#0d0b22] border-gray-700 text-white hover:border-[#5a54e0] hover:bg-[#5a54e0]/10"
                                                : "bg-gray-50 border-gray-300 text-gray-800 hover:border-[#3b35c9] hover:bg-indigo-50/50"
                                            }`}
                                    >
                                        <FaPaperclip size={15} className={uploadedCount > 0 ? "text-emerald-500" : "text-[#3b35c9]"} />
                                        <span>Upload Selected Documents</span>
                                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${uploadedCount > 0
                                            ? "bg-emerald-500 text-white"
                                            : darkMode
                                                ? "bg-gray-800 text-gray-300"
                                                : "bg-gray-200 text-gray-700"
                                            }`}>
                                            {uploadedCount} / {form.fileTypes.length} Attached
                                        </span>
                                    </button>

                                    {/* Attached Files Quick Chips under button if any */}
                                    {uploadedCount > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-dashed border-gray-700/30">
                                            {selectedFields.map(({ id, label }) => {
                                                const file = files[id];
                                                if (!file) return null;
                                                return (
                                                    <span key={id} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border ${darkMode ? "bg-[#0d0b22] border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-700 shadow-sm"
                                                        }`}>
                                                        <FaCheckCircle size={11} className="text-emerald-500" />
                                                        <span className="font-semibold">{label.replace(" Upload", "")}:</span>
                                                        <span className="truncate max-w-[120px]">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileChange(id, null)}
                                                            className="ml-1 text-red-400 hover:text-red-600 text-sm font-bold"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit Action Button */}
                            <div className={`pt-6 border-t flex justify-end ${darkMode ? "border-[rgba(90,84,224,0.25)]" : "border-gray-100"}`}>
                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.97 }}
                                    type="submit"
                                    disabled={loading || loadingDropdown}
                                    className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2 ${(loading || loadingDropdown)
                                        ? "bg-[#3b35c9] opacity-70 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] hover:from-[#2c28a0] hover:to-[#3b35c9] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            Creating Driver...
                                        </>
                                    ) : loadingDropdown ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus size={14} />
                                            Create Driver
                                        </>
                                    )}
                                </motion.button>
                            </div>

                        </div>
                    </motion.div>
                </form>

            </div>

            {/* Modal Popup for Document Uploads */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Dialog Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${darkMode ? "bg-[#13102e] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
                                }`}
                        >
                            {/* Modal Header */}
                            <div className={`p-5 border-b flex items-center justify-between ${darkMode ? "border-gray-800 bg-[#0d0b22]" : "border-gray-100 bg-gray-50"
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-[#3b35c9] text-white">
                                        <FaFolderOpen size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold">
                                            Upload Selected Documents
                                        </h3>
                                        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            Supported Formats: JPG, JPEG, PNG, PDF (Max 10MB per file)
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* Modal Body - Only show selected file types */}
                            <div className="p-6 overflow-y-auto space-y-3 max-h-[55vh]">
                                {selectedFields.length > 0 ? (
                                    selectedFields.map(({ id, label, icon }) => (
                                        <ModalUploadRow
                                            key={id}
                                            id={id}
                                            label={label}
                                            icon={icon}
                                            file={files[id]}
                                            previewUrl={filePreviews[id]}
                                            error={errors[id]}
                                            onChange={(file) => handleFileChange(id, file)}
                                            darkMode={darkMode}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            No file types selected. Please go back and select file types.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className={`p-4 px-6 border-t flex justify-between items-center ${darkMode ? "border-gray-800 bg-[#0d0b22]" : "border-gray-100 bg-gray-50"
                                }`}>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle size={14} className="text-emerald-500" />
                                    <span className="text-xs font-semibold text-emerald-500">
                                        {uploadedCount} of {form.fileTypes.length} Files Attached
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Save & Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}