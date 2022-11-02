export const BASE_URL = "http://localhost:8000/";
export const BASE_API_URL = "http://localhost:8000/api/";

//auth routes
export const CSRF = BASE_URL + "sanctum/csrf-cookie";
export const SIGN_IN = "login";
export const SIGN_UP = "register";
export const AUTH_USER = "user";
export const SIGN_OUT = "logout";

// converter routes
export const GET_SUPPORTED_FORMATS = "v1/converter/allowed-file-formats";

export function getRouteForAllowedFileFormats(fileType) {
  return `v1/${fileType}/allowed-file-formats`;
}
export const CONVERT = "v1/convert";

// user file conversion routes
export function getRouteForDownloadConvertedFiles(jobId) {
  return `v1/users/jobs/${jobId}/download`;
}

export function getRouteforRetrieveAllJobs(userId) {
  return `v1/users/${userId}/jobs`;
}
