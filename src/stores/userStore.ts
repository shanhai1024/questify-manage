import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const username = ref(localStorage.getItem('username') || '');
  const userAvatar = ref(localStorage.getItem('userAvatar') || '');
  const isLoggedIn = computed(() => !!token.value);
  const email = ref(localStorage.getItem('email') || '');
  const phoneNumber = ref(localStorage.getItem('phoneNumber') || '');

  // Actions
  function setUserInfo(
    newToken: string,
    newUsername: string,
    newUserAvatar: string,
    newEmail: string,
    newPhoneNumber: string
  ) {
    token.value = newToken;
    username.value = newUsername;
    userAvatar.value = newUserAvatar;
    email.value = newEmail;
    phoneNumber.value = newPhoneNumber;

    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('userAvatar', newUserAvatar);
    localStorage.setItem('email', newEmail);
    localStorage.setItem('phoneNumber', newPhoneNumber);
  }

  function clearUserInfo() {
    token.value = null;
    username.value = '';
    userAvatar.value = '';
    email.value = '';
    phoneNumber.value = '';

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');
  }

  function setUserAvatar(newAvatar: string) {
    userAvatar.value = newAvatar;
    localStorage.setItem('userAvatar', newAvatar);
  }

  return {
    token,
    username,
    userAvatar,
    isLoggedIn,
    email,
    phoneNumber,
    setUserInfo,
    clearUserInfo,
    setUserAvatar,
  };
});
