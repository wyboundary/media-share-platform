import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  originalName: string;
  fileType: 'audio' | 'video';
  mimeType: string;
  fileSize: number;
  ossUrl: string;
  ossKey: string;
  owner: mongoose.Types.ObjectId;
  isPublic: boolean;
  viewCount: number;
  scanCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  ossUrl: {
    type: String,
    required: true
  },
  ossKey: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  scanCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引优化
fileSchema.index({ owner: 1, createdAt: -1 });
fileSchema.index({ isPublic: 1 });

export default mongoose.model<IFile>('File', fileSchema);
