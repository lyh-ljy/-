<template>
  <div class="page-container" v-loading="loading"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><el-button @click="$router.back()">返回</el-button><h2>工单详情 - {{o.order_no}}</h2></div>
    <el-row :gutter="16">
      <el-col :span="16">
        <div class="table-box" style="margin-bottom:16px;"><h3 style="margin-bottom:16px;">工单信息</h3><el-descriptions :column="2" border size="small"><el-descriptions-item label="编号">{{o.order_no}}</el-descriptions-item><el-descriptions-item label="状态"><el-tag :type="tag(o.status)">{{gl('work_order_status',o.status)}}</el-tag></el-descriptions-item><el-descriptions-item label="标题" :span="2">{{o.title}}</el-descriptions-item><el-descriptions-item label="类型">{{gl('work_order_type',o.order_type)}}</el-descriptions-item><el-descriptions-item label="优先级"><el-tag :type="o.priority===1?'danger':o.priority===2?'warning':''" size="small">{{gl('work_order_priority',o.priority)}}</el-tag></el-descriptions-item><el-descriptions-item label="来源">{{o.source||'-'}}</el-descriptions-item><el-descriptions-item label="渠道">{{o.channel||'-'}}</el-descriptions-item><el-descriptions-item label="区域">{{(o.region||{}).region_name||'-'}}</el-descriptions-item><el-descriptions-item label="处理人">{{(o.handler||{}).real_name||'未指派'}}</el-descriptions-item><el-descriptions-item label="创建人">{{(o.creator||{}).real_name||'-'}}</el-descriptions-item><el-descriptions-item label="创建时间">{{o.create_time}}</el-descriptions-item><el-descriptions-item label="预期完成">{{o.expected_time||'-'}}</el-descriptions-item><el-descriptions-item label="描述" :span="2">{{o.description||'无'}}</el-descriptions-item></el-descriptions></div>
        <div class="table-box" style="margin-bottom:16px;" v-if="o.reply_content||o.return_reason"><h3 style="margin-bottom:12px;">处理结果</h3><el-alert v-if="o.reply_content" title="回单内容" type="success" :closable="false" style="margin-bottom:10px;">{{o.reply_content}}</el-alert><el-alert v-if="o.return_reason" title="退单原因" type="error" :closable="false">{{o.return_reason}}</el-alert></div>
        <div class="table-box" style="margin-bottom:16px;" v-if="showAct"><h3 style="margin-bottom:12px;">操作</h3><el-space><el-button v-if="o.status===2" type="success" @click="shRp=true"><el-icon><CircleCheck/></el-icon>回单</el-button><el-button v-if="o.status===1||o.status===2" type="danger" @click="shRt=true"><el-icon><CircleClose/></el-icon>退单</el-button><el-button v-if="o.status===3" type="primary" @click="doClose"><el-icon><Lock/></el-icon>关闭</el-button></el-space></div>
      </el-col>
      <el-col :span="8">
        <div class="table-box" style="margin-bottom:16px;"><h3 style="margin-bottom:12px;">关联客户</h3><div v-if="o.customer"><p><strong>{{o.customer.customer_name}}</strong></p><p style="color:#909399;font-size:13px;">{{o.customer.customer_no}}</p><p style="color:#909399;font-size:13px;">{{gl('customer_type',o.customer.customer_type)}}</p></div></div>
        <div class="table-box" style="margin-bottom:16px;"><h3 style="margin-bottom:12px;">关联业务</h3><div v-if="o.business"><p><strong>{{o.business.business_name}}</strong></p><p style="color:#909399;font-size:13px;">{{o.business.business_no}}</p><p v-if="o.business.amount" style="color:#909399;font-size:13px;">¥{{Number(o.business.amount).toLocaleString()}}</p></div></div>
      </el-col>
    </el-row>
    <div class="table-box"><h3 style="margin-bottom:16px;">流转日志</h3><el-timeline><el-timeline-item v-for="l in logs" :key="l.log_id" :timestamp="l.create_time" :color="lc(l.operation_type)"><p><strong>{{l.operator_name}}</strong> - {{l.operation_type==='CREATE'?'创建':l.operation_type==='ASSIGN'?'指派':l.operation_type==='REPLY'?'回单':l.operation_type==='RETURN'?'退单':'关闭'}}</p><p style="color:#909399;font-size:13px;">{{l.content}}</p></el-timeline-item></el-timeline></div>
    <el-dialog v-model="shRp" title="回单" width="500px"><el-form><el-form-item label="内容" required><el-input v-model="rc" type="textarea" :rows="4"/></el-form-item></el-form><template #footer><el-button @click="shRp=false">取消</el-button><el-button type="primary" @click="doRp" :loading="ing">确认</el-button></template></el-dialog>
    <el-dialog v-model="shRt" title="退单" width="500px"><el-form><el-form-item label="原因" required><el-input v-model="rr" type="textarea" :rows="4"/></el-form-item></el-form><template #footer><el-button @click="shRt=false">取消</el-button><el-button type="danger" @click="doRt" :loading="ing">确认</el-button></template></el-dialog>
  </div>
</template>

<script setup>
import {ref,computed,onMounted} from 'vue';import {useRoute} from 'vue-router';import {getWorkOrderById,getWorkOrderLogs,replyWorkOrder,returnWorkOrder,closeWorkOrder,getStatusLabel as gl} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus'
const route=useRoute();const loading=ref(false),ing=ref(false),o=ref({}),logs=ref([]),shRp=ref(false),shRt=ref(false),rc=ref(''),rr=ref('')
const id=computed(()=>Number(route.params.id));const showAct=computed(()=>[1,2,3].includes(o.value.status))
function tag(s){return{1:'warning',2:'primary',3:'success',4:'danger',5:'info'}[s]||'info'}
function lc(t){return{CREATE:'#409eff',ASSIGN:'#e6a23c',REPLY:'#67c23a',RETURN:'#f56c6c',CLOSE:'#909399'}[t]||'#909399'}
async function load(){loading.value=true;try{o.value=await getWorkOrderById(id.value);logs.value=await getWorkOrderLogs(id.value)}finally{loading.value=false}}
async function doRp(){if(!rc.value.trim()){ElMessage.warning('请填写回单内容');return};ing.value=true;try{await replyWorkOrder(id.value,{replyContent:rc.value});ElMessage.success('回单成功');shRp.value=false;load()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
async function doRt(){if(!rr.value.trim()){ElMessage.warning('请填写退单原因');return};ing.value=true;try{await returnWorkOrder(id.value,{returnReason:rr.value});ElMessage.success('退单成功');shRt.value=false;load()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
async function doClose(){await ElMessageBox.confirm('确认关闭?','提示',{type:'warning'});await closeWorkOrder(id.value);ElMessage.success('已关闭');load()}
onMounted(load)
</script>
