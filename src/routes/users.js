const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// 이메일에서 '@' 뒤를 제거하는 함수
const obfuscateEmail = (email) => {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email; // '@'가 없는 경우 그대로 반환
  return email.slice(0, atIndex); // '@'까지 자르기
};

// 인증된 유저 정보 반환
router.get("/auth", auth, async (req, res) => {
  return res.json({
    id: req.user._id,
    userId: obfuscateEmail(req.user.email),
    email: req.user.email,
    name: req.user.name,
    image: req.user.image,
    profile: req.user.profile,
    userNickname: req.user.userNickname,
  });
});

// 사용자 프로필 정보 반환
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// 사용자 프로필 정보 업데이트
router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// 회원가입
router.post("/register", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Auth failed, email not found");

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(400).send("Wrong password");

    const payload = { userId: user._id.toHexString() };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ user, accessToken });
  } catch (error) {
    next(error);
  }
});

// 로그아웃
router.post("/logout", auth, async (req, res, next) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
