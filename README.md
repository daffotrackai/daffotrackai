# 🚀 DaffoTrack AI: Smart Academic Companion

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://daffotrack.vercel.app)
[![Railway](https://img.shields.io/badge/Backend-Railway-blueviolet?style=for-the-badge&logo=railway)](https://railway.app)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

**DaffoTrack AI** is a premium academic management platform engineered specifically for students of **Daffodil International University (DIU)**. By integrating high-performance backend systems with cutting-edge AI, it simplifies complex university policies, tracks academic progress, and provides strategic planning tools in a unified, intuitive interface.

---

## 🌟 Key Features

### 📊 Smart Dashboard
- **Real-time Stats:** Instant visibility into CGPA, completed credits, and attendance rates.
- **Waiver Guardrail:** Visual indicators showing if your current performance secures your tuition waiver.
- **Grade Predictor:** Interactive tool to simulate final grades based on DIU's official marking rubric.

### 🤖 AI Academic Advisor
- **Context-Aware Chat:** A specialized AI bot trained on DIU policy handbooks.
- **Document Analysis:** Upload syllabus PDFs or marksheets for instant AI summarization and insights.
- **Multi-LLM Integration:** Powered by Groq (Llama 3), xAI (Grok), and OpenAI for reliable, high-speed responses.

### 🗓️ Strategic Academic Planner
- **Target Tracking:** Calculate the exact SGPA needed in upcoming semesters to reach your target CGPA.
- **Scenario Comparison:** Compare different study loads (Conservative vs. Aggressive) to optimize your path.

### 📚 Course Management
- **Smart Catalog:** Quickly add standard DIU courses from a pre-configured list.
- **Semester Auto-Detection:** Automatically filters and organizes records based on Spring, Summer, and Fall cycles.
- **Sync Status:** Persistent storage using MySQL ensures your records are safe and accessible anywhere.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 (Vite), Tailwind CSS 4.0, React Router 7, Lucide Icons |
| **Backend** | Spring Boot 3.4 (Java 21), Hibernate (JPA), Spring AI, Spring Web |
| **Database** | MySQL 8.0, HikariCP Connection Pooling |
| **Deployment** | Railway (Backend & DB), Vercel (Frontend) |
| **Tools** | Maven, NPM, Git, Postman |

---

## 🏗️ Project Structure

```text
Metamorph-X/
├── DaffoTrackAI/          # Spring Boot Backend Project
│   ├── src/main/java/     # Core Business Logic & Controllers
│   └── src/main/resources/# Application Configuration
├── daffotrack-web/        # React Frontend Project
│   ├── src/pages/         # UI View Components
│   └── src/lib/           # API Utilities & Session Management
└── README.md              # Project Documentation
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Java 21 JDK**
- **Node.js (v18+)**
- **MySQL Server**

### 1. Clone the Repository
```bash
git clone https://github.com/Metamorph-X/DaffoTrackAI.git
cd Metamorph-X
```

### 2. Backend Setup
1. Navigate to the backend folder: `cd DaffoTrackAI`
2. Create/Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   # AI API Keys (Optional)
   groq.api-key=your_groq_key
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd daffotrack-web`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```text
   VITE_API_BASE_URL=http://localhost:8081
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment Guide

### Backend (Railway)
1. Link your GitHub repository to **Railway.app**.
2. Provision a **MySQL Instance** in the same project.
3. Railway will automatically inject the `PORT` and `DATABASE_URL`.
4. Ensure `server.port=${PORT:8080}` is set in your properties.

### Frontend (Vercel)
1. Connect your repo to **Vercel**.
2. Set the `Framework Preset` to **Vite**.
3. Add Environment Variable: `VITE_API_BASE_URL` pointing to your Railway backend URL.
4. Deploy!

---

## 🛡️ Error Handling
- **Backend:** Features a `CustomErrorController` that replaces the default Whitelabel page with a branded HTML error view for browsers and clean JSON for API clients.
- **Frontend:** Includes a specialized `ErrorPage.jsx` using React Router's `errorElement` to handle 404s and runtime crashes with a "Go Back" recovery path.

---

## 📸 Screenshots / Preview
*(Placeholders for your high-res images)*
- 🖥️ **Dashboard View:** `[Link to Dashboard Image]`
- 💬 **AI Advisor Chat:** `[Link to AI Chat Image]`
- 📊 **Planner Module:** `[Link to Planner Image]`

---

## 🤝 Contribution
Contributions are what make the open-source community such an amazing place to learn, inspire, and create.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📧 Contact & Support
**Team Metamorph X**
- **Portfolio:** [https://metamorph-x.github.io/portfolio/](https://metamorph-x.github.io/portfolio/)
- **University:** Daffodil International University

---
*Developed with ❤️ for the DIU Community.*
