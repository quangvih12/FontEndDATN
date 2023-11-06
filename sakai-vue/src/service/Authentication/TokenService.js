import axios from 'axios';

 class TokenService{
    async gentoken(username) {
        const response = await axios.post(`http://localhost:8080/api/genToken?username=${username}`)           
          return response.data   
       
    }

    async validatetoken(token){
      const response = await axios.get(`http://localhost:8080/api/validate-token?token=${token}`)           
      return response.data   
    }

    async getUserNameByToken(token){
      const response = await axios.get(`http://localhost:8080/api/getUseNameByToken?token=${token}`)           
      return response.data   
    }
}
export default new TokenService();