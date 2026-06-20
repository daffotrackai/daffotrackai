package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.DashboardSummaryResponse;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    public DashboardSummaryResponse getSummary() {
        return new DashboardSummaryResponse(
                "success",
                "Guest DIU Student",
                "221-15-XXXX",
                "Software Engineering",
                3.88,
                78.0,
                139.0,
                86.2,
                0,
                "40% Waiver",
                "DIU API SYNC ACTIVE"
        );
    }
}