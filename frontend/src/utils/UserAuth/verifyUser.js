import axios from "axios";
export const verifyUser = () => {
    try {
    let data = {
        _id : JSON.parse(localStorage.getItem("data"))._id,
        uId : JSON.parse(localStorage.getItem("data")).uId,
        name : JSON.parse(localStorage.getItem("data")).name,
        jwtToken : localStorage.getItem("token")
    }
    axios.post(`http://127.0.0.1:8080/auth/user/verifyUser`, data)
    .then(response => {
        //console.log(response.data);
        if(!response.data.status==200) {
            throw "err";
        }
    })
    .catch(err => {
        throw err;
    })
    } catch(err) {
        //console.log(err);
        // localStorage.clear();
        window.location.href = "/login";
    }
    // return true;


}