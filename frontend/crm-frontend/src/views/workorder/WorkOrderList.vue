<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">工单管理</h2>
    <div class="search-box"><el-form :model="s" inline>
      <el-form-item label="编号"><el-input v-model="s.order_no" clearable style="width:160px"/></el-form-item>
      <el-form-item label="标题"><el-input v-model="s.title" clearable style="width:180px"/></el-form-item>
      <el-form-item label="状态"><el-select v-model="s.status" clearable style="width:130px"><el-option v-for="(l,v) in st" :key="v" :label="l" :value="Number(v)"/></el-select></el-form-item>
      <el-form-item label="优先级"><el-select v-model="s.priority" clearable style="width:120px"><el-option label="紧急" :value="1"/><el-option label="高" :value="2"/><el-option label="中" :value="3"/><el-option label="低" :value="4"/></el-select></el-form-item>
      <el-form-item label="区域"><el-select v-model="s.region_id" clearable style="width:140px"><el-option v-for="r in regions" :key="r.region_id" :label="r.region_name" :value="r.region_id"/></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form></div>
    <div class="table-box"><div class="toolbar"><div class="toolbar-left"><el-button type="primary" @click="$router.push('/workorder/add')"><el-icon><Plus/></el-icon>新建工单</el-button><el-button @click="exportExcel"><el-icon><Download/></el-icon>导出</el-button></div></div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="order_no" label="编号" width="150"/><el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip/>
        <el-table-column label="类型" width="80"><template #default="{row}">{{gl('work_order_type',row.order_type)}}</template></el-table-column>
        <el-table-column prop="customer_name" label="客户" width="140"/><el-table-column prop="business_name" label="业务" width="140"/>
        <el-table-column label="优先级" width="80"><template #default="{row}"><el-tag :type="row.priority===1?'danger':row.priority===2?'warning':''" size="small">{{gl('work_order_priority',row.priority)}}</el-tag></template></el-table-column>
        <el-table-column label="状态" width="90"><template #default="{row}"><el-tag :type="tag(row.status)" size="small">{{gl('work_order_status',row.status)}}</el-tag></template></el-table-column>
        <el-table-column prop="handler_name" label="处理人" width="80"/><el-table-column prop="region_name" label="区域" width="90"/><el-table-column prop="create_time" label="创建时间" width="160"/>
        <el-table-column label="操作" width="200" fixed="right"><template #default="{row}"><el-button size="small" @click="$router.push(`/workorder/detail/${row.order_id}`)">详情</el-button><el-button v-if="row.status===1" size="small" type="primary" @click="assignRow(row)">指派</el-button></template></el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" :page-sizes="[10,20,50]" layout="total,sizes,prev,pager,next" @size-change="load" @current-change="load"/></div>
    </div>
    <el-dialog v-model="av" title="指派工单" width="400px"><el-form><el-form-item label="处理人"><el-select v-model="at" style="width:100%"><el-option v-for="u in users" :key="u.user_id" :label="u.real_name" :value="u.user_id"/></el-select></el-form-item></el-form><template #footer><el-button @click="av=false">取消</el-button><el-button type="primary" @click="doAssign" :loading="aing">确认</el-button></template></el-dialog>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue';import {getWorkOrders,getRegions,getAllUsers,getStatusLabel as gl,assignWorkOrder} from '@/api';import {ElMessage} from 'element-plus';import * as XLSX from 'xlsx'
const loading=ref(false),list=ref([]),regions=ref([]),users=ref([]),av=ref(false),aing=ref(false),at=ref(''),aid=ref(null)
const st={1:'待处理',2:'处理中',3:'已回单',4:'已退单',5:'已关闭'}
const s=reactive({order_no:'',title:'',status:'',priority:'',region_id:''})
const p=reactive({page:1,pageSize:10,total:0})
function tag(s){return{1:'warning',2:'primary',3:'success',4:'danger',5:'info'}[s]||'info'}
async function load(){loading.value=true;try{const r=await getWorkOrders({...s,...p});list.value=r.records;p.total=r.total}finally{loading.value=false}}
function search(){p.page=1;load()}
function reset(){Object.assign(s,{order_no:'',title:'',status:'',priority:'',region_id:''});search()}
function assignRow(r){aid.value=r.order_id;at.value='';av.value=true}
async function doAssign(){if(!at.value){ElMessage.warning('请选择处理人');return};aing.value=true;try{await assignWorkOrder(aid.value,at.value);ElMessage.success('指派成功');av.value=false;load()}catch(e){ElMessage.error(e.message)}finally{aing.value=false}}
function exportExcel(){const ws=XLSX.utils.json_to_sheet(list.value);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'工单');XLSX.writeFile(wb,'工单导出.xlsx');ElMessage.success('导出成功')}
onMounted(async()=>{regions.value=await getRegions();users.value=await getAllUsers();load()})
</script>
