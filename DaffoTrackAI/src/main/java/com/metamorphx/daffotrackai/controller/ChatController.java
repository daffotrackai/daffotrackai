package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.ChatRequest;
import com.metamorphx.daffotrackai.dto.ChatResponse;
import com.metamorphx.daffotrackai.dto.ChatConversationRequest;
import com.metamorphx.daffotrackai.dto.ChatConversationResponse;
import com.metamorphx.daffotrackai.dto.FileExtractionResponse;
import com.metamorphx.daffotrackai.service.ChatHistoryService;
import com.metamorphx.daffotrackai.service.ChatService;
import com.metamorphx.daffotrackai.service.FileExtractionService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final ChatHistoryService chatHistoryService;
    private final FileExtractionService fileExtractionService;

    public ChatController(ChatService chatService, ChatHistoryService chatHistoryService, FileExtractionService fileExtractionService) {
        this.chatService = chatService;
        this.chatHistoryService = chatHistoryService;
        this.fileExtractionService = fileExtractionService;
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

    @PostMapping(value = "/files/extract", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileExtractionResponse extractFile(@RequestParam("file") MultipartFile file) {
        return fileExtractionService.extract(file);
    }

    @GetMapping("/conversations")
    public List<ChatConversationResponse> conversations(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String studentId
    ) {
        return chatHistoryService.listConversations(userId, studentId);
    }

    @PostMapping("/conversations")
    public ChatConversationResponse createConversation(@RequestBody ChatConversationRequest request) {
        return chatHistoryService.createConversation(request);
    }

    @GetMapping("/conversations/{id}")
    public ChatConversationResponse getConversation(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String studentId
    ) {
        return chatHistoryService.getConversation(id, userId, studentId);
    }

    @PutMapping("/conversations/{id}")
    public ChatConversationResponse updateConversation(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String studentId,
            @RequestBody ChatConversationRequest request
    ) {
        return chatHistoryService.updateConversation(id, userId, studentId, request);
    }

    @DeleteMapping("/conversations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteConversation(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String studentId
    ) {
        chatHistoryService.deleteConversation(id, userId, studentId);
    }
}
