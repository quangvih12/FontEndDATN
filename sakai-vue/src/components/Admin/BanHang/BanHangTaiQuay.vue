<script setup>
import {ref, computed, onBeforeMount, onMounted, defineAsyncComponent, markRaw} from 'vue';
import {formatDateAndTime} from '@/service/common/DateTimeUtils';
import {formatCurrency} from '@/service/common/CurrencyUtils';
import {useBanHangTaiQuayStore} from '@/service/Admin/BanHangTaiQuay/BanHangTaiQuayService';
import {APP_CONSTANT} from '@/constant/AppConstant';
import {useToast} from 'primevue/usetoast';
import {BHTQHoaDonModel} from '@/model/BHTQHoaDonModel';
import {FilterMatchMode} from 'primevue/api';
import EmptyCartLottie from '@/assets/animation/empty-cart.json';
import AnimatedLogo from '@/assets/animation/animated-logo-2.json';
import {LottieAnimation} from 'lottie-web-vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import {useDialog} from "primevue/usedialog";

const store = useBanHangTaiQuayStore();
const BHTQKhachHangComponent = defineAsyncComponent(() => import('@/components/Admin/BanHang/BHTQKhachHangComponent.vue'));
const toast = useToast();
const dialog = useDialog();
const cm = ref();
const sanPhamFilter = ref();
const thanhTien = ref();
const tienKhachDua = ref();
const moTa = ref('');
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
  {label: 'Ghim hoá đơn', icon: 'pi pi-fw pi-star', disabled: true, command: () => console.log(selectedHoaDon.value)},
  {
    label: 'Bỏ ghim hoá đơn',
    icon: 'pi pi-fw pi-star',
    visible: false,
    command: () => console.log(selectedHoaDon.value)
  },
  {label: 'Tách hoá đơn', icon: 'pi pi-fw pi-file-export', command: () => console.log(selectedHoaDon.value)},
  {label: 'Tạo HĐ mới với cùng KH', icon: 'pi pi-fw pi-history', command: () => console.log(selectedHoaDon.value)}
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

const themSPVaoHDCT = async (ctsp) => {
  await store.themSPVaoHDCT(selectedHoaDon.value.id, ctsp.id, 1);
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
  return {tongTienHang, tongChietKhau};
};

const tienKhachDuaInputEvent = (event) => {
  tienKhachDua.value = event.value;
};

const thanhToanHD = async () => {
  const hdModel = new BHTQHoaDonModel(hinhThucGiaoHang.value.id, phuongThucThanhToan.value.id, moTa.value, tienKhachDua.value);
  await store.thanhToanHD(selectedHoaDon.value.id, hdModel);
  toast.add({severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000});
};

const initSanPhamFilter = () => {
  sanPhamFilter.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    'mauSac.ten': {value: null, matchMode: FilterMatchMode.EQUALS},
    // size: {value: null, matchMode: FilterMatchMode.IN},
    // loai: {value: null, matchMode: FilterMatchMode.IN},
    // thuongHieu: {value: null, matchMode: FilterMatchMode.IN}
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

const tableHoaDonRowSelected = (event) => {
  localStorage.setItem("selectedHDId", event.data.id);
  store.loadHDCT(event.data.id);
};

const tableHoaDonRowContextMenu = (event) => {
  cm.value.show(event.originalEvent);
};
</script>

<template>
  <Loading v-model:active="uiBlock"
           :can-cancel="false"
           :is-full-page="true"
           :background-color="bgColor"
           :opacity="1"
           :lock-scroll="true">
    <template #default>
      <LottieAnimation class="w-5 m-auto" :animation-data="AnimatedLogo" :loop="true" :auto-play="true" :speed="1"/>
    </template>
  </Loading>
  <Toast/>
  <div class="card">
    <div class="row">
      <div class="col-8" style="margin-top: 20px">
        <div class="card gap-3">
          <ContextMenu ref="cm" class="w-16rem" :model="tableHoaDonContextMenuModel" @hide="selectedHoaDon = null"/>
          <DataTable
              :value="dsHDCho"
              dataKey="id"
              v-model:selection="selectedHoaDon"
              v-model:contextMenuSelection="selectedHoaDon"
              selectionMode="single"
              @rowSelect="tableHoaDonRowSelected"
              contextMenu
              @rowContextmenu="tableHoaDonRowContextMenu"
              scrollable
              scrollHeight="205px"
              showGridlines>
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Hóa đơn chờ</h5>
                <Button label="Tạo hoá đơn"
                        icon="pi pi-plus"
                        size="small"
                        outlined
                        :loading="loading"
                        @click="taoHDCho"/>
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
                  <i class="pi pi-user-edit hover:text-cyan-600"
                     style="font-size: 1.2rem;" @click="showKhachHangDialog"></i>
                  <DynamicDialog/>
                </div>
              </template>
            </Column>
            <Column class="text-center">
              <template #body="slotProps">
                <Button @click="huyHDCho(slotProps.data)" icon="pi pi-trash" severity="danger" outlined
                        rounded></Button>
              </template>
            </Column>
          </DataTable>
          <!-- <Paginator :rows="5" :totalRecords="120"></Paginator> -->
        </div>
        <div class="card">
          <DataTable :value="dsHDCT" dataKey="id" scrollable scrollHeight="270px" showGridlines>
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Giỏ hàng</h5>
              </div>
            </template>
            <template #empty>
              <div class="flex flex-column justify-content-center align-items-center">
                <LottieAnimation class="w-1" :animation-data="EmptyCartLottie" :loop="true" :auto-play="true"
                                 :speed="0.8"/>
                <h6>Không có dữ liệu.</h6>
              </div>
            </template>
            <Column field="sanPhamChiTiet.ma" header="Mã SP" style="width: 10%"></Column>
            <Column field="sanPhamChiTiet.sanPham.ten" header="Tên sản phẩm" style="width: auto">
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
            <Column
                header="Số lượng"
                class="w-2 text-center"
                :pt="{headerContent: { class: 'justify-content-center' }}">
              <template #body="slotProps">
<!--                todo: set max cho sl ton sp -->
<!--                todo: set su kien @input update sl ve backend -->
                <InputNumber
                    v-model="slotProps.data.soLuong"
                    :min="1"
                    inputId="horizontal-buttons"
                    showButtons
                    buttonLayout="horizontal"
                    inputClass="w-4rem text-center"
                    decrementButtonClass="p-button-danger"
                    incrementButtonClass="p-button-success"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                />
              </template>
            </Column>
            <Column header="Todo: thêm TT">
<!--              todo-->
            </Column>
            <Column style="width: 8%" class="text-center">
              <template #body="slotProps">
                <Button @click="xoaHDCT(slotProps.data)" icon="pi pi-times" severity="danger" outlined rounded></Button>
              </template>
            </Column>
          </DataTable>
          <!-- <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator> -->
        </div>
        <div class="card">
          <DataTable
              :value="dsSP"
              v-model:filters="sanPhamFilter"
              dataKey="id"
              showGridlines
              scrollable
              filterDisplay="menu"
              :globalFilterFields="['sanPham.ten', 'mauSac.ten', 'size.ten', 'sanPham.loai.ten', 'sanPham.thuongHieu.ten']"
              scrollHeight="325px">
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Sản phẩm</h5>
                <span class="p-input-icon-left">
                                    <i class="pi pi-search"/>
                                    <InputText class="w-20rem" v-model="sanPhamFilter['global'].value"
                                               placeholder="Tìm kiếm theo từ khoá..."/>
                                </span>
                <Button size="small" severity="secondary" icon="pi pi-filter-slash" label="Xoá bộ lọc" outlined
                        @click="clearSanPhamFilter"/>
              </div>
            </template>
            <Column field="ma" header="Mã SP"></Column>
            <Column field="sanPham.ten" header="Tên sản phẩm">
              <template #body="slotProps"> Mũ bảo hiểm {{ slotProps.data.sanPham.thuongHieu.ten }}
                {{ slotProps.data.sanPham.ten }}
              </template>
            </Column>
            <!--            <Column field="giaBan" header="Đơn giá"></Column>-->
            <Column header="Màu sắc" filterField="mauSac.ten" :showFilterMatchModes="false"
                    :filterMenuStyle="{ width: '14rem' }">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span>{{ data.mauSac.ten }}</span>
                </div>
              </template>
              <template #filter="{ filterModel }">
                <Dropdown v-model="filterModel.value" :options="dsMauSac" placeholder="Tất cả" class="p-column-filter">
                  <template #option="slotProps">
                    <div class="flex align-items-center gap-2">
                      <span>{{ slotProps.option }}</span>
                    </div>
                  </template>
                </Dropdown>
              </template>
              <template #filterapply="slotProps">
                <Button size="small" icon="pi pi-check" label="Lọc" severity="success" rounded
                        @click="slotProps.filterCallback()"/>
              </template>
              <template #filterclear="slotProps">
                <Button size="small" label="Huỷ" icon="pi pi-times" severity="danger" rounded
                        @click="slotProps.filterCallback()"/>
              </template>
            </Column>
            <Column field="size.ten" header="Size"></Column>
            <Column field="sanPham.loai.ten" header="Loại"></Column>
            <Column field="sanPham.thuongHieu.ten" header="Thương hiệu"></Column>
            <Column field="soLuongTon" header="Số lượng"></Column>
            <Column class="text-center">
              <template #body="slotProps">
                <Button @click="themSPVaoHDCT(slotProps.data)" icon="pi pi-cart-plus" severity="info" outlined
                        rounded></Button>
                <!--                <Button @click="toggle" icon="pi pi-plus" severity="info" outlined rounded></Button>-->
                <!--                <OverlayPanel ref="op">-->
                <!--                  <h5>Nhập số lượng:</h5>-->
                <!--                  <InputNumber></InputNumber>-->
                <!--                  <Button label="OK"></Button>-->
                <!--                </OverlayPanel>-->
              </template>
            </Column>
          </DataTable>
          <!--           <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator>-->
        </div>
      </div>
      <div class="col-4">
        <!-- Nội dung cho col-4 -->
        <!--        <div class="card">-->
        <!--          <h5>Quét mã sản phẩm</h5>-->
        <!--          <Image src="https://cdn-icons-png.flaticon.com/512/2956/2956744.png" alt="Image" width="220"-->
        <!--                 style="text-align: center" preview/>-->
        <!--        </div>-->
        <!--        <div class="card mb-0">-->
        <!--          <h5>Khách hàng</h5>-->
        <!--          <div class="card m-0">-->
        <!--            <div class="flex justify-content-between align-items-center">-->
        <!--              <Button icon="pi pi-search" severity="info" outlined rounded></Button>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="card">
          <h5>Thanh toán</h5>
          <div class="row">
            <div class="col-4">
              <h6>Mã hóa đơn:</h6>
            </div>
            <div class="col-4">
              <h6 v-if="selectedHoaDon">{{ selectedHoaDon.ma }}</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <h6>Tổng tiền hàng:</h6>
            </div>
            <div class="col-4">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongTienHang) }}</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <h6>Tổng chiết khấu:</h6>
            </div>
            <div class="col-4">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongChietKhau) }}</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <h6>Thành tiền:</h6>
            </div>
            <div class="col-4">
              <h6 class="text-orange-500">{{ formatCurrency(thanhTien) }}</h6>
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-4">
              <h6>Tiền khách đưa:</h6>
            </div>
            <div class="col-4">
              <InputNumber v-model="tienKhachDua" inputId="integeronly" @input="tienKhachDuaInputEvent"/>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <h6>Tiền thừa trả khách:</h6>
            </div>
            <div class="col-4">
              <h6 v-if="selectedHoaDon">{{ isNaN(tienKhachDua) ? null : formatCurrency(tienKhachDua - thanhTien) }}</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <Dropdown v-model="phuongThucThanhToan" :options="dsPTTT" optionLabel="ten"
                        placeholder="Phương thức thanh toán" class="w-full md:w-14rem"/>
            </div>
            <div class="col-4">
              <Dropdown v-model="hinhThucGiaoHang" :options="APP_CONSTANT.HINH_THUC_GIAO_HANG" optionLabel="ten"
                        placeholder="Hình thức giao hàng" class="w-full md:w-14rem" style="margin-left: 85px"/>
            </div>
          </div>
          <h6>Ghi chú</h6>
          <Textarea v-model="moTa" rows="4" cols="30"/>
          <div class="row justify-content-end">
            <div class="col-3">
              <Button label="Thanh toán" severity="warning" raised @click="thanhToanHD"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-top: 20px;
  padding: 1rem;
}
</style>
