const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'ip-warden-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true jika guna HTTPS
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    }
}));
app.use(express.static(__dirname));

// Database setup
const db = new sqlite3.Database('./ipwarden.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected successfully');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        namaPegawai TEXT NOT NULL,
        noBadan TEXT UNIQUE NOT NULL,
        bahagian TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Investigation papers table
    db.run(`CREATE TABLE IF NOT EXISTS kertas_siasatan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        noBadan TEXT NOT NULL,
        pegawaiPenyiasat TEXT NOT NULL,
        noKertasSiasatan TEXT NOT NULL,
        noReport TEXT NOT NULL,
        seksyen TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (noBadan) REFERENCES users(noBadan)
    )`);

    // Tracking movements table
    db.run(`CREATE TABLE IF NOT EXISTS pergerakan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        noKertasSiasatan TEXT NOT NULL,
        pergerakan TEXT,
        io TEXT,
        sio TEXT,
        ipk TEXT,
        tpr TEXT,
        mahkamah TEXT,
        kusFile TEXT,
        lainLain TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (noKertasSiasatan) REFERENCES kertas_siasatan(noKertasSiasatan)
    )`);

    console.log('Database tables initialized');
}

// ============ API ENDPOINTS ============

// 1. User Registration
app.post('/api/register', (req, res) => {
    const { namaPegawai, noBadan, bahagian } = req.body;
    
    if (!namaPegawai || !noBadan || !bahagian) {
        return res.status(400).json({ error: 'Semua field diperlukan' });
    }

    const query = 'INSERT INTO users (namaPegawai, noBadan, bahagian) VALUES (?, ?, ?)';
    db.run(query, [namaPegawai, noBadan, bahagian], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'No. Badan sudah wujud' });
            }
            return res.status(500).json({ error: 'Gagal mendaftar pengguna' });
        }
        res.json({ 
            success: true, 
            message: 'Pendaftaran berjaya',
            userId: this.lastID 
        });
    });
});

// 2. User Login
app.post('/api/login', (req, res) => {
    const { noBadan, rememberMe } = req.body;
    
    if (!noBadan) {
        return res.status(400).json({ error: 'No. Badan diperlukan' });
    }

    const query = 'SELECT * FROM users WHERE noBadan = ?';
    db.get(query, [noBadan], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal log masuk' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak dijumpai' });
        }
        
        // Save user in session
        req.session.user = user;
        req.session.noBadan = user.noBadan;
        
        // Set cookie if remember me is checked
        if (rememberMe) {
            res.cookie('noBadan', user.noBadan, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
                httpOnly: true
            });
            res.cookie('rememberMe', 'true', {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false // Accessible by JavaScript
            });
        }
        
        res.json({ 
            success: true, 
            user: user,
            message: 'Log masuk berjaya'
        });
    });
});

// 2a. Check Session / Auto Login
app.get('/api/check-session', (req, res) => {
    // Check session first
    if (req.session.user) {
        return res.json({
            success: true,
            user: req.session.user,
            source: 'session'
        });
    }
    
    // Check cookie
    const noBadan = req.cookies.noBadan;
    if (noBadan) {
        const query = 'SELECT * FROM users WHERE noBadan = ?';
        db.get(query, [noBadan], (err, user) => {
            if (err || !user) {
                return res.json({ success: false });
            }
            
            // Restore session
            req.session.user = user;
            req.session.noBadan = user.noBadan;
            
            res.json({
                success: true,
                user: user,
                source: 'cookie'
            });
        });
    } else {
        res.json({ success: false });
    }
});

// 2b. Logout
app.post('/api/logout', (req, res) => {
    // Clear session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal log keluar' });
        }
        
        // Clear cookies
        res.clearCookie('noBadan');
        res.clearCookie('rememberMe');
        res.clearCookie('connect.sid'); // Session cookie
        
        res.json({
            success: true,
            message: 'Berjaya log keluar'
        });
    });
});

// 3. Create Investigation Paper
app.post('/api/kertas-siasatan', (req, res) => {
    const { noBadan, pegawaiPenyiasat, noKertasSiasatan, noReport, seksyen } = req.body;
    
    if (!noBadan || !pegawaiPenyiasat || !noKertasSiasatan || !noReport || !seksyen) {
        return res.status(400).json({ error: 'Semua field diperlukan' });
    }

    const query = 'INSERT INTO kertas_siasatan (noBadan, pegawaiPenyiasat, noKertasSiasatan, noReport, seksyen) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [noBadan, pegawaiPenyiasat, noKertasSiasatan, noReport, seksyen], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Gagal menyimpan rekod' });
        }
        res.json({ 
            success: true, 
            message: 'Rekod berjaya disimpan',
            recordId: this.lastID 
        });
    });
});

// 4. Get Investigation Papers by User
app.get('/api/kertas-siasatan/:noBadan', (req, res) => {
    const { noBadan } = req.params;
    
    const query = 'SELECT * FROM kertas_siasatan WHERE noBadan = ? ORDER BY createdAt DESC';
    db.all(query, [noBadan], (err, records) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mendapatkan rekod' });
        }
        res.json({ success: true, records: records });
    });
});

// 5. Search Investigation Paper by Number
app.get('/api/search/:noKertasSiasatan', (req, res) => {
    const { noKertasSiasatan } = req.params;
    
    const query = `
        SELECT ks.*, u.namaPegawai, u.bahagian 
        FROM kertas_siasatan ks
        LEFT JOIN users u ON ks.noBadan = u.noBadan
        WHERE ks.noKertasSiasatan = ?
    `;
    
    db.get(query, [noKertasSiasatan], (err, record) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mencari rekod' });
        }
        if (!record) {
            return res.status(404).json({ error: 'Kertas siasatan tidak dijumpai' });
        }
        res.json({ success: true, record: record });
    });
});

// 6. Add Movement Tracking
app.post('/api/pergerakan', (req, res) => {
    const { noKertasSiasatan, pergerakan, io, sio, ipk, tpr, mahkamah, kusFile, lainLain } = req.body;
    
    if (!noKertasSiasatan) {
        return res.status(400).json({ error: 'No. Kertas Siasatan diperlukan' });
    }

    const query = `INSERT INTO pergerakan 
        (noKertasSiasatan, pergerakan, io, sio, ipk, tpr, mahkamah, kusFile, lainLain) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [noKertasSiasatan, pergerakan, io, sio, ipk, tpr, mahkamah, kusFile, lainLain], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Gagal menyimpan pergerakan' });
        }
        res.json({ 
            success: true, 
            message: 'Pergerakan berjaya ditambah',
            movementId: this.lastID 
        });
    });
});

// 7. Get Movements by Investigation Paper
app.get('/api/pergerakan/:noKertasSiasatan', (req, res) => {
    const { noKertasSiasatan } = req.params;
    
    const query = 'SELECT * FROM pergerakan WHERE noKertasSiasatan = ? ORDER BY createdAt DESC';
    db.all(query, [noKertasSiasatan], (err, movements) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mendapatkan pergerakan' });
        }
        res.json({ success: true, movements: movements });
    });
});

// 8. Delete Movement
app.delete('/api/pergerakan/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM pergerakan WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Gagal memadam pergerakan' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Pergerakan tidak dijumpai' });
        }
        res.json({ success: true, message: 'Pergerakan berjaya dipadam' });
    });
});

// 9. Get All Users (Admin)
app.get('/api/users', (req, res) => {
    const query = 'SELECT id, namaPegawai, noBadan, bahagian, createdAt FROM users ORDER BY createdAt DESC';
    db.all(query, [], (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mendapatkan senarai pengguna' });
        }
        res.json({ success: true, users: users });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`============================================`);
    console.log(`   IP WARDEN SERVER BERJALAN`);
    console.log(`   Port: ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`============================================`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
        console.log('\nDatabase connection closed');
        process.exit(0);
    });
});
