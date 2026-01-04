// Global Variables
let currentUser = null;
let currentRecord = null;

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Initialize QR Code
document.addEventListener('DOMContentLoaded', function() {
    // Generate QR Code for search page
    const currentUrl = window.location.origin + window.location.pathname + '?search=true';
    new QRCode(document.getElementById("qrcode"), {
        text: currentUrl,
        width: 200,
        height: 200,
        colorDark: "#667eea",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Add click event to QR code
    document.getElementById("qrcode").addEventListener('click', function() {
        document.getElementById('searchModal').style.display = 'block';
    });

    // Check if opened from QR code
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search') === 'true') {
        document.getElementById('searchModal').style.display = 'block';
    }

    // Check session/cookie for auto-login
    checkAutoLogin();

    initializeEventListeners();
});

// Check Auto Login from Session/Cookie
async function checkAutoLogin() {
    const result = await API.checkSession();
    
    if (result.success && result.user) {
        currentUser = result.user;
        // Also save to localStorage as backup
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadDashboard();
        
        // Show notification
        console.log(`Auto-login berjaya dari ${result.source}`);
    } else {
        // Fallback to localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadDashboard();
        }
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register Form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Toggle between login and register
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('registerPage');
    });
    
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('loginPage');
    });
    
    // Investigation Paper Form
    document.getElementById('siasatanForm').addEventListener('submit', handleSiasatanSubmit);
    
    // Tracking Form
    document.getElementById('trackingForm').addEventListener('submit', handleTrackingSubmit);
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Back to Dashboard
    document.getElementById('backToDashboard').addEventListener('click', function() {
        loadDashboard();
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('searchModal').style.display = 'none';
    });

    // Modal search form
    document.getElementById('modalSearchForm').addEventListener('submit', handleModalSearch);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('searchModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const noBadan = document.getElementById('loginBadan').value.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    if (!noBadan) {
        alert('Sila masukkan No. Badan');
        return;
    }

    // Show loading
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuatkan...';
    btn.disabled = true;

    // Call API with rememberMe option
    const result = await API.login(noBadan, rememberMe);
    
    if (result.error) {
        alert(result.error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    if (result.success) {
        currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show success message
        if (result.message) {
            console.log(result.message);
        }
        
        loadDashboard();
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Handle Registration
async function handleRegister(e) {
    e.preventDefault();
    const userData = {
        namaPegawai: document.getElementById('namaPegawai').value.trim(),
        noBadan: document.getElementById('noBadan').value.trim(),
        bahagian: document.getElementById('bahagian').value.trim()
    };

    if (!userData.namaPegawai || !userData.noBadan || !userData.bahagian) {
        alert('Sila lengkapkan semua maklumat');
        return;
    }

    // Show loading
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendaftar...';
    btn.disabled = true;

    // Call API
    const result = await API.register(userData);
    
    if (result.error) {
        alert(result.error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    if (result.success) {
        alert('Pendaftaran berjaya! Sila log masuk.');
        document.getElementById('registerForm').reset();
        showPage('loginPage');
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Load Dashboard
async function loadDashboard() {
    showPage('dashboardPage');
    
    // Display user info
    document.getElementById('displayNama').textContent = currentUser.namaPegawai;
    document.getElementById('displayBadan').textContent = currentUser.noBadan;
    document.getElementById('displayBahagian').textContent = currentUser.bahagian;
    
    // Load user's investigation papers
    await loadUserRecords();
}

// Load User Records
async function loadUserRecords() {
    const result = await API.getKertasSiasatan(currentUser.noBadan);
    
    if (result.error) {
        document.getElementById('recordsList').innerHTML = 
            `<p style="color: red;">Ralat: ${result.error}</p>`;
        return;
    }

    const records = result.records || [];
    const recordsListDiv = document.getElementById('recordsList');
    
    if (records.length === 0) {
        recordsListDiv.innerHTML = '<p>Tiada rekod lagi.</p>';
        return;
    }

    let html = '';
    records.forEach(record => {
        html += `
            <div class="record-card" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h4 style="color: #667eea; margin-bottom: 15px;">
                    <i class="fas fa-file-alt"></i> ${record.noKertasSiasatan}
                </h4>
                <p><strong>Pegawai Penyiasat:</strong> ${record.pegawaiPenyiasat}</p>
                <p><strong>No. Report:</strong> ${record.noReport}</p>
                <p><strong>Seksyen:</strong> ${record.seksyen}</p>
                <p><strong>Tarikh:</strong> ${new Date(record.createdAt).toLocaleString('ms-MY')}</p>
                <button class="btn" onclick="loadTracking('${record.noKertasSiasatan}', '${record.pegawaiPenyiasat}')" 
                    style="margin-top: 15px; padding: 10px 20px; font-size: 0.9rem;">
                    <i class="fas fa-route"></i> Lihat/Tambah Pergerakan
                </button>
            </div>
        `;
    });
    
    recordsListDiv.innerHTML = html;
}

// Handle Investigation Paper Submission
async function handleSiasatanSubmit(e) {
    e.preventDefault();
    
    const data = {
        noBadan: currentUser.noBadan,
        pegawaiPenyiasat: document.getElementById('pegawaiPenyiasat').value.trim(),
        noKertasSiasatan: document.getElementById('noKertasSiasatan').value.trim(),
        noReport: document.getElementById('noReport').value.trim(),
        seksyen: document.getElementById('seksyen').value.trim()
    };

    // Show loading
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    // Call API
    const result = await API.createKertasSiasatan(data);
    
    if (result.error) {
        alert(result.error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    if (result.success) {
        alert('Rekod berjaya disimpan!');
        document.getElementById('siasatanForm').reset();
        await loadUserRecords();
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Load Tracking Page
async function loadTracking(noKertasSiasatan, pegawaiPenyiasat) {
    currentRecord = { noKertasSiasatan, pegawaiPenyiasat };
    
    showPage('trackingPage');
    
    document.getElementById('trackingNoKS').textContent = noKertasSiasatan;
    document.getElementById('trackingPegawai').textContent = pegawaiPenyiasat;
    
    await loadMovements(noKertasSiasatan);
}

// Load Movements
async function loadMovements(noKertasSiasatan) {
    const result = await API.getPergerakan(noKertasSiasatan);
    
    if (result.error) {
        document.getElementById('trackingTableBody').innerHTML = 
            `<tr><td colspan="9" style="padding: 20px; text-align: center; color: red;">
                Ralat: ${result.error}
            </td></tr>`;
        return;
    }

    const movements = result.movements || [];
    const tbody = document.getElementById('trackingTableBody');
    
    if (movements.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="padding: 20px; text-align: center; color: #999;">Tiada pergerakan lagi.</td></tr>';
        return;
    }

    let html = '';
    movements.forEach(movement => {
        html += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.pergerakan || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.io || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.sio || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.ipk || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.tpr || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.mahkamah || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.kusFile || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${movement.lainLain || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                    <button onclick="deleteMovement(${movement.id})" 
                        style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Handle Tracking Submission
async function handleTrackingSubmit(e) {
    e.preventDefault();
    
    const data = {
        noKertasSiasatan: currentRecord.noKertasSiasatan,
        pergerakan: document.getElementById('pergerakan').value.trim(),
        io: document.getElementById('io').value.trim(),
        sio: document.getElementById('sio').value.trim(),
        ipk: document.getElementById('ipk').value.trim(),
        tpr: document.getElementById('tpr').value.trim(),
        mahkamah: document.getElementById('mahkamah').value.trim(),
        kusFile: document.getElementById('kusFile').value.trim(),
        lainLain: document.getElementById('lainLain').value.trim()
    };

    // Show loading
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambah...';
    btn.disabled = true;

    // Call API
    const result = await API.addPergerakan(data);
    
    if (result.error) {
        alert(result.error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    if (result.success) {
        alert('Pergerakan berjaya ditambah!');
        document.getElementById('trackingForm').reset();
        await loadMovements(currentRecord.noKertasSiasatan);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Delete Movement
async function deleteMovement(id) {
    if (!confirm('Adakah anda pasti mahu memadam pergerakan ini?')) {
        return;
    }

    const result = await API.deletePergerakan(id);
    
    if (result.error) {
        alert(result.error);
        return;
    }

    if (result.success) {
        alert('Pergerakan berjaya dipadam!');
        await loadMovements(currentRecord.noKertasSiasatan);
    }
}

// Handle Modal Search
async function handleModalSearch(e) {
    e.preventDefault();
    const noKertasSiasatan = document.getElementById('modalSearchKS').value.trim();
    
    if (!noKertasSiasatan) {
        alert('Sila masukkan No. Badan');
        return;
    }

    // Show loading
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari...';
    btn.disabled = true;

    // Call API
    const result = await API.searchKertasSiasatan(noKertasSiasatan);
    
    if (result.error) {
        alert(result.error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    if (result.success && result.record) {
        // Close modal
        document.getElementById('searchModal').style.display = 'none';
        
        // Display search result
        displaySearchResult(result.record);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Display Search Result
async function displaySearchResult(record) {
    const resultContainer = document.getElementById('searchResult');
    
    // Get movements
    const movementsResult = await API.getPergerakan(record.noKertasSiasatan);
    const movements = movementsResult.movements || [];
    
    let movementsHtml = '';
    if (movements.length > 0) {
        movementsHtml = `
            <h3 style="color: #333; margin: 20px 0;">Senarai Pergerakan</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: white;">
                    <thead>
                        <tr style="background: #667eea; color: white;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Pergerakan</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">IO</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">SIO</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">IPK</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">TPR</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Mahkamah</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">KUS/FILE</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Lain-lain</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        movements.forEach(movement => {
            movementsHtml += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.pergerakan || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.io || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.sio || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.ipk || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.tpr || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.mahkamah || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.kusFile || '-'}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${movement.lainLain || '-'}</td>
                </tr>`;
        });
        
        movementsHtml += `
                    </tbody>
                </table>
            </div>`;
    } else {
        movementsHtml = '<p style="text-align: center; color: #999;">Tiada pergerakan lagi.</p>';
    }
    
    resultContainer.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 80px; height: 80px; margin: 0 auto 15px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: white;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #28a745; margin-bottom: 10px;">Kertas Siasatan Dijumpai!</h2>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 15px;">Maklumat Kertas Siasatan</h3>
                <p><strong>No. Kertas Siasatan:</strong> ${record.noKertasSiasatan}</p>
                <p><strong>Pegawai Penyiasat:</strong> ${record.pegawaiPenyiasat}</p>
                <p><strong>No. Report:</strong> ${record.noReport}</p>
                <p><strong>Seksyen:</strong> ${record.seksyen}</p>
                <p><strong>Pegawai:</strong> ${record.namaPegawai || '-'}</p>
                <p><strong>Bahagian:</strong> ${record.bahagian || '-'}</p>
                <p><strong>Tarikh Dicipta:</strong> ${new Date(record.createdAt).toLocaleString('ms-MY')}</p>
            </div>
            
            ${movementsHtml}
            
            <button onclick="closeSearchResult()" 
                style="margin-top: 20px; padding: 15px 30px; background: #6c757d; color: white; border: none; 
                border-radius: 10px; cursor: pointer; font-size: 1rem; font-weight: 600;">
                <i class="fas fa-times"></i> Tutup
            </button>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Close Search Result
function closeSearchResult() {
    document.getElementById('searchResult').style.display = 'none';
    document.getElementById('modalSearchForm').reset();
}

// Handle Logout
async function handleLogout() {
    if (confirm('Adakah anda pasti mahu log keluar?')) {
        // Call API to clear server session and cookies
        const result = await API.logout();
        
        if (result.success) {
            console.log('Logout berjaya dari server');
        }
        
        // Clear local data
        currentUser = null;
        currentRecord = null;
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        showPage('loginPage');
        
        // Reset forms
        document.getElementById('loginForm').reset();
        document.getElementById('siasatanForm').reset();
        document.getElementById('trackingForm').reset();
        
        // Show message
        alert('Anda telah berjaya log keluar');
    }
}
