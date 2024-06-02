import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, CircularProgress, TextField } from '@mui/material';
import StockList from './components/StockList/StockList';
import StockDetails from './components/StockDetails/StockDetails';
import StockChart from './components/StockChart/StockChart';
import StockNews from './components/StockNews/StockNews';
import Box from '@mui/material/Box';
import './index.css';

const App = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
                const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
                const symbolsData = await response.json();

                if (symbolsData.length === 0) {
                    throw new Error('No data returned from the Finnhub endpoint');
                }

                const symbols = symbolsData.slice(0, 15); // Fetch most active stocks

                setStocks(symbols);
                setSelectedStock(symbols[0]);  // Default to the first company in the list
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stocks:', error);
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth={false}>
            <Typography variant="h4" gutterBottom>
                Stock Market App
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', height: '90vh' }}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <TextField
                            label="Search Stocks"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '10px'}}
                        />
                        <StockList stocks={stocks} setSelectedStock={setSelectedStock} searchTerm={searchTerm} />
                    </Grid>
                    <Grid item xs={6}>
                        <Box mb={2}>
                            {selectedStock && <StockChart symbol={selectedStock.symbol} />}
                        </Box>
                        <StockDetails stock={selectedStock} />
                    </Grid>
                    <Grid item xs={3}>
                        {selectedStock && (
                            <>
                                <StockNews symbol={selectedStock.symbol} />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default App;
