//import { disableLoaderHandler } from "./LoaderProvider";

export let setDisableLoaderGlobal = () => {};

export const setDisableLoaderHandler = (handler) => {
  setDisableLoaderGlobal = handler;
};