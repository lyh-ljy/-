<template>
  <div class="page-container"><h2 style="margin-bottom:20px;">仪表盘</h2>
    <el-row :gutter="16" style="margin-bottom:20px;"><el-col :span="6" v-for="card in cards" :key="card.label"><div class="stat-card" @click="$router.push(card.link)"><div class="sc-icon" :style="{background:card.bg}"><el-icon :size="24"><component :is="card.icon"/></el-icon></div><div class="sc-info"><div class="sc-val">{{card.value}}</div><div class="sc-label">{{card.label}}</div></div></div></el-col></el-row>
    <el-row :gutter="16">
      <el-col :span="12"><div class="table-box" style="height:380px;"><h3 style="margin-bottom:16px;">工单状态分布</h3><div ref="chartRef" style="width:100%;height:320px;"></div></div></el-col>
      <el-col :span="12"><div class="table-box" style="height:380px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3>最近工单</h3><el-button type="primary" size="small" @click="$router.push('/workorder/add')">+ 新建工单</el-button></div><el-table :data="recent" size="small" max-height="300"><el-table-column prop="order_no" label="编号" width="150"/><el-table-column prop="title" label="标题" show-overflow-tooltip/><el-table-column prop="customer_name" label="客户" width="120"/><el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="stag(row.status)" size="small">{{gl('work_order_status',row.status)}}</el-tag></template></el-table-column></el-table></div></el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted,nextTick} from 'vue'
import {getDashboardStats,getWorkOrders,getStatusLabel as gl} from '@/api'
import * as echarts from 'echarts'
const chartRef=ref(null),recent=ref([])
const cards=reactive([{label:'客户总数',value:0,icon:'UserFilled',bg:'linear-gradient(135deg,#667eea,#764ba2)',link:'/customer'},{label:'业务总数',value:0,icon:'Document',bg:'linear-gradient(135deg,#f093fb,#f5576c)',link:'/business'},{label:'工单总数',value:0,icon:'Tickets',bg:'linear-gradient(135deg,#4facfe,#00f2fe)',link:'/workorder'},{label:'待处理工单',value:0,icon:'WarningFilled',bg:'linear-gradient(135deg,#fa709a,#fee140)',link:'/workorder'}])
function stag(s){return{1:'warning',2:'primary',3:'success',4:'danger',5:'info'}[s]||'info'}
onMounted(async()=>{const s=await getDashboardStats();cards[0].value=s.customerCount;cards[1].value=s.businessCount;cards[2].value=s.workOrderCount;cards[3].value=s.pendingCount;const r=await getWorkOrders({page:1,pageSize:10});recent.value=r.records;await nextTick();if(chartRef.value){const c=echarts.init(chartRef.value);c.setOption({tooltip:{trigger:'item'},legend:{bottom:'0%'},series:[{type:'pie',radius:['45%','70%'],itemStyle:{borderRadius:6,borderColor:'#fff',borderWidth:3},label:{show:true,formatter:'{b}: {c}'},data:s.workOrderByStatus.filter(d=>d.value>0)}]})}})
</script>

<style scoped>
.stat-card{display:flex;align-items:center;gap:16px}.sc-icon{width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}.sc-val{font-size:28px;font-weight:bold;color:#303133}.sc-label{font-size:14px;color:#909399;margin-top:4px}
</style>
