const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //bcrypt를 .... 설치를 안해서 일어난 일
// const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },

  image: String,

  userNickname: { type: String, default: "닉네임을 생성해주세요." },

  profile: {
    // 프로필 정보
    height: Number, // 키 (cm)
    weight: Number, // 몸무게 (kg)
    muscleMass: Number, // 골격근량 (kg)
    bodyFatPercentage: Number, // 체지방률 (%)
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (plainpassword) {
  let user = this;
  console.log(user);
  const match = await bcrypt.compare(plainpassword, user.password);
  return match;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
