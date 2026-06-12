package com.crm.controller;

import com.crm.common.PageResult;
import com.crm.common.Result;
import com.crm.entity.CrmBusiness;
import com.crm.service.CrmBusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/businesses")
public class CrmBusinessController {
    @Autowired
    private CrmBusinessService service;

    @GetMapping
    public Result<PageResult<CrmBusiness>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String businessName,
            @RequestParam(required = false) String businessNo,
            @RequestParam(required = false) Integer businessType,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long customerId) {
        return Result.ok(service.page(page, pageSize, businessName, businessNo,
                businessType, status, customerId));
    }

    @GetMapping("/{id}")
    public Result<CrmBusiness> getById(@PathVariable Long id) {
        return Result.ok(service.getById(id));
    }

    @PostMapping
    public Result<CrmBusiness> create(@RequestBody CrmBusiness biz) {
        service.create(biz);
        return Result.ok("新增成功", biz);
    }

    @PutMapping("/{id}")
    public Result<CrmBusiness> update(@PathVariable Long id, @RequestBody CrmBusiness biz) {
        biz.setBusinessId(id);
        service.update(biz);
        return Result.ok("修改成功", biz);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return Result.ok("删除成功", null);
    }
}
