import axios from "axios";
import {prefix} from '@/config/global';
import Trend from '@/components/trend/index.vue';

export default {
  name: "Members",
  data() {
    return {
      membersName: "",
      membersStatus: "",
      membersPhone: "",
      membersIdCard: "",
      membersTypeId: "",
      pagenum: 1,
      pagesize: 10,
      total: 0,
      typeItem: [],
      membersList: [],
      columns: [
        {
          title: '会员编号',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'vipNo',
        },
        {
          title: '会员状态',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'vipStatus',
        },
        {
          title: '用户名',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'username',
        },
        {
          title: '会员类型',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'viptypeId',
        },
        {
          title: '累计消费',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'useronlineTotalpay',
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          minWidth: 250,
          colKey: 'op'
        }
      ],
      loading: true,
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      confirmVisible: false,
      cancelIdx: -1,
      visible: false,
      placement: 'right',
      detailMembers: {},
      UpdateMembersDialogVisible: false,
      rules: {
        username: [
          {required: true, message: '请输会员名', trigger: 'blur'},
          {min: 2, message: '长度至少2个字符', type: 'error', trigger: 'blur'}
        ],
        useronlineSex: [
          {required: true, message: '请输会员性别', trigger: 'blur'},
        ],
        useronlinePhone: [
          {required: true, message: '请输手机号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输会员密码', trigger: 'blur'},
        ],
        useronlineIdcard: [
          {required: true, message: '请输身份证', trigger: 'blur'},
        ],
        vipEndtime: [
          {required: true, message: '请输过期时间', trigger: 'blur'},
        ],
      }
    }
  }, methods: {
    queryMembers() {
      axios.get("http://localhost:8080/vip/list", {
        params: {
          pageNo: this.pagenum,
          pageSize: this.pagesize,
          viptypeId: this.membersTypeId,
          vipStatus: this.membersStatus,
          phone: this.membersPhone,
          username: this.membersName,
          idCard: this.membersIdCard
        },
        headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        console.log(result.data);
        if (result.data.code === 200) {
          this.membersList = result.data.data.vipVoList.list;
          this.typeItem = result.data.data.vipTypeList;
          this.total = result.data.data.vipVoList.total;
          this.pagesize = result.data.data.vipVoList.pageSize;
          this.pagenum = result.data.data.vipVoList.pageNum;
        } else {
          this.$message.warning(result.data.msg);
        }
        this.loading = false;
      }).catch(e => {
        this.$message.error("服务器去火星了");
      })
    },
    btnQuery() {
      this.pageNum = 1;
      this.queryMembers();
    },
    // 改变页码
    handleSizeChange(pageSize) {
      this.pagesize = pageSize
      this.btnQuery();
    },
    // 翻页
    handleCurrentChange(pageNum) {
      this.pagenum = pageNum;
      this.btnQuery();
    },
    onRest() {
      this.membersName = "";
      this.membersStatus = "";
      this.membersPhone = "";
      this.membersIdCard = "";
      this.membersTypeId = "";
    },
    onRowClick(row) {
      this.visible = true;
      axios.get("http://localhost:8080/vip/detail", {
        params: {
          id: row.row.id
        },
        headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        console.log(result.data)
        if (result.data.code === 200) {
          this.detailMembers = result.data.data;
        } else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e => {
        this.$message.error("服务器去火星了");
      })
    },
    btnFreeze(id) {
      this.$confirm('是否冻结该会员吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get("http://localhost:8080/vip/freeze", {
          params: {
            id
          },
          headers: {'jwtToken': localStorage.getItem('jwtToken')}
        }).then(result => {
          console.log(result.data)
          this.queryMembers();
        }).catch(e => {
          this.$message.error("服务器去火星了");
        })
      })
    },
    btnActivate(id) {
      this.$confirm('是否激活该会员吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get("http://localhost:8080/vip/activate", {
          params: {
            id
          },
          headers: {'jwtToken': localStorage.getItem('jwtToken')}
        }).then(result => {
          console.log(result.data)
          this.queryMembers();
        }).catch(e => {
          this.$message.error("服务器去火星了");
        })
      })
    },
    btnUpdate(id) {
      this.UpdateMembersDialogVisible = true;
      axios.get("http://localhost:8080/vip/detail", {
        params: {
          id
        },
        headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        console.log(result.data)
        if (result.data.code === 200) {
          this.detailMembers = result.data.data;
        } else {
          this.$message.warning(result.data.msg);
        }
      }).catch(e => {
        this.$message.error("服务器去火星了");
      })
    },
    clearForm() {
      this.detailMembers = {};
      this.UpdateMembersDialogVisible = false;
    },
    onUpdate() {
      axios.post("http://localhost:8080/vip/update",
        this.detailMembers,
        {headers: {'jwtToken': localStorage.getItem('jwtToken')}}
      ).then(result => {
        console.log(result.data);
        if (result.data.code === 200) {
          this.$message.success("修改会员信息成功");
        } else {
          this.$message.warning(result.data.msg);
        }
        this.clearForm();
        this.queryMembers();
      }).catch(e => {
        this.$message.error("服务器去火星了");
      })
    },
    OnBlur() {
      if (this.detailMembers.vipEndtime > new Date()) {
        this.detailMembers.vipStatus = '1';
      }
    }
  }, created() {
    this.queryMembers();
  }
}
