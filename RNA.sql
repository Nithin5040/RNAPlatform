--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATA; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "DATA";


ALTER SCHEMA "DATA" OWNER TO postgres;

--
-- Name: LKP; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "LKP";


ALTER SCHEMA "LKP" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AssignRoute; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."AssignRoute" (
    "AssignRouteId" integer NOT NULL,
    "ZoneMasterId" smallint NOT NULL,
    "RoutePlanId" smallint NOT NULL,
    "DriverDetailId" integer NOT NULL,
    "CreatedAt" timestamp without time zone,
    "CreatedByUserId" integer,
    "UpdatedAt" timestamp without time zone,
    "UpdatedByUserId" integer,
    "IsRouteSuccess" boolean DEFAULT false
);


ALTER TABLE "DATA"."AssignRoute" OWNER TO postgres;

--
-- Name: AssignRoute_AssignRouteId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."AssignRoute" ALTER COLUMN "AssignRouteId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."AssignRoute_AssignRouteId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: DriverDetail; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."DriverDetail" (
    "DriverDetailId" integer NOT NULL,
    "DriverName" character varying NOT NULL,
    "MobileNumber" character varying(50) NOT NULL,
    "TruckNumber" character varying,
    "Password" character varying,
    "CreatedAt" timestamp without time zone,
    "UpdatedAt" timestamp without time zone,
    "CreatedByUserId" integer,
    "IsDisabled" boolean DEFAULT false,
    "RoleId" smallint,
    "OdometerReading" integer
);


ALTER TABLE "DATA"."DriverDetail" OWNER TO postgres;

--
-- Name: DriverDetailFile; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."DriverDetailFile" (
    "DriverDetailFileId" integer NOT NULL,
    "DriverDetailId" integer NOT NULL,
    "FileTypeId" smallint,
    "FilePath" text,
    "IsDisabled" boolean DEFAULT false
);


ALTER TABLE "DATA"."DriverDetailFile" OWNER TO postgres;

--
-- Name: DriverDetailFile_DriverDetailFileId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."DriverDetailFile" ALTER COLUMN "DriverDetailFileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."DriverDetailFile_DriverDetailFileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: DriverDetail_DriverDetailId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."DriverDetail" ALTER COLUMN "DriverDetailId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."DriverDetail_DriverDetailId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ExcelData; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."ExcelData" (
    "ExcelDataId" integer NOT NULL,
    "UploadRouteExcelId" integer NOT NULL,
    "IsDisabled" boolean DEFAULT false,
    "Taluk" character varying,
    "Station" character varying,
    "VoltageClass" character varying,
    "InChangreAEJEname" character varying,
    "ContactNumber" character varying,
    "SubStationAddress" text,
    "PinCode" character varying,
    "Latitude" character varying,
    "Longitude" character varying
);


ALTER TABLE "DATA"."ExcelData" OWNER TO postgres;

--
-- Name: ExcelData_ExcelDataId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."ExcelData" ALTER COLUMN "ExcelDataId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."ExcelData_ExcelDataId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: RoutePlan; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."RoutePlan" (
    "RoutePlanId" smallint NOT NULL,
    "ZoneMasterId" smallint NOT NULL,
    "RoutePlanPoint" character varying(155) NOT NULL,
    "CreatedAt" timestamp without time zone,
    "UpdatedAt" timestamp without time zone,
    "CreatedByUserId" integer,
    "IsDisabled" boolean DEFAULT false
);


ALTER TABLE "DATA"."RoutePlan" OWNER TO postgres;

--
-- Name: RoutePlan_RoutePlanId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."RoutePlan" ALTER COLUMN "RoutePlanId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."RoutePlan_RoutePlanId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: RouteStationStatus; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."RouteStationStatus" (
    "RouteStationStatusId" integer NOT NULL,
    "AssignRouteId" integer NOT NULL,
    "ExcelDataId" integer NOT NULL,
    "StatusId" smallint DEFAULT 1 NOT NULL,
    "VisitedAt" timestamp without time zone,
    "Remarks" text,
    "CreatedAt" timestamp without time zone DEFAULT now(),
    "UpdatedAt" timestamp without time zone
);


ALTER TABLE "DATA"."RouteStationStatus" OWNER TO postgres;

--
-- Name: RouteStationStatus_RouteStationStatusId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."RouteStationStatus" ALTER COLUMN "RouteStationStatusId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."RouteStationStatus_RouteStationStatusId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: StationSubmission; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."StationSubmission" (
    "StationSubmissionId" integer NOT NULL,
    "RouteStationStatusId" integer NOT NULL,
    "Remarks" text,
    "CreatedAt" timestamp without time zone DEFAULT now(),
    "UpdatedAt" timestamp without time zone,
    "CreatedByDriverId" integer
);


ALTER TABLE "DATA"."StationSubmission" OWNER TO postgres;

--
-- Name: StationSubmissionFile; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."StationSubmissionFile" (
    "StationSubmissionFileId" integer NOT NULL,
    "StationSubmissionId" integer NOT NULL,
    "FileTypeId" smallint NOT NULL,
    "FileName" character varying(255),
    "FilePath" text NOT NULL,
    "CreatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE "DATA"."StationSubmissionFile" OWNER TO postgres;

--
-- Name: StationSubmissionFile_StationSubmissionFileId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."StationSubmissionFile" ALTER COLUMN "StationSubmissionFileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."StationSubmissionFile_StationSubmissionFileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: StationSubmission_StationSubmissionId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."StationSubmission" ALTER COLUMN "StationSubmissionId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."StationSubmission_StationSubmissionId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: UploadRouteExcel; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."UploadRouteExcel" (
    "UploadRouteExcelId" integer NOT NULL,
    "ZoneMasterId" smallint NOT NULL,
    "RoutePlanId" smallint NOT NULL,
    "ExcelFileName" character varying,
    "ExcelFilePath" text,
    "IsDisabled" boolean DEFAULT false,
    "CreatedAt" timestamp without time zone,
    "UpdatedAt" timestamp without time zone,
    "CreatedByUserId" integer,
    "IsRouteSuccess" boolean DEFAULT false
);


ALTER TABLE "DATA"."UploadRouteExcel" OWNER TO postgres;

--
-- Name: UploadRouteExcel_UploadRouteExcelId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."UploadRouteExcel" ALTER COLUMN "UploadRouteExcelId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."UploadRouteExcel_UploadRouteExcelId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: User; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."User" (
    "UserId" integer NOT NULL,
    "FirstName" character varying(50) NOT NULL,
    "LastName" character varying(50),
    "MobileNumber" character(10) NOT NULL,
    "Email" character varying(100),
    "Password" character varying(255),
    "RoleId" smallint,
    "GenderId" smallint,
    "IsDisabled" boolean DEFAULT false,
    "IsForcePasswordChange" boolean DEFAULT true,
    "CreatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CreatedByUserName" character varying(50),
    "UpdatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedByUserName" character varying(50)
);


ALTER TABLE "DATA"."User" OWNER TO postgres;

--
-- Name: UserZoneAccess; Type: TABLE; Schema: DATA; Owner: postgres
--

CREATE TABLE "DATA"."UserZoneAccess" (
    "UserZoneAccessId" integer NOT NULL,
    "UserId" integer,
    "ZoneMasterId" integer,
    "IsDisabled" boolean DEFAULT false,
    "CreatedAt" timestamp without time zone,
    "CreatedByUserId" integer,
    "UpdatedAt" timestamp without time zone,
    "UpdatedByUserId" integer
);


ALTER TABLE "DATA"."UserZoneAccess" OWNER TO postgres;

--
-- Name: UserZoneAccess_UserZoneAccessId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."UserZoneAccess" ALTER COLUMN "UserZoneAccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."UserZoneAccess_UserZoneAccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: User_UserId_seq; Type: SEQUENCE; Schema: DATA; Owner: postgres
--

ALTER TABLE "DATA"."User" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "DATA"."User_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: FileType; Type: TABLE; Schema: LKP; Owner: postgres
--

CREATE TABLE "LKP"."FileType" (
    "FileTypeId" smallint NOT NULL,
    "FileTypeName" character varying,
    "CreatedAt" timestamp without time zone,
    "CreatedByUserName" character varying,
    "IsDisbled" boolean DEFAULT false
);


ALTER TABLE "LKP"."FileType" OWNER TO postgres;

--
-- Name: FileType_FileTypeId_seq; Type: SEQUENCE; Schema: LKP; Owner: postgres
--

ALTER TABLE "LKP"."FileType" ALTER COLUMN "FileTypeId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "LKP"."FileType_FileTypeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Gender; Type: TABLE; Schema: LKP; Owner: postgres
--

CREATE TABLE "LKP"."Gender" (
    "GenderId" smallint NOT NULL,
    "GenderName" character varying(10) NOT NULL,
    "CreatedByUserName" character varying(50),
    "CreatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedByUserName" character varying(50),
    "UpdatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "IsDisabled" boolean DEFAULT false
);


ALTER TABLE "LKP"."Gender" OWNER TO postgres;

--
-- Name: Gender_GenderId_seq; Type: SEQUENCE; Schema: LKP; Owner: postgres
--

ALTER TABLE "LKP"."Gender" ALTER COLUMN "GenderId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "LKP"."Gender_GenderId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Role; Type: TABLE; Schema: LKP; Owner: postgres
--

CREATE TABLE "LKP"."Role" (
    "RoleId" smallint NOT NULL,
    "RoleName" character varying NOT NULL,
    "RoleCode" character varying,
    "CreatedAt" timestamp without time zone,
    "UpdatedAt" timestamp without time zone,
    "CreatedByUserName" character varying,
    "UpdatedByUserName" character varying,
    "IsDisabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE "LKP"."Role" OWNER TO postgres;

--
-- Name: Role_RoleId_seq; Type: SEQUENCE; Schema: LKP; Owner: postgres
--

ALTER TABLE "LKP"."Role" ALTER COLUMN "RoleId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "LKP"."Role_RoleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: StatusMaster; Type: TABLE; Schema: LKP; Owner: postgres
--

CREATE TABLE "LKP"."StatusMaster" (
    "StatusId" smallint NOT NULL,
    "StatusName" character varying(50) NOT NULL,
    "CreatedAt" timestamp without time zone
);


ALTER TABLE "LKP"."StatusMaster" OWNER TO postgres;

--
-- Name: StatusMaster_StatusId_seq; Type: SEQUENCE; Schema: LKP; Owner: postgres
--

ALTER TABLE "LKP"."StatusMaster" ALTER COLUMN "StatusId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "LKP"."StatusMaster_StatusId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ZoneMaster; Type: TABLE; Schema: LKP; Owner: postgres
--

CREATE TABLE "LKP"."ZoneMaster" (
    "ZoneMasterId" smallint NOT NULL,
    "ZoneMasterName" character varying(155) NOT NULL,
    "CreatedAt" timestamp without time zone,
    "UpdatedAt" timestamp without time zone,
    "CreatedByUserName" character varying,
    "UpdatedByUserName" character varying,
    "ZonePrefix" character varying(10),
    "IsDisabled" boolean DEFAULT false
);


ALTER TABLE "LKP"."ZoneMaster" OWNER TO postgres;

--
-- Name: ZoneMaster_ZoneMasterId_seq; Type: SEQUENCE; Schema: LKP; Owner: postgres
--

ALTER TABLE "LKP"."ZoneMaster" ALTER COLUMN "ZoneMasterId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "LKP"."ZoneMaster_ZoneMasterId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: AssignRoute; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."AssignRoute" ("AssignRouteId", "ZoneMasterId", "RoutePlanId", "DriverDetailId", "CreatedAt", "CreatedByUserId", "UpdatedAt", "UpdatedByUserId", "IsRouteSuccess") FROM stdin;
\.


--
-- Data for Name: DriverDetail; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."DriverDetail" ("DriverDetailId", "DriverName", "MobileNumber", "TruckNumber", "Password", "CreatedAt", "UpdatedAt", "CreatedByUserId", "IsDisabled", "RoleId", "OdometerReading") FROM stdin;
1	sathish	9977552266	KA102568	$2b$10$sFRxwCYKkpyR02kToZsoh.aHswzmfGtZ/mqtpkGE17qNeMrtAh18G	2026-07-21 16:05:39.812603	\N	1	f	3	\N
2	Yaaro	6522552255	KA61ME3256	$2b$10$LmTCK5P7LXbES2mwfHxTYerA3rbYY9IGqKzJBm8PNPzz9lKZ9RZuK	2026-07-21 16:14:20.834562	\N	1	f	3	\N
3	Yaavno	8555585588	KA0202222552	$2b$10$UAHe2LDm6wXt5U0m98ZhJ.kkvCMfKsloxtbZQ367gJ3Ce64e8NS8O	2026-07-21 16:16:08.339663	\N	1	f	3	\N
4	Manu	9855522554	KA5225525786545	$2b$10$2PPghkHOam4I2qjVlnHsyudAjNtsAOjwnpU91FNhrn8/EBJCT03Ta	2026-07-21 16:17:34.295692	\N	1	f	3	\N
5	Chethu	6362125856	KA41MA3636	$2b$10$dSMKWPbKv4A6ZFxsf.zXUes3b7lyrv2rkofzt1oVdgQsnWg28JyEu	2026-07-22 10:23:37.654653	\N	1	f	3	\N
6	praveen	8857875756	22222222	$2b$10$YkF04WC.f05StYdjLVrAa.u0dd4gnD6qUguYYliLb7Hu9DOVG/KGu	2026-07-23 13:52:51.632621	\N	1	f	3	200
\.


--
-- Data for Name: DriverDetailFile; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."DriverDetailFile" ("DriverDetailFileId", "DriverDetailId", "FileTypeId", "FilePath", "IsDisabled") FROM stdin;
1	1	1	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630139658_80345.png	f
2	1	2	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630139666_85158.png	f
3	2	1	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630660711_58579.jpeg	f
4	2	3	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630660712_87388.jpeg	f
5	3	4	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630768187_18314.jpeg	f
6	3	7	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630768196_72282.jpeg	f
7	4	2	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784630854135_65170.png	f
8	5	1	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784696017514_93837.jpeg	f
9	5	2	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784696017518_23993.jpeg	f
10	6	1	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784794971482_92391.png	f
11	6	2	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784794971487_61887.png	f
12	6	4	D:\\RNAPlatform\\RNAUpload\\DriverDetails\\Driver_1784794971489_45476.png	f
\.


--
-- Data for Name: ExcelData; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."ExcelData" ("ExcelDataId", "UploadRouteExcelId", "IsDisabled", "Taluk", "Station", "VoltageClass", "InChangreAEJEname", "ContactNumber", "SubStationAddress", "PinCode", "Latitude", "Longitude") FROM stdin;
\.


--
-- Data for Name: RoutePlan; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."RoutePlan" ("RoutePlanId", "ZoneMasterId", "RoutePlanPoint", "CreatedAt", "UpdatedAt", "CreatedByUserId", "IsDisabled") FROM stdin;
\.


--
-- Data for Name: RouteStationStatus; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."RouteStationStatus" ("RouteStationStatusId", "AssignRouteId", "ExcelDataId", "StatusId", "VisitedAt", "Remarks", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- Data for Name: StationSubmission; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."StationSubmission" ("StationSubmissionId", "RouteStationStatusId", "Remarks", "CreatedAt", "UpdatedAt", "CreatedByDriverId") FROM stdin;
\.


--
-- Data for Name: StationSubmissionFile; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."StationSubmissionFile" ("StationSubmissionFileId", "StationSubmissionId", "FileTypeId", "FileName", "FilePath", "CreatedAt") FROM stdin;
\.


--
-- Data for Name: UploadRouteExcel; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."UploadRouteExcel" ("UploadRouteExcelId", "ZoneMasterId", "RoutePlanId", "ExcelFileName", "ExcelFilePath", "IsDisabled", "CreatedAt", "UpdatedAt", "CreatedByUserId", "IsRouteSuccess") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."User" ("UserId", "FirstName", "LastName", "MobileNumber", "Email", "Password", "RoleId", "GenderId", "IsDisabled", "IsForcePasswordChange", "CreatedAt", "CreatedByUserName", "UpdatedAt", "UpdatedByUserName") FROM stdin;
1	Praveen	V	9876543210	praveen@example.com	$2b$10$jJ2Z3DkRs/mYRseL0OhbVOntTnQ8dIlSlfFBSZGppTiqS2WXYngiy	1	1	f	f	2026-07-18 15:30:30.952066	SYSTEM	2026-07-18 15:30:30.952066	SYSTEM
23	User	U	9955663322	user1@gmail.com	$2b$10$SaOhc0vkI7PSXVYD1yyMQeG0UvORjyo/ztaVDslWCn4B288TIAYZy	2	1	f	t	2026-07-21 13:52:32.974131	Admin	2026-07-21 13:52:32.974131	Admin
24	Adminn	A	9988556622	admin@gmail.com	$2b$10$v0jomZZUs/mh/JZQBzUn2u.TDEZ51PDvRn/s4OPqO0JH49rUvFjBe	1	1	f	t	2026-07-21 13:53:37.189533	Admin	2026-07-21 13:53:37.189533	Admin
25	Admin		9855985666		$2b$10$Zz6oVSY2GMuNqs8boh8ACuXfMAU6DXj.wfEv4.gvs5l4jBfMFG/ay	1	2	f	t	2026-07-21 17:22:00.931908	Admin	2026-07-21 17:22:00.931908	Admin
26	Darshan	\N	8310090155	\N	$2b$10$U8uIuALPFGnpLupOCfnOHeIeP5mVKwMK.TwQ2GEd1RyII91r7xqVa	1	1	f	t	2026-07-21 17:37:30.658749	Praveen V	2026-07-21 17:37:30.658749	Praveen V
\.


--
-- Data for Name: UserZoneAccess; Type: TABLE DATA; Schema: DATA; Owner: postgres
--

COPY "DATA"."UserZoneAccess" ("UserZoneAccessId", "UserId", "ZoneMasterId", "IsDisabled", "CreatedAt", "CreatedByUserId", "UpdatedAt", "UpdatedByUserId") FROM stdin;
\.


--
-- Data for Name: FileType; Type: TABLE DATA; Schema: LKP; Owner: postgres
--

COPY "LKP"."FileType" ("FileTypeId", "FileTypeName", "CreatedAt", "CreatedByUserName", "IsDisbled") FROM stdin;
1	DriverPhoto	2026-07-21 15:12:09.128231	\N	f
2	DriverAadhar	2026-07-21 15:12:30.367726	\N	f
3	OdometerPhoto	2026-07-21 15:12:51.861133	\N	f
4	TruckPhoto	2026-07-21 15:13:04.738246	\N	f
5	RC Card	2026-07-21 15:13:19.33997	\N	f
6	FC File	2026-07-21 15:13:33.82793	\N	f
7	Permit File	2026-07-21 15:13:43.658782	\N	f
8	DC Photo	2026-07-22 12:42:59.389168	\N	f
9	Annexure Phto	2026-07-22 12:43:48.638678	\N	f
10	Box Photo	2026-07-22 13:30:19.404901	\N	f
\.


--
-- Data for Name: Gender; Type: TABLE DATA; Schema: LKP; Owner: postgres
--

COPY "LKP"."Gender" ("GenderId", "GenderName", "CreatedByUserName", "CreatedAt", "UpdatedByUserName", "UpdatedAt", "IsDisabled") FROM stdin;
1	Male	SYSTEM	2026-07-18 12:27:49.888318	SYSTEM	2026-07-18 12:27:49.888318	f
2	Female	SYSTEM	2026-07-18 12:27:49.888318	SYSTEM	2026-07-18 12:27:49.888318	f
3	Other	SYSTEM	2026-07-18 12:27:49.888318	SYSTEM	2026-07-18 12:27:49.888318	f
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: LKP; Owner: postgres
--

COPY "LKP"."Role" ("RoleId", "RoleName", "RoleCode", "CreatedAt", "UpdatedAt", "CreatedByUserName", "UpdatedByUserName", "IsDisabled") FROM stdin;
1	Admin	SUPER_ADMIN	2026-07-18 12:43:03.84629	2026-07-18 12:43:03.84629	SYSTEM	SYSTEM	f
2	Warehouse(User)	ADMIN	2026-07-18 12:43:03.84629	2026-07-18 12:43:03.84629	SYSTEM	SYSTEM	f
3	Driver(User)	ZONE_ADMIN	2026-07-18 12:43:03.84629	2026-07-18 12:43:03.84629	SYSTEM	SYSTEM	f
\.


--
-- Data for Name: StatusMaster; Type: TABLE DATA; Schema: LKP; Owner: postgres
--

COPY "LKP"."StatusMaster" ("StatusId", "StatusName", "CreatedAt") FROM stdin;
1	Pending	\N
2	In Progress	\N
3	Completed	\N
4	Skipped	\N
5	Failed	\N
\.


--
-- Data for Name: ZoneMaster; Type: TABLE DATA; Schema: LKP; Owner: postgres
--

COPY "LKP"."ZoneMaster" ("ZoneMasterId", "ZoneMasterName", "CreatedAt", "UpdatedAt", "CreatedByUserName", "UpdatedByUserName", "ZonePrefix", "IsDisabled") FROM stdin;
1	TUMKURU	2026-07-21 10:02:41.422076	\N	\N	\N	TMK	f
2	MYSURU	2026-07-21 10:02:53.558236	\N	\N	\N	MYS	f
3	HASSAN	2026-07-21 10:03:04.87861	\N	\N	\N	HSN	f
4	BANGALORE	2026-07-21 10:05:58.244246	\N	\N	\N	BLR	f
5	KALABURAGI	2026-07-21 10:06:12.300571	\N	\N	\N	KLB	f
6	BAGALKOTE	2026-07-21 10:06:41.545283	\N	\N	\N	BGK	f
\.


--
-- Name: AssignRoute_AssignRouteId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."AssignRoute_AssignRouteId_seq"', 1, false);


--
-- Name: DriverDetailFile_DriverDetailFileId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."DriverDetailFile_DriverDetailFileId_seq"', 12, true);


--
-- Name: DriverDetail_DriverDetailId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."DriverDetail_DriverDetailId_seq"', 6, true);


--
-- Name: ExcelData_ExcelDataId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."ExcelData_ExcelDataId_seq"', 1, false);


--
-- Name: RoutePlan_RoutePlanId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."RoutePlan_RoutePlanId_seq"', 1, false);


--
-- Name: RouteStationStatus_RouteStationStatusId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."RouteStationStatus_RouteStationStatusId_seq"', 1, false);


--
-- Name: StationSubmissionFile_StationSubmissionFileId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."StationSubmissionFile_StationSubmissionFileId_seq"', 1, false);


--
-- Name: StationSubmission_StationSubmissionId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."StationSubmission_StationSubmissionId_seq"', 1, false);


--
-- Name: UploadRouteExcel_UploadRouteExcelId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."UploadRouteExcel_UploadRouteExcelId_seq"', 1, false);


--
-- Name: UserZoneAccess_UserZoneAccessId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."UserZoneAccess_UserZoneAccessId_seq"', 16, true);


--
-- Name: User_UserId_seq; Type: SEQUENCE SET; Schema: DATA; Owner: postgres
--

SELECT pg_catalog.setval('"DATA"."User_UserId_seq"', 26, true);


--
-- Name: FileType_FileTypeId_seq; Type: SEQUENCE SET; Schema: LKP; Owner: postgres
--

SELECT pg_catalog.setval('"LKP"."FileType_FileTypeId_seq"', 10, true);


--
-- Name: Gender_GenderId_seq; Type: SEQUENCE SET; Schema: LKP; Owner: postgres
--

SELECT pg_catalog.setval('"LKP"."Gender_GenderId_seq"', 3, true);


--
-- Name: Role_RoleId_seq; Type: SEQUENCE SET; Schema: LKP; Owner: postgres
--

SELECT pg_catalog.setval('"LKP"."Role_RoleId_seq"', 3, true);


--
-- Name: StatusMaster_StatusId_seq; Type: SEQUENCE SET; Schema: LKP; Owner: postgres
--

SELECT pg_catalog.setval('"LKP"."StatusMaster_StatusId_seq"', 5, true);


--
-- Name: ZoneMaster_ZoneMasterId_seq; Type: SEQUENCE SET; Schema: LKP; Owner: postgres
--

SELECT pg_catalog.setval('"LKP"."ZoneMaster_ZoneMasterId_seq"', 6, true);


--
-- Name: AssignRoute AssignRoute_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "AssignRoute_pkey" PRIMARY KEY ("AssignRouteId");


--
-- Name: DriverDetailFile DriverDetailFile_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetailFile"
    ADD CONSTRAINT "DriverDetailFile_pkey" PRIMARY KEY ("DriverDetailFileId");


--
-- Name: DriverDetail DriverDetail_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetail"
    ADD CONSTRAINT "DriverDetail_pkey" PRIMARY KEY ("DriverDetailId");


--
-- Name: ExcelData ExcelData_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."ExcelData"
    ADD CONSTRAINT "ExcelData_pkey" PRIMARY KEY ("ExcelDataId");


--
-- Name: UserZoneAccess PK_UserZoneAccess; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UserZoneAccess"
    ADD CONSTRAINT "PK_UserZoneAccess" PRIMARY KEY ("UserZoneAccessId");


--
-- Name: RoutePlan RoutePlan_RoutePlanPoint_key; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RoutePlan"
    ADD CONSTRAINT "RoutePlan_RoutePlanPoint_key" UNIQUE ("RoutePlanPoint");


--
-- Name: RoutePlan RoutePlan_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RoutePlan"
    ADD CONSTRAINT "RoutePlan_pkey" PRIMARY KEY ("RoutePlanId");


--
-- Name: RouteStationStatus RouteStationStatus_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RouteStationStatus"
    ADD CONSTRAINT "RouteStationStatus_pkey" PRIMARY KEY ("RouteStationStatusId");


--
-- Name: StationSubmissionFile StationSubmissionFile_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmissionFile"
    ADD CONSTRAINT "StationSubmissionFile_pkey" PRIMARY KEY ("StationSubmissionFileId");


--
-- Name: StationSubmission StationSubmission_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmission"
    ADD CONSTRAINT "StationSubmission_pkey" PRIMARY KEY ("StationSubmissionId");


--
-- Name: UploadRouteExcel UploadRouteExcel_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UploadRouteExcel"
    ADD CONSTRAINT "UploadRouteExcel_pkey" PRIMARY KEY ("UploadRouteExcelId");


--
-- Name: User User_Email_key; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."User"
    ADD CONSTRAINT "User_Email_key" UNIQUE ("Email");


--
-- Name: User User_MobileNumber_key; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."User"
    ADD CONSTRAINT "User_MobileNumber_key" UNIQUE ("MobileNumber");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserId");


--
-- Name: FileType FileType_pkey; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."FileType"
    ADD CONSTRAINT "FileType_pkey" PRIMARY KEY ("FileTypeId");


--
-- Name: Gender Gender_pkey; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."Gender"
    ADD CONSTRAINT "Gender_pkey" PRIMARY KEY ("GenderId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("RoleId");


--
-- Name: StatusMaster StatusMaster_StatusName_key; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."StatusMaster"
    ADD CONSTRAINT "StatusMaster_StatusName_key" UNIQUE ("StatusName");


--
-- Name: StatusMaster StatusMaster_pkey; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."StatusMaster"
    ADD CONSTRAINT "StatusMaster_pkey" PRIMARY KEY ("StatusId");


--
-- Name: ZoneMaster ZoneMaster_pkey; Type: CONSTRAINT; Schema: LKP; Owner: postgres
--

ALTER TABLE ONLY "LKP"."ZoneMaster"
    ADD CONSTRAINT "ZoneMaster_pkey" PRIMARY KEY ("ZoneMasterId");


--
-- Name: IX_Gender_00; Type: INDEX; Schema: LKP; Owner: postgres
--

CREATE INDEX "IX_Gender_00" ON "LKP"."Gender" USING btree ("GenderId", "GenderName") WITH (fillfactor='90');


--
-- Name: IX_Gender_01; Type: INDEX; Schema: LKP; Owner: postgres
--

CREATE INDEX "IX_Gender_01" ON "LKP"."Gender" USING btree ("CreatedAt", "UpdatedAt") WITH (fillfactor='90');


--
-- Name: RouteStationStatus FK_AssignRoute; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RouteStationStatus"
    ADD CONSTRAINT "FK_AssignRoute" FOREIGN KEY ("AssignRouteId") REFERENCES "DATA"."AssignRoute"("AssignRouteId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignRoute FK_DriverDetail; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "FK_DriverDetail" FOREIGN KEY ("DriverDetailId") REFERENCES "DATA"."DriverDetail"("DriverDetailId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DriverDetailFile FK_DriverDetailId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetailFile"
    ADD CONSTRAINT "FK_DriverDetailId" FOREIGN KEY ("DriverDetailId") REFERENCES "DATA"."DriverDetail"("DriverDetailId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DriverDetail FK_DriverDetail_RoleId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetail"
    ADD CONSTRAINT "FK_DriverDetail_RoleId" FOREIGN KEY ("RoleId") REFERENCES "LKP"."Role"("RoleId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RouteStationStatus FK_ExcelData; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RouteStationStatus"
    ADD CONSTRAINT "FK_ExcelData" FOREIGN KEY ("ExcelDataId") REFERENCES "DATA"."ExcelData"("ExcelDataId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DriverDetailFile FK_FileType; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetailFile"
    ADD CONSTRAINT "FK_FileType" FOREIGN KEY ("FileTypeId") REFERENCES "LKP"."FileType"("FileTypeId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StationSubmissionFile FK_FileType; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmissionFile"
    ADD CONSTRAINT "FK_FileType" FOREIGN KEY ("FileTypeId") REFERENCES "LKP"."FileType"("FileTypeId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignRoute FK_RoutePlan; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "FK_RoutePlan" FOREIGN KEY ("RoutePlanId") REFERENCES "DATA"."RoutePlan"("RoutePlanId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UploadRouteExcel FK_RoutePlan; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UploadRouteExcel"
    ADD CONSTRAINT "FK_RoutePlan" FOREIGN KEY ("RoutePlanId") REFERENCES "DATA"."RoutePlan"("RoutePlanId");


--
-- Name: RoutePlan FK_RoutePlan_ZoneMasterId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RoutePlan"
    ADD CONSTRAINT "FK_RoutePlan_ZoneMasterId" FOREIGN KEY ("ZoneMasterId") REFERENCES "LKP"."ZoneMaster"("ZoneMasterId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StationSubmissionFile FK_StationSubmission; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmissionFile"
    ADD CONSTRAINT "FK_StationSubmission" FOREIGN KEY ("StationSubmissionId") REFERENCES "DATA"."StationSubmission"("StationSubmissionId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StationSubmission FK_StationSubmission_RouteStationStatus; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmission"
    ADD CONSTRAINT "FK_StationSubmission_RouteStationStatus" FOREIGN KEY ("RouteStationStatusId") REFERENCES "DATA"."RouteStationStatus"("RouteStationStatusId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StationSubmission FK_StationSubmission_User; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."StationSubmission"
    ADD CONSTRAINT "FK_StationSubmission_User" FOREIGN KEY ("CreatedByDriverId") REFERENCES "DATA"."DriverDetail"("DriverDetailId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RouteStationStatus FK_Status; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RouteStationStatus"
    ADD CONSTRAINT "FK_Status" FOREIGN KEY ("StatusId") REFERENCES "LKP"."StatusMaster"("StatusId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExcelData FK_UploadRouteExcel; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."ExcelData"
    ADD CONSTRAINT "FK_UploadRouteExcel" FOREIGN KEY ("UploadRouteExcelId") REFERENCES "DATA"."UploadRouteExcel"("UploadRouteExcelId");


--
-- Name: DriverDetail FK_User; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."DriverDetail"
    ADD CONSTRAINT "FK_User" FOREIGN KEY ("CreatedByUserId") REFERENCES "DATA"."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UploadRouteExcel FK_User; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UploadRouteExcel"
    ADD CONSTRAINT "FK_User" FOREIGN KEY ("CreatedByUserId") REFERENCES "DATA"."User"("UserId");


--
-- Name: UserZoneAccess FK_UserZoneAccess_User; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UserZoneAccess"
    ADD CONSTRAINT "FK_UserZoneAccess_User" FOREIGN KEY ("UserId") REFERENCES "DATA"."User"("UserId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User FK_User_Gender; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."User"
    ADD CONSTRAINT "FK_User_Gender" FOREIGN KEY ("GenderId") REFERENCES "LKP"."Gender"("GenderId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User FK_User_Role; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."User"
    ADD CONSTRAINT "FK_User_Role" FOREIGN KEY ("RoleId") REFERENCES "LKP"."Role"("RoleId");


--
-- Name: AssignRoute FK_User_UpdatedByUserId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "FK_User_UpdatedByUserId" FOREIGN KEY ("UpdatedByUserId") REFERENCES "DATA"."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignRoute FK_User_UserId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "FK_User_UserId" FOREIGN KEY ("CreatedByUserId") REFERENCES "DATA"."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RoutePlan FK_User_UserId; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."RoutePlan"
    ADD CONSTRAINT "FK_User_UserId" FOREIGN KEY ("CreatedByUserId") REFERENCES "DATA"."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignRoute FK_ZoneMaster; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."AssignRoute"
    ADD CONSTRAINT "FK_ZoneMaster" FOREIGN KEY ("ZoneMasterId") REFERENCES "LKP"."ZoneMaster"("ZoneMasterId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UploadRouteExcel FK_ZoneMaster; Type: FK CONSTRAINT; Schema: DATA; Owner: postgres
--

ALTER TABLE ONLY "DATA"."UploadRouteExcel"
    ADD CONSTRAINT "FK_ZoneMaster" FOREIGN KEY ("ZoneMasterId") REFERENCES "LKP"."ZoneMaster"("ZoneMasterId");


--
-- PostgreSQL database dump complete
--

