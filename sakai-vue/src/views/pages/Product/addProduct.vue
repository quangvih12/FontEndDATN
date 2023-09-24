<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import TableMauSac from './DataTableMauSac.vue';
import TableLoai from './DataTableLoai.vue';
import TableThuongHieu from './DataTableThuongHieu.vue';
import TableVatLieu from './DataTableVatLieu.vue';
import TableTrongLuong from './DataTableTrongLuong.vue';
import TableKhuyenMai from './DataTableKhuyenMai.vue';


const newProducts = reactive({
    TenSanPham: '',
    SoLuongTon: '',
    GiaNhap: '',
    GiaBan: '',
    QuaiDeo: '',
    DemLot: '',
    Size: [],
    SoLuongSize: [],
    MauSac: [],
    ImgMauSac: [],
    Loai: '',
    ThuongHieu: '',
    VatLieu: '',
    TrongLuong: '',
    TrangThai: '',
    MoTa: '',
    KhuyenMai: '',
    ImagesProduct: []
});

const errorProduct = reactive({
    TenSanPham: '',
    SoLuongTon: '',
    GiaNhap: '',
    GiaBan: '',
    QuaiDeo: '',
    DemLot: '',
    Size: '',
    SoLuongSize: '',
    MauSac: '',
    ImgMauSac: '',
    Loai: '',
    ThuongHieu: '',
    VatLieu: '',
    TrongLuong: '',
    TrangThai: '',
    MoTa: '',
    KhuyenMai: '',
    ImagesProduct: ''
});
const validate = () => {
    if (newProducts.TenSanPham == '') {
        errorProduct.TenSanPham = 'Vui lòng nhập tên sản phẩm';
    } else{
        errorProduct.TenSanPham = '';
    }
     if (newProducts.SoLuongTon == '') {
          errorProduct.SoLuongTon = 'Vui lòng nhập số lượng';
    } else{
        errorProduct.SoLuongTon = '';
    }
     if (newProducts.SoLuongTon == 0) {
           errorProduct.SoLuongTon = 'Vui lòng nhập số lượng';
    }else{
        errorProduct.SoLuongTon = 0;
    }
     if (newProducts.SoLuongTon < 0) {
           errorProduct.SoLuongTon = 'số lượng không được âm';
    }

   
    console.log(errorProduct);
};

const add = () => {
    newProducts.ImagesProduct = imagesProduct.value;
    newProducts.ImgMauSac = imagesMauSac.value;
    newProducts.Size = selectedItems.value.map(selected => selected.value).join(', ');
    newProducts.SoLuongSize = selectedItems.value.map(selected => selected.inputValue).join(', ');
    // resetForm();
   
    console.log();
    
}

</script>

<template>
     <div>
        <div class="col-12">
                      <div class="card">
                          <h3 style="margin-bottom: 30px">Sản phẩm</h3>
                          <form  class="flex flex-column gap-2">
                              <div class="p-fluid formgrid grid">
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <span class="p-float-label">
                                          <InputText id="username" type="text" v-model="newProducts.TenSanPham"
                                           @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }"
                                             />
                                          <label for="inputnumber">Tên</label>
                                      </span>
                                      <small class="p-error" id="text-error">{{ errorProduct.TenSanPham || '&nbsp;'
                                          }}</small>
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <span class="p-float-label">
                                          <InputNumber id="inputnumber" v-model="newProducts.SoLuongTon"
                                          @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }"
                                          ></InputNumber>
                                          <label for="inputnumber">số lượng tồn</label>
                                      </span>
                                      <small class="p-error" id="text-error">{{ errorProduct.SoLuongTon || '&nbsp;'
                                          }}</small>
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <span class="p-float-label">
                                          <InputNumber id="inputnumber" v-model="newProducts.GiaNhap"></InputNumber>
                                          <label for="inputnumber">Giá Nhập</label>
                                      </span>
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <span class="p-float-label">
                                          <InputNumber id="inputnumber" v-model="newProducts.GiaBan"></InputNumber>
                                          <label for="inputnumber">Giá bán</label>
                                      </span>
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <label for="address">Quai Đeo</label>
                                      <div class="flex flex-wrap gap-3">
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.QuaiDeo" inputId="ingredient1"
                                                  name="pizza" value="Cheese"   @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }"/>
                                              <label for="ingredient1" class="ml-2">Cheese</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.QuaiDeo" inputId="ingredient2"
                                                  name="pizza" value="Mushroom"   @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }"/>
                                              <label for="ingredient2" class="ml-2">Mushroom</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.QuaiDeo" inputId="ingredient3"
                                                  name="pizza" value="Pepper"  @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }"/>
                                              <label for="ingredient3" class="ml-2">Pepper</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.QuaiDeo" inputId="ingredient4"
                                                  name="pizza" value="Onion"  @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }" />
                                              <label for="ingredient4" class="ml-2">Onion</label>
                                          </div>
                                      </div>
                                      <small class="p-error" id="text-error">{{ errorProduct.TenSanPham || '&nbsp;'
                                          }}</small>
                                  </div>


                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <Dropdown id="dropdown" :options="cities" v-model="newProducts.Loai"
                                                  optionLabel="name"></Dropdown>
                                              <label for="dropdown">Loại</label>
                                          </span>
                                          <TableLoai :tableId="'tableLoai'" :rightGhId="'right_ghLoai'"
                                              :tableClass="'tableLoai'" :rightGhClass="'right_ghLoai'" />
                                      </div>
                                  </div>
                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <Dropdown id="dropdown" :options="cities" v-model="newProducts.ThuongHieu"
                                                  optionLabel="name"></Dropdown>
                                              <label for="dropdown">Thương Hiệu</label>
                                          </span>
                                          <TableThuongHieu :tableId="'TableThuongHieu'" :rightGhId="'right_ghThuongHieu'"
                                              :tableClass="'TableThuongHieu'" :rightGhClass="'right_ghThuongHieu'" />
                                      </div>
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <label for="address">Đệm lót</label>
                                      <div class="flex flex-wrap gap-3">
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.DemLot" inputId="ingredient1" name="pizza"
                                                  value="Cheese" />
                                              <label for="ingredient1" class="ml-2">Cheese</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.DemLot" inputId="ingredient2" name="pizza"
                                                  value="Mushroom" />
                                              <label for="ingredient2" class="ml-2">Mushroom</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.DemLot" inputId="ingredient3" name="pizza"
                                                  value="Pepper" />
                                              <label for="ingredient3" class="ml-2">Pepper</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.DemLot" inputId="ingredient4" name="pizza"
                                                  value="Onion" />
                                              <label for="ingredient4" class="ml-2">Onion</label>
                                          </div>
                                      </div>
                                  </div>


                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <MultiSelect v-model="newProducts.MauSac" :options="colors"
                                                  optionLabel="label" :filter="false" :maxSelectedLabels="3"  @blur="validate()"  
                                          :class="{ 'p-invalid': errorProduct.TenSanPham }" >
                                              </MultiSelect>
                                              <label for="multiselect">Màu sắc</label>
                                          </span>
                                          
                                          <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                              :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                                      </div>
                                      <small class="p-error" id="text-error">{{ errorProduct.TenSanPham || '&nbsp;'
                                          }}</small>
                                  </div>
                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <Dropdown id="dropdown" :options="cities" v-model="newProducts.VatLieu"
                                                  optionLabel="name"></Dropdown>
                                              <label for="dropdown">Vật liệu</label>
                                          </span>
                                          <TableVatLieu :tableId="'TableVatLieu'" :rightGhId="'right_ghVatLieu'"
                                              :tableClass="'TableVatLieu'" :rightGhClass="'right_ghVatLieu'" />
                                      </div>
                                  </div>

                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <label for="address">Size</label>
                                      <div class="flex flex-wrap gap-3">
                                          <label v-for="(item, index) in sizes" :key="index">
                                              <input type="checkbox" v-model="item.isChecked" @change="toggleInput(index)"
                                                  style="    transform: scale(1.5);" />
                                              {{ item.label }}
                                          </label>
                                      </div>
                                  </div>

                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <Dropdown id="dropdown" :options="cities" v-model="newProducts.KhuyenMai"
                                                  optionLabel="name"></Dropdown>
                                              <label for="dropdown">Khuyến mại</label>
                                          </span>
                                          <TableKhuyenMai :tableId="'TableKhuyenMai'" :rightGhId="'right_ghKhuyenMai'"
                                              :tableClass="'TableKhuyenMai'" :rightGhClass="'right_ghKhuyenMai'" />
                                      </div>
                                  </div>
                                  <div class="field col-12 md:col-3" style="margin-bottom: 30px">
                                      <div style="display: flex">
                                          <span class="p-float-label" style="width: 239px">
                                              <Dropdown id="dropdown" :options="cities" v-model="newProducts.TrongLuong"
                                                  optionLabel="name"></Dropdown>
                                              <label for="dropdown">Trọng Lượng</label>
                                          </span>
                                          <TableTrongLuong :tableId="'TableTrongLuong'" :rightGhId="'right_ghTrongLuong'"
                                              :tableClass="'TableTrongLuong'" :rightGhClass="'right_ghTrongLuong'" />
                                      </div>
                                  </div>

                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <div v-for="(item, index) in selectedItems" :key="index"
                                          style="display: inline-block;margin-left: 20px;margin-bottom: 15px;">
                                          <label>
                                              Số lượng: {{ item.label }} <input type="number" v-model="item.inputValue"
                                                  style="width: 100px;" />
                                          </label>
                                      </div>
                                  </div>
                                  <div class="field col-12 md:col-6">
                                      <div v-for="(color, index) in newProducts.MauSac" :key="index"
                                          class="mausac-container"
                                          style="display: inline-block;margin-left: 30px; margin-bottom: 15px;">
                                          Màu :
                                          <span class="product-name">{{ color.label }}</span>
                                          <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"
                                              @input="onFileInputImageMauSac" />
                                      </div>
                                  </div>



                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <label for="address">Trạng thái</label>
                                      <div class="flex flex-wrap gap-3">
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.TrangThai" inputId="ingredient1"
                                                  name="pizza" value="Cheese" />
                                              <label for="ingredient1" class="ml-2">Cheese</label>
                                          </div>
                                          <div class="flex align-items-center">
                                              <RadioButton v-model="newProducts.TrangThai" inputId="ingredient2"
                                                  name="pizza" value="Mushroom" />
                                              <label for="ingredient2" class="ml-2">Mushroom</label>
                                          </div>

                                      </div>
                                  </div>

                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <label for="address">Mô tả</label>
                                      <Textarea id="address" rows="4" v-model="newProducts.MoTa" />
                                  </div>
                                  <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                                      <div style="display: flex">

                                      </div>
                                  </div>
                                  <div class="field col-12 md:col-6">
                                      <!-- <FileUpload name="demo[]" :multiple="true" accept="image/*" :maxFileSize="2000000"
                                          customUpload v-model="imagesProduct" /> -->

                                      <file-upload v-model="imagesProduct" :upload-url="uploadUrl" :multiple="true"
                                          :maxFileSize="2000000" @input="onFileInputImageProduct"></file-upload>

                                      <!-- <div v-for="(image, index) in imagesProduct" :key="index">
                                          <img :src="image" alt="Uploaded Image" />
                                        
                                      </div> -->
                                  </div>
                              </div>
                              <Button label="Lưu" @click="validate" icon="pi pi-check" class="p-button-outlined"
                                  style="width: 200px; height: auto;margin: auto;" />
                          </form>
                      </div>
                  </div>
     </div>
   
</template>