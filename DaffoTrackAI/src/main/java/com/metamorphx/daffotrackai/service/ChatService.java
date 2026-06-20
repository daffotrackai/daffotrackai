package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.ChatRequest;
import com.metamorphx.daffotrackai.dto.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public ChatResponse ask(ChatRequest request) {
        String message = request.message() == null ? "" : request.message().trim();
        String normalized = message.toLowerCase();

        String response;

        if (normalized.contains("waiver") || normalized.contains("scholarship") || normalized.contains("discount")) {
            response = "According to DIU tuition waiver clauses:\n1. You must enroll in at least 12 credits in the current semester.\n2. Your previous semester SGPA must be at least 3.00 with no F, I, or W grades.\n3. The discount brackets are: 3.80-3.89 = 40%, 3.90-3.99 = 60%, and 4.00 = 100% waiver.";
        } else if (normalized.contains("makeup") || normalized.contains("miss") || normalized.contains("sick")) {
            response = "If you miss a Midterm or Semester Final exam at DIU:\n1. Apply for a Makeup Exam within 3 working days.\n2. Collect written approval from your Head of Department with valid evidence.\n3. Submit the approved application with the required fee at the accounts desk.";
        } else if (normalized.contains("improve") || normalized.contains("retake") || normalized.contains("grade")) {
            response = "DIU Academic Regulation Section 4.12 explains Grade Improvement & Retakes:\n\u2022 Retake: Required if you secure an F grade.\n\u2022 Improvement: If you secure B- or lower, you may register for improvement and the higher grade counts toward CGPA.";
        } else if (normalized.contains("attendance") || normalized.contains("75%") || normalized.contains("attend")) {
            response = "DIU regulations require a minimum of 75% class attendance in each course to sit for the Semester Final Exams.";
        } else if (normalized.isBlank()) {
            response = "Please send a message so I can help you with DIU rules and academic guidance.";
        } else {
            response = "Thanks for your question! I am analyzing your inquiry about '" + message + "' using the DIU academic rules configured in DaffoTrack AI.";
        }

        return new ChatResponse("success", response);
    }
}