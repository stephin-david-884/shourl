import mongoose, {
    Document,
    HydratedDocument,
    Model,
    Schema,
} from "mongoose";

export interface IUrl extends Document {
    userId: mongoose.Types.ObjectId;
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const urlSchema: Schema<IUrl> = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

export const UrlModel: Model<IUrl> =
    mongoose.model<IUrl>("Url", urlSchema);

export type UrlDocument = HydratedDocument<IUrl>;

export type UrlLean = IUrl & {
    _id: mongoose.Types.ObjectId;
};