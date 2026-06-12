package com.crm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface DashboardMapper {

    @Select("SELECT COUNT(*) FROM crm_customer WHERE is_deleted = 0")
    long countCustomers();

    @Select("SELECT COUNT(*) FROM crm_business WHERE is_deleted = 0")
    long countBusinesses();

    @Select("SELECT COUNT(*) FROM crm_work_order WHERE is_deleted = 0")
    long countWorkOrders();

    @Select("SELECT COUNT(*) FROM crm_work_order WHERE is_deleted = 0 AND status = 1")
    long countPending();

    @Select("SELECT COUNT(*) FROM crm_work_order WHERE is_deleted = 0 AND status = 2")
    long countProcessing();

    @Select("SELECT COUNT(*) FROM crm_work_order WHERE is_deleted = 0 AND status = 3")
    long countReplied();

    @Select("SELECT COALESCE(SUM(amount), 0) FROM crm_business WHERE is_deleted = 0")
    BigDecimal sumAmount();

    @Select("SELECT status AS name, COUNT(*) AS value FROM crm_work_order WHERE is_deleted = 0 GROUP BY status ORDER BY status")
    List<Map<String, Object>> workOrderByStatus();
}
