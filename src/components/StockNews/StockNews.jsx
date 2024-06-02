import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, CircularProgress } from '@mui/material';

const StockNews = ({ symbol }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

                const fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 1); // 1 month back
                const toDate = new Date();
                const from = fromDate.toISOString().split('T')[0]; // YYYY-MM-DD format
                const to = toDate.toISOString().split('T')[0]; // YYYY-MM-DD format

                const response = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`);
                const data = await response.json();

                // Limit the news to the first 10 articles
                const limitedNews = data.slice(0, 15);

                setNews(limitedNews);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };

        // Reset news and set loading to true whenever the symbol changes
        setNews([]);
        setLoading(true);

        fetchNews();
    }, [symbol]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Card>
            <Typography variant="h5" component="div" style={{ padding: '10px' }}>
                News
            </Typography>
            <CardContent style={{ height: '77vh', overflowX: 'hidden', overflowY: 'auto' }}>
                <Divider style={{ margin: '10px 0' }} />
                {news.map((item, index) => (
                    <div key={index}>
                        <Typography variant="subtitle1">{item?.headline}</Typography>
                        <Typography variant="body2">{item?.summary}</Typography>
                        <Typography variant="caption">{item?.source}</Typography>
                        <Divider style={{ margin: '10px 0' }} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default StockNews;
