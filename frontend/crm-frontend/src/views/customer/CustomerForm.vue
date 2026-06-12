<template>
  <div class="page-container"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><el-button @click="$router.back()">返回</el-button><h2>{{isEdit?'编辑客户':'新增客户'}}</h2></div>
    <div class="table-box" v-loading="loading"><el-form ref="f" :model="d" :rules="r" label-width="100px" style="max-width:800px;">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="客户名称" prop="customer_name"><el-input v-model="d.customer_name"/></el-form-item></el-col><el-col :span="12"><el-form-item label="客户类型" prop="customer_type"><el-select v-model="d.customer_type" style="width:100%"><el-option label="个人" :value="1"/><el-option label="企业" :value="2"/><el-option label="政府" :value="3"/><el-option label="其他" :value="4"/></el-select></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="行业"><el-select v-model="d.industry" style="width:100%" clearable><el-option label="IT/互联网" value="IT/互联网"/><el-option label="金融" value="金融"/><el-option label="教育" value="教育"/><el-option label="制造" value="制造"/><el-option label="医疗" value="医疗"/><el-option label="零售" value="零售"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="客户等级" prop="customer_level"><el-select v-model="d.customer_level" style="width:100%"><el-option label="普通" :value="1"/><el-option label="重要" :value="2"/><el-option label="VIP" :value="3"/><el-option label="战略" :value="4"/></el-select></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="来源"><el-select v-model="d.source" style="width:100%" clearable><el-option label="线上推广" value="线上推广"/><el-option label="线下活动" value="线下活动"/><el-option label="转介绍" value="转介绍"/><el-option label="自主开发" value="自主开发"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="信用评级"><el-select v-model="d.credit_rating" style="width:100%" clearable><el-option label="AAA" value="AAA"/><el-option label="AA" value="AA"/><el-option label="A" value="A"/><el-option label="B" value="B"/></el-select></el-form-item></el-col></el-row>
      <el-divider content-position="left">联系信息</el-divider>
      <el-row :gutter="20"><el-col :span="8"><el-form-item label="国家"><el-input v-model="d.country"/></el-form-item></el-col><el-col :span="8"><el-form-item label="省份"><el-input v-model="d.province"/></el-form-item></el-col><el-col :span="8"><el-form-item label="城市"><el-input v-model="d.city"/></el-form-item></el-col></el-row>
      <el-form-item label="详细地址"><el-input v-model="d.detail_address"/></el-form-item>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="区域"><el-select v-model="d.region_id" style="width:100%" clearable><el-option v-for="r in regions" :key="r.region_id" :label="r.region_name" :value="r.region_id"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="负责人"><el-select v-model="d.owner_id" style="width:100%" clearable><el-option v-for="u in users" :key="u.user_id" :label="u.real_name" :value="u.user_id"/></el-select></el-form-item></el-col></el-row>
      <el-form-item label="官网"><el-input v-model="d.website"/></el-form-item>
      <el-form-item label="备注"><el-input v-model="d.remark" type="textarea" :rows="3"/></el-form-item>
      <el-form-item><el-button type="primary" @click="submit" :loading="ing">{{isEdit?'保存':'确认新增'}}</el-button><el-button @click="$router.back()">取消</el-button></el-form-item>
    </el-form></div>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {useRoute,useRouter} from 'vue-router';import {getCustomerById,createCustomer,updateCustomer,getRegions,getAllUsers} from '@/api';import {ElMessage} from 'element-plus'
const route=useRoute(),router=useRouter();const f=ref(null),loading=ref(false),ing=ref(false),regions=ref([]),users=ref([])
const isEdit=computed(()=>!!route.params.id)
const d=reactive({customer_name:'',customer_type:2,industry:'',customer_level:1,source:'',credit_rating:'',country:'中国',province:'',city:'',detail_address:'',region_id:'',owner_id:'',website:'',remark:''})
const r={customer_name:[{required:true,message:'请输入客户名称',trigger:'blur'}],customer_type:[{required:true,message:'请选择客户类型',trigger:'change'}],customer_level:[{required:true,message:'请选择客户等级',trigger:'change'}]}
async function loadData(){if(!isEdit.value)return;loading.value=true;try{Object.assign(d,await getCustomerById(Number(route.params.id)))}finally{loading.value=false}}
async function submit(){const v=await f.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{if(isEdit.value){await updateCustomer(Number(route.params.id),d);ElMessage.success('修改成功')}else{await createCustomer(d);ElMessage.success('新增成功')}router.back()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
onMounted(async()=>{regions.value=await getRegions();users.value=await getAllUsers();loadData()})
</script>
