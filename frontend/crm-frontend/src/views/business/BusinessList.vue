<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">业务管理</h2>
    <div class="search-box"><el-form :model="s" inline>
      <el-form-item label="业务名称"><el-input v-model="s.business_name" clearable style="width:180px"/></el-form-item>
      <el-form-item label="业务编号"><el-input v-model="s.business_no" clearable style="width:160px"/></el-form-item>
      <el-form-item label="业务类型"><el-select v-model="s.business_type" clearable style="width:140px"><el-option label="产品销售" :value="1"/><el-option label="技术服务" :value="2"/><el-option label="咨询服务" :value="3"/><el-option label="售后服务" :value="4"/><el-option label="其他" :value="5"/></el-select></el-form-item>
      <el-form-item label="状态"><el-select v-model="s.status" clearable style="width:130px"><el-option label="进行中" :value="1"/><el-option label="已完成" :value="2"/><el-option label="暂停" :value="3"/><el-option label="取消" :value="4"/></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form></div>
    <div class="table-box"><div class="toolbar"><div class="toolbar-left"><el-button type="primary" @click="$router.push('/business/add')"><el-icon><Plus/></el-icon>新增业务</el-button><el-button @click="exportExcel"><el-icon><Download/></el-icon>导出</el-button><el-button type="danger" :disabled="!sel.length" @click="batchDel">批量删除</el-button></div></div>
      <el-table :data="list" v-loading="loading" stripe @selection-change="v=>sel=v">
        <el-table-column type="selection" width="50"/><el-table-column prop="business_no" label="业务编号" width="150"/><el-table-column prop="business_name" label="业务名称" min-width="160" show-overflow-tooltip/>
        <el-table-column label="业务类型" width="100"><template #default="{row}"><el-tag size="small">{{gl('business_type',row.business_type)}}</el-tag></template></el-table-column>
        <el-table-column prop="customer_name" label="关联客户" width="140"/>
        <el-table-column label="金额" width="120"><template #default="{row}">¥{{Number(row.amount||0).toLocaleString()}}</template></el-table-column>
        <el-table-column label="状态" width="90"><template #default="{row}"><el-tag :type="row.status===1?'primary':row.status===2?'success':row.status===3?'warning':'info'" size="small">{{gl('business_status',row.status)}}</el-tag></template></el-table-column>
        <el-table-column label="进度" width="140"><template #default="{row}"><el-progress :percentage="row.progress||0" :stroke-width="6"/></template></el-table-column>
        <el-table-column prop="owner_name" label="负责人" width="90"/><el-table-column prop="create_time" label="创建时间" width="160"/>
        <el-table-column label="操作" width="180" fixed="right"><template #default="{row}"><el-button size="small" @click="$router.push(`/business/edit/${row.business_id}`)">编辑</el-button><el-button size="small" type="danger" @click="del(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" :page-sizes="[10,20,50]" layout="total,sizes,prev,pager,next" @size-change="load" @current-change="load"/></div>
    </div>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue';import {getBusinesses,deleteBusiness,getStatusLabel as gl} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus';import * as XLSX from 'xlsx'
const loading=ref(false),list=ref([]),sel=ref([])
const s=reactive({business_name:'',business_no:'',business_type:'',status:''})
const p=reactive({page:1,pageSize:10,total:0})
async function load(){loading.value=true;try{const r=await getBusinesses({...s,...p});list.value=r.records;p.total=r.total}finally{loading.value=false}}
function search(){p.page=1;load()}
function reset(){Object.assign(s,{business_name:'',business_no:'',business_type:'',status:''});search()}
async function del(row){await ElMessageBox.confirm(`确定删除"${row.business_name}"?`,'提示',{type:'warning'});await deleteBusiness(row.business_id);ElMessage.success('删除成功');load()}
async function batchDel(){await ElMessageBox.confirm(`确定删除${sel.value.length}个业务?`,'批量删除',{type:'warning'});for(const r of sel.value)await deleteBusiness(r.business_id).catch(()=>{});ElMessage.success('完成');load()}
function exportExcel(){const ws=XLSX.utils.json_to_sheet(list.value);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'业务');XLSX.writeFile(wb,'业务导出.xlsx');ElMessage.success('导出成功')}
onMounted(load)
</script>
