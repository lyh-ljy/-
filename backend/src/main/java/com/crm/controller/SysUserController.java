package com.crm.controller;

import com.crm.common.PageResult;
import com.crm.common.Result;
import com.crm.entity.SysUser;
import com.crm.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class SysUserController {
    @Autowired
    private SysUserService sysUserService;

    @GetMapping
    public Result<PageResult<SysUser>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String realName,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Integer status) {
        return Result.ok(sysUserService.page(page, pageSize, username, realName, phone, status));
    }

    @GetMapping("/{id}")
    public Result<SysUser> getById(@PathVariable Long id) {
        SysUser user = sysUserService.getById(id);
        if (user != null) user.setPassword(null);
        return Result.ok(user);
    }

    @PostMapping
    public Result<SysUser> create(@RequestBody SysUser user) {
        if (sysUserService.getByUsername(user.getUsername()) != null) {
            return Result.fail(409, "用户名已存在");
        }
        sysUserService.create(user);
        user.setPassword(null);
        return Result.ok("新增成功", user);
    }

    @PutMapping("/{id}")
    public Result<SysUser> update(@PathVariable Long id, @RequestBody SysUser user) {
        user.setUserId(id);
        user.setPassword(null); // 不修改密码
        sysUserService.update(user);
        return Result.ok("修改成功", user);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        sysUserService.delete(id);
        return Result.ok("删除成功", null);
    }
}
