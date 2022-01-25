<template>
  <result title="网络异常" tip="网络异常，请稍后再试" type="wifi">
    <div>
      <t-button @click="() => $router.push('/dashboard/base')">重新加载</t-button>
      <t-button theme="default" @click="() => $router.push('/dashboard/base')">返回首页</t-button>
    </div>
  </result>
</template>

<script>
import result from '@/components/result/index.vue';

export default {
  name: 'result-network-error',
  components: { result },
};
</script>
