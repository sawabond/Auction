import axios from 'axios';
import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';
import { ILoginResponse } from '../../interfaces/Auth/ILoginResponse';
import { IRegisterResponse } from '../../interfaces/Auth/IRegisterResponse';

export interface APIClient {
  login: (values: ILoginFormValues) => Promise<ILoginResponse>;
  register: (values: IRegisterFormValues) => Promise<IRegisterResponse>;
}

const gatewayURL = `${import.meta.env.VITE_GATEWAY_URL!}/api/auth`;

const apiClient: APIClient = {
  async login(values: ILoginFormValues) {
    const response = await axios.post<ILoginResponse>(
      `${gatewayURL}/login`,
      values
    );
    return response.data;
  },
  async register(values: IRegisterFormValues) {
    const response = await axios.post<IRegisterResponse>(
      `${gatewayURL}/register`,
      values
    );
    return response.data;
  },
};

export default apiClient;
