package com.crm.service;

import com.crm.dto.DashboardDTO;
import com.crm.mapper.DashboardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    @Autowired
    private DashboardMapper dashboardMapper;

    public DashboardDTO getStats() {
        DashboardDTO dto = new DashboardDTO();
        dto.setCustomerCount(dashboardMapper.countCustomers());
        dto.setBusinessCount(dashboardMapper.countBusinesses());
        dto.setWorkOrderCount(dashboardMapper.countWorkOrders());
        dto.setPendingCount(dashboardMapper.countPending());
        dto.setProcessingCount(dashboardMapper.countProcessing());
        dto.setRepliedCount(dashboardMapper.countReplied());
        dto.setTotalAmount(dashboardMapper.sumAmount());
        dto.setWorkOrderByStatus(dashboardMapper.workOrderByStatus());
        return dto;
    }
}
