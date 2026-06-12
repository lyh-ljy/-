package com.crm.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("crm_work_order_log")
public class CrmWorkOrderLog {
    @TableId(type = IdType.AUTO)
    private Long logId;
    private Long orderId;
    private String operationType;
    private Long operatorId;
    private String operatorName;
    private Integer fromStatus;
    private Integer toStatus;
    private String content;
    private String clientIp;
    private LocalDateTime createTime;

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }
    public Long getOperatorId() { return operatorId; }
    public void setOperatorId(Long operatorId) { this.operatorId = operatorId; }
    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
    public Integer getFromStatus() { return fromStatus; }
    public void setFromStatus(Integer fromStatus) { this.fromStatus = fromStatus; }
    public Integer getToStatus() { return toStatus; }
    public void setToStatus(Integer toStatus) { this.toStatus = toStatus; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
