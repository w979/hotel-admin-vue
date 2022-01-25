<template>
    <!--选项卡-->
    <div class="tdesign-demo-block-column-large">
      <div class="tdesign-demo-block-column">
    <t-tabs
      :value="value1"
      theme="card"
      @change="(newValue) => value1 = newValue"
    >
      <t-tab-panel value="first" label="线上订单">
        <div class="list-common-table">
          <t-form ref="form" :label-width="75" colon>
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[16, 16]">
                  <t-col :flex="1">
                    <t-form-item label="姓名" name="name">
                      <t-input
                        class="form-item-content"
                        v-model="formData.name"
                        type="search"
                        placeholder="请输入姓名"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="订单状态"  name="status">
                      <t-select placeholder="请选择订单状态" v-model="formData.status" :style="{ minWidth: '134px' }">
                        <t-option v-for="item in statusItem" :value="item.value" :label="item.label" :key="item.value"></t-option>
                      </t-select>
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="所属酒店" name="status">
                      <t-select class="form-item-content`" v-model="formData.hotelid" placeholder="请选择所属酒店" :style="{ minWidth: '134px' }">
                        <t-option v-for="item in hotelItem" :value="item.id" :label="item.hotelName" :key="item.id"></t-option>
                      </t-select>
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="订单编号" name="name">
                      <t-input
                        v-model="formData.orderno"
                        class="form-item-content"
                        type="search"
                        placeholder="请输入订单编号"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>

                </t-row>
              </t-col>

              <t-col :span="2" class="operation-container">
                <t-button theme="primary" type="submit" @click="selectQuery" :style="{ marginLeft: '8px' }"> 查询 </t-button>
                <t-button type="reset" variant="base" @click="btnClear" theme="default"> 重置 </t-button>
              </t-col>
            </t-row>
          </t-form>

          <div class="table-container">
            <t-table
              v-loading="loading"
              :data="data"
              :columns="columns"
              :rowKey="rowKey"
              :verticalAlign="verticalAlign"
              :hover="hover"
            >

              <template #status="{ row }">
                <t-tag v-if="row.status === '1'" theme="success" variant="light">已完成</t-tag>
                <t-tag v-if="row.status === '2'" theme="warning" variant="light">已取消</t-tag>
                <t-tag v-if="row.status === '3'" theme="success" variant="light">已缴费</t-tag>
                <t-tag v-if="row.status === '4'" theme="primary" variant="light">已生效</t-tag>
              </template>

              <template #origin="{ row }">
                <t-tag v-if="row.origin === 1" theme="success" variant="light">线上</t-tag>
                <t-tag v-if="row.origin === 2" theme="warning" variant="light">线下</t-tag>
              </template>

              <template #op="slotProps">

                <a class="t-button-link" @click="rehandleClickOp(slotProps)" t-icon="browse" data-t-icon="browse">
                  <t-button variant="outline" theme="primary">详情</t-button>
                </a>

                <a style="margin-left: 12px" class="t-button-link" @click="handleClickDelete(slotProps)">
                  <t-button variant="outline" theme="danger">删除</t-button></a>
              </template>
            </t-table>

            <div align="center">
              <!-- 分页开始 -->
              <el-pagination
                style="margin-top:10px;"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="this.pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="this.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
            <!-- 分页结束 -->

            <t-dialog
              header="确认将订单状态改为已取消？"
              :visible.sync="confirmVisible"
              @confirm="onConfirmDelete"
              :onCancel="onCancel"
            >
            </t-dialog>
          </div>
        </div>
      </t-tab-panel>



      <t-tab-panel value="second" label="线下订单">
        <div class="list-common-table">
          <t-form ref="form" :label-width="75" colon>
            <t-row>
              <t-col :span="10">
                <t-row :gutter="[16, 16]">
                  <t-col :flex="1">
                    <t-form-item label="姓名" name="name">
                      <t-input
                        class="form-item-content"
                        v-model="formData.name"
                        type="search"
                        placeholder="请输入姓名"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="订单状态"  name="status">
                      <t-select placeholder="请选择订单状态" v-model="formData.status" :style="{ minWidth: '134px' }">
                        <t-option v-for="item in statusItem" :value="item.value" :label="item.label" :key="item.value"></t-option>
                      </t-select>
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="所属酒店" name="status">
                      <t-select class="form-item-content`" v-model="formData.hotelid" placeholder="请选择所属酒店" :style="{ minWidth: '134px' }">
                        <t-option v-for="item in hotelItem" :value="item.id" :label="item.hotelName" :key="item.id"></t-option>
                      </t-select>
                    </t-form-item>
                  </t-col>

                  <t-col :flex="1">
                    <t-form-item label="订单编号" name="name">
                      <t-input
                        v-model="formData.orderno"
                        class="form-item-content"
                        type="search"
                        placeholder="请输入订单编号"
                        :style="{ minWidth: '134px' }"
                      />
                    </t-form-item>
                  </t-col>

                </t-row>
              </t-col>

              <t-col :span="2" class="operation-container">
                <t-button theme="primary" type="submit" @click="selectQuery2" :style="{ marginLeft: '8px' }"> 查询 </t-button>
                <t-button type="reset" variant="base" @click="btnClear" theme="default"> 重置 </t-button>
              </t-col>
            </t-row>
          </t-form>


          <div class="table-container">
            <t-table
              v-loading="loading"
              :data="dataReality"
              :columns="columns"
              :rowKey="rowKey"
              :verticalAlign="verticalAlign"
              :hover="hover"
            >

              <template #status="{ row }">
                <t-tag v-if="row.status === '1'" theme="success" variant="light">已完成</t-tag>
                <t-tag v-if="row.status === '2'" theme="warning" variant="light">已取消</t-tag>
                <t-tag v-if="row.status === '3'" theme="success" variant="light">已缴费</t-tag>
                <t-tag v-if="row.status === '4'" theme="primary" variant="light">已生效</t-tag>
              </template>

              <template #origin="{ row }">
                <t-tag v-if="row.origin === 1" theme="success" variant="light">线上</t-tag>
                <t-tag v-if="row.origin === 2" theme="warning" variant="light">线下</t-tag>
              </template>

              <template #op="slotProps">

                <a class="t-button-link" @click="rehandleClickOp(slotProps)" t-icon="browse" data-t-icon="browse">
                  <t-button variant="outline" theme="primary">详情</t-button>
                </a>
                &nbsp;
                <a class="t-button-link" @click="handleClickDelete(slotProps)">
                  <t-button variant="outline" theme="danger">删除</t-button></a>
              </template>
            </t-table>
            <div align="center">
              <!-- 分页开始 -->
              <el-pagination
                style="margin-top:10px;"
                background
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page="this.pageNum2"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="this.pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total2"
              ></el-pagination>
            </div>
            <!-- 分页结束 -->
            <t-dialog
              header="确认将订单状态改为已取消？"
              :visible.sync="confirmVisible"
              @confirm="onConfirmDelete"
              :onCancel="onCancel"
            >
            </t-dialog>
          </div>
        </div>
      </t-tab-panel>
    </t-tabs>
      </div>

      <div>
        <t-drawer :visible.sync="visible" header="详情" :onConfirm="onClickConfirm" :placement="placement" :closeBtn="true">
          <t-list :split="true">
            <t-list-item>
              <t-list-item-meta title="订单状态" v-if="detail.status==='1'" description="已完成"></t-list-item-meta>
              <t-list-item-meta title="订单状态" v-if="detail.status==='2'" description="已取消"></t-list-item-meta>
              <t-list-item-meta title="订单状态" v-if="detail.status==='3'" description="已缴费"></t-list-item-meta>
              <t-list-item-meta title="订单状态" v-if="detail.status==='4'" description="已生效"></t-list-item-meta>
            </t-list-item>
            <t-list-item>
              <t-list-item-meta title="姓名" :description="detail.name"></t-list-item-meta>
            </t-list-item>
            <t-list-item>
              <t-list-item-meta title="房间号" :description="detail.roomno"></t-list-item-meta>
            </t-list-item>
            <t-list-item>
              <t-list-item-meta title="联系方式" :description="detail.phone"></t-list-item-meta>
            </t-list-item>
            <t-list-item>
              <t-list-item-meta title="当前酒店" :description="detail.hotelname"></t-list-item-meta>
            </t-list-item>
          </t-list>
        </t-drawer>
      </div>
    </div>
    <!--选项卡结束-->
</template>



<script src="./Orders.js">

</script>

<style lang="less">
@import '@/style/variables.less';

.list-common-table {
  background-color: @bg-color-container;
  padding: 30px 32px;
  border-radius: @border-radius;

.table-container {
  margin-top: 30px;
}
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.payment-col {
  display: flex;

.trend-container {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
}

</style>
