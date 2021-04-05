import mongoose from 'mongoose';

const v = process.env;
const db = process.env.NODE_ENV === 'test' ? 'db_test' : v.MONGO_DB;
const uri = `mongodb+srv://${v.MONGO_USER}:${v.MONGO_PASS}${v.MONGO_HOST}/${db}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
