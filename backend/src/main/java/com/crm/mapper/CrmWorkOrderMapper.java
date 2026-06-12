package com.crm.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.crm.entity.CrmWorkOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface CrmWorkOrderMapper extends BaseMapper<CrmWorkOrder> {

    @Select("SELECT * FROM v_work_order_detail WHERE order_id = #{orderId}")
    Map<String, Object> selectDetailById(Long orderId);

    @Select("SELECT * FROM v_work_order_detail ${ew.customSqlSegment}")
    List<Map<String, Object>> selectDetailList(String whereSql);
}
