import { createRouter, createWebHistory } from "vue-router";

import { authGuard } from "./guards";

import Home from "../views/Home.vue";
const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const Convert = () => import("../views/Convert.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const About = () => import("../views/About.vue");

const routes = [
  {
    path: "/",
    name: "Home",

    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },

  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/convert",
    name: "Convert",
    beforeEnter: authGuard,
    component: Convert,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    beforeEnter: authGuard,
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
