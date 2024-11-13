// =============================
// 슬라이더 기능 구현
// =============================

// 슬라이드 컨테이너 선택
const slidesContainer = document.querySelector('.slides-container');

// 현재 슬라이드 인덱스
let currentSlide = 0;

// 슬라이드 요소들을 저장할 배열
let slides = [];

// Netlify Functions의 프록시된 API 호출 및 캐싱
async function fetchImages(query) {
    const cachedData = localStorage.getItem('cachedImages');
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const now = Date.now();

    // 하루(24시간 * 60분 * 60초 * 1000밀리초)
    const oneDay = 24 * 60 * 60 * 1000;

    if (cachedData && cacheTimestamp && (now - cacheTimestamp < oneDay)) {
        // 캐시된 데이터가 있고, 하루가 지나지 않았다면 캐시 사용
        console.log('캐시된 이미지를 사용합니다.');
        return JSON.parse(cachedData);
    } else {
        try {
            // 새로운 데이터를 가져와서 캐시에 저장
            const response = await fetch(`/.netlify/functions/fetchImages?q=안경&per_page=5`);
            if (!response.ok) throw new Error("Failed to fetch images");
            const data = await response.json();
            const images = data.hits;

            // 캐시에 데이터와 현재 시간을 저장
            localStorage.setItem('cachedImages', JSON.stringify(images));
            localStorage.setItem('cacheTimestamp', now.toString());

            console.log('새로운 이미지를 가져와 캐시에 저장했습니다.');
            return images;
        } catch (error) {
            console.error('이미지 가져오기 실패:', error);
            return [];
        }
    }
}

// 슬라이드 생성 함수
function createSlide(imageUrl, altText) {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText;
    img.loading = 'lazy';

    slide.appendChild(img);
    return slide;
}

// 슬라이더 초기화 함수
async function initSlider() {
    const images = await fetchImages('안경');

    if (images.length === 0) {
        slidesContainer.innerHTML = '<p>이미지를 로드할 수 없습니다.</p>';
        return;
    }

    // 슬라이드 동적 생성 및 추가
    images.forEach((image, index) => {
        const slide = createSlide(image.url, image.alt || '슬라이드 이미지');
        if (index === 0) {
            slide.classList.add('active');
        }
        slidesContainer.appendChild(slide);
        slides.push(slide);
    });

    // 슬라이드 요소가 추가된 후 슬라이더 기능 초기화
    startSlideShow();
}

// 슬라이드 쇼 시작 함수
let slideInterval;
function startSlideShow() {
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 전환
    } else {
        console.warn('슬라이드가 존재하지 않습니다. 슬라이더 기능이 비활성화됩니다.');
    }
}

// 다음 슬라이드로 전환하는 함수
function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', initSlider);

// =============================
// 네비게이션 바 스크롤 시 배경색 변경
// =============================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =============================
// 모바일 메뉴 토글
// =============================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// 메뉴 항목 클릭 시 메뉴 닫기
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});
