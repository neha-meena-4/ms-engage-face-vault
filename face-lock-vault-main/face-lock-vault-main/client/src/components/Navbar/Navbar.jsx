import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logoutUser } from '../../store/actions'
import './Navbar.css'

const Navbar = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)

    const userFirstName = user?.name.split(' ')[0]

    const handleLogout = () => {
        dispatch(logoutUser())
    }

    return (
        <div className="navbar">
            <div className="navbar__container">
                <Link to="/" className="navbar__logo">
                    Secure Vault
                </Link>
                <ul>
                    {user ? (
                        <>
                            <li className="navbar__loggedInUser">Hi, {userFirstName}</li>
                            <li>
                                <button
                                    className="navbar__logoutButton"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Navbar
