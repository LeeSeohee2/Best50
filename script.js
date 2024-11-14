// script.js

// =============================
// 슬라이더 기능 구현 (메인 슬라이드)
// =============================

// 메인 슬라이드 컨테이너 선택
const mainSlidesContainer = document.querySelector('.slider .slides-container');

// 현재 슬라이드 인덱스
let currentMainSlide = 0;

// 슬라이드 요소들을 저장할 배열
let mainSlides = [];

// Pixabay API를 사용하여 이미지 가져오기 및 캐싱
async function fetchImages(query, limit = 5) {
    console.log(`Fetching images with query: ${query}`);
    const cachedData = localStorage.getItem(`cachedImages_${query}`);
    const cacheTimestamp = localStorage.getItem(`cacheTimestamp_${query}`);
    const now = Date.now();

    // 하루(24시간 * 60분 * 60초 * 1000밀리초)
    const oneDay = 24 * 60 * 60 * 1000;

    if (cachedData && cacheTimestamp && (now - cacheTimestamp < oneDay)) {
        // 캐시된 데이터가 있고, 하루가 지나지 않았다면 캐시 사용
        console.log(`Using cached images for query: ${query}`);
        return JSON.parse(cachedData);
    } else {
        try {
            const url = `/.netlify/functions/fetchImages?q=${encodeURIComponent(query)}&per_page=${limit}`;
            console.log(`Fetching from URL: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch images");
            const data = await response.json();
            let images = data.hits;

            // '눈' 또는 'eye' 키워드를 포함하지 않는 이미지로 필터링
            images = images.filter(image => {
                if (!image.tags) return true; // 태그가 없으면 포함
                const tags = image.tags.toLowerCase();
                return !tags.includes('눈') && !tags.includes('eye');
            });

            // 캐시에 데이터와 현재 시간을 저장
            localStorage.setItem(`cachedImages_${query}`, JSON.stringify(images));
            localStorage.setItem(`cacheTimestamp_${query}`, now.toString());

            console.log(`Fetched new images for query: ${query}, filtered them, and cached the result.`);
            return images;
        } catch (error) {
            console.error('Failed to fetch images:', error);
            return [];
        }
    }
}

// 슬라이드 생성 함수 (메인 슬라이드)
function createMainSlide(imageUrl, altText) {
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

// 슬라이더 초기화 함수 (메인 슬라이드)
async function initMainSlider() {
    console.log('Initializing main slider...');
    const images = await fetchImages('안경', 5);

    console.log('Fetched main slider images:', images);

    if (images.length === 0) {
        mainSlidesContainer.innerHTML = '<p>이미지를 불러올 수 없습니다.</p>';
        return;
    }

    // 슬라이드 동적 생성 및 추가
    images.forEach((image, index) => {
        const imageUrl = image.webformatURL || image.largeImageURL;
        const altText = image.tags || '슬라이드 이미지';

        if (!imageUrl) {
            console.warn('Image URL does not exist for image:', image);
            return;
        }

        const slide = createMainSlide(imageUrl, altText);
        if (slide) {
            if (index === 0) {
                slide.classList.add('active');
            }
            mainSlidesContainer.appendChild(slide);
            mainSlides.push(slide);
        }
    });

    if (mainSlides.length === 0) {
        mainSlidesContainer.innerHTML = '<p>이미지를 불러올 수 없습니다.</p>';
        return;
    }

    // 슬라이드 요소가 추가된 후 슬라이더 기능 초기화
    startMainSlideShow();
    console.log('Main slider initialized successfully.');
}

// 슬라이드 쇼 시작 함수 (메인 슬라이드)
let mainSlideInterval;
function startMainSlideShow() {
    if (mainSlides.length > 0) {
        mainSlideInterval = setInterval(nextMainSlide, 5000); // 5초마다 슬라이드 전환
        console.log('Main slide show started.');
    } else {
        console.warn('No slides available. Main slide show not started.');
    }
}

// 다음 슬라이드로 전환하는 함수 (메인 슬라이드)
function nextMainSlide() {
    if (mainSlides.length === 0) return;

    mainSlides[currentMainSlide].classList.remove('active');
    currentMainSlide = (currentMainSlide + 1) % mainSlides.length;
    mainSlides[currentMainSlide].classList.add('active');
    console.log(`Current main slide index: ${currentMainSlide}`);
}

// =============================
// 이달의 행사 이미지 교체
// =============================

// 이달의 행사 이미지 요소 선택
const eventImage = document.getElementById('event-image');

// Pixabay API를 사용하여 단일 이미지 가져오기 및 캐싱
async function fetchEventImage(query) {
    console.log(`Fetching event image with query: ${query}`);
    const cachedData = localStorage.getItem(`cachedEventImage_${query}`);
    const cacheTimestamp = localStorage.getItem(`cacheTimestamp_EventImage_${query}`);
    const now = Date.now();

    // 하루(24시간 * 60분 * 60초 * 1000밀리초)
    const oneDay = 24 * 60 * 60 * 1000;

    if (cachedData && cacheTimestamp && (now - cacheTimestamp < oneDay)) {
        // 캐시된 데이터가 있고, 하루가 지나지 않았다면 캐시 사용
        console.log(`Using cached event image for query: ${query}`);
        return JSON.parse(cachedData);
    } else {
        try {
            const url = `/.netlify/functions/fetchImages?q=${encodeURIComponent(query)}&per_page=1`;
            console.log(`Fetching from URL: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch event image");
            const data = await response.json();
            let images = data.hits;

            // '눈' 또는 'eye' 키워드를 포함하지 않는 이미지로 필터링
            images = images.filter(image => {
                if (!image.tags) return true; // 태그가 없으면 포함
                const tags = image.tags.toLowerCase();
                return !tags.includes('눈') && !tags.includes('eye');
            });

            if (images.length > 0) {
                const image = images[0];
                const imageUrl = image.webformatURL || image.largeImageURL;
                const altText = image.tags || '이달의 행사 이미지';

                // 캐시에 데이터와 현재 시간을 저장
                localStorage.setItem(`cachedEventImage_${query}`, JSON.stringify(imageUrl));
                localStorage.setItem(`cacheTimestamp_EventImage_${query}`, now.toString());

                console.log(`Fetched new event image for query: ${query}, cached the result.`);
                return imageUrl;
            } else {
                console.warn('No suitable event images found.');
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch event image:', error);
            return null;
        }
    }
}

// 이달의 행사 이미지 초기화 함수
async function initEventImage() {
    console.log('Initializing event image...');
    const query = '이벤트'; // 이벤트 관련 이미지 쿼리

    const imageUrl = await fetchEventImage(query);

    if (imageUrl) {
        eventImage.src = imageUrl;
        console.log('Event image set successfully.');
    } else {
        console.warn('No event image available.');
    }
}

// =============================
// 초기화 실행
// =============================

document.addEventListener('DOMContentLoaded', () => {
    initMainSlider();
    initEventImage();
});

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
