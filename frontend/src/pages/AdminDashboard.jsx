import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { FaTruck, FaMapMarkedAlt, FaFileUpload, FaCheckCircle } from "react-icons/fa";

const KPIS = [
    {
        title: "Active Drivers",
        value: "1,284",
        change: "+12.5%",
        icon: FaTruck,
        color: "#4f46e5",
    },
    {
        title: "Active Route Points",
        value: "452",
        change: "+8.2%",
        icon: FaMapMarkedAlt,
        color: "#7c3aed",
    },
    {
        title: "Master Route Records",
        value: "18,940",
        change: "Synced",
        icon: FaFileUpload,
        color: "#0d9488",
    },
    {
        title: "Document Compliance",
        value: "96.8%",
        change: "+3.1%",
        icon: FaCheckCircle,
        color: "#d97706",
    },
];

export default function AdminDashboard() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "32px 24px",
                background: darkMode ? "#0f0e1a" : "#f8f9fc",
                transition: "background 0.3s ease",
            }}
        >
            {/* Page Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: darkMode ? "#ffffff" : "#1a1a2e",
                        margin: 0,
                    }}
                >
                    Dashboard
                </h1>
                <p
                    style={{
                        fontSize: "14px",
                        color: darkMode ? "#a0a0b8" : "#6b7280",
                        marginTop: "4px",
                    }}
                >
                    Key metrics at a glance
                </p>
            </div>

            {/* KPI Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    maxWidth: "1200px",
                }}
            >
                {KPIS.map((kpi) => {
                    const Icon = kpi.icon;
                    const isPositive = kpi.change.startsWith("+");

                    return (
                        <div
                            key={kpi.title}
                            style={{
                                background: darkMode ? "#1a1a2e" : "#ffffff",
                                borderRadius: "12px",
                                padding: "20px 20px 18px",
                                boxShadow: darkMode
                                    ? "0 1px 3px rgba(0,0,0,0.3)"
                                    : "0 1px 3px rgba(0,0,0,0.06)",
                                border: darkMode ? "1px solid #2a2a42" : "1px solid #eaeef5",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = darkMode
                                    ? "0 4px 12px rgba(0,0,0,0.4)"
                                    : "0 4px 12px rgba(0,0,0,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = darkMode
                                    ? "0 1px 3px rgba(0,0,0,0.3)"
                                    : "0 1px 3px rgba(0,0,0,0.06)";
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    background: darkMode ? `${kpi.color}22` : `${kpi.color}11`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "14px",
                                }}
                            >
                                <Icon size={18} color={kpi.color} />
                            </div>

                            {/* Value */}
                            <div
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "700",
                                    color: darkMode ? "#ffffff" : "#1a1a2e",
                                    lineHeight: 1.2,
                                    marginBottom: "4px",
                                }}
                            >
                                {kpi.value}
                            </div>

                            {/* Title */}
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: darkMode ? "#8a8aa0" : "#6b7280",
                                    marginBottom: "8px",
                                }}
                            >
                                {kpi.title}
                            </div>

                            {/* Change badge */}
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: isPositive ? "#10b981" : "#6b7280",
                                    background: darkMode
                                        ? isPositive ? "#10b98122" : "#374151"
                                        : isPositive ? "#ecfdf5" : "#f3f4f6",
                                    padding: "2px 10px",
                                    borderRadius: "12px",
                                }}
                            >
                                {isPositive && "↑ "}
                                {kpi.change}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}