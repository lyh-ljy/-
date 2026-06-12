<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">人员管理</h2>
    <div class="search-box"><el-form :model="s" inline>
      <el-form-item label="用户名"><el-input v-model="s.username" clearable style="width:150px"/></el-form-item>
      <el-form-item label="真实姓名"><el-input v-model="s.real_name" clearable style="width:150px"/></el-form-item>
      <el-form-item label="手机号"><el-input v-model="s.phone" clearable style="width:150px"/></el-form-item>
      <el-form-item label="状态"><el-select v-model="s.status" clearable style="width:120px"><el-option label="启用" :value="1"/><el-option label="禁用" :value="0"/></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
    </el-form></div>
    <div class="table-box"><div class="toolbar"><el-button type="primary" @click="$router.push('/user/add')"><el-icon><Plus/></el-icon>新增人员</el-button></div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="username" label="用户名" width="120"/><el-table-column prop="real_name" label="真实姓名" width="100"/>
        <el-table-column label="性别" width="70"><template #default="{row}">{{{0:'未知',1:'男',2:'女'}[row.gender]||'-'}}</template></el-table-column>
        <el-table-column label="手机号" width="130"><template #default="{row}">{{row.phone?row.phone.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2'):'-'}}</template></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip/><el-table-column prop="dept_name" label="部门" width="100"/>
        <el-table-column label="角色" width="110"><template #default="{row}"><el-tag size="small" :type="row.role_id===1?'danger':row.role_id===2?'warning':'info'">{{row.role_name}}</el-tag></template></el-table-column>
        <el-table-column prop="position" label="职位" width="110"/>
        <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'danger'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag></template></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160"/>
        <el-table-column label="操作" width="200" fixed="right"><template #default="{row}"><el-button size="small" @click="$router.push(`/user/edit/${row.user_id}`)">编辑</el-button><el-button size="small" type="danger" @click="del(row)" :disabled="row.user_id===1">{{row.status===1?'禁用':'删除'}}</el-button></template></el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right;"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" :page-sizes="[10,20,50]" layout="total,sizes,prev,pager,next" @size-change="load" @current-change="load"/></div>
    </div>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue';import {getUsers,deleteUser} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus'
const loading=ref(false),list=ref([])
const s=reactive({username:'',real_name:'',phone:'',status:''})
const p=reactive({page:1,pageSize:10,total:0})
async function load(){loading.value=true;try{const r=await getUsers({...s,...p});list.value=r.records;p.total=r.total}finally{loading.value=false}}
function search(){p.page=1;load()}
function reset(){Object.assign(s,{username:'',real_name:'',phone:'',status:''});search()}
async function del(row){const a=row.status===1?'禁用':'删除';await ElMessageBox.confirm(`确定${a}"${row.real_name}"?`,'提示',{type:'warning'});await deleteUser(row.user_id);ElMessage.success(`${a}成功`);load()}
onMounted(load)
</script>
