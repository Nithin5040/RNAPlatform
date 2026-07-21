import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FaTruck, FaMapMarkedAlt, FaFileUpload, FaCheckCircle } from "react-icons/fa";

const KPIS = [
    {
        title: "Active Drivers",
        value: "1,284",
        change: "+12.5%",
        isPositive: true,
        icon: FaTruck,
        gradientDark: "linear-gradient(135deg, #3b35c9 0%, #1e1b7a 100%)",
        gradientLight: "linear-gradient(135deg, #3b35c9 0%, #5a54e0 100%)",
        glowDark: "rgba(59, 53, 201, 0.35)",
        glowLight: "rgba(59, 53, 201, 0.2)",
        iconBg: "rgba(255,255,255,0.12)",
    },
    {
        title: "Active Route Points",
        value: "452",
        change: "+8.2%",
        isPositive: true,
        icon: FaMapMarkedAlt,
        gradientDark: "linear-gradient(135deg, #6d28d9 0%, #3b35c9 100%)",
        gradientLight: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        glowDark: "rgba(109, 40, 217, 0.35)",
        glowLight: "rgba(109, 40, 217, 0.2)",
        iconBg: "rgba(255,255,255,0.12)",
    },
    {
        title: "Master Route Records",
        value: "18,940",
        change: "Synced",
        isPositive: true,
        icon: FaFileUpload,
        gradientDark: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
        gradientLight: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        glowDark: "rgba(13, 148, 136, 0.35)",
        glowLight: "rgba(13, 148, 136, 0.2)",
        iconBg: "rgba(255,255,255,0.12)",
    },
    {
        title: "Document Compliance",
        value: "96.8%",
        change: "+3.1%",
        isPositive: true,
        icon: FaCheckCircle,
        gradientDark: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
        gradientLight: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        glowDark: "rgba(217, 119, 6, 0.35)",
        glowLight: "rgba(217, 119, 6, 0.2)",
        iconBg: "rgba(255,255,255,0.12)",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
};

export default function AdminDashboard() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    return (
        <div
            style={{
                minHeight: "100%",
                padding: "40px 24px",
                background: darkMode
                    ? "radial-gradient(ellipse at top left, #1e1b7a 0%, #13102e 40%, #0d0b22 100%)"
                    : "linear-gradient(135deg, #eef0ff 0%, #f5f6ff 60%, #e8ebff 100%)",
                transition: "background 0.3s ease",
            }}
        >
            {/* Page Header */}
            <div style={{ marginBottom: "36px" }}>
                <h1
                    style={{
                        fontSize: "26px",
                        fontWeight: "700",
                        color: darkMode ? "#ffffff" : "#1e1b7a",
                        margin: 0,
                        letterSpacing: "-0.3px",
                    }}
                >
                    Admin Dashboard
                </h1>
                <p
                    style={{
                        fontSize: "14px",
                        color: darkMode ? "rgba(165,160,255,0.7)" : "#6b7280",
                        marginTop: "6px",
                    }}
                >
                    Overview of platform metrics
                </p>
            </div>

            {/* 4 KPI Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "24px",
                    maxWidth: "1200px",
                }}
            >
                {KPIS.map((kpi, i) => {
                    const Icon = kpi.icon;
                    const gradient = darkMode ? kpi.gradientDark : kpi.gradientLight;
                    const glow = darkMode ? kpi.glowDark : kpi.glowLight;

                    return (
                        <motion.div
                            key={kpi.title}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
                            style={{
                                background: gradient,
                                borderRadius: "18px",
                                padding: "28px 24px",
                                boxShadow: `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.15)`,
                                position: "relative",
                                overflow: "hidden",
                                cursor: "default",
                            }}
                        >
                            {/* Subtle background circle */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-24px",
                                    right: "-24px",
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.08)",
                                    pointerEvents: "none",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-32px",
                                    left: "-16px",
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.05)",
                                    pointerEvents: "none",
                                }}
                            />

                            {/* Icon */}
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: kpi.iconBg,
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <Icon size={22} color="#ffffff" />
                            </div>

                            {/* Value */}
                            <div
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "800",
                                    color: "#ffffff",
                                    lineHeight: 1,
                                    marginBottom: "8px",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                {kpi.value}
                            </div>

                            {/* Title */}
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "rgba(255,255,255,0.75)",
                                    marginBottom: "12px",
                                    letterSpacing: "0.2px",
                                }}
                            >
                                {kpi.title}
                            </div>

                            {/* Change badge */}
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "rgba(255,255,255,0.15)",
                                    borderRadius: "20px",
                                    padding: "3px 10px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#ffffff",
                                }}
                            >
                                {kpi.isPositive && kpi.change.startsWith("+") ? "↑ " : ""}
                                {kpi.change}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
