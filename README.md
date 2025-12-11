# 🔥 Resume Roaster AI

> "The job market is tough. We make it tougher."

**Resume Roaster AI** is a brutal, AI-powered resume analyzer that destroys your career dreams with 100% accuracy and 0% sympathy. It uses advanced LLMs (via Groq) to roast your CV in multiple languages (English, Hindi, Telugu) or provide a serious ATS optimization score.

## ✨ Features

- **Brutal Roast Mode**: Get your ego checked with savage feedback in 5 bullet points.
- **ATS Score Mode**: Professional analysis of your resume's keyword optimization and formatting.
- **Multi-Language Support**: Roasts available in English, Hindi (Hinglish), and Telugu (Tanglish).
- **Dynamic "Egos Hurt" Counter**: Live tracker of how many resumes have been victimized.
- **Thematic UI**: Glassmorphism design with dark interactions and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS v4, Framer Motion
- **Backend**: Node.js, Express, Multer
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Llama 3 via Groq SDK

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB Cluster (or local instance)
- Groq API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/resume-roaster.git
    cd resume-roaster
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory:
    ```env
    PORT=3000
    GROQ_API_KEY=your_groq_api_key_here
    MONGO_URI=your_mongodb_connection_string
    ```
    Start the server:
    ```bash
    node index.js
    ```

3.  **Setup Client**
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory (optional for local dev, needed for prod):
    ```env
    VITE_API_URL=http://localhost:3000
    ```
    Start the frontend:
    ```bash
    npm run dev
    ```

## ⚠️ Disclaimer

This application is for **entertainment purposes**. We are not responsible for emotional damage caused by the AI's honesty.

## 📄 License

MIT
