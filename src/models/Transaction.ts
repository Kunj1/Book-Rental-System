import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  bookId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  rentAmount?: number;
}

const TransactionSchema: Schema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date },
  rentAmount: { type: Number },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);