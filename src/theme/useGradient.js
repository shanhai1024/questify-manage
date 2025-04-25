import { ref, watchEffect } from 'vue';
import { lightGradients, darkGradients } from './gradients';

// 响应式的暗黑模式监听
const isDark = ref(document.documentElement.classList.contains('dark'));

// 动态监听 html 类变化（推荐）
const updateDarkMode = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

// 使用 MutationObserver 监听 html.class 变化
const observer = new MutationObserver(updateDarkMode);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});

export const useGradient = () => {
  const getGradient = (index) => {
    const source = isDark.value ? darkGradients : lightGradients;
    return source[index % source.length];
  };

  return {
    getGradient,
    isDark,
  };
};
