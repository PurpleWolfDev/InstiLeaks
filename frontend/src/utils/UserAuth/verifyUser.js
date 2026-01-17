import axios from "axios";
export const verifyUser = () => {
    try {
    let data = {
        _id : JSON.parse(localStorage.getItem("data"))._id,
        uId : JSON.parse(localStorage.getItem("data")).uId,
        name : JSON.parse(localStorage.getItem("data")).name,
        jwtToken : localStorage.getItem("token")
    }
    axios.post(`https://instileaks.onrender.com/auth/user/verifyUser`, data)
    .then(response => {
        //console.log(response.data);
        if(!(response.data.status==200)) {
            localStorage.clear();
            window.location.href = "/login";
            throw "err";;
        }
    })
    .catch(err => {
        localStorage.clear();
        window.location.href = "/login";
        throw err;
    })
    } catch(err) {
        //console.log(err);
        localStorage.clear();
        window.location.href = "/login";
    }
    // return true;


}