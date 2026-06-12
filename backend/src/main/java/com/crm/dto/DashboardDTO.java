package com.crm.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private long customerCount;
    private long businessCount;
    private long workOrderCount;
    private long pendingCount;
    private long processingCount;
    private long repliedCount;
    private BigDecimal totalAmount;
    private List<Map<String, Object>> workOrderByStatus;

    public long getCustomerCount() { return customerCount; }
    public void setCustomerCount(long customerCount) { this.customerCount = customerCount; }
    public long getBusinessCount() { return businessCount; }
    public void setBusinessCount(long businessCount) { this.businessCount = businessCount; }
    public long getWorkOrderCount() { return workOrderCount; }
    public void setWorkOrderCount(long workOrderCount) { this.workOrderCount = workOrderCount; }
    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }
    public long getProcessingCount() { return processingCount; }
    public void setProcessingCount(long processingCount) { this.processingCount = processingCount; }
    public long getRepliedCount() { return repliedCount; }
    public void setRepliedCount(long repliedCount) { this.repliedCount = repliedCount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public List<Map<String, Object>> getWorkOrderByStatus() { return workOrderByStatus; }
    public void setWorkOrderByStatus(List<Map<String, Object>> workOrderByStatus) { this.workOrderByStatus = workOrderByStatus; }
}
