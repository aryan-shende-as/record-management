import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use(config=>{
    // console.log(localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
});

export default instance;   