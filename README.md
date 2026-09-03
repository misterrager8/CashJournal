# CashJournal

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-green.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

CashJournal is a simple personal finance tracker designed to help users manage income and expenses in one place. It combines a Flask backend with a React frontend to provide a clean, responsive experience for everyday budgeting.

## Features

- Add, edit, and remove income and expense entries
- Categorize transactions for better financial tracking
- View an overview of your current balance
- Clean and responsive UI
- Fast development workflow for local use

## Tech Stack

- Backend: Python, Flask
- Frontend: React, JavaScript, CSS
- Deployment: Procfile-ready for hosting platforms like Heroku

## Project Structure

```text
CashJournal/
├── cashjournal/
│   ├── __init__.py
│   ├── __main__.py
│   └── routes.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── Procfile
├── setup.py
├── LICENSE.md
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.9+
- Node.js 16+
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CashJournal
```

### 2. Set up the backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend

From the project root:

```bash
python -m cashjournal
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

From the `frontend` directory:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## Building for Production

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

## Deployment

This project includes a `Procfile`, making it suitable for deployment platforms such as Heroku or similar services. Make sure your deployment platform is configured to run the Flask application correctly.

## Contributing

Contributions are welcome. If you would like to improve CashJournal:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.
