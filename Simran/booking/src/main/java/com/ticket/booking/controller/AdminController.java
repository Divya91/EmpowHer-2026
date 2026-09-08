package com.ticket.booking.controller;

import com.ticket.booking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {
        return adminService.getDashboardStats();
    }
}