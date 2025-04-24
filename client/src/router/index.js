import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Notes from "../components/Notes.vue";
import Signup from "../components/Signup.vue";
import "../App.css";

const routes = [
  {
    path: "/",
    redirect: "/notes",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/notes",
    name: "Notes",
    component: Notes,
    meta: {
      requiresAuth: true,
    },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function checkAuth() {
  try {
    const res = await fetch(process.env.VUE_APP_API_URL + "/checkAuth", {
      credentials: "include",
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data.authenticated === true;
  } catch (err) {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (
    (to.path === "/login" || to.path === "/signup") &&
    isAuthenticated
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
