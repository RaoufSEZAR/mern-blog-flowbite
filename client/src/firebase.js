// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
	authDomain: "mern-blog-flowbite.firebaseapp.com",
	projectId: "mern-blog-flowbite",
	storageBucket: "mern-blog-flowbite.appspot.com",
	messagingSenderId: "727185517090",
	appId: import.meta.env.FIREBASE_APP_ID,
	apiKey: import.meta.env.FIREBASE_API_KEY,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
