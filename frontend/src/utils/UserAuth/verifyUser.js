export const verifyUser = () => {
    let data = {
        _id : JSON.parse(localStorage.getItem("data"))._id,
        uId : JSON.parse(localStorage.getItem("data")).uId,
        name : JSON.parse(localStorage.getItem("data")).name,
        jwtToken : localStorage.getItem("token")
    }
    axios.post(`http://127.0.0.1:8080/home/user/verifyUser`)

}