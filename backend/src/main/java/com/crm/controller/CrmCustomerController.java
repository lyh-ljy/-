package com.crm.controller;

import com.crm.common.PageResult;
import com.crm.common.Result;
import com.crm.entity.CrmCustomer;
import com.crm.service.CrmCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
public class CrmCustomerController {
    @Autowired
    private CrmCustomerService service;

    @GetMapping
    public Result<PageResult<CrmCustomer>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String customerNo,
            @RequestParam(required = false) Integer customerType,
            @RequestParam(required = false) Integer customerLevel,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Integer status) {
        return Result.ok(service.page(page, pageSize, customerName, customerNo,
                customerType, customerLevel, regionId, status));
    }

    @GetMapping("/{id}")
    public Result<CrmCustomer> getById(@PathVariable Long id) {
        return Result.ok(service.getById(id));
    }

    @PostMapping
    public Result<CrmCustomer> create(@RequestBody CrmCustomer customer) {
        service.create(customer);
        return Result.ok("新增成功", customer);
    }

    @PutMapping("/{id}")
    public Result<CrmCustomer> update(@PathVariable Long id, @RequestBody CrmCustomer customer) {
        customer.setCustomerId(id);
        service.update(customer);
        return Result.ok("修改成功", customer);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return Result.ok("删除成功", null);
    }
}
