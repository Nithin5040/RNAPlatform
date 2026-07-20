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
    FaLock,
    FaEnvelope,
    FaTrash,
    FaEdit,
    FaTimes,
    FaInfoCircle,
    FaTruck,
    FaFileUpload,
    FaRoad,
    FaBoxes,
    FaCheckCircle
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
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999
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

// Multi-select styles
const getMultiSelectStyles = (darkMode, error) => ({
    ...getSelectStyles(darkMode, error),
    multiValue: (base) => ({
        ...base,
        backgroundColor: darkMode ? 'rgba(59,53,201,0.3)' : '#e0e7ff',
        borderRadius: '0.375rem'
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: darkMode ? '#e2e0ff' : '#1e1b7a',
        fontSize: '0.8rem'
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: darkMode ? '#e2e0ff' : '#1e1b7a',
        '&:hover': {
            backgroundColor: '#ef4444',
            color: 'white'
        }
    })
});

export default function UserCreation() {
    const { theme } = useTheme();
    const darkMode = theme === 'dark';
    const navigate = useNavigate();

    // Initial empty form state
    const initialFormState = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        role: "",
        gender: "",
        driverName: "",
        truckNumber: "",
        estimatedKms: "",
        qty: "",
    };

    const [form, setForm] = useState(initialFormState);
    const [driverDocument, setDriverDocument] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Multi-select location states
    const [zoneAccess, setZoneAccess] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedCircles, setSelectedCircles] = useState([]);
    const [selectedDivisions, setSelectedDivisions] = useState([]);
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [selectedTaluks, setSelectedTaluks] = useState([]);
    const [selectedStations, setSelectedStations] = useState([]);

    // Modal state for viewing/editing location record details
    const [editingRecordIndex, setEditingRecordIndex] = useState(null);
    const [editingRecordData, setEditingRecordData] = useState(null);

    // Dropdown states - storing full objects with codes
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [zones, setZones] = useState([]);
    const [circles, setCircles] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [stations, setStations] = useState([]);

    // Loading states for location dropdowns
    const [fetchingRoles, setFetchingRoles] = useState(false);
    const [fetchingGenders, setFetchingGenders] = useState(false);
    const [fetchingZones, setFetchingZones] = useState(false);
    const [fetchingCircles, setFetchingCircles] = useState(false);
    const [fetchingDivisions, setFetchingDivisions] = useState(false);
    const [fetchingDistricts, setFetchingDistricts] = useState(false);
    const [fetchingTaluks, setFetchingTaluks] = useState(false);
    const [fetchingStations, setFetchingStations] = useState(false);

    // Get logged-in user info
    const getLoggedInUser = () => {
        const storedUser = sessionStorage.getItem("auth_user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

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
        fetchZones();
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
                const formattedRoles = response.data.result.map(role => ({
                    value: role.RoleId ? role.RoleId.toString() : (role.RoleCode || role.RoleName),
                    label: role.RoleName,
                    roleId: role.RoleId
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
                    label: gender.GenderName,
                    genderId: gender.GenderId
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

    // Fetch Zones from API
    const fetchZones = async () => {
        try {
            setFetchingZones(true);
            const payload = {
                flagId: 1
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const formattedZones = response.data.result.map(zone => ({
                    value: zone.ZoneCode,
                    label: zone.ZoneName,
                    zoneCode: zone.ZoneCode,
                    zoneName: zone.ZoneName
                }));
                setZones(formattedZones);
            } else {
                setZones([]);
            }
        } catch (error) {
            console.error("Error fetching zones:", error);
            setZones([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch zones. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingZones(false);
        }
    };

    // Fetch Circles based on selected Zone
    const fetchCircles = async (zoneCode) => {
        if (!zoneCode) {
            setCircles([]);
            return;
        }

        try {
            setFetchingCircles(true);
            const payload = {
                flagId: 2,
                zoneCode: zoneCode
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const formattedCircles = response.data.result.map(circle => ({
                    value: circle.CircleCode,
                    label: circle.CircleName,
                    circleCode: circle.CircleCode,
                    circleName: circle.CircleName
                }));
                setCircles(formattedCircles);
            } else {
                setCircles([]);
            }
        } catch (error) {
            console.error("Error fetching circles:", error);
            setCircles([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch circles. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingCircles(false);
        }
    };

    // Fetch Divisions based on selected Circle
    const fetchDivisions = async (circleCode) => {
        if (!circleCode) {
            setDivisions([]);
            return;
        }

        try {
            setFetchingDivisions(true);
            const payload = {
                flagId: 3,
                circleCode: circleCode
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const uniqueDivisions = response.data.result.reduce((acc, current) => {
                    const exists = acc.find(item => item.DivisionCode === current.DivisionCode);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                const formattedDivisions = uniqueDivisions.map(division => ({
                    value: division.DivisionCode,
                    label: division.DivisionName,
                    divisionCode: division.DivisionCode,
                    divisionName: division.DivisionName
                }));
                setDivisions(formattedDivisions);
            } else {
                setDivisions([]);
            }
        } catch (error) {
            console.error("Error fetching divisions:", error);
            setDivisions([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch divisions. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingDivisions(false);
        }
    };

    // Fetch Districts based on selected Division
    const fetchDistricts = async (divisionCode) => {
        if (!divisionCode) {
            setDistricts([]);
            return;
        }

        try {
            setFetchingDistricts(true);
            const payload = {
                flagId: 4,
                divisionCode: divisionCode
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const uniqueDistricts = response.data.result.reduce((acc, current) => {
                    const exists = acc.find(item => item.DistrictCode === current.DistrictCode);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                const formattedDistricts = uniqueDistricts.map(district => ({
                    value: district.DistrictCode,
                    label: district.DistrictName,
                    districtCode: district.DistrictCode,
                    districtName: district.DistrictName
                }));
                setDistricts(formattedDistricts);
            } else {
                setDistricts([]);
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            setDistricts([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch districts. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingDistricts(false);
        }
    };

    // Fetch Taluks based on selected District
    const fetchTaluks = async (districtCode) => {
        if (!districtCode) {
            setTaluks([]);
            return;
        }

        try {
            setFetchingTaluks(true);
            const payload = {
                flagId: 5,
                districtCode: districtCode
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const uniqueTaluks = response.data.result.reduce((acc, current) => {
                    const exists = acc.find(item => item.TalukCode === current.TalukCode);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                const formattedTaluks = uniqueTaluks.map(taluk => ({
                    value: taluk.TalukCode,
                    label: taluk.Taluk,
                    talukCode: taluk.TalukCode,
                    talukName: taluk.Taluk
                }));
                setTaluks(formattedTaluks);
            } else {
                setTaluks([]);
            }
        } catch (error) {
            console.error("Error fetching taluks:", error);
            setTaluks([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch taluks. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingTaluks(false);
        }
    };

    // Fetch Stations based on selected Taluk
    const fetchStations = async (talukCode) => {
        if (!talukCode) {
            setStations([]);
            return;
        }

        try {
            setFetchingStations(true);
            const payload = {
                flagId: 8,
                talukCode: talukCode
            };

            const response = await axiosClient({
                method: SummaryApi.userdpwns.method,
                url: SummaryApi.userdpwns.url,
                data: payload
            });

            if (response.data?.status === true && response.data?.result) {
                const formattedStations = response.data.result.map(station => ({
                    value: station.StationNameCode,
                    label: station.StationName,
                    stationCode: station.StationNameCode,
                    stationName: station.StationName
                }));
                setStations(formattedStations);
            } else {
                setStations([]);
            }
        } catch (error) {
            console.error("Error fetching stations:", error);
            setStations([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch stations. Please refresh the page.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
        } finally {
            setFetchingStations(false);
        }
    };

    // Check if the selected role is "Driver(User)" or Driver
    const isDriverRole = useMemo(() => {
        const selectedRole = roles.find(option => option.value === form.role);
        return selectedRole && (selectedRole.label === "Driver(User)" || selectedRole.label?.toLowerCase().includes("driver"));
    }, [form.role, roles]);

    // Reset location selections when role changes from Driver(User)
    useEffect(() => {
        if (!isDriverRole) {
            setZoneAccess([]);
            setSelectedLocations([]);
            setSelectedZone(null);
            setSelectedCircles([]);
            setSelectedDivisions([]);
            setSelectedDistricts([]);
            setSelectedTaluks([]);
            setSelectedStations([]);
            setCircles([]);
            setDivisions([]);
            setDistricts([]);
            setTaluks([]);
            setStations([]);
        } else {
            // Clear non-driver specific fields when switching to driver role
            setForm(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                email: ''
            }));
            setErrors(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                email: ''
            }));
        }
    }, [form.role, isDriverRole]);

    // Handle zone selection change
    const handleZoneChange = async (selectedOption) => {
        setSelectedZone(selectedOption);
        setSelectedCircles([]);
        setSelectedDivisions([]);
        setSelectedDistricts([]);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setCircles([]);
        setDivisions([]);
        setDistricts([]);
        setTaluks([]);
        setStations([]);

        if (selectedOption) {
            await fetchCircles(selectedOption.value);
        }
    };

    // Handle circle multi-select change
    const handleCirclesChange = async (selectedOptions) => {
        setSelectedCircles(selectedOptions || []);
        setSelectedDivisions([]);
        setSelectedDistricts([]);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setDivisions([]);
        setDistricts([]);
        setTaluks([]);
        setStations([]);

        if (selectedOptions && selectedOptions.length > 0) {
            const combinedDivisions = await Promise.all(
                selectedOptions.map(async (circle) => {
                    const response = await axiosClient({
                        method: SummaryApi.userdpwns.method,
                        url: SummaryApi.userdpwns.url,
                        data: {
                            flagId: 3,
                            circleCode: circle.value
                        }
                    });
                    if (response.data?.status === true && response.data?.result) {
                        const uniqueDivisions = response.data.result.reduce((acc, current) => {
                            const exists = acc.find(item => item.DivisionCode === current.DivisionCode);
                            if (!exists) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);
                        return uniqueDivisions.map(division => ({
                            value: division.DivisionCode,
                            label: division.DivisionName,
                            divisionCode: division.DivisionCode,
                            divisionName: division.DivisionName
                        }));
                    }
                    return [];
                })
            );

            const flatDivisions = combinedDivisions.flat();
            const uniqueDivisions = flatDivisions.reduce((acc, current) => {
                const exists = acc.find(item => item.value === current.value);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);
            setDivisions(uniqueDivisions);
        } else {
            setDivisions([]);
        }
    };

    // Handle division multi-select change
    const handleDivisionsChange = async (selectedOptions) => {
        setSelectedDivisions(selectedOptions || []);
        setSelectedDistricts([]);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setDistricts([]);
        setTaluks([]);
        setStations([]);

        if (selectedOptions && selectedOptions.length > 0) {
            const combinedDistricts = await Promise.all(
                selectedOptions.map(async (division) => {
                    const response = await axiosClient({
                        method: SummaryApi.userdpwns.method,
                        url: SummaryApi.userdpwns.url,
                        data: {
                            flagId: 4,
                            divisionCode: division.value
                        }
                    });
                    if (response.data?.status === true && response.data?.result) {
                        const uniqueDistricts = response.data.result.reduce((acc, current) => {
                            const exists = acc.find(item => item.DistrictCode === current.DistrictCode);
                            if (!exists) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);
                        return uniqueDistricts.map(district => ({
                            value: district.DistrictCode,
                            label: district.DistrictName,
                            districtCode: district.DistrictCode,
                            districtName: district.DistrictName
                        }));
                    }
                    return [];
                })
            );

            const flatDistricts = combinedDistricts.flat();
            const uniqueDistricts = flatDistricts.reduce((acc, current) => {
                const exists = acc.find(item => item.value === current.value);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);
            setDistricts(uniqueDistricts);
        } else {
            setDistricts([]);
        }
    };

    // Handle district multi-select change
    const handleDistrictsChange = async (selectedOptions) => {
        setSelectedDistricts(selectedOptions || []);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setTaluks([]);
        setStations([]);

        if (selectedOptions && selectedOptions.length > 0) {
            const combinedTaluks = await Promise.all(
                selectedOptions.map(async (district) => {
                    const response = await axiosClient({
                        method: SummaryApi.userdpwns.method,
                        url: SummaryApi.userdpwns.url,
                        data: {
                            flagId: 5,
                            districtCode: district.value
                        }
                    });
                    if (response.data?.status === true && response.data?.result) {
                        const uniqueTaluks = response.data.result.reduce((acc, current) => {
                            const exists = acc.find(item => item.TalukCode === current.TalukCode);
                            if (!exists) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);
                        return uniqueTaluks.map(taluk => ({
                            value: taluk.TalukCode,
                            label: taluk.Taluk,
                            talukCode: taluk.TalukCode,
                            talukName: taluk.Taluk
                        }));
                    }
                    return [];
                })
            );

            const flatTaluks = combinedTaluks.flat();
            const uniqueTaluks = flatTaluks.reduce((acc, current) => {
                const exists = acc.find(item => item.value === current.value);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);
            setTaluks(uniqueTaluks);
        } else {
            setTaluks([]);
        }
    };

    // Handle taluk multi-select change
    const handleTaluksChange = async (selectedOptions) => {
        setSelectedTaluks(selectedOptions || []);
        setSelectedStations([]);
        setStations([]);

        if (selectedOptions && selectedOptions.length > 0) {
            const combinedStations = await Promise.all(
                selectedOptions.map(async (taluk) => {
                    const response = await axiosClient({
                        method: SummaryApi.userdpwns.method,
                        url: SummaryApi.userdpwns.url,
                        data: {
                            flagId: 8,
                            talukCode: taluk.value
                        }
                    });
                    if (response.data?.status === true && response.data?.result) {
                        return response.data.result.map(station => ({
                            value: station.StationNameCode,
                            label: station.StationName,
                            stationCode: station.StationNameCode,
                            stationName: station.StationName
                        }));
                    }
                    return [];
                })
            );

            const flatStations = combinedStations.flat();
            const uniqueStations = flatStations.reduce((acc, current) => {
                const exists = acc.find(item => item.value === current.value);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);
            setStations(uniqueStations);
        } else {
            setStations([]);
        }
    };

    // Handle station multi-select change
    const handleStationsChange = (selectedOptions) => {
        setSelectedStations(selectedOptions || []);
    };

    // Generate all combinations of selected locations with codes
    const generateLocationCombinations = () => {
        const combinations = [];

        if (!selectedZone) {
            Swal.fire({
                icon: 'warning',
                title: 'Zone Required',
                text: 'Please select a zone first.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
            return;
        }

        if (selectedCircles.length === 0 || selectedDivisions.length === 0 ||
            selectedDistricts.length === 0 || selectedTaluks.length === 0 ||
            selectedStations.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Selection',
                text: 'Please select at least one option from Circle, Division, District, Taluk, and Station.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
            return;
        }

        // Generate all combinations with both names (for frontend display) and codes (for backend)
        for (const circle of selectedCircles) {
            for (const division of selectedDivisions) {
                for (const district of selectedDistricts) {
                    for (const taluk of selectedTaluks) {
                        for (const station of selectedStations) {
                            const locNames = selectedLocations && selectedLocations.length > 0
                                ? selectedLocations.map(l => l.label).join(", ")
                                : "Main Hub";

                            const entry = {
                                // Names for UI display
                                zoneName: selectedZone.zoneName || selectedZone.label,
                                circleName: circle.circleName || circle.label,
                                divisionName: division.divisionName || division.label,
                                districtName: district.districtName || district.label,
                                taluk: taluk.talukName || taluk.label,
                                stationName: station.stationName || station.label,
                                locationName: locNames,

                                // Backend fields requested
                                inchargeAE: station.inchargeAE || `AE ${station.stationName || 'Officer'}`,
                                contactNo: station.contactNo || "9876543210",
                                pincode: station.pincode || "560001",
                                voltageClass: station.voltageClass || "66/11 kV",

                                // Codes for backend API payload
                                zoneCode: selectedZone.zoneCode || selectedZone.value,
                                circleCode: circle.circleCode || circle.value,
                                divisionCode: division.divisionCode || division.value,
                                districtCode: district.districtCode || district.value,
                                talukCode: taluk.talukCode || taluk.value,
                                stationCode: station.stationCode || station.value
                            };

                            // Check for duplicate
                            const isDuplicate = zoneAccess.some(existing =>
                                (existing.zoneCode === entry.zoneCode || existing.zoneName === entry.zoneName) &&
                                (existing.circleCode === entry.circleCode || existing.circleName === entry.circleName) &&
                                (existing.divisionCode === entry.divisionCode || existing.divisionName === entry.divisionName) &&
                                (existing.districtCode === entry.districtCode || existing.districtName === entry.districtName) &&
                                (existing.talukCode === entry.talukCode || existing.taluk === entry.taluk) &&
                                (existing.stationCode === entry.stationCode || existing.stationName === entry.stationName)
                            );

                            if (!isDuplicate) {
                                combinations.push(entry);
                            }
                        }
                    }
                }
            }
        }

        if (combinations.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No New Combinations',
                text: 'All selected combinations already exist in the list.',
                timer: 3000,
                showConfirmButton: false,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            });
            return;
        }

        setZoneAccess([...zoneAccess, ...combinations]);

        // Reset selections but keep zone
        setSelectedCircles([]);
        setSelectedDivisions([]);
        setSelectedDistricts([]);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setCircles([]);
        setDivisions([]);
        setDistricts([]);
        setTaluks([]);
        setStations([]);

        // Refetch circles for the selected zone
        if (selectedZone) {
            fetchCircles(selectedZone.value);
        }

        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `${combinations.length} location(s) added successfully.`,
            timer: 2000,
            showConfirmButton: false,
            background: darkMode ? '#13102e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
        });
    };

    // Remove location entry from zoneAccess array
    const removeLocationEntry = (index) => {
        const updatedZoneAccess = zoneAccess.filter((_, i) => i !== index);
        setZoneAccess(updatedZoneAccess);
    };

    // Open edit modal for location entry
    const handleOpenEditModal = (index) => {
        setEditingRecordIndex(index);
        setEditingRecordData({ ...zoneAccess[index] });
    };

    // Save edited location record
    const handleSaveEditRecord = () => {
        if (editingRecordIndex === null || !editingRecordData) return;
        const updated = [...zoneAccess];
        updated[editingRecordIndex] = editingRecordData;
        setZoneAccess(updated);
        setEditingRecordIndex(null);
        setEditingRecordData(null);

        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Location details updated successfully.',
            timer: 2000,
            showConfirmButton: false,
            background: darkMode ? '#13102e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
        });
    };

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

        if (name === "firstName" || name === "lastName") {
            validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
            if (validatedValue.startsWith(' ')) {
                validatedValue = validatedValue.trimStart();
            }
            validatedValue = validatedValue.slice(0, 50);
            validatedValue = capitalizeWords(validatedValue);
        } else if (name === "driverName") {
            validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
            if (validatedValue.startsWith(' ')) {
                validatedValue = validatedValue.trimStart();
            }
            validatedValue = validatedValue.slice(0, 100);
            validatedValue = capitalizeWords(validatedValue);
        } else if (name === "truckNumber") {
            validatedValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '').slice(0, 20);
        } else if (name === "estimatedKms" || name === "qty") {
            validatedValue = value.replace(/[^0-9.]/g, '');
            const parts = validatedValue.split('.');
            if (parts.length > 2) {
                validatedValue = parts[0] + '.' + parts.slice(1).join('');
            }
            validatedValue = validatedValue.slice(0, 10);
        } else if (name === "mobile") {
            validatedValue = value.replace(/\D/g, '').slice(0, 10);
        } else if (name === "password") {
            validatedValue = value.slice(0, 20);
        } else if (name === "email") {
            validatedValue = value.slice(0, 100);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setErrorMessage("");
        setForm((prev) => ({ ...prev, [name]: validatedValue }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : '';

        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleDriverDocumentChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, driverDocument: 'File size should not exceed 5MB' }));
            return;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            setErrors(prev => ({ ...prev, driverDocument: 'Only PDF, JPG, PNG, or WEBP files are allowed' }));
            return;
        }

        setDriverDocument(file);
        setErrors(prev => ({ ...prev, driverDocument: '' }));
    };

    const removeDriverDocument = () => {
        setDriverDocument(null);
    };

    const validateForm = async () => {
        try {
            const activeSchema = yup.object().shape({
                firstName: yup
                    .string()
                    .max(50, 'First name cannot exceed 50 characters')
                    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),

                lastName: yup
                    .string()
                    .max(50, 'Last name cannot exceed 50 characters')
                    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),

                email: yup
                    .string()
                    .email('Please enter a valid email address')
                    .max(100, 'Email cannot exceed 100 characters'),

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
            });

            await activeSchema.validate(form, { abortEarly: false });

            if (isDriverRole) {
                if (zoneAccess.length === 0) {
                    setErrors(prev => ({
                        ...prev,
                        zoneAccess: 'At least one location entry is required for Driver role'
                    }));
                    return false;
                }

                const driverSchema = yup.object().shape({
                    driverName: yup
                        .string()
                        .required('Driver name is required')
                        .max(100, 'Driver name cannot exceed 100 characters')
                        .matches(/^[a-zA-Z\s]*$/, 'Driver name can only contain letters and spaces'),

                    truckNumber: yup
                        .string()
                        .required('Truck number is required')
                        .max(20, 'Truck number cannot exceed 20 characters')
                        .matches(/^[A-Za-z0-9\s-]*$/, 'Truck number can only contain letters, numbers, spaces, and hyphens'),

                    estimatedKms: yup
                        .number()
                        .typeError('Estimated KMS must be a valid number')
                        .required('Estimated KMS is required')
                        .positive('Estimated KMS must be greater than 0'),

                    qty: yup
                        .number()
                        .typeError('Quantity must be a valid number')
                        .required('Quantity is required')
                        .positive('Quantity must be greater than 0'),
                });

                await driverSchema.validate(form, { abortEarly: false });

                if (!driverDocument) {
                    setErrors(prev => ({
                        ...prev,
                        driverDocument: 'Driver document is required'
                    }));
                    return false;
                }
            }

            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            if (err.inner) {
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
            }
            setErrors(prev => ({ ...prev, ...validationErrors }));
            return false;
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
        setDriverDocument(null);
        setErrors({});
        setSuccessMessage("");
        setErrorMessage("");
        setShowPassword(false);
        setZoneAccess([]);
        setSelectedLocations([]);
        setSelectedZone(null);
        setSelectedCircles([]);
        setSelectedDivisions([]);
        setSelectedDistricts([]);
        setSelectedTaluks([]);
        setSelectedStations([]);
        setCircles([]);
        setDivisions([]);
        setDistricts([]);
        setTaluks([]);
        setStations([]);
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
            const user = getLoggedInUser();
            const createdByUserName = user?.userName || user?.username || user?.name || "Admin";

            // Get selected role and gender objects
            const selectedRole = roles.find(r => r.value === form.role);
            const selectedGender = genders.find(g => g.value === form.gender);

            const payload = {
                firstName: form.firstName || "",
                lastName: form.lastName || "",
                mobileNumber: form.mobile,
                email: form.email || "",
                password: form.password,
                roleId: selectedRole ? parseInt(selectedRole.value) : parseInt(form.role),
                genderId: selectedGender ? parseInt(selectedGender.value) : parseInt(form.gender),
                createdByUserName: createdByUserName
            };

            if (isDriverRole) {
                payload.driverName = form.driverName;
                payload.truckNumber = form.truckNumber;
                payload.estimatedKms = parseFloat(form.estimatedKms) || 0;
                payload.qty = parseFloat(form.qty) || 0;
                payload.documentName = driverDocument?.name || null;

                if (zoneAccess.length > 0) {
                    payload.zoneAccess = zoneAccess.map(item => ({
                        zoneCode: item.zoneCode,
                        circleCode: item.circleCode,
                        divisionCode: item.divisionCode,
                        districtCode: item.districtCode,
                        talukCode: item.talukCode,
                        stationCode: item.stationCode
                    }));
                }
            }

            const response = await axiosClient({
                method: SummaryApi.createUser.method,
                url: SummaryApi.createUser.url,
                data: payload
            });

            if (response.data?.status === true) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data?.message || "User created successfully!",
                    timer: 3000,
                    showConfirmButton: true,
                    background: darkMode ? '#13102e' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    confirmButtonColor: '#3b35c9'
                });

                setSuccessMessage(response.data?.message || "User created successfully!");
                resetForm();

                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                throw new Error(response.data?.message || "Failed to create user");
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMsg = error.response?.data?.message || error.message || "An error occurred while creating user. Please try again.";

            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMsg,
                timer: 3000,
                showConfirmButton: true,
                background: darkMode ? '#13102e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                confirmButtonColor: '#3b35c9'
            });
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Options mapping
    const locationOptions = [
        { value: 'LOC01', label: 'Location 1 - Central Hub' },
        { value: 'LOC02', label: 'Location 2 - North Yard' },
        { value: 'LOC03', label: 'Location 3 - South Depot' },
        { value: 'LOC04', label: 'Location 4 - West Terminal' },
        { value: 'LOC05', label: 'Location 5 - East Logistics Park' }
    ];
    const roleOptions = roles;
    const genderOptions = genders;
    const zoneOptions = zones;
    const circleOptions = circles;
    const divisionOptions = divisions;
    const districtOptions = districts;
    const talukOptions = taluks;
    const stationOptions = stations;

    return (
        <div className={`min-h-full py-12 px-6 transition-colors duration-300 ${darkMode ? 'bg-[#0d0b22]' : 'bg-gray-50'}`}>
            <div className="max-w-[1600px] mx-auto">
                {/* Status Messages */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? 'bg-green-950/30 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'}`}
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
                            className={`mb-6 p-4 border rounded-lg text-center font-semibold text-sm ${darkMode ? 'bg-red-950/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} noValidate>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`${darkMode ? 'bg-[#13102e] border-[rgba(90,84,224,0.25)] shadow-[0_10px_35px_rgba(0,0,0,0.4)]' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border min-h-[220px]`}
                    >
                        {/* Gradient divider line at top */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3b35c9] via-[#5a54e0] to-[#a5a0ff] rounded-t-2xl" />

                        <div className="p-8">
                            {/* Responsive 4-Column Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                {/* Select Role - Required (1st field) */}
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
                                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                    />
                                    <ErrorMessage message={errors.role} />
                                </div>

                                {/* Render remaining fields only after a role is selected */}
                                {form.role && (
                                    <>
                                        {/* Fields hidden for Driver role */}
                                        {!isDriverRole && (
                                            <>
                                                {/* First Name - Optional */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        First Name
                                                    </label>
                                                    <div className="relative">
                                                        <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter first name"
                                                            name="firstName"
                                                            value={form.firstName}
                                                            onChange={handleChange}
                                                            maxLength={50}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.firstName ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.firstName} />
                                                </div>

                                                {/* Last Name - Optional */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        Last Name
                                                    </label>
                                                    <div className="relative">
                                                        <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter last name"
                                                            name="lastName"
                                                            value={form.lastName}
                                                            onChange={handleChange}
                                                            maxLength={50}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.lastName ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.lastName} />
                                                </div>

                                                {/* Email - Optional */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        Email
                                                    </label>
                                                    <div className="relative">
                                                        <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter email address"
                                                            type="email"
                                                            name="email"
                                                            value={form.email}
                                                            onChange={handleChange}
                                                            maxLength={100}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.email ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.email} />
                                                </div>
                                            </>
                                        )}

                                        {/* Mobile Number - Required */}
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

                                        {/* Password - Required */}
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

                                        {/* Select Gender - Required */}
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
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                            />
                                            <ErrorMessage message={errors.gender} />
                                        </div>
                                    </>
                                )}

                            </div>

                            {/* Conditional Driver Location Section */}
                            <AnimatePresence>
                                {isDriverRole && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className={`mt-8 pt-8 border-t ${darkMode ? 'border-[rgba(90,84,224,0.25)]' : 'border-gray-200'}`}
                                    >
                                        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#1e1b7a]'}`}>
                                            Location Access Details
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                                            {/* Zone Dropdown - Single Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Zone
                                                </label>
                                                <Select
                                                    options={zoneOptions}
                                                    value={selectedZone}
                                                    onChange={handleZoneChange}
                                                    isLoading={fetchingZones}
                                                    isDisabled={fetchingZones}
                                                    placeholder={fetchingZones ? "Loading..." : "Select zone"}
                                                    noOptionsMessage={() => 'No zones found'}
                                                    styles={getSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                />
                                            </div>

                                            {/* Circle Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Circle (Multi)
                                                </label>
                                                <Select
                                                    options={circleOptions}
                                                    value={selectedCircles}
                                                    onChange={handleCirclesChange}
                                                    isLoading={fetchingCircles}
                                                    isDisabled={fetchingCircles || !selectedZone}
                                                    placeholder={selectedZone ? "Select circles..." : "Select zone first"}
                                                    noOptionsMessage={() => 'No circles found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                />
                                            </div>

                                            {/* Division Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Division (Multi)
                                                </label>
                                                <Select
                                                    options={divisionOptions}
                                                    value={selectedDivisions}
                                                    onChange={handleDivisionsChange}
                                                    isLoading={fetchingDivisions}
                                                    isDisabled={fetchingDivisions || selectedCircles.length === 0}
                                                    placeholder={selectedCircles.length > 0 ? "Select divisions..." : "Select circles first"}
                                                    noOptionsMessage={() => 'No divisions found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                />
                                            </div>

                                            {/* District Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>District (Multi)
                                                </label>
                                                <Select
                                                    options={districtOptions}
                                                    value={selectedDistricts}
                                                    onChange={handleDistrictsChange}
                                                    isLoading={fetchingDistricts}
                                                    isDisabled={fetchingDistricts || selectedDivisions.length === 0}
                                                    placeholder={selectedDivisions.length > 0 ? "Select districts..." : "Select divisions first"}
                                                    noOptionsMessage={() => 'No districts found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                />
                                            </div>

                                            {/* Taluk Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Taluk (Multi)
                                                </label>
                                                <Select
                                                    options={talukOptions}
                                                    value={selectedTaluks}
                                                    onChange={handleTaluksChange}
                                                    isLoading={fetchingTaluks}
                                                    isDisabled={fetchingTaluks || selectedDistricts.length === 0}
                                                    placeholder={selectedDistricts.length > 0 ? "Select taluks..." : "Select districts first"}
                                                    noOptionsMessage={() => 'No taluks found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                />
                                            </div>

                                            {/* Station Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    <span className="text-red-500 mr-1">*</span>Station (Multi)
                                                </label>
                                                <Select
                                                    options={stationOptions}
                                                    value={selectedStations}
                                                    onChange={handleStationsChange}
                                                    isLoading={fetchingStations}
                                                    isDisabled={fetchingStations || selectedTaluks.length === 0}
                                                    placeholder={selectedTaluks.length > 0 ? "Select stations..." : "Select taluks first"}
                                                    noOptionsMessage={() => 'No stations found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                />
                                            </div>

                                            {/* Location Dropdown - Multi Select */}
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                    Location (Multi)
                                                </label>
                                                <Select
                                                    options={locationOptions}
                                                    value={selectedLocations}
                                                    onChange={(selectedOptions) => setSelectedLocations(selectedOptions || [])}
                                                    placeholder="Select locations..."
                                                    noOptionsMessage={() => 'No locations found'}
                                                    styles={getMultiSelectStyles(darkMode, false)}
                                                    classNamePrefix="react-select"
                                                    isSearchable
                                                    isMulti
                                                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                />
                                            </div>
                                        </div>

                                        {/* Generate Combinations Button */}
                                        <div className="mt-4 flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.96 }}
                                                type="button"
                                                onClick={generateLocationCombinations}
                                                className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-md bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg flex items-center gap-2"
                                            >
                                                Generate All Combinations
                                            </motion.button>
                                        </div>

                                        {/* Zone Access List */}
                                        {zoneAccess.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-6"
                                            >
                                                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-700'}`}>
                                                    Added Locations ({zoneAccess.length})
                                                </h4>
                                                <div className={`overflow-x-auto rounded-lg border ${darkMode ? 'border-[rgba(90,84,224,0.25)]' : 'border-gray-200'}`}>
                                                    <table className={`min-w-full divide-y ${darkMode ? 'divide-[rgba(90,84,224,0.25)]' : 'divide-gray-200'}`}>
                                                        <thead className={darkMode ? 'bg-[#0d0b22]' : 'bg-gray-50'}>
                                                            <tr>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Sl No</th>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Station Name</th>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Incharge AE</th>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Contact No</th>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Pincode</th>
                                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Voltage Class</th>
                                                                <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-[#a5a0ff]' : 'text-gray-600'}`}>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className={`divide-y ${darkMode ? 'divide-[rgba(90,84,224,0.25)] bg-[#13102e]' : 'divide-gray-200 bg-white'}`}>
                                                            <AnimatePresence initial={false}>
                                                                {zoneAccess.map((entry, index) => (
                                                                    <motion.tr
                                                                        key={`${entry.zoneCode}-${entry.circleCode}-${entry.divisionCode}-${entry.districtCode}-${entry.talukCode}-${entry.stationCode}-${index}`}
                                                                        initial={{ opacity: 0, x: -15 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        exit={{ opacity: 0, x: 20 }}
                                                                        transition={{ duration: 0.25 }}
                                                                        className={`transition-colors ${darkMode ? 'hover:bg-[#1a1740]' : 'hover:bg-gray-50'}`}
                                                                    >
                                                                        <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{index + 1}</td>
                                                                        <td className={`px-4 py-3 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.stationName}</td>
                                                                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-[#e2e0ff]' : 'text-gray-800'}`}>{entry.inchargeAE || 'N/A'}</td>
                                                                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-[#e2e0ff]' : 'text-gray-800'}`}>{entry.contactNo || 'N/A'}</td>
                                                                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-[#e2e0ff]' : 'text-gray-800'}`}>{entry.pincode || 'N/A'}</td>
                                                                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-[#e2e0ff]' : 'text-gray-800'}`}>{entry.voltageClass || 'N/A'}</td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.2 }}
                                                                                    whileTap={{ scale: 0.9 }}
                                                                                    type="button"
                                                                                    onClick={() => handleOpenEditModal(index)}
                                                                                    className={`transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                                                                                    title="View & Edit Details"
                                                                                >
                                                                                    <FaEdit size={16} />
                                                                                </motion.button>
                                                                                <motion.button
                                                                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                                                                    whileTap={{ scale: 0.9 }}
                                                                                    type="button"
                                                                                    onClick={() => removeLocationEntry(index)}
                                                                                    className={`transition-colors ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                                                                                    title="Remove"
                                                                                >
                                                                                    <FaTrash size={16} />
                                                                                </motion.button>
                                                                            </div>
                                                                        </td>
                                                                    </motion.tr>
                                                                ))}
                                                            </AnimatePresence>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {errors.zoneAccess && (
                                                    <p className="mt-2 text-xs text-red-500 flex items-start gap-1">
                                                        <span className="inline-block mt-0.5">⚠️</span>
                                                        <span>{errors.zoneAccess}</span>
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Driver Details Section */}
                                        <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-[rgba(90,84,224,0.25)]' : 'border-gray-200'}`}>
                                            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#1e1b7a]'}`}>
                                                Driver Details
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                                {/* Driver Name - Required */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        <span className="text-red-500 mr-1">*</span>Driver Name
                                                    </label>
                                                    <div className="relative">
                                                        <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter driver name"
                                                            name="driverName"
                                                            value={form.driverName}
                                                            onChange={handleChange}
                                                            maxLength={100}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.driverName ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.driverName} />
                                                </div>

                                                {/* Truck Number - Required */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        <span className="text-red-500 mr-1">*</span>Truck Number
                                                    </label>
                                                    <div className="relative">
                                                        <FaTruck className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="e.g. KA01AB1234"
                                                            name="truckNumber"
                                                            value={form.truckNumber}
                                                            onChange={handleChange}
                                                            maxLength={20}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.truckNumber ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.truckNumber} />
                                                </div>

                                                {/* Driver Document Upload - Required */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        <span className="text-red-500 mr-1">*</span>Document Field
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="driverDocumentInput"
                                                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                                                            onChange={handleDriverDocumentChange}
                                                            className="hidden"
                                                        />
                                                        {!driverDocument ? (
                                                            <label
                                                                htmlFor="driverDocumentInput"
                                                                className={`w-full h-[46px] rounded-lg border px-3 flex items-center gap-2 text-sm cursor-pointer transition-all ${darkMode
                                                                    ? 'bg-[#0d0b22] border-gray-800 text-gray-400 hover:border-[#3b35c9]'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:border-[#3b35c9]'
                                                                    } ${errors.driverDocument ? 'border-red-500' : ''}`}
                                                            >
                                                                <FaFileUpload className={darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'} size={15} />
                                                                <span className="truncate">Upload Document</span>
                                                            </label>
                                                        ) : (
                                                            <div className={`w-full h-[46px] rounded-lg border px-3 flex items-center justify-between text-sm ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}>
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                                                                    <span className="truncate text-xs font-medium">{driverDocument.name}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={removeDriverDocument}
                                                                    className="text-red-400 hover:text-red-500 ml-2 p-1 transition-colors"
                                                                    title="Remove File"
                                                                >
                                                                    <FaTrash size={12} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ErrorMessage message={errors.driverDocument} />
                                                </div>

                                                {/* Estimated KMS - Required */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        <span className="text-red-500 mr-1">*</span>Estimated KMS
                                                    </label>
                                                    <div className="relative">
                                                        <FaRoad className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter estimated kms"
                                                            name="estimatedKms"
                                                            value={form.estimatedKms}
                                                            onChange={handleChange}
                                                            maxLength={10}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.estimatedKms ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.estimatedKms} />
                                                </div>

                                                {/* Qty - Required */}
                                                <div>
                                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                                        <span className="text-red-500 mr-1">*</span>Qty
                                                    </label>
                                                    <div className="relative">
                                                        <FaBoxes className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                                                        <input
                                                            placeholder="Enter quantity"
                                                            name="qty"
                                                            value={form.qty}
                                                            onChange={handleChange}
                                                            maxLength={10}
                                                            className={`w-full rounded-lg border pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${darkMode
                                                                ? 'bg-[#0d0b22] border-gray-800 text-white placeholder-gray-600 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-[#3b35c9] focus:border-[#3b35c9]'
                                                                } ${errors.qty ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <ErrorMessage message={errors.qty} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                             {/* Submit Button */}
                             {form.role && (
                                 <div className={`pt-8 border-t mt-8 flex justify-end ${darkMode ? 'border-[rgba(90,84,224,0.25)]' : 'border-gray-100'}`}>
                                     <motion.button
                                         whileHover={{ scale: loading ? 1 : 1.02 }}
                                         whileTap={{ scale: loading ? 1 : 0.97 }}
                                         type="submit"
                                         disabled={loading}
                                         className={`w-full sm:w-auto px-10 py-3.5 text-sm font-semibold text-white rounded-lg transition-all transform flex items-center justify-center gap-2 ${loading
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
                                     </motion.button>
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </form>
            </div>

            {/* View & Edit Location Record Modal */}
            <AnimatePresence>
                {editingRecordIndex !== null && editingRecordData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl border ${darkMode ? 'bg-[#13102e] border-[rgba(90,84,224,0.3)] text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200/20">
                                <div className="flex items-center gap-2">
                                    <FaInfoCircle className="text-[#3b35c9]" size={20} />
                                    <h3 className="text-lg font-bold">
                                        Location Record Details - {editingRecordData.stationName}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setEditingRecordIndex(null); setEditingRecordData(null); }}
                                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">

                                {/* Backend Editable Details */}
                                <div>
                                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        Backend Record Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Station Name</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.stationName || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, stationName: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Incharge AE</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.inchargeAE || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, inchargeAE: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Contact No</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.contactNo || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, contactNo: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Pincode</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.pincode || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, pincode: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Voltage Class</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.voltageClass || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, voltageClass: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 opacity-80">Location</label>
                                            <input
                                                type="text"
                                                value={editingRecordData.locationName || ''}
                                                onChange={(e) => setEditingRecordData(prev => ({ ...prev, locationName: e.target.value }))}
                                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#3b35c9] ${darkMode ? 'bg-[#0d0b22] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hierarchy Access Details */}
                                <div>
                                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-[#a5a0ff]' : 'text-[#3b35c9]'}`}>
                                        Location Hierarchy Details
                                    </h4>
                                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg text-xs ${darkMode ? 'bg-[#0d0b22] border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                                        <div>
                                            <span className="opacity-60 block">Zone:</span>
                                            <span className="font-semibold">{editingRecordData.zoneName} ({editingRecordData.zoneCode})</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 block">Circle:</span>
                                            <span className="font-semibold">{editingRecordData.circleName} ({editingRecordData.circleCode})</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 block">Division:</span>
                                            <span className="font-semibold">{editingRecordData.divisionName} ({editingRecordData.divisionCode})</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 block">District:</span>
                                            <span className="font-semibold">{editingRecordData.districtName} ({editingRecordData.districtCode})</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 block">Taluk:</span>
                                            <span className="font-semibold">{editingRecordData.taluk} ({editingRecordData.talukCode})</span>
                                        </div>
                                        <div>
                                            <span className="opacity-60 block">Station Code:</span>
                                            <span className="font-semibold">{editingRecordData.stationCode}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/20">
                                <button
                                    type="button"
                                    onClick={() => { setEditingRecordIndex(null); setEditingRecordData(null); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveEditRecord}
                                    className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-[#3b35c9] hover:bg-[#2c28a0] transition-colors shadow-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}