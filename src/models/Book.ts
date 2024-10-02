import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  name: string;
  category: string;
  rentPerDay: number;
}

const BookSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rentPerDay: { type: Number, required: true },
});

export default mongoose.model<IBook>('Book', BookSchema);