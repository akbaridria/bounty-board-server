import { PinataSDK } from "pinata";

const initPinata = (pinataJwt: string, pinataGateway: string) => {
  const pinata = new PinataSDK({
    pinataJwt,
    pinataGateway,
  });

  return pinata;
};

const uploadFile = async (
  file: File,
  pinataJwt: string,
  pinataGateway: string
) => {
  const pinata = initPinata(pinataJwt, pinataGateway);
  return await pinata.upload.public.file(file);
};

const getFile = async (
  cid: string,
  pinataJwt: string,
  pinataGateway: string
) => {
  const pinata = initPinata(pinataJwt, pinataGateway);
  return await pinata.gateways.public.get(cid);
};

export { uploadFile, getFile };
