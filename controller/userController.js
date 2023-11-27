require('dotenv').config()
const UserModel = require("../models/user");
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');

const Email_Id = "shakeelbinshahul@gmail.com"
const Email_Pass = "14073012@"


module.exports.getUser = async (req, res) => {
    const user = await UserModel.find();
    res.send(user);
}
module.exports.getUserRestrictData = async (req, res) => {
    const user = await UserModel.find({}, { name: 1, email: 1 });
    res.send(user);
}

module.exports.saveUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(404).json({ Message: "check name,email,password (all fields are mandotary)" })
    }

    const user = await UserModel.findOne({ email })
    if (user) {
        return res.status(404).json({ Message: "Userexist" });
    }


    if (name && email && password) {
        UserModel.create({ name, email, password })
            .then(data => {
                console.log("user added Successfully")
                return res.send({ "name": data.name, "id": data._id, "email": data.email })
            })
            .catch(err => {
                console.error(err);
            })
    }

}

module.exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user) {
        res.status(404).json({ Message: "User not exist" })
    }
    const randomString =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    const link = `https://lovely-figolla-4dd39a.netlify.app/passwordreset/${randomString}`;

    user.resettoken = randomString;
    const updated = await UserModel.findByIdAndUpdate(user._id, user);
    if (updated) {
        res.status(201).json({ Message: "Password reset link send to your mail id, Kindly check" })
    }
    //send an email to reset/particular user   

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: Email_Id,
            pass: Email_Pass
        }
    });

    const sendMail = async () => {
        const info = await transporter.sendMail({
            from: `MD SHAKEEL" <${Email_Id}>`,
            to: user.email,
            subject: "Reset Password",
            text: link
        });
        console.log(`Mail set to ${info.messageId}`);
    };

    sendMail().catch(console.error);
}

module.exports.passwordUpdate = async (req, res) => {
    const resettoken = req.params.id;
    const { password } = req.body;
    const user = await UserModel.findOne({ resettoken });

    if (!user) {
        return res.status(404).json({ Message: "User not found" });
    }
    user.password = password
    user.resettoken = "";
    await UserModel.findByIdAndUpdate(user._id, user)

    return res.send({ Message: "Password Updated successfully" })

}


module.exports.Signin = async (req, res) => {

    const { email, password } = req.body;

    // find the user by email
    const user = await UserModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'Authentication failed' });
    }

    // compare passwords
    if (user.password !== password) {
        return res.status(400).json({ message: 'Authentication failed' });
    }

    // generate and send the JWT token
    if (user && password) {
        const token = jwt.sign({ userId: user._id }, { expiresIn: '2h' });
        return res.status(201).json(token)
    }


}