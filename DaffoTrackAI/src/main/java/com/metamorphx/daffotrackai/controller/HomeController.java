package com.metamorphx.daffotrackai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
public class HomeController {

    @GetMapping("/")
        public ResponseEntity<String> welcome() {
                String html = """
                                <!doctype html>
                                <html lang="en">
                                <head>
                                    <meta charset="utf-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                                    <title>DaffoTrack AI Backend</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; background:#0B1A30; color:#E5F9FF; margin:0; min-height:100vh; display:grid; place-items:center; }
                                        .card { max-width:760px; margin:24px; background:#13253F; border:1px solid #1E3A5F; border-radius:20px; padding:32px; box-shadow:0 20px 60px rgba(0,0,0,.25); text-align:center; }
                                        h1 { margin-top:0; }
                                        p { color:#94A3B8; }
                                        a { color:#00E5FF; text-decoration:none; }
                                    </style>
                                </head>
                                <body>
                                    <div class="card">
                                        <h1>Welcome to DaffoTrack AI Backend Server</h1>
                                        <p>System is running perfectly.</p>
                                        <p>Use the frontend app or open the API help pages at <a href="/api/chat/ask">/api/chat/ask</a> and <a href="/api/auth/login">/api/auth/login</a>.</p>
                                    </div>
                                </body>
                                </html>
                                """;

                return ResponseEntity.ok()
                                .contentType(MediaType.TEXT_HTML)
                                .body(html);
    }
}