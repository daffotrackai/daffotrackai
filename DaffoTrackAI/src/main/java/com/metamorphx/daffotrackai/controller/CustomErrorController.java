package com.metamorphx.daffotrackai.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping(value = "/error", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> handleErrorJson(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        if (status != null) {
            statusCode = Integer.parseInt(status.toString());
        }

        return ResponseEntity.status(statusCode).body(Map.of(
                "status", "error",
                "code", statusCode,
                "message", message != null ? message.toString() : "An unexpected error occurred",
                "path", request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI),
                "suggestion", "Visit https://metamorph-x.github.io/portfolio/ for support"
        ));
    }

    @RequestMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> handleErrorHtml(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = status != null ? Integer.parseInt(status.toString()) : 500;
        
        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>DaffoTrack AI - System Error</title>
                    <style>
                        body { font-family: sans-serif; background: #060e1a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { text-align: center; border: 1px solid rgba(45,212,191,0.2); padding: 40px; border-radius: 24px; background: #0a1525; box-shadow: 0 20px 50px rgba(0,0,0,0.5); max-width: 400px; }
                        h1 { font-size: 80px; margin: 0; color: rgba(45,212,191,0.2); }
                        h2 { font-size: 20px; margin: 10px 0; }
                        p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
                        .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2dd4bf; color: #000; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>%d</h1>
                        <h2>Entry Restricted</h2>
                        <p>The endpoint you are trying to reach does not exist or is restricted. Please use the official DaffoTrack AI interface.</p>
                        <a href="https://metamorph-x.github.io/portfolio/" class="btn">Metamorph X Portal</a>
                    </div>
                </body>
                </html>
                """.formatted(statusCode);
                
        return ResponseEntity.status(statusCode).body(html);
    }
}
