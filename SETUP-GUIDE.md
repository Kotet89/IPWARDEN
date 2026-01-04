# 🚀 PANDUAN LENGKAP SETUP IP WARDEN

## Langkah 1: Install Node.js

### Windows:
1. Pergi ke: https://nodejs.org/
2. Download versi "LTS" (Recommended for Most Users)
3. Run installer (.msi file)
4. Follow installation wizard (tekan Next semua)
5. Restart komputer selepas install

### Verify Installation:
Buka PowerShell dan type:
```bash
node --version
npm --version
```

Jika keluar version number (contoh: v18.17.0), bermakna berjaya install!

---

## Langkah 2: Install Dependencies

Setelah Node.js installed:

```bash
# Navigate ke folder projek
cd "c:\Users\Legoland\OneDrive\Desktop\IP WARDEN"

# Install packages
npm install
```

Dependencies yang akan di-install:
- express (Web server)
- sqlite3 (Database)
- cors (Cross-origin support)
- body-parser (Request parsing)

---

## Langkah 3: Start Server

```bash
# Di folder projek
npm start
```

Output yang dijangkakan:
```
============================================
   IP WARDEN SERVER BERJALAN
   Port: 3000
   URL: http://localhost:3000
============================================
Database connected successfully
Database tables initialized
```

**PENTING: Jangan tutup terminal ini! Server perlu running untuk system berfungsi.**

---

## Langkah 4: Buka Sistem

### Di Komputer Yang Sama:
1. Buka browser (Chrome/Edge/Firefox)
2. Pergi ke: **http://localhost:3000**

### Di Device Lain (Phone/Tablet) - Same Network:

**A. Cari IP Address Komputer Server:**
Di PowerShell (komputer server):
```bash
ipconfig
```
Cari "IPv4 Address" di bawah WiFi adapter
Contoh: `192.168.1.100`

**B. Buka di Phone/Tablet:**
Dalam browser, pergi ke: **http://192.168.1.100:3000**
(Ganti dengan IP address sebenar)

---

## Langkah 5: Cara Guna

### First Time - Daftar Pengguna:
1. Click "Daftar Sekarang"
2. Isi maklumat:
   - Nama Pegawai
   - No. Badan (mesti unik!)
   - Bahagian
3. Click "Daftar"

### Login:
1. Masukkan No. Badan
2. Click "Log Masuk"
3. Dashboard akan keluar dengan maklumat anda

### Tambah Kertas Siasatan:
1. Isi form "PERGERAKAN KERTAS SIASATAN"
2. Click "Simpan Rekod"
3. Rekod akan tersimpan dalam database

### Track Pergerakan:
1. Click "Lihat/Tambah Pergerakan" pada sesuatu rekod
2. Isi form pergerakan (IO, SIO, IPK, dll)
3. Click "Tambah Pergerakan"
4. Pergerakan akan dipaparkan dalam jadual

### Search dengan QR Code:
1. Click pada QR code atau scan dengan phone
2. Masukkan No. Badan
3. Sistem akan paparkan semua maklumat

---

## 🔄 Sync Merentas Device - Contoh Penggunaan

### Scenario 1: Laptop ke Phone
```
1. [LAPTOP] - Daftar dengan No. Badan: 123456
2. [LAPTOP] - Tambah kertas siasatan KS001
3. [LAPTOP] - Tambah pergerakan untuk KS001
4. [PHONE]  - Pergi ke http://192.168.1.100:3000
5. [PHONE]  - Log masuk dengan No. Badan: 123456
6. [PHONE]  - SEMUA DATA SAMA! ✅
```

### Scenario 2: Update dari Phone
```
1. [PHONE]  - Login dengan No. Badan: 123456
2. [PHONE]  - Tambah pergerakan baru untuk KS001
3. [LAPTOP] - Refresh page
4. [LAPTOP] - Pergerakan baru akan muncul! ✅
```

**Kunci**: Guna No. Badan yang sama di semua device!

---

## 📊 Database File

File database: `ipwarden.db`
- Dicipta automatik bila server start
- Semua data disimpan di sini
- Jangan delete file ini atau data akan hilang!

**Backup**: Copy file `ipwarden.db` untuk backup data.

---

## 🛑 Stop Server

Untuk stop server:
1. Pergi ke terminal yang running server
2. Tekan `Ctrl + C`
3. Type `Y` dan Enter

---

## 🔧 Troubleshooting

### Error: "EADDRINUSE: address already in use"
**Sebab**: Port 3000 sudah digunakan
**Solve**: 
```bash
# Cari process yang guna port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan number dari command atas)
taskkill /PID [PID_NUMBER] /F
```

### Error: "Cannot find module 'express'"
**Sebab**: Dependencies belum install
**Solve**: 
```bash
npm install
```

### Phone tak boleh connect
**Check**:
1. ✅ Server masih running?
2. ✅ Phone & laptop dalam WiFi yang sama?
3. ✅ IP address betul?
4. ✅ Firewall tak block port 3000?

**Test Connection**:
Di phone, cuba ping IP laptop:
```
ping 192.168.1.100
```

---

## 🌐 Untuk Akses Dari Internet (Optional)

Jika nak akses dari lokasi berbeza (bukan same network):

### Option 1: ngrok (Paling Mudah)
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3000
```
Akan dapat URL public seperti: `https://abc123.ngrok.io`

### Option 2: Port Forwarding di Router
1. Login router admin panel
2. Cari "Port Forwarding" settings
3. Forward port 3000 ke IP local laptop
4. Akses guna: `http://[PUBLIC_IP]:3000`

### Option 3: Deploy ke Cloud
- Heroku (Free tier available)
- Railway
- Render
- DigitalOcean

---

## 📱 Tips Penggunaan

### Simpan Shortcut di Phone:
1. Buka `http://[IP]:3000` di phone browser
2. Click "Add to Home Screen" (Chrome)
3. Akan jadi seperti app!

### Auto-start Server (Windows):
Cipta batch file `start-server.bat`:
```batch
@echo off
cd "c:\Users\Legoland\OneDrive\Desktop\IP WARDEN"
start cmd /k npm start
```
Double-click untuk start server dengan 1 click.

---

## 🔐 Security Notes

**PENTING untuk Production:**
1. Tambah password authentication
2. Guna HTTPS (bukan HTTP)
3. Implement proper access control
4. Regular backup database
5. Update dependencies regularly

Current version ni for **internal network use** sahaja!

---

## ✅ Checklist Setup

- [ ] Node.js installed (`node --version` works)
- [ ] Dependencies installed (`npm install` done)
- [ ] Server start successfully (`npm start` works)
- [ ] Boleh access dari laptop (http://localhost:3000)
- [ ] IP address laptop dah tahu
- [ ] Boleh access dari phone (http://[IP]:3000)
- [ ] Dah test register & login
- [ ] Dah test tambah kertas siasatan
- [ ] Dah test sync data dari device lain

---

## 📞 Selesai!

Sistem anda sekarang ada:
✅ Database berpusat
✅ Multi-device access
✅ Data sync automatik
✅ Login system
✅ Tracking pergerakan
✅ QR code search

**Selamat Menggunakan IP WARDEN!** 🎉
