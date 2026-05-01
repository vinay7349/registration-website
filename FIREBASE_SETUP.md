# Firebase Database Setup Guide

This guide will walk you through setting up your Firebase Firestore database and connecting it to your React application. 

By default, the application is currently running in **Local Mode** (saving to `localStorage`), meaning the data won't be shared across devices. Once you follow these steps, your app will save data to the real cloud database!

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Log in with your Google account.
3. Click on **"Add project"** (or "Create a project").
4. Enter a name for your project (e.g., `Fly High Volley`) and click **Continue**.
5. You can disable Google Analytics for now if you want to keep it simple, then click **Create project**.

## Step 2: Enable Firestore Database
1. Once your project is ready, look at the left-hand sidebar menu.
2. Click on **Build** -> **Firestore Database**.
3. Click the **"Create database"** button.
4. **IMPORTANT**: When asked about security rules, select **"Start in test mode"**. This allows your frontend application to read and write data immediately. 
   *(Note: You can update security rules later when going into production).*
5. Choose a database location closest to you and click **Enable**.

## Step 3: Register Your Web App
1. Go back to the Project Overview page by clicking the home icon or "Project Overview" in the top left.
2. Look for the text "Get started by adding Firebase to your app" and click the **Web icon (`</>`)**.
3. Give your app a nickname (e.g., `VolleyApp`).
4. Click **Register app**.

## Step 4: Get Your Configuration Keys
After clicking Register app, Firebase will give you a block of code. Look for the `firebaseConfig` object, which will look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "fly-high-volley.firebaseapp.com",
  projectId: "fly-high-volley",
  storageBucket: "fly-high-volley.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Keep this screen open or copy that object.**

## Step 5: Install Firebase & Connect Your Code
1. First, make sure the Firebase library is installed in your project. Open a terminal in your project folder and run:
   ```bash
   npm install firebase
   ```
   *(Note: I have already run this for you in this environment, but you will need it if you move the code to another computer!)*
2. Open the file `src/firebase.js` in your code editor.
3. Replace the placeholder `firebaseConfig` in the file with the real configuration object you just copied from Firebase.
4. Save the file.

## Step 6: Configure Security Rules (CRITICAL for Cross-Device)
If your website works on your computer but stays stuck on "Submitting" on other phones or laptops, your **Security Rules** are likely blocking the connection.

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Click on **Firestore Database** -> **Rules** tab.
3. Replace the existing rules with these:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{document=**} {
      allow read, write: if true;
    }
  }
}
```
4. Click **Publish**.

*Note: These rules allow anyone to read and write. For a production app, you should eventually restrict this, but this will guarantee it works on all devices now.*

## Step 7: Test It Out!
1. Run `npm run build` then `firebase deploy`.
2. Go to your live website.
3. Register a team and check the "Console" (F12) if it still fails—the new code will now show exactly why it failed!

---
**Troubleshooting:**
- If your data isn't saving to the cloud, make sure your Vite server is running (`npm run dev`) and double check that there are no typos when pasting your config keys into `src/firebase.js`.
