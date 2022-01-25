<template src="./CheckDeposit.html">

</template>
<script lang="jsx">
import { prefix } from '@/config/global';
import Card from '@/components/card/index.vue';
import axios from "axios";
import { DiscountIcon } from 'tdesign-icons-vue';

const INITIAL_DATA1 = {
  name: '',
  type: '',
};
const INITIAL_DATA2 = {
  title: '',
  taxNum: '',
  address: '',
  bank: '',
  bankAccount: '',
  email: '',
  tel: '',
};
const INITIAL_DATA3 = {
  consignee: '',
  mobileNum: '',
  deliveryAddress: '',
  fullAddress: '',

};

export default {
  components: { Card , DiscountIcon},
  data() {
    return {
      detailItem:[], // 消费明细
      depositId:'', // 押金id
      status:'y', // 押金状态
      roomno:'', // 房间号
      checkinname:'', // 入住人姓名
      finalTotal:'0',// 总消费金额
      money:'', // 押金金额
      retreatMoney:'', // 退多少
      repairMoney:'', // 补多少
      columns: [
        {colKey: 'goodsname', title: '名称',},
        {colKey: 'goodstype', title: '类型',},
        {colKey: 'price', title: '金额(元)',},
        {colKey: 'num', title: '数量(个)',},
        {colKey: 'total', title: '合计(元)',},
      ],
      prefix,
      formData1: { ...INITIAL_DATA1 },
      formData2: { ...INITIAL_DATA2 },
      formData3: { ...INITIAL_DATA3 },
      rowKey: 'index',
      activeForm: 0,
    };
  },created() {
    this.depositId=this.$route.params.depositId;
    this.roomno=this.$route.params.roomno;
    this.checkinname=this.$route.params.checkinname;
    this.money=this.$route.params.money;
    this.queryDetail();
  },
  methods: {
    // 房间号
    renderDiscountIcon() {
      return <DiscountIcon/>;
    },
    // 查询押金明细
    queryDetail() {
      axios.get('http://localhost:8080/deposit/detail',{params:{depositId:this.depositId},headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data)
        if (result.data.code===200){
          this.detailItem=result.data.data.depositDetailVoList
          this.finalTotal=result.data.data.finalTotal
        }else {
          this.$message.success(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      });
    }
    ,Stotal() {
      this.calculateMoney();
    }
    // 计算需退补多少钱
    ,calculateMoney() {
      let res = 0;
      res = parseInt(this.money, 10) - parseInt(this.finalTotal, 10); // 需要退的钱
      if (res >= 0){
        this.retreatMoney = res;
        this.repairMoney = 0;
      }else {
        this.retreatMoney = 0;
        this.repairMoney = parseInt(Math.abs(res), 10);
      }
    }
    // 支付方式
    ,getPay(checkedValues){
      console.log('checkedValues:', this.value, checkedValues);
    }
    ,onSubmit1({ validateResult }) {
      this.calculateMoney();
      if (validateResult === true) {
        this.activeForm = 1;
      }
    },
    onSubmit2({ validateResult }) {
      if (validateResult === true) {
        this.activeForm = 2;
      }
    },
    onReset2() {
      this.activeForm = 0;
    }
    // 跳转下一步并修改押金状态
    ,onSubmit3({ validateResult }) {
      if (validateResult === true) {
        axios.get('http://localhost:8080/deposit/update',{params:{id:this.depositId,status:this.status}
          ,headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
          console.log(result.data.msg);
          this.$message.success('操作成功');
        }).catch(e=>{
          this.$message.error('服务器正忙..');
        });
        this.activeForm = 6;
      }
    },
    onReset3() {
      this.activeForm = 1;
    },
    onSubmit4() {
      //this.$router.replace({ path: '/detail/advanced' });
      this.$message.success('发票打印成功,请查收');
      this.$router.push({path:'deposit', name:'listDeposit',});
    },
    onReset4() {
      this.$router.push({path:'deposit', name:'listDeposit',});
    },
  }

};
</script>
<style lang="less" scoped>
@import './index';
</style>
