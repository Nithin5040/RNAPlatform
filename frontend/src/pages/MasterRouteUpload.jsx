import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCloudUploadAlt,
    FaSpinner,
    FaTrash,
    FaFileUpload
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

// Static Mock Zones Data
const MOCK_ZONES = [
    { value: "Z01", label: "Zone 1 - North Zone", zoneCode: "Z01", zoneName: "North Zone" },
    { value: "Z02", label: "Zone 2 - South Zone", zoneCode: "Z02", zoneName: "South Zone" },
    { value: "Z03", label: "Zone 3 - East Zone", zoneCode: "Z03", zoneName: "East Zone" },
    { value: "Z04", label: "Zone 4 - West Zone", zoneCode: "Z04", zoneName: "West Zone" },
    { value: "Z05", label: "Zone 5 - Central Zone", zoneCode: "Z05", zoneName: "Central Zone" }
];

// Mock Route Points Data grouped by Zone
const MOCK_ROUTE_POINTS = {
    "Z01": [
        { value: "RP-N-101", label: "N-101 North Expressway Corridor", zoneCode: "Z01" },
        { value: "RP-N-102", label: "N-102 Airport Road Bypass", zoneCode: "Z01" },
        { value: "RP-N-103", label: "N-103 Northern Industrial Park", zoneCode: "Z01" }
    ],
    "Z02": [
        { value: "RP-S-201", label: "S-201 Tech Park Southern Transit", zoneCode: "Z02" },
        { value: "RP-S-202", label: "S-202 Outer Ring Highway Junction", zoneCode: "Z02" },
        { value: "RP-S-203", label: "S-203 South Port Terminal Depot", zoneCode: "Z02" }
    ],
    "Z03": [
        { value: "RP-E-301", label: "E-301 Eastern Logistics Freight Line", zoneCode: "Z03" },
        { value: "RP-E-302", label: "E-302 East Cargo Terminal Station", zoneCode: "Z03" }
    ],
    "Z04": [
        { value: "RP-W-401", label: "W-401 Coastal Highway Route Point", zoneCode: "Z04" },
        { value: "RP-W-402", label: "W-402 Western Express Hub", zoneCode: "Z04" }
    ],
    "Z05": [
        { value: "RP-C-501", label: "C-501 Central Metro Transfer Point", zoneCode: "Z05" },
        { value: "RP-C-502", label: "C-502 City Center Terminal Hub", zoneCode: "Z05" }
    ]
};

const ALL_MOCK_ROUTE_POINTS = Object.values(MOCK_ROUTE_POINTS).flat();

export default function MasterRouteUpload() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        zone: "",
        routePoint: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [routePointOptions, setRoutePointOptions] = useState(ALL_MOCK_ROUTE_POINTS);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Update Route Points options based on Zone selection
    useEffect(() => {
        if (!form.zone) {
            setRoutePointOptions(ALL_MOCK_ROUTE_POINTS);
        } else {
            const points = MOCK_ROUTE_POINTS[form.zone] || ALL_MOCK_ROUTE_POINTS;
            setRoutePointOptions(points);
        }
    }, [form.zone]);

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "zone") {
                updated.routePoint = "";
            }
            return updated;
        });
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setErrorMessage("");
    };

    // File Selection Handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file) => {
        const validExtensions = [".csv", ".xlsx", ".xls"];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));

        if (!isValid) {
            setErrors((prev) => ({ ...prev, file: "Invalid file type. Upload .xlsx, .xls or .csv file." }));
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setErrors((prev) => ({ ...prev, file: "" }));
        setErrorMessage("");
    };

    const removeSelectedFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFile(null);
        setErrors((prev) => ({ ...prev, file: "" }));
    };

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (!form.zone) {
            newErrors.zone = "Zone is required";
            valid = false;
        }

        if (!form.routePoint) {
            newErrors.routePoint = "Route Point is required";
            valid = false;
        }

        if (!selectedFile) {
            newErrors.file = "Document file is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        setUploading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const selectedZoneObj = MOCK_ZONES.find((z) => z.value === form.zone);
            const selectedRoutePointObj = routePointOptions.find((rp) => rp.value === form.routePoint);

            // Simulate file upload delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await Swal.fire({
                icon: "success",
                title: "Upload Successful!",
                html: `
                    <div style="text-align: left; font-size: 14px; margin-top: 10px;">
                        <p><b>Zone:</b> ${selectedZoneObj?.label || form.zone}</p>
                        <p><b>Route Point:</b> ${selectedRoutePointObj?.label || form.routePoint}</p>
                        <p><b>Uploaded Document:</b> ${selectedFile.name}</p>
                    </div>
                `,
                confirmButtonText: "Done",
                confirmButtonColor: "#3b35c9",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });

            setSuccessMessage(`Document "${selectedFile.name}" uploaded successfully!`);
            setForm({ zone: "", routePoint: "" });
            setSelectedFile(null);

            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        } catch (error) {
            console.error("Master Route Upload Error:", error);
            const errorMsg = error.message || "An error occurred during file upload.";
            setErrorMessage(errorMsg);
            Swal.fire({
                icon: "error",
                title: "Upload Failed!",
                text: errorMsg,
                confirmButtonColor: "#ef4444",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
        } finally {
            setUploading(false);
        }
    };

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

                {/* Form Card Container - Exactly matching UserCreation screen layout */}
                <form onSubmit={handleUploadSubmit} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-sm"} rounded-2xl border min-h-[220px]`}
                    >
                        {/* Top Gradient Line */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff] rounded-t-2xl" />

                        <div className="p-8">
                            {/* Row containing fields with small, compact dropdown widths */}
                            <div className="flex flex-wrap items-start gap-6">

                                {/* Field 1: Select Zone Dropdown (Small Width) */}
                                <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Zone
                                    </label>
                                    <Select
                                        name="zone"
                                        options={MOCK_ZONES}
                                        value={MOCK_ZONES.find((option) => option.value === form.zone) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "zone" })}
                                        placeholder="Select zone..."
                                        noOptionsMessage={() => "No zones found"}
                                        styles={getSelectStyles(darkMode, errors.zone)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.zone} />
                                </div>

                                {/* Field 2: Select Route Point Dropdown (Small Width) */}
                                <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Route Point
                                    </label>
                                    <Select
                                        name="routePoint"
                                        options={routePointOptions}
                                        value={routePointOptions.find((option) => option.value === form.routePoint) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "routePoint" })}
                                        placeholder={form.zone ? "Select route point..." : "Select zone first or choose point..."}
                                        noOptionsMessage={() => "No route points found"}
                                        styles={getSelectStyles(darkMode, errors.routePoint)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.routePoint} />
                                </div>

                                {/* Field 3: Upload Document */}
                                <div className="w-full sm:w-80 md:w-96 max-w-sm">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Upload Document
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="document-file-input"
                                            accept=".csv, .xlsx, .xls"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="document-file-input"
                                            className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-lg border cursor-pointer transition-all ${darkMode
                                                ? "bg-[#0d0b22] border-gray-800 text-white hover:border-[#3b35c9]"
                                                : "bg-white border-gray-300 text-gray-900 hover:border-[#3b35c9]"
                                                } ${errors.file ? "border-red-500" : ""}`}
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                                                <FaFileUpload className={selectedFile ? "text-green-500" : (darkMode ? "text-gray-500" : "text-gray-400")} size={16} />
                                                <span className={`text-sm truncate ${selectedFile ? "font-semibold text-green-500" : (darkMode ? "text-gray-400" : "text-gray-500")}`}>
                                                    {selectedFile ? selectedFile.name : "Choose file (.xlsx, .csv)"}
                                                </span>
                                            </div>

                                            {selectedFile ? (
                                                <button
                                                    type="button"
                                                    onClick={removeSelectedFile}
                                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded flex-shrink-0"
                                                    title="Remove File"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-[#3b35c9] text-white rounded text-xs font-semibold flex items-center gap-1 flex-shrink-0 shadow-xs">
                                                    Browse
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                    <ErrorMessage message={errors.file} />
                                </div>

                            </div>

                            {/* Action Row - Upload Button */}
                            <div className={`pt-8 border-t mt-8 flex justify-end ${darkMode ? "border-[rgba(90,84,224,0.25)]" : "border-gray-100"}`}>
                                <motion.button
                                    whileHover={{ scale: uploading ? 1 : 1.02 }}
                                    whileTap={{ scale: uploading ? 1 : 0.97 }}
                                    type="submit"
                                    disabled={uploading}
                                    className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2.5 ${uploading
                                        ? "bg-[#3b35c9] opacity-70 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] hover:from-[#2c28a0] hover:to-[#3b35c9] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]"
                                        }`}
                                >
                                    {uploading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={16} />
                                            Uploading Document...
                                        </>
                                    ) : (
                                        <>
                                            <FaCloudUploadAlt size={18} />
                                            Upload Master Route
                                        </>
                                    )}
                                </motion.button>
                            </div>

                        </div>
                    </motion.div>
                </form>

            </div>
        </div>
    );
}
