package com.crm.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("crm_work_order")
public class CrmWorkOrder {
    @TableId(type = IdType.AUTO)
    private Long orderId;
    private String orderNo;
    private String title;
    private Integer orderType;
    private Long customerId;
    private Long businessId;
    private String description;
    private Integer priority;
    private Integer status;
    private String source;
    private String channel;
    private Long regionId;
    private Long assignedTo;
    private LocalDateTime assignedTime;
    private LocalDateTime expectedTime;
    private String replyContent;
    private LocalDateTime replyTime;
    private Long replyBy;
    private String returnReason;
    private LocalDateTime returnTime;
    private Long returnBy;
    private Integer satisfaction;
    private String feedback;
    private String attachment;
    private Long createBy;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    @TableLogic
    private Integer isDeleted;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getOrderType() { return orderType; }
    public void setOrderType(Integer orderType) { this.orderType = orderType; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getBusinessId() { return businessId; }
    public void setBusinessId(Long businessId) { this.businessId = businessId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getAssignedTime() { return assignedTime; }
    public void setAssignedTime(LocalDateTime assignedTime) { this.assignedTime = assignedTime; }
    public LocalDateTime getExpectedTime() { return expectedTime; }
    public void setExpectedTime(LocalDateTime expectedTime) { this.expectedTime = expectedTime; }
    public String getReplyContent() { return replyContent; }
    public void setReplyContent(String replyContent) { this.replyContent = replyContent; }
    public LocalDateTime getReplyTime() { return replyTime; }
    public void setReplyTime(LocalDateTime replyTime) { this.replyTime = replyTime; }
    public Long getReplyBy() { return replyBy; }
    public void setReplyBy(Long replyBy) { this.replyBy = replyBy; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public LocalDateTime getReturnTime() { return returnTime; }
    public void setReturnTime(LocalDateTime returnTime) { this.returnTime = returnTime; }
    public Long getReturnBy() { return returnBy; }
    public void setReturnBy(Long returnBy) { this.returnBy = returnBy; }
    public Integer getSatisfaction() { return satisfaction; }
    public void setSatisfaction(Integer satisfaction) { this.satisfaction = satisfaction; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getAttachment() { return attachment; }
    public void setAttachment(String attachment) { this.attachment = attachment; }
    public Long getCreateBy() { return createBy; }
    public void setCreateBy(Long createBy) { this.createBy = createBy; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    public Integer getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Integer isDeleted) { this.isDeleted = isDeleted; }
}
