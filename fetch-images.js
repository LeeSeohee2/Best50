const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// 환경 변수에서 API 키 가져오기
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const SEARCH_QUERY = '안경,선글라스';
const IMAGE_COUNT = 3; // 슬라이드에 표시할 이미지 수

// Pixabay API URL 구성
const PIXABAY_API_URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(SEARCH_QUERY)}&image_type=photo&per_page=${IMAGE_COUNT}&safesearch=true`;

// 슬라이드 마커 정의
const START_MARKER = '<!-- START_SLIDES -->';
const END_MARKER = '<!-- END_SLIDES -->';

// 이미지 가져오기 함수
async function fetchImages() {
    try {
        const response = await fetch(PIXABAY_API_URL);
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
            return data.hits.map(hit => hit.largeImageURL);
        } else {
            console.error('Pixabay에서 이미지를 가져오지 못했습니다.');
            return [];
        }
    } catch (error) {
        console.error('이미지 가져오기 에러:', error);
        return [];
    }
}

// 슬라이드 HTML 생성 함수
function generateSlidesHTML(imageUrls) {
    return imageUrls.map(url => `<div class="slide" style="background-image: url('${url}');"></div>`).join('\n');
}

// 메인 함수
(async () => {
    const imageUrls = await fetchImages();
    if (imageUrls.length === 0) {
        console.error('슬라이드 이미지를 업데이트할 수 없습니다.');
        process.exit(1);
    }

    // index.html 파일 경로
    const indexPath = path.join(__dirname, 'index.html');

    // index.html 읽기
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // 슬라이드 HTML 생성
    const slidesHTML = generateSlidesHTML(imageUrls);

    // 슬라이드 섹션 업데이트
    const newIndexContent = indexContent.replace(
        new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
        `${START_MARKER}\n${slidesHTML}\n${END_MARKER}`
    );

    // index.html에 쓰기
    fs.writeFileSync(indexPath, newIndexContent, 'utf-8');

    console.log('슬라이드 이미지가 성공적으로 업데이트되었습니다.');
})();
