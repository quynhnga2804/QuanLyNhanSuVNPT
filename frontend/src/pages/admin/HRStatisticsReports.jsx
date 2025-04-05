import { Table, Button, Flex, Space, Typography, Image, Select, message, Dropdown, Menu, Checkbox, DatePicker} from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import Search from 'antd/es/transfer/search';
import { FilePdfOutlined, FileExcelOutlined, SettingOutlined} from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import ExcelJS from "exceljs";

const { Text } = Typography;

const HRStatisticsReports = ({ employeecontracts, resignations, employees, departments, jobprofiles, personalprofiles }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [viewMode, setViewMode] = useState("employees");
    const [searchQuery, setSearchQuery] = useState('');
    const role = JSON.parse(localStorage.getItem('user')).role;
    const workEmail = JSON.parse(localStorage.getItem('user')).email;
    const [newEmployees, setNewEmployees] = useState([]);
    const [uniqueGenders, setUniqueGenders] = useState([]);
    const [uniqueJobTitles, setUniqueJobTitles] = useState([]);
    const [uniquePositions, setUniquePositions] = useState([]);
    const [uniqueDepartmentIDs, setUniqueDepartmentIDs] = useState([]);
    const [uniqueEmploymentStatuses, setUniqueEmploymentStatuses] = useState([]);
    const [uniquePlaceOfBirths, setUniquePlaceOfBirths] = useState([]);
    const [uniqueEducations, setUniqueEducations] = useState([]);
    const [uniqueMajors, setUniqueMajors] = useState([]);
    const [uniqueMaritalStatuses, setUniqueMaritalStatuses] = useState([]);
    const [uniqueDegrees, setUniqueDegrees] = useState([]);
    const [uniqueCardPlaces, setUniqueCardPlaces] = useState([]);
    const [uniqueResignations, setuniqueResignations] = useState([]);
    const [dateRange, setDateRange] = useState([]);

    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedJobTitles, setSelectedJobTitles] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedDepartmentIDs, setSelectedDepartmentIDs] = useState([]);
    const [selectedEmploymentStatuses, setSelectedEmploymentStatuses] = useState([]);
    const [selectedPlaceOfBirths, setSelectedPlaceOfBirths] = useState([]);
    const [selectedEducations, setSelectedEducations] = useState([]);
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState([]);
    const [selectedDegrees, setSelectedDegrees] = useState([]);
    const [selectedCardPlaces, setSelectedCardPlaces] = useState([]);
    const [selectedResignations, setSelectedResignations] = useState([]);
    
    const exportToExcel = async (data, fileName = "DanhSachNhanVien") => {
        if (!data || data.length === 0) {
            console.error("Dữ liệu trống!");
            return;
        }
        // const selectedData = data.filter(item => selectedRowKeys.includes(item.EmployeeID));
        const selectedData = data.filter(item => selectedRowKeys.includes(item.EmployeeID)).map(item => ({
            ...item,
            DepartmentID: departments.find(dept => dept.DepartmentID === item.DepartmentID)?.DepartmentName || ''
        }));
        
        if (selectedData.length === 0) {
            alert("Vui lòng chọn ít nhất một dòng để in!");
            return;
        }
    
        try {
            // Mở hộp thoại chọn vị trí lưu file
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `${fileName}.xlsx`,
                types: [{
                    description: "Excel Files",
                    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
                }],
            });
    
            // Tạo workbook và worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Danh sách nhân viên");
    
            // Tiêu đề bảng
            const titleRow = worksheet.addRow(["DANH SÁCH NHÂN VIÊN"]);
            titleRow.height = 30;
            titleRow.font = { bold: true, size: 16 };
            titleRow.alignment = { horizontal: "center", vertical: 'middle' };
            // worksheet.mergeCells(1, 1, 1, Object.keys(data[0]).length);
            worksheet.mergeCells(1, 1, 1, selectedColumns.length);

            // Chỉ lấy những cột đã chọn
            const selectedColumnHeaders = columns
                .filter(col => selectedColumns.includes(col.dataIndex))
                .map(col => ({ name: col.title, key: col.dataIndex }));
    
            // Thêm bảng dữ liệu (table)
            worksheet.addTable({
                name: "EmployeeTable",
                ref: "A3",
                headerRow: true,
                totalsRow: false,
                style: { theme: "TableStyleMedium9", showRowStripes: true },
                // columns: Object.keys(selectedData[0]).map(key => ({ name: key, filterButton: true })),
                columns: selectedColumnHeaders.map(col => ({ name: col.name, filterButton: true })),
                // rows: selectedData.map(obj => Object.values(obj)),
                rows: selectedData.map(obj => selectedColumnHeaders.map(col => obj[col.key] || "")), 

            });
            worksheet.getRow(3).height = 25;
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            });
    
            // Auto-fit độ rộng cột
            worksheet.columns.forEach(col => {
                let maxLength = 12;
                col.eachCell({ includeEmpty: true }, cell => {
                    if (cell.value) maxLength = Math.max(maxLength, cell.value.toString().length);
                });
                col.width = maxLength + 5;
            });
    
            // Ghi dữ liệu ra file
            const writable = await fileHandle.createWritable();
            await workbook.xlsx.write(writable);
            await writable.close();
    
            message.success("Xuất file thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu file:", error);
        }
    };  
    const resignedEmployeeIDs = useMemo(() => new Set(resignations.map(res => res.EmployeeID)), [resignations]); 

    const mergedEmployees = useMemo(() => {
        if (!employees || !jobprofiles || !personalprofiles || !resignations) return [];
    
        const resignationEmployeeIDs = new Set(resignations.map(res => res.EmployeeID));

        return employees.map(emp => {
            const jobprofile = jobprofiles.find(jobp => jobp.EmployeeID === emp.EmployeeID);
            const personalprofile = personalprofiles.find(pp => pp.EmployeeID === emp.EmployeeID);
            const resignation = resignations.find(res => res.EmployeeID === emp.EmployeeID);
            return {
                ...emp,
                BaseSalary: jobprofile?.BaseSalary ?? '',
                Allowance: jobprofile?.Allowance ?? '',
                EmploymentStatus: jobprofile?.EmploymentStatus ?? '',
                StandardWorkingHours: jobprofile?.StandardWorkingHours ?? '',
                RemainingLeaveDays: jobprofile?.RemainingLeaveDays ?? '',
                EmergencyContactName: jobprofile?.EmergencyContactName ?? '',
                EmergencyContactNumber: jobprofile?.EmergencyContactNumber ?? '',
    
                InsurancesNumber: personalprofile?.InsurancesNumber ?? '',
                Nationality: personalprofile?.Nationality ?? '',
                PlaceOfBirth: personalprofile?.PlaceOfBirth ?? '',
                ID_Card: personalprofile?.ID_Card ?? '',
                ID_CardIssuedPlace: personalprofile?.ID_CardIssuedPlace ?? '',
                Education: personalprofile?.Education ?? '',
                Degree: personalprofile?.Degree ?? '',
                Major: personalprofile?.Major ?? '',
                WorkExperience: personalprofile?.WorkExperience ?? '',
                TaxCode: personalprofile?.TaxCode ?? '',
                BankAccount: personalprofile?.BankAccount ?? '',
                BankName: personalprofile?.BankName ?? '',
                MaritalStatus: personalprofile?.MaritalStatus ?? '',

                Status: resignationEmployeeIDs.has(emp.EmployeeID) ? "Nghỉ việc" : "Đang hoạt động",
                Reason: resignation?.Reason ?? '',
                ResignationsDate: resignation?.ResignationsDate ?? '',
            };
        });
    }, [employees, jobprofiles, personalprofiles, resignations, resignedEmployeeIDs]);  // Chỉ cập nhật khi dữ liệu thay đổi

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);


    useEffect(() => {
        if (role === 'Manager') {
            const dpID = mergedEmployees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;

            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const filtered = mergedEmployees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            setNewEmployees(filtered);
        }
    }, [role, mergedEmployees, departments, workEmail]);

    const dataSource = role === 'Manager' ? newEmployees : mergedEmployees;

    // 🔹 Hàm lọc dữ liệu theo viewMode
    const getFilteredData = () => {
        const resignationEmployeeIDs = new Set(resignations.map(res => res.EmployeeID));
        return dataSource.map(emp => {
            let filteredData = {
                EmployeeID: emp.EmployeeID,
                Image: emp.Image,
                FullName: emp.FullName,
                Status: resignationEmployeeIDs.has(emp.EmployeeID) ? "Nghỉ việc" : "Đang hoạt động",
                PhoneNumber: emp.PhoneNumber,
                DateOfBirth: emp.DateOfBirth,
                Gender: emp.Gender,
                Address: emp.Address,
                PersonalEmail: emp.PersonalEmail,
                WorkEmail: emp.WorkEmail,
                JobTitle: emp.JobTitle,
                Position: emp.Position,
                StartDate: emp.StartDate,
                DepartmentID: emp.DepartmentID,
            };

            if (viewMode === "employees+jobprofile") {
                filteredData = {
                    ...filteredData,
                    EmploymentStatus: emp.EmploymentStatus,
                    StandardWorkingHours: emp.StandardWorkingHours,
                    RemainingLeaveDays: emp.RemainingLeaveDays,
                    EmergencyContactName: emp.EmergencyContactName,
                    EmergencyContactNumber: emp.EmergencyContactNumber,
                    BaseSalary: emp.BaseSalary,
                    Allowance: emp.Allowance
                };
            }

            if (viewMode === "employees+personalprofile") {
                filteredData = {
                    ...filteredData,
                    InsurancesNumber: emp.InsurancesNumber,
                    Nationality: emp.Nationality,
                    PlaceOfBirth: emp.PlaceOfBirth,
                    ID_Card: emp.ID_Card,
                    ID_CardIssuedPlace: emp.ID_CardIssuedPlace,
                    Education: emp.Education,
                    Degree: emp.Degree,
                    Major: emp.Major,
                    WorkExperience: emp.WorkExperience,
                    TaxCode: emp.TaxCode,
                    BankAccount: emp.BankAccount,
                    BankName: emp.BankName,
                    MaritalStatus: emp.MaritalStatus
                };
            }

            if (viewMode === "employees+resignation") {
                filteredData = {
                    ...filteredData,
                    Reason: emp.Reason,
                    ResignationsDate: emp.ResignationsDate,
                };
            }

            if (viewMode === "full") {
                filteredData = emp; // Hiển thị tất cả dữ liệu
            }

            return filteredData;
        });
    };
    // 🔹 Áp dụng `viewMode` vào dataSource
    const finalDataSource = getFilteredData();
    const filteredEmployees = (finalDataSource || []).filter(emp => {
        if (!emp) return false; // Nếu emp là null hoặc undefined, bỏ qua
    
        const matchesSearch = searchQuery ? (
            (emp.FullName?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.EmployeeID?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.Address?.toLowerCase() || "").includes(searchQuery || "") ||
            // (emp.JobTitle?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.PhoneNumber?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.EmergencyContactNumber?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.EmergencyContactName?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.InsurancesNumber?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.ID_Card?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.ID_CardIssuedPlace?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.TaxCode?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.BankAccount?.toLowerCase() || "").includes(searchQuery || "") ||
            (emp.BankName?.toLowerCase() || "").includes(searchQuery || "")
        ) : true;
        const matchesFilters = (
            (!selectedGenders.length || selectedGenders.includes(emp.Gender)) &&
            (!selectedJobTitles.length || selectedJobTitles.includes(emp.JobTitle)) &&
            (!selectedPositions.length || selectedPositions.includes(emp.Position)) &&
            (!selectedDepartmentIDs.length || selectedDepartmentIDs.includes(emp.DepartmentID)) &&
            (!selectedEmploymentStatuses.length || selectedEmploymentStatuses.includes(emp.EmploymentStatus)) &&
            (!selectedPlaceOfBirths.length || selectedPlaceOfBirths.includes(emp.PlaceOfBirth)) &&
            (!selectedEducations.length || selectedEducations.includes(emp.Education)) &&
            (!selectedMajors.length || selectedMajors.includes(emp.Major)) &&
            (!selectedMaritalStatuses.length || selectedMaritalStatuses.includes(emp.MaritalStatus)) &&
            (!selectedDegrees.length || selectedDegrees.includes(emp.Degree)) &&
            (!selectedCardPlaces.length || selectedCardPlaces.includes(emp.ID_CardIssuedPlace)) &&
            (!selectedResignations.length || selectedResignations.includes(emp.Status))
        );
    
        const matchesDateRange = (dateRange && dateRange.length === 2) ? (
            (emp.StartDate && dayjs(emp.StartDate).isSameOrAfter(dateRange[0].startOf('day')) && 
                             dayjs(emp.StartDate).isSameOrBefore(dateRange[1].endOf('day'))) ||
            (emp.ResignationsDate && dayjs(emp.ResignationsDate).isSameOrAfter(dateRange[0].startOf('day')) && 
                                    dayjs(emp.ResignationsDate).isSameOrBefore(dateRange[1].endOf('day')))
        ) : true;
        

        return matchesSearch && matchesFilters && matchesDateRange;
    });
    

    useEffect(() => {
        // const data = role === 'Manager' ? dataSource : mergedEmployees;
        const data = dataSource;
        setUniqueGenders([...new Set(data.map(emp => emp.Gender).filter(Boolean))]);
        setUniqueJobTitles([...new Set(data.map(emp => emp.JobTitle).filter(Boolean))])
        setUniquePositions([...new Set(data.map(emp => emp.Position).filter(Boolean))]);
        setUniqueDepartmentIDs([...new Set(data.map(emp => emp.DepartmentID).filter(Boolean))]);
        setUniqueEmploymentStatuses([...new Set(data.map(item => item.EmploymentStatus).filter(Boolean))]);
        setUniquePlaceOfBirths([...new Set(data.map(emp => emp.PlaceOfBirth).filter(Boolean))])
        setUniqueEducations([...new Set(data.map(emp => emp.Education).filter(Boolean))]);
        setUniqueMajors([...new Set(data.map(emp => emp.Major).filter(Boolean))]);
        setUniqueMaritalStatuses([...new Set(data.map(item => item.MaritalStatus).filter(Boolean))]);
        setUniqueDegrees([...new Set(data.map(emp => emp.Degree).filter(Boolean))]);
        setUniqueCardPlaces([...new Set(data.map(item => item.ID_CardIssuedPlace).filter(Boolean))]);
        setuniqueResignations(['Nghỉ việc', 'Đang hoạt động'])
    }, [role, dataSource, resignedEmployeeIDs]);

    const [filteredCount, setFilteredCount] = useState(null);
    
    useEffect(() => {
        setFilteredCount(filteredEmployees.length);
    }, [filteredEmployees]);

    // const handleTableChange = (pagination, filters, sorter, extra) => {
    //     setFilteredCount(extra.currentDataSource.length);
    // }; 
    const handleTableChange = (pagination, filters, sorter) => {
        setSelectedGenders(filters.Gender || []);
        setSelectedJobTitles(filters.JobTitle || []);
        setSelectedPositions(filters.Position || []);
        setSelectedDepartmentIDs(filters.DepartmentID || []);
        setSelectedEmploymentStatuses(filters.EmploymentStatus || []);
        setSelectedPlaceOfBirths(filters.PlaceOfBirth || []);
        setSelectedEducations(filters.Education || []);
        setSelectedMajors(filters.Major || []);
        setSelectedMaritalStatuses(filters.MaritalStatus || []);
        setSelectedDegrees(filters.Degree || []);
        setSelectedCardPlaces(filters.ID_CardIssuedPlace || []);
        setSelectedResignations(filters.Status || []);
    };
    
    
    const columns = [
        {
            title: 'MÃ NHÂN VIÊN',
            dataIndex: 'EmployeeID',
            minWidth: 111,
            fixed: 'left',
            viewModes: ['employees', 'full']
        },
        {
            title: 'HÌNH ẢNH',
            dataIndex: 'Image',
            minWidth: 80,
            align: 'center',
            fixed: 'left',
            render: (imageUrl) => {
                const imageSrc = imageUrl ? `http://localhost:5000/uploads/${imageUrl}` : '/default-avatar.png';
                return <Image src={imageSrc} alt='Ảnh' style={{
                    width: 34, height: 34, borderRadius: '50%', border: '1px solid lightgray', objectFit: 'cover', margin: '-2px 0'
                }} />;
            },
            viewModes: ['employees', 'full']
        },
        {
            title: 'HỌ VÀ TÊN',
            fixed: 'left',
            dataIndex: 'FullName',
            viewModes: ['employees', 'full']
        },
        {
            title: 'TRẠNG THÁI NHÂN VIÊN',
            minWidth: 180,
            align: 'center',
            fixed: 'left',
            dataIndex: 'Status',
            filters: uniqueResignations.map(res => ({ text: res, value: res })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedResignations.length === 0 || selectedResignations.includes(record.Status),
            viewModes: ['employees', 'full']
        },
        {
            title: 'ĐIỆN THOẠI',
            dataIndex: 'PhoneNumber',
            minWidth: 92,
            align: 'center',
            viewModes: ['employees', 'full']
        },
        {
            title: 'NGÀY SINH',
            dataIndex: 'DateOfBirth',
            sorter: (a, b) => new Date(a.DateOfBirth) - new Date(b.DateOfBirth),
            minWidth: 108,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
            viewModes: ['employees', 'full']
        },
        {
            title: 'GIỚI TÍNH',
            dataIndex: 'Gender',
            minWidth: 95,
            align: 'left',
            filters: uniqueGenders.map(gd => ({ text: gd, value: gd })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedGenders.length === 0 || selectedGenders.includes(record.Gender),
            viewModes: ['employees', 'full']
        },
        {
            title: 'ĐỊA CHỈ',
            dataIndex: 'Address',
            minWidth: 80,
            viewModes: ['employees', 'full']
        },
        {
            title: 'EMAIL CÁ NHÂN',
            dataIndex: 'PersonalEmail',
            minWidth: 120,
            viewModes: ['employees', 'full']
        },
        {
            title: 'EMAIL CÔNG VIỆC',
            dataIndex: 'WorkEmail',
            minWidth: 120,
            viewModes: ['employees', 'full']
        },
        {
            title: 'CHỨC DANH',
            dataIndex: 'JobTitle',
            minWidth: 110,
            filters: uniqueJobTitles.map(jt => ({ text: jt, value: jt })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedJobTitles.length === 0 || selectedJobTitles.includes(record.JobTitle),
            viewModes: ['employees', 'full']
        },
        {
            title: 'CHỨC VỤ',
            dataIndex: 'Position',
            minWidth: 110,
            filters: uniquePositions.map(pt => ({ text: pt, value: pt })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedPositions.length === 0 || selectedPositions.includes(record.Position),
            viewModes: ['employees', 'full']
        },
        {
            title: 'NGÀY BẮT ĐẦU',
            dataIndex: 'StartDate',
            minWidth: 114,
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
            viewModes: ['employees', 'full']
        },
        {
            title: 'PHÒNG BAN',
            dataIndex: 'DepartmentID',
            minWidth: 95,
            align: 'left',
            render: (id) => {
                const department = departments.find(dept => dept.DepartmentID === id);
                return department ? department.DepartmentName : '';
            },
            filters: departments.filter(dept => uniqueDepartmentIDs.includes(dept.DepartmentID)).map(dept => ({
                text: dept.DepartmentName,
                value: dept.DepartmentID
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedDepartmentIDs.length === 0 || selectedDepartmentIDs.includes(record.DepartmentID),
            viewModes: ['employees', 'full']
        },
        // Các trường từ jobprofiles
        { 
            title: 'TRẠNG THÁI LÀM VIỆC', 
            dataIndex: 'EmploymentStatus', 
            minWidth: 180, align: 'center',
            filters: uniqueEmploymentStatuses.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedEmploymentStatuses.length === 0 || selectedEmploymentStatuses.includes(record.EmploymentStatus),
            viewModes: ['jobprofiles', 'full']
        },
        { 
            title: 'GIỜ LÀM VIỆC CHUẨN', 
            dataIndex: 'StandardWorkingHours', 
            minWidth: 180, 
            align: 'center', 
            sorter: (a, b) => a.StandardWorkingHours - b.StandardWorkingHours,
            viewModes: ['jobprofiles', 'full']
        },
        { 
            title: 'NGÀY NGHỈ CÒN LẠI', 
            dataIndex: 'RemainingLeaveDays', minWidth: 180, 
            align: 'center',
            sorter: (a, b) => a.RemainingLeaveDays - b.RemainingLeaveDays,
            viewModes: ['jobprofiles', 'full']
         },
        { 
            title: 'NGƯỜI LIÊN HỆ KHẨN CẤP', 
            dataIndex: 'EmergencyContactName', 
            minWidth: 200, 
            align: 'center', 
            viewModes: ['jobprofiles', 'full']
        },
        { 
            title: 'SĐT KHẨN CẤP', 
            dataIndex: 'EmergencyContactNumber', 
            minWidth: 150, 
            align: 'center',
            viewModes: ['jobprofiles', 'full']
        },
        {
            title: 'LƯƠNG CƠ BẢN',
            dataIndex: 'BaseSalary',
            minWidth: 150,
            sorter: (a, b) => a.BaseSalary - b.BaseSalary,
            align: 'center',
            render: (value) => value ? new Intl.NumberFormat('vi-VN').format(value) : '0 VND',
            viewModes: ['jobprofiles', 'full']
        },
        {
            title: 'PHỤ CẤP',
            dataIndex: 'Allowance',
            minWidth: 130,
            sorter: (a, b) => a.Allowance - b.Allowance,
            align: 'center',
            render: (value) => value ? new Intl.NumberFormat('vi-VN').format(value) : '0 VND',
            viewModes: ['jobprofiles', 'full']
        },

        // Các trường từ personalprofiles
        { 
            title: 'SỐ BẢO HIỂM', 
            dataIndex: 'InsurancesNumber', 
            minWidth: 130, 
            align: 'center',
            viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'QUỐC TỊCH', 
            dataIndex: 'Nationality', 
            minWidth: 150, 
            align: 'center', 
            viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'NƠI SINH', dataIndex: 'PlaceOfBirth', 
            minWidth: 180, 
            align: 'center',
            filters: uniquePlaceOfBirths.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedPlaceOfBirths.length === 0 || selectedPlaceOfBirths.includes(record.PlaceOfBirth),
            viewModes: ['personalprofiles', 'full']
         },
        { 
            title: 'CMND/CCCD', 
            dataIndex: 'ID_Card', 
            minWidth: 150, 
            align: 'center', 
            viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'NƠI CẤP CMND/CCCD', 
            dataIndex: 'ID_CardIssuedPlace', minWidth: 200, align: 'center',
            filters: uniqueCardPlaces.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedCardPlaces.length === 0 || selectedCardPlaces.includes(record.ID_CardIssuedPlace),
            viewModes: ['personalprofiles', 'full']
         },
        { 
            title: 'TRÌNH ĐỘ HỌC VẤN', 
            dataIndex: 'Education', 
            minWidth: 180, 
            align: 'center',
            filters: uniqueEducations.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedEducations.length === 0 || selectedEducations.includes(record.Education),
            viewModes: ['personalprofiles', 'full']
            // sorter: (a, b) => a.Education.localeCompare(b.Education), align: 'center' 
        },
        {
            title: 'BẰNG CẤP', 
            dataIndex: 'Degree', 
            minWidth: 180, align: 'center',
            filters: uniqueDegrees.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedDegrees.length === 0 || selectedDegrees.includes(record.Degree),
            viewModes: ['personalprofiles', 'full']
         },
        { 
            title: 'CHUYÊN NGÀNH', 
            dataIndex: 'Major', 
            minWidth: 180, 
            align: 'center',
            filters: uniqueMajors.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedMajors.length === 0 || selectedMajors.includes(record.Major),
            viewModes: ['personalprofiles', 'full']
         },
        { 
            title: 'KINH NGHIỆM LÀM VIỆC', 
            dataIndex: 'WorkExperience', 
            minWidth: 250, 
            align: 'center', 
            viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'MÃ SỐ THUẾ', 
            dataIndex: 'TaxCode', 
            minWidth: 150, 
            align: 'center',
            viewModes: ['personalprofiles', 'full']
        },
        {
             title: 'SỐ TÀI KHOẢN NGÂN HÀNG', 
             dataIndex: 'BankAccount', 
             minWidth: 200, 
             align: 'center',
             viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'NGÂN HÀNG', 
            dataIndex: 'BankName', 
            minWidth: 180, 
            align: 'center', 
            viewModes: ['personalprofiles', 'full']
        },
        {
            title: 'TÌNH TRẠNG HÔN NHÂN', 
            dataIndex: 'MaritalStatus', 
            minWidth: 180, align: 'center',
            filters: uniqueMaritalStatuses.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => selectedMaritalStatuses.length === 0 || selectedMaritalStatuses.includes(record.MaritalStatus),
            viewModes: ['personalprofiles', 'full']
        },
        { 
            title: 'LÝ DO NGHỈ VIỆC', 
            dataIndex: 'Reason', 
            minWidth: 180, 
            align: 'center', 
            viewModes: ['resignations', 'full']
        },
        { 
            title: 'NGÀY NGHỈ VIỆC', 
            dataIndex: 'ResignationsDate', 
            minWidth: 130, 
            align: 'center', 
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '',
            viewModes: ['resignations', 'full']
        },
    ];

    const getColumnsByViewMode = (mode) => {
        let baseColumns = columns.filter(col => col.viewModes?.includes("employees"));
    
        if (mode === "employees+jobprofile") {
            baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes("jobprofiles"))];
        }
    
        if (mode === "employees+personalprofile") {
            baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes("personalprofiles"))];
        }

        if (mode === "employees+resignation") {
            baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes("resignations"))];
        }
    
        if (mode === "full") {
            baseColumns = columns; // Hiển thị tất cả các cột
        }
    
        return baseColumns;
    };
    

    // const filteredColumns = columns.filter(col => 
    //     finalDataSource.some(emp => emp[col.dataIndex] !== undefined)
    // );
    const columnOptions = columns.map(col => ({ label: col.title, value: col.dataIndex }));
    const [selectedColumns, setSelectedColumns] = useState(getColumnsByViewMode(viewMode).map(col => col.dataIndex));
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setSelectedColumns(getColumnsByViewMode(mode).map(col => col.dataIndex)); // Cập nhật danh sách cột
    };
    
    const filteredColumns = getColumnsByViewMode(viewMode).filter(col => selectedColumns.includes(col.dataIndex));




    return (
        <>
            <Flex justify='space-between' style={{ padding: '10px 20px 0 20px', backgroundColor: '#fff' }}>
                <Typography.Title level={5} type='secondary' style={{ color: '#2b2b2b', paddingTop: '2px', fontWeight: '100', fontSize: '1rem' }}>
                    {/* Số lượng: {searchQuery ? filteredEmployees.length : (filteredCount !== dataSource.length ? filteredCount : dataSource.length)} */}
                    Số lượng: {filteredEmployees.length}
                </Typography.Title>
                
                <Flex align='center' gap='1rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <DatePicker.RangePicker
                            format="DD-MM-YYYY"
                            onChange={(dates) => setDateRange(dates)}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            allowClear
                            
                        />
                    </Space>
                    <Space>
                        <Select value={viewMode} onChange={handleViewModeChange} style={{ width: 250,}}>
                            <Option value="employees">Hiển thị thông tin nhân viên</Option>
                            <Option value="employees+jobprofile">Hiển thị thêm thông tin công việc</Option>
                            <Option value="employees+personalprofile">Hiển thị thêm thông tin cá nhân</Option>
                            <Option value="employees+resignation">Hiển thị thêm thông tin nghỉ việc</Option>
                            <Option value="full">Hiển thị đầy đủ</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Search
                            placeholder='Search...'
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>
                    {/* 🔹 Menu Dropdown chọn cột */}
                    <Dropdown
                        overlay={
                            <Menu>
                                <Checkbox.Group
                                    options={columnOptions}
                                    value={selectedColumns}
                                    onChange={setSelectedColumns}
                                    style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
                                />
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <Button>Chọn cột</Button>
                    </Dropdown>
                    <Space>
                        <Button 
                            style={{border: 'none', padding: '0px'}}
                            onClick={() => exportToExcel(filteredEmployees, "DanhSachNhanVien")}
                        >
                            <FileExcelOutlined style={{fontSize:'1.5rem', cursor: 'pointer'}}/>
                            EXCEL
                        </Button>
                    </Space>
                </Flex>
            </Flex>

            <Table
                className='table_TQ'
                rowKey='EmployeeID'
                onChange={handleTableChange}
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={filteredColumns}
                dataSource={filteredEmployees.map(emp => ({ ...emp, key: emp.EmployeeID }))}
                onRow={(record) => ({
                    onDoubleClick: () => showModal(record),
                })}
                bordered
                size='medium'
                scroll={{
                    x: 'max-content',
                    y: 51.5 * 9,
                }}
                pagination={false}
            />

        </>
    );
};

export default HRStatisticsReports;