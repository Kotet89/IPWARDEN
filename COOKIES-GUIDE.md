# 🍪 PANDUAN COOKIES & SESSION MANAGEMENT

## Sistem Penyimpanan Data

Sistem IP WARDEN kini menggunakan **3 jenis penyimpanan**:

### 1. 🍪 HTTP Cookies (Server-side)
- Disimpan oleh server
- Secure dan httpOnly
- Expired automatik selepas 7-30 hari
- Dihantar automatik dengan setiap request

### 2. 💾 Browser LocalStorage (Client-side)
- Disimpan di browser
- Accessible by JavaScript
- Dengan expiry management
- Backup jika cookies tidak tersedia

### 3. 🔐 Express Session (Server-side)
- Disimpan di server memory
- Session ID dalam cookie
- Active selagi browser tidak ditutup

---

## Cara Kerja

### Login Tanpa "Ingat Saya"
```
User login → Server create session → Session cookie set → User stay logged in
Browser ditutup → Session cleared → Perlu login semula
```

### Login Dengan "Ingat Saya" ✅
```
User login + tick "Ingat Saya"
→ Server create session
→ Server set persistent cookie (30 hari)
→ LocalStorage saved (30 hari)
→ User stay logged in walaupun browser ditutup
→ Auto-login sehingga 30 hari
```

---

## Cookies Yang Digunakan

### 1. `connect.sid` (Session Cookie)
- **Type**: HttpOnly, Secure
- **Lifespan**: 7 hari atau bila browser ditutup
- **Purpose**: Session management
- **Set by**: express-session

### 2. `noBadan` (Remember Me Cookie)
- **Type**: HttpOnly
- **Lifespan**: 30 hari (jika tick "Ingat Saya")
- **Purpose**: Auto-login
- **Set by**: Server API

### 3. `rememberMe` (Preference Cookie)
- **Type**: Accessible by JavaScript
- **Lifespan**: 30 hari
- **Purpose**: Track remember me preference
- **Set by**: Server API

---

## LocalStorage Items

### 1. `currentUser`
```json
{
  "value": {
    "id": 1,
    "namaPegawai": "Ahmad",
    "noBadan": "123456",
    "bahagian": "JSJ"
  },
  "timestamp": 1704441600000,
  "expiry": 1706861600000
}
```

### 2. `sessionActive`
```json
{
  "value": "true",
  "timestamp": 1704441600000,
  "expiry": 1706861600000
}
```

### 3. `rememberMe`
```json
{
  "value": "true",
  "timestamp": 1704441600000,
  "expiry": 1706861600000
}
```

---

## Auto-Login Flow

```
1. User buka website
   ↓
2. checkAutoLogin() dipanggil
   ↓
3. Check server session (API: /api/check-session)
   ↓
4. IF session exists → Auto login ✅
   ↓
5. ELSE check cookie "noBadan"
   ↓
6. IF cookie exists → Restore session → Auto login ✅
   ↓
7. ELSE check localStorage
   ↓
8. IF localStorage valid → Load data → Auto login ✅
   ↓
9. ELSE → Show login page
```

---

## Security Features

### 🔒 httpOnly Cookies
- Tidak boleh diakses oleh JavaScript
- Lindungi dari XSS attacks
- Hanya server boleh baca/tulis

### 🔐 Secure Flag (untuk HTTPS)
```javascript
cookie: {
    secure: true,  // Enable untuk production dengan HTTPS
    httpOnly: true,
    sameSite: 'strict'
}
```

### ⏱️ Auto Expiry
- Session: 7 hari max
- Remember me: 30 hari
- LocalStorage: 1-30 hari (configurable)

### 🗑️ Secure Logout
- Clear server session
- Delete all cookies
- Clear localStorage
- Redirect to login

---

## Testing Cookies

### Check Cookies Di Browser

**Chrome/Edge:**
1. Press `F12` (DevTools)
2. Go to "Application" tab
3. Expand "Cookies" → http://localhost:3000
4. Lihat semua cookies

**Firefox:**
1. Press `F12`
2. Go to "Storage" tab
3. Expand "Cookies"

### Check Via JavaScript Console
```javascript
// Display all cookie info
displayCookieInfo();

// Check specific cookie
CookieHelper.getCookie('noBadan');

// Check session
SessionManager.getSession();

// Check if should remember
SessionManager.shouldRemember();
```

---

## Cookie Helper Functions

### Set Cookie
```javascript
CookieHelper.setCookie('name', 'value', 30); // 30 days
```

### Get Cookie
```javascript
const value = CookieHelper.getCookie('name');
```

### Delete Cookie
```javascript
CookieHelper.deleteCookie('name');
```

### Has Cookie
```javascript
if (CookieHelper.hasCookie('noBadan')) {
    console.log('User remembered!');
}
```

---

## LocalStorage Helper Functions

### Save with Expiry
```javascript
StorageHelper.setItem('key', 'value', 30); // 30 days
```

### Get (auto-check expiry)
```javascript
const value = StorageHelper.getItem('key');
// Returns null if expired
```

### Remove
```javascript
StorageHelper.removeItem('key');
```

---

## Session Manager Functions

### Save Session
```javascript
SessionManager.saveSession(userObject, rememberMe);
```

### Get Session
```javascript
const user = SessionManager.getSession();
```

### Clear Session
```javascript
SessionManager.clearSession();
```

### Check Remember Me
```javascript
if (SessionManager.shouldRemember()) {
    console.log('User wants to be remembered');
}
```

---

## Configuration

### Server-side (server.js)

```javascript
app.use(session({
    secret: 'ip-warden-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,        // Set true untuk HTTPS
        httpOnly: true,       // Prevent JavaScript access
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 hari
    }
}));
```

### CORS with Credentials

```javascript
app.use(cors({
    origin: true,
    credentials: true  // PENTING: Allow cookies
}));
```

### API Calls with Credentials

```javascript
fetch(url, {
    method: 'POST',
    credentials: 'include',  // PENTING: Send cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

---

## Troubleshooting

### Cookies tidak set?
1. ✅ Check CORS credentials: true
2. ✅ Check fetch credentials: 'include'
3. ✅ Check browser tidak block cookies
4. ✅ Check domain sama (localhost:3000)

### Auto-login tidak berfungsi?
1. ✅ Check cookie belum expired
2. ✅ Check API endpoint /api/check-session
3. ✅ Check localStorage tidak cleared
4. ✅ F5 refresh page

### Session hilang lepas restart server?
- **Normal behaviour** - session in-memory
- **Solution**: Guna production session store:
  - Redis
  - MongoDB
  - PostgreSQL

---

## Production Recommendations

### 1. Use HTTPS
```javascript
cookie: {
    secure: true,  // Enable in production
    sameSite: 'strict'
}
```

### 2. Use Session Store
```javascript
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    // ... other options
}));
```

### 3. Environment Variables
```javascript
// .env file
SESSION_SECRET=your-super-secret-key
COOKIE_MAX_AGE=604800000
```

### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.post('/api/login', loginLimiter, (req, res) => {
    // ... login logic
});
```

---

## Benefits

✅ **Auto-Login**: User tak perlu login berulang kali
✅ **Multi-Device**: Same session across devices
✅ **Secure**: HttpOnly cookies + session management
✅ **Flexible**: 3-tier storage (cookie, session, localStorage)
✅ **User-Friendly**: "Ingat Saya" option
✅ **Persistent**: Data kekal sehingga 30 hari
✅ **Auto-Cleanup**: Expired data deleted automatically

---

## Comparison: Before vs After

### Before (LocalStorage Only)
```
❌ Data in browser only
❌ No server-side session
❌ Not truly persistent
❌ No auto-login across devices
❌ No expiry management
```

### After (Cookies + Session + LocalStorage)
```
✅ Data synced with server
✅ Server-side session management
✅ Truly persistent (30 days)
✅ Auto-login works
✅ Cross-device sync
✅ Auto expiry and cleanup
✅ Secure httpOnly cookies
✅ Remember me feature
```

---

**Status**: ✅ Cookies & Session Management Fully Implemented!

**Last Updated**: January 5, 2026
