import { ROUTE } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";

import { Router } from "express";
import GroupsController from "./controller";

export default class GroupsRoute implements ROUTE {
  public path = "/api/v1/groups";
  public router = Router();

  public groupsController = new GroupsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      this.groupsController.createGroup
    );

    this.router.get(this.path, this.groupsController.getAll);
    this.router.put(
      this.path + "/:id",
      authMiddleware,
      this.groupsController.updateGroup
    );
    this.router.get(this.path, this.groupsController.getAll);

    this.router.delete(this.path + "/:id", this.groupsController.deleteGroup);
    this.router.post(
      this.path + '/join/:id',
      authMiddleware,
      this.groupsController.joinGroup
    );

    this.router.put(
      this.path + '/:user_id/:group_id',
      this.groupsController.approveJoinRequest
    );
  }
}
