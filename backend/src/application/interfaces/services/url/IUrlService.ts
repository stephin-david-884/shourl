export interface IUrlService {
  generateCode(): Promise<string>;
}