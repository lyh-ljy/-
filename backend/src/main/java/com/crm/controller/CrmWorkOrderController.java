package com.crm.controller;

import com.crm.common.PageResult;
import com.crm.common.Result;
import com.crm.dto.AssignDTO;
import com.crm.dto.ReplyDTO;
import com.crm.dto.ReturnDTO;
import com.crm.entity.CrmWorkOrder;
import com.crm.entity.CrmWorkOrderLog;
import com.crm.service.CrmWorkOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/work-orders")
public class CrmWorkOrderController {
    @Autowired
    private CrmWorkOrderService service;

    @GetMapping
    public Result<PageResult<CrmWorkOrder>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer orderType,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer priority,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Long customerId) {
        return Result.ok(service.page(page, pageSize, orderNo, title, orderType,
                status, priority, regionId, customerId));
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getById(@PathVariable Long id) {
        Map<String, Object> detail = service.getDetailById(id);
        if (detail == null) {
            CrmWorkOrder order = service.getById(id);
            return Result.ok("查询成功", Map.of("order", order));
        }
        return Result.ok("查询成功", Map.of("order", detail));
    }

    @PostMapping
    public Result<CrmWorkOrder> create(@RequestBody CrmWorkOrder order) {
        service.create(order);
        return Result.ok("创建成功", order);
    }

    @PutMapping("/{id}/assign")
    public Result<Void> assign(@PathVariable Long id, @Valid @RequestBody AssignDTO dto) {
        if (service.assign(id, dto.getAssignedTo())) {
            return Result.ok("指派成功", null);
        }
        return Result.fail(400, "工单状态不允许指派");
    }

    @PutMapping("/{id}/reply")
    public Result<Void> reply(@PathVariable Long id, @Valid @RequestBody ReplyDTO dto) {
        // 简化: 从请求获取当前用户信息
        if (service.reply(id, dto.getReplyContent(), 1L, "当前用户")) {
            return Result.ok("回单成功", null);
        }
        return Result.fail(400, "工单状态不允许回单(仅处理中状态可回单)");
    }

    @PutMapping("/{id}/return")
    public Result<Void> returnOrder(@PathVariable Long id, @Valid @RequestBody ReturnDTO dto) {
        if (service.returnOrder(id, dto.getReturnReason(), 1L, "当前用户")) {
            return Result.ok("退单成功", null);
        }
        return Result.fail(400, "工单状态不允许退单");
    }

    @PutMapping("/{id}/close")
    public Result<Void> close(@PathVariable Long id) {
        if (service.close(id, 1L, "当前用户")) {
            return Result.ok("关闭成功", null);
        }
        return Result.fail(400, "仅已回单状态可关闭工单");
    }

    @GetMapping("/{id}/logs")
    public Result<List<CrmWorkOrderLog>> logs(@PathVariable Long id) {
        return Result.ok(service.getLogs(id));
    }
}
