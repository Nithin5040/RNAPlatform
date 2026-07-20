import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";
import * as yup from "yup";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

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

export default function RouteCreation() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    // Initial form state - Only zone and routePoint
    const initialFormState = {
        zone: "",
        routePoint: ""
    };

    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setErrorMessage("");
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setErrorMessage("");
    };

    // Helper: Compute 1st letter of selected Zone
    const selectedZoneObj = MOCK_ZONES.find((z) => z.value === form.zone);
    const zoneInitial = selectedZoneObj
        ? (selectedZoneObj.zoneName || selectedZoneObj.label || "").trim().charAt(0).toUpperCase()
        : "";

    const validateForm = async () => {
        try {
            const schema = yup.object().shape({
                zone: yup.string().required("Zone is required"),
                routePoint: yup.string().required("Route point is required").max(100, "Route point cannot exceed 100 characters")
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const fullRoutePoint = zoneInitial ? `${zoneInitial}-${form.routePoint}` : form.routePoint;

            const payload = {
                zoneCode: selectedZoneObj?.zoneCode || form.zone,
                zoneName: selectedZoneObj?.label || form.zone,
                zoneInitial: zoneInitial,
                routePoint: fullRoutePoint,
                userFormatInput: form.routePoint
            };

            console.log("Route Creation Payload:", payload);

            // Simulate server submission
            await new Promise((resolve) => setTimeout(resolve, 800));

            await Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Route point created successfully: ${fullRoutePoint}`,
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
                confirmButtonColor: "#3b35c9"
            });

            setSuccessMessage(`Route point created: ${fullRoutePoint}`);
            setForm(initialFormState);

            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        } catch (error) {
            console.error("Error creating route:", error);
            const errorMsg = error.message || "An error occurred while creating route.";
            setErrorMessage(errorMsg);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: errorMsg,
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-full py-12 px-6 transition-colors duration-300 ${darkMode ? "bg-[#0d0b22]" : "bg-gray-50"}`}>
            <div className="max-w-[1600px] mx-auto">
                {/* Status Messages */}
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

                {/* Form Wrapper - Exactly matching UserCreation screen layout */}
                <form onSubmit={handleSubmit} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-sm"} rounded-2xl border min-h-[220px]`}
                    >
                        {/* Gradient divider line at top */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff] rounded-t-2xl" />

                        <div className="p-8">
                            {/* Responsive Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                {/* Select Zone - Required (1st field with Mock Data) */}
                                <div>
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

                                {/* Route Point - Required (2nd field with Zone 1st Letter prefix badge) */}
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Route Point
                                    </label>
                                    <div className="relative">
                                        <div className={`w-full flex items-center rounded-lg border focus-within:ring-2 focus-within:ring-[#3b35c9] focus-within:border-[#3b35c9] transition-all overflow-hidden ${darkMode
                                            ? "bg-[#0d0b22] border-gray-800 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                            } ${errors.routePoint ? "border-red-500" : ""}`}
                                        >
                                            <div className="pl-3 pr-2 flex items-center gap-2 border-r border-gray-300/30 py-3">
                                                <FaMapMarkerAlt className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                                                {zoneInitial ? (
                                                    <span className="px-2 py-0.5 rounded font-extrabold text-xs bg-[#3b35c9] text-white shadow-xs tracking-wider">
                                                        {zoneInitial}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Zone 1st letter</span>
                                                )}
                                            </div>

                                            <input
                                                placeholder="Enter format"
                                                name="routePoint"
                                                value={form.routePoint}
                                                onChange={handleChange}
                                                maxLength={100}
                                                className="w-full py-3 px-3 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage message={errors.routePoint} />
                                </div>

                            </div>

                            {/* Submit Button */}
                            <div className={`pt-8 border-t mt-8 flex justify-end ${darkMode ? "border-[rgba(90,84,224,0.25)]" : "border-gray-100"}`}>
                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.97 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2 ${loading
                                        ? "bg-[#3b35c9] opacity-70 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] hover:from-[#2c28a0] hover:to-[#3b35c9] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            Creating Route...
                                        </>
                                    ) : (
                                        "Create Route"
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
