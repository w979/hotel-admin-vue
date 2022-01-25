import axios from "axios";
import {prefix} from '@/config/global';
import Trend from '@/components/trend/index.vue';


export default {
  components: {
    Trend,
  },
  name: "Level",
  data() {
    return {
      viptypeList: [],
      columns: [
        {
          title: '会员类型',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'viptypeName',
        },
        {
          title: '会员等级',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'viptypeLevel',
        },
        {
          title: '会员折扣',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'viptypeDiscount',
        },
        {
          title: '会员门槛',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          colKey: 'viptypeStep',
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          minWidth: 150,
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
      AddViptypeDialogVisible: false,
      UpdateViptypeDialogVisible: false,
      vipTypeFo: {
        id: null,
        viptypeName: "",
        viptypeLevel: "",
        viptypeDiscount: "",
        viptypeStep: ""
      },
      rules: {
        viptypeName: [
          {required: true, message: '请输会员类型', trigger: 'blur'},
          {min: 2, message: '长度至少2个字符', type: 'error', trigger: 'blur'}
        ],
        viptypeLevel: [
          {required: true, message: '请选择会员等级', trigger: 'blur'},
        ],
        viptypeDiscount: [
          {required: true, message: '请输入会员折扣', trigger: 'blur'},
          {pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/, required: true, message: "折扣必须为小数（保留小数点后两位）", trigger: "blur"}
        ],
        viptypeStep: [
          {required: true, message: '请输入会员门槛', trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, required: true, message: "门槛必须为正整数", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    queryLevelList() {
      axios.get("http://localhost:8080/viptype/list", {
        params: {},
        headers: {'jwtToken': localStorage.getItem('jwtToken')}
      }).then(result => {
        console.log(result.data);
        if(result.data.code===200) {
          this.viptypeList = result.data.data;
        }else {
          this.$message.error(result.data.msg);
        }
        this.loading = false;
      }).catch(e => {
        this.$message.error("服务器去火星了");
      })
    },
    showAdd() {
      this.AddViptypeDialogVisible = true;
    },
    clearForm() {
      this.vipTypeFo = {
        id: null,
        viptypeName: "",
        viptypeLevel: "",
        viptypeDiscount: "",
        viptypeStep: ""
      };
      this.AddViptypeDialogVisible = false;
      this.UpdateViptypeDialogVisible = false;
    },
    onAdd({validateResult, firstError}) {
      if (validateResult === true) {
        axios.post("http://localhost:8080/viptype/add", this.vipTypeFo,
          {headers: {'jwtToken': localStorage.getItem('jwtToken')}})
          .then(result => {
            console.log(result.data);
            if (result.data.code === 200) {
              this.$message.success("添加会员类型成功");
            } else {
              this.$message.warning(result.data.msg);
            }
            this.clearForm();
            this.queryLevelList();
          })
          .catch(e => {
            this.$message.error("服务器去火星了");
          })
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },
    showUpdate(row) {
      this.vipTypeFo = row;
      this.UpdateViptypeDialogVisible = true;
    },
    onUpdate() {
      axios.post("http://localhost:8080/viptype/update", this.vipTypeFo,
        {headers: {'jwtToken': localStorage.getItem('jwtToken')}})
        .then(result => {
          console.log(result.data);
          if (result.data.code === 200) {
            this.$message.success("修改会员类型成功");
          } else {
            this.$message.warning(result.data.msg);
          }
          this.clearForm();
          this.queryLevelList();
        })
        .catch(e => {
          this.$message.error("服务器去火星了");
        })
    }


  },
  created() {
    this.queryLevelList();
  }
}
