-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2025 at 04:52 AM
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
  `EmployeeID` varchar(10) NOT NULL,
  `AttendancesDate` date DEFAULT NULL,
  `CheckInTime` time DEFAULT NULL,
  `CheckOutTime` time DEFAULT NULL,
  `TotalHoursWorked` decimal(5,2) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`ID_Attendance`, `EmployeeID`, `AttendancesDate`, `CheckInTime`, `CheckOutTime`, `TotalHoursWorked`, `ID_PayrollCycle`) VALUES
(8, 'E002', '2024-03-01', '08:15:00', '17:05:00', 8.83, 'PC32024'),
(9, 'E003', '2024-03-01', '08:05:00', '16:50:00', 8.75, 'PC12024'),
(37, 'E021', '2024-03-01', '08:00:00', '17:00:00', 8.00, 'PC001'),
(38, 'E002', '2024-03-02', '08:30:00', '17:30:00', 8.00, 'PC001'),
(39, 'E003', '2024-03-03', '09:00:00', '18:00:00', 8.00, 'PC001'),
(40, 'E004', '2024-03-04', '07:45:00', '16:45:00', 8.00, 'PC002'),
(41, 'E005', '2024-03-05', '08:15:00', '17:15:00', 8.00, 'PC002'),
(42, 'E006', '2024-03-06', '08:00:00', '17:00:00', 8.00, 'PC002'),
(43, 'E007', '2024-03-07', '08:45:00', '17:45:00', 8.00, 'PC003'),
(44, 'E008', '2024-03-08', '09:15:00', '18:15:00', 8.00, 'PC003'),
(45, 'E009', '2024-03-09', '07:30:00', '16:30:00', 8.00, 'PC003'),
(46, 'E010', '2024-03-10', '08:00:00', '17:00:00', 8.00, 'PC004'),
(47, 'E011', '2024-03-11', '08:30:00', '17:30:00', 8.00, 'PC004'),
(48, 'E012', '2024-03-12', '08:00:00', '17:00:00', 8.00, 'PC004'),
(49, 'E013', '2024-03-13', '07:45:00', '16:45:00', 8.00, 'PC005'),
(50, 'E014', '2024-03-14', '08:00:00', '17:00:00', 8.00, 'PC005'),
(51, 'E015', '2024-03-15', '08:15:00', '17:15:00', 8.00, 'PC005'),
(52, 'E016', '2024-03-16', '08:30:00', '17:30:00', 8.00, 'PC006'),
(53, 'E017', '2024-03-17', '09:00:00', '18:00:00', 8.00, 'PC006'),
(54, 'E018', '2024-03-18', '07:45:00', '16:45:00', 8.00, 'PC006'),
(55, 'E019', '2024-03-19', '08:15:00', '17:15:00', 8.00, 'PC007'),
(56, 'E020', '2024-03-20', '08:00:00', '17:00:00', 8.00, 'PC007');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` varchar(10) NOT NULL,
  `DepartmentName` varchar(255) NOT NULL,
  `DivisionID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DepartmentID`, `DepartmentName`, `DivisionID`) VALUES
('DEP01', 'Phòng Kỹ thuật Đầu tư', 'D001'),
('DEP02', 'Phòng Kế toán Kế hoạch', 'D001'),
('DEP03', 'Phòng Nhân sự Tổng hợp', 'D001'),
('DEP04', 'Trung tâm Công nghệ Thông tin', 'D002'),
('DEP05', 'Trung tâm Điều hành Thông tin', 'D002'),
('DEP06', 'Trung tâm Viễn thông', 'D002');

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
('D001', 'Khối tham mưu', '2010-06-15'),
('D002', 'Khối trực tiếp SXKD', '2012-09-22');

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
  `JobTitle` varchar(100) NOT NULL,
  `Position` varchar(100) NOT NULL,
  `StartDate` date DEFAULT NULL,
  `Image` text DEFAULT NULL,
  `DepartmentID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeID`, `FullName`, `PhoneNumber`, `DateOfBirth`, `Gender`, `Address`, `PersonalEmail`, `WorkEmail`, `JobTitle`, `Position`, `StartDate`, `Image`, `DepartmentID`) VALUES
('E0011', 'Lê Thị Thuyết', '048673473', '1994-07-22', 'Nữ', 'Hải Phòng', 'thuyet.lt@gmail.com', 'thithuyet@vnpt.nghean.vn', 'Nhân viên chăm sóc khach hàng', 'Nhân viên', '2025-03-05', '1743010558765-OIP.jpg', 'DEP03'),
('E002', 'Nguyễn Hoàng Anh', '0976543210', '1999-12-12', 'Nữ', 'Hải Phòng', 'hoanganhpersonal@gmail.com', 'vhanh.dhkt15a13hn@sv.uneti.edu.vn', 'Nhân viên IT', 'Tester', '2023-06-15', '1742980177542-e25.png', 'DEP01'),
('E003', 'Phạm Thị Quỳnh Nga', '0965432109', '2001-03-20', 'Nữ', 'Đà Nẵng', 'quynhngapersonal@gmail.com', 'ptqnga.dhti15a10hn@sv.uneti.edu.vn', 'CEO', 'Giáo đốc', '2023-07-20', '1742980138153-e3.jpg', 'DEP03'),
('E004', 'Phạm Minh Đức', '0969988776', '1988-06-18', 'Nam', 'Hải Phòng', 'duc.pm@gmail.com', 'duc.pm@vnpt.nghean.vn', 'Trưởng nhóm IT', 'Quản lý', '2017-09-25', '1742980194677-e24.png', 'DEP04'),
('E005', 'Hoàng Hải Yến', '0958877665', '1995-04-05', 'Nữ', 'Nghệ An', 'yen.hh@gmail.com', 'yen.hh@vnpt.nghean.vn', 'Nhân viên kinh doanh', 'Nhân viên', '2019-06-30', '1742980211248-e1.jpg', 'DEP05'),
('E006', 'Vũ Quang Huy', '0947766554', '1983-12-12', 'Nam', 'Thanh Hóa', 'huy.vq@gmail.com', 'huy.vq@vnpt.nghean.vn', 'Trưởng phòng kỹ thuật', 'BA', '2014-11-10', '1742980228718-e23.jpg', 'DEP06'),
('E007', 'Đặng Thị Hằng', '0936655443', '1991-09-03', 'Nữ', 'Quảng Bình', 'hang.dt@gmail.com', 'hang.dt@vnpt.nghean.vn', 'Nhân viên kế toán', 'Nhân viên', '2020-03-17', '1742980255531-e2.jpg', 'DEP02'),
('E008', 'Bùi Văn Long', '0925544332', '1996-05-14', 'Nam', 'Ninh Bình', 'long.bv@gmail.com', 'long.bv@vnpt.nghean.vn', 'Nhân viên kỹ thuật', 'Nhân viên', '2021-01-05', '1742980273227-e22.jpg', 'DEP01'),
('E009', 'Ngô Thanh Phong', '0914433221', '1990-10-20', 'Nam', 'Huế', 'phong.nt@gmail.com', 'phong.nt@vnpt.nghean.vn', 'Quản lý dự án', 'Quản lý', '2018-07-09', '1742980290257-e20.jpg', 'DEP03'),
('E010', 'Dương Quốc Bảo', '0983322110', '1987-08-25', 'Nam', 'Nam Định', 'bao.dq@gmail.com', 'bao.dq@vnpt.nghean.vn', 'Trưởng nhóm phần mềm', 'Quản lý', '2015-04-22', '1742980316405-e11.jpg', 'DEP04'),
('E011', 'Tạ Văn Tài', '0972211009', '1993-02-11', 'Nam', 'Bắc Giang', 'tai.tv@gmail.com', 'tai.tv@vnpt.nghean.vn', 'Nhân viên vận hành', 'Nhân viên', '2019-08-15', '1742980338995-e10.jpg', 'DEP05'),
('E012', 'Lương Bảo Ngọc', '0961100987', '1994-11-30', 'Nữ', 'Lạng Sơn', 'ngoc.lb@gmail.com', 'ngoc.lb@vnpt.nghean.vn', 'Nhân viên hành chính', 'Nhân viên', '2022-02-28', '1742980354877-e4.jpg', 'DEP06'),
('E013', 'Đỗ Hữu Hạnh', '0959998877', '1989-06-22', 'Nam', 'Hà Tĩnh', 'hanh.dh@gmail.com', 'hanh.dh@vnpt.nghean.vn', 'Nhân viên nhân sự', 'Nhân viên', '2020-12-19', '1742980396246-e7.jpg', 'DEP03'),
('E014', 'Trịnh Thị Lan', '0948887766', '1992-09-15', 'Nữ', 'Thái Nguyên', 'lan.tt@gmail.com', 'lan.tt@vnpt.nghean.vn', 'Kế toán viên', 'Kế toán', '2017-06-07', '1742980412034-e6.jpg', 'DEP02'),
('E015', 'Tạ Văn Tú', '0965789012', '1991-01-17', 'Nam', 'Bình Dương', 'tai.nguyen@example.com', 'tvtu.dhti15a18hn@sv.uneti.edu.vn', 'Nhân viên IT', 'IT Consultant', '2019-02-28', '1742980425025-e21.jpg', 'DEP03'),
('E016', 'Hồ Minh Sang', '0926665544', '1997-03-19', 'Nam', 'Bạc Liêu', 'sang.hm@gmail.com', 'sang.hm@vnpt.nghean.vn', 'Nhân viên IT', 'Nhân viên', '2021-09-30', '1743003441043-e40.png', 'DEP04'),
('E017', 'Nguyễn Thu Hà', '0915554433', '1990-12-05', 'Nữ', 'Vĩnh Long', 'ha.nt@gmail.com', 'ha.nt@vnpt.nghean.vn', 'Nhân viên kế toán', 'Nhân viên', '2020-10-01', '1742981062316-e15.jpg', 'DEP02'),
('E018', 'Trần Đình Phúc', '0984443322', '1984-11-10', 'Nam', 'Phú Yên', 'phuc.td@gmail.com', 'phuc.td@vnpt.nghean.vn', 'Quản lý vận hành', 'Quản lý', '2013-03-22', '1743003459172-e39.png', 'DEP05'),
('E019', 'Lê Quốc Thịnh', '0973332211', '1985-02-17', 'Nam', 'Bình Phước', 'thinh.lq@gmail.com', 'thinh.lq@vnpt.nghean.vn', 'Trưởng nhóm kỹ thuật', 'Quản lý', '2014-12-29', '1743003468068-e38.png', 'DEP06'),
('E020', 'Võ Hồng Nhung', '0962221100', '1995-06-12', 'Nữ', 'Cà Mau', 'nhung.vh@gmail.com', 'nhung.vh@vnpt.nghean.vn', 'Nhân viên nhân sự', 'Nhân viên', '2022-07-01', '1742981094985-e16.jpg', 'DEP03'),
('E021', 'Nguyễn Hoàng Nam', '0901122334', '1993-04-01', 'Nam', 'Bắc Ninh', 'nam.nh@gmail.com', 'nam.nh@vnpt.nghean.vn', 'Nhân viên CSKH', 'Nhân viên', '2021-08-10', '1743003479496-e37.png', 'DEP05'),
('E022', 'Lê Thanh Hương', '0982233445', '1991-07-20', 'Nữ', 'Hà Nam', 'huong.lt@gmail.com', 'huong.lt@vnpt.nghean.vn', 'Nhân viên hành chính', 'Nhân viên', '2020-11-22', '1742981112076-e14.jpg', 'DEP06'),
('E023', 'Phạm Văn Tuấn', '0973344556', '1988-03-15', 'Nam', 'Tuyên Quang', 'tuan.pv@gmail.com', 'tuan.pv@vnpt.nghean.vn', 'Trưởng phòng CSKH', 'Quản lý', '2017-05-18', '1743003523253-e36.jpg', 'DEP05'),
('E024', 'Hoàng Thu Trang', '0964455667', '1994-09-11', 'Nữ', 'Hòa Bình', 'trang.ht@gmail.com', 'trang.ht@vnpt.nghean.vn', 'Nhân viên kế toán', 'Nhân viên', '2021-04-30', '1743003536288-e35.jpg', 'DEP02'),
('E025', 'Đỗ Hải Sơn', '0955566778', '1986-12-08', 'Nam', 'Quảng Trị', 'son.dh@gmail.com', 'son.dh@vnpt.nghean.vn', 'Trưởng nhóm kỹ thuật', 'Quản lý', '2015-09-14', '1743003548740-e34.jpg', 'DEP01'),
('E026', 'Nguyễn Thanh Vũ', '0946677889', '1992-05-23', 'Nam', 'Kon Tum', 'vu.nt@gmail.com', 'vu.nt@vnpt.nghean.vn', 'Nhân viên IT', 'Nhân viên', '2019-10-25', '1743003562143-e33.jpg', 'DEP04'),
('E027', 'Trần Hoài Nam', '0937788990', '1997-11-02', 'Nam', 'Sơn La', 'nam.th@gmail.com', 'nam.th@vnpt.nghean.vn', 'Nhân viên kinh doanh', 'Nhân viên', '2022-03-19', '1743003575337-e32.jpg', 'DEP03'),
('E028', 'Vũ Bảo Trâm', '0928899001', '1990-06-14', 'Nữ', 'Bình Thuận', 'tram.vb@gmail.com', 'tram.vb@vnpt.nghean.vn', 'Nhân viên nhân sự', 'Nhân viên', '2021-07-15', '1743003595299-e31.jpg', 'DEP03'),
('E029', 'Lý Văn Bình', '0919900112', '1984-01-09', 'Nam', 'Cần Thơ', 'binh.lv@gmail.com', 'binh.lv@vnpt.nghean.vn', 'Trưởng phòng kỹ thuật', 'Giám đốc', '2012-12-01', '1743003941609-e43.jpg', 'DEP06'),
('E030', 'Hà Thị Mai', '0900011223', '1996-08-28', 'Nữ', 'An Giang', 'mai.ht@gmail.com', 'mai.ht@vnpt.nghean.vn', 'Nhân viên CSKH', 'Nhân viên', '2023-01-10', '1742981134663-e13.jpg', 'DEP05'),
('E031', 'Nguyễn Văn An', '0912345678', '1990-01-15', 'Nam', 'Hà Nội', 'an.nv@gmail.com', 'an.nv@vnpt.nghean.vn', 'Trưởng phòng', 'Giám đốc', '2015-05-20', '1743003999220-e44.jpg', 'DEP01'),
('E032', 'Trần Thị Bích', '0987654321', '1985-03-22', 'Nữ', 'TP. Hồ Chí Minh', 'bich.tt@gmail.com', 'bich.tt@vnpt.nghean.vn', 'Kế toán trưởng', 'Quản lý', '2016-08-15', '1742981150594-e19.jpg', 'DEP02'),
('E033', 'Lê Văn Cường', '0971122334', '1992-07-10', 'Nam', 'Đà Nẵng', 'cuong.lv@gmail.com', 'cuong.lv@vnpt.nghean.vn', 'Chuyên viên nhân sự', 'Nhân viên', '2018-02-11', '1743004360671-e45.jpg', 'DEP03'),
('E034', 'Phan Văn Mạnh', '0937776655', '1986-07-28', 'Nam', 'Bình Định', 'manh.pv@gmail.com', 'manh.pv@vnpt.nghean.vn', 'Nhân viên kỹ thuật', 'Nhân viên', '2016-05-10', '1743004763497-e46.jpg', 'DEP01');

-- --------------------------------------------------------

--
-- Table structure for table `employeescontracts`
--

CREATE TABLE `employeescontracts` (
  `ID_Contract` varchar(10) NOT NULL,
  `EmployeeID` varchar(10) NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeescontracts`
--

INSERT INTO `employeescontracts` (`ID_Contract`, `EmployeeID`, `StartDate`, `EndDate`) VALUES
('C001', 'E011', '2023-03-01', '2026-03-05'),
('C001', 'E015', '2023-01-01', '2024-01-01'),
('C001', 'E021', '2023-05-01', '2024-05-01'),
('C002', 'E002', '2023-02-01', NULL),
('C002', 'E012', '2023-04-01', '2025-04-01'),
('C002', 'E022', '2023-07-01', '2025-07-01'),
('C003', 'E003', '2022-06-15', NULL),
('C003', 'E013', '2022-08-10', NULL),
('C003', 'E023', '2022-09-20', NULL),
('C004', 'E004', '2024-03-01', '2024-06-01'),
('C004', 'E014', '2024-05-01', '2024-08-01'),
('C004', 'E024', '2024-06-01', '2024-09-01'),
('C005', 'E005', '2023-07-01', '2024-01-01'),
('C005', 'E015', '2023-10-01', '2024-04-01'),
('C005', 'E025', '2023-11-01', '2024-05-01'),
('C006', 'E006', '2023-08-15', '2024-02-15'),
('C006', 'E016', '2023-12-15', '2024-06-15'),
('C006', 'E026', '2024-01-15', '2024-07-15'),
('C007', 'E007', '2024-01-01', '2024-07-01'),
('C007', 'E017', '2024-02-01', '2024-08-01'),
('C007', 'E027', '2024-03-01', '2024-09-01'),
('C008', 'E008', '2023-09-01', NULL),
('C008', 'E018', '2023-06-01', NULL),
('C008', 'E028', '2023-10-01', NULL),
('C009', 'E009', '2023-11-01', '2024-05-01'),
('C009', 'E019', '2023-09-01', '2024-03-01'),
('C009', 'E029', '2023-12-01', '2024-06-01'),
('C010', 'E010', '2022-12-01', NULL),
('C010', 'E020', '2022-11-01', NULL),
('C010', 'E030', '2022-10-01', NULL);

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
(7, 'E016', 'Nguyễn Văn Hùng', 'Cha', '1965-04-15', 'Nam', 'Hà Nội', '0912345678'),
(8, 'E017', 'Trần Thị Mai', 'Mẹ', '1968-07-20', 'Nữ', 'Hà Nội', '0987654321'),
(9, 'E002', 'Lê Văn Nam', 'Anh', '1990-01-10', 'Nam', 'TP HCM', '0911122334'),
(10, 'E002', 'Hoàng Thị Lan', 'Em gái', '1995-09-22', 'Nữ', 'TP HCM', '0922334455'),
(11, 'E003', 'Phạm Văn Hoàng', 'Cha', '1960-03-30', 'Nam', 'Đà Nẵng', '0933445566'),
(12, 'E003', 'Đặng Thị Hương', 'Mẹ', '1963-12-05', 'Nữ', 'Đà Nẵng', '0944556677'),
(13, 'E004', 'Bùi Văn Sơn', 'Anh', '1987-06-18', 'Nam', 'Cần Thơ', '0955667788'),
(14, 'E004', 'Lý Thị Ngọc', 'Em gái', '1999-11-25', 'Nữ', 'Cần Thơ', '0966778899'),
(15, 'E005', 'Ngô Văn Hòa', 'Cha', '1972-08-09', 'Nam', 'Hải Phòng', '0977889900'),
(16, 'E005', 'Dương Thị Thu', 'Mẹ', '1975-02-14', 'Nữ', 'Hải Phòng', '0988990011'),
(17, 'E006', 'Lý Văn Tâm', 'Vợ', '1992-05-19', 'Nữ', 'Quảng Ninh', '0999001122'),
(18, 'E006', 'Nguyễn Văn Long', 'Con trai', '2015-07-30', 'Nam', 'Quảng Ninh', '0900112233'),
(19, 'E007', 'Hoàng Văn Đạt', 'Anh', '1985-04-17', 'Nam', 'Bắc Ninh', '0911223344'),
(20, 'E007', 'Trần Thị Minh', 'Em gái', '1998-10-12', 'Nữ', 'Bắc Ninh', '0922334455'),
(21, 'E008', 'Phan Văn Thắng', 'Cha', '1961-09-27', 'Nam', 'Nam Định', '0933445566'),
(22, 'E008', 'Lê Thị Phương', 'Mẹ', '1966-06-08', 'Nữ', 'Nam Định', '0944556677'),
(23, 'E009', 'Đặng Văn Lâm', 'Anh', '1989-12-15', 'Nam', 'Thái Bình', '0955667788'),
(24, 'E009', 'Dương Thị Thanh', 'Em gái', '1997-03-05', 'Nữ', 'Thái Bình', '0966778899'),
(25, 'E010', 'Bùi Văn Hải', 'Vợ', '1994-07-23', 'Nữ', 'Nghệ An', '0977889900'),
(26, 'E010', 'Nguyễn Văn Khánh', 'Con gái', '2017-02-09', 'Nữ', 'Nghệ An', '0988990011'),
(27, 'E011', 'Trần Văn Phúc', 'Cha', '1964-11-12', 'Nam', 'Thanh Hóa', '0999001122'),
(28, 'E011', 'Lý Thị Hà', 'Mẹ', '1967-05-30', 'Nữ', 'Thanh Hóa', '0900112233'),
(29, 'E012', 'Hoàng Văn Tú', 'Anh', '1991-08-07', 'Nam', 'Phú Thọ', '0911223344'),
(30, 'E012', 'Lê Thị Dung', 'Em gái', '1996-01-19', 'Nữ', 'Phú Thọ', '0922334455'),
(31, 'E013', 'Phan Văn Quang', 'Cha', '1959-04-28', 'Nam', 'Lào Cai', '0933445566'),
(32, 'E013', 'Nguyễn Thị Hòa', 'Mẹ', '1962-07-10', 'Nữ', 'Lào Cai', '0944556677'),
(33, 'E014', 'Đặng Văn Khoa', 'Anh', '1988-09-04', 'Nam', 'Yên Bái', '0955667788'),
(34, 'E014', 'Dương Thị Hằng', 'Em gái', '1993-12-22', 'Nữ', 'Yên Bái', '0966778899'),
(35, 'E015', 'Bùi Văn Bình', 'Vợ', '1993-06-14', 'Nữ', 'Hà Giang', '0977889900'),
(36, 'E015', 'Nguyễn Văn Duy', 'Con trai', '2016-10-11', 'Nam', 'Hà Giang', '0988990011');

-- --------------------------------------------------------

--
-- Table structure for table `jobprofiles`
--

CREATE TABLE `jobprofiles` (
  `EmployeeID` varchar(10) NOT NULL,
  `EmploymentStatus` varchar(50) DEFAULT NULL,
  `StandardWorkingHours` int(11) DEFAULT NULL,
  `RemainingLeaveDays` int(11) DEFAULT NULL,
  `EmergencyContactNumber` varchar(11) DEFAULT NULL,
  `EmergencyContactName` varchar(255) DEFAULT NULL,
  `BaseSalary` decimal(18,2) DEFAULT NULL,
  `Allowance` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobprofiles`
--

INSERT INTO `jobprofiles` (`EmployeeID`, `EmploymentStatus`, `StandardWorkingHours`, `RemainingLeaveDays`, `EmergencyContactNumber`, `EmergencyContactName`, `BaseSalary`, `Allowance`) VALUES
('E002', 'Chính thức', 40, 10, '0964376355', 'Tran Van B', 12000000.00, 1500000.00),
('E003', 'Thử việc', 40, 8, '0346012124', 'Le Van C', 8000000.00, 1000000.00),
('E004', 'Chính thức', 40, 15, '0936123456', 'Hoàng Thị Lan', 18000000.00, 3000000.00),
('E005', 'Chính thức', 40, 8, '0947123456', 'Đỗ Thị Ngọc', 33000000.00, 2200000.00),
('E006', 'Thử việc', 35, 7, '0958123456', 'Bùi Văn Nam', 9000000.00, 1500000.00),
('E007', 'Chính thức', 40, 10, '0969123456', 'Phạm Thị Mai', 14000000.00, 1800000.00),
('E008', 'Chính thức', 40, 20, '0970123456', 'Trịnh Văn Quang', 16000000.00, 2500000.00),
('E009', 'Thử việc', 35, 4, '0981123456', 'Lương Văn Tuấn', 7500000.00, 900000.00),
('E010', 'Chính thức', 40, 9, '0992123456', 'Nguyễn Thị Hương', 12500000.00, 2000000.00),
('E011', 'Chính thức', 40, 14, '0903124567', 'Đinh Văn Dũng', 15500000.00, 2300000.00),
('E012', 'Chính thức', 40, 6, '0914124567', 'Cao Thị Thu', 13500000.00, 2100000.00),
('E013', 'Thử việc', 35, 3, '0925124567', 'Vũ Văn Hoàng', 8500000.00, 1200000.00),
('E014', 'Chính thức', 40, 11, '0936124567', 'Hà Thị Nga', 24500000.00, 1900000.00),
('E015', 'Chính thức', 40, 13, '0947124567', 'Tô Văn Lộc', 17000000.00, 2800000.00),
('E016', 'Thử việc', 35, 6, '0958124567', 'Lý Thị Xuân', 9200000.00, 1300000.00),
('E017', 'Chính thức', 40, 17, '0969124567', 'Ngô Văn Hưng', 18500000.00, 3000000.00),
('E018', 'Chính thức', 40, 5, '0970124567', 'Đoàn Thị Ngân', 13000000.00, 2000000.00),
('E019', 'Thử việc', 35, 8, '0981124567', 'Trương Văn Tiến', 7800000.00, 950000.00),
('E020', 'Chính thức', 40, 12, '0992124567', 'Đặng Văn Kiên', 12500000.00, 1950000.00),
('E021', 'Chính thức', 40, 10, '0903234567', 'Lê Thị Thanh', 16000000.00, 2400000.00),
('E022', 'Thử việc', 35, 4, '0914234567', 'Bạch Văn Hà', 8200000.00, 1150000.00),
('E023', 'Chính thức', 40, 14, '0925234567', 'Tạ Văn Đạt', 14000000.00, 1800000.00),
('E024', 'Chính thức', 40, 18, '0936234567', 'Nguyễn Thị Nhung', 17500000.00, 2900000.00),
('E025', 'Thử việc', 35, 7, '0947234567', 'Phan Văn Hải', 9000000.00, 1250000.00),
('E026', 'Chính thức', 40, 9, '0958234567', 'Quách Văn Minh', 13000000.00, 2100000.00),
('E027', 'Chính thức', 40, 15, '0969234567', 'Dương Văn Sơn', 14500000.00, 2250000.00),
('E028', 'Thử việc', 35, 5, '0970234567', 'Trần Thị Lệ', 8500000.00, 1100000.00),
('E029', 'Chính thức', 40, 16, '0981234567', 'Võ Văn Hậu', 15500000.00, 2600000.00),
('E030', 'Chính thức', 40, 20, '0992234567', 'Nguyễn Hoàng Yến', 19000000.00, 3200000.00),
('E031', 'Chính thức', 40, 10, '0914123456', 'Nguyễn Thị Hạnh', 15000000.00, 2500000.00),
('E032', 'Thử việc', 35, 5, '0925123456', 'Lê Văn Hùng', 8000000.00, 1000000.00),
('E033', 'Chính thức', 40, 12, '0903123456', 'Trần Văn Minh', 22000000.00, 2000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `laborcontracts`
--

CREATE TABLE `laborcontracts` (
  `ID_Contract` varchar(10) NOT NULL,
  `ContractType` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laborcontracts`
--

INSERT INTO `laborcontracts` (`ID_Contract`, `ContractType`) VALUES
('C001', 'Hợp đồng lao động xác định thời hạn 1 năm'),
('C002', 'Hợp đồng lao động xác định thời hạn 2 năm'),
('C003', 'Hợp đồng lao động không xác định thời hạn'),
('C004', 'Hợp đồng thử việc 3 tháng'),
('C005', 'Hợp đồng thời vụ 6 tháng'),
('C006', 'Hợp đồng học việc'),
('C007', 'Hợp đồng thực tập'),
('C008', 'Hợp đồng lao động khoán việc'),
('C009', 'Hợp đồng lao động ngắn hạn 1 tháng'),
('C010', 'Hợp đồng dịch vụ');

-- --------------------------------------------------------

--
-- Table structure for table `monthlysalaries`
--

CREATE TABLE `monthlysalaries` (
  `ID_Salary` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) DEFAULT NULL,
  `InsuranceFee` decimal(18,2) DEFAULT NULL,
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

INSERT INTO `monthlysalaries` (`ID_Salary`, `EmployeeID`, `ID_PayrollCycle`, `InsuranceFee`, `TaxPayable`, `Forfeit`, `PrizeMoney`, `TotalOTSalary`, `NetSalary`, `PaymentDate`) VALUES
(2, 'E002', 'PC22024', 1260000.00, 0.00, 150000.00, 200000.00, 0.00, 12290000.00, '2025-03-26'),
(3, 'E003', 'PC12024', 840000.00, 0.00, 50000.00, 200000.00, 0.00, 8310000.00, '2025-03-23'),
(16, 'E004', 'PC001', 1890000.00, 65000.00, 100000.00, 200000.00, 0.00, 19145000.00, '2025-03-26');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `NotificationID` int(11) NOT NULL,
  `sentID` varchar(10) NOT NULL,
  `receivedID` varchar(10) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `CreatedAt` date DEFAULT current_timestamp(),
  `ExpiredAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`NotificationID`, `sentID`, `receivedID`, `Title`, `Message`, `Type`, `CreatedAt`, `ExpiredAt`) VALUES
(11, 'E001', 'E002', 'Hệ thống bảo trì', 'Hệ thống sẽ bảo trì vào lúc 23:00.', 'System', '2025-03-25', '2025-04-01'),
(12, 'E003', 'All', 'Cập nhật chính sách', 'Chính sách bảo hiểm mới đã được cập nhật.', 'Policy', '2025-03-25', '2025-05-01'),
(13, 'E002', 'All', 'Lương tháng 3', 'Lương tháng 3 đã được thanh toán.', 'Salary', '2025-03-25', '2025-04-30'),
(14, 'E004', 'E003', 'Nghỉ lễ 30/4', 'Lịch nghỉ lễ 30/4 và 1/5 đã được cập nhật.', 'Event', '2025-03-25', '2025-05-02'),
(15, 'E005', 'E003', 'Chấm công', 'Vui lòng kiểm tra lại bảng công tháng này. Thông báo này vui lòng đọc kỹ.', 'Attendance', '2025-03-02', '2025-03-24'),
(16, 'E003', 'E002', 'Thưởng lễ', 'Bạn sẽ nhận được thưởng lễ 30/4 vào kỳ lương tiếp theo.', 'Bonus', '2025-03-25', '2025-05-01'),
(17, 'E007', 'All', 'Tăng ca', 'Bạn có đăng ký ca làm thêm vào cuối tuần?', 'Overtime', '2025-03-25', '2025-04-10'),
(18, 'E008', 'E003', 'Cập nhật hệ thống', 'Hệ thống đã được nâng cấp lên phiên bản mới.', 'System', '2025-03-25', '2025-04-15'),
(19, 'E009', 'All', 'Kiểm tra tài khoản', 'Vui lòng cập nhật thông tin tài khoản của bạn.', 'Security', '2025-03-25', '2025-04-20'),
(20, 'E010', 'All', 'Họp công ty', 'Cuộc họp toàn công ty sẽ diễn ra vào tuần sau.', 'Meeting', '2025-03-25', '2025-04-25');

-- --------------------------------------------------------

--
-- Table structure for table `overtimes`
--

CREATE TABLE `overtimes` (
  `ID_OT` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `ManagerID` varchar(10) NOT NULL,
  `ReasonOT` text DEFAULT NULL,
  `OTType` enum('Ngày thường','Cuối tuần','Ngày lễ','') DEFAULT NULL,
  `DateTime` date DEFAULT NULL,
  `OverTimesHours` decimal(5,2) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `ID_PayrollCycle` varchar(10) DEFAULT NULL,
  `CreatedAt` date DEFAULT NULL,
  `ApprovedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `overtimes`
--

INSERT INTO `overtimes` (`ID_OT`, `EmployeeID`, `ManagerID`, `ReasonOT`, `OTType`, `DateTime`, `OverTimesHours`, `Status`, `ID_PayrollCycle`, `CreatedAt`, `ApprovedAt`) VALUES
(35, 'E031', 'M001', 'Dự án gấp cần hoàn thành', 'Ngày thường', '2024-03-01', 2.50, 'Approved', 'PC001', '2024-03-01', '2024-03-02'),
(36, 'E002', 'M002', 'Hỗ trợ triển khai phần mềm', 'Ngày lễ', '2024-03-02', 3.00, 'Pending', 'PC001', '2024-03-02', NULL),
(37, 'E003', 'M003', 'Xử lý sự cố hệ thống', 'Cuối tuần', '2024-03-03', 4.00, 'Approved', 'PC001', '2024-03-03', '2024-03-04'),
(38, 'E004', 'M004', 'Nâng cấp server', 'Ngày thường', '2024-03-04', 1.50, 'Rejected', 'PC002', '2024-03-04', NULL),
(39, 'E005', 'M005', 'Bảo trì định kỳ hệ thống', 'Ngày thường', '2024-03-05', 2.00, 'Approved', 'PC002', '2024-03-05', '2024-03-06'),
(40, 'E006', 'M006', 'Hoàn thành báo cáo tài chính', 'Ngày lễ', '2024-03-06', 3.50, 'Pending', 'PC002', '2024-03-06', NULL),
(41, 'E007', 'M007', 'Hỗ trợ khách hàng nước ngoài', 'Cuối tuần', '2024-03-07', 5.00, 'Approved', 'PC003', '2024-03-07', '2024-03-08'),
(42, 'E008', 'M008', 'Test hệ thống ERP', 'Ngày thường', '2024-03-08', 2.00, 'Approved', 'PC003', '2024-03-08', '2024-03-09'),
(43, 'E009', 'M009', 'Hoàn thành tài liệu hướng dẫn', 'Ngày lễ', '2024-03-09', 2.50, 'Pending', 'PC003', '2024-03-09', NULL),
(44, 'E010', 'M010', 'Giám sát triển khai dự án', 'Ngày thường', '2024-03-10', 3.00, 'Approved', 'PC004', '2024-03-10', '2024-03-11'),
(45, 'E011', 'M011', 'Đào tạo nhân viên mới', 'Cuối tuần', '2024-03-11', 4.50, 'Pending', 'PC004', '2024-03-11', NULL),
(46, 'E012', 'M012', 'Chỉnh sửa báo cáo khách hàng', 'Ngày thường', '2024-03-12', 1.50, 'Approved', 'PC004', '2024-03-12', '2024-03-13'),
(47, 'E013', 'M013', 'Tư vấn giải pháp công nghệ', 'Ngày lễ', '2024-03-13', 3.50, 'Rejected', 'PC005', '2024-03-13', NULL),
(48, 'E014', 'M014', 'Kiểm tra lỗi phần mềm', 'Ngày thường', '2024-03-14', 2.00, 'Approved', 'PC005', '2024-03-14', '2024-03-15'),
(49, 'E015', 'M015', 'Cập nhật dữ liệu khách hàng', 'Cuối tuần', '2024-03-15', 5.00, 'Approved', 'PC005', '2024-03-15', '2024-03-16'),
(50, 'E016', 'M016', 'Thiết lập môi trường test', 'Ngày lễ', '2024-03-16', 2.50, 'Pending', 'PC006', '2024-03-16', NULL),
(51, 'E017', 'M017', 'Giám sát hiệu suất máy chủ', 'Ngày thường', '2024-03-17', 3.00, 'Approved', 'PC006', '2024-03-17', '2024-03-18'),
(52, 'E018', 'M018', 'Định hướng dự án mới', 'Cuối tuần', '2024-03-18', 4.00, 'Approved', 'PC006', '2024-03-18', '2024-03-19'),
(53, 'E019', 'M019', 'Cập nhật chính sách công ty', 'Ngày lễ', '2024-03-19', 2.50, 'Pending', 'PC007', '2024-03-19', NULL),
(54, 'E020', 'M020', 'Hỗ trợ xử lý ticket khẩn', 'Ngày thường', '2024-03-20', 3.50, 'Approved', 'PC007', '2024-03-20', '2024-03-21'),
(55, 'E021', 'M001', 'Phân tích dữ liệu kinh doanh', 'Ngày thường', '2024-03-21', 2.00, 'Approved', 'PC001', '2024-03-21', '2024-03-22'),
(56, 'E022', 'M002', 'Hỗ trợ phát triển sản phẩm mới', 'Ngày lễ', '2024-03-22', 3.00, 'Pending', 'PC001', '2024-03-22', NULL),
(57, 'E023', 'M003', 'Quản lý lỗi hệ thống', 'Cuối tuần', '2024-03-23', 4.00, 'Approved', 'PC002', '2024-03-23', '2024-03-24'),
(58, 'E024', 'M004', 'Kiểm tra bảo mật ứng dụng', 'Ngày thường', '2024-03-24', 1.50, 'Rejected', 'PC002', '2024-03-24', NULL),
(59, 'E025', 'M005', 'Phát triển mô hình AI', 'Ngày lễ', '2024-03-25', 3.50, 'Approved', 'PC002', '2024-03-25', '2024-03-26'),
(60, 'E026', 'M006', 'Tạo chiến lược marketing', 'Cuối tuần', '2024-03-26', 5.00, 'Pending', 'PC003', '2024-03-26', NULL),
(61, 'E027', 'M007', 'Kiểm thử ứng dụng web', 'Ngày thường', '2024-03-27', 2.00, 'Approved', 'PC003', '2024-03-27', '2024-03-28'),
(62, 'E028', 'M008', 'Thiết kế giao diện UX/UI', 'Ngày lễ', '2024-03-28', 2.50, 'Pending', 'PC003', '2024-03-28', NULL),
(63, 'E029', 'M009', 'Hỗ trợ triển khai cloud', 'Ngày thường', '2024-03-29', 3.00, 'Approved', 'PC004', '2024-03-29', '2024-03-30'),
(64, 'E030', 'M010', 'Quản lý dữ liệu server', 'Cuối tuần', '2024-03-30', 4.50, 'Approved', 'PC004', '2024-03-30', '2024-03-31');

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
('PC001', 'Tháng 1/2024', '2024-01-01', '2024-01-31', 'Hoàn thành'),
('PC002', 'Tháng 2/2024', '2024-02-01', '2024-02-29', 'Hoàn thành'),
('PC003', 'Tháng 3/2024', '2024-03-01', '2024-03-31', 'Hoàn thành'),
('PC004', 'Tháng 4/2024', '2024-04-01', '2024-04-30', 'Hoàn thành'),
('PC005', 'Tháng 5/2024', '2024-05-01', '2024-05-31', 'Hoàn thành'),
('PC006', 'Tháng 6/2024', '2024-06-01', '2024-06-30', 'Hoàn thành'),
('PC007', 'Tháng 7/2024', '2024-07-01', '2024-07-31', 'Hoàn thành'),
('PC008', 'Tháng 8/2024', '2024-08-01', '2024-08-31', 'Hoàn thành'),
('PC009', 'Tháng 9/2024', '2024-09-01', '2024-09-30', 'Hoàn thành'),
('PC010', 'Tháng 10/2024', '2024-10-01', '2024-10-31', 'Hoàn thành'),
('PC011', 'Tháng 11/2024', '2024-11-01', '2024-11-30', 'Hoàn thành'),
('PC012', 'Tháng 12/2024', '2024-12-01', '2024-12-31', 'Hoàn thành'),
('PC013', 'Tháng 1/2025', '2025-01-01', '2025-01-31', 'Hoàn thành'),
('PC014', 'Tháng 2/2025', '2025-02-01', '2025-02-28', 'Hoàn thành'),
('PC015', 'Tháng 3/2025', '2025-03-01', '2025-03-31', 'Đang xử lý'),
('PC016', 'Tháng 4/2025', '2025-04-01', '2025-04-30', 'Chưa bắt đầu'),
('PC017', 'Tháng 5/2025', '2025-05-01', '2025-05-31', 'Chưa bắt đầu'),
('PC018', 'Tháng 6/2025', '2025-06-01', '2025-06-30', 'Chưa bắt đầu'),
('PC102024', '10/2024', '2024-10-01', '2024-10-31', 'Sắp diễn ra'),
('PC112024', '11/2024', '2024-11-01', '2024-11-30', 'Sắp diễn ra'),
('PC12024', '1/2024', '2024-01-01', '2024-01-31', 'Đã hoàn thành'),
('PC12025', '1/2025', '2025-01-01', '2025-01-31', 'Sắp diễn ra'),
('PC122024', '12/2024', '2024-12-01', '2024-12-31', 'Sắp diễn ra'),
('PC22024', '2/2024', '2024-02-01', '2024-02-29', 'Đã hoàn thành'),
('PC22025', '2/2025', '2025-02-01', '2025-02-28', 'Sắp diễn ra'),
('PC32024', '3/2024', '2024-03-01', '2024-03-31', 'Đang xử lý'),
('PC32025', '3/2025', '2025-03-01', '2025-03-31', 'Sắp diễn ra'),
('PC42024', '4/2024', '2024-04-01', '2024-04-30', 'Chờ xử lý'),
('PC42025', '4/2025', '2025-04-01', '2025-04-30', 'Sắp diễn ra'),
('PC52024', '5/2024', '2024-05-01', '2024-05-31', 'Chờ xử lý'),
('PC52025', '5/2025', '2025-05-01', '2025-05-31', 'Sắp diễn ra'),
('PC62024', '6/2024', '2024-06-01', '2024-06-30', 'Sắp diễn ra'),
('PC62025', '6/2025', '2025-06-01', '2025-06-30', 'Sắp diễn ra'),
('PC72024', '7/2024', '2024-07-01', '2024-07-31', 'Sắp diễn ra'),
('PC72025', '7/2025', '2025-07-01', '2025-07-31', 'Sắp diễn ra'),
('PC82024', '8/2024', '2024-08-01', '2024-08-31', 'Sắp diễn ra'),
('PC82025', '8/2025', '2025-08-01', '2025-08-31', 'Sắp diễn ra'),
('PC92024', '9/2024', '2024-09-01', '2024-09-30', 'Sắp diễn ra');

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
('E001', '123456789', 'Vietnamese', 'Hanoi', '001303039642', 'Hanoi', 'University', 'Bachelor', 'IT', '2 years at ABC Corp', 'TX123456', '1234567890', 'Vietcombank', 'Độc thân'),
('E002', '123456788', 'Vietnamese', 'Hai Phong', '001303039642', 'Hai Phong', 'University', 'Bachelor', 'Software Testing', '1.5 years at XYZ Ltd', 'TX987654', '0987654321', 'Techcombank', 'Đã kết hôn'),
('E003', '123456787', 'Vietnamese', 'Da Nang', '001303039642', 'Da Nang', 'College', 'Diploma', 'Business Analysis', '1 year at LMN Inc', 'TX567891', '5678912345', 'Agribank', 'Độc thân'),
('E004', 'BH004', 'Việt Nam', 'Hải Phòng', '456789012345', 'Hải Phòng', 'Đại học', 'Cử nhân', 'Marketing', '4 năm kinh nghiệm Digital Marketing', 'TAX004', '556677889', 'ACB', 'Độc thân'),
('E005', 'BH005', 'Việt Nam', 'Cần Thơ', '567890123456', 'Cần Thơ', 'Cao đẳng', 'Kỹ sư', 'Xây dựng', '6 năm kinh nghiệm kỹ sư công trình', 'TAX005', '998877665', 'VietinBank', 'Đã kết hôn'),
('E006', 'BH006', 'Việt Nam', 'Huế', '678901234567', 'Huế', 'Đại học', 'Cử nhân', 'Tài chính', '5 năm kinh nghiệm phân tích tài chính', 'TAX006', '334455667', 'MB Bank', 'Độc thân'),
('E007', 'BH007', 'Việt Nam', 'Nha Trang', '789012345678', 'Nha Trang', 'Thạc sĩ', 'Thạc sĩ', 'Quản trị kinh doanh', '8 năm kinh nghiệm CEO', 'TAX007', '778899001', 'SHB', 'Đã kết hôn'),
('E008', 'BH008', 'Việt Nam', 'Bắc Ninh', '890123456789', 'Bắc Ninh', 'Đại học', 'Cử nhân', 'Kế toán', '4 năm kinh nghiệm kế toán trưởng', 'TAX008', '445566778', 'Sacombank', 'Độc thân'),
('E009', 'BH009', 'Việt Nam', 'Bình Dương', '901234567890', 'Bình Dương', 'Cao đẳng', 'Kỹ sư', 'Điện tử', '3 năm kinh nghiệm kỹ thuật viên', 'TAX009', '223344556', 'TPBank', 'Đã kết hôn'),
('E010', 'BH010', 'Việt Nam', 'Đồng Nai', '012345678901', 'Đồng Nai', 'Đại học', 'Cử nhân', 'Nhân sự', '6 năm kinh nghiệm quản lý nhân sự', 'TAX010', '667788990', 'Eximbank', 'Độc thân'),
('E011', 'BH011', 'Việt Nam', 'Hà Nam', '112233445566', 'Hà Nam', 'Đại học', 'Cử nhân', 'Công nghệ thông tin', '7 năm lập trình viên', 'TAX011', '776655443', 'Agribank', 'Đã kết hôn'),
('E012', 'BH012', 'Việt Nam', 'Sơn La', '223344556677', 'Sơn La', 'Đại học', 'Thạc sĩ', 'Y học', 'Bác sĩ chuyên khoa 5 năm', 'TAX012', '887766554', 'BIDV', 'Độc thân'),
('E013', 'BH013', 'Việt Nam', 'Thái Bình', '334455667788', 'Thái Bình', 'Cao đẳng', 'Kỹ sư', 'Cơ khí', '3 năm kỹ sư chế tạo máy', 'TAX013', '998877661', 'Vietcombank', 'Đã kết hôn'),
('E014', 'BH014', 'Việt Nam', 'Quảng Ninh', '445566778899', 'Quảng Ninh', 'Đại học', 'Cử nhân', 'Thương mại', '6 năm kinh nghiệm kinh doanh', 'TAX014', '110099887', 'MB Bank', 'Độc thân'),
('E015', 'BH015', 'Việt Nam', 'Hà Giang', '556677889900', 'Hà Giang', 'Thạc sĩ', 'Thạc sĩ', 'Quản lý', '8 năm quản lý điều hành', 'TAX015', '332211440', 'ACB', 'Đã kết hôn'),
('E016', 'BH016', 'Việt Nam', 'Lào Cai', '667788990011', 'Lào Cai', 'Cao đẳng', 'Kỹ sư', 'CNTT', '4 năm kinh nghiệm IT Support', 'TAX016', '776688550', 'Sacombank', 'Độc thân'),
('E017', 'BH017', 'Việt Nam', 'Tây Ninh', '778899001122', 'Tây Ninh', 'Đại học', 'Cử nhân', 'Hành chính', '5 năm kinh nghiệm nhân sự', 'TAX017', '889977441', 'Techcombank', 'Đã kết hôn'),
('E018', 'BH018', 'Việt Nam', 'Long An', '889900112233', 'Long An', 'Cao đẳng', 'Kỹ sư', 'Công nghệ thực phẩm', '3 năm kinh nghiệm QA/QC', 'TAX018', '990088331', 'TPBank', 'Độc thân'),
('E019', 'BH019', 'Việt Nam', 'Tiền Giang', '990011223344', 'Tiền Giang', 'Đại học', 'Cử nhân', 'Pháp luật', '5 năm kinh nghiệm tư vấn pháp lý', 'TAX019', '220011447', 'Eximbank', 'Đã kết hôn'),
('E020', 'BH020', 'Việt Nam', 'Bến Tre', '001122334455', 'Bến Tre', 'Thạc sĩ', 'Thạc sĩ', 'Tài chính ngân hàng', '7 năm kinh nghiệm tài chính', 'TAX020', '331122887', 'Agribank', 'Độc thân'),
('E021', 'BH021', 'Việt Nam', 'Quảng Nam', '112233445566', 'Quảng Nam', 'Đại học', 'Cử nhân', 'Kỹ thuật phần mềm', '5 năm phát triển phần mềm', 'TAX021', '112233441', 'Vietcombank', 'Độc thân'),
('E022', 'BH022', 'Việt Nam', 'Bạc Liêu', '223344556677', 'Bạc Liêu', 'Cao đẳng', 'Kỹ sư', 'Kinh tế xây dựng', '3 năm giám sát công trình', 'TAX022', '223344552', 'Techcombank', 'Đã kết hôn'),
('E023', 'BH023', 'Việt Nam', 'Phú Yên', '334455667788', 'Phú Yên', 'Thạc sĩ', 'Thạc sĩ', 'Y khoa', '7 năm bác sĩ chuyên khoa', 'TAX023', '334455663', 'BIDV', 'Độc thân'),
('E024', 'BH024', 'Việt Nam', 'An Giang', '445566778899', 'An Giang', 'Đại học', 'Cử nhân', 'Marketing', '4 năm Content Marketing', 'TAX024', '445566774', 'ACB', 'Đã kết hôn'),
('E025', 'BH025', 'Việt Nam', 'Vĩnh Long', '556677889900', 'Vĩnh Long', 'Cao đẳng', 'Kỹ sư', 'Công nghệ thông tin', '5 năm DevOps', 'TAX025', '556677885', 'VietinBank', 'Độc thân'),
('E026', 'BH026', 'Việt Nam', 'Đắk Lắk', '667788990011', 'Đắk Lắk', 'Đại học', 'Cử nhân', 'Tài chính ngân hàng', '6 năm kế toán tổng hợp', 'TAX026', '667788996', 'MB Bank', 'Đã kết hôn'),
('E027', 'BH027', 'Việt Nam', 'Gia Lai', '778899001122', 'Gia Lai', 'Thạc sĩ', 'Thạc sĩ', 'Luật kinh tế', '8 năm tư vấn pháp lý doanh nghiệp', 'TAX027', '778899007', 'SHB', 'Độc thân'),
('E028', 'BH028', 'Việt Nam', 'Kiên Giang', '889900112233', 'Kiên Giang', 'Đại học', 'Cử nhân', 'Quản trị nhân sự', '4 năm quản lý nhân sự', 'TAX028', '889900118', 'Sacombank', 'Đã kết hôn'),
('E029', 'BH029', 'Việt Nam', 'Lâm Đồng', '990011223344', 'Lâm Đồng', 'Cao đẳng', 'Kỹ sư', 'Điện tử viễn thông', '3 năm kỹ thuật viên', 'TAX029', '990011229', 'TPBank', 'Độc thân'),
('E030', 'BH030', 'Việt Nam', 'Bình Phước', '001122334455', 'Bình Phước', 'Đại học', 'Cử nhân', 'Quản trị kinh doanh', '6 năm kinh nghiệm điều hành', 'TAX030', '001122330', 'Eximbank', 'Đã kết hôn'),
('E031', 'BH001', 'Việt Nam', 'Hà Nội', '123456789012', 'Hà Nội', 'Đại học', 'Cử nhân', 'CNTT', '5 năm kinh nghiệm lập trình', 'TAX001', '123456789', 'Vietcombank', 'Độc thân'),
('E032', 'BH002', 'Việt Nam', 'Hồ Chí Minh', '234567890123', 'Hồ Chí Minh', 'Cao đẳng', 'Kỹ sư', 'Kinh tế', '3 năm kinh nghiệm kế toán', 'TAX002', '987654321', 'Techcombank', 'Đã kết hôn'),
('E033', 'BH003', 'Việt Nam', 'Đà Nẵng', '345678901234', 'Đà Nẵng', 'Thạc sĩ', 'Thạc sĩ', 'Luật', '7 năm kinh nghiệm luật sư', 'TAX003', '112233445', 'BIDV', 'Độc thân');

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

--
-- Dumping data for table `resignations`
--

INSERT INTO `resignations` (`ID_Resignation`, `EmployeeID`, `Reason`, `ResignationsDate`) VALUES
(1, 'E005', 'Chuyển công tác', '2024-03-01'),
(2, 'E030', 'Lý do cá nhân', '2024-03-05'),
(3, 'E034', 'Không hài lòng với công việc', '2024-03-10'),
(4, 'E025', 'Về hưu', '2024-03-15');

-- --------------------------------------------------------

--
-- Table structure for table `usernotifications`
--

CREATE TABLE `usernotifications` (
  `UserNotificationID` int(11) NOT NULL,
  `EmployeeID` varchar(10) DEFAULT NULL,
  `NotificationID` int(11) DEFAULT NULL,
  `IsDeleted` tinyint(4) DEFAULT 0,
  `IsRead` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usernotifications`
--

INSERT INTO `usernotifications` (`UserNotificationID`, `EmployeeID`, `NotificationID`, `IsDeleted`, `IsRead`) VALUES
(75, 'E003', 15, 0, 1),
(76, 'E003', 12, 0, 1),
(77, 'E003', 17, 0, 1),
(81, 'E003', 14, 0, 1),
(82, 'E003', 20, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `WorkEmail` varchar(255) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `WorkEmail`, `UserName`, `Password`, `Role`) VALUES
(1, 'alice.williams@example.com', 'AliceW', '$argon2id$v=19$m=65536,t=3,p=4$aGVh...bGxl', 'Admin'),
(2, 'charlie.brown@example.com', 'CharlieB', '$argon2id$v=19$m=65536,t=3,p=4$aG91...YW0=', 'User'),
(3, 'david.miller@example.com', 'DavidM', '$argon2id$v=19$m=65536,t=3,p=4$ZmFz...bGFz', 'Guest'),
(4, 'emma.jones@example.com', 'EmmaJ', '$argon2id$v=19$m=65536,t=3,p=4$bWFy...Y29y', 'User'),
(5, 'frank.thomas@example.com', 'FrankT', '$argon2id$v=19$m=65536,t=3,p=4$cGFz...U0MT', 'Manager'),
(8, 'haxom2003@gmail.com', 'Thu Hà', '$argon2id$v=19$m=65536,t=3,p=4$46QRLkTnRBDFhKYTM9fyZQ$S2PvCi+VjhrFjo+pKhiWH1IFwirYOBdA3CcPx443Tp0', 'User'),
(9, 'ian.taylor@example.com', 'IanT', '$argon2id$v=19$m=65536,t=3,p=4$ZGJw...dG9y', 'Guest'),
(14, 'laura.martin@example.com', 'LauraM', '$argon2id$v=19$m=65536,t=3,p=4$U2Fm...Y2Fz', 'Admin'),
(17, 'ptqnga.dhti15a10hn@sv.uneti.edu.vn', 'Quỳnh Nga', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'Admin'),
(18, 'tvtu.dhti15a18hn@sv.uneti.edu.vn', 'Văn Tú', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'User'),
(19, 'vhanh.dhkt15a13hn@sv.uneti.edu.vn', 'Hoàng Anh', '$argon2id$v=19$m=65536,t=3,p=4$nr6+qTgrA0AZGewLRGN6Mg$EKMkfZ7n8hLp2QrCsHyZFvOwcbVSdwkBKHoT2fOJGUI', 'User');

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
  ADD KEY `DepartmentID` (`DepartmentID`);

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`NotificationID`);

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
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `resignations`
--
ALTER TABLE `resignations`
  ADD PRIMARY KEY (`ID_Resignation`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `usernotifications`
--
ALTER TABLE `usernotifications`
  ADD PRIMARY KEY (`UserNotificationID`),
  ADD KEY `NotificationID` (`NotificationID`),
  ADD KEY `EmployeeID` (`EmployeeID`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `unique_workemail` (`WorkEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `ID_Attendance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `familymembers`
--
ALTER TABLE `familymembers`
  MODIFY `FamilyMemberID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `monthlysalaries`
--
ALTER TABLE `monthlysalaries`
  MODIFY `ID_Salary` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `overtimes`
--
ALTER TABLE `overtimes`
  MODIFY `ID_OT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `resignations`
--
ALTER TABLE `resignations`
  MODIFY `ID_Resignation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usernotifications`
--
ALTER TABLE `usernotifications`
  MODIFY `UserNotificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

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
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE CASCADE;

--
-- Constraints for table `employeescontracts`
--
ALTER TABLE `employeescontracts`
  ADD CONSTRAINT `employeescontracts_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE,
  ADD CONSTRAINT `employeescontracts_ibfk_3` FOREIGN KEY (`ID_Contract`) REFERENCES `laborcontracts` (`ID_Contract`) ON DELETE CASCADE;

--
-- Constraints for table `familymembers`
--
ALTER TABLE `familymembers`
  ADD CONSTRAINT `familymembers_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobprofiles`
--
ALTER TABLE `jobprofiles`
  ADD CONSTRAINT `jobprofiles_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `resignations`
--
ALTER TABLE `resignations`
  ADD CONSTRAINT `resignations_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE;

--
-- Constraints for table `usernotifications`
--
ALTER TABLE `usernotifications`
  ADD CONSTRAINT `usernotifications_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usernotifications_ibfk_2` FOREIGN KEY (`NotificationID`) REFERENCES `notifications` (`NotificationID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
