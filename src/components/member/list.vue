<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
	    <!--工具条-->
	    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
	      <el-form :inline="true" :model="filters">
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="姓名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="ID码" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="手机" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="会员等级" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="推荐人" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="网点" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="handleSearch">查询</el-button>
	        </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="members" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange">
      	<el-table-column type="selection" width="55">
      	</el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="会员等级" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="ID码" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="推荐人" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="推荐网点" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="手机" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="150" sortable>
        	<template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delete(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDelete" :disabled="sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
      
      <!--编辑界面-->
      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="会员等级" prop="name">
          	<el-select v-model="editForm.province" placeholder="等级">
				      <el-option label="一级" value="shanghai"></el-option>
				      <el-option label="二级" value="beijing"></el-option>
				    </el-select>
          </el-form-item>
          <el-form-item label="推荐人" prop="author">
            <el-input v-model="editForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="推荐网点">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="description">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_member';
  import regions from '../../utils/regions';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        sels:[],
        members: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        editForm: {
          id: 0,
          name: '',
          author: '',
          publishAt: '',
          description: '',
          selectedRregion: ["130000", "130300", "130304"]
        },
        selectedRregion2: ["130000", "130300", "130304"],
        regions: regions
      }
    },
    created() {
    	//初始化
    	this.init();
    },
    mounted() {
      
    },
    methods: {
    	//初始化
    	init() {
    		this.handleSearch()
    	},
    	//查询
      handleSearch() {
        this.total = 0;
        this.page = 1;
        this.search();
      },
    	//修改
    	showEditDialog(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        console.log("editForm", this.editForm);
      },
      //修改提交
      updateSubmit() {
      	API.update(row.id).then(function (result) {
	        that.loading = false;
	        if (result && parseInt(result.errcode) === 0) {
	          that.$message.success({showClose: true, message: '删除成功', duration: 1500});
	          that.search();
	        }
	      }, function (err) {
	        that.loading = false;
	        that.$message.error({showClose: true, message: err.toString(), duration: 2000});
	      }).catch(function (error) {
	        that.loading = false;
	        console.log(error);
	        that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
	      });
      },
      //删除
      delete() {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          API.remove(row.id).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {
        });
      },
      //选择记录发生改变
      selsChange(sels) {
        this.sels = sels;
      },
      //批量删除
      batchDelete() {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(ids).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {

        });
      },
      //分页查询
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      //获取用户列表
      search() {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.obj) {
            that.total = result.total;
            that.members = result.obj;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      //选择区域发生改变
      handleChange(val) {
      	console.log("val", val);
      	//this.editForm.selectedRregion =  val;
      }
    }
  }
</script>

<style lang="scss" scoped>
.warp {
	.warp-breadcrum {
		padding-bottom: 10px;
	}
}
</style>
