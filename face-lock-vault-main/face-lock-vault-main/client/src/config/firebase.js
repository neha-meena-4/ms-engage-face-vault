import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAScxBlzI9E7rRzt6f17l4xepusvO6gjh8',
    authDomain: 'face-lock-vault-786.firebaseapp.com',
    projectId: 'face-lock-vault-786',
    storageBucket: 'face-lock-vault-786.appspot.com',
    messagingSenderId: '445020984958',
    appId: '1:445020984958:web:72b0d0501d096b35ebaa2f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export { storage, db }
