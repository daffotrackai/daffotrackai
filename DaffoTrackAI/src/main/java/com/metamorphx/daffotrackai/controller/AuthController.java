package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.AuthRequest;
import com.metamorphx.daffotrackai.dto.AuthResponse;
import com.metamorphx.daffotrackai.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/login")
    public ResponseEntity<String> help() {
        String html = """
                                                <!doctype html>
                                                <html lang="en">
                                                <head>
                                                    <meta charset="utf-8" />
                                                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                                                    <title>DaffoTrack AI Login API</title>
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
                                                        <h1>DaffoTrack AI Login API</h1>
                                                        <p class="muted">This endpoint accepts POST only for backend login/guest session creation.</p>
                                                        <p>Use:</p>
                                                        <pre>POST /api/auth/login
                Content-Type: application/json

                {
                    "email": "student@diu.edu.bd",
                    "password": "your-password",
                    "guest": false
                }</pre>
                                                    </div>
                                                </body>
                                                </html>
                                                """;

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}