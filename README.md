---
# Mass Email Sender Tool🦊📧

The **Mass Email Sender Tool** is a web application for sending personalized emails to a large number of recipients efficiently. It includes features like email scheduling, personalization tags, email tracking (open rates and click-through rates), and compliance with GDPR and CAN-SPAM regulations.
---

## Features

- **Personalized Emails**: Use tags like `{{name}}` and `{{email}}` for custom email content.
- **Email Formats**: Supports plain text, HTML, and Markdown.
- **Scheduling**: Schedule emails for specific dates and times.
- **Tracking**: Track email opens and link clicks.
- **Batch Sending**: Send emails in batches to comply with service provider limits.
- **GDPR Compliance**: Includes an opt-out link and user consent mechanisms.
- **Data Retention**: Automatically deletes old campaigns and recipient data.
- **User Campaigns**: Users can manage only their own campaigns.

---

## Technologies Used

**Frontend**:

- React (with Vite)
- Auth0 for authentication

**Backend**:

- Node.js
- Express.js
- MongoDB (for storing campaigns and recipient data)
- Nodemailer (for email delivery)
- Agenda (for scheduling emails)

**Other Tools**:

- Multer (file uploads)
- CSV Parser (recipient lists)
- Dotenv (environment variables)

---

## Prerequisites

Before running the application, ensure the following are installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas)
- [Git](https://git-scm.com/) (optional for cloning the repository)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/codedpool/mailer.git
cd mailer
```

### 2. Install Dependencies

Install dependencies for the backend and frontend:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

Create `.env` files in the `backend` and `frontend` directories with the following variables:

#### Backend `.env`

```env
MONGODB_URI=mongodb://localhost:27017/mailer
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
PORT=10000
DATA_RETENTION_DAYS=30
BACKEND_URL=http://localhost:10000
BATCH_SIZE=10
DELAY_BETWEEN_BATCHES=10000
```

#### Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:10000
VITE_FRONTEND_URL=http://localhost:5173
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:10000`.

### 5. Start the Frontend Application

```bash
cd frontend
npm run dev
```

The frontend application will run on `http://localhost:5173`.

---

## Usage

1. **Log In**: Use the **Login** button to authenticate with Auth0.
2. **Create Campaign**:
   - Upload a CSV file with recipient data.
   - Provide the email subject and content.
   - Schedule the campaign if needed.
3. **Track Performance**:
   - View campaign-level and recipient-level tracking reports.
4. **Manage Unsubscribes**:
   - Recipients can unsubscribe using the opt-out link included in emails.

---

## API Endpoints

| Endpoint                | Method | Description                            |
| ----------------------- | ------ | -------------------------------------- |
| `/send-email`           | POST   | Send or schedule emails.               |
| `/tracking-reports`     | GET    | Get tracking reports for campaigns.    |
| `/campaign-details/:id` | GET    | Fetch specific campaign details.       |
| `/track/:id`            | GET    | Track email opens via tracking pixels. |
| `/click/:id`            | GET    | Track link clicks and redirects.       |
| `/unsubscribe/:email`   | GET    | Handle unsubscribe requests.           |

---

## Folder Structure

```
mass-email-sender/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Commit changes and push them.
4. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or feedback:

- **Name**: Your Name
- **Email**: codedpool10@gmail.com
- **GitHub**: [codedpool](https://github.com/codedpool)

---

Enjoy using the **Mass Email Sender Tool**! 🚀🦊

---
