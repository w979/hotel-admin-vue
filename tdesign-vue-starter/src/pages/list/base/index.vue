<template>
  <div>
    <card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
        </div>
        <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
          <template #suffix-icon>
            <search-icon size="20px" />
          </template>
        </t-input>
      </t-row>

      <div class="table-container">
        <t-table
          :columns="columns"
          :data="data"
          :rowKey="rowKey"
          :verticalAlign="verticalAlign"
          :hover="hover"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
        >
          <template #roomStatus="{ row }">
            <t-tag v-if="row.roomStatus === '1' " theme="primary" >以打扫</t-tag>
            <t-tag v-if="row.roomStatus === '2' " theme="warning" >未打扫</t-tag>
            <t-tag v-if="row.roomStatus === '3' " theme="danger" >维修中</t-tag>
            <t-tag v-if="row.roomStatus === '4' " theme="danger" >待维修</t-tag>
          </template>
          <template #paymentType="{ row }">
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">
              付款<trend class="dashboard-item-trend" type="up" />
            </p>
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECIPT" class="payment-col">
              收款<trend class="dashboard-item-trend" type="down" />
            </p>
          </template>

<!--          <template #op="slotProps">-->
<!--            <a class="t-button-link" theme="primary" size="small" @click="handleClickDetail()">详情</a>-->
<!--            <a class="t-button-link" theme="danger" size="small" @click="handleClickDelete(slotProps)">删除</a>-->
<!--          </template>-->

          <template #op="slotProps">
            <t-button variant="text" theme="primary" size="small" @click="handleClickDetail(slotProps)">清退处理</t-button>
          </template>
        </t-table>
        <t-pagination
          size="small"
          :total="pagination.total"
          :page-size.sync="pagination.pageSize"
          @current-change="findUndeterminedClear"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </card>
    <t-dialog
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
    </t-dialog>

    <t-dialog
      header="商品"
      :body="confirmBody"
      :visible.sync="goodsStatus"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
      <t-checkbox-group v-model="value3" :options="options2" @change="onChange3"/>

    </t-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { SearchIcon } from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import Card from '@/components/card/index.vue';

import { prefix } from '@/config/global';
import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES } from '@/constants';
import axios from "axios";

export default Vue.extend({
  name: 'list-base',
  components: {
    SearchIcon,
    Trend,
    Card,
  },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      CONTRACT_TYPES,
      CONTRACT_PAYMENT_TYPES,
      prefix,
      dataLoading: false,
      data: [],
      goodId:'',
      bid:'',
      selectedRowKeys: [1, 2],
      value: 'frist',
      value3: [],
      options2: [
        { label: '全选', checkAll: true },
        { value: '1', label: '薯条' },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { value: '2', label: '可乐'},
        { value: '3', label: '薯片' },
      ],
      columns: [
        { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
        {
          title: '订单编号',
          align: 'left',
          width: 300,
          colKey: 'orderno',
          fixed: 'left',
        },
        { title: '房间状态', colKey: 'roomStatus', width: 200, cell: { col: 'roomStatus' } },
        {
          title: '房间编号',
          width: 200,
          ellipsis: true,
          colKey: 'rommno',
        },
        {
          title: '房间楼层',
          width: 200,
          ellipsis: true,
          colKey: 'roomFloor',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      hover: true,
      rowClassName: (rowKey: string) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: { current: 1, pageSize: 5, total: 0 },
      // pageNum:1,
      // pageSize:2,
      searchValue: '',
      confirmVisible: false,
      goodsStatus:false,
      deleteIdx: -1,
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const { name } = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
  },
  mounted() {
    this.dataLoading = true;
    this.$request
      .get('/api/get-list')
      .then((res) => {
        if (res.code === 0) {
          const { list = [] } = res.data;
          this.data = list;
          this.pagination = {
            ...this.pagination,
            total: list.length,
          };
        }
      })
      .catch((e: Error) => {
        console.log(e);
      })
      .finally(() => {
        this.dataLoading = false;
      });
  },created() {
    this.findUndeterminedClear();
  },
  methods: {
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    onPageSizeChange(size: number): void {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
    },
    rehandleSelectChange(selectedRowKeys: number[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    handleClickDetail({row}) {
      this.goodId = row.depositId
      this.bid = row.orderno;
      this.goodsStatus = true;
      // this.$router.push('/detail/base');
    },
    handleSetupContract(rwo) {
      this.$router.push('/form/base');
    },
    handleClickDelete(row: { rowIndex: any }) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    /**
     * 批量添加
     */
    onConfirmDelete() {
      const num = this.value3;
      let good = '';
      for (let i = 0; i < num.length; i++) {
        good += num[i]+',';
      }
      axios.get('http://localhost:8080/business/batchAdd',{params:{goodId:good,id:this.goodId,bid:this.bid},headers: {'jwtToken': localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data)
        if (result.data===200){
          console.log("批量添加成功！")
        }
      })
      this.$message.success('清退成功！');
      this.data.splice(this.deleteIdx, 1);
      this.pagination.total = this.data.length;
      const selectedIdx = this.selectedRowKeys.indexOf(this.deleteIdx);
      if (selectedIdx > -1) {
        this.selectedRowKeys.splice(selectedIdx, 1);
      }
      this.confirmVisible = false;
      // this.$message.success('删除成功');
      this.resetIdx();
    },
    onCancel() {
      this.resetIdx();
    },
    onChange3(){
      console.log("a")
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
    /**
     * 待清房列表
     */
    findUndeterminedClear(value){
      const num = value
      axios.get('http://localhost:8080/business/findundeterminedClear',{params:{pageNum:num,pageSize:this.pagination.pageSize},headers: {'jwtToken': localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data);
        this.data = result.data.data.roomVoList;
        this.pagination.total = result.data.data.total;

      })
    }
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables';

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 0 0 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: 8px;
    color: @text-color-secondary;
  }
}

.search-input {
  width: 360px;
}
</style>
