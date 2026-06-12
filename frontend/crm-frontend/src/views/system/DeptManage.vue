<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">部门管理</h2>
    <div class="table-box"><div style="margin-bottom:16px;"><el-button type="primary" @click="add()"><el-icon><Plus/></el-icon>新增顶级部门</el-button></div>
      <el-table :data="tree" row-key="dept_id" v-loading="loading" stripe default-expand-all>
        <el-table-column prop="dept_name" label="部门名称" min-width="200"/><el-table-column prop="dept_code" label="编码" width="150"/>
        <el-table-column prop="phone" label="电话" width="130"/><el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip/>
        <el-table-column prop="sort_order" label="排序" width="80"/>
        <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'danger'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="200"><template #default="{row}"><el-button size="small" @click="add(row)">添加子部门</el-button><el-button size="small" @click="edit(row)">编辑</el-button><el-button size="small" type="danger" @click="del(row)">删除</el-button></template></el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dv" :title="iedit?'编辑部门':'新增部门'" width="500px"><el-form ref="ff" :model="fm" :rules="fr" label-width="100px"><el-form-item label="上级"><el-input :value="pn" disabled/></el-form-item><el-form-item label="名称" prop="dept_name"><el-input v-model="fm.dept_name"/></el-form-item><el-form-item label="编码" prop="dept_code"><el-input v-model="fm.dept_code"/></el-form-item><el-form-item label="电话"><el-input v-model="fm.phone"/></el-form-item><el-form-item label="邮箱"><el-input v-model="fm.email"/></el-form-item><el-form-item label="排序"><el-input-number v-model="fm.sort_order" :min="0"/></el-form-item><el-form-item label="状态"><el-switch v-model="fm.status" :active-value="1" :inactive-value="0"/></el-form-item></el-form><template #footer><el-button @click="dv=false">取消</el-button><el-button type="primary" @click="submit" :loading="ing">确认</el-button></template></el-dialog>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {getDepartments} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus'
const loading=ref(false),tree=ref([]),dv=ref(false),ing=ref(false),ff=ref(null),iedit=ref(false),eid=ref(null),pid=ref(0)
const fm=reactive({dept_name:'',dept_code:'',phone:'',email:'',sort_order:0,status:1,parent_id:0})
const fr={dept_name:[{required:true,message:'请输入名称',trigger:'blur'}],dept_code:[{required:true,message:'请输入编码',trigger:'blur'}]}
const pn=computed(()=>{if(pid.value===0)return'顶级';const f=(l)=>{for(const i of l){if(i.dept_id===pid.value)return i.dept_name;if(i.children){const r=f(i.children);if(r)return r}}return null};return f(tree.value)||'-'})
function bt(list,pid=0){return list.filter(d=>d.parent_id===pid).map(d=>({...d,children:bt(list,d.dept_id)}))}
async function load(){loading.value=true;try{tree.value=bt(await getDepartments())}finally{loading.value=false}}
function rf(){Object.assign(fm,{dept_name:'',dept_code:'',phone:'',email:'',sort_order:0,status:1,parent_id:pid.value})}
function add(p){iedit.value=false;eid.value=null;pid.value=p?p.dept_id:0;rf();dv.value=true}
function edit(r){iedit.value=true;eid.value=r.dept_id;pid.value=r.parent_id;Object.assign(fm,{dept_name:r.dept_name,dept_code:r.dept_code,phone:r.phone||'',email:r.email||'',sort_order:r.sort_order,status:r.status,parent_id:r.parent_id});dv.value=true}
async function del(r){await ElMessageBox.confirm(`确定删除"${r.dept_name}"及其子部门?`,'提示',{type:'warning'});const all=JSON.parse(localStorage.getItem('crm_departments')||'[]');const ds=new Set();function c(l,pid){l.forEach(d=>{if(d.parent_id===pid){ds.add(d.dept_id);c(l,d.dept_id)}})};ds.add(r.dept_id);c(all,r.dept_id);localStorage.setItem('crm_departments',JSON.stringify(all.filter(d=>!ds.has(d.dept_id))));ElMessage.success('删除成功');load()}
async function submit(){const v=await ff.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{const all=JSON.parse(localStorage.getItem('crm_departments')||'[]');if(iedit.value){const i=all.findIndex(dd=>dd.dept_id===eid.value);if(i!==-1)Object.assign(all[i],fm)}else{all.push({...fm,dept_id:all.length>0?Math.max(...all.map(dd=>dd.dept_id))+1:1,parent_id:pid.value})};localStorage.setItem('crm_departments',JSON.stringify(all));ElMessage.success(iedit.value?'修改成功':'新增成功');dv.value=false;load()}finally{ing.value=false}}
onMounted(load)
</script>
