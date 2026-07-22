import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSearch,
    FaSpinner,
    FaUser,
    FaPhone,
    FaTruck,
    FaEye,
    FaFileAlt,
    FaFilePdf,
    FaFileImage,
    FaFile,
    FaCheckCircle,
    FaClock
} from "react-icons/fa";

// Mock Data
const MOCK_DRIVERS = [
    { value: "1", label: "Rajesh Kumar", driverId: 1, driverName: "Rajesh Kumar" },
    { value: "2", label: "Amit Singh", driverId: 2, driverName: "Amit Singh" },
    { value: "3", label: "Suresh Patel", driverId: 3, driverName: "Suresh Patel" },
    { value: "4", label: "Ravi Sharma", driverId: 4, driverName: "Ravi Sharma" },
    { value: "5", label: "Deepak Verma", driverId: 5, driverName: "Deepak Verma" },
];

const MOCK_DRIVER_PROFILES = [
    {
        id: 1,
        driverName: "Rajesh Kumar",
        mobileNumber: "+91 98765 43210",
        truckNumber: "MH-01-AB-1234",
        documents: [
            { id: 1, name: "Driving License", type: "pdf", uploadedOn: "2026-01-15", status: "verified" },
            { id: 2, name: "Aadhar Card", type: "image", uploadedOn: "2026-01-15", status: "verified" },
            { id: 3, name: "PAN Card", type: "image", uploadedOn: "2026-01-20", status: "pending" },
            { id: 4, name: "Vehicle Registration", type: "pdf", uploadedOn: "2026-02-01", status: "verified" },
            { id: 5, name: "Insurance Document", type: "pdf", uploadedOn: "2026-02-10", status: "pending" },
        ]
    },
    {
        id: 2,
        driverName: "Amit Singh",
        mobileNumber: "+91 87654 32109",
        truckNumber: "MH-02-CD-5678",
        documents: [
            { id: 1, name: "Driving License", type: "pdf", uploadedOn: "2026-01-10", status: "verified" },
            { id: 2, name: "Aadhar Card", type: "image", uploadedOn: "2026-01-12", status: "verified" },
            { id: 3, name: "Vehicle Registration", type: "pdf", uploadedOn: "2026-01-20", status: "verified" },
        ]
    },
    {
        id: 3,
        driverName: "Suresh Patel",
        mobileNumber: "+91 76543 21098",
        truckNumber: "MH-03-EF-9012",
        documents: [
            { id: 1, name: "Driving License", type: "pdf", uploadedOn: "2026-01-05", status: "verified" },
            { id: 2, name: "Aadhar Card", type: "image", uploadedOn: "2026-01-08", status: "pending" },
            { id: 3, name: "PAN Card", type: "image", uploadedOn: "2026-01-15", status: "pending" },
        ]
    },
    {
        id: 4,
        driverName: "Ravi Sharma",
        mobileNumber: "+91 65432 10987",
        truckNumber: "MH-04-GH-3456",
        documents: [
            { id: 1, name: "Driving License", type: "pdf", uploadedOn: "2026-01-18", status: "verified" },
            { id: 2, name: "Aadhar Card", type: "image", uploadedOn: "2026-01-20", status: "verified" },
            { id: 3, name: "Vehicle Registration", type: "pdf", uploadedOn: "2026-02-01", status: "verified" },
            { id: 4, name: "Insurance Document", type: "pdf", uploadedOn: "2026-02-15", status: "pending" },
        ]
    },
    {
        id: 5,
        driverName: "Deepak Verma",
        mobileNumber: "+91 54321 09876",
        truckNumber: "MH-05-IJ-7890",
        documents: [
            { id: 1, name: "Driving License", type: "pdf", uploadedOn: "2026-01-22", status: "verified" },
            { id: 2, name: "Aadhar Card", type: "image", uploadedOn: "2026-01-25", status: "verified" },
            { id: 3, name: "PAN Card", type: "image", uploadedOn: "2026-02-01", status: "verified" },
        ]
    },
];

// React Select Styling
const getSelectStyles = (darkMode, error) => ({
    control: (base, state) => ({
        ...base,
        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        borderColor: error ? "#EF4444" : (state.isFocused ? "#4f46e5" : (darkMode ? "rgba(79, 70, 229,0.3)" : "#D1D5DB")),
        borderWidth: "1px",
        borderRadius: "0.5rem",
        minHeight: "44px",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 53, 201, 0.2)" : "none",
        "&:hover": {
            borderColor: error ? "#EF4444" : "#4f46e5"
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        border: darkMode ? "1px solid rgba(79, 70, 229,0.2)" : "1px solid #e5e7eb",
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
            ? "#4f46e5"
            : isFocused
                ? (darkMode ? "rgba(79, 70, 229,0.15)" : "#f3f4f6")
                : "transparent",
        color: isSelected
            ? "#ffffff"
            : (darkMode ? "#e2e0ff" : "#111827"),
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#4f46e5"
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

// Error Message Component
const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1">
            <span className="inline-block mt-0.5">⚠️</span>
            <span>{message}</span>
        </p>
    );
};

// Status Badge Component for Documents
const DocumentStatusBadge = ({ status }) => {
    const statusConfig = {
        'verified': {
            icon: FaCheckCircle,
            color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            label: 'Verified'
        },
        'pending': {
            icon: FaClock,
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            label: 'Pending'
        }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

// Document View Modal
const DocumentViewModal = ({ isOpen, onClose, driverData, darkMode }) => {
    if (!isOpen) return null;

    const getDocumentIcon = (type) => {
        switch (type) {
            case 'pdf':
                return FaFilePdf;
            case 'image':
                return FaFileImage;
            default:
                return FaFile;
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-[#1e293b] border border-[rgba(79, 70, 229,0.25)]" : "bg-white border border-gray-200"
                        }`}
                >
                    <div className="h-1.5 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a5a0ff]" />
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    Driver Documents
                                </h3>
                                {driverData && (
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {driverData.driverName}
                                        </p>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {driverData.truckNumber}
                                        </p>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {driverData.mobileNumber}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                                    }`}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {driverData?.documents?.map((doc) => {
                                const Icon = getDocumentIcon(doc.type);
                                return (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`p-4 rounded-lg border ${darkMode
                                            ? "bg-[#0f172a] border-[rgba(79, 70, 229,0.15)] hover:border-[rgba(79, 70, 229,0.3)]"
                                            : "bg-gray-50 border-gray-200 hover:border-[#4f46e5]"
                                            } transition-colors cursor-pointer`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${darkMode ? "bg-[rgba(79, 70, 229,0.15)]" : "bg-[#4f46e5]/10"
                                                    }`}>
                                                    <Icon className={darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"} size={20} />
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                                                        {doc.name}
                                                    </p>
                                                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                                        Uploaded: {doc.uploadedOn}
                                                    </p>
                                                </div>
                                            </div>
                                            <DocumentStatusBadge status={doc.status} />
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        icon: "info",
                                                        title: "Document Preview",
                                                        text: `Preview for ${doc.name} would open here. This is a mock preview.`,
                                                        confirmButtonColor: "#4f46e5",
                                                        background: darkMode ? "#1e293b" : "#ffffff",
                                                        color: darkMode ? "#ffffff" : "#000000"
                                                    });
                                                }}
                                                className={`text-xs font-medium ${darkMode ? "text-[#818cf8] hover:text-white" : "text-[#4f46e5] hover:text-[#4338ca]"
                                                    } transition-colors flex items-center gap-1`}
                                            >
                                                <FaEye size={12} />
                                                View Document
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {(!driverData?.documents || driverData.documents.length === 0) && (
                            <div className="text-center py-8">
                                <FaFileAlt className={`mx-auto text-4xl mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    No documents uploaded for this driver.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default function DriverProfile() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        driver: ""
    });

    const [driverOptions] = useState(MOCK_DRIVERS);
    const [loadingData, setLoadingData] = useState(false);
    const [errors, setErrors] = useState({});
    const [driverData, setDriverData] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!form.driver) {
            setErrors({ driver: "Driver is required" });
            Swal.fire({
                icon: "warning",
                title: "Please Select Driver",
                text: "Driver is required to fetch profile data",
                confirmButtonColor: "#f59e0b",
                background: darkMode ? "#1e293b" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
            return;
        }

        setLoadingData(true);
        setErrors({});

        setTimeout(() => {
            let filteredData = MOCK_DRIVER_PROFILES;

            if (form.driver) {
                const selectedDriver = MOCK_DRIVERS.find(d => d.value === form.driver);
                if (selectedDriver) {
                    filteredData = filteredData.filter(item => item.driverName === selectedDriver.driverName);
                }
            }

            setDriverData(filteredData);

            if (filteredData.length === 0) {
                Swal.fire({
                    icon: "info",
                    title: "No Data Found",
                    text: "No driver profile found for the selected driver",
                    confirmButtonColor: "#4f46e5",
                    background: darkMode ? "#1e293b" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000"
                });
            }

            setLoadingData(false);
        }, 1000);
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            return updated;
        });
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setDriverData([]);
    };

    const handleViewDocuments = (driver) => {
        setSelectedDriver(driver);
        setShowDocumentModal(true);
    };

    return (
        <div className={`min-h-full py-12 px-6 transition-colors duration-300 ${darkMode ? "bg-[#0f172a]" : "bg-gray-50"}`}>
            <div className="max-w-[1200px] mx-auto">

                <form onSubmit={handleSearch} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? "bg-[#1e293b] border-[rgba(79, 70, 229,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-sm"} rounded-2xl border min-h-[180px]`}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a5a0ff] rounded-t-2xl" />
                        <div className="p-8">
                            <div className="flex flex-wrap items-end gap-6">
                                <div className="w-full sm:w-64 md:w-80 max-w-[320px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Driver
                                    </label>
                                    <Select
                                        name="driver"
                                        options={driverOptions}
                                        value={driverOptions.find((option) => option.value === form.driver) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "driver" })}
                                        placeholder="Select driver..."
                                        noOptionsMessage={() => "No drivers found"}
                                        styles={getSelectStyles(darkMode, errors.driver)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.driver} />
                                </div>

                                <div className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: loadingData ? 1 : 1.02 }}
                                        whileTap={{ scale: loadingData ? 1 : 0.97 }}
                                        type="submit"
                                        disabled={loadingData || !form.driver}
                                        className={`w-full sm:w-auto px-10 py-2.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2.5 ${loadingData || !form.driver
                                            ? "bg-[#4f46e5] opacity-70 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]"
                                            }`}
                                    >
                                        {loadingData ? (
                                            <>
                                                <FaSpinner className="animate-spin" size={16} />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <FaSearch size={16} />
                                                Search
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>

                {/* Table Section */}
                {driverData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className={`mt-8 rounded-2xl border overflow-hidden ${darkMode ? "bg-[#1e293b] border-[rgba(79, 70, 229,0.25)]" : "bg-white border-gray-200 shadow-sm"
                            }`}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a5a0ff]" />
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b ${darkMode ? "border-[rgba(79, 70, 229,0.15)]" : "border-gray-200"}`}>
                                        <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                            SL NO
                                        </th>
                                        <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                            DRIVER NAME
                                        </th>
                                        <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                            MOBILE NUMBER
                                        </th>
                                        <th className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                            TRUCK NUMBER
                                        </th>
                                        <th className={`text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {driverData.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className={`border-b transition-colors ${darkMode
                                                ? "border-[rgba(79, 70, 229,0.1)] hover:bg-[rgba(79, 70, 229,0.05)]"
                                                : "border-gray-100 hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {index + 1}
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {item.driverName}
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {item.mobileNumber}
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {item.truckNumber}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleViewDocuments(item)}
                                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 mx-auto ${darkMode
                                                        ? "bg-[rgba(79, 70, 229,0.15)] text-[#818cf8] hover:bg-[rgba(79, 70, 229,0.25)]"
                                                        : "bg-[#4f46e5]/10 text-[#4f46e5] hover:bg-[#4f46e5]/20"
                                                        }`}
                                                >
                                                    <FaEye size={14} />
                                                    View Documents
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* No Data Message */}
                {driverData.length === 0 && !loadingData && form.driver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-8 p-12 text-center rounded-2xl border ${darkMode
                            ? "bg-[#1e293b] border-[rgba(79, 70, 229,0.25)]"
                            : "bg-white border-gray-200 shadow-sm"
                            }`}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a5a0ff] rounded-t-2xl" />
                        <div className="p-8">
                            <FaUser className={`mx-auto text-4xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                No driver profile found for the selected driver.
                                <br />
                                Please select a different driver and search again.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Initial State - No Driver Selected */}
                {!form.driver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-8 p-12 text-center rounded-2xl border ${darkMode
                            ? "bg-[#1e293b] border-[rgba(79, 70, 229,0.25)]"
                            : "bg-white border-gray-200 shadow-sm"
                            }`}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a5a0ff] rounded-t-2xl" />
                        <div className="p-8">
                            <FaSearch className={`mx-auto text-4xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Please select a driver and click search to view profile.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Document View Modal */}
                <AnimatePresence>
                    {showDocumentModal && (
                        <DocumentViewModal
                            isOpen={showDocumentModal}
                            onClose={() => {
                                setShowDocumentModal(false);
                                setSelectedDriver(null);
                            }}
                            driverData={selectedDriver}
                            darkMode={darkMode}
                        />
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}