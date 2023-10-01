import axios from 'axios';
const VOUCHER_API_BASE_URL = 'http://localhost:8080/api/voucher';

 class VoucherService{
    
    async getVoucher(){
        // return axios.get(VOUCHER_API_BASE_URL);
       
            try {
              const response = await axios.get('http://localhost:8080/api/voucher/getall');
              console.log(response)
              return response?.data.data?.content;
            } catch (error) {
              console.error(error);
              throw error;
            }
          
        // axios.get(http://localhost:8080/api/voucher/index)
    }
     createVoucher(voucher){
   
        try {
            const response =  axios.post('http://localhost:8080/api/voucher/add', voucher);
            return response.data;
          } catch (error) {
            console.error(error);
              throw error;
          }
    }

    getVoucherId(voucherId){
        return axios.get(VOUCHER_API_BASE_URL + '/' + voucherId);
    }

    updateVoucher(voucher, voucherId){
      try {
        const response = axios.put(VOUCHER_API_BASE_URL + '/update/' + voucherId, voucher);
        return response.data;
      } catch (error) {
        console.error(error);
          throw error;
      }
      
    }

    deleteVoucher(voucherId){
        return axios.delete(VOUCHER_API_BASE_URL + '/' + voucherId);
    }
}
export default new VoucherService();
