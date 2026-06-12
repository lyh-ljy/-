package com.crm.dto;

import jakarta.validation.constraints.NotBlank;

public class ReturnDTO {
    @NotBlank(message = "退单原因不能为空")
    private String returnReason;

    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
}
