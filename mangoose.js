import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27018/ollama_chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
  emotion: String,
  action: String,
  usersent:String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', messageSchema);