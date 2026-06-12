# CRM 客户关系管理系统

> **Customer Relationship Management System**  
> 以客户关系为重点，整合客户管理、业务管理、工单管理、人员管理四大模块

---

## 📋 项目简介

本 CRM 系统针对客户管理、业务管理、工单管理进行整合，以客户关系为重点，通过开展系统化的客户研究，优化企业组织体系和业务流程，提高客户满意度和忠诚度，从而提高企业效率和利润水平。

### 核心功能

| 模块 | 功能 |
|------|------|
| **客户管理** | 新增、修改、删除（逻辑删除）、多条件查询、Excel 导入导出 |
| **业务管理** | 录入、修改、删除、查询、进度跟踪、Excel 导入导出、关联客户 |
| **工单管理** | 创建（关联客户+业务）、回单、退单、指派、关闭、区域内查询、流转日志 |
| **人员管理** | 新增、修改、删除（禁用）、角色分配、部门管理 |

---

## 🏗️ 技术架构

```
┌───────────────────────────────────────────┐
│          前端展示层  Vue.js 3              │
│      Element Plus + ECharts + Axios       │
├───────────────────────────────────────────┤
│        RESTful API  /api/v1/*             │
├───────────────────────────────────────────┤
│       后端服务层  Spring Boot 3.2          │
│   MyBatis-Plus + MySQL + CORS            │
├───────────────────────────────────────────┤
│       数据存储层  MySQL 8.0               │
│      9 张业务表 + 2 个视图               │
└───────────────────────────────────────────┘
```

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Composition API |
| UI 组件 | Element Plus 2.7 |
| 状态管理 | Pinia 2.1 |
| 路由 | Vue Router 4.3 |
| 图表 | ECharts 5.5 |
| 构建工具 | Vite 5.4 |
| 后端框架 | Spring Boot 3.2 |
| ORM | MyBatis-Plus 3.5 |
| 数据库 | MySQL 8.0 |
| Java | JDK 17 |

---

## 📁 项目结构

```
D:\CRM-System\
├── README.md
├── database/
│   └── crm_init.sql                 # 完整建库脚本 (9表+2视图+初始化数据)
├── backend/                         # Spring Boot 后端
│   ├── pom.xml
│   └── src/main/java/com/crm/
│       ├── CrmBackendApplication.java
│       ├── common/                  # Result, PageResult
│       ├── config/                  # CORS 跨域配置
│       ├── entity/                  # 实体类 (10个)
│       ├── dto/                     # 数据传输对象 (5个)
│       ├── mapper/                  # MyBatis-Plus Mapper (9个)
│       ├── service/                 # 业务逻辑层 (5个)
│       └── controller/              # REST 控制器 (7个)
├── frontend/crm-frontend/           # Vue 3 前端
│   ├── src/views/customer/          # 客户管理页面
│   ├── src/views/business/          # 业务管理页面
│   ├── src/views/workorder/         # 工单管理页面
│   ├── src/views/user/              # 人员管理页面
│   ├── src/views/system/            # 系统管理页面
│   ├── src/views/Login.vue          # 登录页
│   └── src/views/Dashboard.vue      # 仪表盘
└── log/                             # 日志目录
```

---

## 🚀 快速开始

### 环境要求

| 软件 | 版本 |
|------|------|
| JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

### 1. 初始化数据库

```bash
mysql -u root -p < D:\CRM-System\database\crm_init.sql
```

脚本自动创建 `crm_db` 数据库，包含 9 张表、2 个视图和初始化数据。

### 2. 启动后端

```bash
cd D:\CRM-System\backend
mvn spring-boot:run
```

后端运行在 `http://localhost:8080`，接口前缀 `/api/v1/`。

**修改数据库密码：** 编辑 `src/main/resources/application.properties`，修改 `spring.datasource.password` 为你的 MySQL 密码。

### 3. 启动前端

```bash
cd D:\CRM-System\frontend\crm-frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`，开发模式下 Vite 自动代理 `/api` 请求到后端。

> 💡 **前端可独立运行**：前端内置 localStorage 模拟数据层，即使不启动后端也能完整演示所有功能。

### 4. 登录系统

- 地址：`http://localhost:5173`
- 账号：`admin`
- 密码：`admin123`

---

## 📡 API 接口

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/login` | 登录 |
| POST | `/api/v1/auth/logout` | 登出 |

### 客户管理 `/api/v1/customers`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `?page=1&pageSize=10&customerName=xxx` | 分页查询 |
| GET | `/{id}` | 客户详情 |
| POST | `/` | 新增 |
| PUT | `/{id}` | 修改 |
| DELETE | `/{id}` | 逻辑删除 |

### 业务管理 `/api/v1/businesses`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `?page=1&pageSize=10&status=1` | 分页查询 |
| GET | `/{id}` | 业务详情 |
| POST | `/` | 新增 |
| PUT | `/{id}` | 修改 |
| DELETE | `/{id}` | 逻辑删除 |

### 工单管理 `/api/v1/work-orders`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `?regionId=2&status=1` | 分页查询（支持区域筛选） |
| GET | `/{id}` | 工单详情（含客户+业务信息） |
| POST | `/` | 创建工单（关联客户+业务） |
| PUT | `/{id}/assign` | 指派处理人 |
| PUT | `/{id}/reply` | 回单 |
| PUT | `/{id}/return` | 退单 |
| PUT | `/{id}/close` | 关闭工单 |
| GET | `/{id}/logs` | 流转日志 |

### 人员管理 `/api/v1/users`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `?page=1&pageSize=10` | 分页查询 |
| GET | `/{id}` | 人员详情 |
| POST | `/` | 新增 |
| PUT | `/{id}` | 修改 |
| DELETE | `/{id}` | 禁用/删除 |

### 系统接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/regions` | 区域列表 |
| GET | `/api/v1/departments` | 部门列表 |
| GET | `/api/v1/roles` | 角色列表 |
| GET | `/api/v1/users/simple` | 用户简表 |
| GET | `/api/v1/dashboard/stats` | 仪表盘统计 |

---

## 🔄 工单状态流转

```
待处理(1) ──指派──→ 处理中(2) ──回单──→ 已回单(3) ──关闭──→ 已关闭(5)
    │                  │
    └──退单──→ 已退单(4) ←──退单──┘
```

---

## 🗄️ 数据库表

| 表名 | 说明 |
|------|------|
| `sys_user` | 系统用户 |
| `sys_role` | 角色 |
| `sys_department` | 部门 |
| `sys_region` | 区域 |
| `crm_customer` / `crm_customer_contact` | 客户 / 联系人 |
| `crm_business` | 业务 |
| `crm_work_order` / `crm_work_order_log` | 工单 / 日志 |
| `v_work_order_detail` | 工单详情视图 |
| `v_customer_full_view` | 客户全景视图 |

---

## 👥 预置用户

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `admin123` | 超级管理员 |
| `zhangsan` | `123456` | 普通员工 |
| `lisi` | `123456` | 普通员工 |
| `wangwu` | `123456` | 普通员工 |
| `zhaoliu` | `123456` | 区域经理 |

---

**CRM System © 2026 — 课程设计作品**
