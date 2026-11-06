# 🤖 AI Bahs Arena
To'rt suniy intellekt o'rtasida o'zaro bahs olib boradigan veb-ilova: **ChatGPT (GPT-4o), Gemini (1.5 Pro), Perplexity (Sonar Large)** va **Arena AI** bir-birini fikrini bahslashadi!

## 🚀 Xususiyatlar
- Bir vaqtning o'zida 4 ta AI dan javob olish
- Navbatma-navbat bahs bosqichlari - har bir AI boshqalarning javoblariga javob beradi
- Chiroyli, zamonaviy interfeys
- Har bir AI uchun alohida ustun va rang
- To'liq o'zbekcha interfeys
- Oson o'rnatiladi va ishlaydi

## 📦 O'rnatish va ishga tushirish

### 1. Kerakli dasturlar
- [Node.js](https://nodejs.org/) 18+ versiyasi o'rnatilgan bo'lishi kerak

### 2. API kalitlarni olish
Har bir AI uchun bepul API kalit olib kelishingiz kerak (har bir provayder bepul kredit beradi):
1. **OpenAI (ChatGPT)**: https://platform.openai.com/api-keys - ro'yxatdan o'ting va kalit yarating
2. **Google Gemini**: https://aistudio.google.com/app/apikey - "Create API key" tugmasini bosing
3. **Perplexity**: https://www.perplexity.ai/settings/api - ro'yxatdan o'ting va kalit oling

### 3. Loyihani sozlash
```bash
# Papkaga kiring
cd ai-arena

# Paketlarni o'rnating
npm install

# Muhit faylini nusxa ko'chiring
cp .env.example .env
```

`.env` faylini oching va yuqorida olgan API kalitlaringizni tegishli qatorlarga yozing:
```env
OPENAI_API_KEY=sizning_openai_kalitingiz
GEMINI_API_KEY=sizning_gemini_kalitingiz
PERPLEXITY_API_KEY=sizning_perplexity_kalitingiz
PORT=3000
```

### 4. Serverni ishga tushirish
```bash
npm start
```

Yoki o'zgarishlarni avtomatik kuzatuvchi rejimda:
```bash
npm run dev
```

Brauzeringizda **http://localhost:3000** manzilini oching va bahsni boshlang!

## 📤 GitHub ga qanday push qilish kerak
> ⚠️ MUHIM: Hech qachon `.env` faylini (API kalitlari bor) GitHub ga yuklamang! `.gitignore` fayli buni avtomatik oldini oladi.

### 1. GitHub da yangi repository yarating
- https://github.com/new manziliga kiring
- Repository nomini yozing (masalan: `ai-bahs-arena`)
- "Public" yoki "Private" ni tanlang
- "Initialize this repository with..." bo'limidagi belgilashlarni olib tashlang (bo'sh repo yarating)
- "Create repository" tugmasini bosing

### 2. Terminalda buyruqlarni bajaring
Loyiha papkasida turib quyidagi buyruqlarni ketma-ket yozing:

```bash
# Gitni ishga tushiring (faqat birinchi marta)
git init

# Barcha fayllarni tanlang
git add .

# Commit qiling
git commit -m "Initial commit: AI Bahs Arena tayyor"

# Asosiy branch nomini main ga o'zgartiring
git branch -M main

# GitHub dagi repo manzilini bog'lang (QUYIDAGI MANZILNI O'Z REPO MANZILINGIZGA ALMASHTIRING!)
git remote add origin https://github.com/sizning_username/ai-bahs-arena.git

# GitHub ga yuklang
git push -u origin main
```

Keyinchalik o'zgarishlar kiritganingizda quyidagi 3 ta buyruqni yozsangiz yetarli:
```bash
git add .
git commit -m "O'zgarish haqida qisqa xabar"
git push
```

### 3. Agar sizda hali Git o'rnatilmagan bo'lsa
- Windows: https://git-scm.com/download/win dan yuklab o'rnating
- Mac: Terminalda `xcode-select --install` buyrug'ini yozing
- Linux (Ubuntu/Debian): `sudo apt install git`

## 💻 Ishlatish
1. Brauzerda sahifa ochilgach, katta input maydoniga bahs mavzusini yozing
2. "⚔️ Bahsni boshlash" tugmasini bosing
3. Barcha AIlar o'z javobini bergach, "➡️ Keyingi bosqich" tugmasi paydo bo'ladi
4. Shu tugmani bosib, ular bir-birini javobiga javob berishini davom ettirishingiz mumkin
5. Istalgancha bosqich o'tkazishingiz mumkin!

## ⚠️ Diqqat qiling
- API kalitlaringizni hech kimga bermang va GitHub ga yuklamang
- Har bir API chaqiruvi provayderingizdagi kreditdan yechadi
- Bepul kreditlar tugagach, provayder hisobiga pul to'lashingiz kerak bo'ladi

## 🛠 Texnologiyalar
- **Backend**: Node.js + Express
- **Frontend**: Toza HTML, CSS va JavaScript (hech qanday framework kerak emas)
- AI SDKlar: OpenAI SDK, Google Generative AI SDK, Axios (Perplexity uchun)

## 📝 Litsenziya
MIT - istalgancha o'zgartirib, ishlatishingiz mumkin!
