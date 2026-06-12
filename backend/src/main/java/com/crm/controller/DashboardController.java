package com.crm.controller;

import com.crm.common.Result;
import com.crm.dto.DashboardDTO;
import com.crm.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public Result<DashboardDTO> stats() {
        return Result.ok(dashboardService.getStats());
    }
}
