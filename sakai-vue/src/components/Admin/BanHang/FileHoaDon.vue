<script setup>
import {ref} from "vue";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const logoImageSrc = ref(`${import.meta.env.VITE_BASE_FRONTEND_ENDPOINT}/src/assets/images/logo.png`);
const exportToPDF = async () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const content = document.getElementById('sales-invoice').innerHTML;
  const val = htmlToPdfmake(content, {tableAutoSize: true, imagesByReference: true});
  await pdfMake.createPdf({content: val.content, images: val.images}).download();
};
</script>

<template>
  <Button label="x" @click="exportToPDF"></Button>
  <div id="sales-invoice">
    <table style="width: 100%; font-size: 0.8rem">
      <tr style="border: 1px solid white">
        <td rowspan="3"><img :src="logoImageSrc" alt="" style="width: 8em;"></td>
        <td><strong style="text-align: right; margin: 0; font-size: 0.9rem;">Cửa hàng Mũ bảo hiểm VNK</strong></td>
      </tr>
      <tr style="border: 1px solid white">
        <td><span style="text-align: right; margin: 0;">A: 241 Xuân Thuỷ - Cầu Giấy - HN</span></td>
      </tr>
      <tr style="border: 1px solid white">
        <td><span style="text-align: right; margin: 0;">P: 0234.456.789 - 0912.345.678</span></td>
      </tr>
    </table>

    <span style="text-align: center; font-weight: bold; font-size: 1.3rem">HOÁ ĐƠN BÁN HÀNG</span>
    <span style="text-align: center; font-size: 0.9rem;">Mã số: ...</span>
    <span style="margin-top: 1rem;">Tên khách hàng: ...</span>
    <span style="margin-top: 0.5rem;">Số điện thoại: ...</span>
    <table style="margin-top: 1rem; border-collapse: collapse; width: 100%;">
      <thead>
      <tr>
        <th style="width: 4%;">TT</th>
        <th style="width: 17rem;">Tên sản phẩm</th>
        <th style="width: 5%;">SL</th>
        <th>Đơn giá</th>
        <th>Chiết khấu</th>
        <th>Thành tiền</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>1</td>
        <td>Mũ bảo hiểm Luxury LU-382DC</td>
        <td>100</td>
        <td>250.000đ</td>
        <td>0đ</td>
        <td>99.999.999đ</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="4" style="text-align: right;">Tổng tiền hàng:</td>
        <td colspan="2" style="text-align: center;">450.000đ</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; border-top: 1px solid white">Tổng chiết khấu:</td>
        <td colspan="2" style="text-align: center; border-top: 1px solid white">0đ</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; border-top: 1px solid white">Cần thanh toán:</td>
        <td colspan="2" style="text-align: center; border-top: 1px solid white">0đ</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; border-top: 1px solid white">Tiền khách đưa:</td>
        <td colspan="2" style="text-align: center; border-top: 1px solid white">0đ</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right; border-top: 1px solid white;">Tiền trả lại:</td>
        <td colspan="2" style="text-align: center; border-top: 1px solid white;">0đ</td>
      </tr>
      </tfoot>
    </table>
    <span style="text-align: right;">Thành tiền: ...</span>
    <span style="margin-top: 0.5rem; text-align: right;">Tiền khách đưa: ...</span>
    <span style="margin-top: 0.5rem; text-align: right;">Tiền thừa trả lại: ...</span>
    <div>
      <i style="margin-left: 25rem; margin-top: 1.5rem">Hà Nội, ngày ... tháng ... năm ...</i>
      <p style="margin-left: 28rem">Nhân viên bán hàng</p>
      <strong style="margin-left: 29rem; margin-top: 3rem;">Tôn Thất Học</strong>
    </div>
    <i style="text-align: center; margin-top: 2rem;">Cảm ơn quý khách đã mua hàng tại VNK, hẹn gặp lại quý khách!</i>
  </div>
</template>

<style scoped>
.xx {
  text-align: center;
}
</style>