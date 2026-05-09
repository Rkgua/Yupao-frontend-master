<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList" :key="user.id">
    <van-card :title="`${user.username}（${user.planetCode}）`" :desc="user.profile || '暂无简介'">
      <template #thumb>
        <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(user.id) }">
          {{ user.username?.slice(0, 1).toUpperCase() }}
        </div>
      </template>
      <template #tags>
        <van-tag plain type="primary" v-for="(tag, index) in getDisplayTags(user.tags)" :key="index" class="user-tag">
          {{ tag }}
        </van-tag>
        <van-tag v-if="getDisplayTags(user.tags).length < getTagCount(user.tags)" type="default" class="user-tag-more">
          +{{ getTagCount(user.tags) - getDisplayTags(user.tags).length }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" type="primary">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {parseTags} from "../utils/tags";

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  userList: () => [],
});

// 颜色列表
const colors = ['#1989fa', '#07c160', '#ff6034', '#ffb702', '#7238ca', '#ee0a24'];

// 根据用户ID生成固定颜色
const getAvatarColor = (userId: number) => {
  if (!userId) return colors[0];
  return colors[userId % colors.length];
};

// 获取显示的标签（前3个）
const getDisplayTags = (tags: string | string[] | undefined | null) => {
  return parseTags(tags).slice(0, 3);
};

// 获取标签总数
const getTagCount = (tags: string | string[] | undefined | null) => {
  return parseTags(tags).length;
};
</script>

<style scoped>
.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.user-tag {
  margin-right: 6px;
  margin-top: 4px;
}

.user-tag-more {
  margin-right: 6px;
  margin-top: 4px;
}
</style>