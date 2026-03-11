import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  userId: mongoose.Types.ObjectId;
  ossRegion: string;
  ossAccessKeyId: string;
  ossAccessKeySecret: string;
  ossBucket: string;
  ossDomain: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    ossRegion: {
      type: String,
      required: true,
    },
    ossAccessKeyId: {
      type: String,
      required: true,
    },
    ossAccessKeySecret: {
      type: String,
      required: true,
    },
    ossBucket: {
      type: String,
      required: true,
    },
    ossDomain: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISetting>('Setting', settingSchema);
