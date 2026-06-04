DROP DATABASE IF EXISTS crm_db;
CREATE DATABASE IF NOT EXISTS crm_db DEFAULT CHARSET utf8mb4;
USE crm_db;

CREATE TABLE sys_user
(
    user_id     INT AUTO_INCREMENT COMMENT '用户ID',
    username    VARCHAR(50) NOT NULL COMMENT '用户名',
    password    VARCHAR(100) NOT NULL COMMENT '密码',
    real_name   VARCHAR(50) NULL COMMENT '真实姓名',
    phone       VARCHAR(20) NULL COMMENT '联系电话',
    role        VARCHAR(20) DEFAULT '普通用户' NULL COMMENT '角色',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_username (username)
);

CREATE TABLE customer
(
    customer_id   INT AUTO_INCREMENT COMMENT '客户ID',
    customer_name VARCHAR(100) NOT NULL COMMENT '客户名称',
    contact_phone VARCHAR(20) NULL COMMENT '联系电话',
    contact_email VARCHAR(100) NULL COMMENT '邮箱',
    address       VARCHAR(200) NULL COMMENT '地址',
    region        VARCHAR(50) NULL COMMENT '所属区域',
    create_time   DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
    PRIMARY KEY (customer_id)
);

CREATE TABLE business
(
    business_id INT AUTO_INCREMENT COMMENT '业务ID',
    business_name VARCHAR(100) NOT NULL COMMENT '业务名称',
    business_type VARCHAR(50) NULL COMMENT '业务类型',
    description TEXT NULL COMMENT '业务描述',
    price DECIMAL(10,2) NULL COMMENT '业务价格',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
    PRIMARY KEY (business_id)
);

CREATE TABLE work_order
(
    order_id     INT AUTO_INCREMENT COMMENT '工单ID',
    customer_id  INT NOT NULL COMMENT '客户ID',
    business_id  INT NOT NULL COMMENT '业务ID',
    order_status VARCHAR(20) DEFAULT '创建' NULL COMMENT '工单状态',
    create_time  DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
    complete_time DATETIME NULL COMMENT '完成时间',
    operator_id  INT NULL COMMENT '处理人ID',
    PRIMARY KEY (order_id),
    CONSTRAINT fk_wo_cus FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    CONSTRAINT fk_wo_bus FOREIGN KEY (business_id) REFERENCES business(business_id),
    CONSTRAINT fk_wo_user FOREIGN KEY (operator_id) REFERENCES sys_user(user_id)
);