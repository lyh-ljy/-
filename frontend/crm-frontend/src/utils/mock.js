import dayjs from 'dayjs'

// localStorage 模拟数据层 - 完整CRUD，可无缝切换后端API

function read(key) { return JSON.parse(localStorage.getItem(key) || '[]') }
function write(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function nextId(items) { return items.length > 0 ? Math.max(...items.map(i => i[Object.keys(i)[0]])) + 1 : 1 }
function delay(ms = 150) { return new Promise(r => setTimeout(r, ms)) }
function paginate(items, page = 1, pageSize = 10) {
  const total = items.length
  return { records: items.slice((page-1)*pageSize, (page-1)*pageSize+pageSize), total, page, pageSize, totalPages: Math.ceil(total/pageSize) }
}

const KEYS = { users:'crm_users', customers:'crm_customers', businesses:'crm_businesses', workOrders:'crm_work_orders', workOrderLogs:'crm_work_order_logs', regions:'crm_regions', departments:'crm_departments', roles:'crm_roles', currentUser:'crm_current_user' }

const defaultRoles = [
  { role_id:1, role_name:'超级管理员', role_code:'SUPER_ADMIN', role_sort:1, data_scope:1, status:1 },
  { role_id:2, role_name:'管理员', role_code:'ADMIN', role_sort:2, data_scope:2, status:1 },
  { role_id:3, role_name:'区域经理', role_code:'REGION_MGR', role_sort:3, data_scope:3, status:1 },
  { role_id:4, role_name:'普通员工', role_code:'STAFF', role_sort:4, data_scope:5, status:1 },
  { role_id:5, role_name:'只读用户', role_code:'READONLY', role_sort:5, data_scope:5, status:1 }
]

const defaultDepartments = [
  { dept_id:1, parent_id:0, dept_name:'总公司', dept_code:'HQ', sort_order:1, status:1 },
  { dept_id:2, parent_id:1, dept_name:'销售部', dept_code:'SALES', sort_order:1, status:1 },
  { dept_id:3, parent_id:1, dept_name:'技术部', dept_code:'TECH', sort_order:2, status:1 },
  { dept_id:4, parent_id:1, dept_name:'客服部', dept_code:'CS', sort_order:3, status:1 },
  { dept_id:5, parent_id:1, dept_name:'市场部', dept_code:'MKT', sort_order:4, status:1 }
]

const defaultRegions = [
  { region_id:1, parent_id:0, region_name:'全国', region_code:'CN', region_level:1, sort_order:1, status:1 },
  { region_id:2, parent_id:1, region_name:'华东区', region_code:'CN-E', region_level:2, sort_order:1, status:1 },
  { region_id:3, parent_id:1, region_name:'华南区', region_code:'CN-S', region_level:2, sort_order:2, status:1 },
  { region_id:4, parent_id:1, region_name:'华北区', region_code:'CN-N', region_level:2, sort_order:3, status:1 },
  { region_id:5, parent_id:1, region_name:'西南区', region_code:'CN-SW', region_level:2, sort_order:4, status:1 },
  { region_id:6, parent_id:2, region_name:'上海市', region_code:'CN-E-SH', region_level:3, sort_order:1, status:1 },
  { region_id:7, parent_id:2, region_name:'浙江省', region_code:'CN-E-ZJ', region_level:3, sort_order:2, status:1 },
  { region_id:8, parent_id:3, region_name:'广东省', region_code:'CN-S-GD', region_level:3, sort_order:1, status:1 },
  { region_id:9, parent_id:4, region_name:'北京市', region_code:'CN-N-BJ', region_level:3, sort_order:1, status:1 },
  { region_id:10, parent_id:5, region_name:'四川省', region_code:'CN-SW-SC', region_level:3, sort_order:1, status:1 }
]

const defaultUsers = [
  { user_id:1, username:'admin', password:'admin123', real_name:'系统管理员', nickname:'Admin', gender:1, phone:'13800000001', email:'admin@crm.com', dept_id:1, role_id:1, position:'系统管理员', region_id:1, status:1 },
  { user_id:2, username:'zhangsan', password:'123456', real_name:'张三', nickname:'小张', gender:1, phone:'13800000002', email:'zhangsan@crm.com', dept_id:2, role_id:4, position:'销售经理', region_id:2, status:1 },
  { user_id:3, username:'lisi', password:'123456', real_name:'李四', nickname:'老李', gender:1, phone:'13800000003', email:'lisi@crm.com', dept_id:3, role_id:4, position:'技术工程师', region_id:3, status:1 },
  { user_id:4, username:'wangwu', password:'123456', real_name:'王五', nickname:'小王', gender:2, phone:'13800000004', email:'wangwu@crm.com', dept_id:4, role_id:4, position:'客服专员', region_id:2, status:1 },
  { user_id:5, username:'zhaoliu', password:'123456', real_name:'赵六', nickname:'老赵', gender:1, phone:'13800000005', email:'zhaoliu@crm.com', dept_id:2, role_id:3, position:'华东区经理', region_id:2, status:1 }
]

const defaultCustomers = [
  { customer_id:1, customer_no:'CUS202606090001', customer_name:'华为技术有限公司', customer_type:2, industry:'IT/互联网', customer_level:3, source:'自主开发', credit_rating:'AAA', province:'广东省', city:'深圳市', district:'龙岗区', detail_address:'坂田华为基地', region_id:8, website:'https://www.huawei.com', remark:'战略合作伙伴', status:1, owner_id:3, create_by:1, create_time:'2026-05-01 10:00:00' },
  { customer_id:2, customer_no:'CUS202606090002', customer_name:'阿里巴巴集团', customer_type:2, industry:'IT/互联网', customer_level:4, source:'转介绍', credit_rating:'AAA', province:'浙江省', city:'杭州市', district:'余杭区', detail_address:'文一西路969号', region_id:7, website:'https://www.alibaba.com', remark:'电商平台合作方', status:1, owner_id:2, create_by:1, create_time:'2026-05-02 09:00:00' },
  { customer_id:3, customer_no:'CUS202606090003', customer_name:'中国工商银行', customer_type:3, industry:'金融', customer_level:3, source:'线下活动', credit_rating:'AAA', province:'北京市', city:'北京市', district:'西城区', detail_address:'复兴门内大街55号', region_id:9, website:'https://www.icbc.com.cn', remark:'金融服务合作', status:1, owner_id:4, create_by:1, create_time:'2026-05-03 14:00:00' },
  { customer_id:4, customer_no:'CUS202606090004', customer_name:'上海交通大学', customer_type:3, industry:'教育', customer_level:2, source:'线上推广', credit_rating:'AA', province:'上海市', city:'上海市', district:'闵行区', detail_address:'东川路800号', region_id:6, website:'https://www.sjtu.edu.cn', remark:'产学研合作单位', status:1, owner_id:2, create_by:1, create_time:'2026-05-04 11:00:00' },
  { customer_id:5, customer_no:'CUS202606090005', customer_name:'张三(个人客户)', customer_type:1, industry:'IT/互联网', customer_level:1, source:'线上推广', credit_rating:'A', province:'上海市', city:'上海市', district:'浦东新区', detail_address:'张江路100号', region_id:6, remark:'个人开发者客户', status:1, owner_id:5, create_by:1, create_time:'2026-05-05 08:00:00' },
  { customer_id:6, customer_no:'CUS202606090006', customer_name:'成都生物制药有限公司', customer_type:2, industry:'医疗', customer_level:2, source:'线下活动', credit_rating:'AA', province:'四川省', city:'成都市', district:'高新区', detail_address:'天府大道2000号', region_id:10, remark:'生物医药领域客户', status:1, owner_id:2, create_by:1, create_time:'2026-05-06 16:00:00' },
  { customer_id:7, customer_no:'CUS202606090007', customer_name:'京东集团', customer_type:2, industry:'零售', customer_level:3, source:'转介绍', credit_rating:'AA', province:'北京市', city:'北京市', district:'大兴区', detail_address:'亦庄经济开发区', region_id:9, website:'https://www.jd.com', remark:'电商物流合作方', status:1, owner_id:4, create_by:1, create_time:'2026-05-07 10:30:00' },
  { customer_id:8, customer_no:'CUS202606090008', customer_name:'腾讯科技有限公司', customer_type:2, industry:'IT/互联网', customer_level:3, source:'自主开发', credit_rating:'AAA', province:'广东省', city:'深圳市', district:'南山区', detail_address:'科技园南路', region_id:8, website:'https://www.tencent.com', remark:'社交平台合作方', status:1, owner_id:3, create_by:1, create_time:'2026-05-08 13:00:00' }
]

const defaultBusinesses = [
  { business_id:1, business_no:'BIZ202606090001', business_name:'华为云服务器运维服务', business_type:2, category:'IT运维', description:'华为云服务器日常运维、监控及故障处理', amount:500000, currency:'CNY', start_time:'2026-01-01', end_time:'2026-12-31', contract_no:'HT-2026-001', priority:1, status:1, progress:60, owner_id:3, customer_id:1, create_by:1, create_time:'2026-01-01 09:00:00' },
  { business_id:2, business_no:'BIZ202606090002', business_name:'阿里巴巴电商平台对接', business_type:2, category:'系统集成', description:'电商平台API对接及数据同步开发', amount:300000, currency:'CNY', start_time:'2026-03-01', end_time:'2026-09-30', contract_no:'HT-2026-002', priority:2, status:1, progress:40, owner_id:2, customer_id:2, create_by:1, create_time:'2026-03-01 10:00:00' },
  { business_id:3, business_no:'BIZ202606090003', business_name:'工商银行安全咨询服务', business_type:3, category:'安全咨询', description:'金融信息系统安全评估及咨询服务', amount:200000, currency:'CNY', start_time:'2026-02-15', end_time:'2026-08-15', contract_no:'HT-2026-003', priority:1, status:2, progress:100, owner_id:4, customer_id:3, create_by:1, create_time:'2026-02-15 08:30:00' },
  { business_id:4, business_no:'BIZ202606090004', business_name:'上海交大科研合作项目', business_type:3, category:'产学研', description:'AI技术在数据管理领域的应用研究', amount:150000, currency:'CNY', start_time:'2026-04-01', end_time:'2027-03-31', contract_no:'HT-2026-004', priority:2, status:1, progress:25, owner_id:2, customer_id:4, create_by:1, create_time:'2026-04-01 14:00:00' },
  { business_id:5, business_no:'BIZ202606090005', business_name:'张三个人网站开发', business_type:2, category:'网站开发', description:'个人博客及作品展示网站开发', amount:15000, currency:'CNY', start_time:'2026-05-01', end_time:'2026-07-31', contract_no:'HT-2026-005', priority:3, status:1, progress:50, owner_id:5, customer_id:5, create_by:1, create_time:'2026-05-01 11:00:00' },
  { business_id:6, business_no:'BIZ202606090006', business_name:'成都生物ERP系统实施', business_type:2, category:'ERP实施', description:'企业资源管理系统部署及定制开发', amount:800000, currency:'CNY', start_time:'2026-01-15', end_time:'2026-10-15', contract_no:'HT-2026-006', priority:1, status:1, progress:70, owner_id:2, customer_id:6, create_by:1, create_time:'2026-01-15 09:00:00' },
  { business_id:7, business_no:'BIZ202606090007', business_name:'京东仓储管理系统升级', business_type:2, category:'系统升级', description:'仓储管理WMS系统架构升级及性能优化', amount:450000, currency:'CNY', start_time:'2026-06-01', end_time:'2026-12-31', contract_no:'HT-2026-007', priority:2, status:1, progress:10, owner_id:4, customer_id:7, create_by:1, create_time:'2026-06-01 08:00:00' },
  { business_id:8, business_no:'BIZ202606090008', business_name:'腾讯社交数据中台建设', business_type:2, category:'数据中台', description:'社交平台数据中台架构设计与实施', amount:1000000, currency:'CNY', start_time:'2026-04-01', end_time:'2027-04-01', contract_no:'HT-2026-008', priority:1, status:1, progress:30, owner_id:3, customer_id:8, create_by:1, create_time:'2026-04-01 10:00:00' }
]

const defaultWorkOrders = [
  { order_id:1, order_no:'WO2026060900001', title:'华为云服务器CPU告警处理', order_type:4, customer_id:1, business_id:1, description:'华东节点服务器CPU使用率超过90%，需紧急排查', priority:1, status:2, source:'电话', channel:'客服热线', region_id:8, assigned_to:3, assigned_time:'2026-06-09 09:00:00', expected_time:'2026-06-10 18:00:00', create_by:1, create_time:'2026-06-09 08:30:00' },
  { order_id:2, order_no:'WO2026060900002', title:'阿里巴巴订单数据同步异常', order_type:4, customer_id:2, business_id:2, description:'每日订单增量数据同步延迟超过2小时', priority:2, status:2, source:'邮件', channel:'技术支持', region_id:7, assigned_to:2, assigned_time:'2026-06-09 10:00:00', expected_time:'2026-06-11 18:00:00', create_by:2, create_time:'2026-06-09 09:20:00' },
  { order_id:3, order_no:'WO2026060900003', title:'工行安全评估报告咨询', order_type:1, customer_id:3, business_id:3, description:'客户咨询安全评估报告中的渗透测试结果细节', priority:3, status:3, source:'在线', channel:'在线客服', region_id:9, assigned_to:4, assigned_time:'2026-06-08 14:00:00', reply_content:'已向客户详细说明安全评估报告内容，客户表示满意', reply_time:'2026-06-09 15:00:00', reply_by:4, create_by:4, create_time:'2026-06-08 13:45:00' },
  { order_id:4, order_no:'WO2026060900004', title:'交大科研项目需求变更', order_type:3, customer_id:4, business_id:4, description:'客户提出新增自然语言处理模块的需求', priority:2, status:1, source:'邮件', channel:'项目管理', region_id:6, expected_time:'2026-06-20 18:00:00', create_by:2, create_time:'2026-06-08 16:10:00' },
  { order_id:5, order_no:'WO2026060900005', title:'个人网站备案咨询', order_type:1, customer_id:5, business_id:5, description:'客户咨询个人网站ICP备案流程及所需材料', priority:4, status:1, source:'在线', channel:'在线客服', region_id:6, expected_time:'2026-06-12 18:00:00', create_by:5, create_time:'2026-06-09 07:50:00' },
  { order_id:6, order_no:'WO2026060900006', title:'成都生物ERP模块上线支持', order_type:3, customer_id:6, business_id:6, description:'财务模块即将上线，需要现场支持及用户培训', priority:2, status:2, source:'电话', channel:'项目实施', region_id:10, assigned_to:2, assigned_time:'2026-06-09 08:00:00', expected_time:'2026-06-15 18:00:00', create_by:2, create_time:'2026-06-09 07:30:00' },
  { order_id:7, order_no:'WO2026060900007', title:'京东WMS系统性能投诉', order_type:2, customer_id:7, business_id:7, description:'客户投诉系统升级后页面加载速度变慢', priority:1, status:1, source:'电话', channel:'投诉热线', region_id:9, expected_time:'2026-06-10 18:00:00', create_by:4, create_time:'2026-06-09 10:15:00' },
  { order_id:8, order_no:'WO2026060900008', title:'腾讯数据中台架构评审', order_type:3, customer_id:8, business_id:8, description:'需要安排架构师参与客户数据中台技术方案评审会议', priority:3, status:3, source:'邮件', channel:'项目管理', region_id:8, assigned_to:3, assigned_time:'2026-06-05 16:00:00', reply_content:'已完成架构评审会议，技术方案通过客户审核', reply_time:'2026-06-08 16:30:00', reply_by:3, create_by:3, create_time:'2026-06-05 15:40:00' }
]

const defaultWorkOrderLogs = [
  { log_id:1, order_id:1, operation_type:'CREATE', operator_id:1, operator_name:'系统管理员', from_status:null, to_status:1, content:'创建工单', create_time:'2026-06-09 08:30:00' },
  { log_id:2, order_id:1, operation_type:'ASSIGN', operator_id:1, operator_name:'系统管理员', from_status:1, to_status:2, content:'指派给李四处理', create_time:'2026-06-09 09:00:00' },
  { log_id:3, order_id:3, operation_type:'CREATE', operator_id:4, operator_name:'王五', from_status:null, to_status:1, content:'创建工单', create_time:'2026-06-08 13:45:00' },
  { log_id:4, order_id:3, operation_type:'ASSIGN', operator_id:4, operator_name:'王五', from_status:1, to_status:2, content:'指派给王五处理', create_time:'2026-06-08 14:00:00' },
  { log_id:5, order_id:3, operation_type:'REPLY', operator_id:4, operator_name:'王五', from_status:2, to_status:3, content:'已回单: 已向客户详细说明安全评估报告内容', create_time:'2026-06-09 15:00:00' },
  { log_id:6, order_id:8, operation_type:'CREATE', operator_id:3, operator_name:'李四', from_status:null, to_status:1, content:'创建工单', create_time:'2026-06-05 15:40:00' },
  { log_id:7, order_id:8, operation_type:'ASSIGN', operator_id:3, operator_name:'李四', from_status:1, to_status:2, content:'指派给李四处理', create_time:'2026-06-05 16:00:00' },
  { log_id:8, order_id:8, operation_type:'REPLY', operator_id:3, operator_name:'李四', from_status:2, to_status:3, content:'已回单: 已完成架构评审会议', create_time:'2026-06-08 16:30:00' }
]

function initIfEmpty(key, data) { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data)) }

export function initMockData() {
  initIfEmpty(KEYS.roles, defaultRoles)
  initIfEmpty(KEYS.departments, defaultDepartments)
  initIfEmpty(KEYS.regions, defaultRegions)
  initIfEmpty(KEYS.users, defaultUsers)
  initIfEmpty(KEYS.customers, defaultCustomers)
  initIfEmpty(KEYS.businesses, defaultBusinesses)
  initIfEmpty(KEYS.workOrders, defaultWorkOrders)
  initIfEmpty(KEYS.workOrderLogs, defaultWorkOrderLogs)
}

// 认证
export async function loginApi(username, password) {
  await delay(300)
  const users = read(KEYS.users)
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) throw new Error('用户名或密码错误')
  if (user.status === 0) throw new Error('账户已被禁用')
  const { password: _, ...info } = user
  localStorage.setItem(KEYS.currentUser, JSON.stringify(info))
  return { token: 'mock-token-' + user.user_id, userInfo: info }
}
export function getCurrentUser() { const d = localStorage.getItem(KEYS.currentUser); return d ? JSON.parse(d) : null }
export function logoutApi() { localStorage.removeItem(KEYS.currentUser) }

// 用户管理
export async function getUsers(p = {}) {
  await delay()
  let data = read(KEYS.users).map(u => { const { password, ...r } = u; return r })
  if (p.username) data = data.filter(u => u.username.includes(p.username))
  if (p.real_name) data = data.filter(u => u.real_name.includes(p.real_name))
  if (p.phone) data = data.filter(u => u.phone && u.phone.includes(p.phone))
  if (p.status !== undefined && p.status !== '') data = data.filter(u => u.status === Number(p.status))
  const depts = read(KEYS.departments), roles = read(KEYS.roles)
  data = data.map(u => ({ ...u, dept_name: (depts.find(d => d.dept_id === u.dept_id) || {}).dept_name || '', role_name: (roles.find(r => r.role_id === u.role_id) || {}).role_name || '' }))
  return paginate(data, p.page || 1, p.pageSize || 10)
}
export async function getUserById(id) { await delay(); const u = read(KEYS.users).find(u => u.user_id === Number(id)); if (!u) throw new Error('用户不存在'); const { password, ...r } = u; return r }
export async function createUser(data) { await delay(); const items = read(KEYS.users); if (items.find(u => u.username === data.username)) throw new Error('用户名已存在'); const nu = { ...data, user_id: nextId(items), create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), status: 1 }; items.push(nu); write(KEYS.users, items); return nu }
export async function updateUser(id, data) { await delay(); const items = read(KEYS.users); const i = items.findIndex(u => u.user_id === Number(id)); if (i === -1) throw new Error('用户不存在'); items[i] = { ...items[i], ...data, user_id: Number(id) }; write(KEYS.users, items); return items[i] }
export async function deleteUser(id) { await delay(); const items = read(KEYS.users); const i = items.findIndex(u => u.user_id === Number(id)); if (i === -1) throw new Error('用户不存在'); items[i].status = 0; write(KEYS.users, items) }

// 客户管理
export async function getCustomers(p = {}) {
  await delay()
  let data = read(KEYS.customers)
  if (p.customer_name) data = data.filter(c => c.customer_name.includes(p.customer_name))
  if (p.customer_no) data = data.filter(c => c.customer_no.includes(p.customer_no))
  if (p.customer_type) data = data.filter(c => c.customer_type === Number(p.customer_type))
  if (p.customer_level) data = data.filter(c => c.customer_level === Number(p.customer_level))
  if (p.region_id) data = data.filter(c => c.region_id === Number(p.region_id))
  if (p.status !== undefined && p.status !== '') data = data.filter(c => c.status === Number(p.status))
  const regions = read(KEYS.regions), users = read(KEYS.users)
  data = data.map(c => ({ ...c, region_name: (regions.find(r => r.region_id === c.region_id) || {}).region_name || '', owner_name: (users.find(u => u.user_id === c.owner_id) || {}).real_name || '' }))
  return paginate(data, p.page || 1, p.pageSize || 10)
}
export async function getCustomerById(id) { await delay(); const c = read(KEYS.customers).find(c => c.customer_id === Number(id)); if (!c) throw new Error('客户不存在'); return c }
export async function createCustomer(data) { await delay(); const items = read(KEYS.customers); const id = nextId(items); const nc = { ...data, customer_id: id, customer_no: 'CUS' + dayjs().format('YYYYMMDD') + String(id).padStart(4,'0'), create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), is_deleted: 0 }; items.push(nc); write(KEYS.customers, items); return nc }
export async function updateCustomer(id, data) { await delay(); const items = read(KEYS.customers); const i = items.findIndex(c => c.customer_id === Number(id)); if (i === -1) throw new Error('客户不存在'); items[i] = { ...items[i], ...data, customer_id: Number(id) }; write(KEYS.customers, items); return items[i] }
export async function deleteCustomer(id) { await delay(); const items = read(KEYS.customers); const i = items.findIndex(c => c.customer_id === Number(id)); if (i === -1) throw new Error('客户不存在'); items[i].is_deleted = 1; write(KEYS.customers, items) }

// 业务管理
export async function getBusinesses(p = {}) {
  await delay()
  let data = read(KEYS.businesses)
  if (p.business_name) data = data.filter(b => b.business_name.includes(p.business_name))
  if (p.business_no) data = data.filter(b => b.business_no.includes(p.business_no))
  if (p.business_type) data = data.filter(b => b.business_type === Number(p.business_type))
  if (p.status !== undefined && p.status !== '') data = data.filter(b => b.status === Number(p.status))
  if (p.customer_id) data = data.filter(b => b.customer_id === Number(p.customer_id))
  const users = read(KEYS.users), customers = read(KEYS.customers)
  data = data.map(b => ({ ...b, owner_name: (users.find(u => u.user_id === b.owner_id) || {}).real_name || '', customer_name: (customers.find(c => c.customer_id === b.customer_id) || {}).customer_name || '' }))
  return paginate(data, p.page || 1, p.pageSize || 10)
}
export async function getBusinessById(id) { await delay(); const b = read(KEYS.businesses).find(b => b.business_id === Number(id)); if (!b) throw new Error('业务不存在'); return b }
export async function createBusiness(data) { await delay(); const items = read(KEYS.businesses); const id = nextId(items); const nb = { ...data, business_id: id, business_no: 'BIZ' + dayjs().format('YYYYMMDD') + String(id).padStart(4,'0'), create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), is_deleted: 0 }; items.push(nb); write(KEYS.businesses, items); return nb }
export async function updateBusiness(id, data) { await delay(); const items = read(KEYS.businesses); const i = items.findIndex(b => b.business_id === Number(id)); if (i === -1) throw new Error('业务不存在'); items[i] = { ...items[i], ...data, business_id: Number(id) }; write(KEYS.businesses, items); return items[i] }
export async function deleteBusiness(id) { await delay(); const items = read(KEYS.businesses); const i = items.findIndex(b => b.business_id === Number(id)); if (i === -1) throw new Error('业务不存在'); items[i].is_deleted = 1; write(KEYS.businesses, items) }

// 工单管理
export async function getWorkOrders(p = {}) {
  await delay()
  let data = read(KEYS.workOrders)
  if (p.order_no) data = data.filter(w => w.order_no.includes(p.order_no))
  if (p.title) data = data.filter(w => w.title.includes(p.title))
  if (p.order_type) data = data.filter(w => w.order_type === Number(p.order_type))
  if (p.status !== undefined && p.status !== '') data = data.filter(w => w.status === Number(p.status))
  if (p.priority) data = data.filter(w => w.priority === Number(p.priority))
  if (p.region_id) data = data.filter(w => w.region_id === Number(p.region_id))
  const customers = read(KEYS.customers), businesses = read(KEYS.businesses), users = read(KEYS.users), regions = read(KEYS.regions)
  data = data.map(w => ({ ...w, customer_name: (customers.find(c => c.customer_id === w.customer_id) || {}).customer_name || '', business_name: (businesses.find(b => b.business_id === w.business_id) || {}).business_name || '', handler_name: (users.find(u => u.user_id === w.assigned_to) || {}).real_name || '', creator_name: (users.find(u => u.user_id === w.create_by) || {}).real_name || '', region_name: (regions.find(r => r.region_id === w.region_id) || {}).region_name || '' }))
  return paginate(data, p.page || 1, p.pageSize || 10)
}
export async function getWorkOrderById(id) { await delay(); const wo = read(KEYS.workOrders).find(w => w.order_id === Number(id)); if (!wo) throw new Error('工单不存在'); const customers = read(KEYS.customers), businesses = read(KEYS.businesses), users = read(KEYS.users), regions = read(KEYS.regions); return { ...wo, customer: customers.find(c => c.customer_id === wo.customer_id) || {}, business: businesses.find(b => b.business_id === wo.business_id) || {}, handler: users.find(u => u.user_id === wo.assigned_to) || null, creator: users.find(u => u.user_id === wo.create_by) || {}, region: regions.find(r => r.region_id === wo.region_id) || {} } }
export async function createWorkOrder(data) { await delay(); const items = read(KEYS.workOrders); const id = nextId(items); const cu = getCurrentUser(); const nw = { ...data, order_id: id, order_no: 'WO' + dayjs().format('YYYYMMDD') + String(id).padStart(5,'0'), status:1, create_by: cu?.user_id||1, create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), is_deleted: 0 }; items.push(nw); write(KEYS.workOrders, items); const logs = read(KEYS.workOrderLogs); logs.push({ log_id: nextId(logs), order_id: id, operation_type:'CREATE', operator_id: cu?.user_id||1, operator_name: cu?.real_name||'系统', from_status:null, to_status:1, content:'创建工单', create_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }); write(KEYS.workOrderLogs, logs); return nw }
export async function assignWorkOrder(id, assignedTo) { await delay(); const items = read(KEYS.workOrders); const i = items.findIndex(w => w.order_id === Number(id)); if (i === -1) throw new Error('工单不存在'); const cu = getCurrentUser(); const old = items[i].status; items[i] = { ...items[i], status:2, assigned_to: assignedTo, assigned_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }; write(KEYS.workOrders, items); const users = read(KEYS.users); const h = users.find(u => u.user_id === Number(assignedTo)); const logs = read(KEYS.workOrderLogs); logs.push({ log_id: nextId(logs), order_id: Number(id), operation_type:'ASSIGN', operator_id: cu?.user_id||1, operator_name: cu?.real_name||'系统', from_status:old, to_status:2, content:'指派给'+(h?.real_name||'未知')+'处理', create_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }); write(KEYS.workOrderLogs, logs); return items[i] }
export async function replyWorkOrder(id, data) { await delay(); const items = read(KEYS.workOrders); const i = items.findIndex(w => w.order_id === Number(id)); if (i === -1) throw new Error('工单不存在'); const cu = getCurrentUser(); items[i] = { ...items[i], status:3, reply_content: data.replyContent, reply_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), reply_by: cu?.user_id }; write(KEYS.workOrders, items); const logs = read(KEYS.workOrderLogs); logs.push({ log_id: nextId(logs), order_id: Number(id), operation_type:'REPLY', operator_id: cu?.user_id||1, operator_name: cu?.real_name||'系统', from_status:2, to_status:3, content:'已回单: '+data.replyContent, create_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }); write(KEYS.workOrderLogs, logs); return items[i] }
export async function returnWorkOrder(id, data) { await delay(); const items = read(KEYS.workOrders); const i = items.findIndex(w => w.order_id === Number(id)); if (i === -1) throw new Error('工单不存在'); const cu = getCurrentUser(); const old = items[i].status; items[i] = { ...items[i], status:4, return_reason: data.returnReason, return_time: dayjs().format('YYYY-MM-DD HH:mm:ss'), return_by: cu?.user_id }; write(KEYS.workOrders, items); const logs = read(KEYS.workOrderLogs); logs.push({ log_id: nextId(logs), order_id: Number(id), operation_type:'RETURN', operator_id: cu?.user_id||1, operator_name: cu?.real_name||'系统', from_status:old, to_status:4, content:'退单: '+data.returnReason, create_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }); write(KEYS.workOrderLogs, logs); return items[i] }
export async function closeWorkOrder(id) { await delay(); const items = read(KEYS.workOrders); const i = items.findIndex(w => w.order_id === Number(id)); if (i === -1) throw new Error('工单不存在'); const cu = getCurrentUser(); items[i] = { ...items[i], status:5 }; write(KEYS.workOrders, items); const logs = read(KEYS.workOrderLogs); logs.push({ log_id: nextId(logs), order_id: Number(id), operation_type:'CLOSE', operator_id: cu?.user_id||1, operator_name: cu?.real_name||'系统', from_status:3, to_status:5, content:'关闭工单', create_time: dayjs().format('YYYY-MM-DD HH:mm:ss') }); write(KEYS.workOrderLogs, logs); return items[i] }
export async function getWorkOrderLogs(orderId) { await delay(); return read(KEYS.workOrderLogs).filter(l => l.order_id === Number(orderId)).sort((a,b) => new Date(b.create_time) - new Date(a.create_time)) }

// 基础数据
export async function getRegions() { await delay(50); return read(KEYS.regions) }
export async function getDepartments() { await delay(50); return read(KEYS.departments) }
export async function getRoles() { await delay(50); return read(KEYS.roles) }
export async function getAllUsers() { await delay(50); return read(KEYS.users).map(u => ({ user_id: u.user_id, real_name: u.real_name, username: u.username })) }
export async function getAllCustomers() { await delay(50); return read(KEYS.customers).filter(c => !c.is_deleted).map(c => ({ customer_id: c.customer_id, customer_name: c.customer_name, customer_no: c.customer_no })) }

export function getStatusLabel(type, value) {
  const m = {
    customer_type: {1:'个人',2:'企业',3:'政府',4:'其他'}, customer_level: {1:'普通',2:'重要',3:'VIP',4:'战略'}, customer_status: {0:'停用',1:'正常',2:'黑名单'},
    business_type: {1:'产品销售',2:'技术服务',3:'咨询服务',4:'售后服务',5:'其他'}, business_status: {1:'进行中',2:'已完成',3:'暂停',4:'取消'}, business_priority: {1:'高',2:'中',3:'低'},
    work_order_type: {1:'咨询',2:'投诉',3:'服务',4:'维修',5:'其他'}, work_order_status: {1:'待处理',2:'处理中',3:'已回单',4:'已退单',5:'已关闭'}, work_order_priority: {1:'紧急',2:'高',3:'中',4:'低'}
  }
  return (m[type] || {})[value] || value
}

export async function getDashboardStats() {
  await delay()
  const customers = read(KEYS.customers).filter(c => !c.is_deleted)
  const businesses = read(KEYS.businesses).filter(b => !b.is_deleted)
  const orders = read(KEYS.workOrders).filter(w => !w.is_deleted)
  return {
    customerCount: customers.length, businessCount: businesses.length, workOrderCount: orders.length,
    pendingCount: orders.filter(w => w.status === 1).length, processingCount: orders.filter(w => w.status === 2).length,
    repliedCount: orders.filter(w => w.status === 3).length,
    totalAmount: businesses.reduce((s, b) => s + (Number(b.amount) || 0), 0),
    workOrderByStatus: [
      { name:'待处理', value: orders.filter(w => w.status === 1).length },
      { name:'处理中', value: orders.filter(w => w.status === 2).length },
      { name:'已回单', value: orders.filter(w => w.status === 3).length },
      { name:'已退单', value: orders.filter(w => w.status === 4).length },
      { name:'已关闭', value: orders.filter(w => w.status === 5).length }
    ]
  }
}
