import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';

const StockDetails = ({ stock }) => {
    const[stockData, setStockData] = useState([]);

    const fetchStockData = async (symbol) => {
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
        const data = await response.json();
        setStockData(data);
    };

    useEffect(()=>{
        fetchStockData(stock?.symbol);
    },[stock])


    return (
        <Card>
            <CardContent style={{padding:'10px'}}>
                <Typography variant="h5" component="div">
                    {stock?.description}
                </Typography>
                <Typography color="textSecondary">
                    {stock?.symbol}
                </Typography>
                <Typography variant="body2">
                    Current Price: ${stockData?.c}
                </Typography>
                <Typography variant="body2">
                    Change: {stockData?.d} ({stockData?.dp}%)
                </Typography>
                <Typography variant="body2">
                    Type: {stock?.type}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="body2">
                    High price of a day: ${stockData?.h}
                </Typography>
                <Typography variant="body2">
                    Low price of a day: ${stockData?.l}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StockDetails;
