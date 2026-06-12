package com.crm.dto;

import jakarta.validation.constraints.NotNull;

public class AssignDTO {
    @NotNull(message = "请指定处理人")
    private Long assignedTo;

    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
}
