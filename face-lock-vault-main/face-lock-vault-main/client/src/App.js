import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Vault from './components/Vault/Vault'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LoginForm from './components/LoginForm/LoginForm'
import RegisterForm from './components/RegisterForm/RegisterForm'
import PrivateRoute from './config/privateRoute'
import './App.css'

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <div className="app__container">
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Vault />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    )
}

export default App
