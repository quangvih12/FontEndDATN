import axios from 'axios';

 class TokenService{
    async gentoken(username) {
        const response = await axios.post(`http://localhost:8080/api/genToken?username=${username}`)           
          return response.data   
       
    }
}
export default new TokenService();