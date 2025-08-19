# Team Services - Role-Based Team Management

A comprehensive full-stack MERN application for role-based team management with complete frontend-backend integration and CRUD operations for efficient team collaboration and project management.

## 🚀 Live Demo
- **App:** https://team-service-71wh.vercel.app/

## 📦 Repository
- **GitHub:** https://github.com/Umanghere/Team-Service

## 📸 Screenshots

### 🔐 Login Page
![Dashboard Overview](https://github.com/Umanghere/Team-Service/blob/main/assets/Login.png?raw=true)

### 🏠 Dashboard Overview
![Dashboard Overview](https://github.com/Umanghere/Team-Service/blob/main/assets/Dashboard.png?raw=true)

### 👥 Team Management
![Team Management Interface](https://github.com/Umanghere/Team-Service/blob/main/assets/Team%20Members.png?raw=true)

### 📊 Role-Based Work From Office/Leave Section
![Role-Based Access Control](https://github.com/Umanghere/Team-Service/blob/main/assets/WFO.png?raw=true)

### 📋 Project Management
![Project Management Dashboard](https://github.com/Umanghere/Team-Service/blob/main/assets/Training.png?raw=true)

## ✨ Features
- 👑 **Role-Based Access Control** - Admin, Manager, and Employee roles with specific permissions
- 👥 **Team Management** - Create, manage, and organize teams efficiently
- 📋 **Project Management** - Complete project lifecycle management with task assignments
- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 📊 **Admin Dashboard** - Comprehensive admin panel for system management
- 🔄 **Complete CRUD Operations** - Create, Read, Update, Delete for all entities
- 📈 **Analytics & Reporting** - Team performance metrics and project analytics
- 📱 **Responsive Design** - Seamless experience across all devices

## 🛠️ Tech Stack
**Frontend:** 
- React.js
- CSS3
- JavaScript (ES6+)
- Bootstrap/Material-UI
**Backend:** 
- Node.js
- Express.js
**Database:** 
- MongoDB
**Authentication:** 
- JWT (JSON Web Tokens)
**Other:**
- REST APIs, Role-Based Authorization, Real-time Updates

## 📁 Project Structure
```
team-services/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Manager/
│   │   │   └── Employee/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   └── Project.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   │   └── roleAuth.js
│   └── server.js
└── README.md
```

## ⚙️ Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Modern web browser

### Installation

1. **Clone the repository**
```bash
- git clone https://github.com/Umanghere/Team-Services-Project
- cd Team-Services-Project
```

2. **Install dependencies**
```bash
# Install backend dependencies
- cd backend
- npm install

# Install frontend dependencies
- cd ../frontend
- npm install
```

3. **Set up environment variables**
```bash
# Create .env file in backend directory
- cp .env.example .env
# Add your MongoDB URI and JWT secret
```

4. **Set up database**
```bash
# Make sure MongoDB is running
# Seed initial admin user and roles
- npm run seed
```

5. **Run the application**
```bash
# Start backend server (Terminal 1)
- cd backend
- npm run dev

# Start frontend (Terminal 2)
- cd frontend
- npm start
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 🔧 Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data and admin user

#### Frontend  
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 🌟 Key Highlights

- **Advanced Role-Based System** - Implemented sophisticated permission system with Admin, Manager, and Employee roles
- **Complete MERN Integration** - Seamless full-stack integration with React frontend and Node.js backend
- **Comprehensive CRUD Operations** - Full Create, Read, Update, Delete functionality for all entities
- **Secure Authorization** - JWT-based authentication with role-specific route protection
- **Scalable Architecture** - Modular design supporting multiple teams and projects
- **Real-time Dashboard** - Live updates and notifications for team collaboration
- **Production-Ready** - Built with error handling, validation, and security best practices

## 👥 User Roles & Permissions

### 👑 Admin
- Complete system access and control
- Manage all users, teams, and projects
- System configuration and settings
- Analytics and reporting access

### 👨‍💼 Manager
- Team management and oversight
- Project creation and assignment
- Team member performance tracking
- Resource allocation and planning

### 👨‍💻 Employee
- View assigned projects and tasks
- Update task status and progress
- Team collaboration and communication
- Personal dashboard and profile

## 🔮 Future Enhancements

- [ ] Real-time chat and messaging
- [ ] File sharing and document management
- [ ] Advanced project timeline views
- [ ] Integration with external tools (Slack, GitHub)
- [ ] Mobile application
- [ ] Advanced reporting and analytics

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Umang Bansal**
- GitHub: [@Umanghere](https://github.com/Umanghere)
- LinkedIn: [Your LinkedIn Profile]
- Email: umangbansalhere@gmail.com

## 🙏 Acknowledgments

- MongoDB for flexible document database
- React.js for powerful frontend framework
- Express.js for robust backend development
- JWT for secure authentication implementation
