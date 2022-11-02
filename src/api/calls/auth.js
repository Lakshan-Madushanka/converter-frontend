import api from "../../axios";
import { SIGN_UP, SIGN_IN, CSRF, AUTH_USER } from "../routes";
import { SIGN_OUT } from "./../routes";

export const signInRequest = async (payload) => {
  await csrfRequest();
  const response = await api.post(SIGN_IN, payload);

  return response;
};

export const signUpRequest = async (payload) => {
  await csrfRequest();

  const response = await api.post(SIGN_UP, payload);

  return response;
};

export const getAuthenticatedUserRequest = async () => {
  await csrfRequest();

  const response = await api.get(AUTH_USER);

  return response;
};

export const signOutRequest = async () => {
  //  await csrfRequest();

  const response = await api.post(SIGN_OUT, {}, { withCredentials: true });

  return response;
};

export const csrfRequest = async () => {
  const response = await api.get(CSRF);

  return response;
};
