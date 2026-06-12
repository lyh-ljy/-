package com.crm.controller;

import com.crm.common.Result;
import com.crm.dto.LoginDTO;
import com.crm.entity.SysUser;
import com.crm.service.SysUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private SysUserService sysUserService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
        SysUser user = sysUserService.login(dto.getUsername(), dto.getPassword());
        if (user == null) {
            return Result.fail(401, "用户名或密码错误");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("token", "token-" + user.getUserId());
        data.put("userInfo", user);
        return Result.ok("登录成功", data);
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.ok("已登出", null);
    }
}
