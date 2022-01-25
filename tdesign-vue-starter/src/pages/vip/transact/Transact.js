import Card from '@/components/card/index.vue';
import {prefix} from '@/config/global';
import Trend from '@/components/trend/index.vue';
import axios from "axios";
import {Icon} from 'tdesign-icons-vue';

export default {
  components: {
    Card
  },
  name: "Transact",
  data() {
    return {
      phoneData: {
        vipPhone: ''
      },
      userid: null,
      userData: {
        username: '',
        password: 123456,
        useronlinePhone: '',
        useronlineTotalpay: 0,
        useronlineSex: '',
        useronlineIdcard: ''
      },
      vipData:{
        vipNo:'',
        vipStatus:'1',
        viptypeId:1,
        vipRemark:'',
        vipEndtime:'',
        useronlineId:null
      },
      rules1: {
        vipPhone: [
          {required: true, message: '请输手机号', trigger: 'blur'},
        ],
      },
      rules2: {
        username: [
          {required: true, message: '请输用用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输密码', trigger: 'blur'},
        ],
        useronlinePhone: [
          {required: true, message: '请输手机号', trigger: 'blur'},
        ],
        useronlineTotalpay: [
          {required: true, message: '请输累计消费', trigger: 'blur'},
        ],
        useronlineSex: [
          {required: true, message: '请输性别', trigger: 'blur'},
        ],
        useronlineIdcard: [
          {required: true, message: '请输身份证', trigger: 'blur'},
        ]
      },
      rules3:{
        vipEndtime:[
          {required: true, message: '请输过期时间', trigger: 'blur'},
        ],
        vipRemark:[
          {required: true, message: '请输备注', trigger: 'blur'},
        ],
      },
      activeForm: 0,
    };
  },
  methods: {
    onSubmit1({validateResult}) {
      if (validateResult === true) {
        axios.get("http://localhost:8080/vip/check", {
          params: {phone: this.phoneData.vipPhone},
          headers: {'jwtToken': localStorage.getItem('jwtToken')}
        }).then(result => {
          console.log(result.data);
          if (result.data.code === 2001) {
            this.$confirm('手机号未注册账号，是否继续注册账号?', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.userData.username = this.phoneData.vipPhone;
              this.userData.useronlinePhone = this.phoneData.vipPhone;
              this.activeForm = 1;
            })
          } else if (result.data.code === 2002) {
            this.$confirm('手机号已注册账号，是否继续办理会员?', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.vipData.useronlineId = result.data.data;
              this.userData.useronlinePhone = this.phoneData.vipPhone;
              this.activeForm = 2;
            })
          } else {
            this.$confirm('手机号已是会员，是否进入会员列表查看?', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.replace('/vip/members').catch(() => '');
            })
          }
        })


      }
    },
    onSubmit2({validateResult}) {
      if (validateResult === true) {
        axios.post("http://localhost:8080/useronline/add",
          this.userData,
          {
            headers: {'jwtToken': localStorage.getItem('jwtToken')}
          }).then(result => {
          if (result.data.code === 200) {
            this.vipData.useronlineId=result.data.data;
            this.vipData.vipNo=this.userData.useronlinePhone;
            this.activeForm = 2;
            this.$message.success("注册成功");
          }else {
            this.$message.warning(result.data.msg);
          }
        }).catch(e=>{
          this.$message.error("服务器去火星了");
        })
      }
    },
    onReset2() {
      this.activeForm = 0;
    },
    onSubmit3({validateResult}) {
      if (validateResult === true) {
        axios.post("http://localhost:8080/vip/add",
          this.vipData,
          {
            headers: {'jwtToken': localStorage.getItem('jwtToken')}
          }).then(result => {
          if (result.data.code === 200) {
            this.activeForm = 6;
            this.$message.success("办理成功");
          }else {
            this.$message.warning(result.data.msg);
          }
        }).catch(e=>{
          this.$message.error("服务器去火星了");
        })
      }
    },
    onReset3() {
      this.activeForm = 1;
    },
    onSubmit4() {
      this.$router.replace({path: '/vip/members'});
    },
    onReset4() {
      this.activeForm = 0;
    },
  },
};
