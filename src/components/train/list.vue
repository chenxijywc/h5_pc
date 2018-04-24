<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>培训管理</el-breadcrumb-item>
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
	          <el-input v-model="filters.name" placeholder="手机号" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="ID号" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-input v-model="filters.name" placeholder="状态" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="handleSearch">查询</el-button>
	        </el-form-item>
	        
	        <el-form-item>
	          <el-button type="primary" @click="showAddDialog">新增</el-button>
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="handleSearch">可用</el-button>
	        </el-form-item>
	        <el-form-item>
	          <el-button type="primary" @click="handleSearch">失效</el-button>
	        </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="accounts" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="selsChange">
      	<el-table-column type="selection" width="55">
      	</el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="手机" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="地区" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="ID号" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="密码" width="120" sortable>
        </el-table-column>
        <el-table-column prop="name" label="状态" width="120" sortable>
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="author">
            <el-input v-model="editForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <!--<el-select v-model="editForm.province" placeholder="省">
				      <el-option label="省一" value="shanghai"></el-option>
				      <el-option label="省二" value="beijing"></el-option>
				    </el-select>
				    <el-select v-model="editForm.city" placeholder="市">
				      <el-option label="市一" value="shanghai"></el-option>
				      <el-option label="市二" value="beijing"></el-option>
				    </el-select>
				    <el-select v-model="editForm.district" placeholder="区">
				      <el-option label="区域一" value="shanghai"></el-option>
				      <el-option label="区域二" value="beijing"></el-option>
				    </el-select>-->
				    <el-cascader
					    :options="regions"
					    v-model="selectedRregion2"
					    @change="handleChange">
					  </el-cascader>
          </el-form-item>
          <el-form-item label="密码" prop="description">
            <el-input type="password" v-model="editForm.description" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!--添加界面-->
      <el-dialog title="添加" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="author">
            <el-input v-model="addForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地区">
				    <el-cascader
					    :options="regions"
					    v-model="selectedRregion2"
					    @change="handleChange">
					  </el-cascader>
          </el-form-item>
          <el-form-item label="密码" prop="description">
            <el-input type="password" v-model="addForm.description" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_account';
  import regions from '../../utils/regions';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        sels:[],
        accounts: [],
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
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addFormRules: {
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
        addForm: {
          name: '',
          author: '',
          publishAt: '',
          description: '',
          selectedRregion: []
        },
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
      //添加
      showAddDialog() {
      	this.addFormVisible = true;
      },
      //添加提交
      addSubmit() {
      	
      },
    	//修改
    	showEditDialog(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        console.log("editForm", this.editForm);
      },
      //修改提交
      updateSubmit() {
      	API.add(row.id).then(function (result) {
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
            that.accounts = result.obj;
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
