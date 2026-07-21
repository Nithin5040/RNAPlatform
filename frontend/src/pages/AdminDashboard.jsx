import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
// import {
//     ResponsiveContainer,
//     AreaChart,
//     Area,
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     Cell,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend
// } from "recharts";
import {
    FaTruck,
    FaUserPlus,
    FaMapMarkedAlt,
    FaFileUpload,
    FaCheckCircle,
    FaArrowUp,
    FaSearch,
    FaUsers,
    FaChartLine,
    FaChartPie,
    FaChartBar,
    FaExternalLinkAlt,
    FaFolderOpen,
    FaShieldAlt,
    FaSatellite,
    FaMapMarkerAlt,
    FaCompass,
    FaTachometerAlt,
    FaClock,
    FaGasPump
} from "react-icons/fa";

// KPI Summary Cards
const KPIS = [
    {
        title: "Active Drivers",
        value: "1,284",
        change: "+12.5%",
        isPositive: true,
        icon: FaTruck,
        color: "from-blue-600 to-indigo-600",
        shadow: "shadow-blue-500/20"
    },
    {
        title: "Active Route Points",
        value: "452",
        change: "+8.2%",
        isPositive: true,
        icon: FaMapMarkedAlt,
        color: "from-indigo-600 to-purple-600",
        shadow: "shadow-indigo-500/20"
    },
    {
        title: "Master Route Records",
        value: "18,940",
        change: "Synced",
        isPositive: true,
        icon: FaFileUpload,
        color: "from-emerald-600 to-teal-600",
        shadow: "shadow-emerald-500/20"
    },
    {
        title: "Document Compliance",
        value: "96.8%",
        change: "+3.1%",
        isPositive: true,
        icon: FaCheckCircle,
        color: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/20"
    },
    {
        title: "System Users",
        value: "96",
        change: "Active",
        isPositive: true,
        icon: FaUsers,
        color: "from-sky-600 to-blue-700",
        shadow: "shadow-sky-500/20"
    }
];

// Data 1: Line / Area Chart Data (Monthly Trend)
const MONTHLY_TREND_DATA = [
    { month: "Jan", masterUploads: 2400, activeRoutes: 1800, driverCreations: 1200 },
    { month: "Feb", masterUploads: 3100, activeRoutes: 2200, driverCreations: 1500 },
    { month: "Mar", masterUploads: 4200, activeRoutes: 2800, driverCreations: 1900 },
    { month: "Apr", masterUploads: 3800, activeRoutes: 2600, driverCreations: 1700 },
    { month: "May", masterUploads: 5100, activeRoutes: 3400, driverCreations: 2300 },
    { month: "Jun", masterUploads: 6400, activeRoutes: 4100, driverCreations: 2800 },
    { month: "Jul", masterUploads: 7800, activeRoutes: 4800, driverCreations: 3200 }
];

// Data 2: Bar Chart Data (Zone Performance Comparison)
const ZONE_BAR_DATA = [
    { zone: "Zone 1 (North)", drivers: 340, routePoints: 142, uploads: 5200 },
    { zone: "Zone 2 (South)", drivers: 290, routePoints: 118, uploads: 4100 },
    { zone: "Zone 3 (East)", drivers: 210, routePoints: 86, uploads: 3200 },
    { zone: "Zone 4 (West)", drivers: 180, routePoints: 64, uploads: 2800 },
    { zone: "Zone 5 (Central)", drivers: 140, routePoints: 42, uploads: 1900 }
];

// Data 3: Pie / Donut Chart Data (Driver Document Verification Status)
const PIE_COMPLIANCE_DATA = [
    { name: "Fully Verified Documents", value: 1082, color: "#10B981" },
    { name: "Pending Verification", value: 142, color: "#F59E0B" },
    { name: "Renewal / Expired Action", value: 60, color: "#EF4444" }
];

// Live Fleet Radar & Active Transit Corridor Data
const LIVE_FLEET_CORRIDORS = [
    {
        corridorId: "COR-N101",
        corridorName: "N-101 North Expressway",
        zone: "Zone 1 - North Zone",
        driverName: "Rajesh Kumar",
        truckNumber: "KA 01 AB 1234",
        status: "In-Transit",
        statusColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
        progress: 78,
        speed: "64 km/h",
        eta: "25 mins",
        lastPing: "Just now"
    },
    {
        corridorId: "COR-S201",
        corridorName: "S-201 Tech Park Depot",
        zone: "Zone 2 - South Zone",
        driverName: "Suresh Patil",
        truckNumber: "MH 12 CD 5678",
        status: "Arrived / Unloading",
        statusColor: "text-blue-400 bg-blue-950/40 border-blue-800/60",
        progress: 100,
        speed: "0 km/h",
        eta: "On Schedule",
        lastPing: "2 mins ago"
    },
    {
        corridorId: "COR-W401",
        corridorName: "W-401 Coastal Highway Route",
        zone: "Zone 4 - West Zone",
        driverName: "Venkatesh R",
        truckNumber: "TN 09 GH 3456",
        status: "In-Transit",
        statusColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
        progress: 42,
        speed: "58 km/h",
        eta: "1h 10m",
        lastPing: "Just now"
    },
    {
        corridorId: "COR-E301",
        corridorName: "E-301 Freight Corridor",
        zone: "Zone 3 - East Zone",
        driverName: "Amit Sharma",
        truckNumber: "DL 04 EF 9012",
        status: "Pre-Dispatch Check",
        statusColor: "text-amber-400 bg-amber-950/40 border-amber-800/60",
        progress: 15,
        speed: "12 km/h",
        eta: "Departs 11:30 AM",
        lastPing: "5 mins ago"
    }
];

// Mock Recent Driver Registrations
const RECENT_DRIVERS = [
    {
        id: "DRV-1001",
        name: "Rajesh Kumar",
        mobile: "9876543210",
        truckNumber: "KA 01 AB 1234",
        zone: "Zone 1 - North Zone",
        routePoint: "N-101 North Expressway",
        compliance: "Verified",
        date: "Today, 09:45 AM"
    },
    {
        id: "DRV-1002",
        name: "Suresh Patil",
        mobile: "9812345678",
        truckNumber: "MH 12 CD 5678",
        zone: "Zone 2 - South Zone",
        routePoint: "S-201 Tech Park Transit",
        compliance: "Verified",
        date: "Today, 09:15 AM"
    },
    {
        id: "DRV-1003",
        name: "Amit Sharma",
        mobile: "9765432109",
        truckNumber: "DL 04 EF 9012",
        zone: "Zone 3 - East Zone",
        routePoint: "E-301 Freight Line",
        compliance: "Pending",
        date: "Yesterday, 04:30 PM"
    },
    {
        id: "DRV-1004",
        name: "Venkatesh R",
        mobile: "9654321098",
        truckNumber: "TN 09 GH 3456",
        zone: "Zone 4 - West Zone",
        routePoint: "W-401 Coastal Highway",
        compliance: "Verified",
        date: "Yesterday, 02:10 PM"
    },
    {
        id: "DRV-1005",
        name: "Vikram Singh",
        mobile: "9543210987",
        truckNumber: "HR 26 JK 7890",
        zone: "Zone 5 - Central Zone",
        routePoint: "C-501 Metro Hub",
        compliance: "Verified",
        date: "20 Jul, 11:20 AM"
    }
];

export default function AdminDashboard() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("auth_user");
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (err) {
                console.error(err);
            }
        }
    }, []);

    // Filtered Drivers List
    const filteredDrivers = RECENT_DRIVERS.filter((driver) => {
        const matchesSearch =
            driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.mobile.includes(searchTerm);
        const matchesZone = selectedZoneFilter === "ALL" || driver.zone === selectedZoneFilter;
        return matchesSearch && matchesZone;
    });

    // Custom Tooltip Styling for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-xl shadow-xl border text-xs ${darkMode ? "bg-[#13102e] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                    <p className="font-bold mb-1.5 border-b pb-1 border-gray-700/30">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                            <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
                            <span className="font-bold">{entry.value.toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`min-h-full py-8 px-6 transition-colors duration-300 ${darkMode ? "bg-[#0d0b22] text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold flex items-center gap-2.5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Welcome back, {currentUser?.name || "Admin"} 👋
                        </h1>
                        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            RNS Transport Logistics Control Center & System Performance Overview
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 ${darkMode ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            }`}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Live Fleet Telemetry Active
                        </span>
                    </div>
                </div>

                {/* 1. Top KPI Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {KPIS.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-sm ${darkMode
                                    ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.3)]"
                                    : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                        {kpi.title}
                                    </span>
                                    <div className={`p-2.5 rounded-xl text-white bg-gradient-to-r ${kpi.color} ${kpi.shadow}`}>
                                        <Icon size={16} />
                                    </div>
                                </div>

                                <div className="flex items-baseline justify-between">
                                    <h2 className="text-2xl font-extrabold tracking-tight">
                                        {kpi.value}
                                    </h2>
                                    <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${kpi.isPositive
                                        ? darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                                        : "bg-red-500/20 text-red-400"
                                        }`}>
                                        <FaArrowUp size={9} />
                                        {kpi.change}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 3. NEW FEATURE: LIVE FLEET TRANSIT RADAR & CORRIDOR MONITOR */}
                <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.3)]" : "bg-white border-gray-200 shadow-sm"}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 border-gray-800/40">
                        <div>
                            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                <FaSatellite className="text-indigo-500 animate-spin" style={{ animationDuration: "12s" }} size={18} />
                                Live Fleet Transit Radar & Corridor Telemetry
                            </h3>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Real-time satellite tracking of active trucks, corridor speed, and route point progress
                            </p>
                        </div>

                        {/* Telemetry Mini Stats Badges */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-semibold ${darkMode ? "bg-[#0d0b22] border-gray-800 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-800"
                                }`}>
                                <FaTachometerAlt className="text-indigo-400" size={13} />
                                Avg Fleet Speed: <strong className="text-indigo-400 font-extrabold">58 km/h</strong>
                            </span>

                            <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-semibold ${darkMode ? "bg-[#0d0b22] border-gray-800 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-800"
                                }`}>
                                <FaGasPump className="text-emerald-400" size={13} />
                                Fuel Efficiency: <strong className="text-emerald-400 font-extrabold">94.1%</strong>
                            </span>
                        </div>
                    </div>

                    {/* Corridor Grid Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {LIVE_FLEET_CORRIDORS.map((corridor) => (
                            <motion.div
                                key={corridor.corridorId}
                                whileHover={{ scale: 1.02 }}
                                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${darkMode
                                    ? "bg-[#0d0b22] border-gray-800/80 hover:border-[#5a54e0]/60"
                                    : "bg-gray-50 border-gray-200 hover:border-[#3b35c9]/60 shadow-xs"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3b35c9] dark:text-[#a5a0ff] flex items-center gap-1.5">
                                        <FaMapMarkerAlt size={12} />
                                        {corridor.corridorId}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${corridor.statusColor}`}>
                                        {corridor.status}
                                    </span>
                                </div>

                                <h4 className="font-bold text-sm truncate mb-1">{corridor.corridorName}</h4>
                                <p className={`text-[11px] mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{corridor.zone}</p>

                                {/* Progress Bar */}
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between text-[11px] font-semibold">
                                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Journey Progress</span>
                                        <span className="font-bold text-indigo-400">{corridor.progress}%</span>
                                    </div>
                                    <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                                        <div className="h-full bg-gradient-to-r from-[#3b35c9] to-indigo-400 rounded-full" style={{ width: `${corridor.progress}%` }} />
                                    </div>
                                </div>

                                {/* Driver & Telemetry Footer */}
                                <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${darkMode ? "border-gray-800/80 text-gray-300" : "border-gray-200 text-gray-700"}`}>
                                    <div>
                                        <p className="font-bold truncate max-w-[120px]">{corridor.driverName}</p>
                                        <p className="font-mono text-[10px] text-gray-500">{corridor.truckNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-400">{corridor.eta}</p>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                                            <FaClock size={9} /> {corridor.lastPing}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. INTERACTIVE CHARTS SECTION 1: LINE CHART & DONUT PIE CHART */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Chart 1: Smooth Area Line Chart (Route Access & Driver Trends) */}
                    <div className={`lg:col-span-8 p-6 rounded-2xl border ${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)]" : "bg-white border-gray-200 shadow-sm"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <div>
                                <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    <FaChartLine className="text-[#3b35c9]" size={18} />
                                    Monthly Route Access & Delivery Trends
                                </h3>
                                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Comparative analysis of Master Route Uploads, Active Routes, and Driver Registrations
                                </p>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-lg border self-start sm:self-auto ${darkMode ? "bg-[#0d0b22] border-gray-800 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-700"}`}>
                                2026 YTD Growth
                            </span>
                        </div>

                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b35c9" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b35c9" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorRoutes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.08)" : "#F3F4F6"} />
                                    <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} tick={{ fontSize: 12 }} />
                                    <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                                    <Area type="monotone" dataKey="masterUploads" name="Master Uploads" stroke="#3b35c9" strokeWidth={3} fillOpacity={1} fill="url(#colorUploads)" />
                                    <Area type="monotone" dataKey="activeRoutes" name="Active Routes" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRoutes)" />
                                    <Area type="monotone" dataKey="driverCreations" name="New Drivers" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorDrivers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Interactive Donut / Pie Chart (Driver Document Verification) */}
                    <div className={`lg:col-span-4 p-6 rounded-2xl border ${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)]" : "bg-white border-gray-200 shadow-sm"}`}>
                        <div className="mb-4">
                            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                <FaChartPie className="text-emerald-500" size={18} />
                                Driver Compliance Breakdown
                            </h3>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Document verification status across 1,284 drivers
                            </p>
                        </div>

                        <div className="h-[240px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PIE_COMPLIANCE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PIE_COMPLIANCE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke={darkMode ? "#13102e" : "#ffffff"} strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Donut Badge */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold">96.8%</span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Verified</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="space-y-2 mt-2 pt-3 border-t border-gray-800/30">
                            {PIE_COMPLIANCE_DATA.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className={`font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* 5. INTERACTIVE CHARTS SECTION 2: BAR GRAPH FOR ZONE DISTRIBUTION */}
                <div className={`p-6 rounded-2xl border ${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)]" : "bg-white border-gray-200 shadow-sm"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <div>
                            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                <FaChartBar className="text-purple-500" size={18} />
                                Zone Performance & Fleet Volume Bar Graph
                            </h3>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Zone-wise active drivers, configured route points, and master route access uploads
                            </p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ZONE_BAR_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.08)" : "#F3F4F6"} />
                                <XAxis dataKey="zone" stroke={darkMode ? "#9CA3AF" : "#6B7280"} tick={{ fontSize: 12 }} />
                                <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
                                <Bar dataKey="drivers" name="Active Drivers" fill="#3b35c9" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="routePoints" name="Route Points" fill="#10B981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="uploads" name="Upload Volume" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 6. Recent Driver & Route Activity Table */}
                <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? "bg-[#13102e] border-[rgba(90,84,224,0.25)]" : "bg-white border-gray-200 shadow-sm"}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                <FaTruck className="text-[#3b35c9]" size={16} />
                                Recent Driver & Route Registrations
                            </h3>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Real-time log of onboarded drivers and assigned route points
                            </p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={13} />
                                <input
                                    type="text"
                                    placeholder="Search driver, truck..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? "bg-[#0d0b22] border-gray-800 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900"
                                        }`}
                                />
                            </div>

                            <select
                                value={selectedZoneFilter}
                                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                                className={`px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? "bg-[#0d0b22] border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"
                                    }`}
                            >
                                <option value="ALL">All Operating Zones</option>
                                <option value="Zone 1 - North Zone">Zone 1 - North Zone</option>
                                <option value="Zone 2 - South Zone">Zone 2 - South Zone</option>
                                <option value="Zone 3 - East Zone">Zone 3 - East Zone</option>
                                <option value="Zone 4 - West Zone">Zone 4 - West Zone</option>
                                <option value="Zone 5 - Central Zone">Zone 5 - Central Zone</option>
                            </select>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-gray-800/40">
                        <table className="w-full text-left text-xs">
                            <thead className={`${darkMode ? "bg-[#0d0b22] text-[#a5a0ff]" : "bg-gray-100 text-[#3b35c9]"} font-bold uppercase tracking-wider border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
                                <tr>
                                    <th className="py-3.5 px-4">Driver ID & Name</th>
                                    <th className="py-3.5 px-4">Mobile</th>
                                    <th className="py-3.5 px-4">Truck Number</th>
                                    <th className="py-3.5 px-4">Zone</th>
                                    <th className="py-3.5 px-4">Route Point</th>
                                    <th className="py-3.5 px-4">Documents</th>
                                    <th className="py-3.5 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? "divide-gray-800/60" : "divide-gray-100"}`}>
                                {filteredDrivers.length > 0 ? (
                                    filteredDrivers.map((driver) => (
                                        <tr key={driver.id} className={`transition-colors hover:${darkMode ? "bg-white/5" : "bg-gray-50/80"}`}>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-sm">{driver.name}</div>
                                                <div className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{driver.id}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-medium">{driver.mobile}</td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{driver.truckNumber}</td>
                                            <td className="py-3.5 px-4 font-medium">{driver.zone}</td>
                                            <td className="py-3.5 px-4 font-medium">{driver.routePoint}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${driver.compliance === "Verified"
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                    }`}>
                                                    <FaCheckCircle size={10} />
                                                    {driver.compliance}
                                                </span>
                                            </td>
                                            <td className={`py-3.5 px-4 text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {driver.date}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500">
                                            No drivers found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
