<template>
  <div class="page-container"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><el-button @click="$router.back()">返回</el-button><h2>{{isEdit?'编辑业务':'新增业务'}}</h2></div>
    <div class="table-box" v-loading="loading"><el-form ref="f" :model="d" :rules="r" label-width="100px" style="max-width:800px;">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="20"><el-col :span="16"><el-form-item label="业务名称" prop="business_name"><el-input v-model="d.business_name"/></el-form-item></el-col><el-col :span="8"><el-form-item label="业务类型" prop="business_type"><el-select v-model="d.business_type" style="width:100%"><el-option label="产品销售" :value="1"/><el-option label="技术服务" :value="2"/><el-option label="咨询服务" :value="3"/><el-option label="售后服务" :value="4"/><el-option label="其他" :value="5"/></el-select></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="分类"><el-input v-model="d.category"/></el-form-item></el-col><el-col :span="12"><el-form-item label="关联客户"><el-select v-model="d.customer_id" style="width:100%" clearable filterable><el-option v-for="c in customers" :key="c.customer_id" :label="c.customer_name" :value="c.customer_id"/></el-select></el-form-item></el-col></el-row>
      <el-form-item label="描述"><el-input v-model="d.description" type="textarea" :rows="3"/></el-form-item>
      <el-divider content-position="left">金额与合同</el-divider>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="金额"><el-input-number v-model="d.amount" :min="0" :step="1000" :precision="2" style="width:100%"/></el-form-item></el-col><el-col :span="12"><el-form-item label="合同编号"><el-input v-model="d.contract_no"/></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="开始日期"><el-date-picker v-model="d.start_time" type="date" style="width:100%" value-format="YYYY-MM-DD"/></el-form-item></el-col><el-col :span="12"><el-form-item label="结束日期"><el-date-picker v-model="d.end_time" type="date" style="width:100%" value-format="YYYY-MM-DD"/></el-form-item></el-col></el-row>
      <el-divider content-position="left">其他</el-divider>
      <el-row :gutter="20"><el-col :span="8"><el-form-item label="优先级"><el-select v-model="d.priority" style="width:100%"><el-option label="高" :value="1"/><el-option label="中" :value="2"/><el-option label="低" :value="3"/></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="状态"><el-select v-model="d.status" style="width:100%"><el-option label="进行中" :value="1"/><el-option label="已完成" :value="2"/><el-option label="暂停" :value="3"/><el-option label="取消" :value="4"/></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="进度(%)"><el-input-number v-model="d.progress" :min="0" :max="100" style="width:100%"/></el-form-item></el-col></el-row>
      <el-form-item label="负责人"><el-select v-model="d.owner_id" style="width:200px" clearable><el-option v-for="u in users" :key="u.user_id" :label="u.real_name" :value="u.user_id"/></el-select></el-form-item>
      <el-form-item label="备注"><el-input v-model="d.remark" type="textarea" :rows="2"/></el-form-item>
      <el-form-item><el-button type="primary" @click="submit" :loading="ing">{{isEdit?'保存':'确认新增'}}</el-button><el-button @click="$router.back()">取消</el-button></el-form-item>
    </el-form></div>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {useRoute,useRouter} from 'vue-router';import {getBusinessById,createBusiness,updateBusiness,getAllUsers,getAllCustomers} from '@/api';import {ElMessage} from 'element-plus'
const route=useRoute(),router=useRouter();const f=ref(null),loading=ref(false),ing=ref(false),users=ref([]),customers=ref([])
const isEdit=computed(()=>!!route.params.id);const bid=computed(()=>Number(route.params.id))
const d=reactive({business_name:'',business_type:1,category:'',customer_id:'',description:'',amount:null,contract_no:'',start_time:'',end_time:'',priority:2,status:1,progress:0,owner_id:'',remark:''})
const r={business_name:[{required:true,message:'请输入业务名称',trigger:'blur'}],business_type:[{required:true,message:'请选择业务类型',trigger:'change'}]}
async function loadData(){if(!isEdit.value)return;loading.value=true;try{Object.assign(d,await getBusinessById(bid.value))}finally{loading.value=false}}
async function submit(){const v=await f.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{if(isEdit.value){await updateBusiness(bid.value,d);ElMessage.success('修改成功')}else{await createBusiness(d);ElMessage.success('新增成功')}router.back()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
onMounted(async()=>{users.value=await getAllUsers();customers.value=await getAllCustomers();loadData()})
</script>
