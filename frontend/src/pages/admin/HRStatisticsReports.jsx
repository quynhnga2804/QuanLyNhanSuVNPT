import { Table, Button, Flex, Space, Typography, Image, Select, message, Dropdown, Menu, Checkbox, DatePicker } from 'antd';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import Search from 'antd/es/transfer/search';
import { ExportOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { UserContext } from '../../api/UserContext';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../../fonts/Times New Romand Regular';

const HRStatisticsReports = ({ resignations, employees, departments, jobprofiles, personalprofiles }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [viewMode, setViewMode] = useState('employees');
    const [searchQuery, setSearchQuery] = useState('');
    const [newEmployees, setNewEmployees] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [tableFilters, setTableFilters] = useState({});

    const { user } = useContext(UserContext);
    const role = user?.role.toLowerCase();
    const name = user?.name;
    const workEmail = user?.email;

    const exportToExcel = async (data, fileName = 'DanhSachNhanVien') => {
        if (!data || data.length === 0) {
            console.error('Dữ liệu trống!');
            return;
        }

        const selectedData = data.filter(item => selectedRowKeys.includes(item.EmployeeID)).map(item => ({
            ...item,
            DepartmentID: departments.find(dept => dept.DepartmentID === item.DepartmentID)?.DepartmentName || ''
        }));

        if (selectedData.length === 0) {
            alert('Vui lòng chọn ít nhất một dòng để in!');
            return;
        }

        try {
            // Mở hộp thoại chọn vị trí lưu file
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `${fileName}.xlsx`,
                types: [{
                    description: 'Excel Files',
                    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
                }],
            });

            // Tạo workbook và worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Danh sách nhân viên');

            // Tiêu đề bảng
            const titleRow = worksheet.addRow(['DANH SÁCH THÔNG TIN NHÂN VIÊN']);
            titleRow.height = 30;
            titleRow.font = { bold: true, size: 16 };
            titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.mergeCells(1, 1, 1, selectedColumns.length);

            // Chỉ lấy những cột đã chọn
            const selectedColumnHeaders = columns
                .filter(col => selectedColumns.includes(col.dataIndex) && col.dataIndex !== 'Image')
                .map(col => ({ name: col.title, key: col.dataIndex }));

            // Thêm bảng dữ liệu (table)
            worksheet.addTable({
                name: 'EmployeeTable',
                ref: 'A3',
                headerRow: true,
                totalsRow: false,
                style: { theme: 'TableStyleMedium9', showRowStripes: true },
                columns: selectedColumnHeaders.map(col => ({ name: col.name, filterButton: true })),
                rows: selectedData.map(obj => selectedColumnHeaders.map(col => obj[col.key] || '')),
            });
            worksheet.getRow(3).height = 25;
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
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

            message.success('Xuất file thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu file:', error);
        }
    };

    const exportToPDF = async ({ fileName = 'ThongKeNhanSu' }) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        doc.setFont('Times New Romand Regular', 'normal');
        doc.setFontSize(12);

        doc.setFontSize(13);
        doc.text('TRUNG TÂM\nKINH DOANH VNPT-NGHỆ AN', 46, 15, null, null, 'center');
        doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc', 149, 15, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`Nghệ An, ngày ${dayjs().format('DD')} tháng ${dayjs().format('MM')} năm ${dayjs().format('YYYY')}`, 130, 35);

        doc.setFontSize(17);
        doc.text('BÁO CÁO THỐNG KÊ NHÂN SỰ CUỐI THÁNG', 105, 45, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`Người tạo báo cáo: ${name}`, 14, 55);

        autoTable(doc, {
            startY: 59,
            head: [['Chỉ số', 'Giá trị']],
            body: [
                ['Tổng số nhân viên', data.length],
                ['Nhân viên mới trong tháng', employees.filter(emp => dayjs().diff(dayjs(emp.StartDate), 'day') < 30).length],
                ['Nhân viên nghỉ việc trong tháng', resignations.filter(res => dayjs().diff(dayjs(res.ResignationsDate), 'day') < 30).length],
            ],
            styles: {
                halign: 'center',
                valign: 'middle',
                fontSize: 12,
                font: 'Times New Romand Regular',
            },
            headStyles: {
                fillColor: 'white',
                textColor: 'black',
                fontStyle: 'bold',
                lineWidth: 0.1,
                lineColor: 'black',
            },
            bodyStyles: {
                textColor: 'black',
                halign: 'left',
                cellPadding: [2, 5],
                lineColor: 'black',
            },
            columnStyles: {
                0: { cellWidth: 90 },
                1: { cellWidth: 90, halign: 'center' },
            },
            theme: 'grid',
            margin: { top: 10, left: 14, right: 14 }
        });


        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `${fileName}.pdf`,
                types: [{
                    description: 'PDF Files',
                    accept: { 'application/pdf': ['.pdf'] },
                }],
            });
            const pdfBlob = doc.output('blob');
            const writable = await fileHandle.createWritable();
            await writable.write(pdfBlob);
            await writable.close();

            message.success('Xuất báo cáo thống kê thành công!');
        } catch (error) {
            message.error('Đã xảy ra lỗi khi xuất file PDF!');
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

                Status: resignationEmployeeIDs.has(emp.EmployeeID) ? 'Nghỉ việc' : 'Đang hoạt động',
                Reason: resignation?.Reason ?? '',
                ResignationsDate: resignation?.ResignationsDate ?? '',
            };
        });
    }, [employees, jobprofiles, personalprofiles, resignations, resignedEmployeeIDs]);  // Chỉ cập nhật khi dữ liệu thay đổi

    const handleSearch = debounce((value) => {
        setSearchQuery(value.toLowerCase());
    }, 500);

    useEffect(() => {
        if (role === 'manager') {
            const dpID = mergedEmployees.find(emp => emp.WorkEmail.includes(workEmail))?.DepartmentID;
            const dvID = departments.find(dv => dv.DepartmentID === dpID)?.DivisionID;

            const relatedDepartmentIDs = departments.filter(dv => dv.DivisionID === dvID).map(dv => dv.DepartmentID);
            const filtered = mergedEmployees.filter(emp => relatedDepartmentIDs.includes(emp.DepartmentID));
            setNewEmployees(filtered);
        }
    }, [role, mergedEmployees, departments, workEmail]);

    const dataSource = role === 'manager' ? newEmployees : mergedEmployees;

    // 🔹 Hàm lọc dữ liệu theo viewMode
    const getFilteredData = () => {
        const resignationEmployeeIDs = new Set(resignations.map(res => res.EmployeeID));
        return dataSource.map(emp => {
            let filteredData = {
                EmployeeID: emp.EmployeeID,
                Image: emp.Image,
                FullName: emp.FullName,
                Status: resignationEmployeeIDs.has(emp.EmployeeID) ? 'Nghỉ việc' : 'Đang hoạt động',
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

            if (viewMode === 'employees+jobprofile') {
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

            if (viewMode === 'employees+personalprofile') {
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

            if (viewMode === 'employees+resignation') {
                filteredData = {
                    ...filteredData,
                    Reason: emp.Reason,
                    ResignationsDate: emp.ResignationsDate,
                };
            }

            if (viewMode === 'full') {
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
            (emp.FullName?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.EmployeeID?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.Address?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.PhoneNumber?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.EmergencyContactNumber?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.EmergencyContactName?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.InsurancesNumber?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.ID_Card?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.ID_CardIssuedPlace?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.TaxCode?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.BankAccount?.toLowerCase() || '').includes(searchQuery || '') ||
            (emp.BankName?.toLowerCase() || '').includes(searchQuery || '')
        ) : true;

        const selectedGenders = tableFilters.Gender || [];
        const selectedJobTitles = tableFilters.JobTitle || [];
        const selectedPositions = tableFilters.Position || [];
        const selectedDepartmentIDs = tableFilters.DepartmentID || [];
        const selectedEmploymentStatuses = tableFilters.EmploymentStatus || [];
        const selectedPlaceOfBirths = tableFilters.PlaceOfBirth || [];
        const selectedEducations = tableFilters.Education || [];
        const selectedMajors = tableFilters.Major || [];
        const selectedMaritalStatuses = tableFilters.MaritalStatus || [];
        const selectedDegrees = tableFilters.Degree || [];
        const selectedCardPlaces = tableFilters.ID_CardIssuedPlace || [];
        const selectedResignations = tableFilters.Status || [];

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

    const data = dataSource;
    const uniqueGenders = [...new Set(data.map(emp => emp.Gender).filter(Boolean))];
    const uniqueJobTitles = [...new Set(data.map(emp => emp.JobTitle).filter(Boolean))];
    const uniquePositions = [...new Set(data.map(emp => emp.Position).filter(Boolean))];
    const uniqueDepartmentIDs = [...new Set(data.map(emp => emp.DepartmentID).filter(Boolean))];
    const uniqueEmploymentStatuses = [...new Set(data.map(item => item.EmploymentStatus).filter(Boolean))];
    const uniquePlaceOfBirths = [...new Set(data.map(emp => emp.PlaceOfBirth).filter(Boolean))];
    const uniqueEducations = [...new Set(data.map(emp => emp.Education).filter(Boolean))];
    const uniqueMajors = [...new Set(data.map(emp => emp.Major).filter(Boolean))];
    const uniqueMaritalStatuses = [...new Set(data.map(item => item.MaritalStatus).filter(Boolean))];
    const uniqueDegrees = [...new Set(data.map(emp => emp.Degree).filter(Boolean))];
    const uniqueCardPlaces = [...new Set(data.map(item => item.ID_CardIssuedPlace).filter(Boolean))];
    const uniqueResignations = ['Nghỉ việc', 'Đang hoạt động'];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
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
            dataIndex: 'Status',
            filters: uniqueResignations.map(res => ({ text: res, value: res })),
            filterMode: 'tree',
            filterSearch: true,
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
            viewModes: ['employees', 'full']
        },
        {
            title: 'CHỨC VỤ',
            dataIndex: 'Position',
            minWidth: 110,
            filters: uniquePositions.map(pt => ({ text: pt, value: pt })),
            filterMode: 'tree',
            filterSearch: true,
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
            viewModes: ['personalprofiles', 'full']
        },
        {
            title: 'BẰNG CẤP',
            dataIndex: 'Degree',
            minWidth: 180, align: 'center',
            filters: uniqueDegrees.map(status => ({ text: status, value: status })),
            filterMode: 'tree',
            filterSearch: true,
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
        let baseColumns = columns.filter(col => col.viewModes?.includes('employees'));
        if (mode === 'employees+jobprofile') baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes('jobprofiles'))];
        if (mode === 'employees+personalprofile') baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes('personalprofiles'))];
        if (mode === 'employees+resignation') baseColumns = [...baseColumns, ...columns.filter(col => col.viewModes?.includes('resignations'))];
        if (mode === 'full') baseColumns = columns; // Hiển thị tất cả các cột
        return baseColumns;
    };

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
                    Số lượng: {filteredEmployees.length}
                </Typography.Title>

                <Flex align='center' gap='1rem' style={{ paddingBottom: '10px' }}>
                    <Space>
                        <DatePicker.RangePicker
                            format='DD-MM-YYYY'
                            onChange={(dates) => setDateRange(dates)}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            allowClear

                        />
                    </Space>
                    <Space>
                        <Select value={viewMode} onChange={handleViewModeChange} style={{ width: 250, }}>
                            <Option value='employees'>Hiển thị thông tin nhân viên</Option>
                            <Option value='employees+jobprofile'>Hiển thị thêm thông tin công việc</Option>
                            <Option value='employees+personalprofile'>Hiển thị thêm thông tin cá nhân</Option>
                            <Option value='employees+resignation'>Hiển thị thêm thông tin nghỉ việc</Option>
                            <Option value='full'>Hiển thị đầy đủ</Option>
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

                    <Dropdown menu={{
                        items: [
                            { key: 'tax', label: 'Excel', icon: <FileExcelOutlined />, onClick: () => exportToExcel(filteredEmployees, 'DanhSachNhanVien') },
                            { key: 'ins', label: 'PDF', icon: <FilePdfOutlined />, onClick: () => exportToPDF(filteredEmployees, 'DanhSachNhanVien') },
                        ],
                    }}>
                        <Button style={{ border: 0 }}>
                            <Space>
                                <ExportOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
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