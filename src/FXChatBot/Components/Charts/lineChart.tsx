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
import { INVESTMENT_METHOD } from "../../Constants/Enums/enums";
import { Line } from "react-chartjs-2";
import React from "react";

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
    investmentType: INVESTMENT_METHOD.SIP | INVESTMENT_METHOD.LUMPSUM
}
 
const InvestmentReturnsChart: React.FC<InvestmentReturnsChartProps> = ({
    monthlyInvestment,
    durationInMonths,
    expectedReturnRate,
    investmentType,
}) => {
    console.log("monthlyInvestment",monthlyInvestment,durationInMonths,expectedReturnRate);
    const labels = Array.from({ "length": durationInMonths }, (_, i) => `${i + 1} Month`);
 
    let cumulativeInvestment = 0;
    const investmentData: number[] = [];
    const returnsData: number[] = [];
 
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
