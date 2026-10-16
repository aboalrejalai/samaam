# نشر صِمَام

الصورة واحدة تحمل كل شيء: الواجهة المبنية، والـ API، وقاعدة المعرفة مفهرسة
مسبقاً. **عملية واحدة، منفذ واحد** — بلا CORS، وبلا مضيف ثابت منفصل، وبلا
`VITE_API_BASE_URL`.

---

## Coolify — الطريق الموصى به

`مشروع جديد ← Public Repository ← https://github.com/aboalrejal-ai/samaam`

| الحقل | اختر |
| :--- | :--- |
| **Build Pack** | **`Dockerfile`** |
| Branch | `main` |
| Base Directory | `/` |
| Dockerfile Location | `/Dockerfile` |
| **Port** | **`8000`** ← وليس `3000` |
| Is it a static site? | **No** |
| Environment Variables | لا شيء — إلا إن أردت الشرح النصّي، فأضف `SAMAAM_LLM_API_KEY` |

ثم **Domains**: ضع نطاقك الفرعي، و Coolify يستخرج شهادة Let's Encrypt وحده.
وإن تركته فارغاً يعطيك رابطاً مؤقتاً يعمل فوراً.

**اضغط Deploy.** أول بناء يأخذ **٨–١٥ دقيقة** — ينزّل `torch` ونموذج التضمين،
ويبني الواجهة، ويفهرس المتن. والأبنية بعده أسرع بكثير بفضل الطبقات المخبَّأة.

### ما يحتاجه السيرفر للبناء

| | |
| :--- | :--- |
| الذاكرة | **٢ جيجا فأكثر.** البناء يجمع `npm` و`pip` معاً وهو أثقل من التشغيل |
| المساحة | **٦ جيجا فارغة** |

لو الذاكرة ١ جيجا، أضف ملف تبادل **قبل** أول بناء وإلا انهار في منتصفه:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### إن فشل البناء

سجل Coolify يقول أين وقف بالضبط. الأسباب المتوقعة ثلاثة لا رابع لها:
**ذاكرة نفدت** أثناء `npm run build` أو `pip install` · **مساحة نفدت** ·
**الشبكة** سقطت أثناء تنزيل النموذج. كلها تُحلّ بإعادة المحاولة بعد إضافة
التبادل أو تفريغ المساحة.

---

## ماذا يوجد في الصورة

```
node:22-slim      →  npm ci && npm run build          →  web/dist
python:3.13-slim  →  torch (نسخة المعالج) + المتطلبات
                     app/ · kb/ · scenarios/ · web/dist
                     python -m app.ingest --reset      →  الفهرس محزوم
                     مستخدم غير جذر · فحص صحة · المنفذ 8000
```

**نسخة المعالج من `torch` مقصودة:** الافتراضية على لينكس تجرّ تعريفات CUDA
بحجم ~٢٫٥ جيجا، والنظام لا يستخدم كرت رسوميات.

**والفهرسة تتم وقت البناء لا وقت الإقلاع:** فالحاوية تقلع جاهزة، وتسترجع وتحجب
**بلا شبكة إطلاقاً**. المفتاح وحده اختياري، ووظيفته صياغة الشرح النصّي.

---

## Hostinger VPS — عبر Docker Compose

ملف `docker-compose.yml` في جذر المستودع، فأمر واحد يكفي:

```bash
git clone https://github.com/aboalrejal-ai/samaam.git /opt/samaam && cd /opt/samaam
docker compose up -d --build
```

**الرابط:** `http://<IP>:3172`

> **منفذان لا واحد.** إلى جانب 3172 للواجهة، تنشر الحاوية **11112** لخادم قائمة
> العمل (DICOM) الذي يستعلم عليه جهاز الأشعة. وهو المنفذ الذي تتوقعه أدوات
> DICOM افتراضياً، فيبقى كما هو على الطرفين. `SAMAAM_MWL_PORT` يغيّره، و
> `SAMAAM_MWL_ENABLED=false` يوقف الخادم كلياً إن لم يكن مطلوباً.

> **لماذا 3172؟** هو رقم المعيار الذي تنفّذه هذه البوابة — ITU-T Y.3172 —
> ويكاد لا يُستخدم. المنافذ المعتادة (`80` · `3000` · `8000` · `8080`) مأخوذة
> على أي سيرفر يحمل تطبيقات أخرى، والاصطدام بها يُفشل الإقلاع برسالة
> `port is already allocated` بعد أن يكون البناء قد نجح كاملاً.

ولو كان المنفذ `80` فارغاً حقاً — لا وكيل عكسي ولا Coolify على السيرفر — فاجعل
الرابط بلا لاحقة:

```bash
SAMAAM_PORT=80 docker compose up -d --build
```

المتابعة:

```bash
docker compose ps          # تظهر الحالة healthy بعد ~٤٠ ثانية
docker compose logs -f
docker compose up -d --build   # للتحديث بعد git pull
```

### إن قالت لوحة Hostinger «No docker compose found»

لأن الأداة تنزّل **ملف الـ YAML وحده** دون بقية المستودع، والملف يبني من
المصدر (`build: .`) فلا يجد ما يبني منه. الحل هو الاستنساخ أعلاه: `git clone`
ثم `docker compose up -d --build` من داخل المجلد.

---

## تشغيلها بـ Docker مباشرة

```bash
docker build -t samaam .
docker run -p 8000:8000 samaam                       # بلا مفتاح — كل شيء يعمل عدا الشرح
docker run -p 8000:8000 -e SAMAAM_LLM_API_KEY=... samaam
```

---

## بلا Docker — على VPS عارٍ

```bash
apt update && apt install -y python3 python3-venv git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs

git clone https://github.com/aboalrejal-ai/samaam.git /opt/samaam && cd /opt/samaam
python3 -m venv .venv
.venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m app.ingest --reset
cd web && npm ci && npm run build && cd ..
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

لتبقى تعمل بعد إغلاق الطرفية، خدمة `systemd`:

```bash
cat > /etc/systemd/system/samaam.service <<'EOF'
[Unit]
Description=Samaam — ITU Y.3172 policy gateway
After=network.target

[Service]
WorkingDirectory=/opt/samaam
ExecStart=/opt/samaam/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload && systemctl enable --now samaam
journalctl -u samaam -f
```

---

## التحقق بعد النشر

```bash
curl -s https://نطاقك/health          # يرد الحالة وعدد السجلات
curl -s https://نطاقك/connectors      # الموصّلات وحالتها
```

ولاختبار خادم قائمة العمل كما يفعل جهاز حقيقي — من أي جهاز عليه المكتبة:

```bash
python -m pynetdicom echoscu <IP> 11112 -aec SAMAAM
python -m pynetdicom findscu <IP> 11112 -aec SAMAAM -W -k "(0010,0010)="
```

**الفحص المطابق يظهر، والمحجوب لا يظهر** — وكلاهما في `/audit`.

> إن كان النفق يمرّ عبر Cloudflare فهو يمرّر HTTP فقط، وDICOM بروتوكول TCP خام
> لا يمرّ منه. فالمنفذ 11112 يُفتح على عنوان السيرفر مباشرةً — وداخل المستشفى
> يكون هذا هو الوضع الطبيعي أصلاً: الجهاز والبوابة على الشبكة نفسها.

وفي المتصفح: افتح لوحة التحكم على `/app`، حمّل **SC-02**، وأرسله. **`403`** يعني أن كل شيء
يعمل — الواجهة والـ API وقاعدة المعرفة وعقدة السياسات.
