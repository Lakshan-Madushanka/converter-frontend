import api from "../../axios";

import {
  CONVERT,
  getRouteForDownloadConvertedFiles,
  GET_SUPPORTED_FORMATS,
} from "../routes";

import { downloadFiles } from "./helpers";

export const getAllowedFileFormats = async (fileType) => {
  const queryString = `?mime_type=${fileType}`;

  return await api.get(GET_SUPPORTED_FORMATS + queryString);
};

export const convert = async (files) => {
  return await api.post(CONVERT, files, {
    headers: {
      "Content-Type": "multipart/form-data,application/json",
    },
    params: { XDEBUG_SESSION_START: "PHPSTORM" },
  });
};

export const downloadConvertedFiles = async (jobId, fileName) => {
  const route = getRouteForDownloadConvertedFiles(jobId);

  const response = await api.get(route, {
    responseType: "blob",
  });

  downloadFiles(response.data, fileName);
};
