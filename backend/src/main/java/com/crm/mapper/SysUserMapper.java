package com.crm.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.crm.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND is_deleted = 0")
    SysUser findByUsername(String username);
}
