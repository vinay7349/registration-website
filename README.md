# 🏐 Fly High League | Tournament Management Platform

A premium, mobile-first tournament registration and management platform built for **Volleyball** and **Throwball** leagues. This platform streamlines the registration process, provides real-time data to administrators, and offers a sleek, app-like experience for users.

---

## 🌟 Key Features

- **🏆 Multi-Sport Support**: Specialized registration flows for Volleyball (6+2) and Throwball (9+2).
- **📱 Mobile-First Design**: Optimized UI that feels like a native mobile application with bottom navigation and touch feedback.
- **🛡️ Secure Admin Dashboard**: A private, password-protected area (`/admin`) for viewing registrations and managing player rosters.
- **💬 Interactive Chatbot**: Built-in support assistant to answer participant queries and collect feedback.
- **⏳ Real-time Countdown**: Dynamic urgency timer to drive registrations before the deadline.
- **🔒 Security Focused**: Firebase API keys protected via environment variables and strict Firestore security rules.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Mobile-optimized with Media Queries)
- **Backend**: Firebase (Firestore, Hosting)
- **Icons**: FontAwesome 6
- **Fonts**: Google Fonts (Outfit & Inter)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/vinay7349/registration-website.git
cd registration-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Locally
```bash
npm run dev
```

---

## 📦 Deployment

To deploy the website to Firebase Hosting:

1. **Build the Project**:
   ```bash
   npm run build
   ```
2. **Deploy via Firebase CLI**:
   ```bash
   firebase deploy
   ```

---

## 🔐 Admin Access

The Admin Dashboard is hidden from the main navigation for privacy.
- **URL**: `your-domain.com/admin`
- **Access Key**: Contact the administrator for the secure access key.

---

## 📄 License

This project is built for the **Fly High League** tournament. All rights reserved.

---

**Developed with ❤️ for the Sports Community.**
