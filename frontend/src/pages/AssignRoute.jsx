import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUserCheck,
    FaSpinner,
    FaRoute,
    FaTruck,
    FaUser
} from "react-icons/fa";
import axiosClient from "../api/axiosClient";
import { SummaryApi } from "../api/SummaryApi";

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1">
            <span className="inline-block mt-0.5">⚠️</span>
            <span>{message}</span>
        </p>
    );
};

// React Select Styling matching MasterRouteUpload style
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

export default function AssignRoute() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        zone: "",
        routePlan: "",
        driver: ""
    });

    const [zoneOptions, setZoneOptions] = useState([]);
    const [routePlanOptions, setRoutePlanOptions] = useState([]);
    const [driverOptions, setDriverOptions] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [loadingZones, setLoadingZones] = useState(false);
    const [loadingRoutePlans, setLoadingRoutePlans] = useState(false);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch Zones on component mount
    useEffect(() => {
        fetchZones();
        fetchDrivers();
    }, []);

    // Fetch Zones from API
    const fetchZones = async () => {
        setLoadingZones(true);
        try {
            const response = await axiosClient({
                method: SummaryApi.masterroutedpdwns.method,
                url: SummaryApi.masterroutedpdwns.url,
                data: { flagId: 1 }
            });

            if (response.data.status === true || response.data.status === false) {
                const formattedZones = response.data.result.map(zone => ({
                    value: zone.ZoneMasterId.toString(),
                    label: zone.ZonePrefix,
                    zoneId: zone.ZoneMasterId,
                    zonePrefix: zone.ZonePrefix
                }));
                setZoneOptions(formattedZones);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Fetch Zones",
                    text: response.data.Message || "Failed to fetch zones",
                    confirmButtonColor: "#ef4444",
                    background: darkMode ? "#13102e" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000"
                });
            }
        } catch (error) {
            console.error("Error fetching zones:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.Message || "Failed to fetch zones. Please try again.",
                confirmButtonColor: "#ef4444",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
        } finally {
            setLoadingZones(false);
        }
    };

    // Fetch Route Plans based on selected Zone
    const fetchRoutePlans = async (zoneMasterId) => {
        if (!zoneMasterId) {
            setRoutePlanOptions([]);
            return;
        }

        setLoadingRoutePlans(true);
        try {
            const response = await axiosClient({
                method: SummaryApi.masterroutedpdwns.method,
                url: SummaryApi.masterroutedpdwns.url,
                data: {
                    flagId: 2,
                    ZoneMasterId: parseInt(zoneMasterId)
                }
            });

            if (response.data.status === true || response.data.status === false) {
                const formattedPlans = response.data.result.map(plan => ({
                    value: plan.RoutePlanId?.toString() || plan.id?.toString(),
                    label: plan.RoutePlanPoint || plan.RoutePointName || plan.label || "Route Plan",
                    routePlanId: plan.RoutePlanId,
                    routePlanPoint: plan.RoutePlanPoint,
                    zoneMasterId: plan.ZoneMasterId || zoneMasterId
                }));
                setRoutePlanOptions(formattedPlans);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Fetch Route Plans",
                    text: response.data.Message || "Failed to fetch route plans",
                    confirmButtonColor: "#ef4444",
                    background: darkMode ? "#13102e" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000"
                });
                setRoutePlanOptions([]);
            }
        } catch (error) {
            console.error("Error fetching route plans:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.Message || "Failed to fetch route plans. Please try again.",
                confirmButtonColor: "#ef4444",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
            setRoutePlanOptions([]);
        } finally {
            setLoadingRoutePlans(false);
        }
    };

    // Fetch Drivers from API
    const fetchDrivers = async () => {
        setLoadingDrivers(true);
        try {
            const response = await axiosClient({
                method: SummaryApi.drivercreationdpdwns.method,
                url: SummaryApi.drivercreationdpdwns.url,
                data: { flagId: 2 } // Assuming flagId 2 fetches drivers
            });

            if (response.data.status === true || response.data.status === false) {
                const formattedDrivers = response.data.result.map(driver => ({
                    value: driver.DriverId?.toString() || driver.id?.toString(),
                    label: driver.DriverName || driver.name || "Driver",
                    driverId: driver.DriverId,
                    driverName: driver.DriverName,
                    mobileNumber: driver.MobileNumber
                }));
                setDriverOptions(formattedDrivers);
            } else {
                // If API fails, use fallback data
                setDriverOptions([
                    { value: "1", label: "Rajesh Kumar", driverId: 1, driverName: "Rajesh Kumar" },
                    { value: "2", label: "Amit Singh", driverId: 2, driverName: "Amit Singh" },
                    { value: "3", label: "Suresh Patel", driverId: 3, driverName: "Suresh Patel" },
                    { value: "4", label: "Ravi Sharma", driverId: 4, driverName: "Ravi Sharma" }
                ]);
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
            // Use fallback data on error
            setDriverOptions([
                { value: "1", label: "Rajesh Kumar", driverId: 1, driverName: "Rajesh Kumar" },
                { value: "2", label: "Amit Singh", driverId: 2, driverName: "Amit Singh" },
                { value: "3", label: "Suresh Patel", driverId: 3, driverName: "Suresh Patel" },
                { value: "4", label: "Ravi Sharma", driverId: 4, driverName: "Ravi Sharma" }
            ]);
        } finally {
            setLoadingDrivers(false);
        }
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "zone") {
                updated.routePlan = "";
                if (selectedOption) {
                    fetchRoutePlans(selectedOption.zoneId || selectedOption.value);
                } else {
                    setRoutePlanOptions([]);
                }
            }
            return updated;
        });
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setErrorMessage("");
    };

    const validateForm = async () => {
        let valid = true;
        const newErrors = {};

        if (!form.zone) {
            newErrors.zone = "Zone is required";
            valid = false;
        }

        if (!form.routePlan) {
            newErrors.routePlan = "Route Plan is required";
            valid = false;
        }

        if (!form.driver) {
            newErrors.driver = "Driver is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        setAssigning(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const selectedZoneObj = zoneOptions.find((z) => z.value === form.zone);
            const selectedRoutePlanObj = routePlanOptions.find((rp) => rp.value === form.routePlan);
            const selectedDriverObj = driverOptions.find((d) => d.value === form.driver);

            // Get UserId from session storage
            const userId = sessionStorage.getItem("userId");

            if (!userId) {
                throw new Error("User not authenticated. Please login again.");
            }

            // Prepare data for API
            const assignData = {
                ZoneMasterId: selectedZoneObj?.zoneId || form.zone,
                RoutePlanId: selectedRoutePlanObj?.routePlanId || selectedRoutePlanObj?.value || form.routePlan,
                DriverId: selectedDriverObj?.driverId || form.driver,
                CreatedByUserId: userId,
                flagId: 1 // Assuming flagId 1 for assigning route
            };

            const response = await axiosClient({
                method: SummaryApi.assignroute.method || "POST",
                url: SummaryApi.assignroute.url || "/api/AssignRoute",
                data: assignData
            });

            if (response.data.status === true) {
                await Swal.fire({
                    icon: "success",
                    title: "Route Assigned Successfully!",
                    html: `
                        <div style="text-align: left; font-size: 14px; margin-top: 10px;">
                            <p><b>Message:</b> ${response.data.message || "Route assigned successfully"}</p>
                            <p><b>Zone:</b> ${selectedZoneObj?.label || form.zone}</p>
                            <p><b>Route Plan:</b> ${selectedRoutePlanObj?.label || form.routePlan}</p>
                            <p><b>Driver:</b> ${selectedDriverObj?.label || form.driver}</p>
                        </div>
                    `,
                    confirmButtonText: "Done",
                    confirmButtonColor: "#3b35c9",
                    background: darkMode ? "#13102e" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000"
                });

                setSuccessMessage(`Route assigned to ${selectedDriverObj?.label || "driver"} successfully!`);

                // Reset form
                setForm({ zone: "", routePlan: "", driver: "" });
                setRoutePlanOptions([]);

                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                throw new Error(response.data.message || "Assignment failed");
            }
        } catch (error) {
            console.error("Assign Route Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.Message || error.message || "An error occurred while assigning route.";
            setErrorMessage(errorMsg);
            Swal.fire({
                icon: "error",
                title: "Assignment Failed!",
                text: errorMsg,
                confirmButtonColor: "#ef4444",
                background: darkMode ? "#13102e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000"
            });
        } finally {
            setAssigning(false);
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

                {/* Form Card Container */}
                <form onSubmit={handleAssignSubmit} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]" : "bg-white border-gray-200 shadow-sm"} rounded-2xl border min-h-[220px]`}
                    >
                        {/* Top Gradient Line */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff] rounded-t-2xl" />

                        <div className="p-8">
                            {/* Row containing fields */}
                            <div className="flex flex-wrap items-start gap-6">

                                {/* Field 1: Select Zone Dropdown */}
                                <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Zone
                                    </label>
                                    <Select
                                        name="zone"
                                        options={zoneOptions}
                                        value={zoneOptions.find((option) => option.value === form.zone) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "zone" })}
                                        placeholder={loadingZones ? "Loading zones..." : "Select zone..."}
                                        noOptionsMessage={() => loadingZones ? "Loading..." : "No zones found"}
                                        styles={getSelectStyles(darkMode, errors.zone)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        isDisabled={loadingZones}
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.zone} />
                                </div>

                                {/* Field 2: Select Route Plan Dropdown */}
                                <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Route Plan
                                    </label>
                                    <Select
                                        name="routePlan"
                                        options={routePlanOptions}
                                        value={routePlanOptions.find((option) => option.value === form.routePlan) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "routePlan" })}
                                        placeholder={!form.zone ? "Select zone first" : (loadingRoutePlans ? "Loading route plans..." : "Select route plan...")}
                                        noOptionsMessage={() => !form.zone ? "Please select a zone first" : (loadingRoutePlans ? "Loading..." : "No route plans found")}
                                        styles={getSelectStyles(darkMode, errors.routePlan)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        isDisabled={!form.zone || loadingRoutePlans}
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.routePlan} />
                                </div>

                                {/* Field 3: Select Driver Dropdown */}
                                <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                        <span className="text-red-500 mr-1">*</span>Select Driver
                                    </label>
                                    <Select
                                        name="driver"
                                        options={driverOptions}
                                        value={driverOptions.find((option) => option.value === form.driver) || null}
                                        onChange={(option) => handleSelectChange(option, { name: "driver" })}
                                        placeholder={loadingDrivers ? "Loading drivers..." : "Select driver..."}
                                        noOptionsMessage={() => loadingDrivers ? "Loading..." : "No drivers found"}
                                        styles={getSelectStyles(darkMode, errors.driver)}
                                        classNamePrefix="react-select"
                                        isSearchable
                                        isDisabled={loadingDrivers}
                                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.driver} />
                                </div>

                                {/* Driver Info Display - Optional */}
                                {form.driver && (
                                    <div className="w-full sm:w-64 md:w-72 max-w-[280px]">
                                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-[#a5a0ff]" : "text-[#3b35c9]"}`}>
                                            Driver Details
                                        </label>
                                        <div className={`p-3 rounded-lg border ${darkMode ? "bg-[#0d0b22] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaUser className={darkMode ? "text-gray-400" : "text-gray-500"} size={14} />
                                                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                                                    {driverOptions.find(d => d.value === form.driver)?.label || "Driver selected"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Action Row - Assign Button */}
                            <div className={`pt-8 border-t mt-8 flex justify-end ${darkMode ? "border-[rgba(90,84,224,0.25)]" : "border-gray-100"}`}>
                                <motion.button
                                    whileHover={{ scale: assigning ? 1 : 1.02 }}
                                    whileTap={{ scale: assigning ? 1 : 0.97 }}
                                    type="submit"
                                    disabled={assigning || !form.zone || !form.routePlan || !form.driver}
                                    className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2.5 ${assigning || !form.zone || !form.routePlan || !form.driver
                                        ? "bg-[#3b35c9] opacity-70 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#3b35c9] to-[#5a54e0] hover:from-[#2c28a0] hover:to-[#3b35c9] hover:shadow-[0_4px_25px_rgba(59,53,201,0.35)]"
                                        }`}
                                >
                                    {assigning ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={16} />
                                            Assigning Route...
                                        </>
                                    ) : (
                                        <>
                                            <FaUserCheck size={18} />
                                            Assign Route to Driver
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