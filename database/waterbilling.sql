-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 30, 2024 at 03:17 AM
-- Server version: 8.0.39-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waterbilling`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `activity_id` int NOT NULL,
  `activity_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `table_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`activity_id`, `activity_type`, `table_name`, `date_added`, `employee_Id`) VALUES
(1, 'Add', 'Position', '2024-10-17', 1),
(2, 'Add', 'Position', '2024-10-17', 1),
(3, 'Add', 'Position', '2024-10-17', 1),
(4, 'Add', 'Position', '2024-10-17', 1),
(5, 'Add', 'Employee', '2024-10-17', 1),
(6, 'Add', 'Employee', '2024-10-17', 1),
(7, 'Update', 'Employee', '2024-10-17', 1),
(8, 'Update', 'Employee', '2024-10-17', 1),
(9, 'Update', 'Employee', '2024-10-17', 1),
(10, 'Update', 'Employee', '2024-10-17', 1),
(11, 'Update', 'Employee', '2024-10-17', 1),
(12, 'Update', 'Employee', '2024-10-17', 1),
(13, 'Add', 'Employee', '2024-10-17', 1),
(14, 'Add', 'Employee', '2024-10-17', 1),
(15, 'Add', 'Property', '2024-10-17', 1),
(16, 'Add', 'Property', '2024-10-17', 1),
(17, 'Add', 'Rate', '2024-10-17', 1),
(18, 'Add', 'Consumer Type', '2024-10-17', 1),
(19, 'Add', 'Consumer', '2024-10-17', 1),
(20, 'Add', 'Barangay', '2024-10-17', 1),
(21, 'Add', 'Zone', '2024-10-17', 1),
(22, 'Add', 'Branch', '2024-10-17', 1),
(23, 'Add', 'Consumer', '2024-10-19', 1),
(24, 'Add', 'Consumer', '2024-10-19', 1),
(25, 'Add', 'Consumer Type', '2024-10-20', 1),
(26, 'Edit', 'Consumer Type', '2024-10-20', 1),
(27, 'Edit', 'Consumer Type', '2024-10-20', 1),
(28, 'Add', 'Consumer Type', '2024-10-20', 1),
(29, 'Edit', 'Branch', '2024-10-20', 1),
(30, 'Edit', 'Branch', '2024-10-20', 1),
(31, 'Edit', 'Branch', '2024-10-20', 1),
(32, 'Edit', 'Branch', '2024-10-20', 1),
(33, 'Edit', 'Branch', '2024-10-20', 1),
(34, 'Edit', 'Branch', '2024-10-20', 1),
(35, 'Edit', 'Branch', '2024-10-20', 1),
(36, 'Edit', 'Branch', '2024-10-20', 1),
(37, 'Edit', 'Branch', '2024-10-20', 1),
(38, 'Add', 'Branch', '2024-10-20', 1),
(39, 'Edit', 'Branch', '2024-10-20', 1),
(40, 'Edit', 'Branch', '2024-10-20', 1),
(41, 'Edit', 'Branch', '2024-10-20', 1),
(42, 'Edit', 'Branch', '2024-10-20', 1),
(43, 'Edit', 'Branch', '2024-10-20', 1),
(44, 'Edit', 'Branch', '2024-10-20', 1),
(45, 'Edit', 'Branch', '2024-10-20', 1),
(46, 'Edit', 'Rate', '2024-10-21', 1),
(47, 'Edit', 'Rate', '2024-10-21', 1),
(48, 'Add', 'Rate', '2024-10-21', 1),
(49, 'Add', 'Assign', '2024-10-21', 3),
(50, 'Add', 'Zone', '2024-10-21', 1),
(51, 'Add', 'Zone', '2024-10-21', 1),
(52, 'Add', 'Employee', '2024-10-21', 1),
(53, 'Add', 'Assign', '2024-10-21', 1),
(54, 'Add', 'Assign', '2024-10-21', 1),
(55, 'Add', 'Assign', '2024-10-21', 1),
(56, 'Add', 'Assign', '2024-10-21', 1),
(57, 'Add', 'Billing', '2024-10-21', 5),
(58, 'Add', 'Billing', '2024-10-22', 5),
(59, 'Add', 'Billing', '2024-10-22', 5),
(60, 'Add', 'Billing', '2024-10-22', 5),
(61, 'Add', 'Billing', '2024-10-22', 5),
(62, 'Add', 'Billing', '2024-10-22', 5),
(63, 'Add', 'Billing', '2024-10-22', 5),
(64, 'Add', 'Billing', '2024-10-22', 5),
(65, 'Add', 'Billing', '2024-10-22', 5),
(66, 'Add', 'Billing', '2024-10-22', 5),
(67, 'Add', 'Billing', '2024-10-22', 5),
(68, 'Add', 'Billing', '2024-10-22', 5),
(69, 'Add', 'Billing', '2024-10-22', 5),
(70, 'Add', 'Billing', '2024-10-22', 5),
(71, 'Add', 'Billing', '2024-10-22', 5),
(72, 'Add', 'Billing', '2024-10-23', 5),
(73, 'Add', 'Billing', '2024-10-24', 5),
(74, 'Edit', 'Branch', '2024-10-25', 1),
(75, 'Add', 'Billing', '2024-10-26', 5),
(76, 'Add', 'Billing', '2024-10-26', 5),
(77, 'Add', 'Billing', '2024-10-26', 5),
(78, 'Add', 'Billing', '2024-10-26', 5),
(79, 'Add', 'Billing', '2024-10-26', 5),
(80, 'Add', 'Payment', '2024-10-26', 4),
(81, 'Remove', 'Assigned', '2024-10-26', 1),
(82, 'Remove', 'Assigned', '2024-10-26', 1),
(83, 'Edit', 'Consumer', '2024-10-27', 1),
(84, 'Edit', 'Consumer', '2024-10-27', 1),
(85, 'Add', 'Consumer', '2024-10-27', 4),
(86, 'Add', 'Billing', '2024-10-28', 5),
(87, 'Add', 'Payment', '2024-10-28', 4);

-- --------------------------------------------------------

--
-- Table structure for table `address_barangay`
--

CREATE TABLE `address_barangay` (
  `barangay_id` int NOT NULL,
  `barangay_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `municipalityId` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address_barangay`
--

INSERT INTO `address_barangay` (`barangay_id`, `barangay_name`, `municipalityId`, `date_added`, `employee_Id`) VALUES
(1, 'Poblacion', 1, '2024-10-17', 1),
(2, 'Molugan', 1, '2024-10-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `address_municipality`
--

CREATE TABLE `address_municipality` (
  `municipality_id` int NOT NULL,
  `municipality_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address_municipality`
--

INSERT INTO `address_municipality` (`municipality_id`, `municipality_name`, `date_added`, `employee_Id`) VALUES
(1, 'El Salvador City', '2024-10-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `address_zone`
--

CREATE TABLE `address_zone` (
  `zone_id` int NOT NULL,
  `zone_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `barangayId` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address_zone`
--

INSERT INTO `address_zone` (`zone_id`, `zone_name`, `barangayId`, `date_added`, `employee_Id`) VALUES
(1, 'Zone 1', 1, '2024-10-17', 1),
(2, 'Zone 1', 2, '2024-10-17', 1),
(3, 'Zone 2', 1, '2024-10-21', 1),
(4, 'Zone 2', 2, '2024-10-21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `assign`
--

CREATE TABLE `assign` (
  `assign_id` int NOT NULL,
  `emp_Id` int NOT NULL,
  `zone_Id` int NOT NULL,
  `branchId` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `assign_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assign`
--

INSERT INTO `assign` (`assign_id`, `emp_Id`, `zone_Id`, `branchId`, `date_added`, `employee_Id`, `assign_statusId`) VALUES
(1, 5, 1, 1, '2024-10-21', 3, 1),
(5, 6, 3, 1, '2024-10-21', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `bill_id` int NOT NULL,
  `bill_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`bill_id`, `bill_name`) VALUES
(1, 'Bill'),
(2, 'None');

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `billing_id` int NOT NULL,
  `billing_uniqueId` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `consumerId` int NOT NULL,
  `readerId` int NOT NULL,
  `branchId` int NOT NULL,
  `prev_cubic_consumed` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cubic_consumed` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `reading_date` datetime NOT NULL,
  `due_date` date NOT NULL,
  `period_cover` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `previous_meter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `present_meter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount_amount` decimal(7,2) NOT NULL,
  `bill_amount` decimal(7,2) NOT NULL,
  `arrears` decimal(7,2) NOT NULL,
  `total_bill` decimal(7,2) NOT NULL,
  `billing_statusId` int NOT NULL,
  `billing_update_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`billing_id`, `billing_uniqueId`, `consumerId`, `readerId`, `branchId`, `prev_cubic_consumed`, `cubic_consumed`, `reading_date`, `due_date`, `period_cover`, `previous_meter`, `present_meter`, `discount_amount`, `bill_amount`, `arrears`, `total_bill`, `billing_statusId`, `billing_update_statusId`) VALUES
(1, 'CWB-5-2410-001', 1, 5, 1, '0', '80', '2024-10-22 12:10:40', '2024-11-11', 'September 26 to October 25, 2024', '0', '80', 82.00, 820.00, 0.00, 738.00, 1, 2),
(2, 'CWB-5-2410-002', 1, 5, 1, '80', '80', '2024-10-22 12:39:51', '2024-11-11', 'September 26 to October 25, 2024', '80', '160', 82.00, 820.00, 738.00, 1476.00, 1, 1),
(3, 'CWB-5-2410-003', 1, 5, 1, '80', '80', '2024-10-23 09:24:12', '2024-11-12', 'September 26 to October 25, 2024', '160', '240', 82.00, 820.00, 0.00, 738.00, 1, 1),
(4, 'CWB-5-2410-004', 1, 5, 1, '80', '80', '2024-10-24 22:43:54', '2024-11-13', 'September 26 to October 25, 2024', '240', '320', 82.00, 820.00, 0.00, 738.00, 1, 1),
(5, 'CWB-5-2410-005', 1, 5, 1, '80', '80', '2024-10-26 10:33:36', '2024-11-15', 'September 26 to October 25, 2024', '320', '400', 82.00, 820.00, 0.00, 738.00, 1, 1),
(6, 'CWB-5-2410-006', 1, 5, 1, '80', '80', '2024-10-26 10:40:44', '2024-11-15', 'September 26 to October 25, 2024', '400', '480', 82.00, 820.00, 0.00, 738.00, 1, 1),
(7, 'CWB-5-2410-007', 1, 5, 1, '80', '80', '2024-10-26 11:21:54', '2024-11-15', 'September 26 to October 25, 2024', '480', '560', 82.00, 820.00, 0.00, 738.00, 1, 1),
(8, 'CWB-5-2410-008', 1, 5, 1, '80', '80', '2024-10-26 11:24:42', '2024-11-15', 'September 26 to October 25, 2024', '560', '640', 82.00, 820.00, 0.00, 738.00, 1, 1),
(9, 'CWB-5-2410-009', 1, 5, 1, '80', '80', '2024-10-26 11:29:42', '2024-11-15', 'September 26 to October 25, 2024', '640', '720', 82.00, 820.00, 0.00, 738.00, 1, 1),
(10, 'CWB-5-2410-010', 1, 5, 1, '80', '80', '2024-10-28 10:46:20', '2024-11-17', 'September 26 to October 25, 2024', '720', '800', 82.00, 820.00, 0.00, 738.00, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `billing_status`
--

CREATE TABLE `billing_status` (
  `billing_status_id` int NOT NULL,
  `billing_status_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing_status`
--

INSERT INTO `billing_status` (`billing_status_id`, `billing_status_name`) VALUES
(1, 'Old'),
(2, 'New');

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `branch_id` int NOT NULL,
  `branch_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `locationId` int NOT NULL,
  `phone_num` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `branch_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`branch_id`, `branch_name`, `locationId`, `phone_num`, `date_added`, `employee_Id`, `branch_statusId`) VALUES
(1, 'Poblacion', 1, '09352194065', '2024-10-17', 1, 1),
(2, 'Molugan', 2, '9352291723', '2024-10-17', 1, 1),
(3, 'Poblacion 2', 1, '9201234567', '2024-10-20', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `changinng_meter`
--

CREATE TABLE `changinng_meter` (
  `id` int NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_no` int NOT NULL,
  `addressId` int NOT NULL,
  `propertyId` int NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `old_meter_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `positionId` int NOT NULL,
  `branchId` int NOT NULL,
  `statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consumer_type`
--

CREATE TABLE `consumer_type` (
  `consumertype_id` int NOT NULL,
  `consumertype` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount_percent` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `consumertype_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumer_type`
--

INSERT INTO `consumer_type` (`consumertype_id`, `consumertype`, `discount_percent`, `date_added`, `employee_Id`, `consumertype_statusId`) VALUES
(1, 'Regular', 0, '2024-10-17', 1, 1),
(2, 'Seniors', 10, '2024-10-20', 1, 1),
(3, 'PWD', 10, '2024-10-20', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `flunctuation`
--

CREATE TABLE `flunctuation` (
  `flunctuation_id` int NOT NULL,
  `flunctuation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `flunctuation_range` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_status`
--

CREATE TABLE `login_status` (
  `login_status_id` int NOT NULL,
  `login_status_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_status`
--

INSERT INTO `login_status` (`login_status_id`, `login_status_type`) VALUES
(1, 'Online'),
(2, 'Offline');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `pay_id` int NOT NULL,
  `payment_uniqueId` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `pay_consumerId` int NOT NULL,
  `pay_employeeId` int NOT NULL,
  `billingId` int NOT NULL,
  `or_num` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `pay_amount` decimal(7,2) NOT NULL,
  `pay_change` decimal(7,2) NOT NULL,
  `pay_balance` decimal(7,2) NOT NULL,
  `pay_date` date NOT NULL,
  `branchId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`pay_id`, `payment_uniqueId`, `pay_consumerId`, `pay_employeeId`, `billingId`, `or_num`, `pay_amount`, `pay_change`, `pay_balance`, `pay_date`, `branchId`) VALUES
(1, 'CWP-4-2410-001', 1, 4, 2, '1234566789', 1476.00, 0.00, 0.00, '2024-10-23', 1),
(2, 'CWP-4-2410-002', 1, 4, 3, '987654321', 738.00, 0.00, 0.00, '2024-10-23', 1),
(3, 'CWP-4-2410-003', 1, 4, 4, '23718236441', 738.00, 0.00, 0.00, '2024-10-24', 1),
(4, 'CWP-4-2410-004', 1, 4, 5, '738', 738.00, 0.00, 0.00, '2024-10-26', 1),
(5, 'CWP-4-2410-005', 1, 4, 6, '273891236', 738.00, 0.00, 0.00, '2024-10-26', 1),
(6, 'CWP-4-2410-006', 1, 4, 7, '21312451243', 738.00, 0.00, 0.00, '2024-10-26', 1),
(7, 'CWP-4-2410-007', 1, 4, 8, '453434522', 738.00, 0.00, 0.00, '2024-10-26', 1),
(8, 'CWP-4-2410-008', 1, 4, 9, '1235543243', 738.00, 0.00, 0.00, '2024-10-26', 1),
(9, 'CWP-4-2410-009', 1, 4, 10, '128316374', 738.00, 0.00, 0.00, '2024-10-28', 1);

-- --------------------------------------------------------

--
-- Table structure for table `position`
--

CREATE TABLE `position` (
  `position_id` int NOT NULL,
  `position_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `position_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `position`
--

INSERT INTO `position` (`position_id`, `position_name`, `date_added`, `employee_Id`, `position_statusId`) VALUES
(1, 'Admin', '2024-10-17', 1, 1),
(2, 'Head', '2024-10-17', 1, 1),
(3, 'Clerk', '2024-10-17', 1, 1),
(4, 'Meter Reader', '2024-10-17', 1, 1),
(5, 'Plumber', '2024-10-17', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `property_id` int NOT NULL,
  `property_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `property_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`property_id`, `property_name`, `date_added`, `employee_Id`, `property_statusId`) VALUES
(1, 'Residential', '2024-10-17', 1, 1),
(2, 'Commercial', '2024-10-17', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `property_rate`
--

CREATE TABLE `property_rate` (
  `rate_id` int NOT NULL,
  `property_Id` int NOT NULL,
  `minimum_rate` decimal(7,2) NOT NULL,
  `second_rate` decimal(7,2) NOT NULL,
  `third_rate` decimal(7,2) NOT NULL,
  `last_rate` decimal(7,2) NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `rate_statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_rate`
--

INSERT INTO `property_rate` (`rate_id`, `property_Id`, `minimum_rate`, `second_rate`, `third_rate`, `last_rate`, `date_added`, `employee_Id`, `rate_statusId`) VALUES
(1, 1, 80.00, 9.00, 10.00, 11.00, '2024-10-17', 1, 1),
(2, 2, 80.00, 10.00, 11.00, 12.00, '2024-10-21', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int NOT NULL,
  `status_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_name`) VALUES
(1, 'Active'),
(2, 'Inactive');

-- --------------------------------------------------------

--
-- Table structure for table `suffix`
--

CREATE TABLE `suffix` (
  `suffix_id` int NOT NULL,
  `suffix_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suffix`
--

INSERT INTO `suffix` (`suffix_id`, `suffix_name`, `date_added`, `employee_Id`) VALUES
(1, 'none', '2024-10-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `update_status`
--

CREATE TABLE `update_status` (
  `update_status_id` int NOT NULL,
  `update_status_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `update_status`
--

INSERT INTO `update_status` (`update_status_id`, `update_status_name`) VALUES
(1, 'Paid'),
(2, 'Unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `user_consumer`
--

CREATE TABLE `user_consumer` (
  `user_id` int NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `suffixId` int NOT NULL,
  `connected_parentId` int DEFAULT NULL,
  `connected_number` int NOT NULL,
  `phone_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `addressId` int NOT NULL,
  `propertyId` int NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `house_no` int NOT NULL,
  `meter_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'waterworks',
  `total_cubic_consumed` int NOT NULL,
  `positionId` int NOT NULL,
  `consumertypeId` int NOT NULL,
  `branchId` int NOT NULL,
  `statusId` int NOT NULL,
  `login_statusId` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL,
  `billing_status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_consumer`
--

INSERT INTO `user_consumer` (`user_id`, `firstname`, `middlename`, `lastname`, `suffixId`, `connected_parentId`, `connected_number`, `phone_no`, `addressId`, `propertyId`, `email`, `code`, `house_no`, `meter_no`, `password`, `total_cubic_consumed`, `positionId`, `consumertypeId`, `branchId`, `statusId`, `login_statusId`, `date_added`, `employee_Id`, `billing_status`) VALUES
(1, 'Anesia', 'A', 'Abellanosa', 1, 0, 0, '09352929345', 1, 1, 'Anesia@gmail.com', '', 0, '123456', '7c6d7f41f739a117e6fc468d9924ca40', 800, 5, 2, 1, 1, 2, '2024-10-17', 1, 1),
(2, 'Fabian', 'A', 'Abellanosa', 1, 0, 0, '09352929456', 2, 2, 'Fabian@gmail.com', '', 2, '1234567', '7c6d7f41f739a117e6fc468d9924ca40', 0, 5, 1, 1, 1, 2, '2024-10-19', 1, 2),
(3, 'Lota', 'A', 'Acuno', 1, 0, 0, '09352929890', 2, 1, 'Lota@gmail.com', '', 1, '12345678', '7c6d7f41f739a117e6fc468d9924ca40', 0, 5, 1, 2, 1, 2, '2024-10-19', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_consumer_branch`
--

CREATE TABLE `user_consumer_branch` (
  `user_id` int NOT NULL,
  `consumerId` int NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `addressId` int NOT NULL,
  `propertyId` int NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `meter_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `positionId` int NOT NULL,
  `branchId` int NOT NULL,
  `statusId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_employee`
--

CREATE TABLE `user_employee` (
  `user_id` int NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `suffixId` int NOT NULL,
  `phone_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `provinceName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `municipalityName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `barangayName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'waterworks',
  `positionId` int NOT NULL,
  `branchId` int NOT NULL,
  `statusId` int NOT NULL,
  `login_statusId` int NOT NULL,
  `date_added` date NOT NULL,
  `employee_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_employee`
--

INSERT INTO `user_employee` (`user_id`, `firstname`, `middlename`, `lastname`, `suffixId`, `phone_no`, `provinceName`, `municipalityName`, `barangayName`, `email`, `code`, `username`, `password`, `positionId`, `branchId`, `statusId`, `login_statusId`, `date_added`, `employee_Id`) VALUES
(1, 'Super', '*', 'Admin', 1, '09352919943', '*********', '*********', '*********', 'kideguile3@gmail.com', '', 'guile.dev', '7c6d7f41f739a117e6fc468d9924ca40', 1, 1, 1, 1, '2024-10-17', 1),
(2, 'Raffy', 'Saguing', 'Bajoy', 1, '09619080994', 'Misamis Oriental', 'El Salvador City', 'Poblacion', 'Raffy@gmail.com', '', 'Raffy', '7c6d7f41f739a117e6fc468d9924ca40', 1, 1, 1, 2, '2024-10-17', 1),
(3, 'Sergio Domingo', 'Valentin', 'Baculio', 1, '09550865135', 'Misamis Oriental', 'El Salvador City', 'Poblacion', 'Sergio@gmail.com', '', 'Sergio', '7c6d7f41f739a117e6fc468d9924ca40', 2, 1, 1, 2, '2024-10-17', 1),
(4, 'Crystal Cafes', 'Ampoyo', 'Quiacao', 1, '09550476464', 'Misamis Oriental', 'El Salvador City', 'Poblacion', 'Crystal@gmail.com', '', 'Crystal', '7c6d7f41f739a117e6fc468d9924ca40', 3, 1, 1, 2, '2024-10-17', 1),
(5, 'Melchor', 'Aba', 'Malolot', 1, '09757759557', 'Misamis Oriental', 'El Salvador City', 'Poblacion', 'Melchor@gmail.com', '', 'Melchor', '7c6d7f41f739a117e6fc468d9924ca40', 4, 1, 1, 2, '2024-10-17', 1),
(6, 'Laurence', 'Monforte', 'Payla', 1, '09265682544', 'Misamis Oriental', 'El Salvador City', 'Poblacion', 'Laurence@gmail.com', '', 'Laurence', '7c6d7f41f739a117e6fc468d9924ca40', 4, 1, 1, 2, '2024-10-21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_status`
--

CREATE TABLE `user_status` (
  `status_id` int NOT NULL,
  `user_status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_status`
--

INSERT INTO `user_status` (`status_id`, `user_status`) VALUES
(1, 'Active'),
(2, 'Inactive');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `address_barangay`
--
ALTER TABLE `address_barangay`
  ADD PRIMARY KEY (`barangay_id`),
  ADD KEY `municipalityId` (`municipalityId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `address_municipality`
--
ALTER TABLE `address_municipality`
  ADD PRIMARY KEY (`municipality_id`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `address_zone`
--
ALTER TABLE `address_zone`
  ADD PRIMARY KEY (`zone_id`),
  ADD KEY `barangayId` (`barangayId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `assign`
--
ALTER TABLE `assign`
  ADD PRIMARY KEY (`assign_id`),
  ADD KEY `zone_Id` (`zone_Id`),
  ADD KEY `emp_Id` (`emp_Id`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `employee_Id` (`employee_Id`),
  ADD KEY `assign_statusId` (`assign_statusId`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`bill_id`);

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`billing_id`),
  ADD KEY `consumerId` (`consumerId`),
  ADD KEY `readerId` (`readerId`),
  ADD KEY `consumer_meter_no` (`consumerId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `billing_statusId` (`billing_statusId`),
  ADD KEY `billing_update_statusId` (`billing_update_statusId`);

--
-- Indexes for table `billing_status`
--
ALTER TABLE `billing_status`
  ADD PRIMARY KEY (`billing_status_id`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`branch_id`),
  ADD KEY `locationId` (`locationId`),
  ADD KEY `branch_statusId` (`branch_statusId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `changinng_meter`
--
ALTER TABLE `changinng_meter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addressId` (`addressId`),
  ADD KEY `propertyId` (`propertyId`),
  ADD KEY `positionId` (`positionId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `statusId` (`statusId`);

--
-- Indexes for table `consumer_type`
--
ALTER TABLE `consumer_type`
  ADD PRIMARY KEY (`consumertype_id`),
  ADD KEY `consumertype_statusId` (`consumertype_statusId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `flunctuation`
--
ALTER TABLE `flunctuation`
  ADD PRIMARY KEY (`flunctuation_id`);

--
-- Indexes for table `login_status`
--
ALTER TABLE `login_status`
  ADD PRIMARY KEY (`login_status_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`pay_id`),
  ADD KEY `pay_consumerId` (`pay_consumerId`),
  ADD KEY `pay_employeeId` (`pay_employeeId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `billingId` (`billingId`);

--
-- Indexes for table `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`position_id`),
  ADD KEY `position_statusId` (`position_statusId`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`property_id`),
  ADD KEY `property_statusId` (`property_statusId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `property_rate`
--
ALTER TABLE `property_rate`
  ADD PRIMARY KEY (`rate_id`),
  ADD KEY `property_Id` (`property_Id`),
  ADD KEY `employee_Id` (`employee_Id`),
  ADD KEY `rate_statusId` (`rate_statusId`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `suffix`
--
ALTER TABLE `suffix`
  ADD PRIMARY KEY (`suffix_id`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `update_status`
--
ALTER TABLE `update_status`
  ADD PRIMARY KEY (`update_status_id`);

--
-- Indexes for table `user_consumer`
--
ALTER TABLE `user_consumer`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `addressId` (`addressId`),
  ADD KEY `usertypeId` (`positionId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `propertyId` (`propertyId`),
  ADD KEY `propertyId_2` (`propertyId`),
  ADD KEY `suffixId` (`suffixId`),
  ADD KEY `login_statusId` (`login_statusId`),
  ADD KEY `employee_Id` (`employee_Id`),
  ADD KEY `billing_status` (`billing_status`),
  ADD KEY `consumertypeId` (`consumertypeId`);

--
-- Indexes for table `user_consumer_branch`
--
ALTER TABLE `user_consumer_branch`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `positionId` (`positionId`),
  ADD KEY `propertyId` (`propertyId`),
  ADD KEY `addressId` (`addressId`),
  ADD KEY `consumerId` (`consumerId`);

--
-- Indexes for table `user_employee`
--
ALTER TABLE `user_employee`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `positionId` (`positionId`),
  ADD KEY `user_employee_ibfk_4` (`login_statusId`),
  ADD KEY `suffixId` (`suffixId`),
  ADD KEY `employee_Id` (`employee_Id`);

--
-- Indexes for table `user_status`
--
ALTER TABLE `user_status`
  ADD PRIMARY KEY (`status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `activity_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `address_barangay`
--
ALTER TABLE `address_barangay`
  MODIFY `barangay_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `address_municipality`
--
ALTER TABLE `address_municipality`
  MODIFY `municipality_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `address_zone`
--
ALTER TABLE `address_zone`
  MODIFY `zone_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `assign`
--
ALTER TABLE `assign`
  MODIFY `assign_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `bill_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `billing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `billing_status`
--
ALTER TABLE `billing_status`
  MODIFY `billing_status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `branch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `changinng_meter`
--
ALTER TABLE `changinng_meter`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consumer_type`
--
ALTER TABLE `consumer_type`
  MODIFY `consumertype_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `flunctuation`
--
ALTER TABLE `flunctuation`
  MODIFY `flunctuation_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_status`
--
ALTER TABLE `login_status`
  MODIFY `login_status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `pay_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `position`
--
ALTER TABLE `position`
  MODIFY `position_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `property_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `property_rate`
--
ALTER TABLE `property_rate`
  MODIFY `rate_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `suffix`
--
ALTER TABLE `suffix`
  MODIFY `suffix_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `update_status`
--
ALTER TABLE `update_status`
  MODIFY `update_status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_consumer`
--
ALTER TABLE `user_consumer`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_consumer_branch`
--
ALTER TABLE `user_consumer_branch`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_employee`
--
ALTER TABLE `user_employee`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_status`
--
ALTER TABLE `user_status`
  MODIFY `status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`);

--
-- Constraints for table `address_barangay`
--
ALTER TABLE `address_barangay`
  ADD CONSTRAINT `address_barangay_ibfk_1` FOREIGN KEY (`municipalityId`) REFERENCES `address_municipality` (`municipality_id`),
  ADD CONSTRAINT `address_barangay_ibfk_2` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `address_municipality`
--
ALTER TABLE `address_municipality`
  ADD CONSTRAINT `address_municipality_ibfk_1` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`);

--
-- Constraints for table `address_zone`
--
ALTER TABLE `address_zone`
  ADD CONSTRAINT `address_zone_ibfk_1` FOREIGN KEY (`barangayId`) REFERENCES `address_barangay` (`barangay_id`),
  ADD CONSTRAINT `address_zone_ibfk_2` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`);

--
-- Constraints for table `assign`
--
ALTER TABLE `assign`
  ADD CONSTRAINT `assign_ibfk_3` FOREIGN KEY (`zone_Id`) REFERENCES `address_zone` (`zone_id`),
  ADD CONSTRAINT `assign_ibfk_4` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`),
  ADD CONSTRAINT `assign_ibfk_5` FOREIGN KEY (`emp_Id`) REFERENCES `user_employee` (`user_id`),
  ADD CONSTRAINT `assign_ibfk_6` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`),
  ADD CONSTRAINT `assign_ibfk_7` FOREIGN KEY (`assign_statusId`) REFERENCES `status` (`status_id`);

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`consumerId`) REFERENCES `user_consumer` (`user_id`),
  ADD CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`readerId`) REFERENCES `user_employee` (`user_id`),
  ADD CONSTRAINT `billing_ibfk_3` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`),
  ADD CONSTRAINT `billing_ibfk_4` FOREIGN KEY (`billing_statusId`) REFERENCES `billing_status` (`billing_status_id`),
  ADD CONSTRAINT `billing_ibfk_5` FOREIGN KEY (`billing_update_statusId`) REFERENCES `update_status` (`update_status_id`);

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `address_zone` (`zone_id`),
  ADD CONSTRAINT `branch_ibfk_2` FOREIGN KEY (`branch_statusId`) REFERENCES `status` (`status_id`),
  ADD CONSTRAINT `branch_ibfk_3` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `changinng_meter`
--
ALTER TABLE `changinng_meter`
  ADD CONSTRAINT `changinng_meter_ibfk_1` FOREIGN KEY (`addressId`) REFERENCES `address_zone` (`zone_id`),
  ADD CONSTRAINT `changinng_meter_ibfk_2` FOREIGN KEY (`propertyId`) REFERENCES `property` (`property_id`),
  ADD CONSTRAINT `changinng_meter_ibfk_3` FOREIGN KEY (`positionId`) REFERENCES `position` (`position_id`),
  ADD CONSTRAINT `changinng_meter_ibfk_4` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`),
  ADD CONSTRAINT `changinng_meter_ibfk_5` FOREIGN KEY (`statusId`) REFERENCES `user_status` (`status_id`);

--
-- Constraints for table `consumer_type`
--
ALTER TABLE `consumer_type`
  ADD CONSTRAINT `consumer_type_ibfk_1` FOREIGN KEY (`consumertype_statusId`) REFERENCES `status` (`status_id`),
  ADD CONSTRAINT `consumer_type_ibfk_2` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`);

--
-- Constraints for table `position`
--
ALTER TABLE `position`
  ADD CONSTRAINT `position_ibfk_1` FOREIGN KEY (`position_statusId`) REFERENCES `status` (`status_id`);

--
-- Constraints for table `user_consumer`
--
ALTER TABLE `user_consumer`
  ADD CONSTRAINT `user_consumer_ibfk_1` FOREIGN KEY (`billing_status`) REFERENCES `billing_status` (`billing_status_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_10` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_11` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_12` FOREIGN KEY (`addressId`) REFERENCES `address_zone` (`zone_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_13` FOREIGN KEY (`propertyId`) REFERENCES `property` (`property_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_3` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_4` FOREIGN KEY (`consumertypeId`) REFERENCES `consumer_type` (`consumertype_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_6` FOREIGN KEY (`login_statusId`) REFERENCES `login_status` (`login_status_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_7` FOREIGN KEY (`positionId`) REFERENCES `position` (`position_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_8` FOREIGN KEY (`statusId`) REFERENCES `status` (`status_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_consumer_ibfk_9` FOREIGN KEY (`suffixId`) REFERENCES `suffix` (`suffix_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `user_employee`
--
ALTER TABLE `user_employee`
  ADD CONSTRAINT `user_employee_ibfk_3` FOREIGN KEY (`positionId`) REFERENCES `position` (`position_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_employee_ibfk_4` FOREIGN KEY (`statusId`) REFERENCES `status` (`status_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_employee_ibfk_5` FOREIGN KEY (`login_statusId`) REFERENCES `login_status` (`login_status_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_employee_ibfk_6` FOREIGN KEY (`suffixId`) REFERENCES `suffix` (`suffix_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_employee_ibfk_7` FOREIGN KEY (`branchId`) REFERENCES `branch` (`branch_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_employee_ibfk_8` FOREIGN KEY (`employee_Id`) REFERENCES `user_employee` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
