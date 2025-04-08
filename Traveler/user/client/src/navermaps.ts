import axios from 'axios';

const geocodingUrl = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';

interface GeocodingResponse {
  addresses: { x: string; y: string }[];
}

export async function geocoding(query: string): Promise<[number, number] | null> {
  try {
    const response = await axios.get<GeocodingResponse>(geocodingUrl, {
      params: { query },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.REACT_APP_NAVER_CLIENT_SECRET,
        Accept: 'application/json',
      },
    });

    const data = response.data;
    if (data.addresses.length === 0) {
      console.warn(`${query}에 해당되는 좌표가 없어요.`);
      return null;
    }

    const { x, y } = data.addresses[0];
    return [parseFloat(x), parseFloat(y)];
  } catch (error) {
    console.error('Geocoding API 요청 중 오류 발생:', error);
    return null;
  }
}
