<template>
  <div :class="cardClass">
    <div class="list-card-item_detail">
      <t-row justify="space-between">
        <div :class="cardLogoClass">
          <shop-icon v-if="product.roomType.bedNumber === 1" />
          <calendar-icon v-if="product.roomType.bedNumber === 2" />
          <service-icon v-if="product.roomType.bedNumber === 3" />
          <user-avatar-icon v-if="product.roomType.bedNumber === 4" />
          <laptop-icon v-if="product.roomType.bedNumber === 5" />
        </div>

          <t-tag v-if="product.roomStatus=='1' && product.rs.roomstatus==0" theme="success" variant="light">空闲</t-tag>
          <t-tag v-if="product.rs.roomstatus==1" theme="primary" variant="light">已预约</t-tag>
          <t-tag v-if="product.rs.roomstatus==2" theme="default" :disabled="product.rs.roomstatus==2" variant="light">已入住</t-tag>
          <t-tag v-if="product.roomStatus=='2' && product.rs.roomstatus==0" theme="warning" variant="light">待打扫</t-tag>
          <t-tag v-if="product.roomStatus=='3' && product.rs.roomstatus==0" theme="danger" variant="light">待维修</t-tag>
          <t-tag v-if="product.roomStatus=='4' && product.rs.roomstatus==0" theme="danger" :disabled="product.rs.roomstatus==4" variant="light">维修中</t-tag>

      </t-row>
      <p class="list-card-item_detail--name">
        {{ product.roomType.roomtypeName }}
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <t-tag theme="primary" variant="light">{{ product.rs.roomstatusDate }}</t-tag>
      </p>
      <p class="list-card-item_detail--name">
        <t-tag theme="primary" variant="light">{{ product.roomType.breakfast }}</t-tag>
        <t-tag theme="danger" variant="light">{{product.roomType.smoking}}</t-tag>
      </p>
      <p class="list-card-item_detail--desc">{{ product.roomType.bedType }}</p>
      <t-row justify="space-between" align="middle" :class="cardControlClass">
        <div>
          <t-button shape="circle" :disabled="!product.rs.roomstatus">{{ typeMap[product.roomType.bedNumber - 1] }}</t-button>
          <t-button shape="circle" :disabled="!product.rs.roomstatus"><add-icon /></t-button>
        </div>
        <t-dropdown
          :disabled="!(product.roomStatus==1 && product.rs.roomstatus==0)"
          trigger="click"
          :options="[
            {
              content: '管理',
              value: 'manage',
              onClick: () => handleClickManage(product),
            },
            {
              content: '删除',
              value: 'delete',
              onClick: () => handleClickDelete(product),
            },
            {
              content: 'Go',
              value: 'dump',
              onClick: () => gotoAppointment(product),
            },
          ]"
        >
          <t-button theme="default" :disabled="!(product.roomStatus==1 && product.rs.roomstatus==0)" shape="square" variant="text">
            <more-icon />
          </t-button>
        </t-dropdown>
      </t-row>
    </div>
  </div>
</template>
<script lang="ts">
import { ShopIcon, CalendarIcon, ServiceIcon, UserAvatarIcon, LaptopIcon, MoreIcon, AddIcon } from 'tdesign-icons-vue';
import axios from "axios";

export default {
  name: 'list-card',
  components: {
    ShopIcon,
    CalendarIcon,
    ServiceIcon,
    UserAvatarIcon,
    LaptopIcon,
    MoreIcon,
    AddIcon,
  },
  props: {
    product: {
      type: Object,
      rs:false,
    },
  },
  data() {
    const typeMap = ['A', 'B', 'C', 'D', 'E'];
    return {
      typeMap,
      username:'',// 当前登陆人姓名
    };
  },
  computed: {
    cardClass() {
      return [
        'list-card-item',
        {
          'list-card-item__disabled': this.product.rs.roomstatus,
        },
      ];
    },
    cardLogoClass() {
      return [
        'list-card-item_detail--logo',
        {
          'list-card-item_detail--logo__disabled': this.product.rs.roomstatus,
        },
      ];
    },
    cardControlClass() {
      return [
        'list-card-item_detail--control',
        {
          'list-card-item_detail--control__disabled': this.product.rs.roomstatus,
        },
      ];
    },
  },
  methods: {
    handleClickManage(product) {
      this.$emit('manage-product', product);
    },
    handleClickDelete(product) {
      this.$emit('showClose', product);
    },
    gotoAppointment(product){
      console.log(product)
      this.$router.push({name: 'checkin',params:{ product:product}});
    },
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables';

.list-card-item {
  display: flex;
  flex-direction: column;
  border-radius: @border-radius;
  overflow: hidden;
  cursor: pointer;
  color: @text-color-secondary;

  &_detail {
    flex: 1;
    background: @bg-color-container;
    padding: 24px 32px;
    min-height: 140px;

    &--logo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: @brand-color-1;
      font-size: 32px;
      color: @brand-color;

      &__disabled {
        color: @brand-color-3;
      }
    }

    &--name {
      margin: 24px 0 8px 0;
      font-size: 16px;
      font-weight: 400;
      color: @text-color-primary;
    }

    &--desc {
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 24px;
      height: 40px;
    }

    &--control {
      > div:first-child {
        position: relative;

        > button:last-child {
          position: absolute;
          left: 18px;
          background-color: @brand-color-2;
          --ripple-color: @brand-color-2;
        }
      }

      .t-icon-more {
        font-size: 24px;
        color: @text-color-primary;
      }
    }
  }

  &__disabled {
    color: @text-color-disabled;

    .list-card-item_detail--name {
      color: @text-color-disabled;
    }

    .t-icon-more {
      color: @text-color-disabled;
    }

    .t-button--theme-primary {
      color: @text-color-disabled;
    }
  }
}
</style>
