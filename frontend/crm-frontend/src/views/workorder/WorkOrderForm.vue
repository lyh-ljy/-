<template>
  <div class="page-container"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><el-button @click="$router.back()">返回</el-button><h2>新建工单</h2></div>
    <div class="table-box"><el-form ref="f" :model="d" :rules="r" label-width="100px" style="max-width:800px;">
      <el-divider content-position="left">关联信息 <span style="color:#f56c6c">*</span></el-divider>
      <el-form-item label="关联客户" prop="customer_id"><el-select v-model="d.customer_id" filterable style="width:100%" @change="onCus"><el-option v-for="c in customers" :key="c.customer_id" :label="`${c.customer_name}(${c.customer_no})`" :value="c.customer_id"/></el-select></el-form-item>
      <el-form-item label="关联业务" prop="business_id"><el-select v-model="d.business_id" filterable style="width:100%"><el-option v-for="b in fBiz" :key="b.business_id" :label="`${b.business_name}(${b.business_no})`" :value="b.business_id"/></el-select></el-form-item>
      <el-divider content-position="left">工单信息</el-divider>
      <el-form-item label="标题" prop="title"><el-input v-model="d.title"/></el-form-item>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="类型" prop="order_type"><el-select v-model="d.order_type" style="width:100%"><el-option label="咨询" :value="1"/><el-option label="投诉" :value="2"/><el-option label="服务" :value="3"/><el-option label="维修" :value="4"/><el-option label="其他" :value="5"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="优先级"><el-select v-model="d.priority" style="width:100%"><el-option label="紧急" :value="1"/><el-option label="高" :value="2"/><el-option label="中" :value="3"/><el-option label="低" :value="4"/></el-select></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="来源"><el-select v-model="d.source" style="width:100%" clearable><el-option label="电话" value="电话"/><el-option label="邮件" value="邮件"/><el-option label="在线" value="在线"/><el-option label="现场" value="现场"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="渠道"><el-input v-model="d.channel"/></el-form-item></el-col></el-row>
      <el-form-item label="区域"><el-select v-model="d.region_id" style="width:200px" clearable><el-option v-for="r in regions" :key="r.region_id" :label="r.region_name" :value="r.region_id"/></el-select></el-form-item>
      <el-form-item label="预期完成"><el-date-picker v-model="d.expected_time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"/></el-form-item>
      <el-form-item label="详细描述"><el-input v-model="d.description" type="textarea" :rows="4"/></el-form-item>
      <el-form-item><el-button type="primary" @click="submit" :loading="ing">创建工单</el-button><el-button @click="$router.back()">取消</el-button></el-form-item>
    </el-form></div>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {useRouter} from 'vue-router';import {createWorkOrder,getAllCustomers,getBusinesses,getRegions} from '@/api';import {ElMessage} from 'element-plus'
const router=useRouter();const f=ref(null);const ing=ref(false);const customers=ref([]);const allBiz=ref([]);const regions=ref([])
const d=reactive({customer_id:'',business_id:'',title:'',order_type:3,priority:2,source:'',channel:'',region_id:'',expected_time:'',description:''})
const r={customer_id:[{required:true,message:'请选择客户',trigger:'change'}],business_id:[{required:true,message:'请选择业务',trigger:'change'}],title:[{required:true,message:'请输入标题',trigger:'blur'}],order_type:[{required:true,message:'请选择类型',trigger:'change'}]}
const fBiz=computed(()=>{if(!d.customer_id)return allBiz.value;return allBiz.value.filter(b=>b.customer_id===d.customer_id)})
function onCus(){d.business_id='';const c=customers.value.find(c=>c.customer_id===d.customer_id);if(c)d.region_id=c.region_id||''}
async function submit(){const v=await f.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{await createWorkOrder(d);ElMessage.success('创建成功');router.back()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
onMounted(async()=>{customers.value=await getAllCustomers();const{records}=await getBusinesses({page:1,pageSize:999});allBiz.value=records;regions.value=await getRegions()})
</script>
