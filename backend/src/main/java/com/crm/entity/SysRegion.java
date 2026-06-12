package com.crm.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("sys_region")
public class SysRegion {
    @TableId(type = IdType.AUTO)
    private Long regionId;
    private Long parentId;
    private String regionName;
    private String regionCode;
    private Integer regionLevel;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createTime;

    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }
    public String getRegionCode() { return regionCode; }
    public void setRegionCode(String regionCode) { this.regionCode = regionCode; }
    public Integer getRegionLevel() { return regionLevel; }
    public void setRegionLevel(Integer regionLevel) { this.regionLevel = regionLevel; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
