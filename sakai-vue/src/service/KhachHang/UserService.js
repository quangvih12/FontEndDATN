import axios from 'axios';

 class UserService{
    async getUserByUsername(username) {
        const response = await axios.get(`http://localhost:8080/api/khach-hang/user?username=${username}`)           
          return response.data   
       
    }

  
}
export default new UserService();