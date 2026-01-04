# 🚀 QUICK START - IP WARDEN dengan Cookies

## Step 1: Install Node.js ⚡

### Windows:
1. Pergi ke: **https://nodejs.org/**
2. Download **"LTS"** version (Recommended)
3. Install (Next → Next → Finish)
4. **RESTART komputer**

---

## Step 2: Install Dependencies 📦

Buka **PowerShell** atau **Command Prompt**:

```powershell
# Navigate ke folder projek
cd "c:\Users\Legoland\OneDrive\Desktop\IP WARDEN"

# Install semua packages
npm install
```

**Packages yang akan di-install:**
- express
- sqlite3
- cors
- body-parser
- **cookie-parser** ← BARU
- **express-session** ← BARU

---

## Step 3: Start Server 🖥️

```powershell
npm start
```

**Output yang dijangkakan:**
```
============================================
   IP WARDEN SERVER BERJALAN
   Port: 3000
   URL: http://localhost:3000
============================================
Database connected successfully
Database tables initialized
```

**PENTING**: Jangan tutup terminal!

---

## Step 4: Test Website 🌐

### A. Di Komputer Yang Sama:

1. Buka browser (Chrome/Edge/Firefox)
2. Pergi ke: **http://localhost:3000**
3. Daftar akaun baru:
   - Nama Pegawai: Ahmad
   - No. Badan: 123456
   - Bahagian: JSJ
4. Click "Daftar"

### B. Login dengan "Ingat Saya":

1. Log masuk dengan No. Badan: 123456
2. **✅ TICK checkbox "Ingat saya (30 hari)"**
3. Click "Log Masuk"
4. Dashboard akan keluar

---

## Step 5: Test Auto-Login 🍪

### Test 1: Tutup & Buka Browser
1. **Tutup browser sepenuhnya**
2. **Buka semula browser**
3. Pergi ke: http://localhost:3000
4. **✅ Sepatutnya auto-login ke dashboard!**

### Test 2: Check Cookies
1. Tekan `F12` (DevTools)
2. Pergi ke **"Application"** tab (Chrome/Edge)
3. Klik **"Cookies"** → **http://localhost:3000**
4. Lihat cookies:
   - `connect.sid` (session)
   - `noBadan` (remember me)
   - `rememberMe` (preference)

### Test 3: Test di Console
```javascript
// Buka Console (F12)
displayCookieInfo();
```

Output:
```
=== Cookie Information ===
All Cookies: {connect.sid: "...", noBadan: "123456", rememberMe: "true"}
Remember Me: true
No Badan: 123456
=========================
```

---

## Step 6: Test Multi-Device 📱

### Di Phone/Tablet (Same WiFi):

1. **Cari IP Address** laptop:
   ```powershell
   ipconfig
   ```
   Cari: `IPv4 Address` (Contoh: 192.168.1.100)

2. **Di phone**, buka browser:
   ```
   http://192.168.1.100:3000
   ```

3. **Login** dengan No. Badan yang sama: 123456

4. **Tick "Ingat saya"**

5. **✅ Semua data sama!**

---

## Step 7: Test Features 🧪

### Test Tambah Kertas Siasatan:
1. Isi form "PERGERAKAN KERTAS SIASATAN"
2. Click "Simpan Rekod"
3. Rekod akan muncul di bawah

### Test Tracking:
1. Click "Lihat/Tambah Pergerakan"
2. Isi form pergerakan
3. Click "Tambah Pergerakan"
4. Pergerakan akan keluar dalam jadual

### Test Logout:
1. Click "Log Keluar"
2. Confirm
3. Akan redirect ke login page
4. **Cookies & session cleared!**

---

## 🎓 Tutorial: Login Flow

### Scenario 1: Login Tanpa "Ingat Saya"
```
Login → Dashboard
Tutup browser → Session cleared
Buka browser → Kena login semula
```

### Scenario 2: Login Dengan "Ingat Saya" ✅
```
Login + Tick "Ingat Saya" → Dashboard
Tutup browser → Cookies saved
Buka browser → Auto-login! ✅
30 hari kemudian → Auto-logout
```

---

## 🔍 Debug Tools

### Check Cookies:
```javascript
// In Console (F12)
CookieHelper.getAllCookies();
CookieHelper.getCookie('noBadan');
CookieHelper.hasCookie('rememberMe');
```

### Check Session:
```javascript
SessionManager.getSession();
SessionManager.isSessionActive();
SessionManager.shouldRemember();
```

### Display All Info:
```javascript
displayCookieInfo();
```

---

## ⚠️ Troubleshooting

### Problem: npm tidak recognized
**Solution**: Install Node.js dan restart komputer

### Problem: Port 3000 already in use
**Solution**: 
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (ganti PID)
taskkill /PID [PID_NUMBER] /F
```

### Problem: Auto-login tidak berfungsi
**Solution**: 
1. Check cookies di DevTools
2. Clear cookies: `CookieHelper.clearAllCookies()`
3. Login semula dengan tick "Ingat Saya"

### Problem: Tak boleh connect dari phone
**Solution**:
1. Pastikan same WiFi
2. Check firewall tidak block port 3000
3. Guna IP yang betul (bukan localhost)

---

## 📚 Next Steps

1. ✅ Baca **SETUP-GUIDE.md** untuk details
2. ✅ Baca **COOKIES-GUIDE.md** untuk cookies info
3. ✅ Test semua features
4. ✅ Backup database (`ipwarden.db`)

---

## 🎯 Expected Results

Selepas complete semua steps, anda sepatutnya ada:

✅ Server running di port 3000
✅ Database dicipta (`ipwarden.db`)
✅ Boleh register & login
✅ Cookies berfungsi
✅ Auto-login works
✅ Multi-device sync works
✅ "Ingat Saya" feature works
✅ Tracking pergerakan works
✅ QR code search works

---

## 🏆 Success Criteria

```
✅ npm install - DONE
✅ npm start - Server running
✅ http://localhost:3000 - Website load
✅ Register user - Success
✅ Login without remember me - Success
✅ Login with remember me - Success
✅ Close & reopen browser - Auto-login ✅
✅ Add kertas siasatan - Success
✅ Track pergerakan - Success
✅ Logout - Success, cookies cleared
✅ Test from phone - Success, same data
```

---

## 💡 Tips

1. **Jangan tutup terminal** bila server running
2. **Guna Chrome/Edge** untuk best experience
3. **Check DevTools** bila ada issue
4. **Backup `ipwarden.db`** regularly
5. **Read COOKIES-GUIDE.md** untuk advanced features

---

## 🆘 Need Help?

Jika ada masalah:
1. Check server masih running
2. Check browser console (F12) untuk errors
3. Check DevTools → Network tab
4. Read error messages carefully
5. Refer to documentation files

---

## ✅ Checklist Untuk Testing

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server start successfully (`npm start`)
- [ ] Website accessible (http://localhost:3000)
- [ ] Register new user - works
- [ ] Login without remember me - works
- [ ] Login with remember me - works
- [ ] Close browser - session saved
- [ ] Reopen browser - auto-login works ✅
- [ ] Cookies visible in DevTools
- [ ] Add kertas siasatan - works
- [ ] Track pergerakan - works
- [ ] Search QR code - works
- [ ] Logout - works, cookies cleared
- [ ] Test from phone - works
- [ ] Data sync across devices - works ✅

---

**Time to Complete**: ~10 minit (selepas Node.js installed)

**Difficulty**: ⭐⭐ (Mudah)

**Status**: READY TO TEST! 🚀

---

**SELAMAT MENCUBA!** 🎉
