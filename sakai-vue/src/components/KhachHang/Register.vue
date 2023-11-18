<template>

<section class="container">
  <header>Registration Form</header>
  <form class="form" action="#" @submit="onSubmit">
      <div class="input-box">
          <label>Họ và Tên</label>
          <input  placeholder="Nhập họ và tên" type="text" v-model = "ten" :class="{ 'p-invalid': tenError }" required="true" autofocus>
          <small class="p-error">{{ tenError }}</small>
      </div>

      <div class="input-box">
          <label>Email</label>
          <input required="true" placeholder="Nhập email" type="email"  v-model = "email" autofocus :class="{ 'p-invalid': emailError }">
          <small class="p-error">{{ emailError }}</small>
      </div>
      <div class="column">
          <div class="input-box">
            <label>Số Điện thoại</label>
            <input required="true" placeholder="Nhập số điện thoại" type="text" v-model="sdt"  autofocus :class="{ 'p-invalid': sdtError }" >
            <small class="p-error">{{ sdtError }}</small>
          </div>
          <div class="input-box">
            <label>Ngày sinh</label>
            <input required="" placeholder="Enter birth date" type="date" v-model="ngaySinh" :class="{ 'p-invalid': ngaySinhError }">
            <small class="p-error">{{ ngaySinhError }}</small>
          </div>
      </div>
      <div class="gender-box">
        <label>Giới tính</label>
        <div class="gender-option">
          <div class="gender">
            <input checked="" name="gender" id="check-male" type="radio"  value="1" v-model="gioiTinh" >
            <label for="check-male">Nam</label>
          </div>
          <div class="gender">
            <input name="gender" id="check-female" type="radio"  value="0" v-model="gioiTinh">
            <label for="check-female">Nữ</label>
          </div>
        
        </div>
      </div>

      <div class="column">
          <div class="input-box">
            <label>Mật khẩu</label>
            <input required="" placeholder="Nhập mật khẩu" type="text" v-model="matKhau"  autofocus :class="{ 'p-invalid': passError }" >
            <small class="p-error">{{ passError }}</small>
          </div>
          <div class="input-box">
            <label>Nhập lại mật khẩu</label>
           
            <input required="" placeholder="Nhập lại mật khẩu" type="text" v-model="xacNhanMK"  autofocus :class="{ 'p-invalid': xacNhanMKError }">
            <small class="p-error">{{ xacNhanMKError }}</small>
        </div>
      </div>
     
      <button type="submit">Register</button>
  </form>
</section>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { userRegisterStore} from '@/service/KhachHang/RegisterService.js';
import { useForm, useField } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { userStore } from '@/service/Admin/User/UserService.js';
import khUserService from '@/service/KhachHang/UserService.js';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
const userService = userStore();
const router = useRouter();
const registerService =  userRegisterStore();
const schema = yup.object().shape({
    ten: yup
        .string()
        .required('Tên không được để trống')
        .min(4, 'Tên  phải có ít nhất 4 ký tự')
        .matches(/^[a-zA-Z0-9đĐáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬêÊếẾềỀểỂễỄệỆôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢùÙúÚụỤủỦũŨưỨỨửỬữỮựỰýÝỳỲỷỶỹỸỵỴ\s]*$/, 'Tên không được chứa kí tự đặc biệt!'),
    sdt: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(/^[0-9]{10}$/, 'Số điện thoại phải chứa đúng 10 số')
        .typeError('Số điện thoại phải là một số')
        .nullable(),
    matKhau: yup.string().required('Password không được để trống'),
    ngaySinh: yup.date().required(' vui lòng chọn ngày sinh '),
    email: yup
        .string()
        .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Email không hợp lệ')
        .required(' Email không được để trống'),
    xacNhanMK: yup.string()
    .oneOf([yup.ref('matKhau'), null], 'Mật khẩu nhập lại phải trùng khớp với mật khẩu')
    .required('Nhập lại mật khẩu không được để trống')
   
});
const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
});
const { value: ten, errorMessage: tenError } = useField('ten');
const { value: matKhau, errorMessage: passError } = useField('matKhau');
const { value: email, errorMessage: emailError } = useField('email');
const { value: sdt, errorMessage: sdtError } = useField('sdt');
const { value: ngaySinh, errorMessage: ngaySinhError } = useField('ngaySinh');
const { value: xacNhanMK, errorMessage: xacNhanMKError } = useField('xacNhanMK');
const gioiTinh = ref(2);
const toast = useToast();
const otp = ref(null);

const onSubmit = handleSubmit(async () => {

    const form = {
        ten: ten.value,
        email: email.value,
        sdt: sdt.value,
        matKhau: matKhau.value,
        ngaySinh: ngaySinh.value,
        gioiTinh: parseInt(gioiTinh.value)
    }
     const KhachHang = khUserService.getUserByEmail(email.value)
    if(KhachHang != null){
      toast.add({ severity: 'warn', summary: '', detail: 'Email đã tồn tại. Vui lòng nhập email khác', life: 5000 });
     return;
    }

    const formString = JSON.stringify(form);

    const randomOTP = Math.floor(1000 + Math.random() * 9000);
    otp.value = randomOTP.toString();

    localStorage.setItem("dangky", formString);
    localStorage.setItem("otp",otp.value);

    const mailData = {
        ten: ten.value ,
        email: email.value,
        title: otp.value
    }

    await userService.sendOTP(mailData);

    router.push('/otp');


})

</script>

<style scoped>


.container {

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
  width: 100%;
  height: 500px;
  background: #FCEDDA;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}



.container header {
  font-size: 1.2rem;
  color: #000;
  font-weight: 600;
  text-align: center;
}

.container .form {
  margin-top: 15px;
}

.form .input-box {
  width: 100%;
  margin-top: 10px;
}

.input-box label {
  color: #000;
}

.form :where(.input-box input, .select-box) {
  position: relative;
  height: 35px;
  width: 100%;
  outline: none;
  font-size: 1rem;
  color: #808080;
  margin-top: 5px;
  border: 1px solid #EE4E34;
  border-radius: 6px;
  padding: 0 15px;
  background: #FCEDDA;
}

.column {
  display: flex;
  gap: 20px;
}



.button {
  margin-top: 20px;
}

.input-box input:focus {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.form .column {
  display: flex;
  column-gap: 15px;
}

.form .gender-box {
  margin-top: 10px;
}

.form :where(.gender-option, .gender) {
  display: flex;
  align-items: center;
  column-gap: 50px;
  flex-wrap: wrap;
}

.form .gender {
  column-gap: 5px;
}

.gender input {
  accent-color: #EE4E34;
}

.form :where(.gender input, .gender label) {
  cursor: pointer;
}

.gender label {
  color: #000;
}

.address :where(input, .select-box) {
  margin-top: 10px;
}

.select-box select {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  color: #808080;
  font-size: 1rem;
  background: #FCEDDA;
}

.form button {
  height: 40px;
  width: 100%;
  color: #000;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #EE4E34;
}

.form button:hover {
  background: #EE3E34;
}
</style>