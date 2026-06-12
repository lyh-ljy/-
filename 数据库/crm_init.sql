-- ============================================================
-- CRM 客户关系管理系统 - 完整建库脚本 (MySQL 8.0+)
-- 包含: 9张表 + 2个视图 + 索引 + 初始化数据
-- ============================================================
DROP DATABASE IF EXISTS crm_db;
CREATE DATABASE IF NOT EXISTS crm_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE crm_db;

-- 1. 系统角色表
CREATE TABLE sys_role (
    role_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    role_name VARCHAR(64) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(64) NOT NULL COMMENT '角色编码',
    role_sort INT(11) NOT NULL DEFAULT 0 COMMENT '排序号',
    data_scope TINYINT(1) NOT NULL DEFAULT 1 COMMENT '数据权限',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id), UNIQUE KEY uk_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

-- 2. 部门表
CREATE TABLE sys_department (
    dept_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    parent_id BIGINT(20) DEFAULT 0,
    dept_name VARCHAR(64) NOT NULL,
    dept_code VARCHAR(64) DEFAULT NULL,
    leader_id BIGINT(20) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(128) DEFAULT NULL,
    sort_order INT(11) NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (dept_id), UNIQUE KEY uk_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 3. 区域表
CREATE TABLE sys_region (
    region_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    parent_id BIGINT(20) DEFAULT 0,
    region_name VARCHAR(64) NOT NULL,
    region_code VARCHAR(64) NOT NULL,
    region_level TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT(11) NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (region_id), UNIQUE KEY uk_region_code (region_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域表';

-- 4. 系统用户表
CREATE TABLE sys_user (
    user_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(128) NOT NULL,
    real_name VARCHAR(64) NOT NULL,
    nickname VARCHAR(64) DEFAULT NULL,
    gender TINYINT(1) DEFAULT 0,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(128) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    id_card VARCHAR(256) DEFAULT NULL,
    dept_id BIGINT(20) DEFAULT NULL,
    role_id BIGINT(20) NOT NULL,
    position VARCHAR(64) DEFAULT NULL,
    region_id BIGINT(20) DEFAULT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    last_login_time DATETIME DEFAULT NULL,
    last_login_ip VARCHAR(64) DEFAULT NULL,
    pwd_update_time DATETIME DEFAULT NULL,
    remark VARCHAR(500) DEFAULT NULL,
    create_by BIGINT(20) DEFAULT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT(20) DEFAULT NULL,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_user_username (username),
    UNIQUE KEY uk_user_phone (phone),
    KEY idx_user_dept (dept_id), KEY idx_user_role (role_id), KEY idx_user_status (status),
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) REFERENCES sys_department (dept_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES sys_role (role_id),
    CONSTRAINT fk_user_region FOREIGN KEY (region_id) REFERENCES sys_region (region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 5. 客户表
CREATE TABLE crm_customer (
    customer_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    customer_no VARCHAR(32) NOT NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_type TINYINT(1) NOT NULL DEFAULT 1,
    industry VARCHAR(64) DEFAULT NULL,
    customer_level TINYINT(1) NOT NULL DEFAULT 1,
    source VARCHAR(32) DEFAULT NULL,
    credit_rating VARCHAR(16) DEFAULT NULL,
    country VARCHAR(32) DEFAULT NULL,
    province VARCHAR(32) DEFAULT NULL,
    city VARCHAR(32) DEFAULT NULL,
    district VARCHAR(32) DEFAULT NULL,
    detail_address VARCHAR(255) DEFAULT NULL,
    region_id BIGINT(20) DEFAULT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    website VARCHAR(128) DEFAULT NULL,
    remark VARCHAR(1000) DEFAULT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    owner_id BIGINT(20) DEFAULT NULL,
    create_by BIGINT(20) DEFAULT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT(20) DEFAULT NULL,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (customer_id), UNIQUE KEY uk_customer_no (customer_no),
    KEY idx_customer_name (customer_name), KEY idx_customer_type (customer_type),
    KEY idx_customer_level (customer_level), KEY idx_customer_region (region_id),
    KEY idx_customer_owner (owner_id), KEY idx_customer_create_time (create_time),
    CONSTRAINT fk_customer_region FOREIGN KEY (region_id) REFERENCES sys_region (region_id),
    CONSTRAINT fk_customer_owner FOREIGN KEY (owner_id) REFERENCES sys_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表';

-- 6. 客户联系人表
CREATE TABLE crm_customer_contact (
    contact_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    customer_id BIGINT(20) NOT NULL,
    contact_name VARCHAR(64) NOT NULL,
    gender TINYINT(1) DEFAULT 0,
    position VARCHAR(64) DEFAULT NULL,
    department VARCHAR(64) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    mobile VARCHAR(20) DEFAULT NULL,
    email VARCHAR(128) DEFAULT NULL,
    wechat VARCHAR(64) DEFAULT NULL,
    qq VARCHAR(20) DEFAULT NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id), KEY idx_contact_customer (customer_id),
    CONSTRAINT fk_contact_customer FOREIGN KEY (customer_id) REFERENCES crm_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户联系人表';

-- 7. 业务表
CREATE TABLE crm_business (
    business_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    business_no VARCHAR(32) NOT NULL,
    business_name VARCHAR(128) NOT NULL,
    business_type TINYINT(1) NOT NULL DEFAULT 1,
    category VARCHAR(64) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    amount DECIMAL(18,2) DEFAULT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'CNY',
    start_time DATE DEFAULT NULL,
    end_time DATE DEFAULT NULL,
    contract_no VARCHAR(64) DEFAULT NULL,
    priority TINYINT(1) NOT NULL DEFAULT 2,
    status TINYINT(1) NOT NULL DEFAULT 1,
    progress INT(3) NOT NULL DEFAULT 0,
    owner_id BIGINT(20) DEFAULT NULL,
    customer_id BIGINT(20) DEFAULT NULL,
    remark VARCHAR(1000) DEFAULT NULL,
    create_by BIGINT(20) DEFAULT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT(20) DEFAULT NULL,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (business_id), UNIQUE KEY uk_business_no (business_no),
    KEY idx_business_type_status (business_type, status),
    KEY idx_business_owner (owner_id), KEY idx_business_customer (customer_id),
    KEY idx_business_create_time (create_time),
    CONSTRAINT fk_business_owner FOREIGN KEY (owner_id) REFERENCES sys_user (user_id),
    CONSTRAINT fk_business_customer FOREIGN KEY (customer_id) REFERENCES crm_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='业务表';

-- 8. 工单表
CREATE TABLE crm_work_order (
    order_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL,
    title VARCHAR(256) NOT NULL,
    order_type TINYINT(1) NOT NULL DEFAULT 1,
    customer_id BIGINT(20) NOT NULL,
    business_id BIGINT(20) NOT NULL,
    description TEXT DEFAULT NULL,
    priority TINYINT(1) NOT NULL DEFAULT 2,
    status TINYINT(1) NOT NULL DEFAULT 1,
    source VARCHAR(32) DEFAULT NULL,
    channel VARCHAR(32) DEFAULT NULL,
    region_id BIGINT(20) DEFAULT NULL,
    assigned_to BIGINT(20) DEFAULT NULL,
    assigned_time DATETIME DEFAULT NULL,
    expected_time DATETIME DEFAULT NULL,
    reply_content TEXT DEFAULT NULL,
    reply_time DATETIME DEFAULT NULL,
    reply_by BIGINT(20) DEFAULT NULL,
    return_reason VARCHAR(500) DEFAULT NULL,
    return_time DATETIME DEFAULT NULL,
    return_by BIGINT(20) DEFAULT NULL,
    satisfaction TINYINT(1) DEFAULT NULL,
    feedback VARCHAR(500) DEFAULT NULL,
    attachment VARCHAR(500) DEFAULT NULL,
    create_by BIGINT(20) NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (order_id), UNIQUE KEY uk_order_no (order_no),
    KEY idx_order_customer (customer_id), KEY idx_order_business (business_id),
    KEY idx_order_status (status), KEY idx_order_region (region_id),
    KEY idx_order_assigned (assigned_to), KEY idx_order_priority_status (priority, status),
    KEY idx_order_create_time (create_time),
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES crm_customer (customer_id),
    CONSTRAINT fk_order_business FOREIGN KEY (business_id) REFERENCES crm_business (business_id),
    CONSTRAINT fk_order_assigned FOREIGN KEY (assigned_to) REFERENCES sys_user (user_id),
    CONSTRAINT fk_order_region FOREIGN KEY (region_id) REFERENCES sys_region (region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工单表';

-- 9. 工单操作日志表
CREATE TABLE crm_work_order_log (
    log_id BIGINT(20) NOT NULL AUTO_INCREMENT,
    order_id BIGINT(20) NOT NULL,
    operation_type VARCHAR(32) NOT NULL,
    operator_id BIGINT(20) NOT NULL,
    operator_name VARCHAR(64) NOT NULL,
    from_status TINYINT(1) DEFAULT NULL,
    to_status TINYINT(1) DEFAULT NULL,
    content TEXT DEFAULT NULL,
    client_ip VARCHAR(64) DEFAULT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id), KEY idx_log_order (order_id), KEY idx_log_time (create_time),
    CONSTRAINT fk_log_order FOREIGN KEY (order_id) REFERENCES crm_work_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工单操作日志表';

-- 视图: 工单详情
CREATE VIEW v_work_order_detail AS
SELECT wo.*, c.customer_name, c.customer_type, c.customer_level,
    b.business_name, b.business_type, b.amount,
    u.real_name AS handler_name, r.region_name, uc.real_name AS creator_name
FROM crm_work_order wo
    LEFT JOIN crm_customer c ON wo.customer_id = c.customer_id
    LEFT JOIN crm_business b ON wo.business_id = b.business_id
    LEFT JOIN sys_user u ON wo.assigned_to = u.user_id
    LEFT JOIN sys_region r ON wo.region_id = r.region_id
    LEFT JOIN sys_user uc ON wo.create_by = uc.user_id
WHERE wo.is_deleted = 0;

-- 视图: 客户全景
CREATE VIEW v_customer_full_view AS
SELECT c.*, r.region_name, u.real_name AS owner_name,
    COUNT(DISTINCT wo.order_id) AS work_order_count,
    COUNT(DISTINCT b.business_id) AS business_count
FROM crm_customer c
    LEFT JOIN sys_region r ON c.region_id = r.region_id
    LEFT JOIN sys_user u ON c.owner_id = u.user_id
    LEFT JOIN crm_work_order wo ON c.customer_id = wo.customer_id AND wo.is_deleted = 0
    LEFT JOIN crm_business b ON c.customer_id = b.customer_id AND b.is_deleted = 0
WHERE c.is_deleted = 0
GROUP BY c.customer_id;

-- ============ 初始化数据 ============

INSERT INTO sys_role (role_name, role_code, role_sort, data_scope) VALUES
('超级管理员','SUPER_ADMIN',1,1),('管理员','ADMIN',2,2),('区域经理','REGION_MGR',3,3),('普通员工','STAFF',4,5),('只读用户','READONLY',5,5);

INSERT INTO sys_department (dept_id, parent_id, dept_name, dept_code, sort_order) VALUES
(1,0,'总公司','HQ',1),(2,1,'销售部','SALES',1),(3,1,'技术部','TECH',2),(4,1,'客服部','CS',3),(5,1,'市场部','MKT',4);

INSERT INTO sys_region (region_id, parent_id, region_name, region_code, region_level, sort_order) VALUES
(1,0,'全国','CN',1,1),(2,1,'华东区','CN-E',2,1),(3,1,'华南区','CN-S',2,2),(4,1,'华北区','CN-N',2,3),(5,1,'西南区','CN-SW',2,4),
(6,2,'上海市','CN-E-SH',3,1),(7,2,'浙江省','CN-E-ZJ',3,2),(8,3,'广东省','CN-S-GD',3,1),(9,4,'北京市','CN-N-BJ',3,1),(10,5,'四川省','CN-SW-SC',3,1);

INSERT INTO sys_user (username, password, real_name, gender, phone, email, dept_id, role_id, position, region_id, status) VALUES
('admin','admin123','系统管理员',1,'13800000001','admin@crm.com',1,1,'系统管理员',1,1),
('zhangsan','123456','张三',1,'13800000002','zhangsan@crm.com',2,4,'销售经理',2,1),
('lisi','123456','李四',1,'13800000003','lisi@crm.com',3,4,'技术工程师',3,1),
('wangwu','123456','王五',2,'13800000004','wangwu@crm.com',4,4,'客服专员',2,1),
('zhaoliu','123456','赵六',1,'13800000005','zhaoliu@crm.com',2,3,'华东区经理',2,1);

INSERT INTO crm_customer (customer_no, customer_name, customer_type, industry, customer_level, source, credit_rating, province, city, district, detail_address, region_id, website, remark, status, owner_id, create_by, create_time) VALUES
('CUS202606090001','华为技术有限公司',2,'IT/互联网',3,'自主开发','AAA','广东省','深圳市','龙岗区','坂田华为基地',8,'https://www.huawei.com','战略合作伙伴',1,3,1,'2026-05-01 10:00:00'),
('CUS202606090002','阿里巴巴集团',2,'IT/互联网',4,'转介绍','AAA','浙江省','杭州市','余杭区','文一西路969号',7,'https://www.alibaba.com','电商平台合作方',1,2,1,'2026-05-02 09:00:00'),
('CUS202606090003','中国工商银行',3,'金融',3,'线下活动','AAA','北京市','北京市','西城区','复兴门内大街55号',9,'https://www.icbc.com.cn','金融服务合作',1,4,1,'2026-05-03 14:00:00'),
('CUS202606090004','上海交通大学',3,'教育',2,'线上推广','AA','上海市','上海市','闵行区','东川路800号',6,'https://www.sjtu.edu.cn','产学研合作单位',1,2,1,'2026-05-04 11:00:00'),
('CUS202606090005','张三(个人客户)',1,'IT/互联网',1,'线上推广','A','上海市','上海市','浦东新区','张江路100号',6,NULL,'个人开发者客户',1,5,1,'2026-05-05 08:00:00'),
('CUS202606090006','成都生物制药有限公司',2,'医疗',2,'线下活动','AA','四川省','成都市','高新区','天府大道2000号',10,NULL,'生物医药领域客户',1,2,1,'2026-05-06 16:00:00'),
('CUS202606090007','京东集团',2,'零售',3,'转介绍','AA','北京市','北京市','大兴区','亦庄经济开发区',9,'https://www.jd.com','电商物流合作方',1,4,1,'2026-05-07 10:30:00'),
('CUS202606090008','腾讯科技有限公司',2,'IT/互联网',3,'自主开发','AAA','广东省','深圳市','南山区','科技园南路',8,'https://www.tencent.com','社交平台合作方',1,3,1,'2026-05-08 13:00:00');

INSERT INTO crm_business (business_no, business_name, business_type, category, description, amount, start_time, end_time, contract_no, priority, status, progress, owner_id, customer_id, create_by, create_time) VALUES
('BIZ202606090001','华为云服务器运维服务',2,'IT运维','服务器日常运维监控及故障处理',500000,'2026-01-01','2026-12-31','HT-2026-001',1,1,60,3,1,1,'2026-01-01 09:00:00'),
('BIZ202606090002','阿里巴巴电商平台对接',2,'系统集成','电商平台API对接及数据同步',300000,'2026-03-01','2026-09-30','HT-2026-002',2,1,40,2,2,1,'2026-03-01 10:00:00'),
('BIZ202606090003','工商银行安全咨询服务',3,'安全咨询','金融信息系统安全评估及咨询',200000,'2026-02-15','2026-08-15','HT-2026-003',1,2,100,4,3,1,'2026-02-15 08:30:00'),
('BIZ202606090004','上海交大科研合作项目',3,'产学研','AI技术在数据管理领域应用研究',150000,'2026-04-01','2027-03-31','HT-2026-004',2,1,25,2,4,1,'2026-04-01 14:00:00'),
('BIZ202606090005','张三个人网站开发',2,'网站开发','个人博客及作品展示网站开发',15000,'2026-05-01','2026-07-31','HT-2026-005',3,1,50,5,5,1,'2026-05-01 11:00:00'),
('BIZ202606090006','成都生物ERP系统实施',2,'ERP实施','企业资源管理系统部署及定制开发',800000,'2026-01-15','2026-10-15','HT-2026-006',1,1,70,2,6,1,'2026-01-15 09:00:00'),
('BIZ202606090007','京东仓储管理系统升级',2,'系统升级','WMS系统架构升级及性能优化',450000,'2026-06-01','2026-12-31','HT-2026-007',2,1,10,4,7,1,'2026-06-01 08:00:00'),
('BIZ202606090008','腾讯社交数据中台建设',2,'数据中台','社交平台数据中台架构设计与实施',1000000,'2026-04-01','2027-04-01','HT-2026-008',1,1,30,3,8,1,'2026-04-01 10:00:00');

INSERT INTO crm_work_order (order_no, title, order_type, customer_id, business_id, description, priority, status, source, channel, region_id, assigned_to, assigned_time, expected_time, reply_content, reply_time, reply_by, create_by, create_time) VALUES
('WO2026060900001','华为云服务器CPU告警处理',4,1,1,'华东节点CPU使用率超90%',1,2,'电话','客服热线',8,3,'2026-06-09 09:00:00','2026-06-10 18:00:00',NULL,NULL,NULL,1,'2026-06-09 08:30:00'),
('WO2026060900002','阿里巴巴订单数据同步异常',4,2,2,'增量数据同步延迟超2小时',2,2,'邮件','技术支持',7,2,'2026-06-09 10:00:00','2026-06-11 18:00:00',NULL,NULL,NULL,2,'2026-06-09 09:20:00'),
('WO2026060900003','工行安全评估报告咨询',1,3,3,'客户咨询渗透测试结果细节',3,3,'在线','在线客服',9,4,'2026-06-08 14:00:00','2026-06-09 17:00:00','已向客户详细说明，客户满意','2026-06-09 15:00:00',4,4,'2026-06-08 13:45:00'),
('WO2026060900004','交大科研项目需求变更',3,4,4,'新增NLP模块需求评估',2,1,'邮件','项目管理',6,NULL,NULL,'2026-06-20 18:00:00',NULL,NULL,NULL,2,'2026-06-08 16:10:00'),
('WO2026060900005','个人网站备案咨询',1,5,5,'ICP备案流程及材料咨询',4,1,'在线','在线客服',6,NULL,NULL,'2026-06-12 18:00:00',NULL,NULL,NULL,5,'2026-06-09 07:50:00'),
('WO2026060900006','成都生物ERP模块上线支持',3,6,6,'财务模块上线现场支持',2,2,'电话','项目实施',10,2,'2026-06-09 08:00:00','2026-06-15 18:00:00',NULL,NULL,NULL,2,'2026-06-09 07:30:00'),
('WO2026060900007','京东WMS系统性能投诉',2,7,7,'系统升级后页面变慢',1,1,'电话','投诉热线',9,NULL,NULL,'2026-06-10 18:00:00',NULL,NULL,NULL,4,'2026-06-09 10:15:00'),
('WO2026060900008','腾讯数据中台架构评审',3,8,8,'技术方案评审会议',3,3,'邮件','项目管理',8,3,'2026-06-05 16:00:00','2026-06-08 17:00:00','架构评审通过，出具评审报告','2026-06-08 16:30:00',3,3,'2026-06-05 15:40:00');

INSERT INTO crm_work_order_log (order_id, operation_type, operator_id, operator_name, from_status, to_status, content, create_time) VALUES
(1,'CREATE',1,'系统管理员',NULL,1,'创建工单','2026-06-09 08:30:00'),
(1,'ASSIGN',1,'系统管理员',1,2,'指派给李四处理','2026-06-09 09:00:00'),
(3,'CREATE',4,'王五',NULL,1,'创建工单','2026-06-08 13:45:00'),
(3,'ASSIGN',4,'王五',1,2,'指派给王五处理','2026-06-08 14:00:00'),
(3,'REPLY',4,'王五',2,3,'已回单:向客户说明评估报告内容','2026-06-09 15:00:00'),
(8,'CREATE',3,'李四',NULL,1,'创建工单','2026-06-05 15:40:00'),
(8,'ASSIGN',3,'李四',1,2,'指派给李四处理','2026-06-05 16:00:00'),
(8,'REPLY',3,'李四',2,3,'已回单:架构评审通过','2026-06-08 16:30:00');
