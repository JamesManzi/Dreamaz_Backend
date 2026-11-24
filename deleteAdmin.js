
const User = require("./models/User");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

    console.log("Database Connected Successfully");

    try {

        const user = await User.findOne({
            email: "Admin@gmail.com"
        });

        if (!user) {
            console.log("Admin Not Found");
            return;
        }

        await User.findByIdAndDelete(user._id);

        console.log("Admin Deleted Successfully");

    } catch (error) {

        console.log("Deleting Admin Error:", error);

    } finally {

        await mongoose.connection.close();

    }

})
.catch((error) => {

    console.log("Database Error:", error);
    process.exit(1);

});
