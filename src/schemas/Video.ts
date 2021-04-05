import mongoose, { Document, Model, Schema } from 'mongoose';

export type VideoAttributes = {
  videoId: string;
  title: string;
  description: string;
  channel: string;
  channelUrl: string;
  channelId: string;
  videoUrl: string;
  thumbnailUrl: string;
  avatarUrl: string;
  keywords: string[];
  uploadedAt: Date;
  genre: string;
  isFamilyFriendly: Boolean;
  timeDuration: number;
};

export type VideoDocument = Document & VideoAttributes;

type VideoModel = Model<VideoDocument>;

const VideoSchema = new Schema(
  {
    videoId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      required: true,
    },
    channelUrl: {
      type: String,
      required: true,
      trim: true,
    },
    channelId: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: Array,
      required: true,
      default: [],
    },
    uploadedAt: {
      type: Date,
      required: true,
    },
    timeDuration: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    isFamilyFriendly: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<VideoDocument, VideoModel>('Video', VideoSchema);
