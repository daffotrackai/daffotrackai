# Project Final Documentation: DaffoTrack AI
**Performance Optimizer for Smart Academic Planning**

---

## 1. Project Overview
**DaffoTrack AI** is a comprehensive academic companion platform designed for students of Daffodil International University (DIU). Developed by **Metamorph X**, the system provides intelligent tools for CGPA tracking, attendance forecasting, and instant AI-driven guidance on university policies. 

While initially proposed as an Android app, the project evolved into a sophisticated **Web-based Full-Stack Application** to ensure cross-platform accessibility and a premium desktop experience.

---

## 2. Problem Statement
Students at DIU often face challenges in:
*   Calculating specific marks needed in final exams to reach a target CGPA.
*   Understanding complex university policies (Waiver, Retake, Improvement, Makeup exams).
*   Tracking attendance across multiple courses to ensure eligibility for final exams.
*   Accessing personalized academic advising outside of faculty office hours.

---

## 3. System Architecture & Tech Stack
The project follows a modern client-server architecture:

### Frontend (daffotrack-web)
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS 4.0 (with semantic CSS variables)
*   **Icons:** Lucide React
*   **State Management:** React Context API (Theme, Toast, Auth)

### Backend (DaffoTrackAI)
*   **Framework:** Spring Boot 3.x (Java)
*   **Database:** MySQL (Local & Cloud)
*   **Security:** Custom Session-based Auth
*   **AI Integrations:** OpenAI (GPT-4o), Groq (Llama 3.3), and xAI (Grok)

---

## 4. Key Features & Implementation

### A. Smart Dashboard
A premium, glass-morphism styled dashboard that displays:
*   **Real-time CGPA:** Calculated directly from saved course records.
*   **Academic Progress:** Visual bars for credit completion (Target: 139 credits).
*   **Attendance Rate:** Average attendance across all registered courses.
*   **Direct Access:** Quick links to AI Chat, Planner, and Policy Center.

### B. AI Advisor Chat
A sophisticated chat interface featuring:
*   **Multi-Model Support:** Integrated with Grok, Groq, and ChatGPT.
*   **Local History:** Guest users have their chat history saved only in the browser's `localStorage` for privacy.
*   **Persistence:** Logged-in users have chats synced to the MySQL database.
*   **Rich Context:** Ability to upload and extract text from images, PDFs, and docs to provide context-aware answers.

### C. Specialized Course Tracker
*   **Theory (3.0 CR) Grading:** Supports Mid (25), Quiz (15), Class Test (15), Assignment (5), Attendance (7), Presentation (8), and Final (40).
*   **Lab (1.5 CR) Grading:** Supports Lab Performance (25), Lab Report (25), Attendance (10), and Final (40).
*   **Course Catalog:** A pre-seeded database of DIU courses for instant adding.

### D. Academic Planner
*   Scenario-based planning where students can input their desired CGPA to see the required SGPA for the next semester.

### E. Global Theme System
*   A full Light/Dark mode implementation with a persistent toggle in the Top Bar.

---

## 5. Technical Improvements over Proposal
1.  **Platform Shift:** Moved from Native Android to a Responsive Web App for broader DIU student reach.
2.  **Theme Support:** Added a comprehensive Light/Dark theme system not originally planned.
3.  **Advanced Error Handling:** Implemented a global Toast notification system for better user feedback.
4.  **Multi-AI Integration:** Added xAI (Grok) and Groq support to provide faster and cheaper AI alternatives to OpenAI.

---

## 6. Implementation Team (Metamorph X)
1.  **Kaium Ahmed (Project Lead):** System Architecture & Core Logic.
2.  **Md. Moktadur Rahman (Backend):** Java Spring Boot & MySQL Schema.
3.  **Md Tofayel Ahmed (AI):** Prompt Engineering & Multi-LLM API Bridge.
4.  **Shahriar Ahmed (UI/UX):** Responsive React design & Theme engine.
5.  **Md. Toybur Rahman (QA):** Data management & testing.

---

## 7. Conclusion
DaffoTrack AI successfully bridges the gap between academic administration and student needs through modern AI. The MVP is ready for deployment and provides a scalable foundation for future integration with DIU's official Smart Edu portal.

---
**Date:** June 22, 2026
**Version:** 4.2.0 (Final Assessment Ready)
