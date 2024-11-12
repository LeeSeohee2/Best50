// =============================
// 슬라이더 기능 구현
// =============================
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const slideInterval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 전환

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
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

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// 메뉴 항목 클릭 시 메뉴 닫기
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});
