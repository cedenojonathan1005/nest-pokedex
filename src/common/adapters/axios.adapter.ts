import { HttpAdapterInterface } from '../interfaces/http-adapter.interface';
import axios, { AxiosInstance } from 'axios';

export class AxiosAdapter implements HttpAdapterInterface {
  private readonly axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (e) {
      throw new Error('Error');
    }
  }
}
