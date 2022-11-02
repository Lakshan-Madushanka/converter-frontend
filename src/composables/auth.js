import { reactive, ref } from "vue";

import {
  signUpRequest,
  signOutRequest,
  signInRequest,
  getAuthenticatedUserRequest,
} from "../api/calls/auth";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";

export const user = reactive({
  id: "",
  name: "",
  email: "",
});

export const authStatus = reactive({
  isLoading: false,
  isAuthenticated: false,
});

const appLoadingStatus = ref(false);

export default () => {
  const router = useRouter();
  const route = useRoute();

  const toast = useToast();

  const errors = reactive({ data: "" });

  async function auth(type, payload) {
    if (type === "signUp") {
      authStatus.isLoading = true;

      try {
        const response1 = await signUpRequest(payload);
        if (response1.status === 201) {
          const response2 = await getAuthenticatedUserRequest();
          setUser(response2.data);
          authStatus.isAuthenticated = true;
          redirectuser();
        }
      } catch (error) {
        if (error.response.status === 422) {
          setErrors(error.response.data);
          toast.error(error.response.data.message);
        }
      } finally {
        authStatus.isLoading = false;
      }
    }

    if (type === "signOut") {
      try {
        await signOutRequest();
      } catch (error) {
        showErrorAlert();
      } finally {
        window.location.reload();
      }
    }

    if (type === "signIn") {
      authStatus.isLoading = true;

      try {
        const response1 = await signInRequest(payload);

        if (response1.status === 200) {
          const response2 = await getAuthenticatedUserRequest();

          setUser(response2.data);
          authStatus.isAuthenticated = true;
          redirectuser();
        }
      } catch (error) {
        if (error.response.status === 422) {
          setErrors(error.response.data);
          toast.error(error.response.data.message);
        }
      } finally {
        authStatus.isLoading = false;
      }
    }

    if (type === "getUser") {
      try {
        appLoadingStatus.value = true;
        const response2 = await getAuthenticatedUserRequest();
        setUser(response2.data);
        authStatus.isAuthenticated = true;

        redirectuser();
      } catch (error) {
        //showErrorAlert();
      } finally {
        appLoadingStatus.value = false;
      }
    }
  }

  function redirectuser() {
    const path = route.query["redirect"];
    if (path) {
      router.replace({ path });
      return;
    }
    router.replace({ name: "Home" });
  }

  function setUser(data) {
    (user.id = data.id), (user.name = data.name);
    user.email = data.email;
  }

  function setErrors(data) {
    errors.message = data.message;
    errors.data = data.errors;
  }

  function showErrorAlert() {
    alert("Error ocuured please try again later");
  }
  return {
    authStatus,
    user,
    errors,
    auth,
    appLoadingStatus,
  };
};
