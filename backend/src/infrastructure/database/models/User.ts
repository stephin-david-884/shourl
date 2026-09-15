import mongoose, {
  Document,
  HydratedDocument,
  Model,
  Schema,
} from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema,
);

export type UserDocument = HydratedDocument<IUser>;

export type UserLean = IUser & {
  _id: mongoose.Types.ObjectId;
};