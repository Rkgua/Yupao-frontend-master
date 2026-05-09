<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="userAccount"
        name="userAccount"
        label="账号"
        placeholder="请输入账号（至少4位）"
        :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
        v-model="userPassword"
        type="password"
        name="userPassword"
        label="密码"
        placeholder="请输入密码（至少8位）"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="checkPassword"
        type="password"
        name="checkPassword"
        label="确认密码"
        placeholder="请再次输入密码"
        :rules="[{ required: true, message: '请再次输入密码' }]"
      />
      <van-field
        v-model="planetCode"
        name="planetCode"
        label="星球编号"
        placeholder="请输入星球编号"
        :rules="[{ required: true, message: '请填写星球编号' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import myAxios, {ApiResponse} from "../plugins/myAxios";
import { Toast } from "vant";

const router = useRouter();

const userAccount = ref("");
const userPassword = ref("");
const checkPassword = ref("");
const planetCode = ref("");

const onSubmit = async () => {
  if (userPassword.value !== checkPassword.value) {
    Toast.fail("两次密码输入不一致");
    return;
  }
  const res: ApiResponse<number> = await myAxios.post("/user/register", {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    planetCode: planetCode.value,
  });
  if (res.code === 0 && res.data) {
    Toast.success("注册成功");
    // 跳转到登录页
    router.push("/user/login");
  } else {
    Toast.fail("注册失败: " + (res.message || ""));
  }
};
</script>

<style scoped></style>
