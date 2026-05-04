import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgzXunOfKxkB5uNmLEbq6Ykyg7TzQXFDo",
  authDomain: "hostelmart-a9bfa.firebaseapp.com",
  projectId: "hostelmart-a9bfa",
  storageBucket: "hostelmart-a9bfa.firebasestorage.app",
  messagingSenderId: "696577370317",
  appId: "1:696577370317:web:6d0f7538e0a2be81966184"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
