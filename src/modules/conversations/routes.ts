import { ROUTE } from "@core/interfaces";
import ConversationsController from "./controller";
import { Router } from "express";
import { authMiddleware } from "@core/middleware";

export default class ConversationsRoute implements ROUTE {
  public path = "/api/v1/conversations";
  public router = Router();

  public conversationController = new ConversationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Group
    this.router.post(
      this.path,
      authMiddleware,
      this.conversationController.sendMessage
    );
    this.router.get(
      this.path,
      authMiddleware,
      this.conversationController.getMyConversation
    );
    this.router.get(
      this.path + '/chat/:id',
      authMiddleware,
      this.conversationController.getOneConversation
    );
  }
}
