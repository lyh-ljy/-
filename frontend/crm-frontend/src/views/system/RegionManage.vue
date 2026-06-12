<template>
  <div class="page-container"><h2 style="margin-bottom:16px;">区域管理</h2>
    <div class="table-box"><div style="margin-bottom:16px;"><el-button type="primary" @click="add()"><el-icon><Plus/></el-icon>新增顶级区域</el-button></div>
      <el-table :data="tree" row-key="region_id" v-loading="loading" stripe default-expand-all>
        <el-table-column prop="region_name" label="区域名称" min-width="200"/><el-table-column prop="region_code" label="编码" width="150"/>
        <el-table-column label="层级" width="100"><template #default="{row}"><el-tag size="small" :type="row.region_level===1?'primary':row.region_level===2?'success':'warning'">{{row.region_level===1?'一级':row.region_level===2?'二级':'三级'}}</el-tag></template></el-table-column>
        <el-table-column prop="sort_order" label="排序" width="80"/>
        <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'danger'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="200"><template #default="{row}"><el-button size="small" @click="add(row)">添加子区域</el-button><el-button size="small" @click="edit(row)">编辑</el-button><el-button size="small" type="danger" @click="del(row)">删除</el-button></template></el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dv" :title="iedit?'编辑区域':'新增区域'" width="500px"><el-form ref="ff" :model="fm" :rules="fr" label-width="100px"><el-form-item label="上级"><el-input :value="pn" disabled/></el-form-item><el-form-item label="名称" prop="region_name"><el-input v-model="fm.region_name"/></el-form-item><el-form-item label="编码" prop="region_code"><el-input v-model="fm.region_code"/></el-form-item><el-form-item label="层级"><el-input-number v-model="fm.region_level" :min="1" :max="3"/></el-form-item><el-form-item label="排序"><el-input-number v-model="fm.sort_order" :min="0"/></el-form-item><el-form-item label="状态"><el-switch v-model="fm.status" :active-value="1" :inactive-value="0"/></el-form-item></el-form><template #footer><el-button @click="dv=false">取消</el-button><el-button type="primary" @click="submit" :loading="ing">确认</el-button></template></el-dialog>
  </div>
</template>

<script setup>
import {ref,reactive,computed,onMounted} from 'vue';import {getRegions} from '@/api';import {ElMessage,ElMessageBox} from 'element-plus'
const loading=ref(false),tree=ref([]),dv=ref(false),ing=ref(false),ff=ref(null),iedit=ref(false),eid=ref(null),pid=ref(0)
const fm=reactive({region_name:'',region_code:'',region_level:2,sort_order:0,status:1,parent_id:0})
const fr={region_name:[{required:true,message:'请输入名称',trigger:'blur'}],region_code:[{required:true,message:'请输入编码',trigger:'blur'}]}
const pn=computed(()=>{if(pid.value===0)return'顶级';const f=(l)=>{for(const i of l){if(i.region_id===pid.value)return i.region_name;if(i.children){const r=f(i.children);if(r)return r}}return null};return f(tree.value)||'-'})
function bt(list,pid=0){return list.filter(i=>i.parent_id===pid).map(i=>({...i,children:bt(list,i.region_id)}))}
async function load(){loading.value=true;try{tree.value=bt(await getRegions())}finally{loading.value=false}}
function rf(){Object.assign(fm,{region_name:'',region_code:'',region_level:2,sort_order:0,status:1,parent_id:pid.value})}
function add(p){iedit.value=false;eid.value=null;pid.value=p?p.region_id:0;rf();dv.value=true}
function edit(r){iedit.value=true;eid.value=r.region_id;pid.value=r.parent_id;Object.assign(fm,{region_name:r.region_name,region_code:r.region_code,region_level:r.region_level,sort_order:r.sort_order,status:r.status,parent_id:r.parent_id});dv.value=true}
async function del(r){await ElMessageBox.confirm(`确定删除"${r.region_name}"及其子区域?`,'提示',{type:'warning'});const all=JSON.parse(localStorage.getItem('crm_regions')||'[]');const ds=new Set();function c(l,pid){l.forEach(i=>{if(i.parent_id===pid){ds.add(i.region_id);c(l,i.region_id)}})};ds.add(r.region_id);c(all,r.region_id);localStorage.setItem('crm_regions',JSON.stringify(all.filter(i=>!ds.has(i.region_id))));ElMessage.success('删除成功');load()}
async function submit(){const v=await ff.value.validate().catch(()=>false);if(!v)return;ing.value=true;try{const all=JSON.parse(localStorage.getItem('crm_regions')||'[]');if(iedit.value){const i=all.findIndex(rr=>rr.region_id===eid.value);if(i!==-1)Object.assign(all[i],fm)}else{all.push({...fm,region_id:all.length>0?Math.max(...all.map(rr=>rr.region_id))+1:1,parent_id:pid.value})};localStorage.setItem('crm_regions',JSON.stringify(all));ElMessage.success(iedit.value?'修改成功':'新增成功');dv.value=false;load()}finally{ing.value=false}}
onMounted(load)
</script>
