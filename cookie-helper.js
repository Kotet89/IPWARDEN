// Cookie Helper Functions
const CookieHelper = {
    // Set cookie
    setCookie: (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },

    // Get cookie
    getCookie: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    // Delete cookie
    deleteCookie: (name) => {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    },

    // Check if cookie exists
    hasCookie: (name) => {
        return CookieHelper.getCookie(name) !== null;
    },

    // Get all cookies as object
    getAllCookies: () => {
        const cookies = {};
        const cookieArray = document.cookie.split(';');
        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name) {
                cookies[name] = value;
            }
        });
        return cookies;
    },

    // Clear all cookies
    clearAllCookies: () => {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
    }
};

// LocalStorage Helper Functions (with expiry)
const StorageHelper = {
    // Set item with expiry
    setItem: (key, value, expiryInDays = null) => {
        const item = {
            value: value,
            timestamp: new Date().getTime()
        };
        
        if (expiryInDays) {
            item.expiry = new Date().getTime() + (expiryInDays * 24 * 60 * 60 * 1000);
        }
        
        localStorage.setItem(key, JSON.stringify(item));
    },

    // Get item (check expiry)
    getItem: (key) => {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) {
            return null;
        }
        
        try {
            const item = JSON.parse(itemStr);
            
            // Check if item has expiry
            if (item.expiry) {
                const now = new Date().getTime();
                
                // Check if expired
                if (now > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
            }
            
            return item.value;
        } catch (e) {
            // If not JSON, return as is (backward compatibility)
            return itemStr;
        }
    },

    // Remove item
    removeItem: (key) => {
        localStorage.removeItem(key);
    },

    // Clear all
    clear: () => {
        localStorage.clear();
    },

    // Check if item exists and not expired
    hasItem: (key) => {
        return StorageHelper.getItem(key) !== null;
    }
};

// Session Management Helper
const SessionManager = {
    // Save user session
    saveSession: (user, rememberMe = false) => {
        // Always save to localStorage
        StorageHelper.setItem('currentUser', user, rememberMe ? 30 : 1);
        StorageHelper.setItem('sessionActive', 'true', rememberMe ? 30 : 1);
        
        // Save remember me preference
        if (rememberMe) {
            StorageHelper.setItem('rememberMe', 'true', 30);
        }
    },

    // Get current session
    getSession: () => {
        const user = StorageHelper.getItem('currentUser');
        const active = StorageHelper.getItem('sessionActive');
        
        if (user && active === 'true') {
            return user;
        }
        
        return null;
    },

    // Check if session is active
    isSessionActive: () => {
        return StorageHelper.hasItem('sessionActive');
    },

    // Clear session
    clearSession: () => {
        StorageHelper.removeItem('currentUser');
        StorageHelper.removeItem('sessionActive');
        StorageHelper.removeItem('rememberMe');
        CookieHelper.clearAllCookies();
    },

    // Check remember me
    shouldRemember: () => {
        return StorageHelper.getItem('rememberMe') === 'true' || CookieHelper.hasCookie('rememberMe');
    }
};

// Display cookie info (for debugging)
function displayCookieInfo() {
    console.log('=== Cookie Information ===');
    console.log('All Cookies:', CookieHelper.getAllCookies());
    console.log('Remember Me:', CookieHelper.getCookie('rememberMe'));
    console.log('No Badan:', CookieHelper.getCookie('noBadan'));
    console.log('=========================');
    
    console.log('=== LocalStorage Information ===');
    console.log('Current User:', StorageHelper.getItem('currentUser'));
    console.log('Session Active:', StorageHelper.getItem('sessionActive'));
    console.log('Remember Me:', StorageHelper.getItem('rememberMe'));
    console.log('================================');
}

// Auto-cleanup expired items on page load
window.addEventListener('load', () => {
    // Check and cleanup expired items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        StorageHelper.getItem(key); // This will auto-remove expired items
    });
});
