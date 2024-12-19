import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const title = document.getElementById('title').value;
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const location = document.getElementById('location').value;
        const faceUrl = document.getElementById('face-url').value;
        const misconception = document.getElementById('misconception').value;

        console.log(title, name, age, location, faceUrl, misconception);

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to submit data!");
            return;
        }

        try {
            await addDoc(collection(db, "pastes"), {
                title: title,
                name: name,
                age: age,
                location: location,
                faceUrl: faceUrl || null, 
                misconception: misconception,
                userId: user.uid, 
                timestamp: new Date() 
            });
            alert("Data submitted successfully!");
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error submitting data.");
        }
    });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "http://127.0.0.1:5500/public/auth/register.html";
    }
    else {
        //console.log("User is logged in:", user);
    }
});
