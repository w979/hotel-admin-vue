<template src="./Deposit.html">
</template>
<script lang="ts">
import Vue from 'vue';
import { SearchIcon } from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import Card from '@/components/card/index.vue';
import { prefix } from '@/config/global';
import axios from "axios";

export default Vue.extend({
  name: '',
  components: {
    SearchIcon,
    Trend,
    Card,
  },
  data() {
    return {
      loading:true,
      // -----分页所需-----
      total: 0, // 总共多少条数据
      pageNum:1, // 起始页
      pageSize:10,

      roomno:'', // 房间号
      hotelid:'', // 酒店id
      hotelItem:[],// 酒店列表
      id:'',
      status:'y',

      prefix,
      dataLoading: false,
      data: [],
      selectedRowKeys: [],
      value: 'frist',
      columns: [
        { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
        {title: '编号', width: 80, ellipsis: true, colKey: 'id',fixed: 'left',},
        {title: '入住人姓名', align: 'left', width: 180, colKey: 'checkinName', },
        {title: '房间号', width: 170, ellipsis: true, colKey: 'roomno',},
        {title: '押金金额 (元)', width: 170, ellipsis: true, colKey: 'money',},
        { title: '押金状态', colKey: 'status', width: 170, cell: { col: 'status' } },
        {title: '所属酒店', width: 170, ellipsis: true, colKey: 'hotelname',},
        {title: '酒店编号', width: 170, ellipsis: true, colKey: 'hotelId',},
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
      searchValue: '',
      confirmVisible: false,
    };
  }
  ,created() {
    this.btnQuery();
    this.queryHotel();
  },
  methods: {
    // 酒店列表
    queryHotel() {
      axios.get('http://localhost:8080/hotel/list',{
        params:{roomno:this.roomno,hotelid:this.hotelid},
        headers:{'jwtToken':localStorage.getItem('jwtToken')}})
        .then(result=>{
          console.log(result.data)
          this.hotelItem=result.data.data
        }).catch(e=>{
          this.$message.error('服务器正忙..');
        });
    }
    // 查询押金列表
    ,btnQuery() {
      axios.get('http://localhost:8080/deposit/list',{
        params:{roomno:this.roomno,
          hotelid:this.hotelid,
          pageNum:this.pageNum,
          pageSize:this.pageSize},
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if (result.data.code === 200){
          this.data=result.data.data.list; // 列表数据
          this.total=result.data.data.total; // 总条数
          this.pageSize=result.data.data.pageSize;
          this.pageNum=result.data.data.pageNum;
          this.loading=false;
        }else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      });
    }
    // 退押金按钮
    ,outDeposit({row}) {
      this.$router.push({
        path:'checkdeposit',
        name:'formCheck',
        params:{
          depositId:row.id,
          roomno:row.roomno,
          checkinname:row.checkinName,
          money:row.money // 押金
        }
      });
    }
    ,selectQuery(){
      this.pageNum=1;
      this.btnQuery()
    }
    // 改变页码
    ,handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.btnQuery();
    },
    // 翻页
    handleCurrentChange(pageNum) {
      this.pageNum=pageNum;
      this.btnQuery();
    }
    ,handleClickDetail() {
      this.$router.push('/detail/base');
    },
    handleSetupContract() {
      this.$router.push('/form/base');
    },
    // 修改押金状态
    handleClickUpdate(row: { rowIndex: any }) {
      this.id = row.row.id
      this.confirmVisible = true;
    },
    // 修改押金状态
    onConfirmUpdate() {
      axios.get('http://localhost:8080/deposit/update',{params:{id:this.id,status:this.status}
        ,headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        if (result.data.code===200){
          this.$message.success(result.data.msg);
          this.btnQuery();
        }else {
          this.$message.warning(result.data.msg);
        }
        this.confirmVisible = false;
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      })
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
  }
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
