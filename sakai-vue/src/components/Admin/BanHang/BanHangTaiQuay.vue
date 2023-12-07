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
import * as yup from 'yup';
import {useForm, useField} from 'vee-validate';
import {QrcodeStream} from 'vue3-qrcode-reader';
import {userStore} from '../../../service/Admin/User/UserService';
import ThemDiaChi from '../../Admin/DiaChi/ThemDiaChi.vue';
import {phiShipStore} from '../../../service/KhachHang/PhiGiaoHangService';
import html2pdf from "html2pdf.js";

const phiGiaoHangService = phiShipStore();
const userService = userStore();
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
const dsMauSac = computed(() => {
  const arr = dsSP.value.map((sp) => sp.mauSac.ten);
  return arr.filter((item, index) => arr.indexOf(item) === index);
});
const dsSize = computed(() => {
  const arr = dsSP.value.map((sp) => sp.size.ten);
  return arr.filter((item, index) => arr.indexOf(item) === index);
});
const dsLoai = computed(() => {
  const arr = dsSP.value.map((sp) => sp.sanPham.loai.ten);
  return arr.filter((item, index) => arr.indexOf(item) === index);
});
const dsThuongHieu = computed(() => {
  const arr = dsSP.value.map((sp) => sp.sanPham.thuongHieu.ten);
  return arr.filter((item, index) => arr.indexOf(item) === index);
});
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
const bgColor = ref('#ffa854');
let idNV = null;

onBeforeMount(() => {
  store.loadHDCho();
  store.loadSP();
  store.loadPTTT();
});

onMounted(() => {
  idNV = JSON.parse(localStorage.getItem("currentUserInformation")).id;
  setTimeout(() => {
    uiBlock.value = !uiBlock.value;
  }, 3000);
});

const taoHDCho = async () => {
  loading.value = !loading.value;
  await store.taoHDCho(idNV);
  loading.value = !loading.value;
  selectedHoaDon.value = dsHDCho.value[0];
  userID.value = 1;
}

const huyHDCho = async (hd) => {
  await store.huyHDCho(hd.id);
  store.dsHDCT = [];
  selectedHoaDon.value = null;
};

const soLuongError = ref('');
const themSPVaoHDCT = async (soLuong) => {
  if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
    toast.add({
      severity: 'error',
      summary: 'Không thể thực hiện',
      detail: 'Vui lòng chọn hoá đơn',
      life: 3000
    });
    return;
  }
  if (soLuong == null || soLuong == '') {
    soLuongError.value = 'Không được để trống';
    return;
  }
  soLuongError.value = '';
  await store.themSPVaoHDCT(selectedHoaDon.value.id, dataOverlay.value.id, soLuong);
  op.value.hide();
  soLuong = null;
};

const xoaHDCT = async (hdct) => {
  await store.xoaHDCT(hdct.id);
};

const tinhTien = (arr) => {
  let tongTienHang = 0;
  let tongChietKhau = 0;
  phiShip.value = phiShip.value ?? 0;
  for (const item of arr) {
    tongTienHang += item.donGia * item.soLuong;
    tongChietKhau += item.chietKhau * item.soLuong;
  }
  thanhTien.value = tongTienHang - tongChietKhau + phiShip.value;
  return {tongTienHang, tongChietKhau};
};

const tienKhachDuaInputEvent = (event) => {
  tienKhachDua.value = event.value;
};

const initSanPhamFilter = () => {
  sanPhamFilter.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    'mauSac.ten': {value: null, matchMode: FilterMatchMode.EQUALS},
    'size.ten': {value: null, matchMode: FilterMatchMode.EQUALS},
    'sanPham.loai.ten': {value: null, matchMode: FilterMatchMode.EQUALS},
    'sanPham.thuongHieu.ten': {value: null, matchMode: FilterMatchMode.EQUALS}
  }
};
initSanPhamFilter();

const clearSanPhamFilter = () => {
  initSanPhamFilter();
};

const showKhachHangDialog = () => {
  console.log("log");
  dialog.open(BHTQKhachHangComponent, {
    props: {
      header: 'Khách hàng',
      style: {
        width: '36vw',
      },
      modal: true,
      closeOnEscape: false,
      closable: true
    },
    onClose: (opt) => {
      if (opt.data != undefined) userID.value = opt.data.idUser;
    }
  });
}

const userID = ref(null);
const dataOverlay = ref();
const addChonHoaDonDialog = ref(false);
const tableHoaDonRowSelected = async (event) => {
  localStorage.setItem("selectedHDId", event.data.id);
  store.loadHDCT(event.data.id);
  userID.value = event.data.user.id;
  if (idSPCT.value != null) {
    addChonHoaDonDialog.value = true;
  }
};

const themSpQR = async () => {
  await store.themSPVaoHDCT(selectedHoaDon.value.id, idSPCT.value, 1);
  idSPCT.value = null;
  addChonHoaDonDialog.value = false;
}

const tableHoaDonRowContextMenu = (event) => {
  cm.value.show(event.originalEvent);
};

const op = ref();
const toggle = (toggle) => {
  if (selectedHoaDon.value) {
    dataOverlay.value = toggle;
    op.value.toggle(event);
  } else toast.add({
    severity: 'error',
    summary: 'Không thể thực hiện',
    detail: 'Vui lòng chọn hoá đơn',
    life: 3000
  });
}

const schema = yup.object().shape({
  tienKhachDua: yup.number().required('Không được để trống')
      .typeError('Số lượng tồn phải là một số'),
  hinhThucGiaoHangs: yup.number().required('Vui lòng chọn'),
  PhuongThucThanhToan: yup.number().required('Vui lòng chọn')
});

const {handleSubmit, resetForm} = useForm({
  validationSchema: schema
});

const {value: tienKhachDua, errorMessage: tienKhachDuaError} = useField('tienKhachDua');
const {value: hinhThucGiaoHangs, errorMessage: hinhThucThanhToanError} = useField('hinhThucGiaoHangs');
const {value: PhuongThucThanhToan, errorMessage: PhuongThucThanhToanToanError} = useField('PhuongThucThanhToan');
const {value: moTa, errorMessage: moTaError} = useField('moTa');
const {value: idDiaChi, errorMessage: idDiaChiError} = useField('idDiaChi');
const {value: phiShip, errorMessage: phiShipError} = useField('tienShip');
const onSubmit = handleSubmit(async (values) => {

  if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
    soLuongError.value = '';
    toast.add({
      severity: 'error',
      summary: 'Không thể thực hiện',
      detail: 'Vui lòng chọn hóa đơn',
      life: 3000
    });
    return;
  }
  const hdModel = new BHTQHoaDonModel(values.hinhThucGiaoHangs, values.PhuongThucThanhToan, values.moTa, values.tienKhachDua, values.idDiaChi, values.tienShip);
  await store.thanhToanHD(selectedHoaDon.value.id, hdModel);
  toast.add({severity: 'success', summary: 'Thành công', detail: 'Hoá đơn đã được thanh toán', life: 3000});
  store.dsHDCT = [];
  selectedHoaDon.value = null;
  resetForms();
  addDialog.value = false;
});

const resetForms = () => {
  resetForm();
  tinhTien(dsHDCT.value).tongTienHang = 0;
  tinhTien(dsHDCT.value).tongChietKhau = 0;
  thanhTien.value = 0;
  phiShip.value = 0;
  dsHDCT.value = [];
}

const onHinhThucGiaoHangChange = async () => {
  if (hinhThucGiaoHang.value) {
    hinhThucGiaoHangs.value = hinhThucGiaoHang.value.id;
    if (hinhThucGiaoHangs.value === 2) {
      await loadDiaChis();
      diaChiDialog.value = true;

    } else {
      phiShip.value = 0;
      tinhTien(dsHDCT.value);
      diaChiDialog.value = false;
    }
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
  toast.add({severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000});
}
const addDialog = ref(false);
const onDialog = () => {
  if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
    soLuongError.value = '';
    toast.add({
      severity: 'error',
      summary: 'Không thể thực hiện',
      detail: 'Vui lòng chọn hóa đơn',
      life: 3000
    });
    return;
  }
  if (dsHDCT.value.length <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Không thể thực hiện',
      detail: 'Không có SP nào trong giỏ hàng',
      life: 3000
    });
    return;
  }
  // if (userID.value == null || userID.value == '' || userID.value === 1) {
  //   soLuongError.value = '';
  //   toast.add({
  //     severity: 'error',
  //     summary: 'Không thể thực hiện',
  //     detail: 'Vui lòng chọn khách hàng',
  //     life: 3000
  //   });
  //   return;
  // }
  addDialog.value = true;
}

const error = ref('');
const torch = ref(false);
const idSPCT = ref(null);
const onDecode = async (decodeString) => {
  const data = dsSP.value.find(x => x.ma == decodeString);
  if (data !== null) {
    if (data.soLuongTon <= 0) {
      toast.add({severity: 'error', summary: 'Không thể thực hiện', detail: 'Sản phẩm đã hết hàng', life: 3000});
      return;
    }
    if (selectedHoaDon.value == null || selectedHoaDon.value == '') {
      idSPCT.value = data.id;
      toast.add({
        severity: 'error',
        summary: 'Không thể thực hiện',
        detail: 'Vui lòng chọn hóa đơn',
        life: 3000
      });
      return;
    }
    await store.themSPVaoHDCT(selectedHoaDon.value.id, data.id, 1);
  } else {
    error.value = 'Dữ liệu không đủ hoặc không hợp lệ từ mã QR code.';
  }
};

let timer = null;
const onInputSLSPCuaHDCT = (event, data) => {
  if (event.value !== null) {
    if (event.value <= data.sanPhamChiTiet.soLuongTon + data.soLuong) {
      // if (timer) {
      //   clearTimeout(timer);
      // }
      // timer = setTimeout(() => {
        store.updateSLSPCuaHDCT(data.id, event.value);
      // }, 300);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Không thể thực hiện',
        detail: 'Vượt quá số lượng tồn của SP',
        life: 3000
      });
      store.updateSLSPCuaHDCT(data.id, data.sanPhamChiTiet.soLuongTon + data.soLuong);
    }
  }
}

const onBlurSLSPCuaHDCT = async (event, data) => {
  if (event.value == '') {
    await store.xoaHDCT(data.id);
    toast.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: 'Sản phẩm đã bị xoá khỏi giỏ hàng',
      life: 3000
    });
  }
}

const onError = (error) => {
  console.error('Lỗi quét mã QR:', error);
  // Xử lý lỗi ở đây (nếu cần)
};

const checkedSwitch = ref(false);

const diaChiDialog = ref(false)
const userDiaChi = ref([]);
const loadDiaChis = async () => {
  await userService.fetchAllDiaChi(userID.value); // Gọi hàm fetchAll từ Store
  userDiaChi.value = userService.diaChi;
  idDiaChi.value = userDiaChi.value[0].id;
  const diaChiMacDinh = userDiaChi.value.find(x => x.id === idDiaChi.value);
  if (diaChiMacDinh == '' || diaChiMacDinh == null) {
    phiShip.value = 0;
  } else {
    await phiGiaoHangService.phiShip(diaChiMacDinh);
    phiShip.value = phiGiaoHangService.money;
  }
};
const tinhPhiShip = async (idDiaChi) => {
  const diaChiMacDinh = userDiaChi.value.find(x => x.id === idDiaChi);
  if (diaChiMacDinh == '' || diaChiMacDinh == null) {
    phiShip.value = 0;
  } else {
    await phiGiaoHangService.phiShip(diaChiMacDinh);
    phiShip.value = phiGiaoHangService.money;
  }
}

const exportToPDF = async () => {
  const content = document.getElementById('export-pdf');
  const opt = {
    margin: 1,
    filename: 'myfile.pdf',
    image: {type: 'png'},
    html2canvas: {scale: 2},
    jsPDF: {unit: 'in', format: 'a4', orientation: 'landscape'}
  };
  html2pdf().set(opt).from(content).save();
};
</script>

<template>
  <Loading v-model:active="uiBlock" :can-cancel="false" :is-full-page="true" :background-color="bgColor" :opacity="1"
           :lock-scroll="true">
    <template #default>
      <LottieAnimation class="w-5 m-auto" :animation-data="AnimatedLogo" :loop="true" :auto-play="true" :speed="1"/>
    </template>
  </Loading>
  <Toast/>
  <div class="card" id="export-pdf">
    <Button label="x" @click="exportToPDF"/>
    <div class="row">
      <div class="col-9" style="margin-top: -20px; height: 340px;">
        <div class="card gap-3" style="height: 100%;">
          <ContextMenu ref="cm" class="w-16rem"
                       :pt="{menu: {class: 'm-0 p-0'}}"
                       :model="tableHoaDonContextMenuModel"
                       @hide="selectedHoaDon = null"/>
          <DataTable :value="dsHDCho" dataKey="id" v-model:selection="selectedHoaDon" tableStyle="height: 200px"
                     v-model:contextMenuSelection="selectedHoaDon" selectionMode="single"
                     @rowSelect="tableHoaDonRowSelected"
                     contextMenu @rowContextmenu="tableHoaDonRowContextMenu" scrollable scrollHeight="205px"
                     showGridlines>
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">Hóa đơn chờ</h5>
                <Button label="Tạo hoá đơn" icon="pi pi-plus" size="small" outlined :loading="loading"
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
                  <i class="pi pi-user-edit hover:text-cyan-600" style="font-size: 1.2rem;"
                     @click="showKhachHangDialog"></i>
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
      </div>
      <div class="col-3" style="margin-top: -20px;  width: 350px;  height: 340px;">
        <div class=" card " style=" width: 100%; height: 100%;">
          <div style=" width: 290px; height:500px;">
            <div style="margin-left: 10px; margin-top: 0px;">
              <div v-show="checkedSwitch == true" style="width: 100%; height: 220px;">
                <qrcode-stream @decode="onDecode" @error="onError" :torch="torch"></qrcode-stream>
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
          <div class="flex" style="width: 200px; height: 100px; margin-top: 10px; margin-left: 70px;">
            <label style="font-weight: 600; font-size: 17px; margin-right: 20px;">Bật/tắt: </label>
            <InputSwitch v-model="checkedSwitch"/>
          </div>
        </div>
      </div>
      <div class="Field col-12 md:col-9" style="margin-top: -15px; height: 340px; margin-bottom: 10px;">
        <div class="card" style="width: 100% ; height: 100%;">
          <DataTable :value="dsHDCT" tableStyle="height: 200px" dataKey="id" scrollable scrollHeight="205px"
                     showGridlines>
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
            <Column field="sanPhamChiTiet.sanPham.ten" header="Tên sản phẩm">
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
                <InputNumber v-model="slotProps.data.soLuong"
                             :min="1"
                             :max="slotProps.data.sanPhamChiTiet.soLuongTon + slotProps.data.soLuong"
                             @input="onInputSLSPCuaHDCT($event, slotProps.data)"
                             @blur="onBlurSLSPCuaHDCT($event, slotProps.data)"
                             inputId="horizontal-buttons" showButtons
                             buttonLayout="horizontal" inputClass="w-4rem text-center"
                             decrementButtonClass="p-button-danger"
                             incrementButtonClass="p-button-success" incrementButtonIcon="pi pi-plus"
                             decrementButtonIcon="pi pi-minus"/>
              </template>
            </Column>
            <Column header="Thành tiền">
              <template #body="slotProps">
                {{
                  formatCurrency((parseInt(slotProps.data.donGia) - parseInt(slotProps.data.chietKhau)) *
                      parseInt(slotProps.data.soLuong))
                }}
              </template>
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

          </OverlayPanel>
        </div>
      </div>
      <div class="col-3" style="width: 350px; height: 340px;">
        <div class="card" style="height:100%; margin-top: 0px;  margin-left: 0px; ">
          <h3>Thanh toán</h3>
          <div style="display: flex; margin-bottom: 10px; margin-top: 10px;">
            <div>
              <h6>Mã hóa đơn: </h6>
            </div>
            <div style="margin-left: 80px;">
              <h6 v-if="selectedHoaDon">{{ selectedHoaDon.ma }}</h6>
            </div>

          </div>
          <div class="flex" style=" margin-bottom: 10px;">
            <div>
              <h6>Tổng tiền hàng: </h6>
            </div>
            <div style="margin-left: 60px;">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongTienHang) }}</h6>
            </div>

          </div>
          <div class="flex" style=" margin-bottom: 10px;">
            <div>
              <h6>Tổng chiết khấu:</h6>
            </div>
            <div style="margin-left: 55px;">
              <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongChietKhau) }}</h6>
            </div>

          </div>
          <div class="flex" style=" margin-bottom: 20px;">
            <div>
              <h6>Thành tiền:</h6>
            </div>
            <div style="margin-left: 90px;">
              <h6 class="text-orange-500">{{ formatCurrency(thanhTien) }}</h6>
            </div>

          </div>
          <Button label="Thanh toán" severity="warning" raised @click="onDialog"/>

        </div>
      </div>
      <div class="Field col-12 md:col-12" style="">
        <div class="card" style="width: 100%">
          <DataTable :value="dsSP" v-model:filters="sanPhamFilter" dataKey="id" showGridlines scrollable
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
            <Column header="Size" filterField="size.ten" :showFilterMatchModes="false"
                    :filterMenuStyle="{ width: '14rem' }">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span>{{ data.size.ten }}</span>
                </div>
              </template>
              <template #filter="{ filterModel }">
                <Dropdown v-model="filterModel.value" :options="dsSize" placeholder="Tất cả" class="p-column-filter">
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
            <Column filterField="sanPham.loai.ten" header="Loại" :showFilterMatchModes="false"
                    :filterMenuStyle="{ width: '14rem' }">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span>{{ data.sanPham.loai.ten }}</span>
                </div>
              </template>
              <template #filter="{ filterModel }">
                <Dropdown v-model="filterModel.value" :options="dsLoai" placeholder="Tất cả" class="p-column-filter">
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
            <Column filterField="sanPham.thuongHieu.ten" header="Thương hiệu" :showFilterMatchModes="false"
                    :filterMenuStyle="{ width: '14rem' }">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span>{{ data.sanPham.thuongHieu.ten }}</span>
                </div>
              </template>
              <template #filter="{ filterModel }">
                <Dropdown v-model="filterModel.value" :options="dsThuongHieu" placeholder="Tất cả"
                          class="p-column-filter">
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
            <Column field="soLuongTon" header="Số lượng"></Column>
            <Column class="text-center">
              <template #body="slotProps">
                <Button @click="toggle(slotProps.data)" icon="pi pi-plus" severity="info" outlined rounded></Button>
                <OverlayPanel ref="op">
                  <div style="display: flex;">
                    <div style="margin-top: 20px; margin-right: 10px;">
                      <span class="p-float-label">
                        <InputNumber id="number-input" v-model="soLuong" :class="{ 'p-invalid': soLuongError }" :min="1"
                                     :max="dataOverlay.soLuongTon"/>
                        <label for="Field">Số lượng</label>
                      </span>
                      <small class="p-error">{{ soLuongError }}</small>
                    </div>
                    <div style="margin-top: 20px;">
                      <Button label="Thêm" @click="themSPVaoHDCT(soLuong)"></Button>
                    </div>
                  </div>
                </OverlayPanel>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <div>

  </div>

  <Dialog v-model:visible="addDialog" :style="{ width: '500px' }" header="Thanh toán" :modal="true">

    <div style="display: flex; margin-bottom: 10px; margin-top: 10px;">
      <div>
        <h6>Mã hóa đơn: </h6>
      </div>
      <div style="margin-left: 80px;">
        <h6 v-if="selectedHoaDon">{{ selectedHoaDon.ma }}</h6>
      </div>

    </div>
    <div class="flex" style=" margin-bottom: 10px;">
      <div>
        <h6>Tổng tiền hàng: </h6>
      </div>
      <div style="margin-left: 60px;">
        <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongTienHang) }}</h6>
      </div>

    </div>
    <div class="flex" style=" margin-bottom: 10px;">
      <div>
        <h6>Tổng chiết khấu:</h6>
      </div>
      <div style="margin-left: 55px;">
        <h6 class="text-primary">{{ formatCurrency(tinhTien(dsHDCT).tongChietKhau) }}</h6>
      </div>

    </div>
    <div class="flex" style=" margin-bottom: 10px;">
      <div>
        <h6>Phí ship:</h6>
      </div>
      <div style="margin-left: 110px;">
        <h6 class="text-primary">{{ formatCurrency(phiShip) }}</h6>
      </div>

    </div>
    <div class="flex" style=" margin-bottom: 20px;">
      <div>
        <h6>Thành tiền:</h6>
      </div>
      <div style="margin-left: 90px;">
        <h6 class="text-orange-500">{{ formatCurrency(thanhTien) }}</h6>
      </div>

    </div>


    <form @submit="onSubmit">
      <div class="flex align-items-center" style="margin-top: 20px;">


        <div>
          <h6>Tiền khách đưa:</h6>
        </div>

        <div style="margin-left: 60px;">
          <InputNumber v-model="tienKhachDua" inputId="integeronly" @input="tienKhachDuaInputEvent"
                       :class="{ 'p-invalid': tienKhachDuaError }" :min="thanhTien"/>
          <br/>
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
          <Dropdown v-model="phuongThucThanhToan" :options="dsPTTT" optionLabel="ten"
                    placeholder="Phương thức thanh toán"
                    class="w-full md:w-14rem" @change="onPhuongThucThanhToanChange"
                    :class="{ 'p-invalid': PhuongThucThanhToanToanError }"/>
          <div style=" width: 200px; "><small class="p-error">{{ PhuongThucThanhToanToanError }}</small>
          </div>
        </div>
        <div style="margin-left: -40px;">
          <Dropdown v-model="hinhThucGiaoHang" :options="APP_CONSTANT.HINH_THUC_GIAO_HANG" optionLabel="ten"
                    placeholder="Hình thức giao hàng" class="w-full md:w-14rem" style="margin-left: 85px"
                    @change="onHinhThucGiaoHangChange" :class="{ 'p-invalid': hinhThucThanhToanError }"/>
          <div style="margin-left: 90px; width: 200px; height: 0px; "><small class=" p-error">{{
              hinhThucThanhToanError
            }}</small></div>
        </div>
      </div>
      <div class="card" v-if="diaChiDialog==true" style="overflow-y: scroll; width:95%; height: 200px;">
        <div
            style="margin-left: 300px; height: 40px; width: 80px;  border: 1px solid blue; border-radius: 20px; text-align: center;">
          <ThemDiaChi style="position: absolute; right: 0; width: 80px; margin-bottom: 5px"
                      :idUser="userID"></ThemDiaChi>
        </div>
        <div v-if="!userDiaChi || userDiaChi.length === 0" style="text-align: center; margin-top: 50px;">
          <svg width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"
               class="bi bi-file-earmark-x">
            <path
                d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/>
            <path
                d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
          </svg>
          <h4 style="text-align: center;">Chưa có địa chỉ</h4>
        </div>
        <div v-for="(hd, index) in userDiaChi">
          <div style="width: 100%; height: 70px; display: flex">
            <div style="width: 90%; height: 50px; background: rgb(255, 255, 255)">
              <div class="flex">
                <label for="" style="margin-right: 10px">
                  <span>{{ hd?.user?.ten }} </span></label>
                <span style="margin-right: 10px"> | </span>
                <label for="" style="color: rgb(0, 0, 0)"> {{ hd?.user?.sdt }}</label>
                <label for="" style="color: rgb(255, 0, 0); margin-left: 10px"> {{
                    hd.trangThai == 1 ? 'Mặc định' : ''
                  }}</label>
              </div>
              <div style="margin-top: 10px">
                <label for="" style="margin-right: 10px">
                  <span>{{ hd.diaChi }} </span></label>
              </div>
              <div style="margin-top: 10px">
                <label for="" style="margin-right: 10px">
                  <span>{{ hd.tenphuongXa }}, {{ hd.tenQuanHuyen }}, {{ hd.tenTinhThanh }} </span></label>
              </div>
            </div>

            <div style="width: 10%; height: 10px; background: rgb(255, 255, 255); display: flex; margin-top: 30px">
              <RadioButton v-model="idDiaChi" inputId="ingredient1" name="pizza" :value="hd.id"
                           @click="tinhPhiShip(hd.id)"/>
            </div>

          </div>
          <Divider/>
        </div>
      </div>
      <h6>Ghi chú</h6>
      <Textarea v-model="moTa" rows="4" cols="63"/>
      <Button label="Thanh toán" severity="warning" raised type="submit" style="margin-top: 20px; margin-left: 150px;"/>


    </form>
  </Dialog>

  <Dialog v-model:visible="addChonHoaDonDialog" :style="{ width: '500px' }" header="Confirm" :modal="true">
    <h6>Bạn có muốn thêm sản phẩm vừa QR vào giỏ hàng không ?</h6>
    <Button label="Không" severity="secondary" @click="addChonHoaDonDialog = false" raised
            style="margin-top: 20px; margin-left: 150px;"/>
    <Button label="Có" class="mr-2" @click="themSpQR" raised style="margin-top: 20px; margin-left: 10px;"/>

  </Dialog>

  <!-- <Dialog v-model:visible="diaChiDialog" :style="{ width: '650px' }" header="Địa Chỉ" :modal="true" class="p-fluid">
    <div style="position: relative; width: 80px; margin-left: 500px; margin-bottom: 20px">
      <AddDiaChi style="position: absolute; right: 0; width: 80px; margin-bottom: 5px"></AddDiaChi>
    </div>




  </Dialog> -->
</template>

<style scoped>
@keyframes my-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes my-fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}

.card {
  margin-top: 20px;
  padding: 1rem;
}
</style>