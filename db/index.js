const { connect } = require("mongoose");

async function connectDB() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error(
                "DATABASE_URL is not defined in environment variables",
            );
        }
        await connect(process.env.DATABASE_URL);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error("MongoDB Error", error);
    }
}
module.exports = connectDB;
