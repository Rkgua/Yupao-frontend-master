<template>
  <template v-if="user">
    <!-- 头像和基本信息区域 -->
    <div class="profile-header">
      <div class="avatar" :style="{ backgroundColor: avatarColor }">
        {{ user?.username?.slice(0, 1).toUpperCase() }}
      </div>
      <div class="username">{{ user?.username }}</div>
      <div class="user-account">@{{ user?.userAccount }}</div>
    </div>
    
    <!-- 个人简介 -->
    <van-cell-group title="个人简介" inset>
      <van-cell>
        <template #title>
          <div class="profile-text" :class="{ collapsed: profileCollapsed }">
            {{ user?.profile || '暂无简介' }}
          </div>
          <span v-if="user?.profile && user.profile.length > 30" style="color: #1989fa; font-size: 12px; cursor: pointer;" @click="profileCollapsed = !profileCollapsed">
            {{ profileCollapsed ? '展开全文' : '收起' }}
          </span>
        </template>
        <template #right-icon>
          <van-icon name="edit" @click="router.push({ path: '/user/edit', query: { editKey: 'profile', editName: '个人简介', currentValue: user?.profile || '' } })" />
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 基本信息 -->
    <van-cell-group title="基本信息" inset>
      <van-cell title="性别" :value="genderText" is-link @click="showGenderPicker = true" />
      <van-cell title="星球编号" :value="user?.planetCode || '-'" />
      <van-cell title="注册时间" :value="user?.createTime?.slice(0, 10) || '-'" />
      <van-cell title="修改信息" is-link @click="router.push('/user/update')" />
    </van-cell-group>
    
    <!-- 我的标签（展示） -->
    <van-cell-group title="我的标签" inset>
      <div class="tags-display">
        <div v-if="displayTags.length > 0" class="tags-list">
          <van-tag v-for="(tag, index) in displayTags" :key="index" type="primary" size="large" class="user-tag">
            {{ tag }}
          </van-tag>
        </div>
        <van-empty v-else description="暂无标签" :image-size="40" />
      </div>
      <van-cell>
        <template #title>
          <van-button size="small" type="primary" plain @click="showTagEditor = !showTagEditor">
            {{ showTagEditor ? '关闭编辑' : '修改标签' }}
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 标签编辑器（折叠） -->
    <van-cell-group v-if="showTagEditor" title="标签编辑" inset>
      <div class="tag-section">
        <div class="tag-label">我的标签（选择1-3个）</div>
        <van-checkbox-group v-model="ownTags" :max="3">
          <div class="checkbox-grid">
            <van-checkbox v-for="tag in availableTags" :key="tag" :name="tag" shape="square" class="tag-checkbox-item">
              {{ tag }}
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </div>
      
      <div class="tag-section">
        <div class="tag-label">感兴趣的标签（选择1-3个）</div>
        <van-checkbox-group v-model="interestedTags" :max="3">
          <div class="checkbox-grid">
            <van-checkbox v-for="tag in availableTags" :key="tag" :name="tag" shape="square" class="tag-checkbox-item">
              {{ tag }}
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </div>
      
      <div class="save-btn">
        <van-button type="primary" size="small" @click="saveTags">保存标签</van-button>
      </div>
    </van-cell-group>
    
    <!-- 队伍信息 -->
    <van-cell-group title="队伍信息" inset>
      <van-cell title="我创建的队伍" is-link to="/user/team/create" />
      <van-cell title="我加入的队伍" is-link to="/user/team/join" :value="joinedTeamName || '暂未加入队伍'" />
    </van-cell-group>

    <!-- 性别选择弹窗 -->
    <van-action-sheet v-model:show="showGenderPicker" :actions="genderOptions" @select="onGenderSelect" cancel-text="取消" />
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref, computed} from "vue";
import myAxios, {ApiResponse} from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";
import {parseTags} from "../utils/tags";

const user = ref<any>(null);
const ownTags = ref<string[]>([]);
const interestedTags = ref<string[]>([]);
const availableTags = ref<string[]>([]);
const joinedTeamName = ref<string>('');
const showTagEditor = ref<boolean>(false);
const showGenderPicker = ref<boolean>(false);
const profileCollapsed = ref<boolean>(true);

// 性别选项
const genderOptions = [
  { name: '男', value: 0 },
  { name: '女', value: 1 },
  { name: '未知', value: 2 },
];

// 头像颜色
const colors = ['#1989fa', '#07c160', '#ff6034', '#ffb702', '#7238ca', '#ee0a24'];
const avatarColor = computed(() => {
  if (!user.value?.id) return '#1989fa';
  return colors[user.value.id % colors.length];
});

const genderText = computed(() => {
  const map: Record<number, string> = { 0: '男', 1: '女' };
  if (user.value?.gender === 0 || user.value?.gender === 1) return map[user.value.gender];
  return '未知';
});

const displayTags = computed(() => {
  if (ownTags.value.length > 0) {
    return ownTags.value.slice(0, 3);
  }
  return [];
});

const router = useRouter();

// 性别选择
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

onMounted(async () => {
  // 加载标签选项（统一从 tags.json 取）
  try {
    const tagsRes = await fetch('/tags.json');
    const tagsData = await tagsRes.json();
    availableTags.value = tagsData.tags;
  } catch (e) {
    console.error('加载标签失败', e);
    availableTags.value = ['Java', 'Python', 'Go', '前端', '后端'];
  }

  // 加载用户信息
  user.value = await getCurrentUser();
  if (user.value?.tags) {
    try { ownTags.value = JSON.parse(user.value.tags); } catch { ownTags.value = []; }
  }
  if (user.value?.interestedTags) {
    try { interestedTags.value = JSON.parse(user.value.interestedTags); } catch { interestedTags.value = []; }
  }
  loadJoinedTeam();
})

const loadJoinedTeam = async () => {
  try {
    const res: ApiResponse<any[]> = await myAxios.get('/team/list/my/join', {
      params: { pageNum: 1 }
    });
    if (res?.code === 0 && res.data && res.data.length > 0) {
      joinedTeamName.value = res.data.map((t: any) => t.name).join('、');
    } else {
      joinedTeamName.value = '';
    }
  } catch (e) {
    console.error('加载队伍失败', e);
    joinedTeamName.value = '';
  }
}

const saveTags = async () => {
  if (!user.value?.id) {
    Toast.fail('未登录');
    return;
  }
  if (ownTags.value.length === 0) {
    Toast.fail('请至少选择一个标签');
    return;
  }

  // 保存自己的标签
  const payload: any = { id: user.value.id, tags: JSON.stringify(ownTags.value) };
  // 如果有感兴趣的标签也一起保存
  if (interestedTags.value.length > 0) {
    payload.interestedTags = JSON.stringify(interestedTags.value);
  }
  const res: ApiResponse<number> = await myAxios.post('/user/update', payload);
  if (res?.code === 0) {
    Toast.success('标签已保存');
    user.value.tags = JSON.stringify(ownTags.value);
    if (interestedTags.value.length > 0) {
      user.value.interestedTags = JSON.stringify(interestedTags.value);
    }
    showTagEditor.value = false;
  } else {
    Toast.fail('保存失败');
  }
}
</script>

<style scoped>
.profile-header {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  border: 3px solid white;
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-account {
  font-size: 14px;
  opacity: 0.8;
}

.profile-text {
  font-size: 14px;
  color: #323233;
  line-height: 1.5;
  word-break: break-all;
}

.profile-text.collapsed {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.tags-display {
  padding: 12px 16px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-tag {
  margin: 0;
}

.tag-section {
  padding: 12px 16px;
}

.tag-label {
  font-size: 14px;
  color: #646a73;
  margin-bottom: 12px;
}

.checkbox-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-checkbox-item {
  margin: 0;
}

:deep(.van-checkbox) {
  margin: 0;
  padding: 4px 8px;
  border: 1px solid #ebedf0;
  border-radius: 4px;
}

:deep(.van-checkbox__label) {
  margin-left: 4px;
  font-size: 13px;
}

.save-btn {
  padding: 12px 16px;
  text-align: center;
}
</style>