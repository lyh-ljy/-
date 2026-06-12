/**
 * API 统一出口
 * - 当 useMock = true  时走 localStorage 模拟数据
 * - 当 useMock = false 时走真实后端 API
 */
import request from './request'

// ==================== 切换开关 ====================
export const useMock = false
// =================================================

// ── 认证 ──
export async function loginApi(username, password) {
  if (useMock) return (await import('@/utils/mock')).loginApi(username, password)
  return request.post('/auth/login', { username, password })
}

export function getCurrentUser() {
  const d = localStorage.getItem('crm_current_user')
  return d ? JSON.parse(d) : null
}

export function logoutApi() {
  localStorage.removeItem('crm_current_user')
  localStorage.removeItem('crm_token')
}

// ── 用户管理 ──
export function getUsers(params) {
  if (useMock) return import('@/utils/mock').then(m => m.getUsers(params))
  return request.get('/users', { params })
}
export function getUserById(id) {
  if (useMock) return import('@/utils/mock').then(m => m.getUserById(id))
  return request.get(`/users/${id}`)
}
export function createUser(data) {
  if (useMock) return import('@/utils/mock').then(m => m.createUser(data))
  return request.post('/users', data)
}
export function updateUser(id, data) {
  if (useMock) return import('@/utils/mock').then(m => m.updateUser(id, data))
  return request.put(`/users/${id}`, data)
}
export function deleteUser(id) {
  if (useMock) return import('@/utils/mock').then(m => m.deleteUser(id))
  return request.delete(`/users/${id}`)
}

// ── 客户管理 ──
export function getCustomers(params) {
  if (useMock) return import('@/utils/mock').then(m => m.getCustomers(params))
  return request.get('/customers', { params })
}
export function getCustomerById(id) {
  if (useMock) return import('@/utils/mock').then(m => m.getCustomerById(id))
  return request.get(`/customers/${id}`)
}
export function createCustomer(data) {
  if (useMock) return import('@/utils/mock').then(m => m.createCustomer(data))
  return request.post('/customers', data)
}
export function updateCustomer(id, data) {
  if (useMock) return import('@/utils/mock').then(m => m.updateCustomer(id, data))
  return request.put(`/customers/${id}`, data)
}
export function deleteCustomer(id) {
  if (useMock) return import('@/utils/mock').then(m => m.deleteCustomer(id))
  return request.delete(`/customers/${id}`)
}

// ── 业务管理 ──
export function getBusinesses(params) {
  if (useMock) return import('@/utils/mock').then(m => m.getBusinesses(params))
  return request.get('/businesses', { params })
}
export function getBusinessById(id) {
  if (useMock) return import('@/utils/mock').then(m => m.getBusinessById(id))
  return request.get(`/businesses/${id}`)
}
export function createBusiness(data) {
  if (useMock) return import('@/utils/mock').then(m => m.createBusiness(data))
  return request.post('/businesses', data)
}
export function updateBusiness(id, data) {
  if (useMock) return import('@/utils/mock').then(m => m.updateBusiness(id, data))
  return request.put(`/businesses/${id}`, data)
}
export function deleteBusiness(id) {
  if (useMock) return import('@/utils/mock').then(m => m.deleteBusiness(id))
  return request.delete(`/businesses/${id}`)
}

// ── 工单管理 ──
export function getWorkOrders(params) {
  if (useMock) return import('@/utils/mock').then(m => m.getWorkOrders(params))
  return request.get('/work-orders', { params })
}
export function getWorkOrderById(id) {
  if (useMock) return import('@/utils/mock').then(m => m.getWorkOrderById(id))
  return request.get(`/work-orders/${id}`).then(r => r.order || r)
}
export function createWorkOrder(data) {
  if (useMock) return import('@/utils/mock').then(m => m.createWorkOrder(data))
  return request.post('/work-orders', data)
}
export function assignWorkOrder(id, assignedTo) {
  if (useMock) return import('@/utils/mock').then(m => m.assignWorkOrder(id, assignedTo))
  return request.put(`/work-orders/${id}/assign`, { assignedTo })
}
export function replyWorkOrder(id, data) {
  if (useMock) return import('@/utils/mock').then(m => m.replyWorkOrder(id, data))
  return request.put(`/work-orders/${id}/reply`, { replyContent: data.replyContent })
}
export function returnWorkOrder(id, data) {
  if (useMock) return import('@/utils/mock').then(m => m.returnWorkOrder(id, data))
  return request.put(`/work-orders/${id}/return`, { returnReason: data.returnReason })
}
export function closeWorkOrder(id) {
  if (useMock) return import('@/utils/mock').then(m => m.closeWorkOrder(id))
  return request.put(`/work-orders/${id}/close`)
}
export function getWorkOrderLogs(orderId) {
  if (useMock) return import('@/utils/mock').then(m => m.getWorkOrderLogs(orderId))
  return request.get(`/work-orders/${orderId}/logs`)
}

// ── 基础数据 ──
export function getRegions() {
  if (useMock) return import('@/utils/mock').then(m => m.getRegions())
  return request.get('/regions')
}
export function getDepartments() {
  if (useMock) return import('@/utils/mock').then(m => m.getDepartments())
  return request.get('/departments')
}
export function getRoles() {
  if (useMock) return import('@/utils/mock').then(m => m.getRoles())
  return request.get('/roles')
}
export function getAllUsers() {
  if (useMock) return import('@/utils/mock').then(m => m.getAllUsers())
  return request.get('/users/simple')
}
export function getAllCustomers() {
  if (useMock) return import('@/utils/mock').then(m => m.getAllCustomers())
  return request.get('/customers', { params: { page: 1, pageSize: 9999 } })
    .then(r => (r.records || r).map(c => ({
      customer_id: c.customer_id, customer_name: c.customer_name, customer_no: c.customer_no
    })))
}

// ── 仪表盘 ──
export function getDashboardStats() {
  if (useMock) return import('@/utils/mock').then(m => m.getDashboardStats())
  return request.get('/dashboard/stats').then(d => ({
    customerCount: d.customer_count ?? 0,
    businessCount: d.business_count ?? 0,
    workOrderCount: d.work_order_count ?? 0,
    pendingCount: d.pending_count ?? 0,
    processingCount: d.processing_count ?? 0,
    repliedCount: d.replied_count ?? 0,
    totalAmount: d.total_amount ?? 0,
    workOrderByStatus: (d.work_order_by_status || []).map(item => ({
      name: item.name,
      value: item.value
    }))
  }))
}

// ── 工具 ──
export { getStatusLabel } from '@/utils/mock'
export function initMockData() {
  if (useMock) {
    return import('@/utils/mock').then(m => m.initMockData())
  }
}
