import React, { useMemo } from 'react';
import { Card, Flex } from 'antd';
import { PieChart, LineChart, CartesianGrid, Line, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const HRAnalysisChart = ({ employees, departments, jobprofiles, personalprofiles, resignations }) => {
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

    const departmentGenderData = useMemo(() => {
        if (!mergedEmployees || !departments) return [];
        const departmentMap = new Map();
        mergedEmployees.forEach(emp => {
            if (emp.Status === 'Nghỉ việc' || !emp.DepartmentID) return; // Bỏ nhân viên nghỉ hoặc không có phòng ban

            const department = departments.find(d => d.DepartmentID === emp.DepartmentID);
            if (!department) return;

            const deptName = department.DepartmentName;
            const genderKey = emp.Gender === 'Nam' ? 'nam' : 'nu';

            if (!departmentMap.has(deptName)) {
                departmentMap.set(deptName, { name: deptName, nam: 0, nu: 0 });
            }

            const deptData = departmentMap.get(deptName);
            deptData[genderKey] += 1;
            departmentMap.set(deptName, deptData);
        });

        return Array.from(departmentMap.values());
    }, [mergedEmployees, departments]);

    const educationData = useMemo(() => {
        if (!mergedEmployees) return [];
        const educationMap = new Map();
        mergedEmployees.forEach(emp => {
            if (emp.Status === 'Nghỉ việc') return; // Loại bỏ nhân viên đã nghỉ

            const edu = emp.Education && emp.Education.trim() !== '' ? emp.Education : 'Khác';

            if (!educationMap.has(edu)) {
                educationMap.set(edu, { name: edu, count: 0 });
            }

            const eduData = educationMap.get(edu);
            eduData.count += 1;
            educationMap.set(edu, eduData);
        });

        return Array.from(educationMap.values());
    }, [mergedEmployees]);

    const ageData = useMemo(() => {
        if (!mergedEmployees) return [];

        const ageGroups = {
            'Tuổi <=25': { name: 'Tuổi <= 25', value: 0, color: '#FF4D79' },
            'Tuổi <=35': { name: 'Tuổi <= 35', value: 0, color: '#4A90E2' },
            'Tuổi <=45': { name: 'Tuổi <= 45', value: 0, color: '#B0C4DE' },
            'Tuổi <=55': { name: 'Tuổi <= 55', value: 0, color: '#28A745' },
        };

        mergedEmployees.forEach(emp => {
            if (emp.Status === 'Nghỉ việc' || !emp.DateOfBirth) return; // Bỏ nhân viên nghỉ & không có DOB

            const birthYear = new Date(emp.DateOfBirth).getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;

            if (age <= 25) ageGroups['Tuổi <=25'].value++;
            else if (age <= 35) ageGroups['Tuổi <=35'].value++;
            else if (age <= 45) ageGroups['Tuổi <=45'].value++;
            else if (age <= 55) ageGroups['Tuổi <=55'].value++;
        });

        return Object.values(ageGroups);
    }, [mergedEmployees]);

    const processHRData = useMemo(() => {
        const now = moment(); // Lấy thời điểm hiện tại
        const last10Months = [];

        // Tạo danh sách 10 tháng gần nhất (định dạng 'M/YYYY')
        for (let i = 9; i >= 0; i--) {
            last10Months.push(now.clone().subtract(i, 'months').format('M/YYYY'));
        }

        // Khởi tạo dữ liệu rỗng
        const chartData = last10Months.map(month => ({
            month,
            moi: 0,
            nghi: 0
        }));

        // Tính số nhân viên mới vào & nghỉ việc trong từng tháng
        mergedEmployees.forEach(emp => {
            if (emp.StartDate) {
                const startMonth = moment(emp.StartDate).format('M/YYYY');
                const monthIndex = last10Months.indexOf(startMonth);
                if (monthIndex !== -1) chartData[monthIndex].moi += 1;
            }

            if (emp.ResignationsDate) {
                const resignMonth = moment(emp.ResignationsDate).format('M/YYYY');
                const monthIndex = last10Months.indexOf(resignMonth);
                if (monthIndex !== -1) chartData[monthIndex].nghi += 1;
            }
        });

        return chartData;
    }, [mergedEmployees]);

    const experienceData = useMemo(() => {
        if (!mergedEmployees) return [];

        const experienceGroups = {
            '<1 năm': { name: '<1 năm', count: 0, color: '#FF4D79' },
            '1-3 năm': { name: '1-3 năm', count: 0, color: '#4A90E2' },
            '3-5 năm': { name: '3-5 năm', count: 0, color: '#B0C4DE' },
            '5-8 năm': { name: '5-8 năm', count: 0, color: '#28A745' },
            '>8 năm': { name: '>8 năm', count: 0, color: '#FFD700' },
        };

        mergedEmployees.forEach(emp => {
            if (!emp.StartDate) return; // Nếu không có ngày bắt đầu làm việc thì bỏ qua

            const startYear = new Date(emp.StartDate).getFullYear();
            const currentYear = new Date().getFullYear();
            const yearsOfExperience = currentYear - startYear;

            if (yearsOfExperience < 1) experienceGroups['<1 năm'].count++;
            else if (yearsOfExperience <= 3) experienceGroups['1-3 năm'].count++;
            else if (yearsOfExperience <= 5) experienceGroups['3-5 năm'].count++;
            else if (yearsOfExperience <= 8) experienceGroups['5-8 năm'].count++;
            else experienceGroups['>8 năm'].count++;
        });

        return Object.values(experienceGroups);
    }, [mergedEmployees]);

    const timelineData = useMemo(() => {
        if (!employees || !departments) return [];

        const currentDate = new Date();
        const months = [];

        for (let i = 9; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const monthStr = date.toISOString().slice(0, 7);
            months.push(monthStr);
        }

        const departmentMap = Object.fromEntries(
            departments.map(dept => [dept.DepartmentID, dept.DepartmentName])
        );

        const data = months.map(month => {
            const departmentCounts = {}; // Reset mỗi tháng để không bị cộng dồn sai

            employees.forEach(emp => {
                let startMonth = emp.StartDate ? new Date(emp.StartDate).toISOString().slice(0, 7) : null;
                const resignation = resignations.find(res => res.EmployeeID === emp.EmployeeID);
                let endMonth = resignation ? new Date(resignation.ResignationsDate).toISOString().slice(0, 7) : null;
                const departmentID = emp.DepartmentID;
                const departmentName = departmentMap[departmentID] || `Phòng ${departmentID}`;

                // Chỉ tính nhân viên nếu họ đã vào làm và chưa nghỉ việc trong tháng này
                if (startMonth && startMonth <= month && (!endMonth || endMonth >= month)) {
                    departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + 1;
                }
            });

            return {
                date: month,
                ...departmentCounts,
                totalEmployees: Object.values(departmentCounts).reduce((sum, val) => sum + val, 0),
            };
        });

        return data;
    }, [employees, departments]);

    console.log('employeeBymonth: ', timelineData);

    return (
        <Flex vertical gap={10} style={{ padding: '10px', height: '550px', overflowY: 'auto' }}>
            <Flex gap={16} style={{ width: '100%' }}>
                <Card style={{ flex: 3, minWidth: '500px' }} title='Số Nhân Viên Theo Phòng Ban & Giới Tính'>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={departmentGenderData}>
                            <XAxis dataKey='name' tick={{ fontSize: 12 }} interval={0} />
                            <YAxis label={{
                                value: 'Số lượng nhân viên', angle: -90, position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#555' }
                            }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='nam' fill='#0088FE' name='Nam' barSize={30} />
                            <Bar dataKey='nu' fill='#FF69B4' name='Nữ' barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card style={{ flex: 2, minWidth: '250px' }} title='Số Nhân Viên Theo Trình Độ Học Vấn'>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={educationData}>
                            <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                            <YAxis label={{
                                value: 'Số lượng nhân viên', angle: -90, position: 'insideLeft',
                                style: { textAnchor: 'middle', fill: '#555' }
                            }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='count' fill='#82ca9d' name='Số lượng' barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Flex>

            <Flex gap={16} width='100%'>
                <Card title='ĐỘ TUỔI' style={{ flex: 1.3, textAlign: 'center' }}>
                    <ResponsiveContainer width='100%' height={300}>
                        <PieChart >
                            <Pie
                                data={ageData}
                                cx='50%'
                                cy='50%'
                                outerRadius={120}
                                startAngle={90}
                                endAngle={-270}
                                labelLine={false}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill='white'
                                            textAnchor='middle'
                                            dominantBaseline='central'
                                            fontSize={12}
                                            fontWeight={100}
                                        >
                                            {percent !== 0 ? `${(percent * 100).toFixed(1)}%` : ''}
                                        </text>
                                    );
                                }}
                            >
                                {ageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} người`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card title='KINH NGHIỆM LÀM VIỆC' style={{ flex: 1.3, textAlign: 'center' }}>
                    <ResponsiveContainer width='100%' height={300}>
                        <PieChart>
                            <Pie
                                data={experienceData}
                                cx='50%'
                                cy='50%'
                                outerRadius={120}
                                startAngle={90}
                                endAngle={-270}
                                labelLine={false}
                                fill='#8884d8'
                                dataKey='count'
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill='white'
                                            textAnchor='middle'
                                            dominantBaseline='central'
                                            fontSize={12}
                                            fontWeight={100}
                                        >
                                            {percent !== 0 ? `${(percent * 100).toFixed(1)}%` : ''}
                                        </text>
                                    );
                                }}
                            >
                                {experienceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} người`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                </Card>

                <Card title='BIẾN ĐỘNG NHÂN SỰ' style={{ flex: 2.4 }}>
                    <ResponsiveContainer width='100%' height={300}>
                        <LineChart data={processHRData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='month' fontSize={12} />
                            <YAxis label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }} allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='moi' stroke='#6A5ACD' strokeWidth={3} name='Mới' dot={{ fill: '#6A5ACD', r: 3 }} />
                            <Line type='monotone' dataKey='nghi' stroke='#FFA500' strokeWidth={3} name='Nghỉ việc' dot={{ fill: '#FFA500', r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Flex>

            <Flex gap={16} width='100%'>
                <Card title='Tổng số nhân viên trong 10 tháng gần nhất' style={{ flex: 2 }} headStyle={{ borderBottom: 'none' }} bodyStyle={{ paddingTop: '0' }}>
                    <ResponsiveContainer width='100%' height={350}>
                        <LineChart data={timelineData} margin={{ top: 30, right: 15, left: 15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis label={{ value: '(Người)', angle: 0, position: 'top', offset: 15 }} allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='totalEmployees' stroke='#8884d8' name='Tổng số nhân viên' />
                            {Object.keys(timelineData[0] || {}).filter(key => key !== 'date' && key !== 'totalEmployees').map((dep, index) => (
                                <Line key={dep} type='monotone' dataKey={dep} stroke={`hsl(${index * 60}, 70%, 50%)`} name={dep} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Flex>
        </Flex >
    );

};

export default HRAnalysisChart;