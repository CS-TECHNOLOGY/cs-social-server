import { UserSchema } from "@modules/users";
import { HttpException } from "@core/exceptions";
import { ProfileSchema } from ".";
import IProfile, { IFollower, ISocial, IFriend } from "./interface";
import normalize from "normalize-url";
import { IUser } from "@modules/auth";
class ProfileService {
  private profileSchema = ProfileSchema;

  public async getCurrentProfile(userId: string) {
    const user = await this.profileSchema
      .findOne({
        user: userId,
      })
      .populate("user", ["name", "avatar"])
      .exec();
    if (!user) {
      throw new HttpException(400, "There is no profile for this user!");
    } else {
      return user;
    }
  }
  public async createProfile(userId: string, profileDto: any) {
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      zalo,
    } = profileDto;
    const profileFields: Partial<IProfile> = {
      user: userId,
      company,
      location,
      website:
        website && website != ""
          ? normalize(website.toString(), { forceHttps: true })
          : "",
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: string) => skill.trim()),
      status,
    };

    const socialFields: ISocial = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      zalo,
    };
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = normalize(value, { forceHttps: true });
      }
    }
    profileFields.social = socialFields;

    const profile = await this.profileSchema
      .findOneAndUpdate(
        { user: userId },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .exec();

    return profile;
  }

  public async deleteProfile(userId: string) {
    await this.profileSchema.findByIdAndRemove({ user: userId }).exec();
    await UserSchema.findOneAndRemove({ _id: userId }).exec();
  }
  public async getAllProfile(): Promise<Partial<IUser>[]> {
    const profile = await this.profileSchema
      .find()
      .populate("user", ["name", "avatar"])
      .exec();
    return profile;
  }
  public follow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile) {
      throw new HttpException(400, "There is not profile for your user");
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "There is not profile for target user");
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follower: IFollower) => follower.user.toString() === fromUserId
      )
    ) {
      throw new HttpException(
        400,
        "Target user has already been followed by from user"
      );
    }

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follower: IFollower) => follower.user.toString() === toUserId
      )
    ) {
      throw new HttpException(400, "You has been already followed this user");
    }
    if (!fromProfile.followings) {
      fromProfile.followings = [];
    }

    fromProfile.followings.unshift({ user: toUserId });

    if (!toProfile.followers) {
      toProfile.followers = [];
    }

    toProfile.followers.unshift({ user: fromUserId });

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public unFollow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile) {
      throw new HttpException(400, "There is not profile for your user");
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "There is not profile for target user");
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follower: IFollower) => follower.user.toString() !== fromUserId
      )
    ) {
      throw new HttpException(400, "You has not being followed this user");
    }

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follower: IFollower) => follower.user.toString() !== toUserId
      )
    ) {
      throw new HttpException(400, "You has not been yet followed this user");
    }
    if (!fromProfile.followings) fromProfile.followings = [];
    fromProfile.followings = fromProfile.followings.filter(
      ({ user }) => user.toString() !== toUserId
    );
    if (!toProfile.followers) toProfile.followers = [];
    toProfile.followers = toProfile.followers.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };
  public addFriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile) {
      throw new HttpException(400, "There is not profile for your user");
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "There is not profile for target user");
    }

    if (
      toProfile.friends &&
      toProfile.friends.some(
        (follower: IFollower) => follower.user.toString() === fromUserId
      )
    ) {
      throw new HttpException(
        400,
        "Target user has already been be friend by from user"
      );
    }

    if (
      fromProfile.friend_requests &&
      fromProfile.friend_requests.some(
        (follower: IFollower) => follower.user.toString() === toUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has been already send a friend request to this user"
      );
    }

    if (!toProfile.friend_requests) toProfile.friend_requests = [];
    toProfile.friend_requests.unshift({ user: fromUserId } as IFriend);

    await toProfile.save();

    return toProfile;
  };

  public unFriend = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();

    if (!fromProfile) {
      throw new HttpException(400, "There is not profile for your user");
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "There is not profile for target user");
    }

    if (
      toProfile.friends &&
      toProfile.friends.some(
        (follower: IFollower) => follower.user.toString() !== fromUserId
      )
    ) {
      throw new HttpException(400, "You has not yet be friend this user");
    }

    if (!fromProfile.friends) fromProfile.friends = [];
    fromProfile.friends = fromProfile.friends.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.friends) toProfile.friends = [];
    toProfile.friends = toProfile.friends.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public acceptFriendRequest = async (
    currentUserId: string,
    requestUserId: string
  ) => {
    const currentProfile = await ProfileSchema.findOne({
      user: currentUserId,
    }).exec();

    if (!currentProfile) {
      throw new HttpException(400, "There is not profile for your user");
    }

    const requestProfile = await ProfileSchema.findOne({
      user: requestUserId,
    }).exec();
    if (!requestProfile) {
      throw new HttpException(400, "There is not profile for target user");
    }

    if (
      requestProfile.friends &&
      requestProfile.friends.some(
        (follower: IFollower) => follower.user.toString() === currentUserId
      )
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    if (
      currentProfile.friends &&
      currentProfile.friends.some(
        (follower: IFollower) => follower.user.toString() === requestUserId
      )
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    if (
      currentProfile.friend_requests &&
      currentProfile.friend_requests.some(
        (follower: IFollower) => follower.user.toString() !== requestUserId
      )
    ) {
      throw new HttpException(
        400,
        "You has not any friend request related to this user"
      );
    }

    if (!currentProfile.friend_requests) currentProfile.friend_requests = [];
    currentProfile.friend_requests = currentProfile.friend_requests.filter(
      ({ user }) => user.toString() !== requestUserId
    );

    if (!currentProfile.friends) currentProfile.friends = [];
    currentProfile.friends.unshift({ user: requestUserId } as IFriend);

    if (!requestProfile.friends) requestProfile.friends = [];
    requestProfile.friends.unshift({ user: currentUserId } as IFriend);

    await currentProfile.save();
    await requestProfile.save();
    return currentProfile;
  };
}

export default ProfileService;
