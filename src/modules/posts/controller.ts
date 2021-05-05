import { NextFunction, Request, Response } from "express";
import IPost from "./interface";
import PostService from "./service";

export default class PostController {
  private postService = new PostService();
  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: any = req.body;
      const userId: string = req.user.id;
      const result = await this.postService.createPost(userId, model);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: any = req.body;
      const postId: string = req.params.id;
      const result = await this.postService.updatePost(postId, model);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
  public getAllPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: IPost[] = await this.postService.getAllPost();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId: string = req.params.id;
      const result = await this.postService.getPostById(postId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
  public getAllPostPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Number(req.params.page);
      const keyword = req.query.keyword || "";
      const result = await this.postService.getAllPostPaging(
        keyword.toString(),
        page
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const result = await this.postService.deletePost(req.user.id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const result = await this.postService.likePost(req.user.id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const result = await this.postService.unlikePost(req.user.id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;

      const result = await this.postService.addComment(
        req.body.text,
        req.user.id,
        postId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;

      const result = await this.postService.removeComment(
        req.params.comment_id,
        postId,
        req.user.id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public sharePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const result = await this.postService.sharePost(req.user.id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public unSharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const result = await this.postService.unSharePost(req.user.id, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
