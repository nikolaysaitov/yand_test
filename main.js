document.addEventListener("DOMContentLoaded", function () {
  // Элементы карусели участников
  const membersLine = document.querySelector(".members-line");
  const memberItems = document.querySelectorAll(".members-item");
  const arrowLeft = document.getElementById("MEMBER-ARROW-LEFT");
  const arrowRight = document.getElementById("MEMBER-ARROW-RIGHT");
  const counterText = document.querySelector(".arrow-wrapper--member p");

  // Настройки карусели
  const itemWidth = memberItems[0].offsetWidth + parseInt(getComputedStyle(memberItems[0]).marginRight);
  const visibleItems = 3;
  let currentIndex = 0;
  let autoSlideInterval;

  // Клонируем элементы для бесшовной цикличности
  function cloneItems() {
    // Клонируем первые несколько элементов и добавляем в конец
    for (let i = 0; i < visibleItems; i++) {
      const clone = memberItems[i].cloneNode(true);
      membersLine.appendChild(clone);
    }

    // Клонируем последние несколько элементов и добавляем в начало
    for (let i = memberItems.length - 1; i >= memberItems.length - visibleItems; i--) {
      const clone = memberItems[i].cloneNode(true);
      membersLine.insertBefore(clone, membersLine.firstChild);
    }

    // Устанавливаем начальную позицию (на оригинальных элементах)
    membersLine.style.transform = `translateX(${-itemWidth * visibleItems}px)`;
  }

  // Обновляем счетчик
  function updateCounter() {
    let displayIndex = currentIndex;
    if (displayIndex < 0) displayIndex = memberItems.length + displayIndex;
    if (displayIndex >= memberItems.length) displayIndex = displayIndex - memberItems.length;

    counterText.innerHTML = `<span class="opacity">${displayIndex + 1}</span> / ${memberItems.length}`;
  }

  // Перемещение карусели
  function moveCarousel(animate = true) {
    if (animate) {
      membersLine.style.transition = "transform 0.5s ease-in-out";
    } else {
      membersLine.style.transition = "none";
    }

    membersLine.style.transform = `translateX(${-(currentIndex + visibleItems) * itemWidth}px)`;
    updateCounter();
  }

  // Следующий слайд
  function nextSlide() {
    currentIndex++;
    moveCarousel(true);

    // Если дошли до конца клонов, перескакиваем на начало
    if (currentIndex >= memberItems.length) {
      setTimeout(() => {
        membersLine.style.transition = "none";
        currentIndex = 0;
        moveCarousel(false);
      }, 500);
    }
  }

  // Предыдущий слайд
  function prevSlide() {
    currentIndex--;
    moveCarousel(true);

    // Если дошли до начала клонов, перескакиваем в конец
    if (currentIndex < -visibleItems) {
      setTimeout(() => {
        membersLine.style.transition = "none";
        currentIndex = memberItems.length - 1;
        moveCarousel(false);
      }, 500);
    }
  }

  // Автоматическая смена слайдов
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // 4 секунды
  }

  // Остановка автоматической смены
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Обработчики событий для кнопок
  arrowRight.addEventListener("click", function () {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  arrowLeft.addEventListener("click", function () {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Пауза автоматической прокрутки при наведении
  membersLine.addEventListener("mouseenter", stopAutoSlide);
  membersLine.addEventListener("mouseleave", startAutoSlide);

  // Инициализация
  cloneItems();
  startAutoSlide();

  // Адаптация при изменении размера окна
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Пересчитываем ширину элемента
      const newItemWidth = memberItems[0].offsetWidth + parseInt(getComputedStyle(memberItems[0]).marginRight);

      // Обновляем позицию
      membersLine.style.transition = "none";
      membersLine.style.transform = `translateX(${-(currentIndex + visibleItems) * newItemWidth}px)`;
    }, 250);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Элементы карусели этапов
  const stageLine = document.querySelector(".stage-line");
  const stageItems = document.querySelectorAll(".stage-item");
  const stageDots = document.querySelectorAll(".dots-wrapper span");
  const arrowLeft = document.getElementById("STAGE-ARROW-LEFT");
  const arrowRight = document.getElementById("STAGE-ARROW-RIGHT");

  // Настройки карусели
  const itemWidth = stageItems[0].offsetWidth + parseInt(getComputedStyle(stageItems[0]).marginRight);
  const visibleItems = 2; // Показываем по 2 этапа за раз
  let currentPosition = 0;
  const maxPosition = -(itemWidth * (stageItems.length - visibleItems));

  // Обновление состояния кнопок и точек
  function updateControls() {
    const currentIndex = Math.abs(currentPosition) / itemWidth;

    // Обновление стрелок
    arrowLeft.classList.toggle("disabled", currentPosition === 0);
    arrowRight.classList.toggle("disabled", currentPosition === maxPosition);

    // Обновление точек
    stageDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Перемещение карусели
  function moveCarousel() {
    stageLine.style.transform = `translateX(${currentPosition}px)`;
    updateControls();
  }

  // Следующий слайд
  function nextSlide() {
    if (currentPosition > maxPosition) {
      currentPosition -= itemWidth;
      // Гарантируем, что не выйдем за пределы
      if (currentPosition < maxPosition) currentPosition = maxPosition;
      moveCarousel();
    }
  }

  // Предыдущий слайд
  function prevSlide() {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      // Гарантируем, что не выйдем за пределы
      if (currentPosition > 0) currentPosition = 0;
      moveCarousel();
    }
  }

  // Переход к конкретному слайду по точкам
  function goToSlide(index) {
    currentPosition = -(itemWidth * index);
    moveCarousel();
  }

  // Обработчики событий для кнопок
  arrowRight.addEventListener("click", function () {
    if (!this.classList.contains("disabled")) {
      nextSlide();
    }
  });

  arrowLeft.addEventListener("click", function () {
    if (!this.classList.contains("disabled")) {
      prevSlide();
    }
  });

  // Обработчики событий для точек
  stageDots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      goToSlide(index);
    });
  });

  // Инициализация
  updateControls();

  // Адаптация при изменении размера окна
  window.addEventListener("resize", function () {
    // Пересчитываем ширину элемента
    const newItemWidth = stageItems[0].offsetWidth + parseInt(getComputedStyle(stageItems[0]).marginRight);

    // Корректируем позицию
    const ratio = newItemWidth / itemWidth;
    currentPosition = Math.round(currentPosition * ratio);

    // Обновляем максимальную позицию
    const newMaxPosition = -(newItemWidth * (stageItems.length - visibleItems));
    if (currentPosition < newMaxPosition) currentPosition = newMaxPosition;
    if (currentPosition > 0) currentPosition = 0;

    moveCarousel();
  });
});
