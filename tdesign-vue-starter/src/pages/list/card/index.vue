<template>
  <div class="list-card">
    <div class="list-card-operation">
<!--      <t-button @click="formVisible = true">新建产品</t-button>-->
      <template>
        <div class="tdesign-demo-item--datepicker">
          <t-date-picker
            theme="primary"
            mode="date"
            format="YYYY-MM-DD"
            style="width: 350px"
            @change="onPick"
          />
        </div>
      </template>
      <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
        <template #suffix-icon>
          <search-icon v-if="searchValue === ''" size="20px" />
        </template>
      </t-input>
    </div>

    <template v-if="pagination.total > 0 && !dataLoading">
      <div class="list-card-items">
        <t-row :gutter="[16, 16]">
          <t-col
            :lg="4"
            :xs="6"
            :xl="3"
            v-for="product in productList.slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current,
            )"
            :key="product.index"
          >
            <card
              class="list-card-item"
              :product="product"
              @delete-item="handleDeleteItem"
              @manage-product="handleManageProduct"
            />
          </t-col>
        </t-row>
      </div>
      <div class="list-card-pagination">

        <t-pagination
          size="small"
          :total="pagination.total"
          :page-size.sync="this.pageSize"
          @current-change="RoomStatusTbale"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </template>
    <div v-else-if="dataLoading" class="list-card-loading">
      <t-loading text="加载中..."></t-loading>
    </div>
  </div>
</template>
<script lang="ts">
import { prefix } from '@/config/global';
import { SearchIcon } from 'tdesign-icons-vue';
import Card from './components/compoonent-card.vue';
import axios from "axios";

const INITIAL_DATA = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
};
export default {
  name: 'list-card',
  components: {
    SearchIcon,
    Card,
  },
  data() {
    return {
      pagination: { current: 1, pageSize: 12, total: 0 },
      prefix,
      productList: [],
      today:'',
      future:'',
      value: 'frist',
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      pageNum:1,
      pageSize:12,
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      formData: { ...INITIAL_DATA },
      options: [
        { label: '网关', value: '1' },
        { label: '人工智能', value: '2' },
        { label: 'CVM', value: '3' },
      ],
      formVisible: false,
      textareaValue: '',
      rules: {
        name: [{ required: true, message: '请输入产品名称', type: 'error' }],
      },
      searchValue: '',
      confirmVisible: false, // 控制确认弹窗
      deleteProduct: undefined,
      dataLoading: false,
    };
  },
  mounted() {
    this.dataLoading = true;
    this.$request
      .get('/api/get-card-list')
      .then((res) => {
        if (res.code === 0) {
          const { list = [] } = res.data;
          this.productList = list;
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
    this.RoomStatusTbale();
  },
  methods: {
    onPageSizeChange(size: number): void {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
    },
    onCurrentChange(current: number): void {
      this.pagination.current = current;
    },
    onSubmit({ result, firstError }): void {
      if (!firstError) {
        this.$message.success('提交成功');
        this.formVisible = false;
      } else {
        console.log('Errors: ', result);
        this.$message.warning(firstError);
      }
    },
    onClickCloseBtn(): void {
      this.formVisible = false;
      this.formData = {};
    },
    handleDeleteItem(product): void {
      this.confirmVisible = true;
      this.deleteProduct = product;
    },
    onConfirmDelete(): void {
      const { index } = this.deleteProduct;
      this.productList.splice(index - 1, 1);
      this.confirmVisible = false;
      this.$message.success('删除成功');
    },
    onCancel(): void {
      this.deleteProduct = undefined;
      this.formData = {};
    },
    handleManageProduct(product): void {
      this.formVisible = true;
      this.formData = { ...product, status: product?.isSetup ? '1' : '0' };
    },// 选中日期时的事件
    onPick(value) {
      console.log('onPick:', value);
      this.today = value;
      this.RoomStatusTbale();
    },
    RoomStatusTbale(value){
      const num = value
      /**
       * 获取登陆人名字
       * @type {string}
       */
      const username = localStorage.getItem("username");
      axios.get('http://localhost:8080/room/roomStatus', {
        params: {username,today:this.today,pageNum:num,pageSize:this.pageSize},
        headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        console.log(result.data)
        console.log(result.data.data.roomVoList[0].roomType.marketPrice);
        this.productList = result.data.data.roomVoList;
        this.pagination.total = result.data.data.total;

      }).catch(e=>{
        console.log("服务器异常")
      })
    }
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.list-card {
  height: 100%;

  &-operation {
    display: flex;
    justify-content: space-between;

    .search-input {
      width: 360px;
    }
  }

  &-items {
    margin-top: 14px;
    margin-bottom: 24px;
  }

  &-pagination {
    padding: 16px;
  }

  &-loading {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
