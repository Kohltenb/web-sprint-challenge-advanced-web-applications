import axios from "axios";


export const ApiGet = () => {
    const token = localStorage.getItem('token')
    return axios.create({
        baseURL: 'http://localhost:9000/api',
        headers: {
            Authorization: token
        }
    })
}