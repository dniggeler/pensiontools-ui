import axios from 'axios'

const client = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  json: true
})

export default {
    async doHealthCheck() {
      return client({
        method: 'get',
        url: '/'
      }).then(response => {
        console.log(response.status);
        return response.status == 200
      })
      .catch(err => {
        console.log(err);
        return false;
      })
    }
}