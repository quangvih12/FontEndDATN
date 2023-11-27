<script setup>
import * as Yup from 'yup';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import AppConfig from '@/layout/AppConfig.vue';
import { decodeCredential } from 'vue3-google-login';
import tokenService from '@/service/Authentication/TokenService.js';
import { dangNhapStore } from '../../../service/KhachHang/DangNhapService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { gioHangStore } from '../../../service/KhachHang/Giohang/GiohangCTService.js';

const gioHangService = gioHangStore();
const router = useRouter();
const dnService = dangNhapStore();
const { layoutConfig } = useLayout();
const checked = ref(false);
const toast = useToast();

const gotoTrangChu = () => {
    router.push({ name: 'trang-chu' });
};

const callback = async (response) => {
    const userData = decodeCredential(response.credential);
    const user = await tokenService.checkGoogle(userData.email, userData.name, userData.picture);
    const token = await tokenService.gentoken(user.userName);
    localStorage.setItem('token', token);
    if (localStorage.getItem('cart')) {
        let array = JSON.parse(localStorage.getItem('cart'));
        await gioHangService.addToCartWhenLogin(array, token);
        localStorage.removeItem('cart');
    }

    gotoTrangChu();
};

const schema = Yup.object().shape({
    email: Yup.string().required('Email không được để trống').email('Email không đúng định dạng'),
    password: Yup.string().required('Mật khẩu không được để trống').min(5, 'Mật khẩu phải trên 5 ký tự')
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const dangNhapa = handleSubmit(async () => {
    const login = {
        usernameOrEmail: email.value,
        password: password.value
    };
    const token = await dnService.dangNhap(login);

    if (token == null || token.length <= 0) {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Sai tài khoản hoặc mật khẩu', life: 3000 });
    } else {
        localStorage.setItem('token', token);
        gotoTrangChu();
        // khi dang nhap thanh cong thi add sp gio hang vao db
        if (localStorage.getItem('cart')) {
            let array = JSON.parse(localStorage.getItem('cart'));
            await gioHangService.addToCartWhenLogin(array, token);
            localStorage.removeItem('cart');
        }
    }
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const dangKy = () => {
    router.push({ name: 'dangky' });
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="../../../images/logo.png" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px; margin-bottom: 20px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Xin chào!</div>
                        <span class="text-600 font-medium">Đăng nhập để tiếp tục</span>
                    </div>

                    <div>
                        <div class="field">
                            <div style="height: 90px">
                                <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                                <InputText id="email1" type="text" placeholder="Địa chỉ email" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />
                            </div>
                            <small class="p-error">{{ emailError }}</small>
                        </div>
                        <div style="margin-bottom: 10px">
                            <div style="height: 90px">
                                <label for="password1" class="block text-900 font-medium text-xl mb-2">Mật khẩu</label>
                                <Password id="password1" v-model="password" placeholder="Mật khẩu" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                            </div>
                            <small class="p-error">{{ passwordError }}</small>
                        </div>
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Ghi nhớ đăng nhập</label>
                            </div>

                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Quên mật khẩu?</a>
                        </div>
                        <div class="w-full p-3">
                            <Button label="Đăng ký" class="w-5 p-3 text-xl" severity="secondary" @click="dangKy" style="margin-right: 50px"></Button>
                            <Button label="Đăng nhập" class="w-5 p-3 text-xl" @click="dangNhapa"></Button>
                        </div>

                        <div style="margin-top: 20px">
                            <GoogleLogin :callback="callback" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
