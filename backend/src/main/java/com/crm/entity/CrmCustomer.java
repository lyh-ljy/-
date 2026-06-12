package com.crm.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@TableName("crm_customer")
public class CrmCustomer {
    @TableId(type = IdType.AUTO)
    private Long customerId;
    private String customerNo;
    private String customerName;
    private Integer customerType;
    private String industry;
    private Integer customerLevel;
    private String source;
    private String creditRating;
    private String country;
    private String province;
    private String city;
    private String district;
    private String detailAddress;
    private Long regionId;
    private String logo;
    private String website;
    private String remark;
    private Integer status;
    private Long ownerId;
    private Long createBy;
    private LocalDateTime createTime;
    private Long updateBy;
    private LocalDateTime updateTime;
    @TableLogic
    private Integer isDeleted;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerNo() { return customerNo; }
    public void setCustomerNo(String customerNo) { this.customerNo = customerNo; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Integer getCustomerType() { return customerType; }
    public void setCustomerType(Integer customerType) { this.customerType = customerType; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public Integer getCustomerLevel() { return customerLevel; }
    public void setCustomerLevel(Integer customerLevel) { this.customerLevel = customerLevel; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getCreditRating() { return creditRating; }
    public void setCreditRating(String creditRating) { this.creditRating = creditRating; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getDetailAddress() { return detailAddress; }
    public void setDetailAddress(String detailAddress) { this.detailAddress = detailAddress; }
    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public Long getCreateBy() { return createBy; }
    public void setCreateBy(Long createBy) { this.createBy = createBy; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public Long getUpdateBy() { return updateBy; }
    public void setUpdateBy(Long updateBy) { this.updateBy = updateBy; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    public Integer getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Integer isDeleted) { this.isDeleted = isDeleted; }
}
