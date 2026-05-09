<template>
  <!-- 性别编辑走弹窗 -->
  <template v-if="editUser.editKey === 'gender'">
    <van-action-sheet v-model:show="showPicker" :actions="genderOptions" @select="onGenderSelect" cancel-text="取消" />
  </template>

  <!-- 其他字段编辑走表单 -->
  <van-form v-else @submit="onSubmit">
    <van-field
      v-model="editUser.currentValue"
      :name="editUser.editKey"
      :label="editUser.editName"
      :placeholder="`请输入${editUser.editName}`"
      :rules="fieldRules"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import myAxios, { ApiResponse } from "../plugins/myAxios";
import { Toast } from "vant";
import { getCurrentUser } from "../services/user";

const route = useRoute();
const router = useRouter();
const showPicker = ref(true);

const editUser = ref({
  editKey: route.query.editKey as string,
  currentValue: route.query.currentValue as string,
  editName: route.query.editName as string,
});

const genderOptions = [
  { name: '男', value: 0 },
  { name: '女', value: 1 },
  { name: '未知', value: 2 },
];

// 字段校验规则
const fieldRules = computed(() => {
  const key = editUser.value.editKey;
  if (key === 'phone') {
    return [{ pattern: /^\d{0,11}$/, message: '电话只能包含数字' }];
  }
  if (key === 'username') {
    return [{ pattern: /^[^\d]+$/, message: '昵称不能包含数字' }];
  }
  return [];
});

const onSubmit = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  const res: ApiResponse<number> = await myAxios.post('/user/update', {
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  })
  if (res.code === 0 && res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail('修改错误');
  }
};

// 性别选择
const onGenderSelect = async (action: { name: string; value: number }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }
  const res: ApiResponse<number> = await myAxios.post('/user/update', {
    id: currentUser.id,
    gender: action.value,
  });
  if (res?.code === 0) {
    Toast.success('性别修改成功');
    router.back();
  } else {
    Toast.fail('修改失败');
  }
};
</script>

<style scoped></style>
