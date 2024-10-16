const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async (req, res, next) => {
    try {
        // 토큰을 request headers에서 가져오기
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // 토큰이 없는 경우
        if (!token) {
            return res.sendStatus(401);
        }

        // 토큰이 유효한지 확인
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 해당 사용자가 존재하는지 확인
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).send('존재하지 않는 사용자입니다.');
        }

        // 요청에 사용자 정보 추가
        req.user = user;
        next();
    } catch (error) {
        // 토큰이 유효하지 않은 경우
        return res.status(401).send('유효하지 않은 토큰입니다.');
    }
}

module.exports = auth;
