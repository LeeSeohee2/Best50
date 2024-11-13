// =============================
// 슬라이더 기능 구현
// =============================

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

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
    }
}

// 슬라이드가 존재할 때만 슬라이더 초기화
if (slides.length > 0) {
    const slideInterval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 전환

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
} else {
    console.warn('슬라이드가 존재하지 않습니다. 슬라이더 기능이 비활성화됩니다.');
}

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
