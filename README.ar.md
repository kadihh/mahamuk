# مهامك (Mahamuk)

> **مدير مهام محلي بالكامل — العربية أولاً** | Fully local, Arabic-first task manager

[![النسخة](https://img.shields.io/badge/version-0.1.0-blue)](#)
[![الترخيص](https://img.shields.io/badge/license-All%20rights%20reserved-blue)](#)
[![نرحّب بمساهماتكم](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)
[![المشكلات](https://img.shields.io/badge/issues-GitHub-blue)](https://github.com/zine-codes/mahamuk/issues)

[**English** — read this file in English](README.md)

مدير مهام بنمط كانبان، ثنائي اللغة (العربية أولاً / الإنجليزية)، يعمل محلياً بالكامل. لا يوجد خادم — كل البيانات تُحفظ في `localStorage` بمتصفّحك.

<!--
مكان لقطة الشاشة — استبدلها بلقطة حقيقية، مثال:

![لقطة شاشة مهامك](docs/screenshot.png)
-->

> 🚧 **نسخة مباشرة:** قريباً — سيُضاف الرابط بعد نشر التطبيق.

## المميزات

- **لوحة كانبان بأربعة أعمدة** — للقيام، قيد التنفيذ، محظور، مكتمل
- **دعم مشاريع متعددة** — التنقل بين المشاريع عبر تبويبات
- **نظام أولويات** — عالية / متوسطة / منخفضة مع شارات ملونة
- **سحب وإفلات** — نقل المهام بين الأعمدة
- **العربية أولاً (RTL)** — تخطيط كامل من اليمين لليسار، مع التبديل للإنجليزية في أي وقت
- **مظهر داكن / فاتح / تلقائي** — يتبع تفضيلات نظام التشغيل
- **استيراد / تصدير** — نسخ احتياطي واستعادة كل المشاريع في ملف JSON واحد
- **PWA** — قابل للتثبيت ويعمل دون اتصال (خدمة عامل + ملف manifest)
- **محلي وخاص 100%** — لا خادم، لا حسابات، لا تتبّع، لا بيانات تغادر متصفّحك

## التقنيات

| الطبقة | التقنية |
|---|---|
| واجهة المستخدم | React 19 |
| اللغة | TypeScript |
| البناء | Vite 8 |
| التنسيق | Tailwind CSS v4 (CSS-first) |
| الحالة | Zustand (محفوظة في localStorage) |
| الأيقونات | Lucide React |
| PWA | vite-plugin-pwa + Workbox |
| الفحص | oxlint |
| الاختبار | Vitest + jsdom |

## البدء

```bash
npm install
npm run dev
```

افتح [http://localhost:5173](http://localhost:5173) في متصفّحك.

## الأوامر

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير (HMR) |
| `npm run build` | فحص الأنواع + بناء الإنتاج |
| `npm run preview` | تشغيل نسخة الإنتاج |
| `npm run test` | تشغيل الاختبارات (Vitest) |
| `npm run lint` | الفحص البرمجي (oxlint) |
| `npm run licenses` | إعادة توليد `THIRD-PARTY-NOTICES.md` |

## بنية المشروع

```
src/
  App.tsx              — المكوّن الجذري (Shell + المزوّدات)
  bootstrap.ts         — إعداد ما قبل React (يمنع وميض المظهر/اللغة الخاطئ)
  main.tsx             — نقطة دخول React
  index.css            — إعداد Tailwind v4 (ألوان OKLCH، الوضع الداكن)
  components/
    AddTodo.tsx         — نموذج مهمة جديدة (النص + الأولوية)
    Board.tsx           — شبكة كانبان بأربعة أعمدة مع السحب والإفلات
    ErrorBoundary.tsx   — واجهة احتياطية عند الانهيار
    ProjectTabs.tsx     — تبويبات تبديل المشاريع
    TodoCard.tsx        — بطاقة مهمة قابلة للسحب (وضعا عرض/تعديل)
    Toolbar.tsx         — الشريط العلوي (ترتيب، استيراد/تصدير، مظهر، لغة)
  i18n/
    ar.json             — الترجمات العربية
    en.json             — الترجمات الإنجليزية
    LanguageProvider.tsx — سياق React للترجمة
    types.ts            — أنواع اللغة/الاتجاه/القاموس
  store/
    useStore.ts         — مخزن Zustand (الحالة + الإجراءات + الحفظ)
  test/
    setup.ts            — إعداد Vitest
  theme/
    useTheme.ts         — خطاف المظهر الداكن/الفاتح/التلقائي
```

## نموذج البيانات

- **المشروع** — `{ id, name, todos[] }`
- **المهمة** — `{ id, text, status, priority, createdAt }`
- **الحالة** — `todo | inprogress | blocked | done`
- **الأولوية** — `high | medium | low`

تُحفظ كل البيانات في `localStorage` تحت المفتاح `mahamok-store`.

## الخصوصية

مهامك **محلي أولاً بالتصميم**:

- لا خادم، لا حسابات، لا ملفات تعريف ارتباط، لا تحليلات.
- كل البيانات تبقى في `localStorage` بمتصفّحك ولا تُرسل أبداً.
- استخدم **تصدير** لإنشاء نسخة احتياطية من بياناتك كملف JSON، أو **استيراد** لاستعادتها على أي جهاز.

## المشكلات والتواصل

وجدت خللاً أو تريد طلب ميزة؟ افتح مشكلة على GitHub:

- **المشكلات:** <https://github.com/zine-codes/mahamuk/issues>
- **المستودع:** <https://github.com/zine-codes/mahamuk>

## الترخيص

كود هذا المستودع **بكل الحقوق محفوظة** (غير منشور على npm وغير مفتوح المصدر).

يعتمد هذا المشروع على مكتبات مفتوحة المصدر تابعة لجهات خارجية (React وZustand وLucide وWorkbox وغيرها). نصوص تراخيصها مجمّعة في **[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)**، وتُعاد توليدها بأمر `npm run licenses`. تُحتفظ تلك المكتبات بتراخيصها الخاصة.
