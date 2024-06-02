import React from 'react';
import { List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

const StockList = ({ stocks, setSelectedStock, searchTerm }) => {
    const filteredStocks = stocks.filter(stock =>
        stock.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography variant="h6" gutterBottom>
                Most Active Stocks
            </Typography>
            <List style={{ height: '66.8vh', overflowX: 'hidden', overflowY: 'auto' }}>
                {filteredStocks.map((stock) => (
                    <ListItemButton key={stock.symbol} onClick={() => setSelectedStock(stock)}>
                        <ListItemText primary={stock?.description} secondary={stock.symbol}/>
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
};

export default StockList;
