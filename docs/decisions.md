# سجل القرارات التقنية — Soso Ladies Salon

> آخر تحديث: 2026-10-05 (نهاية المرحلة 1). الإصدارات أدناه مثبّتة فعليًا ومُتحقق منها عبر `npm ls`.

## D1. نقطة البداية
- المستودع (`insight-option/sos-ladise-salon`) كان قالب Amplify Gen 2 الرسمي بنظام Pages Router و Next 14.2.10، مع مخطط `Todo` تجريبي بتفويض `publicApiKey`. لم تكن فيه تعديلات خاصة بسوسو ولا تعليمات مشروع (فقط README/CONTRIBUTING الافتراضيان).
- العمل في الفرع `feat/phase-1-foundation`. حُذف `pages/` و`styles/` وإعداد ESLint القديم، وانتقل المشروع إلى **App Router** تحت `src/`.
- **مجلد `amplify/` لم يُمس في المرحلة 1**، ومخطط `Todo` العام ما زال فيه. يُستبدل في المرحلة 2، ويجب ألا يُنشر قبل ذلك.

## D2. الإصدارات المثبّتة

| الحزمة | الإصدار | ملاحظة |
|---|---|---|
| Node.js | **24.21.0** (أحدث 24 LTS) | مثبّت من nodejs.org مع التحقق من SHA-256؛ مُثبّت في `.nvmrc` و`engines` |
| next | **16.3.8** | انظر D3 |
| react / react-dom | 19.3.0 | |
| typescript | **6.0.3** | لا يوجد 5.11 (كان خطأ في المرحلة 0). TS 7 غير مدعوم من typescript-eslint (`<6.1`) |
| next-intl | 4.14.9 | |
| eslint | **9.39.5** | ESLint 10 يكسر `eslint-plugin-react` المضمّن في `eslint-config-next`. يُرقّى عند دعمه |
| eslint-config-next | 16.3.8 | core-web-vitals + typescript + prettier |
| prettier | 3.9.9 | |
| vitest | 5.0.3 | |
| @aws-amplify/backend / backend-cli | 1.25.1 / 1.10.0 | للمرحلة 2 |

- **npm 11.19 لا يشغّل سكربتات التثبيت دون موافقة.** تُركت 8 حزم دون موافقة (esbuild، @swc/core، unrs-resolver، @parcel/watcher، core-js، @aws-amplify/hosting)، والبناء والاختبارات تعمل بدونها. تُراجع إن ظهر عطل.

## D3. Next.js 16 مع Amplify Hosting (قرار المالك: Next 16)
ما تحققت منه:
- `aws-amplify` يدعم Next 16 منذ 6.16.2، وأغلق المشرفون issue الدعم [amplify-js#14600](https://github.com/aws-amplify/amplify-js/issues/14600) في 2026-02-16.
- خلل التجميع في Amplify Hosting مع Next 16.1 وما بعده (روابط Turbopack الرمزية) أُغلق كمحلول في 2026-02-17: [amplify-hosting#4074](https://github.com/aws-amplify/amplify-hosting/issues/4074).
- `@aws-amplify/adapter-nextjs` 1.8.0 يقبل `next <17`.
- **لكن** صفحة وثائق Amplify Hosting الرسمية ما زالت تقول «Next.js versions 12 through 15».

**المخاطرة المتبقية:** لم يُجرَّب بناء فعلي على Amplify Hosting لأنه لا يوجد حساب AWS بعد. أول نشر تجريبي (بعد موافقتك) هو الاختبار الحاسم. الخطة البديلة: سكربت إزالة الروابط الرمزية المذكور في #4074، أو النزول إلى Next 15.

قيود Amplify Hosting المعروفة: لا Edge middleware، لا on-demand ISR، لا streaming. لذلك `proxy.ts` (بديل `middleware.ts` في Next 16) يعمل على Node، وحالات التحميل في الواجهة لا تعتمد على streaming.

## D4. i18n
- `next-intl` 4 بمسارات `/ar` و`/en`، و`localePrefix: 'always'`، والعربية افتراضية (`/` تحوّل إلى `/ar`).
- `lang`/`dir` على `<html>` في `src/app/[locale]/layout.tsx`، و`hreflang` + canonical لكل صفحة عبر `src/lib/seo.ts`.
- كل النصوص في `messages/ar.json` و`messages/en.json`، واختبار آلي يضمن تطابق المفاتيح.
- **الأرقام:** كل تنسيق يمر عبر `src/lib/format.ts`، والعربية تستخدم `ar-QA`، فتظهر الأرقام العربية-الهندية (٦٠ دقيقة، ١٠٠٫٠٠ ر.ق.) بشكل موحّد.

## D5. فصل البيانات عن الواجهة
- `src/lib/data/repository.ts` يعرّف واجهة `ContentRepository`، والمكونات لا تعرف مصدر البيانات.
- `DATA_SOURCE`: `demo` (سجلات `isDemo: true` + شريط «بيانات تجريبية»)، `empty` (شكل الموقع بلا بيانات معتمدة)، `amplify` (المرحلة 2).
- `scripts/check-env.mjs` يعمل قبل `next build` ويُفشل بناء الإنتاج إن كان `DATA_SOURCE` غير `amplify` أو كان `NEXT_PUBLIC_SITE_URL` غير https.
- بيئة المعاينة: `robots` = noindex.

## D6. الخلفية (Amplify Gen 2) — للمرحلة 2
- **Auth:** Cognito بمجموعتين `customer` و`admin`، وإضافة المستخدمة إلى `customer` عبر trigger `postConfirmation`.
- **Data:** وضع التفويض الافتراضي `userPool`، وقراءة المنشور للزائرات عبر identityPool (guest).
- **منطق الحجز في الخادم:** عمليات مخصصة (`a.mutation().handler(a.handler.function(fn))`). العميلة لا تنشئ `Booking` مباشرة.
- صلاحية `allow.resource(fn)` تُضبط على مستوى المخطط كله.

## D7. منع تأكيد موعدين متعارضين (للمرحلة 5)
- جدول `SlotLock(resourceId, bucketStart)` مع `TransactWriteItems` واحدة تشمل: `Put` شرطيًا لكل bucket (`attribute_not_exists`)، و`Update` للحجز بشرط `status = pending`، و`Put` لسجل `BookingEvent`. من بين ضغطتين متزامنتين تنجح واحدة فقط.
- **Idempotency:** سجل `IdempotencyKey(customerId#key)` يُكتب في المعاملة نفسها.
- في المرحلة 1: زر الإرسال يُعطَّل بعد أول ضغطة (اختُبر بالنقر المزدوج)، والإرسال نفسه تجريبي ولا يُنشئ شيئًا.

## D8. الوقت
- التخزين UTC، والعرض والحساب بتوقيت `Asia/Qatar` عبر `Intl` (`src/lib/time.ts`)، بلا افتراض إزاحة ثابتة. حدود منتصف الليل مختبرة.
- `src/lib/booking/demo-slots.ts` **مؤقت للمعاينة**: يحسب الفتحات من ساعات العمل والمدة ووقت الانتقال فقط. يُستبدل بمحرك الخادم في المرحلة 5.

## D9. التنسيق والوصول
- متغيرات CSS في `src/styles/tokens.css` (مطابقة لـ `docs/design-system.md`) + CSS Modules + خصائص منطقية (`inline-start`…).
- الخطوط: IBM Plex Sans Arabic / IBM Plex Sans عبر `next/font/google` (ترخيص OFL).
- الفيديو الافتتاحي: صامت ومتكرر، بصورة بديلة (poster)، وزر إيقاف/تشغيل دائم الظهور. لا يعمل تلقائيًا مع `prefers-reduced-motion`. فوقه طبقة تعتيم تضمن تباين النص الأبيض.
- أزرار الاختيار في الحجز من نوع toggle (`aria-pressed`) داخل `role="group"` مُعنون.

## D10. الاختبارات
- `npm run check` = typegen + tsc + eslint + prettier + vitest.
- فحص المعاينة (Playwright + Edge + axe) يعمل خارج المستودع حاليًا. يُنقل إلى المستودع كـ e2e في المرحلة 7.
