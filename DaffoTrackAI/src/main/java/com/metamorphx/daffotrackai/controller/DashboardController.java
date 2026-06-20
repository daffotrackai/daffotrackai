package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.DashboardSummaryResponse;
import com.metamorphx.daffotrackai.service.DashboardService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

        @GetMapping
        public ResponseEntity<String> help() {
                String html = """
                                <!doctype html>
                                <html lang="en">
                                <head>
                                    <meta charset="utf-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                                    <title>DaffoTrack AI Dashboard API</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; background:#0B1A30; color:#E5F9FF; margin:0; padding:40px; }
                                        .card { max-width:720px; margin:0 auto; background:#13253F; border:1px solid #1E3A5F; border-radius:16px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,.25); }
                                        pre { background:#0B1A30; color:#00E5FF; border-radius:10px; padding:16px; overflow:auto; }
                                        h1 { margin-top:0; }
                                        .muted { color:#94A3B8; }
                                    </style>
                                </head>
                                <body>
                                    <div class="card">
                                        <h1>DaffoTrack AI Dashboard API</h1>
                                        <p class="muted">Use the summary endpoint for the frontend dashboard data.</p>
                                        <p>Use:</p>
                                        <pre>GET /api/dashboard/summary</pre>
                                    </div>
                                </body>
                                </html>
                                """;

                return ResponseEntity.ok()
                                .contentType(MediaType.TEXT_HTML)
                                .body(html);
        }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.getSummary();
    }
}