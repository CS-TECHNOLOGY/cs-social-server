import { HttpException } from "@core/exceptions";
import { IPagination } from "@core/interfaces";
import { UserSchema } from "@modules/users";
import { PostSchema } from ".";
import IPost, { IComment, ILike, IShare } from "./interface";

export default class PostService {
  public async createPost(userId: string, postDto: any): Promise<IPost> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    const newPost = new PostSchema({
      title: postDto.title,
      text: postDto.text,
      name: user.firstname + " " + user.lastname,
      avatar: user.avatar,
      user: userId,
    });
    const post = await newPost.save();
    return post;
  }

  public async updatePost(postId: string, postDto: any): Promise<IPost> {
    const post = await PostSchema.findByIdAndUpdate(
      postId,
      { ...postDto },
      { new: true }
    ).exec();
    if (!post) {
      throw new HttpException(400, "Post is not found");
    }
    return post;
  }

  public async getAllPost(): Promise<IPost[]> {
    const posts = await PostSchema.find().sort({ date: -1 }).exec();
    return posts;
  }

  public async getPostById(useId: string): Promise<IPost> {
    const post = await PostSchema.findById(useId).exec();
    if (!post) {
      throw new HttpException(400, "Post_id is not exit");
    }
    return post;
  }
  public async getAllPostPaging(
    keyword: string,
    page: number
  ): Promise<IPagination<IPost>> {
    let query = {};
    if (keyword) {
      query = {
        $or: [{ text: keyword }],
      };
    }

    const docs = await PostSchema.find(query)
      .skip((page - 1) * 10)
      .limit(10)
      .exec();

    const rowCount = await PostSchema.find(query).countDocuments().exec();
    return {
      total: rowCount,
      page: page,
      pageSize: 10,
      item: docs,
    } as IPagination<IPost>;
  }

  public async deletePost(userId: string, postId: string): Promise<IPost> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }
    if (post.user.toString() !== userId) {
      throw new HttpException(400, "User is not authorized");
    }

    await post.remove();
    return post;
  }

  public async likePost(userId: string, postId: string): Promise<ILike[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post is not exist");
    }
    if (post.likes.some((like: ILike) => like.user.toString() === userId)) {
      throw new HttpException(400, "Post already liked");
    }
    post.likes.unshift({ user: userId });

    await post.save();
    return post.likes;
  }

  public async unlikePost(userId: string, postId: string): Promise<ILike[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post is not exist");
    }
    if (!post.likes.some((like: ILike) => like.user.toString() === userId)) {
      throw new HttpException(400, "Post has not been like");
    }
    post.likes = post.likes.filter((like) => like.user.toString() !== userId);

    await post.save();
    return post.likes;
  }

  public async addComment(
    text: string,
    userId: string,
    postId: string
  ): Promise<IComment[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    const user = await UserSchema.findById(userId).select("-password").exec();

    if (!user) throw new HttpException(400, "User not found");

    const newComment = {
      text: text,
      name: user.firstname + " " + user.lastname,
      avatar: user.avatar,
      user: userId,
    };

    post.comments.unshift(newComment as IComment);
    await post.save();
    return post.comments;
  }
  public async removeComment(
    commentId: string,
    postId: string,
    userId: string
  ): Promise<IComment[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) throw new HttpException(400, "Comment not found");

    if (comment.user.toString() !== userId)
      throw new HttpException(401, "User not authorized");

    post.comments = post.comments.filter(
      ({ _id }) => _id.toString() !== commentId
    );
    await post.save();
    return post.comments;
  }
  public async sharePost(userId: string, postId: string): Promise<IShare[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post is not exist");
    }
    if (post.shares.some((share: IShare) => share.user.toString() === userId)) {
      throw new HttpException(400, "Post already shared");
    }
    if (!post.shares){
      post.shares = [];
    }
    post.shares.unshift({ user: userId });

    await post.save();
    return post.shares;
  }

  public async unSharePost(userId: string, postId: string): Promise<IShare[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post is not exist");
    }
    if (!post.shares.some((share: IShare) => share.user.toString() === userId)) {
      throw new HttpException(400, "Post has not been shared");
    }
    if (!post.shares){
      post.shares = [];
    }
    post.shares = post.shares.filter((share) => share.user.toString() !== userId);
  
    await post.save();
    return post.shares;
  }
}
