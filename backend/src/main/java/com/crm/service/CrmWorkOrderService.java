package com.crm.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.common.PageResult;
import com.crm.entity.CrmWorkOrder;
import com.crm.entity.CrmWorkOrderLog;
import com.crm.mapper.CrmWorkOrderLogMapper;
import com.crm.mapper.CrmWorkOrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class CrmWorkOrderService {
    @Autowired
    private CrmWorkOrderMapper mapper;
    @Autowired
    private CrmWorkOrderLogMapper logMapper;

    public PageResult<CrmWorkOrder> page(int page, int pageSize,
            String orderNo, String title, Integer orderType,
            Integer status, Integer priority, Long regionId, Long customerId) {
        LambdaQueryWrapper<CrmWorkOrder> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(orderNo)) qw.like(CrmWorkOrder::getOrderNo, orderNo);
        if (StringUtils.hasText(title)) qw.like(CrmWorkOrder::getTitle, title);
        if (orderType != null) qw.eq(CrmWorkOrder::getOrderType, orderType);
        if (status != null) qw.eq(CrmWorkOrder::getStatus, status);
        if (priority != null) qw.eq(CrmWorkOrder::getPriority, priority);
        if (regionId != null) qw.eq(CrmWorkOrder::getRegionId, regionId);
        if (customerId != null) qw.eq(CrmWorkOrder::getCustomerId, customerId);
        qw.orderByDesc(CrmWorkOrder::getCreateTime);

        Page<CrmWorkOrder> p = new Page<>(page, pageSize);
        Page<CrmWorkOrder> result = mapper.selectPage(p, qw);
        return new PageResult<>(result.getRecords(), result.getTotal(), page, pageSize);
    }

    public Map<String, Object> getDetailById(Long id) {
        return mapper.selectDetailById(id);
    }

    public CrmWorkOrder getById(Long id) {
        return mapper.selectById(id);
    }

    @Transactional
    public boolean create(CrmWorkOrder order) {
        if (order.getOrderNo() == null) {
            String ts = String.valueOf(System.currentTimeMillis());
            order.setOrderNo("WO" + ts.substring(ts.length() - 10));
        }
        order.setCreateBy(1L); // 默认创建人为admin
        order.setStatus(1); // 待处理
        order.setCreateTime(LocalDateTime.now());
        boolean ok = mapper.insert(order) > 0;

        // 记录日志
        addLog(order.getOrderId(), "CREATE", 1L, "系统", null, 1, "创建工单");
        return ok;
    }

    @Transactional
    public boolean assign(Long orderId, Long assignedTo) {
        CrmWorkOrder order = mapper.selectById(orderId);
        if (order == null || order.getStatus() != 1) return false;

        order.setAssignedTo(assignedTo);
        order.setAssignedTime(LocalDateTime.now());
        order.setStatus(2); // 处理中
        mapper.updateById(order);

        addLog(orderId, "ASSIGN", 1L, "系统", 1, 2, "指派工单");
        return true;
    }

    @Transactional
    public boolean reply(Long orderId, String replyContent, Long replyBy, String replyName) {
        CrmWorkOrder order = mapper.selectById(orderId);
        if (order == null || order.getStatus() != 2) return false;

        order.setReplyContent(replyContent);
        order.setReplyTime(LocalDateTime.now());
        order.setReplyBy(replyBy);
        order.setStatus(3); // 已回单
        mapper.updateById(order);

        addLog(orderId, "REPLY", replyBy, replyName, 2, 3, "已回单: " + replyContent);
        return true;
    }

    @Transactional
    public boolean returnOrder(Long orderId, String returnReason, Long returnBy, String returnName) {
        CrmWorkOrder order = mapper.selectById(orderId);
        if (order == null || (order.getStatus() != 1 && order.getStatus() != 2)) return false;

        int oldStatus = order.getStatus();
        order.setReturnReason(returnReason);
        order.setReturnTime(LocalDateTime.now());
        order.setReturnBy(returnBy);
        order.setStatus(4); // 已退单
        mapper.updateById(order);

        addLog(orderId, "RETURN", returnBy, returnName, oldStatus, 4, "退单: " + returnReason);
        return true;
    }

    @Transactional
    public boolean close(Long orderId, Long operatorId, String operatorName) {
        CrmWorkOrder order = mapper.selectById(orderId);
        if (order == null || order.getStatus() != 3) return false;

        order.setStatus(5); // 已关闭
        mapper.updateById(order);

        addLog(orderId, "CLOSE", operatorId, operatorName, 3, 5, "关闭工单");
        return true;
    }

    public List<CrmWorkOrderLog> getLogs(Long orderId) {
        LambdaQueryWrapper<CrmWorkOrderLog> qw = new LambdaQueryWrapper<>();
        qw.eq(CrmWorkOrderLog::getOrderId, orderId);
        qw.orderByDesc(CrmWorkOrderLog::getCreateTime);
        return logMapper.selectList(qw);
    }

    private void addLog(Long orderId, String type, Long operatorId, String operatorName,
                        Integer fromStatus, Integer toStatus, String content) {
        CrmWorkOrderLog log = new CrmWorkOrderLog();
        log.setOrderId(orderId);
        log.setOperationType(type);
        log.setOperatorId(operatorId);
        log.setOperatorName(operatorName);
        log.setFromStatus(fromStatus);
        log.setToStatus(toStatus);
        log.setContent(content);
        log.setCreateTime(LocalDateTime.now());
        logMapper.insert(log);
    }
}
