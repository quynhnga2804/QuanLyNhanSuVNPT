import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

/**
 * Xuất danh sách ra file Excel
 * @param {Array} data - Dữ liệu danh sách cần xuất
 * @param {Array} columns - Cấu hình cột [{ header: 'Tên cột', key: 'tênKey', width: số }]
 * @param {string} fileName - Tên file khi tải về
 */
const exportToExcel = (data, columns, fileName) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách');

    // Định nghĩa cột trong file Excel
    worksheet.columns = columns;

    // Thêm dữ liệu vào bảng
    data.forEach((item, index) => {
        const rowData = { stt: index + 1, ...item };

        // Chuyển đổi ngày tháng nếu có
        columns.forEach(col => {
            if (col.isDate && rowData[col.key]) {
                rowData[col.key] = dayjs(rowData[col.key]).format('DD-MM-YYYY');
            }
        });

        worksheet.addRow(rowData);
    });

    // Xuất file
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${fileName}.xlsx`);
    });
};

export default exportToExcel;
