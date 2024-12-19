import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

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
    const urlParams = new URLSearchParams(window.location.search);
    const pasteTitle = urlParams.get('title'); // Assuming title is passed as a URL parameter
    fetchPasteDetails(pasteTitle);
});

async function fetchPasteDetails(pasteTitle) {
    try {
        const pasteRef = collection(db, "pastes");
        const querySnapshot = await getDocs(pasteRef);

        querySnapshot.forEach(doc => {
            if (doc.data().title === pasteTitle) {
                const data = doc.data();
                document.getElementById('paste-title').innerText = data.title;
                document.getElementById('paste-name').innerText = data.name;
                document.getElementById('paste-age').innerText = data.age;
                document.getElementById('paste-location').innerText = data.location;
                document.getElementById('paste-misconception').innerText = data.misconception;

                if (data.faceUrl) {
                    const imageElement = document.createElement('img');
                    imageElement.src = data.faceUrl;
                    imageElement.alt = 'User Face';
                    imageElement.style.maxWidth = '100px';
                    document.getElementById('paste-image-container').appendChild(imageElement);
                }

                document.getElementById('paste-date').innerText = new Date(data.timestamp.seconds * 1000).toLocaleString();
            }
        });
    } catch (error) {
        console.error("Error fetching paste details:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "http://127.0.0.1:5500/public/auth/register.html";
    }
});
