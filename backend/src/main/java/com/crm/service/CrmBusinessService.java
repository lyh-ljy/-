package com.crm.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.common.PageResult;
import com.crm.entity.CrmBusiness;
import com.crm.mapper.CrmBusinessMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CrmBusinessService {
    @Autowired
    private CrmBusinessMapper mapper;

    public PageResult<CrmBusiness> page(int page, int pageSize,
            String businessName, String businessNo, Integer businessType,
            Integer status, Long customerId) {
        LambdaQueryWrapper<CrmBusiness> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(businessName)) qw.like(CrmBusiness::getBusinessName, businessName);
        if (StringUtils.hasText(businessNo)) qw.like(CrmBusiness::getBusinessNo, businessNo);
        if (businessType != null) qw.eq(CrmBusiness::getBusinessType, businessType);
        if (status != null) qw.eq(CrmBusiness::getStatus, status);
        if (customerId != null) qw.eq(CrmBusiness::getCustomerId, customerId);
        qw.orderByDesc(CrmBusiness::getCreateTime);

        Page<CrmBusiness> p = new Page<>(page, pageSize);
        Page<CrmBusiness> result = mapper.selectPage(p, qw);
        return new PageResult<>(result.getRecords(), result.getTotal(), page, pageSize);
    }

    public CrmBusiness getById(Long id) {
        return mapper.selectById(id);
    }

    public boolean create(CrmBusiness biz) {
        if (biz.getBusinessNo() == null) {
            String ts = String.valueOf(System.currentTimeMillis());
            biz.setBusinessNo("BIZ" + ts.substring(ts.length() - 10));
        }
        biz.setCreateTime(LocalDateTime.now());
        return mapper.insert(biz) > 0;
    }

    public boolean update(CrmBusiness biz) {
        return mapper.updateById(biz) > 0;
    }

    public boolean delete(Long id) {
        return mapper.deleteById(id) > 0;
    }
}
