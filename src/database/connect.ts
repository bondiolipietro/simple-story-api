import mongoose from 'mongoose'

const connectDB = () => mongoose.connect(process.env.DB_CONN_STRING)

export { connectDB }
