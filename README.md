# World Clock App

A multiplatform timezone tracking app built with React Native and Expo. Share your timezone with friends and colleagues and see their local times at a glance.

## Features

- 🌍 **Real-time World Clocks**: View multiple timezones simultaneously with live updating clocks
- 👥 **Contact Management**: Add contacts using unique share codes
- 🔒 **Firebase Authentication**: Secure email/password authentication
- 📱 **Cross-platform**: Works on iOS, Android, and Web
- ⏱️ **Automatic Timezone Detection**: Detects and stores your timezone automatically
- 📤 **Easy Sharing**: Share your unique code via text, email, or social media

## Tech Stack

- **React Native** with Expo
- **Firebase** (Authentication & Firestore)
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Expo Location** for timezone detection

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Firebase Authentication
3. Create a Firestore database
4. Get your Firebase config from Project Settings
5. Update `firebase/config.ts` with your configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firestore Security Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /contacts/{contactId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Start the App

```bash
npx expo start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your device

## Project Structure

```
WorldClockApp-1/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx    # Home screen with world clocks
│   │   ├── contacts.tsx # Contact management
│   │   ├── profile.tsx  # User profile and settings
│   │   └── _layout.tsx  # Tab navigation layout
│   ├── login.tsx      # Login screen
│   ├── signup.tsx     # Sign up screen
│   ├── index.tsx      # Initial redirect
│   └── _layout.tsx    # Root layout with auth
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── firebase/
│   └── config.ts      # Firebase configuration
├── types/
│   └── index.ts       # TypeScript types
└── utils/
    └── helpers.ts     # Helper functions and Firebase operations
```

## How to Use

1. **Sign Up**: Create an account with email and password
2. **Get Your Share Code**: Find your unique 6-character code in the Profile tab
3. **Add Contacts**: Use the Contacts tab to add friends by entering their share code
4. **View Timezones**: See all your contacts' timezones on the Home tab with live clocks
5. **Share Your Code**: Use the Share button in Profile to send your code to friends

## Features in Detail

### Authentication
- Email/password sign up and login
- Persistent authentication across app restarts
- Automatic timezone detection on signup

### World Clocks
- Real-time clock updates (every second)
- Shows date and time for each timezone
- Current user highlighted with special styling
- Pull to refresh

### Contact Management
- Add contacts using 6-character share codes
- View contact email and timezone
- Remove contacts with confirmation
- Duplicate contact prevention

### Profile
- View account information
- Display your unique share code
- Copy code to clipboard
- Share code via native share sheet
- Logout functionality

## License

MIT
