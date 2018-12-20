import { SignIn, Register } from "../views/Login/Auth";

const routes = [
  {
    path: "/login",
    component: SignIn
  },
  {
    path: "/register",
    component: Register
  }
];

export default routes;
