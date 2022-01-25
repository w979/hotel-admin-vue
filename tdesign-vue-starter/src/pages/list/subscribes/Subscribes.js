import axios from "axios";
import { prefix } from '@/config/global';
import Trend from '@/components/trend/index.vue';

export default {
  components: {
    Trend,
  },
  name:'Subscribes',
  data() {
    return {
      loading:true,
      subscribeName:'',
      subscribePhone:'',
      roomTypeName:'',
      hotelId:'',
      subscribeDetail:{},
      subscribeList:[],
      roomtypeList:[],
      hotelList:[],
      roomtypeId:'',
      columns: [
        {
          title: '姓名',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'subscribeName',
        },
        {
          title: '联系电话',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'subscribePhone',
        },
        {
          title: '入住时间',
          align: 'center',
          minWidth: 250,
          ellipsis: true,
          colKey: 'subscribeIntime',
        },
        {
          title: '退房时间',
          align: 'center',
          minWidth: 250,
          ellipsis: true,
          colKey: 'subscribeLeavetime',
        },
        {
          title: '房型',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'roomTypeName',
        },
        {
          title: '支付方式',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'subscribePaytype',
        },
        {
          title: '状态',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'subscribeStatus',
        },
        {
          title: '操作人',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'employeeName',
        },
        {
          align: 'center',
          fixed: 'right',
          minWidth: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      pageNum:1,
      pageSize:10,
      total:0,
      confirmVisible: false,
      cancelIdx: -1,
      detailDialogVisible: false,
    };
  },
  methods:{

    // 分页大小改变
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.showSubscribeList();
    },
    // 当前页数改变
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.showSubscribeList();
    },
    // 查询按钮
    querySubscribe(){
      this.pageNum=1;
      this.showSubscribeList();
      this.showRoomTypeList();
      this.showHotelList();
    },
    // 重置按钮
    resetForm(){
      this.subscribeName='';
      this.subscribePhone='';
      this.roomtypeId='';
      this.showSubscribeList();


    },
    // 显示预订列表
    showSubscribeList(){
      axios.get('http://localhost:8080/subscribe/list',{
        params:{
          subscribeName:this.subscribeName,
          subscribePhone:this.subscribePhone,
          roomtypeId:this.roomtypeId,
          hotelId:this.hotelId,
          pageNum:this.pageNum,
          pageSize:this.pageSize
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data.data);
        if(result.data.code===200){
          this.subscribeList = result.data.data.subscribeVoList;
          this.pageNum = result.data.data.pageNum;
          this.total = result.data.data.total;
          this.pageSize = result.data.data.pageSize;
          this.loading = false;
        }
      })
    },
    // 显示房型列表
    showRoomTypeList(){
      axios.get('http://localhost:8080/subscribe/roomTypeList',{
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data.data);
        if(result.data.code===200){
          this.roomtypeList = result.data.data;
          console.log(this.roomtypeList);
        }
      })
    },
    // 显示酒店列表
    showHotelList(){
      axios.get('http://localhost:8080/subscribe/hotelList',{
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data.data);
        if(result.data.code===200){
          this.hotelList = result.data.data;
          console.log(this.hotelList);
        }
      })
    },
    // 取消预约弹出框确认按钮
    confirmSubscribeCancel(){
      axios.get('http://localhost:8080/subscribe/updateStatus',{
        params:{
          id:this.cancelIdx
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if(result.data.code===200){
          this.$message.success('取消预约成功！');
          this.showSubscribeList();
        }else {
          this.$message.error('取消预约失败！');
        }
      })
      this.confirmVisible = false;
      this.resetIdx();
    },
    // 取消预约按钮弹出框 取消按钮
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.cancelIdx = -1;
    },
    // 取消预约按钮
    handleClickCancel(row){
      this.cancelIdx = row.row.id;
      this.confirmVisible=true;
    },
    //查看详情
    showDetail(row){
      axios.get('http://localhost:8080/subscribe/querySubscribeDetail',{
        params:{
          id:row.row.id
        },
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data.data);
        if(result.data.code===200){
          this.subscribeDetail = result.data.data;
          this.detailDialogVisible = true;
          console.log(this.subscribeDetail);

        }
      })
    },
    //跳转登记入住页并将预订订单相关信息显示
    goCheckIn(row){
      this.$router.push({name:'checkin',params:{row:row.row}});
    },
    // 详情框关闭清空
    detailDialogClose(){
      // 关闭添加框清空数据
      this.detailDialogVisible=false;
    },
  },created() {
    this.showSubscribeList();
    this.showRoomTypeList();
    this.showHotelList();
  }

}
