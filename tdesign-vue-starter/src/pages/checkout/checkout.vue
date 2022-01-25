<template>
  <div class="list-common-table">
    <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSubmit">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 16]">
            <t-col :flex="1">
              <t-form-item label="房间号" name="name">
                <t-input
                  v-model="formData.roomno"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入房间号"
                  :style="{ minWidth: '134px',width:'80px'}"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="button" :style="{ marginLeft: '8px' }" @click="getCheckOutRoomList"> 查询
          </t-button>
          <t-button type="reset" variant="base" theme="default" @click=resetFormData()> 重置</t-button>
        </t-col>
      </t-row>
    </t-form>
    <div class="table-container">
      <t-table
        :data="data"
        :columns="columns"
        :rowKey="rowKey"
        :verticalAlign="verticalAlign"
        :hover="hover"
        :loading="dataLoading"
      >
        <template #op="slotProps">
          <t-button @click="showCancelSection(slotProps.row.roomno)" theme="warning">提前退房</t-button>
          <t-button @click="checkOutRightNow(slotProps.row.roomno)" theme="success">立即退房</t-button>
        </template>
      </t-table>
      <el-pagination
        style="text-align: center"
        background
        @size-change="this.handleSizeChange"
        @current-change="this.handleCurrentChange"
        :current-page="this.pagination.defaultCurrent"
        :page-sizes="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.pagination.total"
      >
      </el-pagination>
    </div>

    <el-dialog title="选择提前日期" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="修改房间号">
          <el-input v-model="form.roomno" autocomplete="off" disabled style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="请选择退房日期">
          <el-select v-model="form.leavedate">
            <el-option v-for="date in options" :label="date" :value="date"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click=cancelSection()>确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {prefix} from '@/config/global';
import Trend from '@/components/trend/index.vue';
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_TYPES,
  CONTRACT_TYPE_OPTIONS,
  CONTRACT_PAYMENT_TYPES,
} from '@/constants';
import axios from "axios";

export default {
  name: 'list-table',
  components: {
    Trend,
  },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      CONTRACT_TYPES,
      CONTRACT_TYPE_OPTIONS,
      CONTRACT_PAYMENT_TYPES,
      prefix,
      form: {
        roomno: '',
        leavedate: ''
      },
      formData: {
        roomno: '',
      },
      data: [],
      dataLoading: false,
      value: 'frist',
      columns: [
        {
          title: '房间编号',
          fixed: 'left',
          minWidth: '140',
          align: 'left',
          ellipsis: true,
          colKey: 'roomno',
        },
        {
          title: '登记人姓名',
          width: 200,
          ellipsis: true,
          colKey: 'checkinName',
        },
        {
          title: '登记人身份证号',
          width: 200,
          ellipsis: true,
          colKey: 'checkinIdCard',
        },
        {
          title: '登记人电话',
          width: 200,
          ellipsis: true,
          colKey: 'checkinPhone',
        },
        {
          title: '缴纳押金 (元)',
          width: 200,
          ellipsis: true,
          colKey: 'deposit',
        }, {
          title: '缴纳房费 (元)',
          width: 200,
          ellipsis: true,
          colKey: 'roomrate',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 250,
          colKey: 'op',
          title: '操作',
        },
      ],
      options: [],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        defaultPageSize: 20,
        total: 100,
        defaultCurrent: 1,
      },
      confirmVisible: false,
      deleteIdx: -1,
      dialogFormVisible: false,
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const {name} = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
  },
  mounted() {
    this.dataLoading = true;
  }, created() {
    this.getCheckOutRoomList();
  },
  methods: {
    //当前页数改变
    handleCurrentChange(pageNum) {
      this.pagination.defaultCurrent = pageNum;
      this.getCheckOutRoomList();
    },
    onReset(data) {
      console.log(data);
    },
    onSubmit(data) {
      console.log(data);
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    rehandleClickOp({text, row}) {
      console.log(text, row);
    },
    handleClickDelete(row) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      this.data.splice(this.deleteIdx, 1);
      this.pagination.total = this.data.length;
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.resetIdx();
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    }, getCheckOutRoomList() {
      console.log(this.formData.roomno);
      axios.get("http://localhost:8080/checkout/getRoomInUse", {
        params: {
          'username': localStorage.getItem('username'),
          'pageNum': this.pagination.defaultCurrent,
          'roomno': this.formData.roomno
        }, headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        this.data = result.data.data.list;
        console.log(result.data);
        this.pagination.defaultCurrent = result.data.data.pageNum;
        this.pagination.defaultPageSize = result.data.data.pageSize;
        this.pagination.total = result.data.data.total;
      }).catch(e => {
        alert("服务器出错啦");
      }).finally(() => {
        this.dataLoading = false;
      });
    }, showCancelSection(roomno1) {
      const checkOutFO = {
        username: localStorage.getItem('username'),
        roomno: roomno1,
        updateLeaveTime: ''
      };
      axios.post("http://localhost:8080/checkout/showCancelSection", checkOutFO, {headers: {'jwtToken': localStorage.getItem('jwtToken')}}).then(result => {
        if (result.data.code == 200) {
          this.form.roomno = roomno1;
          this.dialogFormVisible = true;
          this.options = result.data.data;
          console.log(result.data);
        } else {
          this.$message({
            showClose: true,
            message: result.data.msg,
            duration: 5000,
            type: 'warning'
          });
        }
      }).catch(e => {
        alert("服务器出错啦");
      });
    }, checkOutRightNow(roomno) {
      console.log(roomno);
    }, cancelSection() {
      if (this.form.leavedate == '') {
        this.$message({
          showClose: true,
          message: '请选中修改后的退房日期',
          duration: 5000,
          type: 'error'
        });
        return;
      }

      const checkOutFO = {
        username: localStorage.getItem('username'),
        roomno: this.form.roomno,
        updateLeaveTime: this.form.leavedate
      };

      axios.post("http://localhost:8080/checkout/cancelSection", checkOutFO, {headers: {'jwtToken': localStorage.getItem('jwtToken')}}).then(result => {
        if (result.data.code == 200) {
          this.$message({
            showClose: true,
            message: result.data.msg,
            duration: 5000,
            type: 'success'
          });
          this.form.leavedate = '';
        } else {
          this.$message({
            showClose: true,
            message: result.data.msg,
            duration: 5000,
            type: 'error'
          });
        }
        this.getCheckOutRoomList();
      }).catch(e => {
        alert("服务器出错啦");
      });
      this.dialogFormVisible = false;
    }, checkOutRightNow(roomno1) {
      if (confirm("确认要退房吗")){
        const checkOutFO = {
          username:localStorage.getItem('username'),
          roomno:roomno1
        };

        axios.post("http://localhost:8080/checkout/checkOutRightNow",checkOutFO,{headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
          if (result.data.code == 200){
            this.$message({
              showClose: true,
              message: result.data.msg,
              duration:5000,
              type: 'success'
            });
          }else {
            this.$message({
              showClose: true,
              message: "退房失败",
              duration:5000,
              type: 'error'
            });
          }
          this.getCheckOutRoomList();
        }).catch(e=>{
          alert("服务器出错啦");
        });
      }
    }, resetFormData() {
      this.formData.roomno = '';
    }
  }
};
</script>

<style lang="less">
@import '@/style/variables.less';

.list-common-table {
  background-color: @bg-color-container;
  padding: 30px 32px;
  border-radius: @border-radius;

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
