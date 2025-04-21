import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("error", (error: any) => {
      console.error("Error connecting to MongoDB:", error.message);
    });
  } catch (error) {
    console.log("Something went wrong connecting to MongoDB");
    console.log(error);
  }
}
