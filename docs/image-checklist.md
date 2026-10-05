# قائمة الصور والوسائط

الحالة: **حقيقية** (تصوير معتمد للصالون أو أعماله) • **توضيحية** (مولّدة أو مرخّصة، لا تُعرض كأعمال منفذة) • **ناقصة**

كل الصور التوضيحية معرّفة في `src/lib/data/media.ts` مع النص البديل باللغتين، وكل صفحة تعرضها تُظهر ملاحظة «الصور توضيحية».

| المعرّف / الملف | مكان الاستخدام | الأبعاد | alt (ar) | alt (en) | الحالة |
|---|---|---|---|---|---|
| `media/hero.mp4` | الرئيسية، أعلى الصفحة | 1280×720، ‏12 ث، 1.4MB، دون صوت | — (زخرفي، `aria-hidden`) | — | **توضيحية** |
| `media/hero-poster.jpg` | صورة بديلة للفيديو | 1280×720 | — (زخرفي) | — | **توضيحية** (إطار من الفيديو) |
| `images/soso/logo-soso-384.webp` (الأصل: `assets/brand/logo-soso-original.png`) | الترويسة، التذييل، أيقونة الموقع | 384×384 للعرض، والأصل 1254×1254 بخلفية بيضاء | شعار سوسو – صالون نسائي | Soso Ladies Salon logo | **معتمد**. النسخة الشفافة معلّقة (P2) |
| `images/soso/service-facial.webp` | قسم الوجه والبشرة + خدماته | 1536×1024 | وضع قناع للعناية بالبشرة على وجه عميلة مسترخية | A skincare mask being applied to a relaxed client | **توضيحية** |
| `images/soso/service-permanent-makeup.webp` | المكياج الدائم | 1536×1024 | خبيرة ترسم شكل الحاجب لعميلة قبل المكياج الدائم | A specialist mapping a client’s brow for permanent makeup | **توضيحية** |
| `images/soso/service-hair.webp` | خدمات الشعر | 1536×1024 | تصفيف شعر طويل بالمجفف والفرشاة الدائرية | Long hair being blow-dried with a round brush | **توضيحية** |
| `images/soso/service-nails.webp` | خدمات الأظافر | 1536×1024 | طلاء أظافر بلون وردي هادئ | Nails being painted in a soft pink polish | **توضيحية** |
| `images/soso/service-henna.webp` | الحناء | 1536×1024 | نقش حناء زهري على ظاهر اليد | A floral henna design on the back of a hand | **توضيحية** |
| `images/soso/hero-home-service.webp` | الخدمة المنزلية (الرئيسية وصفحتها) | 1536×1024 | خبيرة تجميل تقدّم خدمة لعميلة في غرفة جلوس منزلية | A beautician attending to a client in a home living room | **توضيحية** |
| `images/soso/home-service-manicure.webp` | صفحة الخدمة المنزلية | 1536×1024 | خبيرة تعتني بأظافر عميلة في المنزل | A specialist giving a client a manicure at home | **توضيحية** |
| `images/soso/home-service-beauty-kit.webp` | صفحة الخدمة المنزلية | 1536×1024 | حقيبة أدوات تجميل عنابية مفتوحة فيها فُرش ومستحضرات | An open burgundy beauty kit with brushes and products | **توضيحية** |
| `images/soso/salon-interior-illustration.webp` | رأس صفحة الخدمات (أجواء) | 1536×1024 | صالون بمقاعد عنابية ومرايا مقوّسة بإطارات ذهبية | A salon with burgundy chairs and arched gold-framed mirrors | **توضيحية**. ممنوع استخدامها كصورة للمقر الحقيقي |
| salon-real-interior / exterior | عن الصالون، التواصل | 1600×1000 | — | — | **ناقصة** (صور حقيقية) |
| og-image | المشاركة الاجتماعية | 1200×630 | سوسو – صالون نسائي | Soso Ladies Salon | **ناقصة** (يمكن تصميمها من الشعار والصور التوضيحية) |
