import { getRouteforRetrieveAllJobs } from "../routes";
import api from "../../axios";
import { user as authUser } from "../../composables/auth";

export const retriveAllJobs = async () => {
  try {
    const route = getRouteforRetrieveAllJobs(authUser.id);

    return await api.get(route, {
      headers: {
        "Content-Type": "multipart/form-data,application/json",
      },
      params: { XDEBUG_SESSION_START: "PHPSTORM" },
    });
  } catch (error) {
    console.log(error);
  }
};
