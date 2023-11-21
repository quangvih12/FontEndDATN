// import { defineStore } from 'pinia';
import axios from 'axios';

// export const userStore = defineStore('user', {
//   state: () => ({
//       data : []
//   }),
//   actions: {
//        async getUserByUsername(username){
//           const response = await axios.get(`http://localhost:8080/api/khach-hang/user?username=${username}`)  
//           this.data  =  response.data;
//        }
     
//   }
// })

 class UserService{
    async getUserByUsername(username) {
        const response = await axios.get(`http://localhost:8080/api/khach-hang/user?username=${username}`)           
          return response.data   
       
    }
    

    async getUserByEmail(email) {
      const response = await axios.get(`http://localhost:8080/api/khach-hang/user/find-email?email=${email}`)           
        return response.data   
     
  }

  
}
export default new UserService();