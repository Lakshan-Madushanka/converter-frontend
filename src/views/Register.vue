<template>
  <div>
    <section class="h-screen">
      <div class="container px-6 py-12 h-full">
        <div
          class="flex justify-center items-center flex-wrap h-full g-6 text-gray-800"
        >
          <div class="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              class="w-full"
              alt="Phone image"
            />
          </div>
          <div class="md:w-8/12 lg:w-5/12 lg:ml-20">
            <form @submit.prevent="submit">
              <!-- Name input -->
              <div class="mb-6">
                <input
                  type="text"
                  class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Name"
                  v-model="user.name"
                />
                <template v-if="errors.data.name">
                  <p
                    class="mt-2 text-pink-600 text-sm"
                    v-for="error in errors.data.name"
                    :key="error"
                  >
                    {{ error }}
                  </p>
                </template>
                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.name.required.$invalid"
                >
                  Name is required
                </p>
              </div>
              <!-- Email input -->
              <div class="mb-6">
                <input
                  type="email"
                  class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Email address"
                  v-model="user.email"
                />
                <template v-if="errors.data.email">
                  <p
                    class="mt-2 text-pink-600 text-sm"
                    v-for="error in errors.data.email"
                    :key="error"
                  >
                    {{ error }}
                  </p>
                </template>
                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.email.required.$invalid"
                >
                  Email is required
                </p>
                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.email.email.$invalid"
                >
                  Email should be a valid email.
                </p>
              </div>

              <!-- Password input -->
              <div class="mb-6">
                <input
                  type="password"
                  class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Password"
                  v-model="user.password"
                />

                <template v-if="errors.data.password">
                  <p
                    class="mt-2 text-pink-600 text-sm"
                    v-for="error in errors.data.password"
                    :key="error"
                  >
                    {{ error }}
                  </p>
                </template>

                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.password.required.$invalid"
                >
                  Password is required
                </p>
                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.password.minLength.$invalid"
                >
                  Password should be over 6 characters length.
                </p>
              </div>

              <!-- Password Confirmation input -->
              <div class="mb-6">
                <input
                  type="password"
                  class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Password Confirmation"
                  v-model="user.password_confirmation"
                />
                <p
                  class="mt-2 text-pink-600 text-sm"
                  v-if="v$.password_confirmation.sameAsPassword.$invalid"
                >
                  Password doesn't match.
                </p>
              </div>

              <div class="flex justify-between items-center mb-6">
                <div class="form-group form-check">
                  <input
                    type="checkbox"
                    class="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    id="exampleCheck3"
                    v-model="user.remember"
                    checked
                  />
                  <label
                    class="form-check-label inline-block text-gray-800 cursor-pointer"
                    for="exampleCheck3"
                    >Remember me</label
                  >
                </div>
                <a
                  href="#!"
                  class="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                  >Forgot password?</a
                >
              </div>

              <!-- Submit button -->
              <breeding-rhombus-spinner
                class="mx-auto"
                loading="loading"
                color="color"
                :size="50"
                v-if="authStatus.isLoading"
              >
              </breeding-rhombus-spinner>

              <button
                type="submit"
                class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                v-else
              >
                Sign Up
              </button>

              <div
                class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
              ></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive, toRef } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

import useAuth from "../composables/auth";

export default {
  setup() {
    const { auth: register, authStatus, errors } = useAuth();

    const user = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      remember: false,
    });

    const passwordRef = toRef(user, "password");

    const rules = {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(8) },
      password_confirmation: { sameAsPassword: sameAs(passwordRef) },
    };

    const v$ = useVuelidate(rules, user, {
      $lazy: true,
      $autoDirty: true,
    });

    async function submit() {
      const isFormCorrect = await v$.value.$validate();

      if (!isFormCorrect) return;

      register("signUp", user);
    }

    return { authStatus, errors, user, v$, submit };
  },
};
</script>
