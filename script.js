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
    console.log('Fetching images with query:', query);
    const cachedData = localStorage.getItem('cachedImages');
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const now = Date.now();

    // 하루(24시간 * 60분 * 60초 * 1000밀리초)
    const oneDay = 24 * 60 * 60 * 1000;

    if (cachedData && cacheTimestamp && (now - cacheTimestamp < oneDay)) {
        // 캐시된 데이터가 있고, 하루가 지나지 않았다면 캐시 사용
        console.log('Using cached images.');
        return JSON.parse(cachedData);
    } else {
        try {
            const url = `/.netlify/functions/fetchImages?q=${encodeURIComponent(query)}&per_page=5`;
            console.log('Fetching from URL:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch images");
            const data = await response.json();
            const images = data.hits;

            // 캐시에 데이터와 현재 시간을 저장
            localStorage.setItem('cachedImages', JSON.stringify(images));
            localStorage.setItem('cacheTimestamp', now.toString());

            console.log('Fetched new images and cached them.');
            return images;
        } catch (error) {
            console.error('Failed to fetch images:', error);
            return [];
        }
    }
}

// 슬라이드 생성 함수
function createSlide(imageUrl, altText) {
    if (!imageUrl) {
        console.warn('Image URL is undefined.');
        return null;
    }

    const slide = document.createElement('div');
    slide.classList.add('slide');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText || '슬라이드 이미지';
    img.loading = 'lazy';

    slide.appendChild(img);
    return slide;
}

// 슬라이더 초기화 함수
async function initSlider() {
    console.log('Initializing slider...');
    const images = await fetchImages('안경');

    console.log('Fetched images:', images);

    if (images.length === 0) {
        slidesContainer.innerHTML = '<p>Unable to load images.</p>';
        return;
    }

    // 슬라이드 동적 생성 및 추가
    images.forEach((image, index) => {
        // Pixabay API 응답 구조에 맞게 URL과 태그 가져오기
        const imageUrl = image.webformatURL || image.largeImageURL;
        const altText = image.tags || '슬라이드 이미지';

        if (!imageUrl) {
            console.warn('Image URL does not exist for image:', image);
            return;
        }

        const slide = createSlide(imageUrl, altText);
        if (slide) {
            if (index === 0) {
                slide.classList.add('active');
            }
            slidesContainer.appendChild(slide);
            slides.push(slide);
        }
    });

    if (slides.length === 0) {
        slidesContainer.innerHTML = '<p>Unable to load images.</p>';
        return;
    }

    // 슬라이드 요소가 추가된 후 슬라이더 기능 초기화
    startSlideShow();
    console.log('Slider initialized successfully.');
}

// 슬라이드 쇼 시작 함수
let slideInterval;
function startSlideShow() {
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 전환
        console.log('Slide show started.');
    } else {
        console.warn('No slides available. Slide show not started.');
    }
}

// 다음 슬라이드로 전환하는 함수
function nextSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    console.log(`Current slide index: ${currentSlide}`);
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
