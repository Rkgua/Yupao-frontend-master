<template>
  <div class="tag-editor" :aria-label="'tag-editor'">
    <span class="tag" v-for="(t, idx) in modelValue" :key="idx">
      {{ t }} <button class="del" @click="remove(idx)">×</button>
    </span>
    <input v-model="input" @keyup.enter="add" placeholder="添加标签，按回车保存" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits<{ 'update:modelValue': (v: string[]) => void }>();
const input = ref('');

function add() {
  const v = input.value.trim();
  if (!v) return;
  if (!props.modelValue.includes(v)) {
    emit('update:modelValue', [...props.modelValue, v]);
  }
  input.value = '';
}

function remove(i: number) {
  const arr = [...props.modelValue];
  arr.splice(i, 1);
  emit('update:modelValue', arr);
}
</script>

<style scoped>
.tag-editor { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 6px 0; }
.tag { background: #f5f7fa; border: 1px solid #eaecef; border-radius: 16px; padding: 4px 10px; display: inline-flex; align-items: center; }
.tag .del { border: none; background: transparent; margin-left: 6px; cursor: pointer; }
.tag-editor input { border: none; outline: none; min-width: 120px; }
</style>