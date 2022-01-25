import { prefix } from '@/config/global';
import Card from '@/components/card/index.vue';
import axios from "axios";
import {Icon} from 'tdesign-icons-vue';

export default {
  components: {
    Card
  },
  name: "checkinForm",
  data() {

    return {
      activeForm: 0,
      roomno: '3004',
      employeeList:[],
      checkinId:'',
      payType:'',
      username:'',
      totalPrice:'',
      checkinDocker:{},
      //设置计算金额按钮只点击一次
      isDisabled:false,
      // 登记表单数据
      checkinForm: {
        checkinName:'',
        checkinIdcard:'',
        ckeckinPhone:'',
        checkinIntime:'',
        checkinLeavetime:'',
        checkinDeposit:'',
        checkinRoomrate:'',
        vipNo:'',
        roomId:this.roomno,
        employeeId:'',
        subscribeId:''
      },
      checkinFormRules:{
        checkinName:[
          {required: true, message: '姓名必填', type: 'error'},
          {validator:this.validateNameLength,trigger: 'blur'}
        ],
        checkinIdcard:[
          { required: true, message: '身份证号必填', type: 'error' }
        ],
        ckeckinPhone:[
          { required: true, message: '联系电话必填', type: 'error' },
          {validator:this.validatePhoneNumber,trigger: 'blur'}
        ],
        checkinIntime:[
          { required: true, message: '入住时间必选', type: 'error' },
        ],
        checkinLeavetime:[
          { required: true, message: '退房时间必选', type: 'error' },
        ],
        checkinDeposit:[
          { required: true, message: '押金金额必填', type: 'error' }
        ],
        checkinRoomrate:[
          { required: true, message: '住房费用必填', type: 'error' }
        ],
        roomId:[
          { required: true, message: '房号必填', type: 'error' },
          {validator:this.validateRoomNoLength,trigger: 'blur'}
        ],
        employeeId:[
          { required: true, message: '操作人必填', type: 'error' }
        ],

      },
    }
  },
  methods: {
    //将时间等参数传到后端进行总金额计算
    getTime(){
      let beginTime = this.checkinForm.checkinIntime;
      let endTime = this.checkinForm.checkinLeavetime;
      axios.get('http://localhost:8080/checkin/getTotal',{
        params:{
          beginTime:beginTime,
          endTime:endTime,
          deposit:this.checkinForm.checkinDeposit,
          subscribeRoomrate:this.checkinForm.checkinRoomrate,
          vipNo:this.checkinForm.vipNo
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if(result.data.code===200){
          this.checkinForm.checkinRoomrate =parseInt(result.data.data);
          this.totalPrice = result.data.data;
          this.isDisabled = true;
        }else {
          this.$message.error(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error(result.data.msg);
      })
    },
    // 显示员工列表
    showEmployeeList(){
      this.username = localStorage.getItem("username");
      axios.get('http://localhost:8080/checkin/getEmpList',{
        params:{
          username:this.username
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if(result.data.code===200){
          this.employeeList = result.data.data;
        }
      })
    },
    // 重置按钮
    onReset() {
      this.checkinForm={};
      this.isDisabled = false;
      this.$message.success('重置成功');
      console.log('formData', this.formData);
    },
    // 表单提交
    onSubmit({ validateResult, firstError }) {
      if (validateResult === true) {
        axios.post('http://localhost:8080/checkin/insertCheckin',this.checkinForm,{
          headers:{'jwtToken':localStorage.getItem('jwtToken')}
        }).then(result=>{
          console.log(result.data);
          if(result.data.code===200){
            this.$message.success('登记成功');
            this.checkinId=result.data.data;
            this.activeForm = 1;
          }else {
            this.$message.error(result.data.msg);
          }
        }).catch(e=>{
          this.$message.error(result.data.msg);
        })
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },
    // 支付提交
    onSubmit2(){
      axios.get('http://localhost:8080/checkin/updatePayType',{
        params:{
          payType:this.payType,
          id:this.checkinId
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if(result.data.code===200){
          this.$message.success('支付成功');
          this.activeForm = 2;
        }
      }).catch(e=>{
        this.$message.error('服务器出错了！');
      })
    },
    onReset2(){
      this.activeForm=0;
    },
    onReset3(){
      this.activeForm=0;
    },
    showSubscribeOnCheckin(val){
      this.checkinForm.checkinName = val.subscribeName;
      this.checkinForm.ckeckinPhone = val.subscribePhone;
      this.checkinForm.checkinIntime =  val.subscribeIntime;
      this.checkinForm.checkinLeavetime = val.subscribeLeavetime;
      this.checkinForm.checkinDeposit = val.subscribeDeposit;

      this.checkinForm.employeeId = val.employeeId;
      this.checkinForm.subscribeId = val.id;

    },
    // 添加自定义校验规则
    validatePhoneNumber(value) {
      if (value.length !== 11) {
        return {result: false, message: '长度应为11位', type: 'error'};
      }
      return {result: true, type: 'success'};

    },
    // 添加自定义校验规则
    validateNameLength(value) {
      if (value.length <2) {
        return {result: false, message: '长度至少2位', type: 'error'};
      }
      return {result: true, type: 'success'};

    },
    // 添加自定义校验规则
    validateRoomNoLength(value) {
      if (value.length !=4) {
        return {result: false, message: '长度应为4位', type: 'error'};
      }
      return {result: true, type: 'success'};

    },
    // 添加自定义校验规则
    validateVipLength(value) {
      if (value.length !== 4) {
        return {result: false, message: '长度应为4位', type: 'error'};
      }
      return {result: true, type: 'success'};

    }
  },created() {
    this.showEmployeeList();
    this.checkinDocker=this.$route.params.row;
    if(this.checkinDocker!=null){
      this.showSubscribeOnCheckin(this.checkinDocker);
      this.checkinForm.checkinRoomrate = this.checkinDocker.subscribeRoomrate;
    }


    console.log(this.$route.params.product);
    this.checkinForm.roomId = this.$route.params.product.rommno;

    let marketPrice = this.$route.params.product.roomType.marketPrice;
    if(marketPrice!=null){
      this.checkinForm.checkinRoomrate = marketPrice;
    }



    this.checkinForm.checkinDeposit = 100;
    console.log(this.checkinDocker);
  }

}
