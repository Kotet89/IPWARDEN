// Firebase Configuration
// =====================================================
// PENTING: Gantikan dengan Firebase config anda sendiri!
// =====================================================
// 
// Untuk mendapatkan config:
// 1. Pergi ke https://console.firebase.google.com/
// 2. Buat project baru
// 3. Setup Firestore Database  
// 4. Tambah Web App dan copy config di bawah
//
// Lihat fail SETUP_FIREBASE.md untuk panduan lengkap
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyDEMO_KEY_REPLACE_WITH_YOUR_OWN",
    authDomain: "ip-warden-demo.firebaseapp.com",
    projectId: "ip-warden-demo",
    storageBucket: "ip-warden-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    alert('RALAT: Firebase tidak dapat disambung.\n\nSila setup Firebase mengikut arahan dalam SETUP_FIREBASE.md');
}

// Initialize Firestore
const db = firebase.firestore();

// Firestore collections
const usersCollection = db.collection('users');
const siasatanCollection = db.collection('siasatanRecords');

console.log('Firestore collections ready: users, siasatanRecords');
