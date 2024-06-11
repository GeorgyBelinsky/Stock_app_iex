import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, CircularProgress, TextField, AppBar, Toolbar, Button, Modal, Box, Tabs, Tab } from '@mui/material';
import StockList from './components/StockList/StockList';
import StockDetails from './components/StockDetails/StockDetails';
import StockChart from './components/StockChart/StockChart';
import StockNews from './components/StockNews/StockNews';
import './index.css';

const App = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
                const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
                const symbolsData = await response.json();

                if (symbolsData.length === 0) {
                    throw new Error('No data returned from the Finnhub endpoint');
                }

                const symbols = symbolsData.slice(0, 20); // Fetch most active stocks

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

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
        console.log(localStorage.getItem('users'));
    }, []);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChangePassword = () => {
        const newPassword = prompt('Enter new password');
        if (!validatePassword(newPassword)) {
            alert('Password must be at least 8 characters long and include at least one uppercase letter');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map((u) => (u.email === user.email ? { ...u, password: newPassword } : u));
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const updatedUser = { ...user, password: newPassword };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Password changed successfully');
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth={false}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" style={{ flexGrow: 1 }}>
                        Stock Market App
                    </Typography>
                    {user ? (
                        <>
                            <Typography variant="body1" style={{ marginRight: '20px' }}>
                                {user.email}
                            </Typography>
                            <Button color="inherit" onClick={handleChangePassword}>
                                Change Password
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleModalOpen}>
                            Login/Register
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Paper elevation={3} style={{ padding: '0px 20px 20px 20px', height: '90vh', marginTop: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <TextField
                            label="Search Stocks"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '10px' }}
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
            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        backgroundColor: 'white',
                        padding: '20px',
                        boxShadow: 24,
                    }}
                >
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                    {tabValue === 0 && <LoginForm setUser={setUser} handleModalClose={handleModalClose} />}
                    {tabValue === 1 && <RegisterForm setUser={setUser} handleModalClose={handleModalClose} />}
                </Box>
            </Modal>
        </Container>
    );
};

const LoginForm = ({ setUser, handleModalClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find((u) => u.email === email && u.password === password);
        if (foundUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            setUser(foundUser);
            handleModalClose();
        } else {
            alert('Invalid login credentials');
        }
    };

    return (
        <Box>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                style={{ marginTop: '10px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                style={{ marginTop: '10px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '10px' }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </Box>
    );
};

const RegisterForm = ({ setUser, handleModalClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = () => {
        if (!validateEmail(email)) {
            alert('Invalid email format');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and include at least one uppercase letter');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = { email, password };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        setUser(newUser);
        alert('Registration successful');
        handleModalClose();
    };

    return (
        <Box>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                style={{ marginTop: '10px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                style={{ marginTop: '10px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                style={{ marginTop: '10px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '10px' }}
                onClick={handleRegister}
            >
                Register
            </Button>
        </Box>
    );
};

export default App;
