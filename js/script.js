/*НАВІГАЦІЙНЕ МЕНЮ (Мобільна версія)*/
const openBtn = document.querySelector("#menu-open-button");
const closeBtn = document.querySelector("#menu-close-button");
const navMenu = document.querySelector(".nav-menu");

// Відкрити мобільне меню
openBtn?.addEventListener("click", () => {
  document.body.classList.add("menu-opened");
});

// Закрити мобільне меню
closeBtn?.addEventListener("click", () => {
  document.body.classList.remove("menu-opened");
});

// Закрити меню при кліку поза ним
document.addEventListener("click", e => {
  if (
    document.body.classList.contains("menu-opened") &&
    !navMenu.contains(e.target) &&
    !openBtn.contains(e.target)
  ) {
    document.body.classList.remove("menu-opened");
  }
});

/*ПІДСВІЧУВАННЯ АКТИВНОГО ПОСИЛАННЯ В НАВІГАЦІЇ*/
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.classList.remove('active');
  const linkPage = link.getAttribute('href');
  
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  }
});

/*СЛАЙДЕР НА ГОЛОВНІЙ СТОРІНЦІ (Популярні напої)*/
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

// Функція відображення конкретного слайда
function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  if (slides[index]) {
    slides[index].classList.add("active");
  }
}

// Наступний слайд
document.getElementById("next")?.addEventListener("click", () => {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
});

// Попередній слайд
document.getElementById("prev")?.addEventListener("click", () => {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
});

// Автоматична прокрутка слайдера (кожні 5 секунд)
if (slides.length > 0) {
  setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 5000);
}

/*ТАЙМЕР ЗВОРОТНОГО ВІДЛІКУ (Секція знижок)*/
const timer = document.getElementById("timer");

if (timer) {
  // Встановлюємо дедлайн на 7 днів від поточної дати
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  // Оновлення таймера щосекунди
  setInterval(() => {
    const now = new Date().getTime();
    const diff = deadline - now;

    // Якщо час вийшов
    if (diff <= 0) {
      timer.innerHTML = "Акцію завершено";
      return;
    }

    // Розрахунок днів, годин, хвилин і секунд
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timer.innerHTML = `${days}д ${hours}г ${minutes}хв ${seconds}с`;
  }, 1000);
}

/*POPUP-ВІКНО (Показується один раз за сесію)*/
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");
let popupShown = sessionStorage.getItem("popupShown");

// Показати popup при виході курсора з верхньої частини вікна
document.addEventListener("mouseleave", e => {
  if (!popupShown && e.clientY < 0) {
    popup.style.display = "flex";
    sessionStorage.setItem("popupShown", "true");
  }
});

// Закрити popup
closePopup?.addEventListener("click", () => {
  popup.style.display = "none";
});

/*ФІЛЬТРИ КАТЕГОРІЙ (Сторінка меню)*/
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Видалити активний клас з усіх кнопок
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.getAttribute('data-category');

    // Показати/приховати картки відповідно до категорії
    menuCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/*КАЛЬКУЛЯТОР ЗАМОВЛЕННЯ*/
let cart = [];
const totalItems = document.getElementById('total-items');
const totalPrice = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Додавання товару в кошик
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    const itemName = card.getAttribute('data-name');
    const itemPrice = parseInt(card.getAttribute('data-price'));

    // Перевірка чи товар вже є в кошику
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: itemName,
        price: itemPrice,
        quantity: 1
      });
    }

    updateCart();

    // Анімація кнопки при додаванні
    const originalTransform = btn.style.transform;
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      btn.style.transform = originalTransform;
    }, 200);
  });
});

// Оновлення відображення калькулятора
function updateCart() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems) totalItems.textContent = totalItemsCount;
  if (totalPrice) totalPrice.textContent = totalPriceSum;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

// Оформлення замовлення
checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Ваш кошик порожній!');
    return;
  }

  let orderDetails = 'Ваше замовлення:\n\n';
  cart.forEach(item => {
    orderDetails += `${item.name} x${item.quantity} - ${item.price * item.quantity} грн\n`;
  });
  orderDetails += `\nЗагальна сума: ${totalPrice.textContent} грн`;

  alert(orderDetails + '\n\nДякуємо за замовлення! Ми зв\'яжемося з вами найближчим часом.');

  // Очищення кошика
  cart = [];
  updateCart();
});

/*УНІВЕРСАЛЬНИЙ LIGHTBOX (Для меню та галереї)*/

// Функція ініціалізації lightbox
function initLightbox(lightboxId, imageSelector, captionEnabled = false) {
  const lightbox = document.getElementById(lightboxId);
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxCaption = captionEnabled ? lightbox.querySelector('p') : null;
  const images = document.querySelectorAll(imageSelector);

  // Відкрити lightbox при кліку на зображення
  images.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      if (captionEnabled && lightboxCaption) {
        lightboxCaption.textContent = img.getAttribute('data-title') || '';
      }
      lightbox.classList.add('active');
    });
  });

  // Закрити lightbox при кліку на хрестик
  lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Закрити lightbox при кліку поза зображенням
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Закриття lightbox клавішею Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

// Ініціалізація lightbox для меню (без підпису)
initLightbox('lightbox', '.menu-img', false);

// Ініціалізація lightbox для галереї (з підписом)
const galleryLightbox = document.getElementById('gallery-lightbox');
if (galleryLightbox) {
  const galleryLightboxImg = galleryLightbox.querySelector('img');
  const galleryLightboxClose = galleryLightbox.querySelector('.lightbox-close');
  const galleryLightboxCaption = galleryLightbox.querySelector('p');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Відкрити lightbox при кліку на елемент галереї
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        galleryLightboxImg.src = img.src;
        if (galleryLightboxCaption) {
          galleryLightboxCaption.textContent = img.getAttribute('data-title') || '';
        }
        galleryLightbox.classList.add('active');
      }
    });
  });

  // Закрити lightbox при кліку на хрестик
  galleryLightboxClose?.addEventListener('click', () => {
    galleryLightbox.classList.remove('active');
  });

  // Закрити lightbox при кліку поза зображенням
  galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) {
      galleryLightbox.classList.remove('active');
    }
  });

  // Закриття lightbox клавішею Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryLightbox.classList.contains('active')) {
      galleryLightbox.classList.remove('active');
    }
  });
}

/*СЛАЙДЕР ВІДГУКІВ (Сторінка "Про нас")*/
let testimonialIndex = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialPrev = document.getElementById('testimonial-prev');
const testimonialNext = document.getElementById('testimonial-next');

// Функція відображення конкретного відгуку
function showTestimonial(index) {
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  if (testimonialSlides[index]) {
    testimonialSlides[index].classList.add('active');
  }
}

// Наступний відгук
testimonialNext?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(testimonialIndex);
});

// Попередній відгук
testimonialPrev?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
  showTestimonial(testimonialIndex);
});

// Автоматична прокрутка відгуків (кожні 7 секунд)
if (testimonialSlides.length > 0) {
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
    showTestimonial(testimonialIndex);
  }, 7000);
}

/*ФІЛЬТРИ КАТЕГОРІЙ (Сторінка галереї)*/
const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Видалити активний клас з усіх кнопок
    galleryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Показати/приховати елементи відповідно до фільтру
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ВАЛІДАЦІЯ КОНТАКТНОЇ ФОРМИ */
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Збір даних з форми
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value.trim()
  };

  // Перевірка заповнення обов'язкових полів
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    showFormMessage('Будь ласка, заповніть всі обов\'язкові поля!', 'error');
    return;
  }

  // Валідація email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    showFormMessage('Будь ласка, введіть коректний email!', 'error');
    return;
  }

  // Успішна відправка
  showFormMessage('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.', 'success');
  contactForm.reset();
});

// Відображення повідомлення про результат відправки
function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;

  // Приховування повідомлення через 5 секунд
  setTimeout(() => {
    formMessage.className = 'form-message';
  }, 5000);
}

/*КАРУСЕЛЬ ФУНКЦІЙ (Сторінка "Автор")*/

// Масив з усіма реалізованими можливостями проєкту
const featuresData = [
  { icon: 'fa-check-circle', text: 'Адаптивний дизайн для desktop, tablet та mobile' },
  { icon: 'fa-check-circle', text: 'Навігаційне меню з бургер-меню та анімацією' },
  { icon: 'fa-check-circle', text: 'Інтерактивне меню з фільтрацією за категоріями' },
  { icon: 'fa-check-circle', text: 'Слайдер популярних продуктів з автопрокруткою та ручним керуванням' },
  { icon: 'fa-check-circle', text: 'Слайдер відгуків клієнтів з автоматичною зміною слайдів' },
  { icon: 'fa-check-circle', text: 'Таймер зворотного відліку для акційних пропозицій' },
  { icon: 'fa-check-circle', text: 'Lightbox галерея для перегляду зображень' },
  { icon: 'fa-check-circle', text: 'Галерея з фільтрами за типами (інтер\'єр, кава, десерти, події)' },
  { icon: 'fa-check-circle', text: 'Контактна форма з валідацією email та телефону' },
  { icon: 'fa-check-circle', text: 'Інтерактивна карта Google Maps через iframe' },
  { icon: 'fa-check-circle', text: 'Віджет курсу валют з автоматичним оновленням' },
  { icon: 'fa-check-circle', text: 'SVG-іконки для цінностей компанії' },
  { icon: 'fa-check-circle', text: 'Popup-вікно з пропозицією знижки (показується один раз за сесію)' },
  { icon: 'fa-check-circle', text: 'Калькулятор замовлень з динамічним підрахунком вартості' },
  { icon: 'fa-check-circle', text: 'Використання SessionStorage для відстеження показу popup' },
  { icon: 'fa-check-circle', text: 'Intersection Observer API для плавної появи елементів при скролі' },
  { icon: 'fa-check-circle', text: 'Карусель функцій з підтримкою drag та swipe' },
  { icon: 'fa-check-circle', text: 'Плавний скрол для якірних посилань (Smooth Scroll)' },
  { icon: 'fa-check-circle', text: 'Кнопка швидкого повернення вгору сторінки' },
  { icon: 'fa-check-circle', text: 'CSS змінні для легкого керування стилями' },
  { icon: 'fa-check-circle', text: 'Сучасна верстка з CSS Grid та Flexbox' },
  { icon: 'fa-check-circle', text: 'CSS анімації та transitions для плавних ефектів' },
  { icon: 'fa-check-circle', text: 'Hover-ефекти та інтерактивні стани елементів' },
  { icon: 'fa-check-circle', text: 'Семантична HTML5 верстка з правильною структурою' },
  { icon: 'fa-check-circle', text: 'Accessibility атрибути (aria-label) для покращеної доступності' }
];

const featuresSection = document.querySelector('.features-section');

if (featuresSection) {
  // Генерація HTML для кожного слайду карусель
  const itemsHTML = featuresData.map(feature => `
    <div class="features-carousel-item">
      <i class="fas ${feature.icon}"></i>
      <p>${feature.text}</p>
    </div>
  `).join('');

  // Вставка згенерованого HTML у секцію
  featuresSection.innerHTML = `
    <h2 class="section-title">Реалізовані можливості</h2>
    <div class="features-carousel-wrapper">
      <div class="features-carousel" id="features-carousel">
        ${itemsHTML}
      </div>
    </div>
    <div class="carousel-controls">
      <button id="carousel-prev"><i class="fas fa-chevron-left"></i></button>
      <button id="carousel-next"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="carousel-indicators" id="carousel-indicators">
      ${featuresData.map((_, index) => `
        <div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
      `).join('')}
    </div>
  `;

  // Ініціалізація змінних для карусель
  let currentCarouselIndex = 0;
  let autoplayInterval = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let previousTranslate = 0;
  
  const carousel = document.getElementById('features-carousel');
  const carouselWrapper = document.querySelector('.features-carousel-wrapper');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const totalSlides = featuresData.length;

  // Оновлення позиції карусель
  function updateCarousel(animate = true) {
    carousel.style.transition = animate ? 'transform 0.5s ease' : 'none';
    const offset = -currentCarouselIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;

    // Оновлення індикаторів
    const displayIndex = ((currentCarouselIndex % totalSlides) + totalSlides) % totalSlides;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === displayIndex);
    });
  }

  // Функції автопрокрутки
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 4000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Наступний слайд
  function nextSlide() {
    currentCarouselIndex++;
    updateCarousel(true);
    
    // Повернення до початку після останнього слайду
    if (currentCarouselIndex >= totalSlides) {
      setTimeout(() => {
        currentCarouselIndex = 0;
        updateCarousel(false);
      }, 500);
    }
  }

  // Попередній слайд
  function prevSlide() {
    currentCarouselIndex--;
    
    if (currentCarouselIndex < 0) {
      currentCarouselIndex = totalSlides - 1;
      updateCarousel(false);
      setTimeout(() => {
        currentCarouselIndex = totalSlides - 1;
        updateCarousel(true);
      }, 20);
    } else {
      updateCarousel(true);
    }
  }

  // Обробники подій для кнопок
  carouselNext?.addEventListener('click', nextSlide);
  carouselPrev?.addEventListener('click', prevSlide);

  // Клік на індикатори
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      currentCarouselIndex = parseInt(indicator.getAttribute('data-index'));
      updateCarousel(true);
    });
  });

  // Пауза автопрокрутки при наведенні миші
  carouselWrapper?.addEventListener('mouseenter', stopAutoplay);
  carouselWrapper?.addEventListener('mouseleave', startAutoplay);

  // Drag/Swipe функціонал
  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    previousTranslate = -currentCarouselIndex * carousel.offsetWidth;
    carousel.style.cursor = 'grabbing';
    carousel.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    currentTranslate = previousTranslate + diff;
    
    const translatePercent = (currentTranslate / carousel.offsetWidth) * 100;
    carousel.style.transform = `translateX(${translatePercent}%)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    carousel.style.cursor = 'grab';
    
    const movedBy = currentTranslate - previousTranslate;
    const threshold = carousel.offsetWidth * 0.15;
    
    if (movedBy < -threshold) {
      nextSlide();
    } else if (movedBy > threshold) {
      prevSlide();
    } else {
      updateCarousel(true);
    }
  }

  // Встановлення курсору
  carousel.style.cursor = 'grab';
  
  // Обробники подій для миші
  carousel.addEventListener('mousedown', dragStart);
  carousel.addEventListener('mousemove', drag);
  carousel.addEventListener('mouseup', dragEnd);
  carousel.addEventListener('mouseleave', () => {
    if (isDragging) dragEnd();
  });
  
  // Обробники подій для touch
  carousel.addEventListener('touchstart', dragStart, { passive: false });
  carousel.addEventListener('touchmove', drag, { passive: false });
  carousel.addEventListener('touchend', dragEnd);

  // Запуск автопрокрутки та початкове оновлення
  startAutoplay();
  updateCarousel(false);
}

/*АНІМАЦІЇ ПОЯВИ ПРИ СКРОЛІ (Intersection Observer API)*/

// Налаштування спостерігача
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Вибір елементів для анімації
const animatedElements = document.querySelectorAll(`
  .feature-item,
  .team-card,
  .value-card,
  .menu-card,
  .gallery-item,
  .tech-card
`);

// Початкове приховування та додавання до спостерігача
animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/*КНОПКА ПОВЕРНЕННЯ ВГОРУ*/
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
  // Показ/приховування кнопки при скролі
  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
  });

  // Плавна прокрутка вгору при кліку
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/*ПЛАВНИЙ СКРОЛ ДЛЯ ЯКІРНИХ ПОСИЛАНЬ*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});