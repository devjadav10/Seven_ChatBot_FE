/* eslint-disable sort-keys */
// import {
//     CategoryScale,
//     Chart as ChartJS,
//     Legend,
//     LineElement,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
// } from "chart.js";

// import {
//     CategoryScale,
//     Chart as ChartJS,
//     Legend,
//     LineElement,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
// } from "chart.js";

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";

import { Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import React from "react";

// import { Line } from "react-chartjs-2";
// import React from "react";

// import { Line } from "react-chartjs-2";
// import React from "react";

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
 
// interface InvestmentReturnsChartProps {
//     monthlyInvestment: number;
//     durationInMonths: number;
//     expectedReturnRate: number; // E.g., 0.08 for 8% annual return
// }
 
// const InvestmentReturnsChart: React.FC<InvestmentReturnsChartProps> = ({
//     monthlyInvestment,
//     durationInMonths,
//     expectedReturnRate
// }) => {
 
//     const labels = Array.from({ "length": durationInMonths }, (_, i) => `${i + 1} Month`);
//     const investmentData = Array(durationInMonths).fill(monthlyInvestment);
 
//     const returnsData = investmentData.map((_, index) => {
//         // Calculate cumulative investment return over time using compound interest formula
//         const months = index + 1;
//         const totalInvested = monthlyInvestment * months;
//         const totalReturns = totalInvested * Math.pow((1 + expectedReturnRate / 12), months);
//         return totalReturns;
//     });
 
//     const data = {
//         "datasets": [
//             {
//                 "borderColor": 'rgb(75, 192, 192)',
//                 "data": investmentData,
//                 "fill": false,
//                 "label": 'Investment Amount',
//                 "tension": 0.1
//             },
//             {
//                 "borderColor": 'rgb(255, 99, 132)',
//                 "data": returnsData,
//                 "fill": false,
//                 "label": 'Total Returns',
//                 "tension": 0.1
//             }
//         ],
//         labels,
//     };
 
//     return (
//         <Grid sx = {{
//             "height": "150px",
//             "width": "300px",
//         }}>
//             <Line data={data} />
//         </Grid>);
// };
 
// export default InvestmentReturnsChart;






// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
 
// interface InvestmentReturnsChartProps {
//     monthlyInvestment: number;
//     durationInMonths: number;
//     expectedReturnRate: number; // E.g., 0.08 for 8% annual return
// }
 
// const InvestmentReturnsChart: React.FC<InvestmentReturnsChartProps> = ({
//     monthlyInvestment,
//     durationInMonths,
//     expectedReturnRate
// }) => {
 
//     const labels = Array.from({ "length": durationInMonths }, (_, i) => `${i + 1} Month`);
 
//     let cumulativeInvestment = 0;
//     const investmentData = [];
//     const returnsData = [];
 
//     for (let month = 1; month <= durationInMonths; month++) {
//         cumulativeInvestment += monthlyInvestment;
//         investmentData.push(cumulativeInvestment);
 
//         const totalReturns = cumulativeInvestment * Math.pow(1 + (expectedReturnRate / 12), month);
//         returnsData.push(totalReturns);
//     }
 
//     const data = {
//         labels,
//         "datasets": [
//             {
//                 "label": 'Cumulative Investment',
//                 "data": investmentData,
//                 "fill": false,
//                 "borderColor": 'rgb(75, 192, 192)',
//                 "tension": 0.1
//             },
//             {
//                 "label": 'Total Returns',
//                 "data": returnsData,
//                 "fill": false,
//                 "borderColor": 'rgb(255, 99, 132)',
//                 "tension": 0.1
//             }
//         ]
//     };
 
//     return (
//         <Grid sx = {{
//             "height": "150px",
//             "width": "300px",
//         }}>
//             <Line data={data} />
//         </Grid>
//     );
// };
 
// export default InvestmentReturnsChart;






ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
 
interface InvestmentReturnsChartProps {
    monthlyInvestment: number;
    durationInMonths: number;
    expectedReturnRate: number;
}
 
const InvestmentReturnsChart: React.FC<InvestmentReturnsChartProps> = ({
    monthlyInvestment,
    durationInMonths,
    expectedReturnRate
}) => {
 
    const labels = Array.from({ "length": durationInMonths }, (_, i) => `${i + 1} Month`);
 
    let cumulativeInvestment = 0;
    const investmentData = [];
    const returnsData = [];
 
    for (let month = 1; month <= durationInMonths; month++) {
        cumulativeInvestment += monthlyInvestment;
        investmentData.push(cumulativeInvestment);
 
        const totalReturns = cumulativeInvestment * Math.pow(1 + (expectedReturnRate / 12), month);
        returnsData.push(totalReturns);
    }
 
    const data = {
        labels,
        "datasets": [
            {
                "label": 'Total Investment',
                "data": investmentData,
                "fill": false,
                "borderColor": 'rgb(75, 192, 192)',
                "tension": 0.1
            },
            {
                "label": 'Total Returns',
                "data": returnsData,
                "fill": false,
                "borderColor": 'rgb(255, 99, 132)',
                "tension": 0.1
            }
        ]
    };
 
    const options = {
        "maintainAspectRatio": false, // Disable the default aspect ratio
        "aspectRatio": 1, 
        "scales": {
            "y": {
                "ticks": {
                    "maxTicksLimit": 15, // Increase the number of ticks on the Y-axis for more points
                },
                "beginAtZero": true,
            },
        },
    };
 
    return (
        <Grid sx={{ "height": '300px', "width": '300px' }}>
            <Line data={data} options={options} />
        </Grid>
    );
};
 
export default InvestmentReturnsChart;
