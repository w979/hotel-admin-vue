<template>
  <t-row :gutter="[16, 16]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ username }}
          <span class="regular"> 下午好，今天是你加入SevenHome的第 100 天～</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo" />
      </div>

      <card class="user-info-list" size="small" title="个人信息">
        <template #option>
          <t-button theme="default" shape="square" variant="text" @click="update(slotProps)">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-row class="content" justify="space-between">
          <t-col v-for="(item, index) in USER_INFO_LIST" :key="index" class="contract" :span="item.span || 3">
            <div class="contract-title">
              {{ item.title }}
            </div>
            <div class="contract-detail">
              {{ item.content }}
            </div>
          </t-col>
        </t-row>
      </card>
      <!-- 对话框开始 -->
      <t-dialog
        header="个人信息"
        body="对话框内容"
        :visible.sync="visible"
        @confirm="onConfirm"
        :onConfirm="onConfirmAnother"
        :onCancel="onCancel"
        :onEscKeydown="onKeydownEsc"
        :onCloseBtnClick="onClickCloseBtn"
        :onOverlayClick="onClickOverlay"
        :onClose="close"
      >

        <template>
          <div>
            <!--
              1. statusIcon 值为 true，显示默认图标。默认图标有 成功、失败、警告 等，不同的状态图标不同
              2. statusIcon 值为 false，不显示图标
              3. statusIcon 值类型为 function，可以自定义右侧状态图标
              4. statusIcon 为 slot(插槽)，可自定义右侧状态图标
            -->
            <t-form
              :data="formData"
              :rules="rules"
              :labelWidth="80"
              ref="formValidatorStatus"
              @reset="onReset"
              @submit="onSubmit"
              :statusIcon="true"
            >
              <t-form-item label="姓名"  name="empname">
                <t-input v-model="formData.empname"></t-input>
              </t-form-item>
              <t-form-item label="薪资" name="empSalary" successBorder>
                <t-input v-model="formData.empSalary"></t-input>
              </t-form-item>
              <t-form-item :statusIcon="false" style="padding-top: 8px">
                <t-button theme="primary" type="submit"  style="margin-right: 10px">提交</t-button>
                <t-button theme="default" variant="base" type="reset">重置</t-button>
              </t-form-item>
            </t-form>
          </div>
        </template>


      </t-dialog>
      <!-- 对话框结束 -->

      <card class="content-container">
        <t-tabs value="second">
          <t-tab-panel value="first" label="测试">
            <p>内容列表</p>
          </t-tab-panel>
          <t-tab-panel value="second" label="测试">
            <card class="card-padding-no" title="主页访问数据" describe="（次）">
              <template #options>
                <t-date-picker
                  class="card-date-picker-container"
                  :default-value="LAST_7_DAYS"
                  theme="primary"
                  mode="date"
                  range
                  @change="onLineChange"
                />
              </template>
              <div id="lineContainer" style="width: 100%; height: 330px" />
            </card>
          </t-tab-panel>
          <t-tab-panel value="third" label="测试">
            <p>内容列表</p>
          </t-tab-panel>
        </t-tabs>
      </card>
    </t-col>

    <t-col :flex="1">
      <card class="user-intro">
        <t-avatar size="90px">T</t-avatar>
        <div class="name">{{username}}</div>
        <div class="position">{{ dept }}</div>
      </card>

      <card title="团队成员" class="user-team" size="small">
        <template #option>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <t-list-item-meta :image="item.avatar" :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </card>

      <card title="服务产品" class="product-container" size="small">
        <template #option>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-row class="content" :getters="16">
          <t-col :span="3">
            <product-a-icon />
          </t-col>
          <t-col :span="3">
            <product-b-icon />
          </t-col>
          <t-col :span="3">
            <product-c-icon />
          </t-col>
          <t-col :span="3">
            <product-d-icon />
          </t-col>
        </t-row>
      </card>
    </t-col>
  </t-row>
</template>
<script>
import { prefix } from '@/config/global';
import axios from "axios";
import { LAST_7_DAYS } from '@/utils/date.ts';
import * as echarts from 'echarts/core';
import { mapState } from 'vuex';

import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { changeChartsTheme, getFolderLineDataSet } from '@/pages/dashboard/base/index';

import { USER_INFO_LIST, TEAM_MEMBERS, PRODUCT_LIST } from '@/service/service-user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';

import Card from '@/components/card/index.vue';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

export default {
  components: {
    Card,
    ProductAIcon,
    ProductBIcon,
    ProductCIcon,
    ProductDIcon,
  },
  data() {
    return {
      prefix,
      dashboardBase: '',
      lineContainer: '',
      lineChart: '',
      LAST_7_DAYS,
      USER_INFO_LIST,
      TEAM_MEMBERS,
      PRODUCT_LIST,
      username:'',// 当前登陆人姓名
      dept:'',// 当前登陆人部门级别
      deptid:'',// 当前登陆人部门id
      visible: false,// 对话框初始状态
      thisHotelId:0,// 当前登陆人所属酒店
      formData:{id:'',empname:'',empSalary:''}, // 信息
      rules: {// 表单规则
        empname: [{ required: true, message: '必填', type: 'error' }],
        empSalary: [{ required: true, message: '必填', type: 'error' }],
      },
    };
  },
  computed: {
    ...mapState('setting', ['brandTheme', 'mode']),
  },
  watch: {
    brandTheme() {
      changeChartsTheme([this.lineChart]);
    },
    mode() {
      this.renderCharts();
    },
    lineChart() {
      this.updateContainer();
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateContainer, false);
    this.renderCharts();
    this.$nextTick(() => {
      this.updateContainer();
    });

    // 缓存执行 先加载员工个人信息再加载所属团队信息
    setTimeout(() => {
      this.findAllEmp();
    }, 500);
  }, created() {
    this.findEmployeeByUserName();
  },
  methods: {
    /** 图表选择 */
    onLineChange(value) {
      this.lineChart.setOption(getFolderLineDataSet({ dateTime: value }));
    },
    updateContainer() {
      this.lineChart.resize?.({
        width: this.lineContainer.clientWidth,
        height: this.lineContainer.clientHeight,
      });
    },
    renderCharts() {
      const { chartColors } = this.$store.state.setting;
      if (!this.lineContainer) {
        this.lineContainer = document.getElementById('lineContainer');
      }
      this.lineChart = echarts.init(this.lineContainer);
      this.lineChart.setOption({
        grid: {
          x: 30, // 默认是80px
          y: 30, // 默认是60px
          x2: 10, // 默认80px
          y2: 30, // 默认60px
        },
        ...getFolderLineDataSet({ ...chartColors }),
      });
    },
    getIcon(type) {
      switch (type) {
      case 'a':
        return ProductAIcon;
      case 'b':
        return ProductBIcon;
      case 'c':
        return ProductCIcon;
      case 'd':
        return ProductDIcon;
      default:
        return ProductAIcon;
      }
    },
    /**
     * 查询员工个人信息
     */
    findEmployeeByUserName(){
      /**
       * 获取登陆人名字
       * @type {string}
       */
      const username = localStorage.getItem("username");
      axios.get('http://localhost:8080/employee/findEmployeeByUserName',{params:{username},headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data);
        // 个人信息模块赋值
        this.USER_INFO_LIST[0].content = result.data.data.empNumber;
        this.USER_INFO_LIST[1].content = result.data.data.empSalary;
        this.username = result.data.data.empname;
        this.dept = result.data.data.role.rname;
        this.deptid = result.data.data.role.id;
        this.formData.id = result.data.data.id;
        this.formData.empname = result.data.data.empname;
        this.formData.empSalary = result.data.data.empSalary;
        this.thisHotelId = result.data.data.hotelId;
        if (this.thisHotelId === 1){
          this.USER_INFO_LIST[2].content = "柒家-金融港店";
        }else if(this.thisHotelId === 2){
          this.USER_INFO_LIST[2].content = "柒家-上海打浦桥店";
        }

        // sessionStorage.setItem("id",this.thisHotelId);
      })
    },
    /**
     * 查询所有员工信息
     */
    findAllEmp(){
      this.findEmployeeByUserName();
      axios.get('http://localhost:8080/employee/findAllEmp',{params:{id:this.thisHotelId},headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
        console.log(result.data);
        // 遍历所有员工信息分别赋值到TEAM_MEMBERS
        for (let i = 0; i < result.data.data.length; i++) {
          this.TEAM_MEMBERS[i].title = result.data.data[i].empname;
          this.TEAM_MEMBERS[i].description = result.data.data[i].role.rname;
        }
      })
    },
    // 对话框相关函数开始
    onConfirm(context) {
      console.log('@confirm与onConfirm任选一种方式即可，其他几个事件类似', context);
      this.visible = false;
    },
    onConfirmAnother(context) {
      console.log('点击了确认按钮', context);
    },
    close(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onCancel(context) {
      console.log('点击了取消按钮', context);
    },
    onKeydownEsc(context) {
      console.log('按下了ESC', context);
    },
    onClickCloseBtn(context) {
      console.log('点击了关闭按钮', context);
    },
    onClickOverlay(context) {
      console.log('点击了蒙层', context);
    },
    // 对话框相关函数结束
    // 表单验证相关函数开始
    onReset() {
      this.$message.success('重置成功');
    },
    /**
     * 未写！！！！！
     * @param validateResult
     * @param firstError
     */
    onSubmit({ validateResult, firstError }) {
      if (validateResult === true) {
        alert("我进来了")
        axios.get('http://localhost:8080/employee/update', {params:{id:this.formData.id,empname:this.formData.empname,empSalary:this.formData.empSalary}},{headers:{'jwtToken':localStorage.getItem('jwtToken')}}).then(result=>{
          if (result.data.code===200){
            this.$message.success('提交成功');
          }
        }).catch(e=>{
          console.log(e);
          alert("服务器异常！")
        })

      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },
    // 表单验证相关函数结束
    update(){
      if (this.deptid !== 4){
        this.$message.warning("您没有权限修改！");
      }else {
        this.visible = true;
      }
    },
  }
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
