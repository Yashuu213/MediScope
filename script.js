// Health tips that will rotate
const healthTips = [
    "Daily Health Tip: Drink at least 8 glasses of water for optimal hydration.",
    "Daily Health Tip: Aim for 7-9 hours of sleep each night for better health.",
    "Daily Health Tip: Include at least 30 minutes of physical activity in your daily routine.",
    "Daily Health Tip: Eat a variety of colorful fruits and vegetables for balanced nutrition.",
    "Daily Health Tip: Practice mindfulness or meditation to reduce stress levels.",
    "Daily Health Tip: Limit processed foods and added sugars in your diet.",
    "Daily Health Tip: Take short breaks if you sit for long periods to improve circulation."
];

// Load users from localStorage if available
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "1234567890",
        bmiHistory: [],
        dietPlans: [],
        exercisePlans: [],
        notifications: []
    }
];

// Save users to localStorage whenever we modify it
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

let currentUser = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const profileSection = document.getElementById('profileSection');
const authButtons = document.getElementById('authButtons');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const usernameDisplay = document.getElementById('usernameDisplay');
const avatar = document.getElementById('avatar');
const dropdownName = document.getElementById('dropdownName');
const dropdownEmail = document.getElementById('dropdownEmail');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const authForm = document.getElementById('authForm');
const nameField = document.getElementById('nameField');
const confirmPasswordField = document.getElementById('confirmPasswordField');
const submitBtn = document.getElementById('submitBtn');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const dailyTip = document.getElementById('dailyTip');
const authRequiredSection = document.getElementById('authRequiredSection');
const userDashboard = document.getElementById('userDashboard');
const mainLoginBtn = document.getElementById('mainLoginBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

// Initialize the application
function init() {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthUI();
    }
    
    // Set up daily health tip rotation
    rotateHealthTips();
    
    // Set up event listeners
    setupEventListeners();
}

// Rotate health tips every 10 seconds
function rotateHealthTips() {
    let currentTip = 0;
    dailyTip.textContent = healthTips[currentTip];
    
    setInterval(() => {
        currentTip = (currentTip + 1) % healthTips.length;
        dailyTip.textContent = healthTips[currentTip];
    }, 10000);
}

// Update UI based on authentication state
function updateAuthUI() {
    if (currentUser) {
        // User is logged in
        authSection.classList.add('hidden');
        profileSection.classList.remove('hidden');
        authRequiredSection.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        
        // Update profile information
        const firstName = currentUser.name.split(' ')[0];
        usernameDisplay.textContent = firstName;
        avatar.textContent = firstName.charAt(0).toUpperCase();
        dropdownName.textContent = currentUser.name;
        dropdownEmail.textContent = currentUser.email;
    } else {
        // User is not logged in
        authSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
        authRequiredSection.classList.remove('hidden');
        userDashboard.classList.add('hidden');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    loginBtn.addEventListener('click', () => openAuthModal('login'));
    signupBtn.addEventListener('click', () => openAuthModal('signup'));
    mainLoginBtn.addEventListener('click', () => openAuthModal('login'));
    
    // Profile dropdown
    profileBtn.addEventListener('click', toggleDropdown);
    
    // Logout
    logoutBtn.addEventListener('click', logout);
    
    // Auth modal
    closeModal.addEventListener('click', closeAuthModal);
    
    // Toggle between login and signup
    toggleAuthMode.addEventListener('click', toggleAuthModeHandler);
    
    // Form submission
    authForm.addEventListener('submit', handleAuthFormSubmit);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!profileBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
}

// Open auth modal
function openAuthModal(mode) {
    authModal.classList.remove('hidden');
    
    if (mode === 'login') {
        modalTitle.textContent = 'Login to MediScope';
        submitBtn.textContent = 'Login';
        toggleAuthMode.textContent = "Don't have an account? Sign Up";
        nameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        authForm.dataset.mode = 'login';
    } else {
        modalTitle.textContent = 'Sign Up for MediScope';
        submitBtn.textContent = 'Sign Up';
        toggleAuthMode.textContent = "Already have an account? Login";
        nameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        authForm.dataset.mode = 'signup';
    }
}

// Close auth modal
function closeAuthModal() {
    authModal.classList.add('hidden');
    authForm.reset();
}

// Toggle profile dropdown
function toggleDropdown() {
    profileDropdown.classList.toggle('hidden');
}

// Toggle between login and signup
function toggleAuthModeHandler(event) {
    event.preventDefault();
    
    if (authForm.dataset.mode === 'login') {
        // Switch to signup
        modalTitle.textContent = 'Sign Up for MediScope';
        submitBtn.textContent = 'Sign Up';
        toggleAuthMode.textContent = "Already have an account? Login";
        nameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        authForm.dataset.mode = 'signup';
    } else {
        // Switch to login
        modalTitle.textContent = 'Login to MediScope';
        submitBtn.textContent = 'Login';
        toggleAuthMode.textContent = "Don't have an account? Sign Up";
        nameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        authForm.dataset.mode = 'login';
    }
}

// Handle form submission
function handleAuthFormSubmit(event) {
    event.preventDefault();
    
    const mode = authForm.dataset.mode;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (mode === 'signup') {
        // Signup process
        const name = document.getElementById('name').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('An account with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, this would be hashed
            phone: '',
            bmiHistory: [],
            dietPlans: [],
            exercisePlans: [],
            notifications: [{
                id: Date.now().toString(),
                title: 'Welcome to MediScope!',
                message: 'Thank you for signing up. Start by calculating your BMI and setting up your profile.',
                date: new Date().toISOString(),
                read: false
            }]
        };
        
        users.push(newUser);
        saveUsers(); // <- Persist users
        currentUser = newUser;
        
    } else {
        // Login process
        const user = users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            alert('Invalid email or password');
            return;
        }
        
        currentUser = user;
    }
    
    // Save user session
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI and close modal
    updateAuthUI();
    closeAuthModal();
    
    // Show welcome message if new user
    if (mode === 'signup') {
        alert(`Welcome to MediScope, ${currentUser.name.split(' ')[0]}!`);
    }
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    profileDropdown.classList.add('hidden');
}

// Redirect to other pages
function redirectTo(page) {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }
    window.location.href = page;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
