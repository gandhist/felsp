import { BASE_URL } from "../../api/constanta";
const localAuth = JSON.parse(localStorage.getItem('p3sAuth'));

export const getProvinsi = () => {
    fetch(`${BASE_URL}/lov/provinsi`,{
       method: 'GET',
       headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : `Bearer ${localAuth.access_token}` },
   })
   .then(res => res.json())
   .then((data) => {
       console.log('ini di lov')
       console.log(data.data)
     return data.data;
   })
   .catch((err) => {
     console.log(err)
   });
 }