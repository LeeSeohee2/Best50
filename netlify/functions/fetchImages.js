const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { q, per_page } = event.queryStringParameters;

    // 환경 변수에서 API 키 가져오기
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

    if (!PIXABAY_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Pixabay API 키가 설정되지 않았습니다.' }),
        };
    }

    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=${per_page || 5}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Pixabay API 요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching images:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: '이미지를 가져오는 중 오류가 발생했습니다.' }),
        };
    }
};
