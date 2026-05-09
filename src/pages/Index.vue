<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading" />
  <van-empty v-if="!userList || userList.length < 1" description="数据为空" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import myAxios, { ApiResponse } from "../plugins/myAxios";
import { Toast } from "vant";
import UserCardList from "../components/UserCardList.vue";
import { UserType } from "../models/user";
import { getCurrentUser } from "../services/user";

const router = useRouter();

const isMatchMode = ref<boolean>(false);

const userList = ref([]);
const loading = ref(true);

/**
 * 加载数据
 */
const loadData = async () => {
  // 检查登录状态
  const currentUserCheck = await getCurrentUser();
  if (!currentUserCheck) {
    router.push("/user/login");
    return;
  }

  let userListData;
  loading.value = true;
  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    // 获取当前用户信息
    const currentUser = currentUserCheck;
    // 解析用户自己的标签和感兴趣的标签
    let ownTags: string[] = [];
    let interestedTags: string[] = [];
    if (currentUser) {
      if (currentUser.tags) {
        try {
          ownTags = JSON.parse(currentUser.tags);
        } catch {
          ownTags = [];
        }
      }
      if (currentUser.interestedTags) {
        try {
          interestedTags = JSON.parse(currentUser.interestedTags);
        } catch {
          interestedTags = [];
        }
      }
    }
    userListData = await myAxios
      .post("/user/match/tags", {
        num,
        ownTags,
        interestedTags,
      })
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        Toast.fail("请求失败");
      });
  } else {
    // 普通模式，直接分页查询用户
    userListData = await myAxios
      .get("/user/recommend", {
        params: {
          pageSize: 8,
          pageNum: 1,
        },
      })
      .then(function (response) {
        return response?.data?.records;
      })
      .catch(function (error) {
        Toast.fail("请求失败");
      });
  }
  if (userListData) {
    userList.value = userListData;
  }
  loading.value = false;
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped></style>
