<script setup>
import {ref} from "vue";
import {usePasswordStore} from "@/service/KhachHang/PasswordService";
import {useToast} from "primevue/usetoast";

const store = usePasswordStore();
const toast = useToast();
const email = ref();

const submit = async () => {
  try {
    await store.handleForgotPassword(email.value);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
  }
}
</script>

<template>
  <Toast/>
  <div class="h-screen flex justify-content-center align-items-center">
    <div class="surface-card p-4 shadow-2 border-round w-3">
      <div class="text-center mb-5">
        <img src="/src/assets/images/logo.png" alt="Image" height="80"/>
        <div class="text-900 text-3xl font-medium mb-3">Quên mật khẩu</div>
        <span class="text-600 font-medium line-height-3">Chưa có tài khoản?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          <router-link :to="{name: 'dang-ky'}">Tạo ngay!</router-link>
        </a>
      </div>
      <div>
        <label for="email" class="block text-900 font-medium mb-2">Email</label>
        <InputText v-model="email" id="email" type="text" placeholder="Nhập email của bạn" class="w-full mb-3"/>

        <div class="flex align-items-center justify-content-between mb-4">
          <router-link class="font-medium ml-2 text-right" :to="{name: 'trang-chu'}">Đi đến trang chủ</router-link>
          <router-link class="font-medium ml-2 text-right" :to="{name: 'login'}">Quay lại đăng nhập</router-link>
        </div>

        <Button @click="submit" label="Xác nhận" icon="pi pi-user" class="w-full"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>