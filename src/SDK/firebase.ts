// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhBn4VHRvvHVh6AHj6yhIZZs2patsBR_o",
  authDomain: "my-note-7650d.firebaseapp.com",
  projectId: "my-note-7650d",
  storageBucket: "my-note-7650d.firebasestorage.app",
  messagingSenderId: "536498134990",
  appId: "1:536498134990:web:7f7a8e32dc83b7503f559f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();
export const githubProvider=new GithubAuthProvider();
export const db=getFirestore(app);