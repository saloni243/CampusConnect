

## 📌 Overview

**CampusConnect** is a web-based College Placement Management System designed to simplify the campus recruitment process.

The platform provides separate workflows for:

- 🎓 **Students** – manage profiles, discover placement opportunities, apply for jobs, and track applications.
- 🏢 **Companies / Recruiters** – create and manage placement drives, manage company profiles, and evaluate student applications.
- 🛡️ **TPO / Admin** – verify companies, manage placement activities, monitor applications, and oversee the complete recruitment workflow.

The goal is to replace fragmented placement processes with a centralized, role-based digital platform.

---

## ✨ Key Features

### 🎓 Student Module

- Student registration and authentication
- Student profile management
- Academic and professional information
- Browse available placement opportunities
- Apply for eligible jobs/drives
- Track application status
- View recruitment progress

### 🏢 Company / Recruiter Module

- Company registration and authentication
- Company profile management
- Company logo upload
- Placement drive / job management
- View student applications
- Review and manage candidates
- Shortlist/select candidates
- Recruiter dashboard with placement statistics
- TPO verification status

### 🛡️ TPO / Admin Module

- Secure TPO/Admin authentication
- Centralized admin dashboard
- Student management
- Company/recruiter verification
- Placement drive/job monitoring
- Application monitoring
- Placement statistics and analytics
- Role-based access control

### 🔐 Authentication & Security

- JWT-based authentication
- Protected routes
- Role-based authorization
- Separate access for Student, Company, and TPO/Admin
- Backend validation and error handling

### ☁️ File & Media Handling

- Company logo upload
- Cloudinary-based image storage
- Server-side file handling and validation

---

## 🔄 Recruitment Workflow

```text
                    ┌──────────────────┐
                    │   TPO / ADMIN    │
                    │                  │
                    │ Verify Companies │
                    │ Manage Placements│
                    │ Monitor Activity │
                    └────────┬─────────┘
                             │
                             ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    STUDENT      │    │   CAMPUSCONNECT  │    │     COMPANY     │
│                 │    │                  │    │                 │
│ Register/Login  │───▶│ Placement System │◀───│ Register/Login  │
│ Create Profile  │    │                  │    │ Create Profile  │
│ Browse Jobs     │◀───│                  │───▶│ Create Drives   │
│ Apply           │    │                  │    │ View Applicants │
│ Track Status    │◀───│                  │───▶│ Shortlist/Select│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Typical flow

1. Company creates a recruiter account.
2. TPO/Admin verifies the company.
3. Verified company creates a placement drive/job.
4. Eligible students view the opportunity.
5. Students submit applications.
6. Recruiter reviews applications and updates candidate status.
7. Students can track their application progress.
8. TPO/Admin can monitor the overall placement activity.

---

## 🧱 Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- REST API integration

### Backend

- Node.js
- Express.js
- RESTful APIs
- JWT Authentication
- Role-based authorization

### Database

- MongoDB
- Mongoose ODM

### Cloud / Services

- Cloudinary for image storage

### Development Tools

- Git & GitHub
- VS Code
- Postman
- npm

---

## 🏗️ High-Level Architecture

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Express.js Backend
      │
      ├── Authentication
      ├── Authorization
      ├── Student APIs
      ├── Company APIs
      ├── TPO/Admin APIs
      ├── Job/Drive APIs
      └── Application APIs
      │
      ▼
MongoDB Database
      │
      └── Cloudinary
          (Company Images)
```

---

## 📂 Project Structure

A typical project structure is organized around the frontend and backend:

```text
CampusConnect/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   └── package.json
│
├── README.md
└── ...
```

> Folder names may vary slightly depending on the final project structure.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CampusConnect
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit real credentials, API keys, JWT secrets, or database passwords to GitHub.

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Then open the frontend URL shown by Vite in the terminal, commonly:

```text
http://localhost:5173
```

---

## 🔑 User Roles

| Role | Main Responsibilities |
|------|------------------------|
| 🎓 Student | Profile, browse jobs, apply, track applications |
| 🏢 Company | Company profile, create drives, review applicants, manage recruitment |
| 🛡️ TPO/Admin | Verify companies, manage placement activities, monitor students/jobs/applications |

### Admin Security

TPO/Admin is intentionally **not part of public registration**.

Students and companies can register through the normal registration flow, while administrative access is handled through a separate protected login.

This prevents arbitrary users from creating administrative accounts.

---

## 🧪 Testing the Complete System

For a complete end-to-end test, verify the following workflow:

### Student

- [ ] Register student account
- [ ] Login
- [ ] Complete/update profile
- [ ] View available jobs
- [ ] Apply for a job
- [ ] Track application status

### Company

- [ ] Register company account
- [ ] Login
- [ ] Complete company profile
- [ ] Upload company logo
- [ ] Confirm pending verification state
- [ ] Get company verified by TPO/Admin
- [ ] Create placement drive/job
- [ ] View student applications
- [ ] Update candidate/application status

### TPO/Admin

- [ ] Login through admin/TPO login
- [ ] View dashboard
- [ ] View pending companies
- [ ] Approve/reject company
- [ ] Manage/view students
- [ ] Monitor jobs/drives
- [ ] Monitor applications
- [ ] View placement statistics

### End-to-End

```text
Company Registration
        ↓
Pending TPO Verification
        ↓
TPO Approves Company
        ↓
Company Creates Placement Drive
        ↓
Student Views Drive
        ↓
Student Applies
        ↓
Company Reviews Application
        ↓
Company Shortlists / Selects Student
        ↓
Student Sees Updated Status
```

---

## 🔒 Security Notes

- Keep `.env` files out of version control.
- Use strong JWT secrets in production.
- Do not expose MongoDB credentials.
- Do not expose Cloudinary API secrets.
- Use HTTPS when deploying the production application.
- Apply appropriate CORS and production environment configuration before deployment.

---

## 🚀 Future Improvements

Possible future enhancements include:

- Email notifications for application status changes
- Resume/document management
- Advanced eligibility filtering
- Interview scheduling
- Placement calendar
- Automated placement reports
- Export reports to Excel/PDF
- Real-time notifications
- Production deployment with CI/CD
- Advanced analytics and charts

---

## 🎯 Project Objective

CampusConnect aims to make the college placement process:

- **Centralized**
- **Transparent**
- **Role-based**
- **Efficient**
- **Easy to monitor**

It connects students, recruiters, and the college placement cell through a single platform.

---

## 👨‍💻 Project

**CampusConnect – College Placement Management System**

Built as a full-stack web application demonstrating:

- Frontend development
- Backend API development
- Database design
- Authentication & authorization
- Role-based access control
- File/image uploads
- Recruitment workflow implementation
- Full-stack integration

---



