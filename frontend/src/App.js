import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Favorites from './pages/Favorites';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar.js';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/home" 
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/favorites" 
                            element={
                                <PrivateRoute>
                                    <Favorites />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;