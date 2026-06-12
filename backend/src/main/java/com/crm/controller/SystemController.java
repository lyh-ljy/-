package com.crm.controller;

import com.crm.common.Result;
import com.crm.entity.SysDepartment;
import com.crm.entity.SysRegion;
import com.crm.entity.SysRole;
import com.crm.mapper.SysDepartmentMapper;
import com.crm.mapper.SysRegionMapper;
import com.crm.mapper.SysRoleMapper;
import com.crm.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class SystemController {
    @Autowired private SysRegionMapper regionMapper;
    @Autowired private SysDepartmentMapper deptMapper;
    @Autowired private SysRoleMapper roleMapper;
    @Autowired private SysUserMapper userMapper;

    @GetMapping("/regions")
    public Result<List<SysRegion>> regions() {
        return Result.ok(regionMapper.selectList(null));
    }

    @GetMapping("/departments")
    public Result<List<SysDepartment>> departments() {
        return Result.ok(deptMapper.selectList(null));
    }

    @GetMapping("/roles")
    public Result<List<SysRole>> roles() {
        return Result.ok(roleMapper.selectList(null));
    }

    @GetMapping("/users/simple")
    public Result<?> usersSimple() {
        return Result.ok(userMapper.selectList(null).stream().map(u -> {
            var map = new java.util.HashMap<String, Object>();
            map.put("user_id", u.getUserId());
            map.put("real_name", u.getRealName());
            map.put("username", u.getUsername());
            return map;
        }).toList());
    }
}
