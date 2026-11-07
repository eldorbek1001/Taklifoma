# Asadbek va Zaynab — HENNA PARTY taklifnomasi

Ivory, to‘q yashil va shampan oltin palitrasida yaratilgan, React + Vite asosidagi elektron taklifnoma. Loyiha Asadbek va Zaynabning HENNA PARTY oqshomiga sozlangan.

## 1. O‘rnatish va ishga tushirish

Node.js 18 yoki undan yangi versiyasini o‘rnating, so‘ng loyiha papkasida:

```bash
npm install
npm run dev
```

Terminalda ko‘rsatilgan mahalliy manzilni brauzerda oching. Ishlab chiqarish buildi:

```bash
npm run build
npm run preview
```

## 2. Ism, sana va manzilni almashtirish

Barcha taklifnoma ma’lumotlari `src/weddingConfig.js` faylida:

- Kuyov va kelin ismi, tadbir nomi, mehmonlarga murojaat matni.
- Sana `YYYY-MM-DD`, vaqt esa `HH:mm` ko‘rinishida.
- Vaqt mintaqasi `Asia/Tashkent`, UTC+05:00. Hisoblagich va taqvim voqeasi shu farqni hisobga oladi.
- To‘yxona nomi va manzili. Hozirgi manzil: Xorazm viloyati, Xiva shahri; to‘liq ko‘cha manzili berilmagan.
- `mapsUrl` maydoniga haqiqiy Google Maps havolasini yozing. Bo‘sh qoldirilsa, xarita tugmasi ko‘rinmaydi.
- `eventDurationMinutes` taqvimga qo‘shiladigan tadbir davomiyligini daqiqalarda belgilaydi. Hozirgi 180 daqiqa — faqat taqvim uchun namuna; kerakli davomiylikka almashtiring.
- Taklif vaqti uchun sana/soat mos kelmasa, hisoblagich va taqvim ma’lumotlari noto‘g‘ri son ko‘rsatmaydi.

## 3. Surat va musiqa

- Muqova suratining yo‘li `coverImage`, galereya izohlari, alt matnlari va surat yo‘llari `gallery` ro‘yxatida sozlanadi.
- Fayllarni `public/images/` ichiga joylang. Masalan, `public/images/cover.jpg` uchun konfiguratsiyada `/images/cover.jpg` yoziladi. Bo‘sh galereya yo‘llarida vaqtinchalik naqshli kartochkalar chiqadi.
- Fon musiqasini o‘zingiz foydalanish huquqiga ega bo‘lgan MP3 fayl sifatida `public/audio/wedding.mp3` manziliga joylang. MP3 fayllar `.gitignore` orqali GitHub’ga yuklashdan chiqarilgan; kerak bo‘lsa, foydalanish huquqingiz bo‘lgan musiqani serverga alohida joylang. Ovoz faqat konvert ochilganda yoki musiqa tugmasi bosilganda boshlashga urinadi. Fayl topilmasa, musiqa holati o‘chiq qoladi va sahifa ishlashda davom etadi.
- Open Graph matni va muqova rasmi ishga tushganda `weddingConfig.js` ma’lumotlari bilan yangilanadi. Saytni internetga joylaganda konfiguratsiyadagi `siteUrl` maydoniga haqiqiy HTTPS domenini kiriting; ijtimoiy tarmoq botlari uchun `index.html` ichidagi boshlang‘ich `og:title`, `og:description` va `og:image` metama’lumotlarini ham haqiqiy to‘liq URL bilan yangilang. Domen hozircha berilmagan.

## 4. Mehmon uchun shaxsiy havola

Havola oxiriga `guest` parametrini qo‘shing. Masalan:

```text
https://saytingiz.uz/?guest=Azizbek%20Shodmonov
```

Bo‘sh joy va o‘zbekcha belgilarni URL uchun kodlashda JavaScript `encodeURIComponent` dan foydalaning:

```js
const link = `${window.location.origin}/?guest=${encodeURIComponent('Azizbek Shodmonov')}`
```

Ism backend talab qilmasdan, havoladan oddiy matn sifatida olinadi. Parametr bo‘lmasa, “Qadrli mehmonimiz!” murojaati ko‘rinadi.

## 5. Taqvim

“Taqvimga qo‘shish” menyusi Google Calendar havolasini ochadi yoki Apple/Outlook uchun `.ics` faylini yuklab beradi. Voqea vaqti UTC+05:00 ga to‘g‘ri aylantiriladi. Mehmon tadbirni o‘z taqvimida saqlashni tasdiqlaydi.
