<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2022-02-22 16:20:38
 * @LastEditors: lijiancong
 * @LastEditTime: 2022-02-26 09:51:15
-->
<template>
  <div class="node-table">
    <el-form :model="data" ref="selectForm" label-width="80px">
        <!-- <el-form-item label="类型">
            <el-input v-model="selectForm.type" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="节点名称:">
            <el-input v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
            <el-input v-model="data.remark"></el-input>
        </el-form-item>
        <el-form-item label="节点条件:">
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>

        <div class="table">
          <vxe-table
            border
            row-key
            ref="xTable1"
            size="mini"
            class="sortable-row-demo"
            :scroll-y="{enabled: false}"
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'cell'}">
            <vxe-column width="40">
              <template #default>
                <span class="drag-btn">
                  <i class="vxe-icon--menu"></i>
                </span>
              </template>
              <template #header>
                <vxe-tooltip v-model="showHelpTip1" content="按住后可以上下拖动排序！" enterable>
                  <i class="vxe-icon--question" @click="showHelpTip1 = !showHelpTip1"></i>
                </vxe-tooltip>
              </template>
            </vxe-column>
            <vxe-column field="name" title="关联关系" :edit-render="{}">
              <template #default="{ row }">
                <span>{{ formatSex(row.name) }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-select v-model="row.name" type="text" transfer>
                  <vxe-option v-for="item in sexList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                </vxe-select>
              </template>
            </vxe-column>
            <vxe-column field="dataItem" title="数据项" :edit-render="{}">
              <template #edit="{ row }">
                <vxe-input v-model="row.dataItem" type="text" @focus="focus(row)"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="operator" title="运算符" :edit-render="{}">
              <template #default="{ row }">
                <span>{{ formatOperator(row.operator) }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-select v-model="row.operator" type="text" transfer>
                  <vxe-option v-for="item in operatorList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                </vxe-select>
              </template>
            </vxe-column>
            <vxe-column field="value" title="值" show-overflow :edit-render="{}">
              <template #default="{ row }">
                <span v-if="row.dataItem == 2">{{ formatIs(row.value) }}</span>
                <span v-else-if="row.dataItem == 3">{{ row.value1 }} <span v-if="row.value1 && row.value2"> - </span>{{ row.value2 }}</span>
                <span v-else>{{ row.value }}</span>
              </template>
              <template #edit="{ row }">
                <vxe-input v-if="row.dataItem == 0" v-model="row.value" type="date" placeholder="请选择日期" transfer></vxe-input>
                <vxe-input v-else-if="row.dataItem == 1 || row.dataItem == 4" v-model="row.value" type="text"></vxe-input>
                <vxe-select v-else-if="row.dataItem == 2" v-model="row.value" type="text" transfer>
                  <vxe-option v-for="item in isList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
                </vxe-select>
                <div v-else-if="row.dataItem == 3" class="section">
                  <vxe-input v-model="row.value1" type="text"></vxe-input>
                  <vxe-input v-model="row.value2" type="text"></vxe-input>
                </div>
              </template>
            </vxe-column>
            <vxe-column title="操作" width="70">
              <template #default="{ row }">
                <vxe-button size="mini" status="danger" content="删除" @click="deleteRowEvent(row)"></vxe-button>
              </template>
            </vxe-column>
          </vxe-table>
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
    <el-dialog
      title="选择数据项"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="dialogBox">
        <div class="dataBoxLeft">
          <div class="text"> 数据集 </div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="tree">
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              @node-click="nodeClick"
              :filter-node-method="filterNode"
              ref="tree">
            </el-tree>
          </div>
        </div>
        <div class="dataBoxRight">
          <div class="text"> 数据项 </div>
          <el-table
            ref="multipleTable"
            :data="dialogTableData"
            tooltip-effect="dark"
            style="width: 100%"
            height="260"
            stripe
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="字段名">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import Sortable from 'sortablejs'
    export default {
        name: 'nodeSelect',
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
                showHelpTip1: false,
                dialogVisible: false,
                tableData: [
                    { id: 10001, name: '1', dataItem: '0', operator: '0', value: '' },
                    { id: 10002, name: '0', dataItem: '1', operator: '1', value: '' },
                    { id: 10003, name: '0', dataItem: '2', operator: '2', value: '' },
                    { id: 10004, name: '0', dataItem: '3', operator: '3', value: '' },
                    { id: 10005, name: '0', dataItem: '4', operator: '5', value: '' }
                ],
                sexList: [
                    { label: '与', value: '0' },
                    { label: '或', value: '1' }
                ],
                isList: [
                    { label: '是', value: '0' },
                    { label: '否', value: '1' }
                ],
                operatorList: [
                    { label: '等于', value: '0' },
                    { label: '大于', value: '1' },
                    { label: '小于', value: '2' },
                    { label: '大于等于', value: '3' },
                    { label: '小于等于', value: '4' },
                    { label: '区间', value: '5' }
                ],
                activeName: 'first',
                fileList: [
                    // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                ],
                filterText: '',
                treeData: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                dialogTableData: [{
                    date: '2016-05-03',
                    name: '年龄',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '性别',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '会员用户',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                multipleSelection: [],
                nodeIndex: null
            }
        },
        watch: {
            filterText (val) {
                this.$refs.tree.filter(val)
            }
        },
        methods: {
            // 修改table
            saveTable () {
                this.$emit('setTable', this.data)
                console.log(this.data)
            },
            // 新增一行数据
            handleAdd () {
                let record = { id: 10006, name: '', dataItem: '', operator: '', value: '' }
                this.tableData.push(record)
            },
            // 删除一行数据
            deleteRowEvent (row) {
                this.tableData = this.tableData.filter((item) => {
                    if (item.id !== row.id) {
                        return item
                    }
                })
            },
            focus (row) {
                console.log(row.__ob__.vmCount)
                this.nodeIndex = row.__ob__.vmCount
                this.dialogVisible = true
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done()
                    })
                    .catch(_ => {})
            },
            rowDrop () {
                this.$nextTick(() => {
                    const xTable = this.$refs.xTable1
                    this.sortable1 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                        handle: '.drag-btn',
                        onEnd: ({ newIndex, oldIndex }) => {
                            const currRow = this.tableData.splice(oldIndex, 1)[0]
                            this.tableData.splice(newIndex, 0, currRow)
                        }
                    })
                })
            },
            formatSex (value) {
                if (value === '1') {
                    return '或'
                }
                if (value === '0') {
                    return '与'
                }
                return ''
            },
            formatIs (value) {
                if (value === '1') {
                    return '否'
                }
                if (value === '0') {
                    return '是'
                }
                return ''
            },
            formatOperator (value) {
                if (value === '0') {
                    return '等于'
                }
                if (value === '1') {
                    return '大于'
                }
                if (value === '2') {
                    return '小于'
                }
                if (value === '3') {
                    return '大于等于'
                }
                if (value === '4') {
                    return '小于等于'
                }
                if (value === '5') {
                    return '区间'
                }
                return ''
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
            },
            filterNode (value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            // 点击节点
            nodeClick (val) {
                console.log(val)
            },
            // 弹框确认
            handleConfirm () {
                this.tableData[this.nodeIndex].dataItem = this.multipleSelection[0].name
                this.dialogVisible = false
                console.log(this.tableData)
            }
        },
        mounted () {
            this.rowDrop()
            console.log(this.data)
            // 将form实例返回到父级
            // this.$emit('update:refObj', this.$refs.dataForm)
        },
        beforeDestroy () {
            if (this.sortable1) {
                this.sortable1.destroy()
            }
        }
    }
</script>
<style scoped>
.table{
  width: 100%;
  margin-bottom: 20px;
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
  color: #000000;
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
.sortable-row-demo .drag-btn {
  cursor: move;
  font-size: 12px;
}
.sortable-row-demo .vxe-body--row.sortable-ghost,
.sortable-row-demo .vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
.section{
  display: flex;
}
.dialogBox{
  display: flex;
  width: 100%;
  height: 300px;
}
.dataBoxLeft{
  width: 50%;
  height: 100%;
  border-right: 2px solid #e5e5e5;
  padding: 0 10px;
  box-sizing: border-box;
}
.dataBoxRight{
  width: 50%;
  height: 100%;
  border-left: 2px solid #e5e5e5;
  padding: 0 10px;
  box-sizing: border-box;
}
.text{
  height: 30px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}
.tree{
  height: calc(100% - 72px);
  overflow-y: auto;
}
</style>
