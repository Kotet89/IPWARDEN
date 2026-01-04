# IP WARDEN - Sistem Pengurusan Kertas Siasatan

Sistem pengurusan kertas siasatan digital dengan database yang boleh diakses merentas semua peranti.

## ✨ Ciri-ciri Utama

- 🔐 **Sistem Login & Pendaftaran** - Setiap pengguna ada akaun sendiri
- 🍪 **Cookies & Session Management** - Auto-login dengan "Ingat Saya" feature
- 📊 **Database Berpusat** - Data disimpan dalam server dan boleh diakses dari mana-mana peranti
- 🔄 **Sync Automatik** - Data yang sama boleh diakses dari laptop, phone, tablet, dll
- 💾 **Persistent Storage** - Data kekal sehingga 30 hari dengan cookies
- 📱 **QR Code Scanner** - Scan QR untuk search kertas siasatan
- 📋 **Tracking Pergerakan** - Record semua pergerakan kertas siasatan
- 🌐 **Multi-Device Support** - Login di mana-mana peranti dengan No. Badan yang sama
- 🔒 **Secure Sessions** - HttpOnly cookies dan server-side sessions

## 📋 Keperluan Sistem

- Node.js (versi 14 atau lebih baru)
- NPM (Node Package Manager)
- Browser moden (Chrome, Firefox, Edge, Safari)

## 🚀 Cara Install

### 1. Install Dependencies

Buka PowerShell atau Command Prompt, navigate ke folder projek dan run:

```bash
npm install
```

### 2. Start Server

```bash
npm start
```

Server akan running di: **http://localhost:3000**

### 3. Buka Browser

Buka browser dan pergi ke: **http://localhost:3000**

## 📱 Cara Guna Di Multiple Devices

### Guna di Laptop (Komputer Utama)

1. Start server di laptop dengan `npm start`
2. Buka browser: `http://localhost:3000`
3. Daftar akaun baru atau log masuk

### Guna di Phone/Tablet (Dalam Network Yang Sama)

1. Pastikan server masih running di laptop
2. Cari IP address laptop anda:
   ```bash
   ipconfig
   ```
   Cari "IPv4 Address" (contoh: 192.168.1.100)

3. Di phone/tablet, buka browser dan pergi ke:
   ```
   http://192.168.1.100:3000
   ```

4. Log masuk dengan No. Badan yang sama seperti di laptop
5. Semua data akan sama!

### Guna di Device Lain Di Lokasi Berbeza (Remote Access)

Untuk akses dari luar network, anda perlu:
1. Setup port forwarding di router
2. Atau guna hosting service seperti Heroku, Railway, atau VPS

## 🗄️ Database

Sistem ini menggunakan SQLite database yang disimpan dalam fail `ipwarden.db`.

### 3 Table Utama:

1. **users** - Maklumat pengguna
   - namaPegawai, noBadan, bahagian

2. **kertas_siasatan** - Rekod kertas siasatan
   - pegawaiPenyiasat, noKertasSiasatan, noReport, seksyen

3. **pergerakan** - Tracking pergerakan
   - pergerakan, io, sio, ipk, tpr, mahkamah, kusFile, lainLain

## 🔧 API Endpoints

### User Management
- `POST /api/register` - Daftar pengguna baru
- `POST /api/login` - Log masuk (dengan rememberMe option)
- `GET /api/check-session` - Check session / auto-login
- `POST /api/logout` - Log keluar (clear session & cookies)
- `GET /api/users` - Dapatkan senarai pengguna

### Kertas Siasatan
- `POST /api/kertas-siasatan` - Cipta rekod baru
- `GET /api/kertas-siasatan/:noBadan` - Dapatkan rekod by user
- `GET /api/search/:noKertasSiasatan` - Cari kertas siasatan

### Pergerakan
- `POST /api/pergerakan` - Tambah pergerakan
- `GET /api/pergerakan/:noKertasSiasatan` - Dapatkan pergerakan
- `DELETE /api/pergerakan/:id` - Padam pergerakan

## 📊 Struktur Fail

```
IP WARDEN/
│
├── server.js           # Backend server (Node.js + Express)
├── api.js             # API helper functions untuk frontend
├── script.js          # Frontend JavaScript logic
├── cookie-helper.js   # Cookie & Storage helper utilities
├── index.html         # Main HTML file
├── style.css          # CSS styling
├── package.json       # Dependencies & scripts
├── ipwarden.db        # SQLite database (dicipta automatik)
├── README.md          # Documentation ini
├── SETUP-GUIDE.md     # Panduan setup lengkap
└── COOKIES-GUIDE.md   # Panduan cookies & sessions
```

## 🔐 Keselamatan

- Setiap pengguna perlu No. Badan yang unik untuk register
- Data disimpan secara persistent dalam database
- **HttpOnly Cookies** - Secure dari XSS attacks
- **Server-side Sessions** - Express session management
- **Auto Expiry** - Cookies dan sessions expire automatik
- **Secure Logout** - Clear all sessions and cookies
- CORS enabled dengan credentials support

## 🍪 Cookies & Sessions

Sistem menggunakan 3-tier storage:
1. **HTTP Cookies** (server-side, secure)
2. **Express Sessions** (server memory)
3. **LocalStorage** (client-side backup)

**Features:**
- ✅ Auto-login dengan "Ingat Saya"
- ✅ Session persistence (7-30 hari)
- ✅ Secure httpOnly cookies
- ✅ Auto-cleanup expired data

Lihat **COOKIES-GUIDE.md** untuk maklumat lengkap.

## 🐛 Troubleshooting

### Server tidak start?
- Pastikan Node.js sudah install: `node --version`
- Install dependencies: `npm install`
- Check port 3000 tidak digunakan oleh aplikasi lain

### Tak boleh akses dari phone?
- Pastikan phone dan laptop dalam network WiFi yang sama
- Check firewall tidak block port 3000
- Guna IP address yang betul (bukan localhost)

### Data tidak sync?
- Pastikan server masih running
- Check console browser untuk error
- Reload page dan cuba lagi

## 🎯 Cara Login Dari Device Berbeza

**Contoh Scenario:**
1. **Di Laptop**: Daftar dengan No. Badan "123456"
2. **Di Laptop**: Masukkan data kertas siasatan
3. **Di Phone**: Buka `http://[IP_LAPTOP]:3000`
4. **Di Phone**: Log masuk dengan No. Badan "123456"
5. **Result**: Semua data yang dimasukkan di laptop akan muncul di phone! ✅

## 📞 Support

Untuk sebarang pertanyaan atau masalah, sila hubungi admin sistem.

## 📝 Version

**Version 1.0.0** - Database-enabled multi-device system

---

**IBU PEJABAT POLIS DAERAH YAN, KEDAH**
