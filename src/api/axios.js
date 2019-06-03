import axios from 'axios';
import router from '../router/index';
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if( error.response.status == 401 ) {
            router.push({path:'/href'})
        }else {
            return Promise.reject(error)
        }
    }
);
export default axios;
