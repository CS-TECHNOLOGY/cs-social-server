import { HttpException } from "@core/exceptions";
import { isEmptyObject } from "@core/utils";
import { IUser, TokenData } from "@modules/auth/interface";
import { UserSchema } from "@modules/users";
import bcrypt from "bcrypt";
import jws from "jsonwebtoken";
// import UserSchema from "./model";

export default class AuthService {
  public userSchema = UserSchema;
  public async login(model: any): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    } else {
      const user = await this.userSchema.findOne({ email: model.email });
      if (!user) {
        throw new HttpException(409, `Email is not exist!`);
      } else {
        const isMatchPass = await bcrypt.compare(model.password, user.password); // kiem tra bang nhau :)))
        if (!isMatchPass) throw new HttpException(400, "Wrong password");
        else {
          return this.createToken(user);
        }
      }
    }
  }
  public async getCurrentLoginUser(userId: string){ // get user by token
    const user = await this.userSchema.findById(userId);
    if(!user){
      throw new HttpException(404, "User Id is not exist")
    }else{
      return user
    }
  }
  private createToken(user: IUser): TokenData {
    const dataInToken: { id: string } = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn: number = 60000;
    return {
      token: jws.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }
}
