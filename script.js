// 1. Theme Toggle
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
    const icon = themeBtn.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    let isDark = savedTheme === 'dark';

    // Apply initial state
    // Apply initial state
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fa-solid fa-moon'; // Dark mode -> Show Moon representing current state
    } else {
        icon.className = 'fa-solid fa-sun'; // Light mode -> Show Sun
    }

    themeBtn.addEventListener('click', () => {
        isDark = !isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// 1.5 Language Toggle
const langSelect = document.getElementById('langSelect');
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.skills': 'Skills',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        'badge.available': 'Available for Work',
        'hero.subtitlePrefix': 'I am a',
        'hero.bio': 'I create detailed 3D worlds, characters, and assets for games and film. I turn concept art into realistic 3D models with soul.',
        'hero.ctaPrimary': 'My Works',
        'hero.ctaSecondary': 'Contact Me',
        'skills.heading': 'Tools',
        'projects.heading': 'Latest Work',
        'projects.view': 'View',
        'projects.card1.desc': 'High-poly character sculpting with texturing and rigging.',
        'projects.card2.desc': 'Game environment in Unreal Engine 5 with dynamic lighting.',
        'projects.card3.desc': 'Collection of weapons and mechanical props for a shooter.',
        'stats.years': 'Years of experience',
        'stats.models': 'Models created',
        'stats.projects': 'Game projects',
        'contact.heading': 'Get in touch',
        'contact.title': "Let's build something great!",
        'contact.subtitle': "I'm open to freelance and studio collaboration.",
        'form.nameLabel': 'Your Name',
        'form.emailLabel': 'Email',
        'form.messageLabel': 'Message',
        'form.namePlaceholder': 'John Doe',
        'form.emailPlaceholder': 'ivan@example.com',
        'form.messagePlaceholder': 'Tell me about your project...',
        'form.submit': 'Send',
        'form.sending': 'Sending...',
        'form.sent': 'Sent! ✅',
        'footer.role': '3D Artist & Designer.',
        'react.badge': 'React Ready',
        'character.subtitle': 'Game-ready Character Model',
        'character.aboutHeading': 'Project Overview',
        'character.description': 'This character was created for the "Cyberpunk 2077" challenge. The goal was to build an optimized futuristic samurai model while keeping traditional Japanese motifs in the armor design.',
        'character.workflowHeading': 'Workflow:',
        'character.workflow1': 'High-poly sculpting in',
        'character.workflow2': 'Retopology and UV unwrap in',
        'character.workflow3': 'Baking maps and texturing in',
        'character.workflow4': 'Rendered in',
        'character.cta': 'View on ArtStation',
        'environment.subtitle': 'Real-time Environment in UE5',
        'environment.aboutHeading': 'Project Overview',
        'environment.description': 'A full game location created in Unreal Engine 5. The main focus was lighting (Lumen) and building modular assets for the outpost.',
        'environment.detailsHeading': 'Details:',
        'environment.detail1': 'Using Nanite for high detail.',
        'environment.detail2': 'Dynamic lighting setup and post-processing.',
        'environment.detail3': 'Creating a Material Master for flexible surface tuning.',
        'environment.cta': 'Flythrough Video (YouTube)',
        'props.subtitle': 'Weapons & Gadgets',
        'props.aboutHeading': 'Project Overview',
        'props.description': 'A prop set for a first-person shooter. Includes an assault rifle, a pistol, and a sci-fi grenade. All models have proper deformation topology and optimized UV packing.',
        'props.techHeading': 'Technical Specs:',
        'props.tag1': 'Polycount: 15k-25k tris',
        'props.tag2': '4K Textures',
        'props.tag3': 'PBR Workflow',
        'props.cta': 'Sketchfab 3D View',
        'ecommerce.subtitle': 'Full-featured online store',
        'ecommerce.aboutHeading': 'About the project',
        'ecommerce.description1': 'ModernShop is a scalable e-commerce platform designed to deliver the best user experience. It is built on the MERN stack (MongoDB, Express, React, Node.js) and provides fast page loads, secure payments, and convenient catalog management.',
        'ecommerce.description2': 'The goal was to create a universal solution for small and medium businesses that lets you launch an online store in minutes.',
        'ecommerce.featuresHeading': 'Key features:',
        'ecommerce.feature1.title': 'Cart & Checkout',
        'ecommerce.feature1.desc': 'Fully functional cart with state persistence and step-by-step checkout.',
        'ecommerce.feature2.title': 'Admin Panel',
        'ecommerce.feature2.desc': 'Dashboard to manage products, categories, orders, and users.',
        'ecommerce.feature3.title': 'Payments',
        'ecommerce.feature3.desc': 'Stripe and PayPal integration for secure transactions.',
        'ecommerce.feature4.title': 'Reviews',
        'ecommerce.feature4.desc': 'Rating and review system for each product.',
        'ecommerce.stackHeading': 'Tech stack:',
        'ecommerce.stack1': 'React.js / Redux Toolkit',
        'ecommerce.stack2': 'Node.js / Express',
        'ecommerce.stack3': 'MongoDB / Mongoose',
        'ecommerce.stack4': 'Tailwind CSS',
        'ecommerce.stack5': 'Docker',
        'ecommerce.stack6': 'AWS S3',
        'ecommerce.ctaDemo': 'Open Demo',
        'ecommerce.ctaCode': 'GitHub Code',
        'finance.subtitle': 'Personal finance dashboard',
        'finance.aboutHeading': 'About the project',
        'finance.description1': 'FinanceFlow is an intuitive tool for personal financial planning. It helps users take control of spending by analyzing data in real time.',
        'finance.description2': 'With interactive charts and smart categories, you can see the full picture of your finances in seconds.',
        'finance.featuresHeading': 'Features:',
        'finance.feature1.title': 'Analytics',
        'finance.feature1.desc': 'Detailed spending reports by month/year.',
        'finance.feature2.title': 'Budgeting',
        'finance.feature2.desc': 'Set limits for different categories.',
        'finance.feature3.title': 'Export',
        'finance.feature3.desc': 'Save reports in PDF and CSV formats.',
        'finance.stackHeading': 'Technologies used:',
        'finance.stack1': 'React.js: For building a fast UI.',
        'finance.stack2': 'Chart.js / D3.js: For data visualization.',
        'finance.stack3': 'Firebase: Authentication and Realtime database.',
        'finance.ctaTry': 'Try it',
        'finance.ctaCode': 'GitHub',
        'music.subtitle': 'Your music always with you',
        'music.aboutHeading': 'About the project',
        'music.description1': 'BeatWave is a modern music streaming service. The main idea is to deliver a seamless listening experience with real-time audio visualization.',
        'music.quote': '"Music is the shorthand of emotion." - This project is made with love for sound.',
        'music.featuresHeading': 'Features:',
        'music.feature1.title': 'Smart Player:',
        'music.feature1.desc': 'Queue support, shuffle, repeat, and gapless playback.',
        'music.feature2.title': 'Audio Visualization:',
        'music.feature2.desc': 'Using Web Audio API to render frequencies in real time on Canvas.',
        'music.feature3.title': 'PWA Support:',
        'music.feature3.desc': 'Installable as a mobile app.',
        'music.stackHeading': 'Under the hood:',
        'music.tag1': 'Vue.js 3',
        'music.tag2': 'Pinia State',
        'music.tag3': 'Web Audio API',
        'music.tag4': 'Node.js backend',
        'music.ctaListen': 'Listen',
        'music.ctaCode': 'GitHub'
    },
    pl: {
        'nav.home': 'Start',
        'nav.skills': 'Umiejętności',
        'nav.projects': 'Projekty',
        'nav.contact': 'Kontakt',
        'badge.available': 'Dostępny do pracy',
        'hero.subtitlePrefix': 'Jestem',
        'hero.bio': 'Tworzę dopracowane światy 3D, postacie i assety do gier oraz filmu. Zamieniam concept arty w realistyczne modele 3D z duszą.',
        'hero.ctaPrimary': 'Moje prace',
        'hero.ctaSecondary': 'Napisz do mnie',
        'skills.heading': 'Narzędzia',
        'projects.heading': 'Ostatnie prace',
        'projects.view': 'Zobacz',
        'projects.card1.desc': 'High-poly rzeźba postaci z teksturowaniem i riggingiem.',
        'projects.card2.desc': 'Środowisko gry w Unreal Engine 5 z dynamicznym oświetleniem.',
        'projects.card3.desc': 'Zbiór broni i mechanicznych rekwizytów do shootera.',
        'stats.years': 'Lat doświadczenia',
        'stats.models': 'Stworzonych modeli',
        'stats.projects': 'Projektów gier',
        'contact.heading': 'Skontaktuj się',
        'contact.title': 'Stwórzmy coś świetnego!',
        'contact.subtitle': 'Jestem otwarty na freelance i współpracę ze studiami.',
        'form.nameLabel': 'Twoje imię',
        'form.emailLabel': 'Email',
        'form.messageLabel': 'Wiadomość',
        'form.namePlaceholder': 'Jan Kowalski',
        'form.emailPlaceholder': 'ivan@example.com',
        'form.messagePlaceholder': 'Opowiedz o swoim projekcie...',
        'form.submit': 'Wyślij',
        'form.sending': 'Wysyłanie...',
        'form.sent': 'Wysłano! ✅',
        'footer.role': 'Artysta 3D i projektant.',
        'react.badge': 'React Gotowy',
        'character.subtitle': 'Model postaci gotowy do gry',
        'character.aboutHeading': 'Opis projektu',
        'character.description': 'Ta postać powstała w ramach wyzwania "Cyberpunk 2077". Celem było stworzenie zoptymalizowanego modelu futurystycznego samuraja, zachowując tradycyjne japońskie motywy w projekcie zbroi.',
        'character.workflowHeading': 'Workflow:',
        'character.workflow1': 'Rzeźba high-poly w',
        'character.workflow2': 'Retopologia i UV unwrap w',
        'character.workflow3': 'Wypalanie map i teksturowanie w',
        'character.workflow4': 'Render w',
        'character.cta': 'Zobacz na ArtStation',
        'environment.subtitle': 'Środowisko w czasie rzeczywistym w UE5',
        'environment.aboutHeading': 'Opis projektu',
        'environment.description': 'Pełnoprawna lokacja gry stworzona w Unreal Engine 5. Główny nacisk położono na oświetlenie (Lumen) i modułowe assety do budowy bazy.',
        'environment.detailsHeading': 'Szczegóły:',
        'environment.detail1': 'Wykorzystanie Nanite dla wysokiej szczegółowości.',
        'environment.detail2': 'Konfiguracja dynamicznego oświetlenia i post-processingu.',
        'environment.detail3': 'Stworzenie Material Master do elastycznego ustawiania powierzchni.',
        'environment.cta': 'Przelot wideo (YouTube)',
        'props.subtitle': 'Broń i gadżety',
        'props.aboutHeading': 'Opis projektu',
        'props.description': 'Zestaw rekwizytów do strzelanki FPP. Zawiera karabin szturmowy, pistolet i granat sci-fi. Wszystkie modele mają poprawną siatkę do deformacji i zoptymalizowany UV-pack.',
        'props.techHeading': 'Specyfikacja techniczna:',
        'props.tag1': 'Polycount: 15k-25k tris',
        'props.tag2': 'Tekstury 4K',
        'props.tag3': 'Workflow PBR',
        'props.cta': 'Podgląd 3D Sketchfab',
        'ecommerce.subtitle': 'Pełnofunkcyjny sklep internetowy',
        'ecommerce.aboutHeading': 'O projekcie',
        'ecommerce.description1': 'ModernShop to skalowalna platforma e-commerce zaprojektowana z myślą o najlepszym doświadczeniu użytkownika. Zbudowana na stosie MERN (MongoDB, Express, React, Node.js) zapewnia szybkie ładowanie stron, bezpieczne płatności i wygodne zarządzanie katalogiem.',
        'ecommerce.description2': 'Celem projektu było stworzenie uniwersalnego rozwiązania dla małych i średnich firm, które pozwala uruchomić sklep online w kilka minut.',
        'ecommerce.featuresHeading': 'Główne funkcje:',
        'ecommerce.feature1.title': 'Koszyk i Checkout',
        'ecommerce.feature1.desc': 'W pełni funkcjonalny koszyk z zapisem stanu i krokowym procesem zamówienia.',
        'ecommerce.feature2.title': 'Panel administracyjny',
        'ecommerce.feature2.desc': 'Dashboard do zarządzania produktami, kategoriami, zamówieniami i użytkownikami.',
        'ecommerce.feature3.title': 'Płatności',
        'ecommerce.feature3.desc': 'Integracja Stripe i PayPal dla bezpiecznych transakcji.',
        'ecommerce.feature4.title': 'Opinie',
        'ecommerce.feature4.desc': 'System ocen i komentarzy dla każdego produktu.',
        'ecommerce.stackHeading': 'Stos technologiczny:',
        'ecommerce.stack1': 'React.js / Redux Toolkit',
        'ecommerce.stack2': 'Node.js / Express',
        'ecommerce.stack3': 'MongoDB / Mongoose',
        'ecommerce.stack4': 'Tailwind CSS',
        'ecommerce.stack5': 'Docker',
        'ecommerce.stack6': 'AWS S3',
        'ecommerce.ctaDemo': 'Otwórz demo',
        'ecommerce.ctaCode': 'Kod na GitHub',
        'finance.subtitle': 'Panel do zarządzania finansami osobistymi',
        'finance.aboutHeading': 'O projekcie',
        'finance.description1': 'FinanceFlow to intuicyjne narzędzie do osobistego planowania finansów. Pomaga użytkownikom przejąć kontrolę nad wydatkami, analizując dane w czasie rzeczywistym.',
        'finance.description2': 'Dzięki interaktywnym wykresom i inteligentnym kategoriom możesz zobaczyć pełny obraz swoich finansów w kilka sekund.',
        'finance.featuresHeading': 'Możliwości:',
        'finance.feature1.title': 'Analityka',
        'finance.feature1.desc': 'Szczegółowe raporty wydatków za miesiąc/rok.',
        'finance.feature2.title': 'Budżetowanie',
        'finance.feature2.desc': 'Ustawianie limitów dla różnych kategorii.',
        'finance.feature3.title': 'Eksport',
        'finance.feature3.desc': 'Zapisywanie raportów w formatach PDF i CSV.',
        'finance.stackHeading': 'Wykorzystane technologie:',
        'finance.stack1': 'React.js: Do tworzenia szybkiego UI.',
        'finance.stack2': 'Chart.js / D3.js: Do wizualizacji danych.',
        'finance.stack3': 'Firebase: Uwierzytelnianie i baza Realtime.',
        'finance.ctaTry': 'Wypróbuj',
        'finance.ctaCode': 'GitHub',
        'music.subtitle': 'Twoja muzyka zawsze z Tobą',
        'music.aboutHeading': 'O projekcie',
        'music.description1': 'BeatWave to nowoczesny serwis streamingowy. Główna idea to zapewnienie płynnego słuchania z możliwością wizualizacji dźwięku w czasie rzeczywistym.',
        'music.quote': '"Muzyka to stenogram emocji." - Ten projekt powstał z miłości do dźwięku.',
        'music.featuresHeading': 'Funkcjonalność:',
        'music.feature1.title': 'Inteligentny odtwarzacz:',
        'music.feature1.desc': 'Obsługa kolejki, shuffle, repeat oraz gapless playback.',
        'music.feature2.title': 'Wizualizacja audio:',
        'music.feature2.desc': 'Wykorzystanie Web Audio API do renderowania częstotliwości w czasie rzeczywistym na Canvas.',
        'music.feature3.title': 'Wsparcie PWA:',
        'music.feature3.desc': 'Możliwość instalacji jako aplikacja mobilna.',
        'music.stackHeading': 'Pod maską:',
        'music.tag1': 'Vue.js 3',
        'music.tag2': 'Pinia State',
        'music.tag3': 'Web Audio API',
        'music.tag4': 'Node.js backend',
        'music.ctaListen': 'Słuchaj',
        'music.ctaCode': 'GitHub'
    },
    uk: {
        'nav.home': 'Головна',
        'nav.skills': 'Навички',
        'nav.projects': 'Проєкти',
        'nav.contact': 'Контакти',
        'badge.available': 'Відкритий до роботи',
        'hero.subtitlePrefix': 'Я',
        'hero.bio': 'Створюю деталізовані 3D світи, персонажів та асети для ігор і кіно. Перетворюю концепт-арти на реалістичні тривимірні моделі з душею.',
        'hero.ctaPrimary': 'Мої Роботи',
        'hero.ctaSecondary': "Зв'язатись",
        'skills.heading': 'Інструментарій',
        'projects.heading': 'Останні Роботи',
        'projects.view': 'Переглянути',
        'projects.card1.desc': 'High-poly скульптинг персонажа з текстуруванням та ріггінгом.',
        'projects.card2.desc': 'Ігрове оточення на Unreal Engine 5 з динамічним освітленням.',
        'projects.card3.desc': 'Колекція зброї та механічних елементів для шутеру.',
        'stats.years': 'Років досвіду',
        'stats.models': 'Моделей створено',
        'stats.projects': 'Ігрових проєктів',
        'contact.heading': "Зв'язатись зі мною",
        'contact.title': 'Давайте створимо щось круте!',
        'contact.subtitle': 'Я відкритий до фрілансу та співпраці зі студіями.',
        'form.nameLabel': "Ваше Ім'я",
        'form.emailLabel': 'Email',
        'form.messageLabel': 'Повідомлення',
        'form.namePlaceholder': 'Іван Іванов',
        'form.emailPlaceholder': 'ivan@example.com',
        'form.messagePlaceholder': 'Розкажіть про ваш проєкт...',
        'form.submit': 'Надіслати',
        'form.sending': 'Надсилання...',
        'form.sent': 'Надіслано! ✅',
        'footer.role': '3D художник і дизайнер.',
        'react.badge': 'React Готовий',
        'character.subtitle': 'Готова до гри модель персонажа',
        'character.aboutHeading': 'Опис проєкту',
        'character.description': 'Цей персонаж був створений в рамках челленджу "Cyberpunk 2077". Завданням було створити оптимізовану модель самурая майбутнього, зберігаючи традиційні японські мотиви в дизайні броні.',
        'character.workflowHeading': 'Воркфлоу:',
        'character.workflow1': 'High-poly скульптинг в',
        'character.workflow2': 'Ретопологія та UV-розгортка в',
        'character.workflow3': 'Запікання карт та текстурування в',
        'character.workflow4': 'Рендер в',
        'character.cta': 'Подивитись на ArtStation',
        'environment.subtitle': 'Real-time оточення в UE5',
        'environment.aboutHeading': 'Опис проєкту',
        'environment.description': 'Повноцінна ігрова локація, створена на Unreal Engine 5. Основний фокус був на роботі з освітленням (Lumen) та створенні модульних асетів для побудови бази.',
        'environment.detailsHeading': 'Деталі:',
        'environment.detail1': 'Використання Nanite для високої деталізації.',
        'environment.detail2': 'Налаштування динамічного освітлення та пост-процесингу.',
        'environment.detail3': 'Створення Material Master для гнучкого налаштування поверхонь.',
        'environment.cta': 'Відео-проліт (YouTube)',
        'props.subtitle': 'Зброя та гаджети',
        'props.aboutHeading': 'Опис проєкту',
        'props.description': 'Набір пропсів для шутеру від першої особи. Включає в себе штурмову гвинтівку, пістолет та sci-fi гранату. Всі моделі мають правильну сітку для деформації та оптимізований UV-pack.',
        'props.techHeading': 'Технічні характеристики:',
        'props.tag1': 'Polycount: 15k-25k tris',
        'props.tag2': '4K Textures',
        'props.tag3': 'PBR Workflow',
        'props.cta': 'Sketchfab 3D View',
        'ecommerce.subtitle': 'Повнофункціональний інтернет-магазин',
        'ecommerce.aboutHeading': 'Про проєкт',
        'ecommerce.description1': 'ModernShop - це масштабована платформа електронної комерції, розроблена для забезпечення найкращого користувацького досвіду. Вона побудована на MERN стеку (MongoDB, Express, React, Node.js) і забезпечує швидке завантаження сторінок, безпечні платежі та зручне керування каталогом.',
        'ecommerce.description2': 'Метою проекту було створення універсального рішення для малого та середнього бізнесу, яке дозволяє запустити онлайн-магазин за лічені хвилини.',
        'ecommerce.featuresHeading': 'Основний функціонал:',
        'ecommerce.feature1.title': 'Кошик та Checkout',
        'ecommerce.feature1.desc': 'Повністю функціональний кошик з збереженням стану та покроковим оформленням замовлення.',
        'ecommerce.feature2.title': 'Адмін Панель',
        'ecommerce.feature2.desc': 'Дашборд для керування товарами, категоріями, замовленнями та користувачами.',
        'ecommerce.feature3.title': 'Платежі',
        'ecommerce.feature3.desc': 'Інтеграція Stripe та PayPal для безпечної обробки транзакцій.',
        'ecommerce.feature4.title': 'Відгуки',
        'ecommerce.feature4.desc': 'Система рейтингів та коментарів для кожного товару.',
        'ecommerce.stackHeading': 'Технологічний стек:',
        'ecommerce.stack1': 'React.js / Redux Toolkit',
        'ecommerce.stack2': 'Node.js / Express',
        'ecommerce.stack3': 'MongoDB / Mongoose',
        'ecommerce.stack4': 'Tailwind CSS',
        'ecommerce.stack5': 'Docker',
        'ecommerce.stack6': 'AWS S3',
        'ecommerce.ctaDemo': 'Відкрити Демо',
        'ecommerce.ctaCode': 'Код на GitHub',
        'finance.subtitle': 'Інструмент для керування особистими фінансами',
        'finance.aboutHeading': 'Про проєкт',
        'finance.description1': 'FinanceFlow - це інтуїтивний інструмент для особистого фінансового планування. Він допомагає користувачам взяти під контроль свої витрати, аналізуючи дані в реальному часі.',
        'finance.description2': 'Завдяки інтерактивним графікам та розумним категоріям, ви можете побачити повну картину своїх фінансів за лічені секунди.',
        'finance.featuresHeading': 'Можливості:',
        'finance.feature1.title': 'Аналітика',
        'finance.feature1.desc': 'Детальні звіти по витратам за місяць/рік.',
        'finance.feature2.title': 'Бюджетування',
        'finance.feature2.desc': 'Встановлення лімітів для різних категорій.',
        'finance.feature3.title': 'Експорт',
        'finance.feature3.desc': 'Збереження звітів у PDF та CSV форматах.',
        'finance.stackHeading': 'Використані технології:',
        'finance.stack1': 'React.js: Для створення швидкого UI.',
        'finance.stack2': 'Chart.js / D3.js: Для візуалізації даних.',
        'finance.stack3': 'Firebase: Аутентифікація та база даних Realtime.',
        'finance.ctaTry': 'Спробувати',
        'finance.ctaCode': 'GitHub',
        'music.subtitle': 'Ваша музика завжди з вами',
        'music.aboutHeading': 'Про проєкт',
        'music.description1': 'BeatWave - це сучасний музичний стрімінговий сервіс. Головна ідея - надати користувачам безшовний досвід прослуховування музики з можливістю візуалізації звукових хвиль.',
        'music.quote': '"Музика — це стенограма емоцій." - Цей проєкт створений з любов\'ю до звуку.',
        'music.featuresHeading': 'Функціонал:',
        'music.feature1.title': 'Розумний Плеєр:',
        'music.feature1.desc': 'Підтримка черги відтворення, shuffle, repeat та gapless playback.',
        'music.feature2.title': 'Аудіо Візуалізація:',
        'music.feature2.desc': 'Використання Web Audio API для рендерингу частот у реальному часі на Canvas.',
        'music.feature3.title': 'PWA Support:',
        'music.feature3.desc': 'Можливість встановлення як додатка на мобільний телефон.',
        'music.stackHeading': 'Під капотом:',
        'music.tag1': 'Vue.js 3',
        'music.tag2': 'Pinia State',
        'music.tag3': 'Web Audio API',
        'music.tag4': 'Node.js backend',
        'music.ctaListen': 'Слухати',
        'music.ctaCode': 'GitHub'
    },
    ru: {
        'nav.home': 'Главная',
        'nav.skills': 'Навыки',
        'nav.projects': 'Проекты',
        'nav.contact': 'Контакты',
        'badge.available': 'Открыт к работе',
        'hero.subtitlePrefix': 'Я',
        'hero.bio': 'Создаю детализированные 3D миры, персонажей и ассеты для игр и кино. Превращаю концепт-арты в реалистичные 3D модели с душой.',
        'hero.ctaPrimary': 'Мои работы',
        'hero.ctaSecondary': 'Связаться',
        'skills.heading': 'Инструменты',
        'projects.heading': 'Последние работы',
        'projects.view': 'Смотреть',
        'projects.card1.desc': 'High-poly скульптинг персонажа с текстурированием и риггингом.',
        'projects.card2.desc': 'Игровое окружение на Unreal Engine 5 с динамическим освещением.',
        'projects.card3.desc': 'Коллекция оружия и механических элементов для шутера.',
        'stats.years': 'Лет опыта',
        'stats.models': 'Моделей создано',
        'stats.projects': 'Игровых проектов',
        'contact.heading': 'Связаться со мной',
        'contact.title': 'Давайте создадим что-то крутое!',
        'contact.subtitle': 'Я открыт к фрилансу и сотрудничеству со студиями.',
        'form.nameLabel': 'Ваше имя',
        'form.emailLabel': 'Email',
        'form.messageLabel': 'Сообщение',
        'form.namePlaceholder': 'Иван Иванов',
        'form.emailPlaceholder': 'ivan@example.com',
        'form.messagePlaceholder': 'Расскажите о вашем проекте...',
        'form.submit': 'Отправить',
        'form.sending': 'Отправка...',
        'form.sent': 'Отправлено! ✅',
        'footer.role': '3D художник и дизайнер.',
        'react.badge': 'React Готов',
        'character.subtitle': 'Готовая к игре модель персонажа',
        'character.aboutHeading': 'Описание проекта',
        'character.description': 'Этот персонаж был создан в рамках челленджа "Cyberpunk 2077". Задачей было создать оптимизированную модель самурая будущего, сохранив традиционные японские мотивы в дизайне брони.',
        'character.workflowHeading': 'Процесс:',
        'character.workflow1': 'High-poly скульптинг в',
        'character.workflow2': 'Ретопология и UV-развертка в',
        'character.workflow3': 'Запекание карт и текстурирование в',
        'character.workflow4': 'Рендер в',
        'character.cta': 'Посмотреть на ArtStation',
        'environment.subtitle': 'Real-time окружение в UE5',
        'environment.aboutHeading': 'Описание проекта',
        'environment.description': 'Полноценная игровая локация, созданная в Unreal Engine 5. Основной фокус был на освещении (Lumen) и создании модульных ассетов для базы.',
        'environment.detailsHeading': 'Детали:',
        'environment.detail1': 'Использование Nanite для высокой детализации.',
        'environment.detail2': 'Настройка динамического освещения и пост-процессинга.',
        'environment.detail3': 'Создание Material Master для гибкой настройки поверхностей.',
        'environment.cta': 'Видео-пролёт (YouTube)',
        'props.subtitle': 'Оружие и гаджеты',
        'props.aboutHeading': 'Описание проекта',
        'props.description': 'Набор пропсов для шутера от первого лица. Включает штурмовую винтовку, пистолет и sci-fi гранату. Все модели имеют правильную сетку для деформации и оптимизированный UV-pack.',
        'props.techHeading': 'Технические характеристики:',
        'props.tag1': 'Polycount: 15k-25k tris',
        'props.tag2': '4K Textures',
        'props.tag3': 'PBR Workflow',
        'props.cta': 'Просмотр 3D на Sketchfab',
        'ecommerce.subtitle': 'Полнофункциональный интернет-магазин',
        'ecommerce.aboutHeading': 'О проекте',
        'ecommerce.description1': 'ModernShop - масштабируемая платформа электронной коммерции, разработанная для лучшего пользовательского опыта. Построена на MERN стекe (MongoDB, Express, React, Node.js) и обеспечивает быструю загрузку страниц, безопасные платежи и удобное управление каталогом.',
        'ecommerce.description2': 'Цель проекта - создать универсальное решение для малого и среднего бизнеса, позволяющее запустить интернет-магазин за считанные минуты.',
        'ecommerce.featuresHeading': 'Основной функционал:',
        'ecommerce.feature1.title': 'Корзина и Checkout',
        'ecommerce.feature1.desc': 'Полнофункциональная корзина с сохранением состояния и пошаговым оформлением заказа.',
        'ecommerce.feature2.title': 'Админ-панель',
        'ecommerce.feature2.desc': 'Дашборд для управления товарами, категориями, заказами и пользователями.',
        'ecommerce.feature3.title': 'Платежи',
        'ecommerce.feature3.desc': 'Интеграция Stripe и PayPal для безопасных транзакций.',
        'ecommerce.feature4.title': 'Отзывы',
        'ecommerce.feature4.desc': 'Система рейтингов и комментариев для каждого товара.',
        'ecommerce.stackHeading': 'Технологический стек:',
        'ecommerce.stack1': 'React.js / Redux Toolkit',
        'ecommerce.stack2': 'Node.js / Express',
        'ecommerce.stack3': 'MongoDB / Mongoose',
        'ecommerce.stack4': 'Tailwind CSS',
        'ecommerce.stack5': 'Docker',
        'ecommerce.stack6': 'AWS S3',
        'ecommerce.ctaDemo': 'Открыть демо',
        'ecommerce.ctaCode': 'Код на GitHub',
        'finance.subtitle': 'Инструмент для управления личными финансами',
        'finance.aboutHeading': 'О проекте',
        'finance.description1': 'FinanceFlow - интуитивный инструмент для личного финансового планирования. Он помогает пользователям контролировать расходы, анализируя данные в реальном времени.',
        'finance.description2': 'Благодаря интерактивным графикам и умным категориям вы можете увидеть полную картину своих финансов за считанные секунды.',
        'finance.featuresHeading': 'Возможности:',
        'finance.feature1.title': 'Аналитика',
        'finance.feature1.desc': 'Подробные отчеты о расходах за месяц/год.',
        'finance.feature2.title': 'Бюджетирование',
        'finance.feature2.desc': 'Установка лимитов для разных категорий.',
        'finance.feature3.title': 'Экспорт',
        'finance.feature3.desc': 'Сохранение отчетов в форматах PDF и CSV.',
        'finance.stackHeading': 'Использованные технологии:',
        'finance.stack1': 'React.js: Для создания быстрого UI.',
        'finance.stack2': 'Chart.js / D3.js: Для визуализации данных.',
        'finance.stack3': 'Firebase: Аутентификация и база данных Realtime.',
        'finance.ctaTry': 'Попробовать',
        'finance.ctaCode': 'GitHub',
        'music.subtitle': 'Ваша музыка всегда с вами',
        'music.aboutHeading': 'О проекте',
        'music.description1': 'BeatWave - современный музыкальный стриминговый сервис. Главная идея - дать пользователям бесшовный опыт прослушивания музыки с визуализацией звуковых волн в реальном времени.',
        'music.quote': '"Музыка — это стенограмма эмоций." - Этот проект создан с любовью к звуку.',
        'music.featuresHeading': 'Функционал:',
        'music.feature1.title': 'Умный плеер:',
        'music.feature1.desc': 'Поддержка очереди, shuffle, repeat и gapless playback.',
        'music.feature2.title': 'Аудио визуализация:',
        'music.feature2.desc': 'Использование Web Audio API для рендеринга частот в реальном времени на Canvas.',
        'music.feature3.title': 'Поддержка PWA:',
        'music.feature3.desc': 'Возможность установки как мобильного приложения.',
        'music.stackHeading': 'Под капотом:',
        'music.tag1': 'Vue.js 3',
        'music.tag2': 'Pinia State',
        'music.tag3': 'Web Audio API',
        'music.tag4': 'Node.js backend',
        'music.ctaListen': 'Слушать',
        'music.ctaCode': 'GitHub'
    }
};
const typewriterWords = {
    en: ['3D Artist', 'Character Designer', 'Environment Artist'],
    pl: ['Artysta 3D', 'Projektant postaci', 'Artysta środowisk'],
    uk: ['3D Художник', 'Дизайнер персонажів', 'Художник оточення'],
    ru: ['3D художник', 'Дизайнер персонажей', 'Художник окружения']
};
const normalizeLang = (lang) => {
    const code = String(lang || '').toLowerCase();
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('pl')) return 'pl';
    if (code.startsWith('ru')) return 'ru';
    if (code.startsWith('uk') || code.startsWith('ua')) return 'uk';
    return 'uk';
};
const getInitialLang = () => {
    const stored = localStorage.getItem('lang');
    if (stored) {
        return normalizeLang(stored);
    }
    return normalizeLang(navigator.language || 'uk');
};
let currentLang = getInitialLang();
let updateTypewriterLanguage = null;
let reactRootInstance = null;
const t = (key) => {
    return (translations[currentLang] && translations[currentLang][key]) || translations.uk[key] || key;
};
const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const value = t(key);
        if (value) {
            el.textContent = value;
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = t(key);
        if (value) {
            el.setAttribute('placeholder', value);
        }
    });
};
const renderReactBadge = () => {
    const reactRoot = document.getElementById('react-root');
    if (!reactRoot || !window.React || !window.ReactDOM) {
        return;
    }
    const dot = React.createElement('span', { className: 'react-badge__dot' });
    const text = React.createElement('span', { className: 'react-badge__text' }, t('react.badge'));
    const pill = React.createElement('div', { className: 'react-badge__pill' }, dot, text);

    if (ReactDOM.createRoot) {
        if (!reactRootInstance) {
            reactRootInstance = ReactDOM.createRoot(reactRoot);
        }
        reactRootInstance.render(pill);
    } else if (ReactDOM.render) {
        ReactDOM.render(pill, reactRoot);
    }
};

// 8. Live Status React Component
const LiveStatusWidget = () => {
    const [index, setIndex] = React.useState(0);
    const statuses = [
        { text: 'Available for Work', icon: 'fa-briefcase' },
        { text: 'Based in Poland', icon: 'fa-location-dot' },
        { text: '3D Artist', icon: 'fa-cube' }
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % statuses.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const current = statuses[index];

    return React.createElement(
        'div',
        { className: 'badge fade-in', key: index }, // key triggers animation
        React.createElement('i', { className: `fa-solid ${current.icon}`, style: { marginRight: '8px' } }),
        current.text
    );
};

const renderLiveStatus = () => {
    const rootEl = document.getElementById('react-status-root');
    if (!rootEl) return;

    if (ReactDOM.createRoot) {
        ReactDOM.createRoot(rootEl).render(React.createElement(LiveStatusWidget));
    }
};

// Initialize React components
window.addEventListener('load', () => {
    renderLiveStatus();
    renderReactBadge();
});
const setLanguage = (lang) => {
    currentLang = normalizeLang(lang);
    localStorage.setItem('lang', currentLang);
    document.documentElement.setAttribute('lang', currentLang);
    if (langSelect) {
        langSelect.value = currentLang;
    }
    applyTranslations();
    if (updateTypewriterLanguage) {
        updateTypewriterLanguage(currentLang);
    }
    renderReactBadge();
};
if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}
setLanguage(currentLang);

// 2. Typewriter Effect
const typeTarget = document.getElementById('typewriter');
if (typeTarget) {
    let words = typewriterWords[currentLang] || typewriterWords.uk;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId = null;

    const type = () => {
        const currentWord = words[wordIndex] || '';

        if (isDeleting) {
            typeTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Wait at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        timeoutId = setTimeout(type, typeSpeed);
    };

    const resetTypewriter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        type();
    };

    updateTypewriterLanguage = (lang) => {
        words = typewriterWords[lang] || typewriterWords.uk;
        resetTypewriter();
    };

    resetTypewriter();
}

// 3. Navbar Scroll Effect (rAF throttled)
const nav = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateActiveLink = (scrollY) => {
    if (!sections.length) {
        return;
    }

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id') || current;
        }
    });

    navLinks.forEach(link => {
        // Only update if it's an internal link
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            link.classList.remove('active');
            if (current && href === `#${current}`) {
                link.classList.add('active');
            }
        }
    });
};

// Mobile menu toggle
const menuBtn = document.getElementById('menuToggle');
if (menuBtn && nav) {
    const closeMenu = () => nav.classList.remove('open');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// 4. Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Animate progress bars if inside skills section
            if (entry.target.querySelector('.skill-progress')) {
                const bar = entry.target.querySelector('.skill-progress');
                bar.style.width = bar.getAttribute('data-width');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 5. Form Submission (Mock)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;

        if (contactForm.hasAttribute('data-netlify')) {
            btn.textContent = t('form.sending');
            btn.style.background = '#10b981'; // Success Green
            return;
        }

        e.preventDefault();
        btn.textContent = t('form.sending');
        btn.style.background = '#10b981'; // Success Green

        setTimeout(() => {
            btn.textContent = t('form.sent');
            e.target.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; // Check CSS for reset color or usage
                btn.removeAttribute('style');
                btn.style.width = '100%'; // restore width
            }, 3000);
        }, 1500);
    });
}

// 6. Background Scroll Effect (rAF throttled)
const shapes = document.querySelectorAll('.ambient-shape');
let latestScrollY = window.scrollY;
let scrollTicking = false;

const handleScroll = () => {
    scrollTicking = false;
    const scrolled = latestScrollY;

    if (nav) {
        if (scrolled > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    updateActiveLink(scrolled);

    if (shapes.length > 0 && !prefersReducedMotion) {
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            const x = Math.sin(scrolled * 0.002 + index) * 50;
            const y = scrolled * speed * 0.5;
            const rotation = scrolled * 0.1 * (index % 2 === 0 ? 1 : -1);

            shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        });
    }
};

const onScroll = () => {
    latestScrollY = window.scrollY;
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(handleScroll);
    }
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
    latestScrollY = window.scrollY;
    requestAnimationFrame(handleScroll);
});

// 7. Custom Cursor Follow (Removed)

// 9. Projects Carousel Logic
const track = document.querySelector('.carousel-track');
const container = document.querySelector('.carousel-track-container');

if (track && container) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');

    let currentSlideIndex = 1; // Start at 2nd item (center in 3 items)

    const updateSlidePosition = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const containerWidth = container.getBoundingClientRect().width;

        // Perfect centering: position the active slide so its center aligns with container center
        // Formula: move left by (currentIndex * slideWidth), then adjust by half container minus half slide
        const offset = (containerWidth / 2) - (slideWidth / 2);
        const newTranslateX = -(currentSlideIndex * slideWidth) + offset;

        track.style.transform = `translateX(${newTranslateX}px)`;

        // Update active class
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active-center');
            } else {
                slide.classList.remove('active-center');
            }
        });
    };

    const moveToSlide = (targetIndex) => {
        // Infinite Loop Logic (visual)
        if (targetIndex < 0) {
            targetIndex = slides.length - 1;
        } else if (targetIndex >= slides.length) {
            targetIndex = 0;
        }
        currentSlideIndex = targetIndex;
        updateSlidePosition();
    };

    nextButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex - 1);
    });

    // Initial setup
    // Wait a moment for layout to settle
    setTimeout(updateSlidePosition, 100);
    window.addEventListener('resize', updateSlidePosition);
}

// 7. Interactive Ambient Background (Proximity Light)
const ambientShapes = document.querySelectorAll('.ambient-shape');
let lightMouseX = 0;
let lightMouseY = 0;
let isLightFramePending = false;

const updateAmbientLight = () => {
    ambientShapes.forEach(shape => {
        const rect = shape.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(lightMouseX - centerX, lightMouseY - centerY);
        const maxDist = 900;
        const baseOpacity = 0.5;
        const maxOpacity = 1.0;

        if (distance < maxDist) {
            const proximity = 1 - (distance / maxDist);
            const intensity = Math.pow(proximity, 1.5);
            const extraOpacity = intensity * (maxOpacity - baseOpacity);
            shape.style.opacity = baseOpacity + extraOpacity;
        } else {
            shape.style.opacity = baseOpacity;
        }
    });
    isLightFramePending = false;
};

document.addEventListener('mousemove', (e) => {
    lightMouseX = e.clientX;
    lightMouseY = e.clientY;

    if (!isLightFramePending) {
        requestAnimationFrame(updateAmbientLight);
        isLightFramePending = true;
    }
});
