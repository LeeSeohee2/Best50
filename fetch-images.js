// netlify/functions/fetchImages.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const query = event.queryStringParameters.q || 'fashion';
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS 헤더 추가
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("API 요청 오류:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API 요청 중 오류가 발생했습니다.' }),
        };
    }
};
