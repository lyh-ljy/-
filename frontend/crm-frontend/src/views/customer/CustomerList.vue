<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">客户管理</h2>
    <div class="search-box"><el-form :model="s" inline>
      <el-form-item label="客户名称"><el-input v-model="s.customer_name" clearable style="width:180px"/></el-form-item>
      <el-form-item label="客户编号"><el-input v-model="s.customer_no" clearable style="width:160px"/></el-form-item>
      <el-form-item label="客户类型"><el-select v-model="s.customer_type" clearable style="width:130px"><el-option label="个人" :value="1"/><el-option label="企业" :value="2"/><el-option label="政府" :value="3"/><el-option label="其他" :value="4"/></el-select></el-form-item>
      <el-form-item label="客户等级"><el-select v-model="s.customer_level" clearable style="width:130px"><el-option label="普通" :value="1"/><el-option label="重要" :value="2"/><el-option label="VIP" :value="3"/><el-option label="战略" :value="4"/></el-select></el-form-item>
      <el-form-item label="区域"><el-select v-model="s.region_id" clearable style="width:140px"><el-option v-for="r in regions" :key="r.region_id" :label="r.region_name" :value="r.region_id"/></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form></div>
    <div class="table-box"><div class="toolbar"><div class="toolbar-left"><el-button type="primary" @click="$router.push('/customer/add')"><el-icon><Plus/></el-icon>新增客户</el-button><el-button @click="exportExcel"><el-icon><Download/></el-icon>导出</el-button><el-button type="danger" :disabled="!sel.length" @click="batchDel">批量删除</el-button></div></div>
      <el-table :data="list" v-loading="loading" stripe @selection-change="v=>sel=v">
        <el-table-column type="selection" width="50"/><el-table-column prop="customer_no" label="客户编号" width="150"/><el-table-column prop="customer_name" label="客户名称" min-width="160" show-overflow-tooltip/>
        <el-table-column label="客户类型" width="90"><template #default="{row}"><el-tag size="small" :type="row.customer_type===2?'primary':row.customer_type===3?'warning':'info'">{{gl('customer_type',row.customer_type)}}</el-tag></template></el-table-column>
        <el-table-column prop="industry" label="行业" width="100"/>
        <el-table-column label="客户等级" width="90"><template #default="{row}"><el-tag size="small" :type="row.customer_level>=3?'danger':row.customer_level===2?'warning':''">{{gl('customer_level',row.customer_level)}}</el-tag></template></el-table-column>
        <el-table-column prop="city" label="城市" width="90"/><el-table-column prop="region_name" label="区域" width="100"/><el-table-column prop="owner_name" label="负责人" width="90"/>
        <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':row.status===2?'danger':'info'" size="small">{{gl('customer_status',row.status)}}</el-tag></template></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160"/>
        <el-table-column label="操作" width="180" fixed="right"><template #default="{row}"><el-button size="small" @click="$router.push(`/customer/edit/${row.customer_id}`)">编辑</el-button><el-button size="small" type="danger" @click="del(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" :page-sizes="[10,20,50]" layout="total,sizes,prev,pager,next" @size-change="load" @current-change="load"/></div>
    </div>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue';import {getCustomers,deleteCustomer,getRegions,getStatusLabel as gl} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus';import * as XLSX from 'xlsx'
const loading=ref(false),list=ref([]),sel=ref([]),regions=ref([])
const s=reactive({customer_name:'',customer_no:'',customer_type:'',customer_level:'',region_id:''})
const p=reactive({page:1,pageSize:10,total:0})
async function load(){loading.value=true;try{const r=await getCustomers({...s,...p});list.value=r.records;p.total=r.total}finally{loading.value=false}}
function search(){p.page=1;load()}
function reset(){Object.assign(s,{customer_name:'',customer_no:'',customer_type:'',customer_level:'',region_id:''});search()}
async function del(row){await ElMessageBox.confirm(`确定删除"${row.customer_name}"?`,'提示',{type:'warning'});await deleteCustomer(row.customer_id);ElMessage.success('删除成功');load()}
async function batchDel(){await ElMessageBox.confirm(`确定删除${sel.value.length}个客户?`,'批量删除',{type:'warning'});for(const r of sel.value)await deleteCustomer(r.customer_id).catch(()=>{});ElMessage.success('完成');load()}
function exportExcel(){const ws=XLSX.utils.json_to_sheet(list.value);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'客户');XLSX.writeFile(wb,'客户导出.xlsx');ElMessage.success('导出成功')}
onMounted(async()=>{regions.value=await getRegions();load()})
</script>
