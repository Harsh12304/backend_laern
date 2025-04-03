import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT)
})
.catch((err) => {
    console.log(`the database connection failed !! `, err )
})



// import express from "express";
// const app =  express()


// (async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("Error", error);
//         throw error
//        })

//        app.listen(process.env.PORT, () => {
//         console.log(`APP IS LISTENING ON PORT ${process.env.PORT}`)
//        })

//     }
//     catch{error}{
//         console.error("ERROR: ", error)
//         throw err
//     }
// })