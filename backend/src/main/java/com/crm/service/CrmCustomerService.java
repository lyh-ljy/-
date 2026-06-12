package com.crm.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.common.PageResult;
import com.crm.entity.CrmCustomer;
import com.crm.mapper.CrmCustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CrmCustomerService {
    @Autowired
    private CrmCustomerMapper mapper;

    public PageResult<CrmCustomer> page(int page, int pageSize,
            String customerName, String customerNo, Integer customerType,
            Integer customerLevel, Long regionId, Integer status) {
        LambdaQueryWrapper<CrmCustomer> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(customerName)) qw.like(CrmCustomer::getCustomerName, customerName);
        if (StringUtils.hasText(customerNo)) qw.like(CrmCustomer::getCustomerNo, customerNo);
        if (customerType != null) qw.eq(CrmCustomer::getCustomerType, customerType);
        if (customerLevel != null) qw.eq(CrmCustomer::getCustomerLevel, customerLevel);
        if (regionId != null) qw.eq(CrmCustomer::getRegionId, regionId);
        if (status != null) qw.eq(CrmCustomer::getStatus, status);
        qw.orderByDesc(CrmCustomer::getCreateTime);

        Page<CrmCustomer> p = new Page<>(page, pageSize);
        Page<CrmCustomer> result = mapper.selectPage(p, qw);
        return new PageResult<>(result.getRecords(), result.getTotal(), page, pageSize);
    }

    public CrmCustomer getById(Long id) {
        return mapper.selectById(id);
    }

    public boolean create(CrmCustomer customer) {
        if (customer.getCustomerNo() == null) {
            // 用时间戳毫秒保证唯一性
            String ts = String.valueOf(System.currentTimeMillis());
            customer.setCustomerNo("CUS" + ts.substring(ts.length() - 10));
        }
        customer.setCreateBy(1L);
        customer.setCreateTime(LocalDateTime.now());
        return mapper.insert(customer) > 0;
    }

    public boolean update(CrmCustomer customer) {
        return mapper.updateById(customer) > 0;
    }

    public boolean delete(Long id) {
        return mapper.deleteById(id) > 0;
    }
}
