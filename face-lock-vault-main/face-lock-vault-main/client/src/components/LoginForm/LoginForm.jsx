import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'

import { db } from '../../config/firebase'
import { loginUser } from '../../store/actions'
import './LoginForm.css'

const LoginForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const videoRef = useRef()
    const canvasRef = useRef()
    const [email, setEmail] = useState('')

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream
            })
            .catch((err) => {
                console.error('Error: ', err)
            })
    }, [])

    const capture = () => {
        const video = videoRef.current
        const canvas = canvasRef.current

        // scale the canvas accordingly
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // draw the video at that frame
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

        // convert it to a blob file to upload
        canvas.toBlob(function (blob) {}, 'image/jpeg', 1)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        await capture()

        const q = query(collection(db, 'users'), where('email', '==', email))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.size === 0) {
            alert("Error: User doesn't exists! Sign up first.")
            return
        }

        querySnapshot.forEach((doc) => {
            setTimeout(() => {
                dispatch(loginUser(doc.data()))
                navigate('/')
            }, 5000)
        })
    }

    return (
        <div className="loginForm">
            <div className="loginForm__wrapper">
                <form>
                    <h1>Login to Your Vault</h1>
                    <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="loginForm__helperText">
                        Before clicking Login, make sure you are looking at the camera.
                    </p>
                    <button type="submit" onClick={handleLogin}>
                        Login
                    </button>
                </form>
                <div className="loginForm__videoWrapper">
                    <video ref={videoRef} autoPlay />
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    )
}

export default LoginForm
