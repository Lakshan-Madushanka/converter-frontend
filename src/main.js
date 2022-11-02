import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "./axios";

import {
  BreedingRhombusSpinner,
  FulfillingSquareSpinner,
  ScalingSquaresSpinner,
  HalfCircleSpinner,
} from "epic-spinners";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "d42db3499973ae268598",
  wsHost: "ws-ap2.pusher.com",
  wsPort: 80,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        axios
          .post("http://localhost:8000/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
});

const options = {
  position: POSITION.TOP_CENTER,
};

const app = createApp(App);

app.component("breeding-rhombus-spinner", BreedingRhombusSpinner);
app.component("fulfilling-square-spinner", FulfillingSquareSpinner);
app.component("scaling-squares-spinner", ScalingSquaresSpinner);
app.component("half-circle-spinner", HalfCircleSpinner);

app.use(router).use(Toast, options);

app.mount("#app");
