<script setup>
import { ref, computed, onBeforeMount, onMounted, defineAsyncComponent, markRaw } from 'vue';
import { formatDateAndTime } from '@/service/common/DateTimeUtils';
import { formatCurrency } from '@/service/common/CurrencyUtils';
import { useBanHangTaiQuayStore } from '@/service/Admin/BanHangTaiQuay/BanHangTaiQuayService';
import { APP_CONSTANT } from '@/constant/AppConstant';
import { useToast } from 'primevue/usetoast';
import { BHTQHoaDonModel } from '@/model/BHTQHoaDonModel';
import { FilterMatchMode } from 'primevue/api';
import EmptyCartLottie from '@/assets/animation/empty-cart.json';
import AnimatedLogo from '@/assets/animation/animated-logo-2.json';
import { LottieAnimation } from 'lottie-web-vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useDialog } from "primevue/usedialog";
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';

const store = useBanHangTaiQuayStore();
const BHTQKhachHangComponent = defineAsyncComponent(() => import('@/components/Admin/BanHang/BHTQKhachHangComponent.vue'));
const toast = useToast();
const dialog = useDialog();
const cm = ref();
const sanPhamFilter = ref();
const thanhTien = ref();
// const tienKhachDua = ref();
const loading = ref(false);
const uiBlock = ref(true);
const selectedHoaDon = ref();
const hinhThucGiaoHang = ref();
const phuongThucThanhToan = ref();
const dsHDCho = computed(() => store.dsHDCho);
const dsHDCT = computed(() => store.dsHDCT);
const dsSP = computed(() => store.dsSP);
const dsPTTT = computed(() => store.dsPTTT);
const tableHoaDonContextMenuModel = ref([
  { label: 'Ghim hoá đơn', icon: 'pi pi-fw pi-star', disabled: true, command: () => console.log(selectedHoaDon.value) },
  {
    label: 'Bỏ ghim hoá đơn',
    icon: 'pi pi-fw pi-star',
    visible: false,
    command: () => console.log(selectedHoaDon.value)
  },
  { label: 'Tách hoá đơn', icon: 'pi pi-fw pi-file-export', command: () => console.log(selectedHoaDon.value) },
  { label: 'Tạo HĐ mới với cùng KH', icon: 'pi pi-fw pi-history', command: () => console.log(selectedHoaDon.value) }
]);
const dsMauSac = ref([]);
const bgColor = ref('#ffa854');

onBeforeMount(() => {
  store.loadHDCho();
  store.loadSP();
  store.loadPTTT();
});

onMounted(() => {
  setTimeout(() => {
    uiBlock.value = !uiBlock.value;
  }, 3000);
});

const taoHDCho = async () => {
  loading.value = !loading.value;
  await store.taoHDCho(localStorage.getItem("currentUserID"));
  loading.value = !loading.value;
  selectedHoaDon.value = dsHDCho.value[0];
};

const huyHDCho = async (hd) => {
  await store.huyHDCho(hd.id);
};

const soLuongError = ref('');
const themSPVaoHDCT = async (soLuong) => {
  if (soLuong == null || soLuong == '') {
    soLuongError.value = 'số lượng không được để trống';
    return;
  }
  if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
    soLuongError.value = '';
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Hãy chọn hóa đơn trước khi thêm sản phẩm', life: 3000 });
    return;
  }
  soLuongError.value = '';
  await store.themSPVaoHDCT(selectedHoaDon.value.id, dataOverlay.value.id, soLuong);
};

const xoaHDCT = async (hdct) => {
  await store.xoaHDCT(hdct.id);
};

const tinhTien = (arr) => {
  let tongTienHang = 0;
  let tongChietKhau = 0;
  for (const item of arr) {
    tongTienHang += item.donGia * item.soLuong;
    tongChietKhau += item.chietKhau * item.soLuong;
  }
  thanhTien.value = tongTienHang - tongChietKhau;
  return { tongTienHang, tongChietKhau };
};

const tienKhachDuaInputEvent = (event) => {
  tienKhachDua.value = event.value;
};



const initSanPhamFilter = () => {
  sanPhamFilter.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'mauSac.ten': { value: null, matchMode: FilterMatchMode.EQUALS },
    'size.ten': {value: null, matchMode: FilterMatchMode.EQUALS},
    'sanPham.loai.ten': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'sanPham.thuongHieu.ten': {value: null, matchMode: FilterMatchMode.CONTAINS}
  };
};
initSanPhamFilter();

const clearSanPhamFilter = () => {
  console.log(dsSP.value);
  dsMauSac.value = dsSP.value.map((sp) => sp.mauSac.ten);
  const unique = new Set(dsMauSac.value);
  dsMauSac.value = [...unique];
  console.log(dsMauSac.value);
};

const showKhachHangDialog = () => {
  const dialogRef = dialog.open(BHTQKhachHangComponent, {
    props: {
      header: 'Khách hàng',
      style: {
        width: '36vw',
      },
      modal: true,
      closeOnEscape: false,
      closable: true
    }
  });
}

const dataOverlay = ref();
const tableHoaDonRowSelected = (event) => {
  localStorage.setItem("selectedHDId", event.data.id);
  store.loadHDCT(event.data.id);
};

const tableHoaDonRowContextMenu = (event) => {
  cm.value.show(event.originalEvent);
};

const op = ref();
const toggle = (toggle) => {
  dataOverlay.value = toggle;
  op.value.toggle(event);

};


const schema = yup.object().shape({

  tienKhachDua: yup.number().required('Tiền khách đưa không được để trống')
    .typeError('Số lượng tồn phải là một số'),
  hinhThucGiaoHangs: yup.number().required('Hình thức giao hàng không được để trống'),
  PhuongThucThanhToan: yup.number().required('Phương thức thanh toán không được để trống')


});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema
});

const { value: tienKhachDua, errorMessage: tienKhachDuaError } = useField('tienKhachDua');
const { value: hinhThucGiaoHangs, errorMessage: hinhThucThanhToanError } = useField('hinhThucGiaoHangs');
const { value: PhuongThucThanhToan, errorMessage: PhuongThucThanhToanToanError } = useField('PhuongThucThanhToan');
const { value: moTa, errorMessage: moTaError } = useField('moTa');

const onSubmit = handleSubmit(async (values) => {
  if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
    soLuongError.value = '';
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Hãy chọn hóa đơn trước khi thêm sản phẩm', life: 3000 });
    return;
  }
  const hdModel = new BHTQHoaDonModel(values.hinhThucGiaoHangs, values.PhuongThucThanhToan, values.moTa, PhuongThucThanhToan.tienKhachDua);
  await store.thanhToanHD(selectedHoaDon.value.id, hdModel);
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Thanh toán thành công', life: 3000 });
  resetForm();
});



const onHinhThucGiaoHangChange = () => {
  if (hinhThucGiaoHang.value) {
    hinhThucGiaoHangs.value = hinhThucGiaoHang.value.id;

  } else {
    hinhThucGiaoHangs.value = null;
  }
};

const onPhuongThucThanhToanChange = () => {
  if (phuongThucThanhToan.value) {
    PhuongThucThanhToan.value = phuongThucThanhToan.value.id;
  } else {
    PhuongThucThanhToan.value = null;
  }
};

const op1 = ref();
const toggle1 = (event) => {
  op1.value.toggle(event);
};

const onProductSelect = (event) => {
  op.value.hide();
  toast.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
}
const addDialog = ref(false);
const onDialog = () => {
  addDialog.value = true;
}
</script>

<template>
  <Loading v-model:active="uiBlock" :can-cancel="false" :is-full-page="true" :background-color="bgColor" :opacity="1"
    :lock-scroll="true">
    <template #default>
      <LottieAnimation class="w-5 m-auto" :animation-data="AnimatedLogo" :loop="true" :auto-play="true" :speed="1" />
    </template>
  </Loading>
  <Toast />
  <div class="card">
    <div class="row">
      <div class="col-9" style="margin-top: -20px">
        <div class="card gap-3">
          <ContextMenu ref="cm" class="w-16rem" :model="tableHoaDonContextMenuModel" @hide="selectedHoaDon = null" />
          <DataTable :value="dsHDCho" dataKey="id" v-model:selection="selectedHoaDon"
            v-model:contextMenuSelection="selectedHoaDon" selectionMode="single" @rowSelect="tableHoaDonRowSelected"
            contextMenu @rowContextmenu="tableHoaDonRowContextMenu" scrollable scrollHeight="205px" showGridlines>
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Hóa đơn chờ</h5>
                <Button label="Tạo hoá đơn" icon="pi pi-plus" size="small" outlined :loading="loading"
                  @click="taoHDCho" />
              </div>
            </template>
            <template #empty>
              <div class="flex flex-column justify-content-center align-items-center">
                <h6>Không có dữ liệu.</h6>
              </div>
            </template>
            <Column field="ma" header="Mã HĐ"></Column>
            <Column header="Thời gian tạo">
              <template #body="slotProps">
                {{ formatDateAndTime(slotProps.data.ngayTao) }}
              </template>
            </Column>
            <Column field="nguoiTao.ten" header="Nhân viên"></Column>
            <Column header="Khách hàng">
              <template #body="slotProps">
                <div class="flex justify-content-between align-items-center">
                  <span :class="[slotProps.data.user.ten === 'Khách hàng lẻ' ? 'text-red-500 font-semibold' : null]">
                    {{ slotProps.data.user.ten }}
                  </span>
                  <i class="pi pi-user-edit hover:text-cyan-600" style="font-size: 1.2rem;"
                    @click="showKhachHangDialog"></i>
                  <DynamicDialog />
                </div>
              </template>
            </Column>
            <Column class="text-center">
              <template #body="slotProps">
                <Button @click="huyHDCho(slotProps.data)" icon="pi pi-trash" severity="danger" outlined rounded></Button>
              </template>
            </Column>
          </DataTable>
          <!-- <Paginator :rows="5" :totalRecords="120"></Paginator> -->
        </div>

      </div>
      <div class="col-3" style="margin-top: -20px; ">
        <div class="card">
          <h5>Quét mã sản phẩm</h5>
          <Image src="https://cdn-icons-png.flaticon.com/512/2956/2956744.png" alt="Image" width="170"
            style="text-align: center" preview />
        </div>
        <!-- <div class="card mb-0">
          <h5>Khách hàng</h5>
          <div class="card m-0">
            <div class="flex justify-content-between align-items-center">
              <Button icon="pi pi-search" severity="info" outlined rounded></Button>
            </div>
          </div>
        </div> -->
      </div>

      <div class="Field col-12 md:col-9" style="margin-top: -15px;">
        <div class="card" style="width: 100%">
          <DataTable :value="dsHDCT" dataKey="id" scrollable scrollHeight="270px" showGridlines>
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Giỏ hàng</h5>
                <Button type="button" icon="pi pi-search" @click="toggle1" aria-haspopup="true"
                  aria-controls="overlay_panel" />
              </div>

            </template>
            <template #empty>
              <div class="flex flex-column justify-content-center align-items-center">
                <LottieAnimation class="w-1" :animation-data="EmptyCartLottie" :loop="true" :auto-play="true"
                  :speed="0.8" />
                <h6>Không có dữ liệu.</h6>
              </div>
            </template>
            <Column field="sanPhamChiTiet.ma" header="Mã SP" style="width: 10%"></Column>
            <Column field="sanPhamChiTiet.sanPham.ten" header="Tên sản phẩm" style="width: 200%">
              <template #body="slotProps"> Mũ bảo hiểm {{ slotProps.data.sanPhamChiTiet.sanPham.ten }} -
                {{ slotProps.data.sanPhamChiTiet.mauSac.ten }} - size {{ slotProps.data.sanPhamChiTiet.size.ten }}
              </template>
            </Column>
            <Column header="Đơn giá" style="width: 12%" header-class="text-center">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.donGia) }}
              </template>
            </Column>
            <Column header="Chiết khấu" style="width: 10%">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.chietKhau) }}
              </template>
            </Column>
            <Column header="Số lượng" class="w-2 text-center"
              :pt="{ headerContent: { class: 'justify-content-center' } }">
              <template #body="slotProps">
                <!--                todo: set max cho sl ton sp -->
                <!--                todo: set su kien @input update sl ve backend -->
                <InputNumber v-model="slotProps.data.soLuong" :min="1" inputId="horizontal-buttons" showButtons
                  buttonLayout="horizontal" inputClass="w-4rem text-center" decrementButtonClass="p-button-danger"
                  incrementButtonClass="p-button-success" incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus" />
              </template>
            </Column>
            <Column header="Thành tiền">
              <template #body="slotProps">
                {{ formatCurrency(parseInt(slotProps.data.donGia) * parseInt(slotProps.data.soLuong)) }} </template>
              <!--              todo-->
            </Column>
            <Column style="width: 8%" class="text-center">
              <template #body="slotProps">
                <Button @click="xoaHDCT(slotProps.data)" icon="pi pi-times" severity="danger" outlined rounded></Button>
              </template>
            </Column>
          </DataTable>
          <!-- <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator> -->

          <OverlayPanel ref="op1" appendTo="body" showCloseIcon>
            <DataTable :value="dsSP" v-model:filters="sanPhamFilter" dataKey="id" showGridlines scrollable
              filterDisplay="menu"
              :globalFilterFields="['sanPham.ten', 'mauSac.ten', 'size.ten', 'sanPham.loai.ten', 'sanPham.thuongHieu.ten']"
              scrollHeight="325px">
              <template #header>
                <div class="flex justify-content-between align-items-center">
                  <h5 class="m-0">Sản phẩm</h5>
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText class="w-20rem" v-model="sanPhamFilter['global'].value"
                      placeholder="Tìm kiếm theo từ khoá..." />
                  </span>
                  <Button size="small" severity="secondary" icon="pi pi-filter-slash" label="Xoá bộ lọc" outlined
                    @click="clearSanPhamFilter" />
                </div>
              </template>
              <Column field="ma" header="Mã SP"></Column>
              <Column field="sanPham.ten" header="Tên sản phẩm">
                <template #body="slotProps"> Mũ bảo hiểm {{ slotProps.data.sanPham.thuongHieu.ten }}
                  {{ slotProps.data.sanPham.ten }}
                </template>
              </Column>

              <Column header="Màu sắc" filterField="mauSac.ten" :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <span>{{ data.mauSac.ten }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                
                </template>
                <template #filterapply="slotProps">
                </template>
                <template #filterclear="slotProps">
                </template>
              </Column>
              <Column header="Size" filterField="size.ten" :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <span>{{ data.size.ten }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                
                </template>
                <template #filterapply="slotProps">
                </template>
                <template #filterclear="slotProps">
                </template>
              </Column>
             
              <Column filterField="sanPham.loai.ten" header="Loại" :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <span>{{ data.sanPham.loai.ten }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                
                </template>
                <template #filterapply="slotProps">
                </template>
                <template #filterclear="slotProps">
                </template>
              </Column>
              <Column filterField="sanPham.thuongHieu.ten" header="Thương hiệu" :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <span>{{ data.sanPham.thuongHieu.ten }}</span>
                  </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                
                </template>
                <template #filterapply="slotProps">
                </template>
                <template #filterclear="slotProps">
                </template>
              </Column>
              <Column field="soLuongTon" header="Số lượng"></Column>
              <Column class="text-center">
                <template #body="slotProps">
                  <Button @click="toggle(slotProps.data)" icon="pi pi-plus" severity="info" outlined rounded></Button>
                  <OverlayPanel ref="op">


                    <div style="display: flex;">
                      <div style="margin-top: 20px; margin-right: 10px;">
                        <span class="p-float-label">
                          <InputNumber id="number-input" v-model="soluong" :class="{ 'p-invalid': soLuongError }" :min="1"
                            :max="dataOverlay.soLuongTon"></InputNumber>
                          <label for="Field">Số lượng</label>
                        </span>
                        <small class="p-error">{{ soLuongError }}</small>
                      </div>
                      <div style="margin-top: 20px;">
                        <Button label="Thêm" @click="themSPVaoHDCT(soluong)"></Button>
                      </div>

                    </div>

                  </OverlayPanel>
                </template>
              </Column>

            </DataTable>
          </OverlayPanel>
        </div>
      </div>
      <div class="col-3">
        <div class="card" style="height: 250px; margin-top: 0px; width: 240px; margin-left: -10px;">
          <h3>Thanh toán</h3>
          <div style="display: flex; margin-bottom: 0px;">
            <div>
              <h6>Mã hóa đơn: </h6>
            </div>
            <div style="margin-left: 40px;">
              <h6 v-if="selectedHoaDon">{{ selectedHoaDon.ma }}</h6>
            </div>

          </div>
          <div class="flex" style=" margin-bottom: 0px;">
            <div>
              <h6>Tổng tiền hàng: </h6>
            </div>
            <div style="margin-left: 20px;">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongTienHang) }}</h6>
            </div>

          </div>
          <div class="flex" style=" margin-bottom: 0px;">
            <div>
              <h6>Tổng chiết khấu:</h6>
            </div>
            <div style="margin-left: 15px;">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongChietKhau) }}</h6>
            </div>

          </div>
          <div class="flex">
            <div>
              <h6>Thành tiền:</h6>
            </div>
            <div style="margin-left: 50px;">
              <h6 class="text-orange-500">{{ formatCurrency(thanhTien) }}</h6>
            </div>

          </div>
          <Button label="Thanh toán" severity="warning" raised @click="onDialog" />

        </div>
      </div>
    </div>
  </div>


  <Dialog v-model:visible="addDialog" :style="{ width: '500px' }" header="Thanh toán" :modal="true">
    <form @submit="onSubmit">
      <div class="flex align-items-center" style="margin-top: 20px;">
        <div>
          <h6>Tiền khách đưa:</h6>
        </div>

        <div style="margin-left: 60px;">
          <InputNumber v-model="tienKhachDua" inputId="integeronly" @input="tienKhachDuaInputEvent"
            :class="{ 'p-invalid': tienKhachDuaError }" :min="thanhTien" />
          <br />
          <small class="p-error">{{ tienKhachDuaError }}</small>
        </div>


      </div>
      <div class="row" style="margin-top: 10px;">
        <div class="col-4">
          <h6>Tiền thừa trả khách:</h6>
        </div>
        <div class="col-4">
          <h6 v-if="selectedHoaDon">{{ isNaN(tienKhachDua) ? null : formatCurrency(tienKhachDua - thanhTien) }}</h6>
        </div>
      </div>

      <div class="flex">
        <div>

          <Dropdown v-model="phuongThucThanhToan" :options="dsPTTT" optionLabel="ten" placeholder="Phương thức thanh toán"
            class="w-full md:w-14rem" @change="onPhuongThucThanhToanChange"
            :class="{ 'p-invalid': PhuongThucThanhToanToanError }" />
          <div style=" width: 200px; "> <small class="p-error">{{ PhuongThucThanhToanToanError }}</small>
          </div>
        </div>
        <div style="margin-left: -40px;">
          <Dropdown v-model="hinhThucGiaoHang" :options="APP_CONSTANT.HINH_THUC_GIAO_HANG" optionLabel="ten"
            placeholder="Hình thức giao hàng" class="w-full md:w-14rem" style="margin-left: 85px"
            @change="onHinhThucGiaoHangChange" :class="{ 'p-invalid': hinhThucThanhToanError }" />
          <div style="margin-left: 90px; width: 200px; height: 0px; "><small class=" p-error">{{ hinhThucThanhToanError
          }}</small></div>
        </div>

      </div>
      <h6>Ghi chú</h6>
      <Textarea v-model="moTa" rows="4" cols="63" />
      <Button label="Thanh toán" severity="warning" raised type="submit" style="margin-top: 20px; margin-left: 150px;" />


    </form>
  </Dialog>
</template>

<style scoped>
.card {
  margin-top: 20px;
  padding: 1rem;
}</style>
