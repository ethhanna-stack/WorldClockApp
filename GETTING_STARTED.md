# Getting Started with World Clock App

## Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select existing project
3. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click Save

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (you'll add security rules next)
4. Choose a location close to your users

#### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Copy the `firebaseConfig` object
5. Open `firebase/config.ts` in your project
6. Replace the placeholder values with your config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // Your actual API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

#### Add Firestore Security Rules
1. In Firestore Database, go to **Rules** tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Contacts collection
    match /contacts/{contactId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

### Step 3: Run the App

```bash
npx expo start
```

Then:
- Press **`i`** for iOS Simulator (macOS only)
- Press **`a`** for Android Emulator
- Press **`w`** for Web Browser
- Or scan the QR code with Expo Go app on your phone

## Testing the App

1. **Create an account**: Click "Sign Up" and enter email/password
2. **View your timezone**: You'll see your local time on the home screen
3. **Get your share code**: Go to Profile tab to find your 6-character code
4. **Test with another account**: 
   - Create a second account (use different email)
   - Add the first account using its share code
   - See both timezones on the home screen!

## Troubleshooting

### "Firebase config not set" error
Make sure you've replaced ALL placeholder values in `firebase/config.ts` with your actual Firebase configuration.

### "Permission denied" in Firestore
Check that you've published the security rules in the Firestore Rules tab.

### Location permission issues
The app will fall back to system timezone if location permission is denied. This is normal and expected.

### "Cannot find module" errors
Run `npm install` again to ensure all dependencies are installed.

## Development Tips

### Reset the app cache
```bash
npx expo start -c
```

### View logs
```bash
npx expo start --dev-client
```

### Check for updates
```bash
npm outdated
```

## Next Steps

- Customize the UI colors in each screen's StyleSheet
- Add profile pictures using expo-image-picker
- Implement push notifications for meeting reminders
- Add calendar integration to suggest meeting times
- Deploy to app stores using EAS Build

## Support

For issues or questions:
- Check the README.md for full documentation
- Review Firebase Console for backend issues
- Check Expo documentation: https://docs.expo.dev/

