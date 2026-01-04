// API Configuration
const API_URL = 'http://localhost:3000/api';

// API Helper Functions
const API = {
    // User Registration
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error during registration:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // User Login
    login: async (noBadan, rememberMe = false) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ noBadan, rememberMe })
            });
            return await response.json();
        } catch (error) {
            console.error('Error during login:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Check Session (Auto Login)
    checkSession: async () => {
        try {
            const response = await fetch(`${API_URL}/check-session`, {
                method: 'GET',
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error checking session:', error);
            return { success: false };
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error during logout:', error);
            return { error: 'Ralat log keluar' };
        }
    },

    // Create Investigation Paper
    createKertasSiasatan: async (data) => {
        try {
            const response = await fetch(`${API_URL}/kertas-siasatan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating record:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Get Investigation Papers by User
    getKertasSiasatan: async (noBadan) => {
        try {
            const response = await fetch(`${API_URL}/kertas-siasatan/${noBadan}`, {
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching records:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Search Investigation Paper
    searchKertasSiasatan: async (noKertasSiasatan) => {
        try {
            const response = await fetch(`${API_URL}/search/${noKertasSiasatan}`, {
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error searching record:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Add Movement
    addPergerakan: async (data) => {
        try {
            const response = await fetch(`${API_URL}/pergerakan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding movement:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Get Movements
    getPergerakan: async (noKertasSiasatan) => {
        try {
            const response = await fetch(`${API_URL}/pergerakan/${noKertasSiasatan}`, {
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching movements:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Delete Movement
    deletePergerakan: async (id) => {
        try {
            const response = await fetch(`${API_URL}/pergerakan/${id}`, {
                method: 'DELETE',
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting movement:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    },

    // Get All Users
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                credentials: 'include' // Include cookies
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return { error: 'Ralat sambungan ke server' };
        }
    }
};
