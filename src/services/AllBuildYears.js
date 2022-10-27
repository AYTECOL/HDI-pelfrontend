import Api from './Api';
import AuthHeader from './AuthHeader';
import Helpers from '../common/helpers/helpers';

const BaseUrl = '/all-build-years';

const Default = {
  build_years: [
    {
      buildYearCode: '500007',
      answer: '1978-1984',
    },
    {
      buildYearCode: '500010',
      answer: '2011 en adelante',
    },
    {
      buildYearCode: '500008',
      answer: '1985-1997',
    },
    {
      buildYearCode: '500009',
      answer: '1998-2010',
    },
  ],
};

class AllBuildYears {
  static async get() {
    let data = {};
    try {
      // TODO interceptor or request test
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      data = await Api.get(BaseUrl, undefined, authHeader);
    } catch (e) {
      data = Default;
    }
    if (
      typeof data.build_years === 'undefined' ||
      data.build_years.length === 0
    ) {
      data = Default;
    }
    return Helpers.orderArray(data.build_years, 'buildYearCode');
  }
}

export default AllBuildYears;
