import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Route,
    Users,
    CheckCircle2,
    Zap,
    Download,
    Activity,
    BarChart3,
    PieChart as PieIcon,
    Check,
    TrendingUp,
    Award,
    ChevronRight,
    Package,
    Truck,
    Clock,
    X,
    AlertCircle,
    Circle,
    Eye,
    Navigation,
    Calendar,
    User,
    Phone,
    Mail,
    Map,
    Home
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

// 5 KPI Cards Data
const KPI_CARDS = [
    {
        id: "total-zones",
        title: "Total Zones",
        value: "6",
        subtext: "All Active Zones",
        trend: "+2 this quarter",
        icon: MapPin,
        badgeBg: "#475569",
        cardBgLight: "#f1f5f9",
        cardBgDark: "rgba(71, 85, 105, 0.25)",
        textColorLight: "#0f172a",
        textColorDark: "#cbd5e1"
    },
    {
        id: "total-routes",
        title: "Total Routes",
        value: "48",
        subtext: "Planned & Surveyed",
        trend: "+12.5% vs last mo",
        icon: Route,
        badgeBg: "#4f46e5",
        cardBgLight: "#eef2ff",
        cardBgDark: "rgba(79, 70, 229, 0.2)",
        textColorLight: "#1e1b4b",
        textColorDark: "#c7d2fe"
    },
    {
        id: "drivers-on-duty",
        title: "Drivers on Duty",
        value: "32",
        subtext: "Active Field Team",
        trend: "88% Attendance",
        icon: Users,
        cardBgLight: "#eef2ff",
        cardBgDark: "rgba(79, 70, 229, 0.2)",
        badgeBg: "#4f46e5",
        textColorLight: "#3730a3",
        textColorDark: "#c7d2fe"
    },
    {
        id: "completed-routes",
        title: "Completed Routes",
        value: "29",
        subtext: "Surveyed & Verified",
        trend: "60.4% Completed",
        icon: CheckCircle2,
        badgeBg: "#0284c7",
        cardBgLight: "#f0f9ff",
        cardBgDark: "rgba(2, 132, 199, 0.2)",
        textColorLight: "#075985",
        textColorDark: "#bae6fd"
    },
    {
        id: "total-substations",
        title: "Total Substations",
        value: "114",
        subtext: "Grid Substations",
        trend: "+4 Connected",
        icon: Zap,
        badgeBg: "#d97706",
        cardBgLight: "#fffbeb",
        cardBgDark: "rgba(217, 119, 6, 0.2)",
        textColorLight: "#78350f",
        textColorDark: "#fde68a"
    }
];

// Zone Progress Data
const ZONE_PROGRESS_DATA = [
    { zone: "Tumakuru", total: 20, completed: 17, remaining: 3, color: "#4f46e5" },
    { zone: "Mysuru", total: 25, completed: 18, remaining: 7, color: "#6366f1" },
    { zone: "Bengaluru", total: 30, completed: 27, remaining: 3, color: "#818cf8" },
    { zone: "Bagalkote", total: 20, completed: 12, remaining: 8, color: "#64748b" },
    { zone: "Kalaburagi", total: 20, completed: 9, remaining: 11, color: "#0284c7" },
    { zone: "Hassan", total: 18, completed: 14, remaining: 4, color: "#d97706" }
];

// Project Completion Data
const PROJECT_COMPLETION_DATA = [
    { name: "Completed Routes", value: 60.4, count: 29, color: "#4f46e5" },
    { name: "In Progress Routes", value: 27.1, count: 13, color: "#0284c7" },
    { name: "Pending Routes", value: 12.5, count: 6, color: "#d97706" }
];

// Zone Data with Route Details
const ZONE_LIST_DATA = [
    {
        id: "tumkur",
        name: "Tumkur",
        code: "TKR",
        color: "#4f46e5",
        totalRoutes: 20,
        routesInitiated: 18,
        routesInProgress: 5,
        routesCompleted: 13,
        packages: {
            total: 342,
            delivered: 287,
            inTransit: 42,
            pending: 13
        },
        routes: [
            { id: "R-001", name: "Tumkur City Center", status: "completed", packages: 24, delivered: 24 },
            { id: "R-002", name: "Tumkur Industrial Area", status: "in-progress", packages: 18, delivered: 12 },
            { id: "R-003", name: "Tumkur Rural", status: "initiated", packages: 15, delivered: 0 },
            { id: "R-004", name: "Tumkur East", status: "completed", packages: 22, delivered: 22 },
            { id: "R-005", name: "Tumkur West", status: "in-progress", packages: 20, delivered: 8 }
        ]
    },
    {
        id: "hassan",
        name: "Hassan",
        code: "HSN",
        color: "#d97706",
        totalRoutes: 18,
        routesInitiated: 16,
        routesInProgress: 4,
        routesCompleted: 12,
        packages: {
            total: 298,
            delivered: 245,
            inTransit: 38,
            pending: 15
        },
        routes: [
            { id: "R-006", name: "Hassan City", status: "completed", packages: 20, delivered: 20 },
            { id: "R-007", name: "Hassan Industrial", status: "in-progress", packages: 16, delivered: 10 },
            { id: "R-008", name: "Hassan Rural", status: "initiated", packages: 12, delivered: 0 }
        ]
    },
    {
        id: "bangalore",
        name: "Bangalore",
        code: "BLR",
        color: "#0284c7",
        totalRoutes: 30,
        routesInitiated: 29,
        routesInProgress: 6,
        routesCompleted: 23,
        packages: {
            total: 523,
            delivered: 478,
            inTransit: 32,
            pending: 13
        },
        routes: [
            { id: "R-009", name: "Bangalore North", status: "completed", packages: 28, delivered: 28 },
            { id: "R-010", name: "Bangalore South", status: "completed", packages: 32, delivered: 32 },
            { id: "R-011", name: "Bangalore East", status: "in-progress", packages: 24, delivered: 18 },
            { id: "R-012", name: "Bangalore West", status: "completed", packages: 30, delivered: 30 },
            { id: "R-013", name: "Bangalore Central", status: "in-progress", packages: 26, delivered: 20 }
        ]
    },
    {
        id: "bagalkote",
        name: "Bagalkote",
        code: "BGL",
        color: "#64748b",
        totalRoutes: 20,
        routesInitiated: 15,
        routesInProgress: 6,
        routesCompleted: 9,
        packages: {
            total: 285,
            delivered: 198,
            inTransit: 56,
            pending: 31
        },
        routes: [
            { id: "R-014", name: "Bagalkote City", status: "in-progress", packages: 18, delivered: 10 },
            { id: "R-015", name: "Bagalkote Rural", status: "initiated", packages: 14, delivered: 0 }
        ]
    },
    {
        id: "kalaburagi",
        name: "Kalaburagi",
        code: "KLB",
        color: "#10b981",
        totalRoutes: 20,
        routesInitiated: 12,
        routesInProgress: 4,
        routesCompleted: 8,
        packages: {
            total: 256,
            delivered: 167,
            inTransit: 45,
            pending: 44
        },
        routes: [
            { id: "R-016", name: "Kalaburagi City", status: "in-progress", packages: 16, delivered: 8 },
            { id: "R-017", name: "Kalaburagi Industrial", status: "initiated", packages: 10, delivered: 0 }
        ]
    },
    {
        id: "mysuru",
        name: "Mysuru",
        code: "MYS",
        color: "#8b5cf6",
        totalRoutes: 25,
        routesInitiated: 22,
        routesInProgress: 5,
        routesCompleted: 17,
        packages: {
            total: 412,
            delivered: 356,
            inTransit: 43,
            pending: 13
        },
        routes: [
            { id: "R-018", name: "Mysuru City", status: "completed", packages: 26, delivered: 26 },
            { id: "R-019", name: "Mysuru Industrial", status: "completed", packages: 22, delivered: 22 },
            { id: "R-020", name: "Mysuru Rural", status: "in-progress", packages: 18, delivered: 12 }
        ]
    }
];

// Route Milestones Data (for the third modal)
const ROUTE_MILESTONES = {
    "R-002": {
        routeName: "Tumkur Industrial Area",
        driver: "Amit Singh",
        vehicle: "KA-01-1234",
        date: "2026-07-22",
        stations: [
            { id: 1, name: "Station P - Main Depot", status: "completed", time: "06:30 AM", description: "Vehicle departed from depot" },
            { id: 2, name: "Station Q - Warehouse", status: "completed", time: "07:45 AM", description: "Goods loaded for delivery" },
            { id: 3, name: "Station R - Sector 16", status: "completed", time: "08:30 AM", description: "First delivery point reached" },
            { id: 4, name: "Station S - Sector 18", status: "in-progress", time: "09:15 AM", description: "Second delivery completed" },
            { id: 5, name: "Station T - Sector 20", status: "pending", time: "10:00 AM", description: "Final delivery completed" }
        ]
    },
    "R-005": {
        routeName: "Tumkur West",
        driver: "Priya Sharma",
        vehicle: "KA-01-5678",
        date: "2026-07-22",
        stations: [
            { id: 1, name: "Station P - Main Depot", status: "completed", time: "07:00 AM", description: "Vehicle departed from depot" },
            { id: 2, name: "Station Q - Warehouse", status: "completed", time: "08:15 AM", description: "Goods loaded for delivery" },
            { id: 3, name: "Station R - Sector 22", status: "completed", time: "09:00 AM", description: "First delivery point reached" },
            { id: 4, name: "Station S - Sector 24", status: "in-progress", time: "09:45 AM", description: "Second delivery in progress" },
            { id: 5, name: "Station T - Sector 26", status: "pending", time: "10:30 AM", description: "Final delivery pending" }
        ]
    },
    "R-007": {
        routeName: "Hassan Industrial",
        driver: "Rahul Reddy",
        vehicle: "KA-02-2345",
        date: "2026-07-22",
        stations: [
            { id: 1, name: "Station P - Main Depot", status: "completed", time: "06:45 AM", description: "Vehicle departed from depot" },
            { id: 2, name: "Station Q - Warehouse", status: "completed", time: "08:00 AM", description: "Goods loaded for delivery" },
            { id: 3, name: "Station R - Sector 12", status: "completed", time: "08:45 AM", description: "First delivery point reached" },
            { id: 4, name: "Station S - Sector 14", status: "in-progress", time: "09:30 AM", description: "Second delivery in progress" },
            { id: 5, name: "Station T - Sector 16", status: "pending", time: "10:15 AM", description: "Final delivery pending" }
        ]
    },
    "R-011": {
        routeName: "Bangalore East",
        driver: "Suresh Kumar",
        vehicle: "KA-03-3456",
        date: "2026-07-22",
        stations: [
            { id: 1, name: "Station P - Main Depot", status: "completed", time: "06:00 AM", description: "Vehicle departed from depot" },
            { id: 2, name: "Station Q - Warehouse", status: "completed", time: "07:15 AM", description: "Goods loaded for delivery" },
            { id: 3, name: "Station R - Sector 30", status: "completed", time: "08:00 AM", description: "First delivery point reached" },
            { id: 4, name: "Station S - Sector 32", status: "in-progress", time: "08:45 AM", description: "Second delivery in progress" },
            { id: 5, name: "Station T - Sector 34", status: "pending", time: "09:30 AM", description: "Final delivery pending" }
        ]
    },
    "R-013": {
        routeName: "Bangalore Central",
        driver: "Meera Nair",
        vehicle: "KA-03-4567",
        date: "2026-07-22",
        stations: [
            { id: 1, name: "Station P - Main Depot", status: "completed", time: "06:30 AM", description: "Vehicle departed from depot" },
            { id: 2, name: "Station Q - Warehouse", status: "completed", time: "07:30 AM", description: "Goods loaded for delivery" },
            { id: 3, name: "Station R - Sector 40", status: "completed", time: "08:15 AM", description: "First delivery point reached" },
            { id: 4, name: "Station S - Sector 42", status: "in-progress", time: "09:00 AM", description: "Second delivery in progress" },
            { id: 5, name: "Station T - Sector 44", status: "pending", time: "09:45 AM", description: "Final delivery pending" }
        ]
    }
};

// Custom Tooltip for Vertical Bar Chart
const CustomVerticalBarTooltip = ({ active, payload, isDark }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div
                style={{
                    background: isDark ? "#1e293b" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(15, 23, 42, 0.08)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: isDark ? "#f8fafc" : "#0f172a"
                }}
            >
                <p style={{ fontWeight: 700, fontSize: "14px", margin: "0 0 6px 0", color: isDark ? "#818cf8" : "#4f46e5" }}>
                    {data.zone} Zone
                </p>
                <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                        <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Total Stations:</span>
                        <span style={{ fontWeight: 700 }}>{data.total}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                        <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Completed:</span>
                        <span style={{ fontWeight: 700, color: "#4f46e5" }}>{data.completed}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                        <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Remaining:</span>
                        <span style={{ fontWeight: 700, color: "#d97706" }}>{data.remaining}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload, isDark }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div
                style={{
                    background: isDark ? "#1e293b" : "#ffffff",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    boxShadow: isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(15, 23, 42, 0.08)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: isDark ? "#f8fafc" : "#0f172a"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: data.color
                        }}
                    />
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{data.name}</span>
                </div>
                <div style={{ marginTop: "6px", fontSize: "13px" }}>
                    <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Share: </span>
                    <span style={{ fontWeight: 700 }}>{data.value}%</span>
                    <span style={{ margin: "0 6px", color: isDark ? "#94a3b8" : "#64748b" }}>•</span>
                    <span style={{ fontWeight: 700 }}>{data.count} Routes</span>
                </div>
            </div>
        );
    }
    return null;
};

// Zone List Component
function ZoneList({ darkMode, textColor, subTextColor, borderColor, containerBg, shadowStyle }) {
    const [selectedZone, setSelectedZone] = useState(null);
    const [showRoutesModal, setShowRoutesModal] = useState(false);
    const [showPackagesModal, setShowPackagesModal] = useState(false);
    const [showMilestonesModal, setShowMilestonesModal] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const handleZoneClick = (zone) => {
        setSelectedZone(zone);
        setShowRoutesModal(true);
    };

    const handleRouteClick = (route) => {
        setSelectedRoute(route);
        setShowPackagesModal(true);
    };

    const handleViewMilestones = (route) => {
        setSelectedRoute(route);
        const milestoneData = ROUTE_MILESTONES[route.id];
        if (milestoneData) {
            setSelectedMilestone(milestoneData);
            setShowPackagesModal(false);
            setTimeout(() => {
                setShowMilestonesModal(true);
            }, 300);
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#f59e0b';
            case 'initiated': return '#3b82f6';
            default: return '#94a3b8';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} color="#10b981" />;
            case 'in-progress': return <Clock size={14} color="#f59e0b" />;
            case 'initiated': return <AlertCircle size={14} color="#3b82f6" />;
            default: return <Circle size={14} color="#94a3b8" />;
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'initiated': return 'Initiated';
            default: return 'Pending';
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                    background: containerBg,
                    borderRadius: "16px",
                    padding: "24px",
                    border: `1px solid ${borderColor}`,
                    boxShadow: shadowStyle,
                    marginTop: "24px"
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: textColor,
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <MapPin size={22} color={darkMode ? "#818cf8" : "#4f46e5"} />
                            Zone List
                        </h2>
                        <p style={{ fontSize: "13px", color: subTextColor, margin: "3px 0 0 0" }}>
                            Click on any zone to view detailed route statistics
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: darkMode ? "#818cf8" : "#4f46e5",
                            background: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: darkMode ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid #c7d2fe"
                        }}
                    >
                        <Truck size={15} />
                        <span>{ZONE_LIST_DATA.length} Active Zones</span>
                    </div>
                </div>

                {/* Zone Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "16px"
                    }}
                >
                    {ZONE_LIST_DATA.map((zone) => (
                        <motion.div
                            key={zone.id}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleZoneClick(zone)}
                            style={{
                                background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                borderRadius: "14px",
                                padding: "20px",
                                border: `1px solid ${borderColor}`,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >
                            {/* Zone Color Indicator */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: zone.color
                                }}
                            />

                            {/* Zone Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "12px"
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: textColor,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        {zone.name}
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: "600",
                                                color: zone.color,
                                                background: darkMode ? `rgba(99, 102, 241, 0.15)` : "#eef2ff",
                                                padding: "2px 10px",
                                                borderRadius: "12px"
                                            }}
                                        >
                                            {zone.code}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, marginTop: "2px" }}>
                                        {zone.totalRoutes} Total Routes
                                    </div>
                                </div>
                                <ChevronRight size={20} color={subTextColor} />
                            </div>

                            {/* Route Statistics */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                    gap: "8px",
                                    marginTop: "8px"
                                }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#3b82f6" }}>
                                        {zone.routesInitiated}
                                    </div>
                                    <div style={{ fontSize: "10px", color: subTextColor, fontWeight: "500" }}>
                                        Initiated
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#f59e0b" }}>
                                        {zone.routesInProgress}
                                    </div>
                                    <div style={{ fontSize: "10px", color: subTextColor, fontWeight: "500" }}>
                                        In Progress
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#10b981" }}>
                                        {zone.routesCompleted}
                                    </div>
                                    <div style={{ fontSize: "10px", color: subTextColor, fontWeight: "500" }}>
                                        Completed
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "700", color: zone.color }}>
                                        {Math.round((zone.routesCompleted / zone.totalRoutes) * 100)}%
                                    </div>
                                    <div style={{ fontSize: "10px", color: subTextColor, fontWeight: "500" }}>
                                        Completion
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* MODAL 1: Zone Route Statistics */}
            <AnimatePresence>
                {showRoutesModal && selectedZone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                            padding: "20px"
                        }}
                        onClick={() => setShowRoutesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: containerBg,
                                borderRadius: "20px",
                                padding: "32px",
                                maxWidth: "900px",
                                width: "100%",
                                maxHeight: "80vh",
                                overflow: "auto",
                                border: `1px solid ${borderColor}`,
                                boxShadow: darkMode ? "0 25px 50px rgba(0,0,0,0.8)" : "0 25px 50px rgba(0,0,0,0.15)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "24px"
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "12px",
                                                background: selectedZone.color,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <MapPin size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: "20px", fontWeight: "700", color: textColor, margin: 0 }}>
                                                {selectedZone.name} Zone
                                            </h2>
                                            <p style={{ fontSize: "13px", color: subTextColor, margin: "2px 0 0 0" }}>
                                                {selectedZone.totalRoutes} Routes • {selectedZone.code} Code
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowRoutesModal(false)}
                                    style={{
                                        background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: textColor
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Route Statistics Summary */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                    gap: "12px",
                                    marginBottom: "24px"
                                }}
                            >
                                <div
                                    style={{
                                        background: darkMode ? "rgba(59, 130, 246, 0.1)" : "#eff6ff",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid #bfdbfe"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#3b82f6" }}>
                                        {selectedZone.routesInitiated}
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Routes Initiated
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid #fcd34d",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                    onClick={() => {
                                        setShowRoutesModal(false);
                                        setTimeout(() => {
                                            const inProgressRoute = selectedZone.routes.find(r => r.status === 'in-progress');
                                            if (inProgressRoute) {
                                                setSelectedRoute(inProgressRoute);
                                                setShowPackagesModal(true);
                                            }
                                        }, 300);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.03)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b" }}>
                                        {selectedZone.routesInProgress}
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Routes In Progress <ChevronRight size={14} style={{ display: "inline", marginLeft: "4px" }} />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#d1fae5",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #6ee7b7"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#10b981" }}>
                                        {selectedZone.routesCompleted}
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Routes Completed
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: darkMode ? "rgba(99, 102, 241, 0.1)" : "#eef2ff",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid #c7d2fe"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}>
                                        {Math.round((selectedZone.routesCompleted / selectedZone.totalRoutes) * 100)}%
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Completion Rate
                                    </div>
                                </div>
                            </div>

                            {/* Routes List */}
                            <div>
                                <h3 style={{ fontSize: "14px", fontWeight: "600", color: textColor, marginBottom: "12px" }}>
                                    Route Details
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {selectedZone.routes.map((route) => (
                                        <div
                                            key={route.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "12px 16px",
                                                borderRadius: "10px",
                                                background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                                border: `1px solid ${borderColor}`,
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                            onClick={() => handleRouteClick(route)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = selectedZone.color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = borderColor;
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {getStatusIcon(route.status)}
                                                <div>
                                                    <div style={{ fontSize: "14px", fontWeight: "600", color: textColor }}>
                                                        {route.name}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: subTextColor }}>
                                                        {route.packages} Packages • {route.delivered} Delivered
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        color: getStatusColor(route.status),
                                                        background: darkMode ? `rgba(99, 102, 241, 0.1)` : "#eef2ff",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px"
                                                    }}
                                                >
                                                    {getStatusText(route.status)}
                                                </span>
                                                <ChevronRight size={16} color={subTextColor} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL 2: Package Delivery Details */}
            <AnimatePresence>
                {showPackagesModal && selectedRoute && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2000,
                            padding: "20px"
                        }}
                        onClick={() => setShowPackagesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: containerBg,
                                borderRadius: "20px",
                                padding: "32px",
                                maxWidth: "1100px",
                                width: "100%",
                                maxHeight: "85vh",
                                overflow: "auto",
                                border: `1px solid ${borderColor}`,
                                boxShadow: darkMode ? "0 25px 50px rgba(0,0,0,0.8)" : "0 25px 50px rgba(0,0,0,0.15)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "20px"
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "12px",
                                                background: selectedZone?.color || "#4f46e5",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Package size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: "20px", fontWeight: "700", color: textColor, margin: 0 }}>
                                                {selectedRoute.name}
                                            </h2>
                                            <p style={{ fontSize: "13px", color: subTextColor, margin: "2px 0 0 0" }}>
                                                {selectedZone?.name} Zone • {selectedRoute.packages} Total Packages
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPackagesModal(false)}
                                    style={{
                                        background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: textColor
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Delivery Statistics */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                    gap: "12px",
                                    marginBottom: "24px"
                                }}
                            >
                                <div
                                    style={{
                                        background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#d1fae5",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #6ee7b7"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#10b981" }}>
                                        {selectedRoute.delivered}
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Packages Delivered
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid #fcd34d"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b" }}>
                                        {selectedRoute.packages - selectedRoute.delivered}
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Packages Remaining
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: darkMode ? "rgba(99, 102, 241, 0.1)" : "#eef2ff",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: darkMode ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid #c7d2fe"
                                    }}
                                >
                                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}>
                                        {Math.round((selectedRoute.delivered / selectedRoute.packages) * 100)}%
                                    </div>
                                    <div style={{ fontSize: "12px", color: subTextColor, fontWeight: "600" }}>
                                        Delivery Rate
                                    </div>
                                </div>
                            </div>

                            {/* Package List Table with View Button */}
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "12px"
                                    }}
                                >
                                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: textColor }}>
                                        Package Delivery Details
                                    </h3>
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            color: darkMode ? "#818cf8" : "#4f46e5",
                                            background: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                                            padding: "4px 14px",
                                            borderRadius: "20px",
                                            border: darkMode ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid #c7d2fe"
                                        }}
                                    >
                                        {selectedRoute.packages} Packages
                                    </div>
                                </div>

                                <div
                                    style={{
                                        overflowX: "auto",
                                        borderRadius: "12px",
                                        border: `1px solid ${borderColor}`
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                                    borderBottom: `1px solid ${borderColor}`
                                                }}
                                            >
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Package ID
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Customer
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Address
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Status
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Time
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "left", color: subTextColor, fontWeight: "600" }}>
                                                    Weight
                                                </th>
                                                <th style={{ padding: "12px 16px", textAlign: "center", color: subTextColor, fontWeight: "600" }}>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: selectedRoute.packages }, (_, i) => ({
                                                id: `PKG-${String(i + 1).padStart(3, '0')}`,
                                                customer: `Customer ${i + 1}`,
                                                address: `Sector ${i + 10}, ${selectedZone?.name || 'City'}`,
                                                status: i < selectedRoute.delivered ? 'Delivered' : i < selectedRoute.delivered + 3 ? 'In Transit' : 'Pending',
                                                time: i < selectedRoute.delivered ? `${8 + Math.floor(i / 3)}:${(i % 3) * 15 + 30} AM` : '--',
                                                weight: `${(1.5 + Math.random() * 3).toFixed(1)} kg`,
                                                phone: `+91 98765 ${43210 + i}`
                                            })).map((pkg, index) => (
                                                <tr
                                                    key={pkg.id}
                                                    style={{
                                                        borderBottom: index === selectedRoute.packages - 1 ? "none" : `1px solid ${borderColor}`,
                                                        transition: "background 0.2s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = "transparent";
                                                    }}
                                                >
                                                    <td style={{ padding: "12px 16px", fontWeight: "600", color: textColor }}>
                                                        {pkg.id}
                                                    </td>
                                                    <td style={{ padding: "12px 16px", color: textColor }}>
                                                        {pkg.customer}
                                                    </td>
                                                    <td style={{ padding: "12px 16px", color: subTextColor }}>
                                                        {pkg.address}
                                                    </td>
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <span
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "4px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "11px",
                                                                fontWeight: "600",
                                                                background: pkg.status === "Delivered"
                                                                    ? (darkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5")
                                                                    : pkg.status === "In Transit"
                                                                        ? (darkMode ? "rgba(245, 158, 11, 0.2)" : "#fef3c7")
                                                                        : (darkMode ? "rgba(148, 163, 184, 0.2)" : "#f1f5f9"),
                                                                color: pkg.status === "Delivered"
                                                                    ? "#10b981"
                                                                    : pkg.status === "In Transit"
                                                                        ? "#f59e0b"
                                                                        : "#94a3b8"
                                                            }}
                                                        >
                                                            {pkg.status === "Delivered" && <CheckCircle2 size={12} />}
                                                            {pkg.status === "In Transit" && <Truck size={12} />}
                                                            {pkg.status === "Pending" && <Clock size={12} />}
                                                            {pkg.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "12px 16px", color: subTextColor }}>
                                                        {pkg.time}
                                                    </td>
                                                    <td style={{ padding: "12px 16px", color: subTextColor }}>
                                                        {pkg.weight}
                                                    </td>
                                                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                        <button
                                                            onClick={() => handleViewMilestones(selectedRoute)}
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "6px 14px",
                                                                borderRadius: "8px",
                                                                background: darkMode ? "#4f46e5" : "#4f46e5",
                                                                border: "none",
                                                                color: "#ffffff",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s ease"
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = darkMode ? "#6366f1" : "#6366f1";
                                                                e.currentTarget.style.transform = "scale(1.05)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = darkMode ? "#4f46e5" : "#4f46e5";
                                                                e.currentTarget.style.transform = "scale(1)";
                                                            }}
                                                        >
                                                            <Eye size={14} />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL 3: Route Milestones */}
            <AnimatePresence>
                {showMilestonesModal && selectedMilestone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 3000,
                            padding: "20px"
                        }}
                        onClick={() => setShowMilestonesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: containerBg,
                                borderRadius: "20px",
                                padding: "32px",
                                maxWidth: "800px",
                                width: "100%",
                                maxHeight: "85vh",
                                overflow: "auto",
                                border: `1px solid ${borderColor}`,
                                boxShadow: darkMode ? "0 25px 50px rgba(0,0,0,0.8)" : "0 25px 50px rgba(0,0,0,0.15)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "20px"
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "12px",
                                                background: selectedZone?.color || "#4f46e5",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Navigation size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: "20px", fontWeight: "700", color: textColor, margin: 0 }}>
                                                {selectedMilestone.routeName}
                                            </h2>
                                            <p style={{ fontSize: "13px", color: subTextColor, margin: "2px 0 0 0" }}>
                                                {selectedZone?.name} Zone • Route Milestones
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowMilestonesModal(false);
                                        setTimeout(() => setShowPackagesModal(true), 300);
                                    }}
                                    style={{
                                        background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: textColor
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Route Info */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                    gap: "12px",
                                    marginBottom: "24px",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                    border: `1px solid ${borderColor}`
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Driver
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: textColor, display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                        <User size={14} color={subTextColor} />
                                        {selectedMilestone.driver}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Vehicle
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: textColor, display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                        <Truck size={14} color={subTextColor} />
                                        {selectedMilestone.vehicle}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Date
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: textColor, display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                        <Calendar size={14} color={subTextColor} />
                                        {selectedMilestone.date}
                                    </div>
                                </div>
                            </div>

                            {/* Milestones Timeline */}
                            <div>
                                <h3 style={{ fontSize: "14px", fontWeight: "600", color: textColor, marginBottom: "16px" }}>
                                    Station-wise Progress
                                </h3>
                                <div style={{ position: "relative" }}>
                                    {/* Vertical Timeline Line */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: "20px",
                                            top: "20px",
                                            bottom: "20px",
                                            width: "3px",
                                            background: darkMode ? "#334155" : "#e2e8f0",
                                            borderRadius: "2px"
                                        }}
                                    />

                                    {selectedMilestone.stations.map((station, index) => (
                                        <div
                                            key={station.id}
                                            style={{
                                                display: "flex",
                                                gap: "20px",
                                                marginBottom: index === selectedMilestone.stations.length - 1 ? "0" : "16px",
                                                position: "relative"
                                            }}
                                        >
                                            {/* Status Dot */}
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: station.status === "completed"
                                                        ? (darkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5")
                                                        : station.status === "in-progress"
                                                            ? (darkMode ? "rgba(245, 158, 11, 0.2)" : "#fef3c7")
                                                            : (darkMode ? "rgba(148, 163, 184, 0.2)" : "#f1f5f9"),
                                                    border: `2px solid ${station.status === "completed"
                                                        ? "#10b981"
                                                        : station.status === "in-progress"
                                                            ? "#f59e0b"
                                                            : "#94a3b8"
                                                        }`,
                                                    flexShrink: 0,
                                                    zIndex: 1
                                                }}
                                            >
                                                {station.status === "completed" && <CheckCircle2 size={20} color="#10b981" />}
                                                {station.status === "in-progress" && <Clock size={20} color="#f59e0b" />}
                                                {station.status === "pending" && <Circle size={20} color="#94a3b8" />}
                                            </div>

                                            {/* Station Details */}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    background: station.status === "completed"
                                                        ? (darkMode ? "rgba(16, 185, 129, 0.05)" : "#f0fdf4")
                                                        : station.status === "in-progress"
                                                            ? (darkMode ? "rgba(245, 158, 11, 0.05)" : "#fffbeb")
                                                            : (darkMode ? "rgba(255,255,255,0.02)" : "#fafafa"),
                                                    border: `1px solid ${station.status === "completed"
                                                        ? (darkMode ? "rgba(16, 185, 129, 0.3)" : "#bbf7d0")
                                                        : station.status === "in-progress"
                                                            ? (darkMode ? "rgba(245, 158, 11, 0.3)" : "#fde68a")
                                                            : borderColor
                                                        }`
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start",
                                                        flexWrap: "wrap",
                                                        gap: "8px"
                                                    }}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: textColor,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                        >
                                                            <MapPin size={16} color={station.status === "completed" ? "#10b981" : station.status === "in-progress" ? "#f59e0b" : "#94a3b8"} />
                                                            {station.name}
                                                            <span
                                                                style={{
                                                                    fontSize: "11px",
                                                                    fontWeight: "500",
                                                                    color: station.status === "completed"
                                                                        ? "#10b981"
                                                                        : station.status === "in-progress"
                                                                            ? "#f59e0b"
                                                                            : "#94a3b8",
                                                                    background: station.status === "completed"
                                                                        ? (darkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5")
                                                                        : station.status === "in-progress"
                                                                            ? (darkMode ? "rgba(245, 158, 11, 0.2)" : "#fef3c7")
                                                                            : (darkMode ? "rgba(148, 163, 184, 0.2)" : "#f1f5f9"),
                                                                    padding: "2px 10px",
                                                                    borderRadius: "12px",
                                                                    textTransform: "capitalize"
                                                                }}
                                                            >
                                                                {station.status === "completed" ? "✓ Completed" : station.status === "in-progress" ? "⏳ In Progress" : "⏱ Pending"}
                                                            </span>
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "12px",
                                                                color: subTextColor,
                                                                marginTop: "4px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "6px"
                                                            }}
                                                        >
                                                            <Clock size={12} color={subTextColor} />
                                                            {station.time}
                                                            <span style={{ margin: "0 4px", color: borderColor }}>|</span>
                                                            <span>{station.description}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            color: station.status === "completed" ? "#10b981" : station.status === "in-progress" ? "#f59e0b" : "#94a3b8",
                                                            background: darkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
                                                            padding: "4px 12px",
                                                            borderRadius: "20px",
                                                            border: `1px solid ${station.status === "completed"
                                                                ? (darkMode ? "rgba(16, 185, 129, 0.3)" : "#bbf7d0")
                                                                : station.status === "in-progress"
                                                                    ? (darkMode ? "rgba(245, 158, 11, 0.3)" : "#fde68a")
                                                                    : borderColor
                                                                }`
                                                        }}
                                                    >
                                                        Station {station.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                    gap: "12px",
                                    marginTop: "24px",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                    border: `1px solid ${borderColor}`
                                }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>
                                        {selectedMilestone.stations.filter(s => s.status === "completed").length}
                                    </div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Completed
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#f59e0b" }}>
                                        {selectedMilestone.stations.filter(s => s.status === "in-progress").length}
                                    </div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        In Progress
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#94a3b8" }}>
                                        {selectedMilestone.stations.filter(s => s.status === "pending").length}
                                    </div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Pending
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#4f46e5" }}>
                                        {Math.round((selectedMilestone.stations.filter(s => s.status === "completed").length / selectedMilestone.stations.length) * 100)}%
                                    </div>
                                    <div style={{ fontSize: "11px", color: subTextColor, fontWeight: "500" }}>
                                        Completion Rate
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Main Dashboard Component
export default function AdminDashboard() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    // Titanium Gray & Royal Indigo Tokens
    const containerBg = darkMode ? "#1e293b" : "#ffffff";
    const pageBg = darkMode ? "#0f172a" : "#f1f5f9";
    const textColor = darkMode ? "#f8fafc" : "#0f172a";
    const subTextColor = darkMode ? "#94a3b8" : "#64748b";
    const borderColor = darkMode ? "#334155" : "#e2e8f0";
    const shadowStyle = darkMode
        ? "0 10px 25px rgba(0, 0, 0, 0.3)"
        : "0 4px 12px rgba(15, 23, 42, 0.04)";

    const [exported, setExported] = useState(false);

    const handleExport = () => {
        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    // Custom Legend for Vertical Bar Chart
    const renderLegend = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "14px", height: "14px", backgroundColor: darkMode ? "#6366f1" : "#4f46e5", borderRadius: "3px" }} />
                    <span style={{ fontSize: "12px", color: textColor, fontWeight: "600" }}>Completed Stations</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "14px", height: "14px", backgroundColor: darkMode ? "#334155" : "#e2e8f0", borderRadius: "3px" }} />
                    <span style={{ fontSize: "12px", color: textColor, fontWeight: "600" }}>Remaining Stations</span>
                </div>
            </div>
        );
    };

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                padding: "24px 24px 40px 24px",
                background: pageBg,
                transition: "all 0.3s ease"
            }}
        >
            {/* PAGE HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                    gap: "16px"
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: textColor,
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <Activity size={26} color={darkMode ? "#818cf8" : "#4f46e5"} />
                        Admin Dashboard
                    </h1>
                    <p style={{ fontSize: "14px", color: subTextColor, marginTop: "4px", marginBottom: 0 }}>
                        Operational metrics summary, project completion status & zone progress
                    </p>
                </div>

                {/* Live Platform Metrics Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        border: darkMode ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid #c7d2fe",
                        boxShadow: shadowStyle
                    }}
                >
                    <div
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: darkMode ? "#818cf8" : "#4f46e5",
                            boxShadow: darkMode ? "0 0 8px #818cf8" : "0 0 8px #4f46e5"
                        }}
                    />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: darkMode ? "#818cf8" : "#4f46e5" }}>
                        Live Platform Metrics
                    </span>
                </div>
            </div>

            {/* TOP ROW: TWO CARDS SIDE-BY-SIDE */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
                {/* LEFT CONTAINER: OPERATIONAL SUMMARY (5 KPI CARDS) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        flex: "1 1 500px",
                        background: containerBg,
                        borderRadius: "16px",
                        padding: "24px",
                        border: `1px solid ${borderColor}`,
                        boxShadow: shadowStyle
                    }}
                >
                    {/* Card Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: textColor,
                                    margin: 0
                                }}
                            >
                                Operational Summary
                            </h2>
                            <p style={{ fontSize: "13px", color: subTextColor, margin: "3px 0 0 0" }}>
                                Real-time operational key metrics at a glance
                            </p>
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "10px",
                                background: darkMode
                                    ? "#6366f1"
                                    : "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                                border: "none",
                                color: "#ffffff",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                boxShadow: darkMode
                                    ? "0 2px 8px rgba(99, 102, 241, 0.3)"
                                    : "0 2px 8px rgba(79, 70, 229, 0.25)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {exported ? (
                                <>
                                    <Check size={15} color="#ffffff" />
                                    <span>Exported</span>
                                </>
                            ) : (
                                <>
                                    <Download size={15} color="#ffffff" />
                                    <span>Export</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* 5 KPI Cards in Single Line */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                            gap: "12px"
                        }}
                    >
                        {KPI_CARDS.map((kpi, idx) => {
                            const Icon = kpi.icon;
                            const currentBg = darkMode ? kpi.cardBgDark : kpi.cardBgLight;

                            return (
                                <motion.div
                                    key={kpi.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    style={{
                                        background: currentBg,
                                        borderRadius: "14px",
                                        padding: "14px 12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.02)"
                                    }}
                                >
                                    {/* Icon Badge */}
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: kpi.badgeBg,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: `0 3px 8px ${kpi.badgeBg}44`,
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <Icon size={16} color="#ffffff" />
                                    </div>

                                    {/* Value */}
                                    <div
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "800",
                                            color: textColor,
                                            lineHeight: 1,
                                            marginBottom: "4px",
                                            letterSpacing: "-0.5px"
                                        }}
                                    >
                                        {kpi.value}
                                    </div>

                                    {/* Title */}
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: textColor,
                                            marginBottom: "2px"
                                        }}
                                    >
                                        {kpi.title}
                                    </div>

                                    {/* Trend */}
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            color: darkMode ? kpi.textColorDark : kpi.textColorLight,
                                            opacity: 0.9
                                        }}
                                    >
                                        {kpi.trend}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* RIGHT CONTAINER: PROJECT COMPLETION PIE CHART */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                        flex: "1 1 400px",
                        background: containerBg,
                        borderRadius: "16px",
                        padding: "24px",
                        border: `1px solid ${borderColor}`,
                        boxShadow: shadowStyle
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px"
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: textColor,
                                    margin: 0
                                }}
                            >
                                Project Completion
                            </h2>
                            <p style={{ fontSize: "13px", color: subTextColor, margin: "3px 0 0 0" }}>
                                Distribution across 48 routes
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: darkMode ? "#818cf8" : "#4f46e5",
                                background: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                                padding: "4px 12px",
                                borderRadius: "14px",
                                border: darkMode ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid #c7d2fe"
                            }}
                        >
                            <PieIcon size={14} />
                            <span>Completion</span>
                        </div>
                    </div>

                    {/* Donut Chart with Legend on Left */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            marginTop: "12px"
                        }}
                    >
                        {/* Legend on Left */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                flex: 1
                            }}
                        >
                            {PROJECT_COMPLETION_DATA.map((item) => (
                                <div
                                    key={item.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "8px 12px",
                                        borderRadius: "10px",
                                        background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                        border: `1px solid ${borderColor}`
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div
                                            style={{
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                                backgroundColor: item.color
                                            }}
                                        />
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: textColor }}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "12px", color: subTextColor }}>
                                            {item.count} routes
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: item.color
                                            }}
                                        >
                                            {item.value}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Donut Chart on Right */}
                        <div
                            style={{
                                position: "relative",
                                width: "180px",
                                height: "180px",
                                flexShrink: 0
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PROJECT_COMPLETION_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {PROJECT_COMPLETION_DATA.map((entry, index) => (
                                            <Cell key={`pie-cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomPieTooltip isDark={darkMode} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Central Donut Overlay Text */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    textAlign: "center",
                                    pointerEvents: "none"
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "800",
                                        color: textColor,
                                        lineHeight: 1
                                    }}
                                >
                                    60.4%
                                </div>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        color: subTextColor,
                                        marginTop: "2px"
                                    }}
                                >
                                    Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* BOTTOM ROW: ZONE WISE PROGRESS - VERTICAL BAR CHART */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                    background: containerBg,
                    borderRadius: "16px",
                    padding: "24px",
                    border: `1px solid ${borderColor}`,
                    boxShadow: shadowStyle,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: textColor,
                                margin: 0
                            }}
                        >
                            Zone Wise Progress
                        </h2>
                        <p style={{ fontSize: "13px", color: subTextColor, margin: "3px 0 0 0" }}>
                            Vertical bar chart showing completed & remaining stations across Tumakuru, Mysuru, Bengaluru, Bagalkote, Kalaburagi & Hassan
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: darkMode ? "#818cf8" : "#4f46e5",
                            background: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: darkMode ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid #c7d2fe"
                        }}
                    >
                        <BarChart3 size={15} />
                        <span>6 Operational Zones</span>
                    </div>
                </div>

                {/* Vertical Bar Chart */}
                <div style={{ width: "100%", height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={ZONE_PROGRESS_DATA}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                            <XAxis
                                dataKey="zone"
                                stroke={subTextColor}
                                tick={{ fill: textColor, fontSize: 13, fontWeight: 600 }}
                                axisLine={{ stroke: borderColor }}
                            />
                            <YAxis
                                stroke={subTextColor}
                                tick={{ fill: subTextColor, fontSize: 12 }}
                                axisLine={{ stroke: borderColor }}
                                label={{
                                    value: "Number of Stations",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fill: subTextColor, fontSize: 12, fontWeight: 500 }
                                }}
                            />
                            <RechartsTooltip content={<CustomVerticalBarTooltip isDark={darkMode} />} />
                            <Legend
                                content={renderLegend}
                                verticalAlign="top"
                                height={36}
                            />
                            <Bar
                                dataKey="completed"
                                name="Completed"
                                fill={darkMode ? "#6366f1" : "#4f46e5"}
                                radius={[4, 4, 0, 0]}
                                barSize={36}
                            />
                            <Bar
                                dataKey="remaining"
                                name="Remaining"
                                fill={darkMode ? "#334155" : "#e2e8f0"}
                                radius={[4, 4, 0, 0]}
                                barSize={36}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Highlights Footer */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: `1px solid ${borderColor}`
                    }}
                >
                    <div
                        style={{
                            background: darkMode ? "rgba(255,255,255,0.02)" : "#f8fafc",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: `1px solid ${borderColor}`
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "11px", color: subTextColor }}>Highest Completion</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#6366f1", marginTop: "2px" }}>
                                Bengaluru (90%)
                            </div>
                        </div>
                        <Award size={20} color="#4f46e5" />
                    </div>

                    <div
                        style={{
                            background: darkMode ? "rgba(255,255,255,0.02)" : "#f8fafc",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: `1px solid ${borderColor}`
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "11px", color: subTextColor }}>Average Completion</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: textColor, marginTop: "2px" }}>
                                71.6%
                            </div>
                        </div>
                        <TrendingUp size={20} color={darkMode ? "#818cf8" : "#4f46e5"} />
                    </div>

                    <div
                        style={{
                            background: darkMode ? "rgba(255,255,255,0.02)" : "#f8fafc",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: `1px solid ${borderColor}`
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "11px", color: subTextColor }}>Total Stations Completed</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: darkMode ? "#818cf8" : "#4f46e5", marginTop: "2px" }}>
                                97 / 133 Stations
                            </div>
                        </div>
                        <CheckCircle2 size={20} color={darkMode ? "#818cf8" : "#4f46e5"} />
                    </div>
                </div>
            </motion.div>

            {/* ZONE LIST COMPONENT */}
            <ZoneList
                darkMode={darkMode}
                textColor={textColor}
                subTextColor={subTextColor}
                borderColor={borderColor}
                containerBg={containerBg}
                shadowStyle={shadowStyle}
            />
        </div>
    );
}