import { ROUTE } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";
import { Router } from "express";
import ProfileController from "./controller";
export default class ProfileRoutes implements ROUTE {
  public path = "/api/v1/profile";
  public router = Router();

  public profileController = new ProfileController();

  constructor() {
    this.initalizeRoutes();
  }

  private initalizeRoutes() {
    this.router.get(this.path, this.profileController.getAllProfile); //POST
    this.router.get(
      this.path + "/user/:id",
      this.profileController.getProfileById
    ); // update là Put
    this.router.get(
      this.path + "/me",
      authMiddleware,
      this.profileController.getCurrentProfile
    );
    this.router.post(
      this.path,
      authMiddleware,
      this.profileController.createProfile
    );
    this.router.delete(
      this.path + "/:id",
      this.profileController.deleteProfile
    );
    this.router.post(
      `${this.path}/following/:id`,
      authMiddleware,
      this.profileController.follow
    );

    this.router.delete(
      `${this.path}/following/:id`,
      authMiddleware,
      this.profileController.unFollow
    );
    this.router.post(
      `${this.path}/friends/:id`,
      authMiddleware,
      this.profileController.addFriend
    );

    this.router.delete(
      `${this.path}/friends/:id`,
      authMiddleware,
      this.profileController.unFriend
    );

    this.router.put(
      `${this.path}/friends/:id`,
      authMiddleware,
      this.profileController.acceptFriendRequest
    );
  }
}
