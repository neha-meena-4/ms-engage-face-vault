import React, { useState, useRef, useEffect } from 'react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import { db, storage } from '../../config/firebase'
import './RegisterForm.css'

const RegisterForm = () => {
    const videoRef = useRef()
    const canvasRef = useRef()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)

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

    const resetForm = () => {
        setName('')
        setEmail('')
    }

    const captureAndSaveUser = () => {
        const video = videoRef.current
        const canvas = canvasRef.current

        // scale the canvas accordingly
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // draw the video at that frame
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

        // convert it to a blob file to upload
        canvas.toBlob(
            function (blob) {
                const storageRef = ref(storage, `faces/${new Date().getTime()}`)
                const uploadTask = uploadBytesResumable(storageRef, blob)

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const percent = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )

                        // update progress
                        setUploadProgress(percent)
                    },
                    (err) => console.error('Error: ', err),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            async (downloadURL) => {
                                try {
                                    await addDoc(collection(db, 'users'), {
                                        name,
                                        email,
                                        face: downloadURL,
                                    })
                                    resetForm()
                                    alert('You have been registered! Proceed to login.')
                                } catch (e) {
                                    console.error('Error registering user: ', e)
                                }
                            }
                        )
                    }
                )
            },
            'image/jpeg',
            1
        )
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            alert('Enter your name!')
            return
        }
        if (!email.trim()) {
            alert('Enter your email address!')
            return
        }

        const q = query(collection(db, 'users'), where('email', '==', email))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.size > 0) {
            alert('Error: Email address already exists!')
            return
        }

        captureAndSaveUser()
    }

    return (
        <div className="registerForm">
            <div className="registerForm__wrapper">
                <form>
                    <h1>Create Vault Account</h1>
                    <input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="registerForm__helperText">
                        Before clicking Sign up, make sure you are looking at the camera.
                    </p>
                    <button type="submit" onClick={handleRegister}>
                        Sign Up!
                    </button>
                </form>
                <div className="registerForm__videoWrapper">
                    <video ref={videoRef} autoPlay />
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
