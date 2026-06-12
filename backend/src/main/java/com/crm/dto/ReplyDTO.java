package com.crm.dto;

import jakarta.validation.constraints.NotBlank;

public class ReplyDTO {
    @NotBlank(message = "回单内容不能为空")
    private String replyContent;

    public String getReplyContent() { return replyContent; }
    public void setReplyContent(String replyContent) { this.replyContent = replyContent; }
}
