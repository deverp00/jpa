/* ============================================
   FIREBASE-CONFIG.JS
   Firebase Configuration for Phase 2 Integration
   ============================================

   IMPORTANT: This file contains placeholder values.
   Replace the configuration values below with your actual Firebase project credentials
   when you begin Phase 2 development.

   HOW TO GET YOUR FIREBASE CONFIG:
   1. Go to the Firebase Console (https://console.firebase.google.com/)
   2. Select your project
   3. Click on the gear icon (Project Settings)
   4. Scroll down to "Your apps"
   5. Click on the web app (</>) icon
   6. Copy the configuration object

   FIREBASE SERVICES USED:
   - Firebase Authentication (Email/Password, Google, etc.)
   - Firebase Firestore (Database)
   - Firebase Storage (File uploads)
   - Firebase Hosting (Optional)
   ============================================ */

// ============================================
// FIREBASE CONFIGURATION
// ============================================

// Replace these values with your actual Firebase project configuration
var firebaseConfig = {
    // ----- REQUIRED: Firebase Project Settings -----
    // Your Firebase project's API key
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

    // Your Firebase project's Auth Domain (project-id.firebaseapp.com)
    authDomain: "your-project-id.firebaseapp.com",

    // Your Firebase project's Database URL (https://project-id.firebaseio.com)
    databaseURL: "https://your-project-id.firebaseio.com",

    // Your Firebase project's Project ID
    projectId: "your-project-id",

    // Your Firebase project's Storage Bucket (project-id.appspot.com)
    storageBucket: "your-project-id.appspot.com",

    // Your Firebase project's Messaging Sender ID
    messagingSenderId: "123456789012",

    // Your Firebase project's App ID
    appId: "1:123456789012:web:abcdef1234567890",

    // Your Firebase project's Measurement ID (for Analytics)
    measurementId: "G-XXXXXXXXXX"
};

// ============================================
// FIREBASE INITIALIZATION (Phase 2)
// ============================================

// This section will be uncommented and used in Phase 2
// For Phase 1, it remains commented to avoid errors

/*
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Services
var auth = firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();

// Enable offline persistence (for Firestore)
db.enablePersistence()
    .then(function() {
        console.log('Firestore offline persistence enabled');
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            console.warn('Firestore offline persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.warn('Firestore offline persistence not supported by browser');
        }
    });

// Set Firestore settings (timestamps)
db.settings({
    timestampsInSnapshots: true
});

// Export Firebase instances for use in other files
window.firebaseApp = firebase;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
*/

// ============================================
// CONFIGURATION VALIDATION (Phase 2)
// ============================================

// This function checks if the Firebase config has been updated with real values
function validateFirebaseConfig() {
    var isPlaceholder = (
        firebaseConfig.apiKey === "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" ||
        firebaseConfig.projectId === "your-project-id" ||
        firebaseConfig.authDomain === "your-project-id.firebaseapp.com"
    );

    if (isPlaceholder) {
        console.warn(
            '⚠️ Firebase configuration uses placeholder values. ' +
            'Please update config/firebase-config.js with your actual Firebase project credentials ' +
            'before starting Phase 2 development.'
        );
        return false;
    }

    console.log('✅ Firebase configuration validated successfully');
    return true;
}

// ============================================
// EXPORT FOR MODULE USE (if using modules)
// ============================================

// If using ES6 modules, uncomment the export below
// export { firebaseConfig, validateFirebaseConfig };

// For CommonJS (Node.js environments), uncomment the export below
// module.exports = { firebaseConfig, validateFirebaseConfig };

// ============================================
// FIREBASE COLLECTION NAMES (Reference)
// ============================================

// These collection names will be used throughout the application
// They serve as a reference for Phase 2 database structure

var COLLECTIONS = {
    USERS: 'users',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    STAFF: 'staff',
    FEES: 'fees',
    SALARIES: 'salaries',
    ATTENDANCE: 'attendance',
    CLASSES: 'classes',
    SECTIONS: 'sections',
    SUBJECTS: 'subjects',
    EXAMINATIONS: 'examinations',
    RESULTS: 'results',
    NOTICES: 'notices',
    EVENTS: 'events',
    ANNOUNCEMENTS: 'announcements',
    RECEIPTS: 'receipts',
    CERTIFICATES: 'certificates',
    SETTINGS: 'settings',
    ACADEMIC_SESSIONS: 'academic_sessions',
    TIMETABLE: 'timetable',
    PERMISSIONS: 'permissions',
    ROLES: 'roles',
    TRANSFERS: 'transfers',
    PROMOTIONS: 'promotions',
    DOCUMENTS: 'documents',
    REPORT_CARDS: 'report_cards'
};

// ============================================
// STORAGE PATHS (Reference)
// ============================================

var STORAGE_PATHS = {
    STUDENT_DOCUMENTS: 'students/documents/',
    STUDENT_PHOTOS: 'students/photos/',
    TEACHER_DOCUMENTS: 'teachers/documents/',
    STAFF_DOCUMENTS: 'staff/documents/',
    RECEIPTS: 'receipts/',
    CERTIFICATES: 'certificates/',
    REPORTS: 'reports/',
    LOGO: 'settings/logo/'
};

// ============================================
// FIREBASE SECURITY RULES (Reference)
// ============================================

/*
FIREBASE SECURITY RULES - Placeholder Reference

These rules should be implemented in the Firebase Console under "Rules" tab.
Adjust them based on your specific requirements.

// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Students collection - read/write for authenticated users with appropriate roles
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'teacher');
    }

    // Fees collection - admin and accounts can manage
    match /fees/{feeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'accounts');
    }

    // Attendance collection - teachers and admin can manage
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'teacher');
    }

    // Settings collection - only admin can modify
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}

// Storage Rules
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'teacher' ||
         request.auth.token.role == 'staff');
    }
  }
}
*/

// ============================================
// HELPER FUNCTIONS FOR PHASE 2
// ============================================

// Get current user (to be used in Phase 2)
function getCurrentUser() {
    // This will be replaced with actual Firebase auth in Phase 2
    return firebase.auth().currentUser;
}

// Check if user is authenticated (Phase 2)
function isAuthenticated() {
    // This will be replaced with actual Firebase auth check in Phase 2
    return firebase.auth().currentUser !== null;
}

// Get user role (Phase 2)
function getUserRole() {
    // This will be replaced with actual role retrieval in Phase 2
    return firebase.auth().currentUser?.role || null;
}

// ============================================
// INITIALIZATION LOG (Phase 1)
// ============================================

console.log('📁 Firebase configuration loaded (Phase 1)');
console.log('ℹ️  Firebase integration will be enabled in Phase 2');
console.log('ℹ️  Update config/firebase-config.js with your Firebase project credentials');
console.log('ℹ️  Collection names and storage paths are defined for reference');

// Validate configuration (will warn if using placeholder values)
validateFirebaseConfig();

// ============================================
// END OF FIREBASE-CONFIG.JS
// ============================================
