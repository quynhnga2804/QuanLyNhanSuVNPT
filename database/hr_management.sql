-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 10, 2025 at 03:47 PM
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
-- Database: `hr_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` varchar(10) NOT NULL,
  `DepartmentsName` varchar(255) NOT NULL,
  `DivisionID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DepartmentID`, `DepartmentsName`, `DivisionID`) VALUES
('DEP001', 'Recruitments', 'DIV001'),
('DEP002', 'Payroll', 'DIV002'),
('DEP003', 'IT Support', 'DIV003'),
('DEP004', 'Digital Marketing', 'DIV004'),
('DEP005', 'Field Sales', 'DIV005'),
('DEP006', 'Help Desk', 'DIV006'),
('DEP007', 'Product Development', 'DIV007'),
('DEP008', 'Supply Chain', 'DIV008'),
('DEP009', 'Compliance', 'DIV009'),
('DEP010', 'Media Relations', 'DIV010');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `DivisionID` varchar(10) NOT NULL,
  `DivisionsName` varchar(255) NOT NULL,
  `EstablishmentDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`DivisionID`, `DivisionsName`, `EstablishmentDate`) VALUES
('DIV001', 'Human Resource', '2010-05-12'),
('DIV002', 'Finance', '2012-08-25'),
('DIV003', 'IT Department', '2015-03-17'),
('DIV004', 'Marketing', '2011-11-03'),
('DIV005', 'Sales', '2014-07-19'),
('DIV006', 'Customer Support', '2016-09-28'),
('DIV007', 'Research & Development', '2013-06-14'),
('DIV008', 'Logistics', '2017-12-05'),
('DIV009', 'Legal Affairs', '2009-04-21'),
('DIV010', 'Public Relations', '2018-10-30');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `EmployeeID` varchar(10) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `PhoneNumber` varchar(11) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `PersonalEmail` varchar(255) DEFAULT NULL,
  `WorkEmail` varchar(255) DEFAULT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `DepartmentID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeID`, `FullName`, `PhoneNumber`, `DateOfBirth`, `Gender`, `Address`, `PersonalEmail`, `WorkEmail`, `Position`, `StartDate`, `DepartmentID`) VALUES
('EMP001', 'John Doe', '0987654321', '1990-05-15', 'Male', '123 Main St, NY', 'john.doe@gmail.com', 'john.doe@example.com', 'HR Manager', '2015-06-01', 'DEP001'),
('EMP002', 'Jane Smith', '0971234567', '1988-09-20', 'Female', '456 Elm St, CA', 'jane.smith@gmail.com', 'jane.smith@example.com', 'Payroll Specialist', '2016-08-10', 'DEP002'),
('EMP003', 'David Brown', '0967890123', '1992-03-12', 'Male', '789 Oak St, TX', 'david.brown@gmail.com', 'david.brown@example.com', 'IT Support Technician', '2018-01-15', 'DEP003'),
('EMP004', 'Susan White', '0954567890', '1985-07-25', 'Female', '321 Pine St, FL', 'susan.white@gmail.com', 'susan.white@example.com', 'Digital Marketing Lead', '2014-11-05', 'DEP004'),
('EMP005', 'Michael Johnson', '0943210987', '1993-11-30', 'Male', '654 Cedar St, WA', 'michael.johnson@gmail.com', 'michael.johnson@example.com', 'Sales Executive', '2019-09-01', 'DEP005'),
('EMP006', 'Linda Wilson', '0932109876', '1987-06-18', 'Female', '987 Maple St, IL', 'linda.wilson@gmail.com', 'linda.wilson@example.com', 'Customer Support Manager', '2013-04-22', 'DEP006'),
('EMP007', 'Robert Miller', '0921098765', '1991-12-10', 'Male', '159 Birch St, NV', 'robert.miller@gmail.com', 'robert.miller@example.com', 'R&D Engineer', '2017-07-19', 'DEP007'),
('EMP008', 'Emily Davis', '0910987654', '1994-02-14', 'Female', '753 Willow St, GA', 'emily.davis@gmail.com', 'emily.davis@example.com', 'Logistics Coordinator', '2020-05-30', 'DEP008'),
('EMP009', 'William Anderson', '0909876543', '1989-08-22', 'Male', '852 Redwood St, CO', 'william.anderson@gmail.com', 'william.anderson@example.com', 'Legal Advisor', '2012-10-15', 'DEP009'),
('EMP010', 'Olivia Thomas', '0898765432', '1995-04-05', 'Female', '951 Spruce St, AZ', 'olivia.thomas@gmail.com', 'olivia.thomas@example.com', 'Public Relations Officer', '2021-03-18', 'DEP010');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `OTP` varchar(6) NOT NULL,
  `CreateDate` datetime NOT NULL,
  `OTPName` varchar(20) NOT NULL,
  `WorkEmail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `WorkEmail` varchar(255) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`WorkEmail`, `UserName`, `Password`, `Role`) VALUES
('david.brown@example.com', 'David Browns', 'pass789word', 'User'),
('emily.davis@example.com', 'Emily Davis', 'emilySecure777', 'Moderator'),
('jane.smith@example.com', 'Jane Smith', 'securepass456', 'User'),
('john.doe@example.com', 'John Doe', 'password123', 'Admin'),
('linda.wilson@example.com', 'Linda Wilson', 'password2024', 'Admin'),
('michael.johnson@example.com', 'Michael Johnson', 'strongpass999', 'User'),
('olivia.thomas@example.com', 'Olivia Thomas', 'oliviaPass123', 'User'),
('ptqnga.dhti15a10hn@sv.uneti.edu.vn', 'Quỳnh Nga', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'Trưởng phòng'),
('robert.miller@example.com', 'Robert Miller', 'testpass111', 'User'),
('susan.white@example.com', 'Susan White', 'mypassword321', 'Moderator'),
('william.anderson@example.com', 'William Anderson', 'superpass888', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DepartmentID`),
  ADD KEY `departments_ibfk_1` (`DivisionID`);

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
  ADD KEY `employees_ibfk_1` (`WorkEmail`),
  ADD KEY `DepartmentID` (`DepartmentID`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`OTP`),
  ADD KEY `WorkEmail` (`WorkEmail`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`WorkEmail`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`DivisionID`) REFERENCES `divisions` (`DivisionID`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`WorkEmail`) REFERENCES `users` (`WorkEmail`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`);

--
-- Constraints for table `otps`
--
ALTER TABLE `otps`
  ADD CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`WorkEmail`) REFERENCES `users` (`WorkEmail`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
