# بطاقة إجابات الحكام — صِمَام

سبع أسئلة. لكل سؤال: ليش يسأل · جوابك (إنجليزي تقوله + عربي تفهمه) · وش تضغط.
بلا جداول كود. الأرقام والمواد تبقى لأنها أدلة.

> بيانات محاكاة لأغراض الهاكاثون فقط

---

## 1. Show the core workflow actually running right now — not the slides or the video

**ليش يسأل:** يبي يشوف النظام حي، مو عرض ولا فيديو.

**جوابك (EN — قل هذا):**
> I will run scenario 2 now. Cancer patient. eGFR is 19.1. Dose is too high for Saudi rules. Node P stops the scan. Device returns 403 and LOCKED. The text explanation comes later. The stop is fixed code — not the AI model.

**تفهمه (AR):**
أشغّل السيناريو الثاني حياً. مريضة أورام، كليتها ضعيفة (19.1)، الجرعة أعلى من الحد الوطني. النظام يوقف الجهاز → 403. الشرح النصي بعد القرار. التوقيف من كود ثابت مو من النموذج.

**وش تضغط:**
1. وحدة التحكم → حمّل SC-02 → إرسال إلى الجهاز.
2. أظهر 403 و LOCKED.
3. إن سألوا عن الشرح: بعد القرار فقط.

---

## 2. Is any of this on real Saudi data, or is it all synthetic?

**ليش يسأل:** يبي يتأكد إنكم ما تستخدمون مرضى حقيقيين، وإن اللوائح حقيقية.

**جوابك (EN):**
> Patient records are 100% fake for the hackathon — every screen shows the notice. The FHIR link is a public test server. The Saudi law texts are real: checked records from MoH, SFDA, and SDAIA. Each cite opens the real document.

**تفهمه (AR):**
بيانات المرضى محاكاة 100٪ والتنبيه على كل شاشة. FHIR = خادم اختبار. نصوص اللوائح حقيقية من الوزارة وهيئة الغذاء والدواء وسدايا، والرابط يفتح الوثيقة نفسها.

**وش تضغط:**
1. أشر للتنبيه أعلى الشاشة.
2. قاعدة المعرفة → سجل مثل SFDA-MDS-G008-DRL مع الرابط.
3. إن سألوا عن FHIR: الموصّلات.

---

## 3. Show how a human can override the AI?

**ليش يسأل:** يبي يعرف إن الإنسان ما زال فوق الآلة — ومتى ما ينفع التجاوز.

**جوابك (EN):**
> On a clinical stop, we do not ban forever. A named doctor can accept with their name. Sending patient data abroad for marketing has no override — same name is refused and saved in the log.

**تفهمه (AR):**
في التوقيف الطبي نوقف حتى يعتمد طبيب باسمه. تصدير بيانات للتسويق خارج المملكة: لا تجاوز — يُرفض ويُسجَّل.

**وش تضغط:**
1. بعد SC-02 و 403: تجاوز وإطلاق → اسم الاستشاري → اعتماد.
2. أظهر في السجل: EXECUTED_UNDER_OVERRIDE.
3. على طلب بيانات بعد الرفض: حاول التجاوز → يُرفض.

---

## 4. Which specific Saudi policy — by name and clause — governs this decision?

**ليش يسأل:** يبي اسم نظام أو بروتوكول حقيقي، مو كلام عام عن «الامتثال».

**جوابك (EN):**
> We cite by fixed record id. SC-02: Royal Decree 60057 makes national dose limits law. Numbers from SFDA MDS-G008. Kidney-protection steps when eGFR under 30 from MoH Contrast Protocol 2021. Dose too high = from the law. Missing kidney steps = national protocol. We do not mix them. SC-03: PDPL articles 23, 1(11), 29.

**تفهمه (AR):**
الاستشهاد بمعرّف ثابت. SC-02: المرسوم 60057 للمستويات المرجعية، أرقام MDS-G008، الوقاية من بروتوكول الوزارة. تجاوز الجرعة من النظام؛ غياب الوقاية من البروتوكول — لا نخلط. SC-03: مواد حماية البيانات 23 و 1(11) و 29.

**وش تضغط:**
بعد أي قرار: بطاقات المراجع (الجهة · القسم · الرابط). افتح السجل في قاعدة المعرفة.

---

## 5. How does it perform in Arabic, on a paraphrased question?

**ليش يسأل:** يبي يعرف إن النظام يخدم العربية، مو إنجليزي بس.

**جوابك (EN):**
> Honest answer: the stop node does not read free chat. It reads a clear request. Arabic works on knowledge-base search by meaning — local multilingual model. The stop still cites a fixed record id, so the law basis stays the same if you change the words.

**تفهمه (AR):**
عقدة التوقيف ما تقرأ دردشة حرة — تقرأ طلباً واضحاً. العربية على البحث في قاعدة المعرفة. الحجب يستشهد بنفس المعرّف حتى لو تغيّرت صياغة السؤال.

**وش تضغط:**
قاعدة المعرفة → اقتراح جاهز بالعربي (ميتفورمين أو نقل بيانات خارج المملكة) → أظهر السجل المسترجع.

---

## 6. Can we reproduce the results from your repo?

**ليش يسأل:** يبي يتأكد إن المشروع قابل للتشغيل من المستودع العام، مو ديمو مقفول.

**جوابك (EN):**
> Public repo. MIT license. No API keys in the code. README has the steps. The model key is optional — without it, search and every stop still work. Only the text explanation is missing.

**تفهمه (AR):**
المستودع عام MIT بلا مفاتيح. الأوامر في README. مفتاح النموذج اختياري — بدونه البحث والتوقيف يشتغلان؛ يختفي الشرح النصي فقط.

**وش تضغط:**
أشر لقسم Run في README أو افتح GitHub على الشاشة.

---

## 7. How is consent and data protection handled?

**ليش يسأل:** يبي يتأكد إنكم ما تنقلون بيانات مرضى بلا سبب قانوني.

**جوابك (EN):**
> The decision does not need to know who the patient is — it needs kidney numbers and dose. So we remove name and ID before the decision. A marketing export of patient records abroad is refused with 403. No doctor override on that path. PDPL article 23.

**تفهمه (AR):**
القرار ما يحتاج يعرف مين المريض — يحتاج أرقام الكلى والجرعة. فنحذف الاسم والهوية قبل القرار. تصدير تسويقي للخارج → 403 بلا تجاوز. المادة 23 من نظام حماية البيانات.

**وش تضغط:**
1. بعد تقييم جهاز: حقل حذف المعرّفات.
2. طلب بيانات → SC-03 → 403.

---

## تذكير سريع

| السيناريو | الحكم | الجهاز | التجاوز |
| :--- | :--- | :--- | :--- |
| SC-01 | مسموح | 200 | لا يحتاج |
| SC-02 | مخالفة | 403 · LOCKED | نعم — باسم طبيب |
| SC-03 | مخالفة خصوصية | 403 · جلسة منتهية | لا |

**افتتاح الديمو:**
> Now I will show the live policy stop. Fixed rules. The AI model is not in the stop path.
