import mongoose, { Document, Model, Schema } from 'mongoose';

type LogAttributes = {
  method: string;
  path: string;
  user_agent: string;
  status: string;
  message: string;
  ip: string;
};

type LogDocument = Document & LogAttributes;

type LogModel = Model<LogDocument>;

const LogSchema = new Schema(
  {
    method: String,
    path: String,
    user_agent: String,
    status: String,
    message: String,
    ip: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<LogDocument, LogModel>('Log', LogSchema);
