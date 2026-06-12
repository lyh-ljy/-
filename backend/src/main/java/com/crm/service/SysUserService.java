package com.crm.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.crm.common.PageResult;
import com.crm.entity.SysUser;
import com.crm.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SysUserService {
    @Autowired
    private SysUserMapper sysUserMapper;

    public PageResult<SysUser> page(int page, int pageSize, String username, String realName, String phone, Integer status) {
        LambdaQueryWrapper<SysUser> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(username)) qw.like(SysUser::getUsername, username);
        if (StringUtils.hasText(realName)) qw.like(SysUser::getRealName, realName);
        if (StringUtils.hasText(phone)) qw.like(SysUser::getPhone, phone);
        if (status != null) qw.eq(SysUser::getStatus, status);
        qw.orderByDesc(SysUser::getCreateTime);

        Page<SysUser> p = new Page<>(page, pageSize);
        Page<SysUser> result = sysUserMapper.selectPage(p, qw);
        return new PageResult<>(result.getRecords(), result.getTotal(), page, pageSize);
    }

    public SysUser getById(Long id) {
        return sysUserMapper.selectById(id);
    }

    public SysUser getByUsername(String username) {
        return sysUserMapper.findByUsername(username);
    }

    public boolean create(SysUser user) {
        // 空字符串转 null，避免唯一约束冲突
        if (user.getPhone() != null && user.getPhone().isEmpty()) user.setPhone(null);
        if (user.getEmail() != null && user.getEmail().isEmpty()) user.setEmail(null);
        user.setCreateTime(java.time.LocalDateTime.now());
        return sysUserMapper.insert(user) > 0;
    }

    public boolean update(SysUser user) {
        return sysUserMapper.updateById(user) > 0;
    }

    public boolean delete(Long id) {
        return sysUserMapper.deleteById(id) > 0; // 逻辑删除
    }

    public SysUser login(String username, String password) {
        SysUser user = sysUserMapper.findByUsername(username);
        if (user == null || !password.equals(user.getPassword())) return null;
        if (user.getStatus() == 0) return null;
        return user;
    }
}
