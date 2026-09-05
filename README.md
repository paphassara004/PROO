# ระบบ Skill Mapping — เทคโนโลยีสารสนเทศทางการแพทย์ (มหาวิทยาลัยกาฬสินธุ์)

ระบบจัดการข้อมูลหลักสูตรและแมปรายวิชากับทักษะ (Skill Mapping) ประกอบด้วย:

- **หน้าบ้าน (Frontend):** React + Vite — หน้าเว็บสาธารณะแสดงข้อมูลหลักสูตร และแผงควบคุมผู้ดูแลระบบ
- **หลังบ้าน (Backend):** PHP (ไม่ใช้เฟรมเวิร์ก ใช้ PDO ล้วน) + MySQL — REST API พร้อมระบบ Login และแยกสิทธิ์ Admin/User

```
skillmapping/
├── backend/            ← วางในโฟลเดอร์ htdocs ของ XAMPP (หรือ web server ที่รัน PHP ได้)
│   ├── api/            ← REST API endpoints ทั้งหมด
│   ├── config/         ← ตั้งค่าฐานข้อมูล + bootstrap
│   ├── middleware/      ← ระบบ token authentication
│   └── database/       ← ไฟล์ SQL schema+seed และสคริปต์สร้างบัญชีเริ่มต้น
└── frontend/           ← โปรเจกต์ React (รันแยกด้วย Node.js/Vite dev server)
```

---

## 1. เตรียมฐานข้อมูล (phpMyAdmin)

1. เปิด phpMyAdmin แล้วสร้างฐานข้อมูลชื่อ **`skillmapping`** (ถ้ายังไม่มี) — เลือก collation เป็น `utf8mb4_unicode_ci`
2. เลือกฐานข้อมูล `skillmapping` → แท็บ **Import** → เลือกไฟล์ `backend/database/skillmapping.sql` → กด Go
   - ไฟล์นี้จะสร้างตารางทั้งหมด (courses, plos, ylos, structure_items, faculty, career_groups/items, study_plan_items, skills, course_skills, users) พร้อมข้อมูลตัวอย่างของหลักสูตรเทคโนโลยีสารสนเทศทางการแพทย์ทั้งหมด (88 รายวิชา)

## 2. วางไฟล์ Backend

1. คัดลอกโฟลเดอร์ `backend/` ทั้งหมด ไปไว้ใน `C:\xampp\htdocs\skillmapping\backend` (หรือ path ที่ web server ของคุณให้บริการ)
2. เปิดไฟล์ `backend/config/db.php` แล้วตรวจสอบ/แก้ค่าตามการตั้งค่า MySQL ของคุณ:
   ```php
   define('DB_HOST', '127.0.0.1');
   define('DB_NAME', 'skillmapping');
   define('DB_USER', 'root');
   define('DB_PASS', '');   // ถ้า MySQL ตั้งรหัสผ่านไว้ ให้ใส่ตรงนี้
   ```
3. สร้างบัญชีผู้ใช้เริ่มต้น (จำเป็น — รันครั้งเดียว) โดยเปิดเบราว์เซอร์ไปที่:
   ```
   http://localhost/skillmapping/backend/database/seed_users.php
   ```
   จะได้บัญชี:
   - **admin / admin123** (สิทธิ์ผู้ดูแลระบบ — แก้ไขข้อมูลได้ทั้งหมด)
   - **user / user123** (สิทธิ์ผู้ใช้งานทั่วไป — ดูข้อมูลอย่างเดียว)

   > 🔒 แนะนำให้ลบไฟล์ `seed_users.php` ทิ้งหลังใช้งานเสร็จ และเปลี่ยนรหัสผ่านผ่านหน้า "โปรไฟล์ของฉัน" ในระบบ

4. ทดสอบว่า API ทำงาน โดยเปิด `http://localhost/skillmapping/backend/api/site.php` — ควรเห็นข้อมูล JSON ของหลักสูตรทั้งหมด

## 3. รัน Frontend (React)

ต้องติดตั้ง [Node.js](https://nodejs.org/) (เวอร์ชัน 18 ขึ้นไป) ก่อน

```bash
cd frontend
npm install
cp .env.example .env
```

เปิดไฟล์ `.env` แล้วตรวจสอบว่า URL ตรงกับที่วาง backend ไว้:
```
VITE_API_BASE=http://localhost/skillmapping/backend/api
```

จากนั้นรันโปรเจกต์:
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` — จะเห็นหน้าเว็บสาธารณะของหลักสูตร กดปุ่ม **"เข้าสู่ระบบ"** มุมขวาบนเพื่อเข้าแผงควบคุม

---

## ฟีเจอร์หลัก

### หน้าเว็บสาธารณะ (`/`)
แสดงข้อมูลหลักสูตรทั้งหมดผ่านเมนู sidebar แบบจัดกลุ่ม (หลักสูตร / ผลลัพธ์การเรียนรู้ / การเรียนการสอน / ตลาดแรงงาน) โดยดึงข้อมูลสดจากฐานข้อมูลทุกครั้งที่โหลดหน้า ครอบคลุม:
- **หลักสูตร:** โครงสร้างหลักสูตร, รายวิชา 88 วิชา (ค้นหา/กรองได้), แผนการเรียน 4 ปี (แยกแขนง A/B), กราฟรายวิชาแบบ interactive (Hard/Weak/Co-requisite), อาจารย์ประจำหลักสูตร
- **ผลลัพธ์การเรียนรู้:** ขั้นตอน OBE, PLO, YLO, CLO รายวิชา พร้อม K-S-E-C และตาราง Curriculum Mapping
- **การเรียนการสอน:** กลยุทธ์การสอน, การวัดและประเมินผล (วิเคราะห์จากโครงสร้างหน่วยกิตจริง), กลยุทธ์รายข้อ KSEC
- **ตลาดแรงงาน:** เส้นทางอาชีพ, Jobs & Skills พร้อมลิงก์ค้นหางานจริงบน JobsDB
- **ข้อมูลอ้างอิง:** ที่มาของข้อมูลทั้งหมด

### แผงควบคุม (`/admin`) — ต้อง Login
- **Dashboard:** สรุปภาพรวมข้อมูล
- **รายวิชา / PLO / YLO / โครงสร้างหน่วยกิต / แผนการเรียน / เส้นทางอาชีพ / อาจารย์ / CLO รายวิชา:** CRUD ครบ (เพิ่ม/แก้ไข/ลบ) — เฉพาะ **admin**
- **ทักษะ & การแมป (Skill Mapping):** หัวใจของระบบ — จัดการรายการทักษะ (เช่น "การเขียนโปรแกรมเชิงวัตถุ", "ปัญญาประดิษฐ์") แล้วแมปว่าแต่ละรายวิชาสร้างทักษะอะไรบ้าง พร้อมระบุระดับความเข้มข้น (1–5)
- **ผู้ใช้งาน:** เพิ่ม/แก้ไข/ลบบัญชี และกำหนดสิทธิ์ admin/user — เฉพาะ **admin**
- **โปรไฟล์ของฉัน:** เปลี่ยนรหัสผ่าน — ทุกบัญชีใช้ได้

หมายเหตุ: กราฟรายวิชา (course prerequisite graph), กลยุทธ์การสอน, การวัดและประเมินผล, กลยุทธ์รายข้อ KSEC และ Jobs & Skills เป็นเนื้อหาที่วิเคราะห์/คำนวณขึ้นจากข้อมูลจริงในระบบ (โครงสร้างหน่วยกิต, CLO) ไม่ใช่ตารางทางการจากเอกสารหลักสูตร — ข้อมูลกราฟรายวิชาจัดเก็บในตาราง `course_prereqs` แก้ไขผ่าน API `prereqs.php` ได้ (ยังไม่มีหน้าแอดมิน UI ให้ในเวอร์ชันนี้ ต้องแก้ผ่าน phpMyAdmin หรือเรียก API โดยตรง)

สิทธิ์ **user** จะเห็นเฉพาะเมนู Dashboard และโปรไฟล์ (ดูข้อมูลอย่างเดียว ไม่มีสิทธิ์แก้ไข)

---

## อ้างอิง API (ทั้งหมดอยู่ใต้ `backend/api/`)

| Endpoint | Method | คำอธิบาย | ต้อง Login |
|---|---|---|---|
| `auth.php?action=login` | POST | เข้าสู่ระบบ รับ token กลับมา | ไม่ |
| `auth.php?action=me` | GET | ข้อมูลผู้ใช้ปัจจุบัน | ต้อง |
| `auth.php?action=register` | POST | สร้างผู้ใช้ใหม่ | ต้อง (admin) |
| `auth.php?action=change-password` | POST | เปลี่ยนรหัสผ่านตนเอง | ต้อง |
| `site.php` | GET | ข้อมูลทั้งหมดสำหรับหน้าเว็บสาธารณะ | ไม่ |
| `courses.php` | GET/POST/PUT/DELETE | จัดการรายวิชา | เขียน=admin |
| `plos.php` | GET/POST/PUT/DELETE | จัดการ PLO (รวม sub-PLO) | เขียน=admin |
| `ylos.php` | GET/POST/PUT/DELETE | จัดการ YLO | เขียน=admin |
| `structure.php` | GET/POST/PUT/DELETE | จัดการโครงสร้างหน่วยกิต | เขียน=admin |
| `faculty.php` | GET/POST/PUT/DELETE | จัดการอาจารย์ | เขียน=admin |
| `careers.php` | GET/POST/PUT/DELETE | จัดการกลุ่ม/รายการอาชีพ | เขียน=admin |
| `studyplan.php` | GET/POST/PUT/DELETE | จัดการแผนการเรียนรายปี/แขนง | เขียน=admin |
| `skills.php` | GET/POST/PUT/DELETE | จัดการทักษะ | เขียน=admin |
| `skills.php?action=map` | GET/POST/DELETE | จัดการการแมปวิชา↔ทักษะ | เขียน=admin |
| `clos.php` | GET/POST/PUT/DELETE | จัดการ CLO รายวิชา (K-S-E-C + PLO mapping) | เขียน=admin |
| `prereqs.php` | GET/POST/DELETE | จัดการกราฟความสัมพันธ์รายวิชา (hard/weak/co-requisite) | เขียน=admin |
| `users.php` | GET/PUT/DELETE | จัดการผู้ใช้งาน | admin |

การยืนยันตัวตนใช้ `Authorization: Bearer <token>` header (frontend จัดการให้อัตโนมัติผ่าน `src/api/client.js`)

---

## หมายเหตุด้านความปลอดภัย

- เปลี่ยนค่า `APP_SECRET` ใน `backend/config/db.php` ก่อนนำไปใช้งานจริง
- ลบไฟล์ `backend/database/seed_users.php` หลังสร้างบัญชีเริ่มต้นเสร็จแล้ว
- เมื่อ deploy ขึ้นเซิร์ฟเวอร์จริง ให้แก้ `$allowedOrigins` ใน `backend/config/bootstrap.php` ให้ตรงกับโดเมนจริงของ frontend และรันผ่าน HTTPS
#   P R O O  
 