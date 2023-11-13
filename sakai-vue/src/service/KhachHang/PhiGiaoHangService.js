import { defineStore } from 'pinia';
import axios from 'axios';

const api = 'http://localhost:8080/api/khach-hang/dia-chi';

export const phiShipStore = defineStore('phiShip', {
    state: () => ({
        phiShip : 0
    }),
    actions: {
            //gửi cho giao hàng nhanh
        async phiShip(diaChi) {
            const form = {
                "from_district_id":1454,
                "from_ward_code":"21211",
                "service_type_id":2,
                "to_district_id":2264,
                "to_ward_code":"90816",
                "height":50,
                "length":20,
                "weight":200,
                "width":20,
                "insurance_value":10000,
                "cod_failed_amount":2000,
                "coupon": null
                };
            
                try {
                    const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', form, {
                        headers: {
                            // Thêm headers vào yêu cầu POST ở đây
                            token: '62a3cbdc-4e13-11ee-96dc-de6f804954c9',
                            ShopId: '4523827'
                        }
                    });
                  
                    this.phiShip = response.data.data.total;
                } catch (error) {
                    console.error('Error fetching users:', error);
                }

        }
    }
})