const { mongoose } = require("../Db/connection");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("enter valid email");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.genarateAuthToken = async function () {
  const user = this;
  var token = jwt.sign({ _id: user._id.toString() }, process.env.JWTVALUE, {
    expiresIn: "24h",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
