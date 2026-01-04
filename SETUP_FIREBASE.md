# SETUP FIREBASE UNTUK IP WARDEN

## Sistem ini sekarang menggunakan Firebase Firestore untuk menyimpan data di cloud. Ini membolehkan data dikongsi merentas semua peranti.

---

## LANGKAH-LANGKAH SETUP:

### 1. Buat Akaun Firebase (PERCUMA)
   - Pergi ke https://firebase.google.com/
   - Klik "Get Started" atau "Go to Console"
   - Log masuk dengan akaun Google anda

### 2. Buat Project Baru
   - Klik "Add Project" atau "Tambah Projek"
   - Masukkan nama projek: `IP WARDEN`
   - Klik "Continue"
   - Disable Google Analytics (optional)
   - Klik "Create Project"

### 3. Setup Firestore Database
   - Dari Firebase Console, klik "Firestore Database" di menu kiri
   - Klik "Create database"
   - Pilih "Start in **test mode**" (untuk development)
   - Pilih lokasi: `asia-southeast1` (Singapore) atau terdekat
   - Klik "Enable"

### 4. Dapatkan Configuration
   - Klik icon gear ⚙️ di sebelah "Project Overview"
   - Klik "Project settings"
   - Scroll ke bawah ke bahagian "Your apps"
   - Klik icon web </> (Web)
   - Daftar app: Nama app `IP WARDEN Web`
   - **JANGAN** tick Firebase Hosting (belum perlu)
   - Klik "Register app"
   - Copy kod configuration yang diberikan

### 5. Update firebase-config.js
   Buka fail `firebase-config.js` dan gantikan bahagian ini:

   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY_HERE",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

   Dengan kod yang anda dapat dari Firebase Console (langkah 4).

### 6. Setup Firestore Rules (PENTING untuk Security)
   - Dari Firebase Console, klik "Firestore Database"
   - Klik tab "Rules"
   - Gantikan rules dengan:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{noBadan} {
         allow read: if true;
         allow write: if request.auth != null || request.resource.data.noBadan == noBadan;
       }
       
       // Siasatan Records collection
       match /siasatanRecords/{recordId} {
         allow read: if true;
         allow write: if true; // Untuk development
         // Untuk production, tukar kepada:
         // allow write: if request.auth != null;
       }
     }
   }
   ```

   - Klik "Publish"

---

## MIGRATION DATA DARI LOCALSTORAGE

Sistem akan **automatik** pindahkan data sedia ada dari localStorage ke Firebase apabila:
- Page dibuka untuk kali pertama selepas setup Firebase
- Ada data dalam localStorage

Semua data pengguna dan kertas siasatan akan dipindahkan dan kemudian localStorage akan dikosongkan.

---

## KELEBIHAN FIREBASE:

✅ **Data Berkongsi**: Akses dari mana-mana peranti (laptop, tablet, phone)
✅ **Real-time Sync**: Perubahan kelihatan serta-merta di semua peranti
✅ **Backup Automatik**: Data selamat di cloud
✅ **Scalable**: Boleh handle ramai pengguna
✅ **Percuma**: Firebase Free tier mencukupi untuk penggunaan biasa

---

## FREE TIER LIMITS (Cukup untuk penggunaan IPD):

- 1GB storage
- 50,000 reads per day
- 20,000 writes per day
- 20,000 deletes per day

---

## TESTING:

Selepas setup, cuba:

1. **Daftar pengguna baru** - Data akan disimpan di Firestore
2. **Log masuk** - Data akan diambil dari Firestore
3. **Buka di peranti lain** - Gunakan sama no. badan, data akan sama
4. **Tambah kertas siasatan** - Nampak di semua peranti

---

## TROUBLESHOOTING:

### Jika ada error "Firebase not defined":
- Pastikan internet connection aktif
- Semak firebase-config.js ada config yang betul

### Jika data tidak sync:
- Semak Firestore Rules
- Semak Browser Console (F12) untuk error messages

### Jika lambat:
- Check internet connection
- Firebase location mungkin jauh (pilih asia-southeast1)

---

## SOKONGAN:

Untuk bantuan setup, hubungi:
- Firebase Documentation: https://firebase.google.com/docs/firestore
- Firebase Console: https://console.firebase.google.com/

---

**NOTA PENTING**: 
- Jangan share firebase-config.js dengan orang lain (ada API keys)
- Untuk production, aktifkan Firebase Authentication
- Backup data secara berkala (export dari Firestore Console)
