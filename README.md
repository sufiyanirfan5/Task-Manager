# Task Manager App

A modern, responsive task management application built with React, Firebase, and Tailwind CSS. Manage your tasks efficiently with a beautiful user interface and robust backend.

## 🚀 Features

### Authentication
- **User Registration** - Create new accounts with email verification
- **User Login** - Secure authentication with Firebase
- **Password Reset** - Forgot password functionality
- **Email Verification** - Required before accessing the dashboard
- **Secure Logout** - Proper session management

### Task Management
- **Add Tasks** - Create tasks with name, description, and deadline
- **Edit Tasks** - Update task details inline
- **Delete Tasks** - Remove tasks with confirmation
- **Status Management** - Toggle between Pending and Completed
- **Deadline Validation** - Ensures deadlines are today or in the future

### Dashboard Features
- **Task Statistics** - View total, pending, completed, and overdue tasks
- **Filtering** - Filter tasks by status (All, Pending, Completed)
- **Search** - Search tasks by name or description
- **Responsive Design** - Works perfectly on all devices
- **Real-time Sync** - Automatic synchronization with Firebase

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Forms**: Formik + Yup validation
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: Lucide React
- **Notifications**: SweetAlert2
- **Routing**: React Router DOM

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn**
3. **Firebase Project** with Authentication and Firestore enabled

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Update Firebase Configuration**
   - Open `src/firebase.js`
   - Replace the placeholder config with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Configure Firestore Rules**
   - In Firebase Console, go to Firestore Database > Rules
   - Update the rules to allow authenticated users to access their data:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /tasks/{taskId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

## 🚀 Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

3. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

### Getting Started
1. **Create Account** - Sign up with your email and password
2. **Verify Email** - Check your email and click the verification link
3. **Access Dashboard** - Start managing your tasks

### Managing Tasks
1. **Add Task** - Use the form on the left to create new tasks
2. **View Tasks** - See all your tasks in the table view
3. **Filter & Search** - Use filters and search to find specific tasks
4. **Update Status** - Click the status button to toggle between Pending/Completed
5. **Edit Task** - Click the edit button to modify task details
6. **Delete Task** - Remove tasks with the delete button

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── VerifyEmail.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── AddTaskForm.jsx
│       └── TaskTable.jsx
├── services/
│   ├── authService.js
│   └── taskService.js
├── store/
│   ├── authStore.js
│   └── taskStore.js
├── App.jsx
├── main.jsx
├── index.css
└── firebase.js
```

## 🔐 Security Features

- **Protected Routes** - Dashboard only accessible to authenticated users
- **Email Verification** - Required before accessing the app
- **User Isolation** - Users can only access their own tasks
- **Input Validation** - Form validation with Yup schemas
- **Secure Authentication** - Firebase Authentication with proper error handling

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Loading States** - Proper loading indicators throughout the app
- **Toast Notifications** - SweetAlert2 for user feedback
- **Icon Integration** - Lucide React icons for better visual experience
- **Color-coded Status** - Visual indicators for task status

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure your Firebase config is correct in `src/firebase.js`
   - Check that Authentication and Firestore are enabled

2. **Authentication Issues**
   - Verify email verification is working
   - Check Firebase Authentication settings

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **Firestore Rules**
   - Ensure your Firestore rules allow authenticated users to read/write their data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review Firebase documentation
3. Open an issue in the repository

## 🔮 Future Enhancements

- [ ] Task categories/tags
- [ ] Task priority levels
- [ ] File attachments
- [ ] Team collaboration
- [ ] Task templates
- [ ] Export/import functionality
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

**Happy Task Managing! 🎯** 