package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.ChatRequest;
import com.metamorphx.daffotrackai.dto.ChatResponse;
import com.metamorphx.daffotrackai.service.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/ask")
        public ResponseEntity<String> help() {
                String html = """
                                <!doctype html>
                                <html lang="en">
                                <head>
                                    <meta charset="utf-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                                    <title>DaffoTrack AI Chat API</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; background:#0B1A30; color:#E5F9FF; margin:0; padding:40px; }
                                        .card { max-width:720px; margin:0 auto; background:#13253F; border:1px solid #1E3A5F; border-radius:16px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,.25); }
                                        code, pre { background:#0B1A30; color:#00E5FF; border-radius:10px; }
                                        pre { padding:16px; overflow:auto; }
                                        h1 { margin-top:0; }
                                        .muted { color:#94A3B8; }
                                    </style>
                                </head>
                                <body>
                                    <div class="card">
                                        <h1>DaffoTrack AI Chat API</h1>
                                        <p class="muted">This endpoint accepts POST only for the real chat request.</p>
                                        <p>Use:</p>
                                        <pre>POST /api/chat/ask
Content-Type: application/json

{
    "studentId": "221-15-XXXX",
    "message": "your question"
}</pre>
                                    </div>
                                </body>
                                </html>
                                """;

                return ResponseEntity.ok()
                                .contentType(MediaType.TEXT_HTML)
                                .body(html);
    }

    @PostMapping("/ask")
    public ChatResponse getAiResponse(@RequestBody ChatRequest request) {
        return chatService.ask(request);
    }
}