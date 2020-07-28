class AuthHeader {
  static getToken = () => {
    return localStorage.getItem('serviceToken');
  };
  static getHeaders = async () => {
    const token = 'Bearer ' + this.getToken();
    return {
      pelhauthorization: token,
      Authorization: token,
    };
  };
  constructor() {
    this.token = localStorage.getItem('serviceToken') || '';
  }

  generateAuthCode() {
    try {
      return {
        Authorization: 'Bearer ' + this.token,
      };
    } catch (e) {
      console.log(e);
      return {
        Authorization: 'Bearer ',
      };
    }
  }
}
// test code
// let header = new AuthHeader()
// console.log(header.generateAuthCode())

export default AuthHeader;
