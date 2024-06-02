import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CircularProgress, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const StockChart = ({ symbol }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
                const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-04-01/2023-04-30?apiKey=${apiKey}`);
                const data = await response.json();

                if (data.results) {
                    const chartLabels = data.results.map((entry) => new Date(entry.t).toLocaleDateString());
                    const chartPrices = data.results.map((entry) => entry.c);

                    setChartData({
                        labels: chartLabels,
                        datasets: [
                            {
                                label: 'Price',
                                data: chartPrices,
                                fill: false,
                                borderColor: 'rgba(75,192,192,1)',
                                tension: 0.1,
                            },
                        ],
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                setLoading(false);
            }
        };

        // Introduce a delay to handle rate limiting
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const fetchWithDelay = async () => {
            setLoading(true);
            await delay(1000); // Delay of 1 second
            await fetchChartData();
        };

        fetchWithDelay();
    }, [symbol]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!chartData) {
        return <Typography variant="h6">No chart data available</Typography>;
    }

    return (
        <Paper elevation={3} style={{ padding: '20px' }}>
            <Line data={chartData} />
        </Paper>
    );
};

export default StockChart;
