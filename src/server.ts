import AuthRoutes from "@modules/auth/routes";
import { validateEnv } from "@core/utils";
import { IndexRoutes } from "@modules/index";
import UsersRoutes from "@modules/users/routes";
import App from "./app";
import { ProfileRoutes } from "@modules/profile";
import { PostRoutes } from "@modules/posts";
import { BookRoutes } from "@modules/books";

validateEnv();

const routes = [
  new IndexRoutes(),
  new UsersRoutes(),
  new AuthRoutes(),
  new ProfileRoutes(),
  new PostRoutes(),
  new BookRoutes(),
];
const app = new App(routes);
app.listen();
