
class AuthHeader {
    constructor(){
      this.token = localStorage.getItem("serviceToken") || "";
    }

    generateAuthCode(){
        try {
          return {
            'Authorization' : 'Bearer ' + this.token
           };
        } catch (e) {
          console.log(e)
          return {
            'Authorization': "Bearer "
          };
        }
    }
}
// test code
// let header = new AuthHeader()
// console.log(header.generateAuthCode())

export default AuthHeader;
