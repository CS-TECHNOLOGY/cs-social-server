import { authMiddleware } from "@core/middleware";
import { ROUTE } from "@core/interfaces";
import { Router } from "express";
import { PostController } from ".";
export default class PostRoutes implements ROUTE {
  public path = "/api/v1/posts";
  public router = Router();

  public postController = new PostController();

  constructor() {
    this.initalizeRoutes();
  }

  private initalizeRoutes() {
    this.router.post(this.path, authMiddleware, this.postController.createPost); //POST
    this.router.put(this.path + "/:id", this.postController.updatePost);
    this.router.get(this.path, authMiddleware, this.postController.getAllPost);
    this.router.get(
      this.path + "/:id",
      this.postController.getPostById
    );
    this.router.get(
      this.path + "/paging/:page",
      this.postController.getAllPostPaging
    );
    this.router.delete(
      this.path + "/:id",
      authMiddleware,
      this.postController.deletePost
    );
    this.router.put(
      this.path + "/like/:id",
      authMiddleware,
      this.postController.likePost
    );
    this.router.delete(
      this.path + "/like/:id",
      authMiddleware,
      this.postController.unlikePost
    );
    this.router.post(
      this.path + "/comments/:id",
      authMiddleware,
      this.postController.addComment
    );
    this.router.delete(
      this.path + "/comments/:id/:comment_id",
      authMiddleware,
      this.postController.removeComment
    );
    this.router.put(
      this.path + "/share/:id",
      authMiddleware,
      this.postController.sharePost
    );
    this.router.delete(
      this.path + "/share/:id",
      authMiddleware,
      this.postController.unSharePost
    );
  }
}
