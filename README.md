# Zakharii Stroich — 3D Character & Sculpt Artist Portfolio

Мінімалістичне студійне портфоліо на **React + TypeScript + Vite + Tailwind CSS + Framer Motion**, налаштоване під деплой на **Netlify** з доменом [`3dartist.dev`](https://3dartist.dev/). Репозиторій: `Dragodar02/MySuperSite`.

---

## 1. Локальний запуск

```bash
npm install
npm run dev
```

Збірка та локальна перевірка production-білду:

```bash
npm run build
npm run preview
```

---

## 2. Активація контактної форми (Web3Forms за 2 хвилини)

Форма налаштована на відправку листів напряму на **`stroichzahar161218@gmail.com`** через Web3Forms (без бекенду):

1. Перейди на https://web3forms.com/
2. Введи `stroichzahar161218@gmail.com` і натисни **Create Access Key**.
3. Підтвердь лист на пошті та скопіюй отриманий **Access Key**.
4. **Для локальної розробки:** встав ключ у файл `.env`:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=твій_ключ_тут
   ```
5. **Для Netlify:** у налаштуваннях сайту відкрий **Site configuration → Environment variables** і додай:
   - **Key:** `VITE_WEB3FORMS_ACCESS_KEY`
   - **Value:** встав свій ключ.
   *(Альтернативно ключ можна вставити напряму в поле `web3formsAccessKey` у `src/data/portfolio.ts` — ключі Web3Forms публічні за дизайном).*

---

## 3. Як додавати свої 3D-рендери та проєкти

Увесь контент сайту зібраний в одному файлі: **`src/data/portfolio.ts`**.

1. Поклади рендери або відео (`.webp`, `.png`, `.jpg`, `.mp4`, `.webm`) у папку **`public/renders/`** (наприклад, `public/renders/demon-bust-beauty.webp`).
2. У `src/data/portfolio.ts` заміни `src: null` на відносний шлях:
   ```ts
   src: 'renders/demon-bust-beauty.webp',
   ```
   Утиліта `resolveAssetPath()` автоматично підставляє `import.meta.env.BASE_URL` (`/` на `3dartist.dev`), тому всі медіа коректно працюють і локально, і в продакшені.
3. Поки `src: null`, сайт автоматично рендерить студійний слот `<MediaSlot />`. Як тільки шлях вказано — відображається рендер/відео з повноекранним зумом (Lightbox).

---

## 4. Увімкнення соцмереж (ArtStation, LinkedIn, Instagram)

У файлі `src/data/portfolio.ts` у масиві `contactData.socials` встав свій URL і постав `enabled: true`:

```ts
{
  id: 'artstation',
  label: 'ARTSTATION',
  url: 'https://www.artstation.com/твій_нік',
  enabled: true,
}
```

---

## 5. Деплой на Netlify (`3dartist.dev`)

У проєкті вже налаштовано `base: '/'` у `vite.config.ts` та `netlify.toml` (`npm run build`, publish `dist`, Node 20). Сайт лежить у корені власного домену, не в `/MySuperSite/`.

1. Запуш код у гілку `main` репозиторію `https://github.com/Dragodar02/MySuperSite`.
2. Підключи цей репозиторій до існуючого Netlify-сайту, на якому вже налаштований домен `3dartist.dev`.
3. Додай змінну середовища `VITE_WEB3FORMS_ACCESS_KEY` (див. розділ 2).
4. Після деплою сайт буде доступний за адресою: `https://3dartist.dev/`
