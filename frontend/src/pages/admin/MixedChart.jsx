import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const MixedChart = () => {
    const data = {
        labels: [
            "T7-2019", "T8-2019", "T9-2019", "T10-2019", "T11-2019", "T12-2019",
            "T1-2020", "T2-2020", "T3-2020", "T4-2020", "T5-2020", "T6-2020",
            "T7-2020", "T8-2020", "T9-2020", "T10-2020", "T11-2020", "T12-2020",
            "T1-2021", "T2-2021", "T3-2021", "T4-2021", "T5-2021", "T6-2021",
            "T7-2021", "T8-2021", "T9-2021", "T10-2021", "T11-2021", "T12-2021",
        ],
        datasets: [
            {
                type: "bar",
                label: "Chi phí công ty",
                data: [5, 6, 7, 5, 6, 7, 6, 5, 6, 8, 7, 6, 5, 7, 6, 5, 6, 7, 8, 5, 7, 6, 5, 8, 7, 6, 5, 6, 7, 8],
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
                type: "bar",
                label: "Lương theo hợp đồng",
                data: [4, 5, 6, 4, 5, 6, 4, 5, 6, 5, 4, 5, 6, 4, 5, 4, 5, 6, 4, 6, 5, 4, 5, 6, 4, 5, 4, 5, 6, 4],
                backgroundColor: "rgba(255, 206, 86, 0.7)",
            },
            {
                type: "line",
                label: "Doanh thu",
                data: [20, 22, 23, 25, 27, 28, 29, 30, 32, 30, 28, 27, 26, 28, 30, 31, 29, 28, 27, 29, 30, 31, 30, 29, 28, 27, 28, 29, 30, 31],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                // pointStyle: "circle", // Hình tròn
                pointRadius: 3,
                tension: 0.4,
            },
            {
                type: "line",
                label: "Chi phí vận hành",
                data: [10, 12, 11, 12, 10, 11, 12, 11, 12, 11, 10, 11, 10, 11, 12, 11, 12, 10, 11, 12, 10, 11, 10, 12, 11, 12, 10, 11, 12, 10],
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderWidth: 2,
                pointStyle: "rect", // Hình vuông
                pointRadius: 3,
                tension: 0.4,
            },
            {
                type: "line",
                label: "Thực lĩnh",
                data: [15, 16, 15, 17, 16, 18, 17, 16, 17, 18, 16, 15, 17, 16, 17, 18, 16, 15, 17, 16, 15, 17, 16, 18, 17, 16, 17, 18, 16, 15],
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                pointStyle: "rectRot", // Hình thoi (hình vuông xoay)
                pointRadius: 3,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                },
            },
            title: {
                // display: true,
                text: "Bảng lương định kỳ",
            },
            tooltip: {
                enabled: true,
                position: 'nearest',
                intersect: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Chart type="bar" data={data} options={options} />;
};

export default MixedChart;
