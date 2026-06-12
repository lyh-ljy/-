<template>
  <div class="page-container"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><el-button @click="$router.back()">返回</el-button><h2>{{isEdit?'编辑人员':'新增人员'}}</h2></div>
    <div class="table-box" v-loading="loading"><el-form ref="f" :model="d" :rules="r" label-width="100px" style="max-width:700px;">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="用户名" prop="username"><el-input v-model="d.username" :disabled="isEdit"/></el-form-item></el-col><el-col :span="12"><el-form-item label="真实姓名" prop="real_name"><el-input v-model="d.real_name"/></el-form-item></el-col></el-row>
      <el-row :gutter="20" v-if="!isEdit"><el-col :span="12"><el-form-item label="密码" prop="password"><el-input v-model="d.password" type="password" show-password/></el-form-item></el-col><el-col :span="12"><el-form-item label="确认密码" prop="cpw"><el-input v-model="d.cpw" type="password" show-password/></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="8"><el-form-item label="性别"><el-select v-model="d.gender" style="width:100%"><el-option label="未知" :value="0"/><el-option label="男" :value="1"/><el-option label="女" :value="2"/></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="手机号"><el-input v-model="d.phone"/></el-form-item></el-col><el-col :span="8"><el-form-item label="邮箱"><el-input v-model="d.email"/></el-form-item></el-col></el-row>
      <el-divider content-position="left">组织信息</el-divider>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="部门"><el-cascader v-model="d.dept_id" :options="depts" :props="{value:'dept_id',label:'dept_name',checkStrictly:true,emitPath:false}" style="width:100%" clearable/></el-form-item></el-col><el-col :span="12"><el-form-item label="职位"><el-input v-model="d.position"/></el-form-item></el-col></el-row>
      <el-row :gutter="20"><el-col :span="12"><el-form-item label="角色" prop="role_id"><el-select v-model="d.role_id" style="width:100%"><el-option v-for="r in roles" :key="r.role_id" :label="r.role_name" :value="r.role_id"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="区域"><el-select v-model="d.region_id" style="width:100%" clearable><el-option v-for="r in regions" :key="r.region_id" :label="r.region_name" :value="r.region_id"/></el-select></el-form-item></el-col></el-row>
      <el-form-item label="昵称"><el-input v-model="d.nickname"/></el-form-item>
      <el-form-item label="备注"><el-input v-model="d.remark" type="textarea" :rows="2"/></el-form-item>
      <el-form-item><el-button type="primary" @click="submit" :loading="ing">{{isEdit?'保存':'确认新增'}}</el-button><el-button @click="$router.back()">取消</el-button></el-form-item>
    </el-form></div>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {useRoute,useRouter} from 'vue-router';import {getUserById,createUser,updateUser,getRoles,getDepartments,getRegions} from '@/api';import {ElMessage} from 'element-plus'
const route=useRoute(),router=useRouter();const f=ref(null),loading=ref(false),ing=ref(false),roles=ref([]),depts=ref([]),regions=ref([])
const isEdit=computed(()=>!!route.params.id)
const d=reactive({username:'',password:'',cpw:'',real_name:'',gender:0,phone:'',email:'',dept_id:'',position:'',role_id:4,region_id:'',nickname:'',remark:''})
const r={username:[{required:true,message:'请输入用户名',trigger:'blur'}],real_name:[{required:true,message:'请输入真实姓名',trigger:'blur'}],password:[{required:true,message:'请输入密码',trigger:'blur'},{min:6,message:'至少6位',trigger:'blur'}],cpw:[{required:true,message:'请确认密码',trigger:'blur'},{validator:(r,v,cb)=>{if(v!==d.password)cb(new Error('两次不一致'));else cb()},trigger:'blur'}],role_id:[{required:true,message:'请选择角色',trigger:'change'}]}
function buildTree(list,pid=0){return list.filter(i=>i.parent_id===pid).map(i=>({...i,children:buildTree(list,i.dept_id)}))}
async function loadData(){if(!isEdit.value)return;loading.value=true;try{const data=await getUserById(Number(route.params.id));Object.assign(d,data)}finally{loading.value=false}}
async function submit(){const v=await f.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{const data={...d};delete data.cpw;if(isEdit.value)delete data.password;if(isEdit.value){await updateUser(Number(route.params.id),data);ElMessage.success('修改成功')}else{await createUser(data);ElMessage.success('新增成功')}router.back()}catch(e){ElMessage.error(e.message)}finally{ing.value=false}}
onMounted(async()=>{roles.value=await getRoles();depts.value=buildTree(await getDepartments());regions.value=await getRegions();loadData()})
</script>
