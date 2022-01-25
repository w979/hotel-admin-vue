<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.username" size="large" placeholder="请输入账号">
          <template #prefix-icon>
            <t-icon name="user"/>
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on"/>
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = showPsw"/>
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh">刷新 <t-icon name="refresh" color="#0052D9"/> </span>
      </div>
      <qrcode-vue value="" :size="192" level="H"/>
    </template>

    <!-- 手机号登陆 -->
    <template v-else>
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <t-icon name="user"/>
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码"/>
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录</t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用微信扫码登录</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用手机号登录</span>
    </div>
  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import QrcodeVue from 'qrcode.vue';
import axios from "axios";

// const INITIAL_DATA = {
//   phone: '',
//   username: 'admin',
//   password: 'admin',
//   verifyCode: '',
//   checked: false,
// };

const FORM_RULES = {
  phone: [{required: true, message: '手机号必填', type: 'error'}],
  username: [{required: true, message: '账号必填', type: 'error'}],
  password: [{required: true, message: '密码必填', type: 'error'}],
  verifyCode: [{required: true, message: '验证码必填', type: 'error'}],
};
/** 高级详情 */
export default Vue.extend({
  name: 'Login',
  components: {
    // QrcodeVue,
  },
  data() {
    return {
      FORM_RULES,
      type: 'password',
      formData: {username: '', password: ''},
      showPsw: false,
      countDown: 0,
      intervalTimer: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    switchType(val) {
      this.type = val;
      this.$refs.form.reset();
    },
    async onSubmit({validateResult}) {
      // 将传回后端的数据从JsonString转为QueryString
      const queryUser = new URLSearchParams({
        username: this.formData.username,
        password: this.formData.password
      })

      const dumpURL = await this.$store.dispatch('user/login', this.formData);
      axios.post('http://localhost:8080/login', queryUser.toString(), {contentType: 'application/x-www-form-urlencoded'}).then(result => {
        console.log(result.data);
        if (result.data.code === 200) {
          this.$message.success('登录成功');
          localStorage.setItem("username", this.formData.username);
          localStorage.setItem("jwtToken", result.data.data);
          this.$router.replace('/dashboard/base').catch(() => '');
          dumpURL;
        } else {
          this.$message.error(result.data.msg);
        }
      }).catch(e => {
        this.$message.error("服务器出错了！");
      })
    },
    handleCounter() {
      this.countDown = 60;
      this.intervalTimer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1;
        } else {
          clearInterval(this.intervalTimer);
          this.countDown = 0;
        }
      }, 1000);
    },
  },
});
</script>
