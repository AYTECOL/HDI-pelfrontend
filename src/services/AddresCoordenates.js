import Axios from 'axios';

import { ApiKeyGoogle, UrlService } from '../config';
import AuthHeader from './AuthHeader';

const APIKEY = ApiKeyGoogle;
// const Cors = '';
const Cors = `${UrlService}/cors/`;

class GetAddresInfo {
  static async get(address) {
    address = address.replace('#', ' ').replace('N°', ' ') + ', Colombia';
    let url = `${Cors}https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${APIKEY}&input=${address}`;
    const headers = await AuthHeader.getHeaders();

    return Axios(encodeURI(url), { headers }).then(({ data }) => {
      /**
       * @type {{ candidates?: any[] }}
       */
      const { candidates } = data;
      if (data.status === 'ZERO_RESULTS') return {};
      if (!candidates || !candidates.length || !candidates[0]) return {};
      return Axios(
        encodeURI(
          `${Cors}https://maps.googleapis.com/maps/api/place/details/json?key=${APIKEY}&placeid=${candidates[0].place_id}`
        ),
        { headers }
      ).then((finalResponse) => {
        return finalResponse.data.result.geometry.location;
      });
    });
  }

  static async getAdressByCoors({ lat, lng }) {
    return Axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${APIKEY}`
    ).then(({ data }) => {
      /**
       * @typedef {{
       *  formatted_address: string,
       *  address_components: { long_name: string, types: string[] }[]
       * }} Result
       */
      /**
       * @type {{ results: Result[] }}
       */
      const { results } = data;
      const address = (results || []).find(
        ({ types }) => types.indexOf('street_address') !== -1
      );
      let { formatted_address, address_components } = {
        formatted_address: '',
        address_components: [],
        ...address,
      };
      const types = [
        'country',
        'locality',
        'neighborhood',
        'sublocality',
        'political',
        'postal_code',
      ];
      for (const address_component of address_components) {
        const isRemoved = !!address_component.types.find(
          (type) => types.indexOf(type) !== -1
        );
        const { long_name } = address_component;
        if (isRemoved) {
          const regExp = new RegExp(`, ${long_name}|${long_name}`);
          formatted_address = formatted_address.replace(regExp, '');
        }
      }
      return formatted_address.replace(/##|#/, 'Nro. ');
    });
  }
}

export default GetAddresInfo;
