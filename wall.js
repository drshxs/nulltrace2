import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async function () {
    const pastesContainer = document.getElementById('pastes-container');
    const querySnapshot = await getDocs(collection(db, "pastes"));

    querySnapshot.forEach((doc) => {
        const pasteData = doc.data();
        const pasteElement = document.createElement('div');
        pasteElement.classList.add('paste-bar');
        
        const pasteLink = document.createElement('a');
        pasteLink.href = `http://127.0.0.1:5500/public/pastes/paste.html?title=${encodeURIComponent(pasteData.title)}`;
        pasteLink.textContent = pasteData.title;

        const pasteDate = new Date(pasteData.timestamp.seconds * 1000).toLocaleString();

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('paste-title');
        titleSpan.appendChild(pasteLink);

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('paste-name');
        nameSpan.textContent = pasteData.name;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('paste-date');
        dateSpan.textContent = pasteDate;

        pasteElement.appendChild(titleSpan);
        pasteElement.appendChild(nameSpan);
        pasteElement.appendChild(dateSpan);

        pastesContainer.appendChild(pasteElement);
    });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "http://127.0.0.1:5500/public/auth/register.html";
    }
});
