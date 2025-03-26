-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2025 at 10:25 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlynhansu`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `ID_Attendance` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `AttendancesDate` date DEFAULT NULL,
  `CheckInTime` time DEFAULT NULL,
  `CheckOutTime` time DEFAULT NULL,
  `TotalHoursWorked` decimal(5,2) DEFAULT NULL,
  `AttendancesType` varchar(20) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`ID_Attendance`, `EmployeeID`, `AttendancesDate`, `CheckInTime`, `CheckOutTime`, `TotalHoursWorked`, `AttendancesType`, `ID_PayrollCycle`) VALUES
(4, 'E001', '2024-03-10', '08:00:00', '17:00:00', 8.00, 'Work', 'P001'),
(5, 'E002', '2024-03-10', '08:30:00', '17:30:00', 8.00, 'Work', 'P001'),
(6, 'E003', '2024-03-10', '09:00:00', '16:00:00', 7.00, 'Work', 'P001');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` varchar(10) NOT NULL,
  `DepartmentName` varchar(255) NOT NULL,
  `DivisionID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DepartmentID`, `DepartmentName`, `DivisionID`) VALUES
('DEP01', 'Software Development', 'D001'),
('DEP02', 'Network Administration', 'D001'),
('DEP03', 'Human Resources', 'D002'),
('DEP04', 'Customer Support', 'D003'),
('DEP05', 'Technical Support', 'D003'),
('DEP06', 'Sales & Marketing', 'D004'),
('DEP07', 'Project Management', 'D005'),
('DEP08', 'Network Operations Center', 'D006'),
('DEP09', 'Product Development', 'D007'),
('DEP10', 'Data Analytics', 'D003');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `DivisionID` varchar(10) NOT NULL,
  `DivisionsName` varchar(255) NOT NULL,
  `EstablishmentDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`DivisionID`, `DivisionsName`, `EstablishmentDate`) VALUES
('D001', 'IT Department', '2010-06-15'),
('D002', 'HR Department', '2012-09-22'),
('D003', 'Công nghệ Thông tin', '2015-12-05'),
('D004', 'Kinh doanh và Tiếp thị', '2017-03-10'),
('D005', 'Quản lý Dự án Viễn thông', '2019-05-23'),
('D006', 'Hỗ trợ Kỹ thuật', '2021-01-30'),
('D007', 'Phát triển Sản phẩm & Dịch vụ', '2022-07-15');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `EmployeeID` varchar(10) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(11) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `PersonalEmail` varchar(255) DEFAULT NULL,
  `WorkEmail` varchar(255) DEFAULT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `Image` text DEFAULT NULL,
  `DepartmentID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeID`, `FullName`, `PhoneNumber`, `DateOfBirth`, `Gender`, `Address`, `PersonalEmail`, `WorkEmail`, `Position`, `StartDate`, `Image`, `DepartmentID`) VALUES
('E001', 'Lê Thu Hà', '0987654321', '2000-01-22', 'Nam', 'Hà Nội', 'thuhapersonal@gmail.com', 'haxom2003@gmail.com', 'Developer', '2023-05-01', '1742379402828-e12.jpg', 'DEP05'),
('E002', 'Nguyễn Hoàng Anh', '0976543210', '1999-12-12', 'Nữ', 'Hải Phòng', 'hoanganhpersonal@gmail.com', 'vhanh.dhkt15a13hn@sv.uneti.edu.vn', 'Tester', '2023-06-15', '1742372713097-e24.png', 'DEP01'),
('E003', 'Phạm Thị Quỳnh Nga', '0965432109', '2001-03-20', 'Nữ', 'Đà Nẵng', 'quynhngapersonal@gmail.com', 'ptqnga.dhti15a10hn@sv.uneti.edu.vn', 'BA', '2023-07-20', 'e3.jpg', 'DEP03'),
('E004', 'Phạm Thu Hà', '0945678901', '1995-07-05', 'Nữ', 'Hải Phòng', 'ha.pham@example.com', 'emma.jones@example.com', 'Full-Stack Developer', '2022-11-05', '1742372909891-e14.jpg', 'DEP01'),
('E005', 'Đặng Minh Tuấn', '0956789012', '1991-11-22', 'Nam', 'Cần Thơ', 'tuan.dang@example.com', 'frank.thomas@example.com', 'System Administrator', '2018-05-22', '1742366923250-e23.jpg', 'DEP02'),
('E006', 'Hoàng Bảo Ngọc', '0967890123', '1996-09-14', 'Nữ', 'Huế', 'ngoc.hoang@example.com', 'george.wilson@example.com', 'Business Analyst', '2023-01-15', '1742372792415-e19.jpg', 'DEP03'),
('E007', 'Nguyễn Thanh Hương', '0978901234', '1987-06-08', 'Nữ', 'Bắc Ninh', 'huong.nguyen@example.com', 'hannah.moore@example.com', 'Admin Assistant', '2017-04-30', 'e6.jpg', 'DEP01'),
('E008', 'Lương Hoàng Long', '0989012345', '1993-03-25', 'Nam', 'Thanh Hóa', 'long.luong@example.com', 'haxom2003@gmail.com', 'Database Administrator', '2021-12-01', 'e5.jpg', 'DEP02'),
('E009', 'Võ Minh Huy', '0990123456', '1990-10-18', 'Nam', 'Đồng Nai', 'huy.vo@example.com', 'ian.taylor@example.com', 'IT Support', '2020-09-15', 'e7.jpg', 'DEP03'),
('E010', 'Phan Ngọc Linh', '0910234567', '1985-04-03', 'Nữ', 'Quảng Ninh', 'linh.phan@example.com', 'jane.smith@example.com', 'HR Manager', '2015-07-20', 'e8.jpg', 'DEP01'),
('E011', 'Đinh Trọng Khoa', '0921345678', '1998-02-28', 'Nam', 'Vĩnh Phúc', 'khoa.dinh@example.com', 'jessica.white@example.com', 'Security Analyst', '2022-05-10', '1742367002314-e22.jpg', 'DEP02'),
('E012', 'Lê Thị Mai', '0932456789', '1994-12-12', 'Nữ', 'Nghệ An', 'mai.le@example.com', 'john.doe@example.com', 'DevOps Engineer', '2023-03-15', 'e9.jpg', 'DEP03'),
('E013', 'Vũ Quốc Đạt', '0943567890', '1989-09-09', 'Nam', 'Nam Định', 'dat.vu@example.com', 'kevin.harris@example.com', 'Project Manager', '2016-10-05', '1742372066431-e20.jpg', 'DEP01'),
('E014', 'Trần Minh Phương', '0954678901', '1997-06-21', 'Nữ', 'Phú Thọ', 'phuong.tran@example.com', 'laura.martin@example.com', 'Software Tester', '2021-07-25', 'e13.jpg', 'DEP02'),
('E015', 'Tạ Văn Tú', '0965789012', '1991-01-17', 'Nam', 'Bình Dương', 'tai.nguyen@example.com', 'tvtu.dhti15a18hn@sv.uneti.edu.vn', 'IT Consultant', '2019-02-28', '1742372355902-e21.jpg', 'DEP03');

-- --------------------------------------------------------

--
-- Table structure for table `employeescontracts`
--

CREATE TABLE `employeescontracts` (
  `ID_Contract` int(11) NOT NULL,
  `EmployeeID` varchar(10) NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeescontracts`
--

INSERT INTO `employeescontracts` (`ID_Contract`, `EmployeeID`, `StartDate`, `EndDate`, `Status`) VALUES
(1, 'E001', '2023-05-01', '2026-05-01', 'Hoạt động'),
(1, 'E002', '2023-06-15', '2026-06-15', 'Hoạt động'),
(2, 'E003', '2023-07-20', '2024-07-20', 'Hoạt động'),
(3, 'E002', '2019-03-05', '2022-03-16', 'Hết hạn');

-- --------------------------------------------------------

--
-- Table structure for table `familymembers`
--

CREATE TABLE `familymembers` (
  `FamilyMemberID` int(11) NOT NULL,
  `EmployeeID` varchar(10) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Relationship` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `PhoneNumber` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `familymembers`
--

INSERT INTO `familymembers` (`FamilyMemberID`, `EmployeeID`, `FullName`, `Relationship`, `DateOfBirth`, `Gender`, `Address`, `PhoneNumber`) VALUES
(1, 'E001', 'Nguyen Van A', 'Father', '1970-05-15', 'Male', 'Hanoi', '0912345678'),
(2, 'E001', 'Tran Thi B', 'Mother', '1972-08-20', 'Female', 'Hanoi', '0912345679'),
(3, 'E002', 'Pham Minh D', 'Son', '2022-01-10', 'Male', 'Hai Phong', '0934567890'),
(4, 'E002', 'Pham Van C', 'Wife', '2000-06-25', 'Female', 'Hai Phong', '0923456789'),
(5, 'E002', 'Pham Van E', 'Daughter', '2023-03-15', 'Female', 'Hai Phong', '0945678901'),
(6, 'E003', 'Le Thi F', 'Mother', '1975-09-30', 'Female', 'Da Nang', '0956789012');

-- --------------------------------------------------------

--
-- Table structure for table `insurances`
--

CREATE TABLE `insurances` (
  `InsurancesNumber` varchar(10) NOT NULL,
  `InsurancesStartDate` date DEFAULT NULL,
  `InsurancesContributionAmount` decimal(18,2) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurances`
--

INSERT INTO `insurances` (`InsurancesNumber`, `InsurancesStartDate`, `InsurancesContributionAmount`, `Status`) VALUES
('123456787', '2023-07-20', 300000.00, 'Active'),
('123456788', '2023-06-15', 500000.00, 'Active'),
('123456789', '2023-05-01', 500000.00, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `jobprofiles`
--

CREATE TABLE `jobprofiles` (
  `EmployeeID` varchar(10) NOT NULL,
  `EmploymentStatus` varchar(50) DEFAULT NULL,
  `Manager` varchar(100) DEFAULT NULL,
  `StandardWorkingHours` int(11) DEFAULT NULL,
  `EmployeesType` varchar(100) DEFAULT NULL,
  `RemainingLeaveDays` int(11) DEFAULT NULL,
  `EmergencyContactNumber` varchar(11) DEFAULT NULL,
  `EmergencyContactName` varchar(255) DEFAULT NULL,
  `ResignationsDate` date DEFAULT NULL,
  `ResignationsReason` text DEFAULT NULL,
  `BaseSalary` decimal(18,2) DEFAULT NULL,
  `Allowance` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobprofiles`
--

INSERT INTO `jobprofiles` (`EmployeeID`, `EmploymentStatus`, `Manager`, `StandardWorkingHours`, `EmployeesType`, `RemainingLeaveDays`, `EmergencyContactNumber`, `EmergencyContactName`, `ResignationsDate`, `ResignationsReason`, `BaseSalary`, `Allowance`) VALUES
('E001', 'Active', 'Manager A', 40, 'Full-time', 12, '0964184617', 'Nguyen Van A', NULL, NULL, 15000000.00, 2000000.00),
('E002', 'Active', 'Manager B', 40, 'Full-time', 10, '0964376355', 'Tran Van B', NULL, NULL, 12000000.00, 1500000.00),
('E003', 'Active', 'Manager C', 40, 'Part-time', 8, '0346012124', 'Le Van C', NULL, NULL, 8000000.00, 1000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `laborcontracts`
--

CREATE TABLE `laborcontracts` (
  `ID_Contract` int(11) NOT NULL,
  `ContractType` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laborcontracts`
--

INSERT INTO `laborcontracts` (`ID_Contract`, `ContractType`) VALUES
(1, 'Full-time'),
(2, 'Part-time'),
(3, 'Internship');

-- --------------------------------------------------------

--
-- Table structure for table `monthlysalaries`
--

CREATE TABLE `monthlysalaries` (
  `ID_Salary` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) DEFAULT NULL,
  `TaxPayable` decimal(18,2) DEFAULT NULL,
  `Forfeit` decimal(10,2) NOT NULL,
  `PrizeMoney` decimal(10,2) NOT NULL,
  `TotalOTSalary` decimal(18,2) DEFAULT NULL,
  `NetSalary` decimal(18,2) DEFAULT NULL,
  `PaymentDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthlysalaries`
--

INSERT INTO `monthlysalaries` (`ID_Salary`, `EmployeeID`, `ID_PayrollCycle`, `TaxPayable`, `Forfeit`, `PrizeMoney`, `TotalOTSalary`, `NetSalary`, `PaymentDate`) VALUES
(1, 'E001', 'P001', 2000000.00, 200000.00, 0.00, 500000.00, 13500000.00, '2024-03-31'),
(2, 'E002', 'P001', 1800000.00, 50000.00, 200000.00, 450000.00, 10800000.00, '2024-03-31'),
(3, 'E003', 'P001', 1200000.00, 0.00, 0.00, 300000.00, 7200000.00, '2024-03-31'),
(4, 'E003', 'P001', 12.00, 1.00, 2.00, 13.00, 14.00, '2025-03-10');

-- --------------------------------------------------------

--
-- Table structure for table `overtimes`
--

CREATE TABLE `overtimes` (
  `ID_OT` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `Manager` varchar(255) DEFAULT NULL,
  `OTType` enum('Ngày thường','Cuối tuần','Ngày lễ','') DEFAULT NULL,
  `DateTime` date DEFAULT NULL,
  `OverTimesHours` decimal(5,2) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `overtimes`
--

INSERT INTO `overtimes` (`ID_OT`, `EmployeeID`, `Manager`, `OTType`, `DateTime`, `OverTimesHours`, `Status`, `ID_PayrollCycle`) VALUES
(1, 'E001', 'Manager A', 'Ngày thường', '2024-03-15', 2.00, 'Approved', 'P001'),
(2, 'E002', 'Manager B', 'Cuối tuần', '2024-03-16', 3.00, 'Approved', 'P001'),
(3, 'E003', 'Manager C', 'Ngày lễ', '2024-03-17', 1.50, 'Pending', 'P001');

-- --------------------------------------------------------

--
-- Table structure for table `payrollcycles`
--

CREATE TABLE `payrollcycles` (
  `ID_PayrollCycle` varchar(10) NOT NULL,
  `PayrollName` varchar(20) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `Status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payrollcycles`
--

INSERT INTO `payrollcycles` (`ID_PayrollCycle`, `PayrollName`, `StartDate`, `EndDate`, `Status`) VALUES
('P001', '3/2024', '2024-03-01', '2024-03-31', 'Open');

-- --------------------------------------------------------

--
-- Table structure for table `personalprofiles`
--

CREATE TABLE `personalprofiles` (
  `EmployeeID` varchar(10) NOT NULL,
  `InsurancesNumber` varchar(10) DEFAULT NULL,
  `Nationality` varchar(50) DEFAULT NULL,
  `PlaceOfBirth` varchar(255) DEFAULT NULL,
  `ID_Card` varchar(12) DEFAULT NULL,
  `ID_CardIssuedPlace` varchar(255) DEFAULT NULL,
  `Education` varchar(255) DEFAULT NULL,
  `Degree` varchar(100) DEFAULT NULL,
  `Major` varchar(255) DEFAULT NULL,
  `WorkExperience` text DEFAULT NULL,
  `TaxCode` varchar(50) DEFAULT NULL,
  `BankAccount` varchar(50) DEFAULT NULL,
  `BankName` varchar(255) DEFAULT NULL,
  `MaritalStatus` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalprofiles`
--

INSERT INTO `personalprofiles` (`EmployeeID`, `InsurancesNumber`, `Nationality`, `PlaceOfBirth`, `ID_Card`, `ID_CardIssuedPlace`, `Education`, `Degree`, `Major`, `WorkExperience`, `TaxCode`, `BankAccount`, `BankName`, `MaritalStatus`) VALUES
('E001', NULL, 'Vietnamese', 'Hanoi', '001303039642', 'Hanoi', 'University', 'Bachelor', 'IT', '2 years at ABC Corp', 'TX123456', '1234567890', 'Vietcombank', 'Single'),
('E002', NULL, 'Vietnamese', 'Hai Phong', '001303039642', 'Hai Phong', 'University', 'Bachelor', 'Software Testing', '1.5 years at XYZ Ltd', 'TX987654', '0987654321', 'Techcombank', 'Married'),
('E003', NULL, 'Vietnamese', 'Da Nang', '001303039642', 'Da Nang', 'College', 'Diploma', 'Business Analysis', '1 year at LMN Inc', 'TX567891', '5678912345', 'Agribank', 'Single');

-- --------------------------------------------------------

--
-- Table structure for table `resignations`
--

CREATE TABLE `resignations` (
  `ID_Resignation` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `Reason` text DEFAULT NULL,
  `ResignationsDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `WorkEmail` varchar(255) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`WorkEmail`, `UserName`, `Password`, `Role`) VALUES
('alice.williams@example.com', 'AliceW', '$argon2id$v=19$m=65536,t=3,p=4$aGVh...bGxl', 'Admin'),
('charlie.brown@example.com', 'CharlieB', '$argon2id$v=19$m=65536,t=3,p=4$aG91...YW0=', 'User'),
('david.miller@example.com', 'DavidM', '$argon2id$v=19$m=65536,t=3,p=4$ZmFz...bGFz', 'Guest'),
('emma.jones@example.com', 'EmmaJ', '$argon2id$v=19$m=65536,t=3,p=4$bWFy...Y29y', 'User'),
('frank.thomas@example.com', 'FrankT', '$argon2id$v=19$m=65536,t=3,p=4$cGFz...U0MT', 'Manager'),
('george.wilson@example.com', 'GeorgeW', '$argon2id$v=19$m=65536,t=3,p=4$YWxp...dmlj', 'User'),
('hannah.moore@example.com', 'HannahM', '$argon2id$v=19$m=65536,t=3,p=4$bG9n...bWFz', 'Admin'),
('haxom2003@gmail.com', 'Thu Hà', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'User'),
('ian.taylor@example.com', 'IanT', '$argon2id$v=19$m=65536,t=3,p=4$ZGJw...dG9y', 'Guest'),
('jane.smith@example.com', 'JaneSmith', '$argon2id$v=19$m=65536,t=3,p=4$ZW5v...29kbw', 'User'),
('jessica.white@example.com', 'JessicaW', '$argon2id$v=19$m=65536,t=3,p=4$Zm9v...bGJh', 'User'),
('john.doe@example.com', 'JohnDoe', '$argon2id$v=19$m=65536,t=3,p=4$X1Nl...1nY', 'Admin'),
('kevin.harris@example.com', 'KevinH', '$argon2id$v=19$m=65536,t=3,p=4$ZGly...Y3Jl', 'Manager'),
('laura.martin@example.com', 'LauraM', '$argon2id$v=19$m=65536,t=3,p=4$U2Fm...Y2Fz', 'Admin'),
('michael.clark@example.com', 'MichaelC', '$argon2id$v=19$m=65536,t=3,p=4$ZW5v...Z2Fy', 'User'),
('mike.johnson@example.com', 'MikeJ', '$argon2id$v=19$m=65536,t=3,p=4$bG9y...bXBl', 'Manager'),
('ptqnga.dhti15a10hn@sv.uneti.edu.vn', 'Quỳnh Nga', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'Admin'),
('tvtu.dhti15a18hn@sv.uneti.edu.vn', 'Văn Tú', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'User'),
('vhanh.dhkt15a13hn@sv.uneti.edu.vn', 'Hoàng Anh', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`ID_Attendance`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `ID_PayrollCycle` (`ID_PayrollCycle`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DepartmentID`),
  ADD KEY `DivisionID` (`DivisionID`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`DivisionID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD KEY `DepartmentID` (`DepartmentID`),
  ADD KEY `WorkEmail` (`WorkEmail`);

--
-- Indexes for table `employeescontracts`
--
ALTER TABLE `employeescontracts`
  ADD PRIMARY KEY (`ID_Contract`,`EmployeeID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `familymembers`
--
ALTER TABLE `familymembers`
  ADD PRIMARY KEY (`FamilyMemberID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `insurances`
--
ALTER TABLE `insurances`
  ADD PRIMARY KEY (`InsurancesNumber`);

--
-- Indexes for table `jobprofiles`
--
ALTER TABLE `jobprofiles`
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `laborcontracts`
--
ALTER TABLE `laborcontracts`
  ADD PRIMARY KEY (`ID_Contract`);

--
-- Indexes for table `monthlysalaries`
--
ALTER TABLE `monthlysalaries`
  ADD PRIMARY KEY (`ID_Salary`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `ID_PayrollCycle` (`ID_PayrollCycle`);

--
-- Indexes for table `overtimes`
--
ALTER TABLE `overtimes`
  ADD PRIMARY KEY (`ID_OT`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `ID_PayrollCycle` (`ID_PayrollCycle`);

--
-- Indexes for table `payrollcycles`
--
ALTER TABLE `payrollcycles`
  ADD PRIMARY KEY (`ID_PayrollCycle`);

--
-- Indexes for table `personalprofiles`
--
ALTER TABLE `personalprofiles`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD KEY `personalprofiles_ibfk_1` (`InsurancesNumber`);

--
-- Indexes for table `resignations`
--
ALTER TABLE `resignations`
  ADD PRIMARY KEY (`ID_Resignation`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`WorkEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `ID_Attendance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `familymembers`
--
ALTER TABLE `familymembers`
  MODIFY `FamilyMemberID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `laborcontracts`
--
ALTER TABLE `laborcontracts`
  MODIFY `ID_Contract` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `monthlysalaries`
--
ALTER TABLE `monthlysalaries`
  MODIFY `ID_Salary` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `overtimes`
--
ALTER TABLE `overtimes`
  MODIFY `ID_OT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resignations`
--
ALTER TABLE `resignations`
  MODIFY `ID_Resignation` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`ID_PayrollCycle`) REFERENCES `payrollcycles` (`ID_PayrollCycle`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`DivisionID`) REFERENCES `divisions` (`DivisionID`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`WorkEmail`) REFERENCES `users` (`WorkEmail`) ON DELETE CASCADE;

--
-- Constraints for table `employeescontracts`
--
ALTER TABLE `employeescontracts`
  ADD CONSTRAINT `employeescontracts_ibfk_1` FOREIGN KEY (`ID_Contract`) REFERENCES `laborcontracts` (`ID_Contract`) ON DELETE CASCADE,
  ADD CONSTRAINT `employeescontracts_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE;

--
-- Constraints for table `familymembers`
--
ALTER TABLE `familymembers`
  ADD CONSTRAINT `familymembers_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobprofiles`
--
ALTER TABLE `jobprofiles`
  ADD CONSTRAINT `jobprofiles_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE;

--
-- Constraints for table `monthlysalaries`
--
ALTER TABLE `monthlysalaries`
  ADD CONSTRAINT `monthlysalaries_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `monthlysalaries_ibfk_2` FOREIGN KEY (`ID_PayrollCycle`) REFERENCES `payrollcycles` (`ID_PayrollCycle`) ON DELETE CASCADE;

--
-- Constraints for table `overtimes`
--
ALTER TABLE `overtimes`
  ADD CONSTRAINT `overtimes_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `overtimes_ibfk_2` FOREIGN KEY (`ID_PayrollCycle`) REFERENCES `payrollcycles` (`ID_PayrollCycle`) ON DELETE CASCADE;

--
-- Constraints for table `personalprofiles`
--
ALTER TABLE `personalprofiles`
  ADD CONSTRAINT `personalprofiles_ibfk_1` FOREIGN KEY (`InsurancesNumber`) REFERENCES `insurances` (`InsurancesNumber`) ON DELETE CASCADE;

--
-- Constraints for table `resignations`
--
ALTER TABLE `resignations`
  ADD CONSTRAINT `resignations_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
