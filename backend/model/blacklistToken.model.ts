import mongoose, { Schema, Document } from 'mongoose';

export interface IBlacklistToken extends Document {
    token: string;
    createdAt: Date;
}

const blacklistTokenSchema: Schema = new Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours TTL
});

export default mongoose.model<IBlacklistToken>('BlacklistToken', blacklistTokenSchema);