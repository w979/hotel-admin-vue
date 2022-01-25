import axios from "axios";

export default {
  name: "listOrders",
  data(){
    return{
      loading:true,
      // -----分页所需-----
      total: 0, // 总共多少条数据
      pageNum:1, // 起始页
      pageSize:10,

      total2: 0, // 总共多少条数据
      pageNum2:1, // 起始页
      pageSize2:10,
      // --------end-----

      // 抽屉
      visible: false,
      placement: 'left',

      value1: 'first',
      orderstatus:'2',
      orderid:'',

      // 订单详情
      detail:{
        name:'',
        hotelname:'',
        status:'',
        phone:'',
        roomno:'',
        idcard:'',
      },

      formData: {
        name:'', // 姓名
        orderno:'', // 订单编号
        status:'', // 酒店状态
        hotelid:'', // 所属酒店id
      },
      statusItem:[
        { label: '全部', value: '' },
        { label: '已完成', value: '1' },
        { label: '已取消', value: '2' },
        { label: '已缴费', value: '3' },
        { label: '已生效', value: '4' },
      ],
      hotelItem:[], // 酒店列表

      data: [], // 表格数据-线上
      dataReality:[], // 线下
      dataLoading: false,
      columns: [
        {title: '订单编号', fixed: 'left', minWidth: '150', align: 'left', ellipsis: true, colKey: 'orderno',},
        {title: '姓名', colKey: 'subscibeName', width: 150, ellipsis: true },
        {title: '联系电话', width: 150, ellipsis: true, colKey: 'phone',},
        {title: '房间号', width: 150, ellipsis: true, colKey: 'roomno',},
        {title: '预约时间', width: 200, ellipsis: true, colKey: 'newtime',},
        {title: '入住时间', width: 200, ellipsis: true, colKey: 'intime',},
        {title: '离开时间', width: 200, ellipsis: true, colKey: 'leavetime',},
        {title: '费用', width: 150, ellipsis: true, colKey: 'roomrate',},
        {title: '预约方式', width: 150, ellipsis: true, colKey: 'origin',cell: { col: 'origin' }},
        {title: '状态', width: 150, ellipsis: true, colKey: 'status',cell: { col: 'status' }},
        {title: '所属酒店', width: 200, ellipsis: true, colKey: 'hotelname',},
        {title: '订单id', width: 100, ellipsis: true, colKey: 'id',},
        {align: 'left', fixed: 'right', width: 200, colKey: 'op', title: '操作',},],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        defaultPageSize: 20,
        total: 0,
        defaultCurrent: 1,
      },
      confirmVisible: false,
      deleteIdx: -1,
    }
  },methods:{
    // 清空查询条件
    btnClear() {
      this.formData=[];
      this.btnQuery();
      this.btnQueryReality();
    }
    // 查询订单列表-线上
    ,btnQuery() {
      axios.get('http://localhost:8080/order/list',{
        params:{subscibeName:this.formData.name,
          orderno:this.formData.orderno,
          status:this.formData.status,
          hotelid:this.formData.hotelid,
          pageNum:this.pageNum,
          pageSize:this.pageSize},
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if (result.data.code === 200){
          this.total=result.data.data.total; // 总条数
          this.pageSize=result.data.data.pageSize;
          this.pageNum=result.data.data.pageNum;
          this.data=result.data.data.list; // 列表数据
          this.loading=false;
        }else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      });
    }
    // 查询订单列表-线下
    ,btnQueryReality() {
      axios.get('http://localhost:8080/order/reality',{
        params:{checkinName:this.formData.name,
          orderno:this.formData.orderno,
          status:this.formData.status,
          hotelid:this.formData.hotelid,
          pageNum:this.pageNum2,
          pageSize:this.pageSize2},
        headers:{'jwtToken':localStorage.getItem('jwtToken')}
      }).then(result=>{
        console.log(result.data);
        if (result.data.code === 200){
          this.total2=result.data.data.total; // 总条数
          this.pageSize2=result.data.data.pageSize;
          this.pageNum2=result.data.data.pageNum;
          this.dataReality=result.data.data.list; // 列表数据
          this.loading=false;
        }else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      });
    }
    // 查询酒店列表
    ,queryHotel() {
      axios.get('http://localhost:8080/hotel/list',{params:{},headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data)
        this.hotelItem=result.data.data
      }).catch(e=>{
        this.$message.error('服务器正忙..');
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
    ,selectQuery2(){
      this.pageNum=1;
      this.btnQueryReality()
    }
    // 改变页码
    ,handleSizeChange2(pageSize) {
      this.pageSize2=pageSize
      this.btnQueryReality();
    },
    // 翻页
    handleCurrentChange2(pageNum) {
      this.pageNum2=pageNum;
      this.btnQueryReality();
    }
    ,onReset(data) {
      console.log(data);
    },
    onSubmit(data) {
      console.log(data);
    }
    // 抽屉关闭 确认
    ,onClickConfirm() {
      this.visible=false;
    }
    // 查看订单详情
    ,rehandleClickOp({ text, row }) {
      this.detail.name=row.subscibeName;
      this.detail.hotelname=row.hotelname;
      this.detail.status=row.status;
      this.detail.phone=row.phone;
      this.detail.roomno=row.roomno
      this.visible=true;
      console.log(text, row);
    },
    // 逻辑删除，将订单状态改为已取消
    handleClickDelete(row) {
      console.log(row)
      this.orderid = row.row.id;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      axios.get('http://localhost:8080/order/update',{params:{id:this.orderid,status:this.orderstatus}
        ,headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        if (result.data.code === 200){
          this.$message.success(result.data.msg);
        }else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e=>{
        this.$message.error('服务器正忙..');
      });
      this.confirmVisible = false;

    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
  },created() {
    this.btnQuery();
    this.queryHotel();
    this.btnQueryReality();
  }
}
