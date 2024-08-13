import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Title,
    Tooltip
} from "chart.js";

import { Grid } from "@mui/material";
import { Pie } from "react-chartjs-2";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const SpendingPieChart = (
    { spends }: { 
        spends: 
        { 
            essential: string; 
            savings: string; 
            leisure: string; 
            healthcare: string; 
            debt: string; 
            transport: string; 
        }; 
    }) => {
        
    const data = {
        "datasets": [{
            "backgroundColor": [
                '#0088FE', 
                '#00C49F', 
                '#FFBB28', 
                '#FF8042', 
                '#FF6666', 
                '#A569BD'
            ],
            "data": [
                parseFloat(spends.essential),
                parseFloat(spends.savings),
                parseFloat(spends.leisure),
                parseFloat(spends.healthcare),
                parseFloat(spends.debt),
                parseFloat(spends.transport),
            ],
        }],
        "labels": [
            'Essential', 
            'Savings', 
            'Leisure', 
            'Healthcare', 
            'Debt', 
            'Transport'
        ],
    };

    return (
        <Grid sx = {{
            "height": "300px",
            "width": "300px",
        }}>

            <Pie 
                data={data}
                options={{
                    "plugins": {
                        "legend": {
                            "position": 'top',
                        },
                        "tooltip": {
                            "callbacks": {
                                "label": (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}%`;
                                }
                            }
                        }
                    },
                    "responsive": true,
                }}
            />
        </Grid>
    );
};

export default SpendingPieChart;
