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
import { ref, watch, onMounted } from "vue";
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

const parseTags = (tagsStr: string | undefined | null): string[] => {
  if (!tagsStr) return [];
  try { return JSON.parse(tagsStr); } catch { return []; }
};

/**
 * 加载数据
 */
const loadData = async () => {
  const currentUserCheck = await getCurrentUser();
  if (!currentUserCheck) {
    router.push("/user/login");
    return;
  }

  let userListData;
  loading.value = true;
  if (isMatchMode.value) {
    const ownTags = parseTags(currentUserCheck.tags);
    const interestedTags = parseTags(currentUserCheck.interestedTags);
    userListData = await myAxios
      .post("/user/match/tags", {
        num: 10,
        ownTags,
        interestedTags,
      })
      .then((r: any) => r?.data)
      .catch(() => { Toast.fail("请求失败"); return null; });
  } else {
    userListData = await myAxios
      .get("/user/recommend", {
        params: { pageSize: 8, pageNum: 1 },
      })
      .then((r: any) => r?.data?.records)
      .catch(() => { Toast.fail("请求失败"); return null; });
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (typeof user.tags === 'string') {
        user.tags = parseTags(user.tags);
      }
    });
    userList.value = userListData;
  }
  loading.value = false;
};

watch(isMatchMode, () => { loadData(); });
onMounted(() => { loadData(); });
</script>

<style scoped></style>
