const express = require('express');
const router = express.Router();
const Quote = require('../models/Quotes');

// 목록 가져오기 엔드포인트
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find(); // 모든 명언을 데이터베이스에서 가져옴
        res.json(quotes); // 클라이언트에 명언 목록을 JSON 형식으로 응답
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotes', error }); // 오류 발생 시 500 상태 코드와 함께 오류 메시지 응답
    }
});

// 랜덤 명언 가져오기 엔드포인트 추가
router.get('/random', async (req, res) => {
    try {
        const count = await Quote.countDocuments(); // 명언의 총 개수를 가져옴
        const randomIndex = Math.floor(Math.random() * count); // 랜덤 인덱스 생성
        const randomQuote = await Quote.findOne().skip(randomIndex); // 랜덤 인덱스를 사용하여 명언 하나를 가져옴
        res.json(randomQuote); // 클라이언트에 랜덤 명언을 JSON 형식으로 응답
    } catch (error) {
        res.status(500).json({ message: 'Error fetching random quote', error }); // 오류 발생 시 500 상태 코드와 함께 오류 메시지 응답
    }
});

module.exports = router;