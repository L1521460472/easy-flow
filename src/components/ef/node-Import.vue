<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2022-01-18 11:06:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2022-02-22 17:33:35
-->
<template>
  <div class="node-table">
    <el-form :model="data" ref="dataForm" label-width="80px">
        <el-form-item label="类型">
            <el-input v-model="data.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="data.name"></el-input>
        </el-form-item>
        <div class="table">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="文件导入" name="first"></el-tab-pane>
            <el-tab-pane label="营销节点" name="second"></el-tab-pane>
          </el-tabs>
          <el-table
          v-if="activeName == 'second' "
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              >
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="excel" v-else>
            <el-form-item label="类型">
                <el-radio-group v-model="data.name">
                  <el-radio label="Excel"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="名称">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
            </el-form-item>
          </div>
        </div>
        <div class="bottom">
          <div class="bottomTitle"><span>计数</span></div>
          <div class="bottomStatus">
            <span>主题：客户</span>
            <span>合计：未执行</span>
            <span>最新更新时间：未执行</span>
          </div>
        </div>
        <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="saveTable">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
    export default {
        name: 'nodeTable',
        props: {
            data: {
                type: Object
            },
            refObj: {
                type: Object
            }
        },
        data () {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                activeName: 'first',
                fileList: [
                    // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                ]

            }
        },
        methods: {
            // 修改table
            saveTable () {
                this.$emit('setTable', this.data)
                console.log(this.data)
            },
            handleClick (tab, event) {
                this.activeName = tab.name
            },
            handleRemove (file, fileList) {
                console.log(file, fileList)
            },
            handlePreview (file) {
                console.log(file)
            },
            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            },
            beforeRemove (file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`)
            }
        },
        mounted () {
            console.log(this.data)
            // 将form实例返回到父级
            // this.$emit('update:refObj', this.$refs.dataForm)
        }
    }
</script>
<style scoped>
.table{
  width: 300px;
  margin: 20px 0;
}
.excel{
  padding-right: 10px;
}
.bottom{
  font-size: 12px;
  border: 1px solid #e5e5e5;
  margin-bottom: 20px;
}
.bottomStatus{
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e5e5e5;
}
.bottomTitle{
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f5f5f5;
  position: absolute;
  position: relative;
}
</style>
