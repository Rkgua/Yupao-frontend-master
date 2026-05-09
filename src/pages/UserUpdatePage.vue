<template>
  <template v-if="user">
    <van-cell title="昵称" is-link :value="user.username" @click="toEdit('username', '昵称', user.username)" />
    <van-cell title="账号" :value="user.userAccount" />
    <van-cell title="头像" is-link>
      <img style="height: 48px" :src="user.avatarUrl" />
    </van-cell>
    <van-cell title="性别" is-link :value="genderText" @click="showGenderPicker = true" />
    <van-cell title="电话" is-link :value="user.phone" @click="toEdit('phone', '电话', user.phone)" />
    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit('email', '邮箱', user.email)" />
    <van-cell title="星球编号" :value="user.planetCode" />
    <van-cell title="注册时间" :value="user.createTime" />

    <!-- 性别选择弹窗 -->
    <van-action-sheet v-model:show="showGenderPicker" :actions="genderOptions" @select="onGenderSelect" cancel-text="取消" />
  </template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import myAxios, { ApiResponse } from "../plugins/myAxios";
import { Toast } from "vant";
import { getCurrentUser } from "../services/user";

const user = ref<any>();
const showGenderPicker = ref(false);

const genderOptions = [
  { name: '男', value: 0 },
  { name: '女', value: 1 },
  { name: '未知', value: 2 },
];

const genderText = computed(() => {
  const map: Record<number, string> = { 0: '男', 1: '女' };
  if (user.value?.gender === 0 || user.value?.gender === 1) return map[user.value.gender];
  return '未知';
});

onMounted(async () => {
  user.value = await getCurrentUser();
});

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
};

const onGenderSelect = async (action: { name: string; value: number }) => {
  if (!user.value?.id) return;
  const res: ApiResponse<number> = await myAxios.post('/user/update', {
    id: user.value.id,
    gender: action.value,
  });
  if (res?.code === 0) {
    user.value.gender = action.value;
    Toast.success('性别修改成功');
  } else {
    Toast.fail('修改失败');
  }
  showGenderPicker.value = false;
};
</script>

<style scoped></style>
