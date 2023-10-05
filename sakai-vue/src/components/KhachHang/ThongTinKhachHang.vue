<script setup>
</script>

<template>
    <br />
    <br />
    <br />
    <br />
    <div class="container">
        <div class="card">
            <h1 style="color: #e8db72">Hồ sơ của tôi</h1>
            <label for="">Quản lý thông tin hồ sơ để bảo mật tài khoản</label>
            <Divider />
            <div class="ctn" style="margin-left: 150px">
                <div class="flex">
                    <div class="p-col-6">
                        <div class="item">
                            <label>Tên đăng nhập: </label>
                            <span>vunlph28399</span>
                        </div>
                        <div class="item">
                            <div class="flex">
                                <label>Tên: </label>
                                <input type="text" v-model="value" placeholder="Nguyễn Long Vũ" />
                            </div>
                        </div>
                        <div class="item">
                            <label>Email: </label>
                            <a href="#">Thêm</a>
                        </div>
                        <div class="item">
                            <label>Số điện thoại: </label>
                            <label>********88 <a href="#"> Thay đổi</a></label>
                        </div>
                        <div class="item">
                            <label>Giới tính: </label>
                            <input type="radio" v-model="gender" value="nam" style="margin-left: 20px" />
                            Nam
                            <input type="radio" v-model="gender" value="nu" style="margin-left: 20px" />
                            Nữ
                            <input type="radio" v-model="gender" value="khac" style="margin-left: 20px" />
                            Khác
                        </div>
                        <div class="item">
                            <label>Ngày sinh: </label>
                            <input type="date" v-model="value" />
                        </div>
                        <div class="item" style="margin-left: 400px">
                            <Button label="Save" icon="pi pi-check" size="small" />
                        </div>
                    </div>
                    <div class="p-col-6">
                        <div class="col-12">
                            <Avatar icon="pi pi-user" class="mr-2" size="xlarge" shape="circle" style="margin-left: 200px" />
                            <br />
                            <br />
                            <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" @upload="onUpload" style="margin-left: 180px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ctn {
    display: flex;
    flex-direction: column; /* Xếp theo cột */
    align-items: flex-start; /* Căn các phần tử theo trục dọc (cột) */
}
.item {
    display: flex;
    align-items: center; /* Căn các phần tử label và span theo trục ngang */
    margin-bottom: 20px; /* Khoảng cách giữa các item */
}

.item label {
    width: 150px; /* Độ rộng cố định của label để tạo ra một cột cố định */
    text-align: left; /* Căn phải nếu bạn muốn label nằm ở bên phải */
    margin-right: 30px;
}
</style>