<template>
  <form action="/">
    <van-search
      v-model="searchText"
      show-action
      placeholder="请输入要搜索的标签"
      @search="onSearch"
      @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0">请选择标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="medium" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select
    v-model:active-id="activeIds"
    v-model:main-active-index="activeIndex"
    :items="tagList"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const searchText = ref("");
const originTagList = ref([
  {
    text: "性别",
    children: [
      { text: "男", id: "男" },
      { text: "女", id: "女" },
    ],
  },
  {
    text: "年级",
    children: [
      { text: "大一", id: "大一" },
      { text: "大二", id: "大二" },
    ],
  },
]);
let tagList = ref(originTagList.value);

// 方式1: fetch 加载静态JSON数据
onMounted(async () => {
  try {
    // 加载标签数据
    const tagsRes = await fetch('/tags.json');
    const tagsData = await tagsRes.json();
    
    // 加载性别数据
    const genderRes = await fetch('/gender.json');
    const genderData = await genderRes.json();
    
    // 构建树形选择器数据
    originTagList.value = [
      {
        text: "性别",
        children: genderData.gender.map((item: any) => ({
          text: item.label,
          id: item.label
        }))
      },
      {
        text: "标签",
        children: tagsData.tags.slice(0, 20).map((tag: string) => ({
          text: tag,
          id: tag
        }))
      }
    ];
    tagList.value = originTagList.value;
    
    console.log('静态数据加载完成');
  } catch (error) {
    console.error('加载静态数据失败:', error);
  }
});

/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  tagList.value = originTagList.value.map((parentTag: any) => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = { ...parentTag };
    tempParentTag.children = tempChildren.filter((item: any) =>
      item.text.includes(searchText.value),
    );
    return tempParentTag;
  });
};
const onCancel = () => {
  searchText.value = "";
  tagList.value = originTagList.value;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter((item) => {
    return item !== tag;
  });
};

/**
 * 执行搜索
 */
const doSearchResult = () => {
  router.push({
    path: "/user/list",
    query: {
      tags: activeIds.value,
    },
  });
};
</script>

<style scoped></style>
