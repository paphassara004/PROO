-- ============================================================
-- Skill Mapping System — Database Schema + Seed Data
-- หลักสูตรเทคโนโลยีสารสนเทศทางการแพทย์ มหาวิทยาลัยกาฬสินธุ์
-- Import this file via phpMyAdmin > Database: skillmapping > Import
-- (After importing, run backend/database/seed_users.php once to create
--  the default admin/user accounts with properly hashed passwords.)
-- ============================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) DEFAULT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) UNIQUE NOT NULL,
  label VARCHAR(150) NOT NULL,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) UNIQUE NOT NULL,
  credit_text VARCHAR(30) DEFAULT NULL,
  th_name VARCHAR(255) DEFAULT NULL,
  en_name VARCHAR(255) DEFAULT NULL,
  th_desc TEXT,
  en_desc TEXT,
  group_code VARCHAR(30) DEFAULT NULL,
  year_no TINYINT DEFAULT NULL,
  sem_no TINYINT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_group FOREIGN KEY (group_code) REFERENCES course_groups(code) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plo_subs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plo_id INT NOT NULL,
  text TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  CONSTRAINT fk_plo_sub FOREIGN KEY (plo_id) REFERENCES plos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ylos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_no TINYINT NOT NULL,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS structure_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  credit INT NOT NULL,
  level TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(100),
  name VARCHAR(150) NOT NULL,
  qualification TEXT,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS career_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(50),
  title VARCHAR(150) NOT NULL,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS career_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  career_group_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  CONSTRAINT fk_career_item FOREIGN KEY (career_group_id) REFERENCES career_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS study_plan_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_no TINYINT NOT NULL,
  track VARCHAR(10) DEFAULT NULL,
  sem_no TINYINT NOT NULL,
  course_code VARCHAR(30) DEFAULT NULL,
  custom_name VARCHAR(255) DEFAULT NULL,
  custom_credit VARCHAR(30) DEFAULT NULL,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(30) NOT NULL,
  skill_id INT NOT NULL,
  weight TINYINT DEFAULT 3 COMMENT '1-5 ระดับความเข้มข้นของทักษะในวิชานี้',
  CONSTRAINT fk_cs_course FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE,
  CONSTRAINT fk_cs_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_course_skill (course_code, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO course_groups (code, label, sort_order) VALUES
  ('ge-req', 'ศึกษาทั่วไป · บังคับ', 1),
  ('ge-elec', 'ศึกษาทั่วไป · เลือก', 2),
  ('core', 'วิชาแกน', 3),
  ('major-req', 'เอกบังคับ', 4),
  ('track-a-req', 'แขนง A (วิทยาการข้อมูลและ AI ทางการแพทย์) · บังคับ', 5),
  ('track-a-elec', 'แขนง A (วิทยาการข้อมูลและ AI ทางการแพทย์) · เลือก', 6),
  ('track-b-req', 'แขนง B (เทคโนโลยีสารสนเทศทางการแพทย์) · บังคับ', 7),
  ('track-b-elec', 'แขนง B (เทคโนโลยีสารสนเทศทางการแพทย์) · เลือก', 8),
  ('internship', 'ฝึกประสบการณ์วิชาชีพ', 9),
  ('free-elec', 'เลือกเสรี', 10);

INSERT INTO courses (code, credit_text, th_name, en_name, th_desc, en_desc, group_code, year_no, sem_no) VALUES
  ('GE-010-001', '3(2-2-5)', 'ภาษาอังกฤษง่ายนิดเดียว', 'English is Easy', 'คำศัพท์ วลีและโครงสร้างประโยคภาษาอังกฤษเพื่อการสื่อสารในชีวิตประจำวัน ทักษะการฟังและสนทนาประโยคภาษาอังกฤษในสถานการณ์ต่าง ๆ และอ่านข้อความหรือเนื้อหาสั้น ๆ ที่น่าสนใจ', 'Vocabulary, phrases, and sentence structures of English for communicating in daily life; listening and conversational skills through common English sentences used in various situations; and reading short, interesting texts of varying text types', 'ge-req', NULL, NULL),
  ('GE-010-002', '3(2-2-5)', 'ภาษาอังกฤษฟุดฟิดฟอฟัน', 'English is Fun', 'การสื่อสารและใช้ภาษาอังกฤษในบริบทต่าง ๆ คำศัพท์ ประโยค ไวยากรณ์และสำนวนภาษาอังกฤษในสังคมพหุวัฒนธรรม การฟัง การเขียนและโต้ตอบในบริบทการท่องเที่ยว เดินทาง และเพื่อนต่างวัฒนธรรม', 'Using English to communicate in various contexts; vocabulary, grammatical structures of English sentences and idioms commonly used in multicultural social settings; listening, writing, and interacting with other people from different cultures in a variety of travel-and-tourism situations', 'ge-req', NULL, NULL),
  ('GE-010-003', '3(2-2-5)', 'ดิจิทัลกับชีวิตวิถีใหม่', 'Digital Technology of New Normal', 'เทคโนโลยีดิจิทัล คอมพิวเตอร์ ออนไลน์ การใช้งานโปรแกรมประยุกต์สำหรับสำนักงาน กฎหมายเกี่ยวกับดิจิทัล', 'Digital technology studies including online computer applications, office application skills, and cybercrime laws', 'ge-req', NULL, NULL),
  ('GE-010-004', '3(2-2-5)', 'คุณค่ามหาวิทยาลัยกาฬสินธุ์', 'Value of Kalasin University', 'ความสำคัญของค่านิยมและวัฒนธรรมองค์กรในระดับหน่วยงาน สังคม และประเทศ ผลงานทางวิชาการของมหาวิทยาลัย จัดกิจกรรมทางวิชาการ การจัดการทรัพยากร และผู้ประกอบการเพื่อการพัฒนาท้องถิ่น', 'The importance of value and cooperate culture of departments, social and nation; published academic works of Kalasin University; academic activities management; and community servicing', 'ge-req', NULL, NULL),
  ('GE-010-005', '3(2-2-5)', 'ชีวิตออกแบบได้', 'Ideal Life', 'ปัจจัยและความสำคัญของแรงบันดาลใจในการใช้ชีวิต เทคนิคและวิธีคิดของผู้ประสบความสำเร็จ เรียนรู้สถานการณ์ต่าง ๆ ด้วยตนเอง วิเคราะห์และวางแผนเป้าหมายชีวิต การสร้างความสัมพันธ์ระหว่างบุคคล การแสดงลักษณะท่าทาง การวางตัว การมีมนุษยสัมพันธ์', 'Importance and factors of life inspiration; concepts and ideas of very successful people; self-learning through different real-life situations; analyzing and planning life goals; socializing; manners; and interpersonal skills', 'ge-req', NULL, NULL),
  ('GE-010-006', '3(3-0-6)', 'ปรัชญามนุษย์ สังคมและเศรษฐศาสตร์', 'Human Philosophy, Society, and Economics', 'สภาพแวดล้อมทางสังคม เศรษฐกิจ และการเมือง การปกครองทั้งภายในและภายนอกประเทศ หลักการบริหาร หลักกฎหมายเบื้องต้น วิเคราะห์ปัญหาด้านจริยธรรมทางเศรษฐกิจระดับบุคคล ระดับองค์กร ระดับประเทศและระดับโลกที่เกิดขึ้นในสังคมปัจจุบัน อุปสงค์ อุปทาน ทฤษฎีพฤติกรรมผู้บริโภค การบริโภค การออมและการลงทุน ปัญหาเงินเฟ้อ เงินฝืด การว่างงาน และปรัชญาเศรษฐกิจพอเพียง', 'Social, economic, and political environment inside and outside Thailand; administrative principles; principle of basic law; economic ethics issues at the individual, organizational, national and global levels emerging in today\'s society; demand, supply, consumer behavior theory; consumption, savings and investment; inflation, deflation, and unemployment problems; sufficiency economy philosophy', 'ge-req', NULL, NULL),
  ('GE-020-001', '3(2-2-5)', 'ภาษาอังกฤษสำหรับสาขามนุษยศาสตร์และสังคมศาสตร์', 'English for Humanities and Social Sciences', 'การอ่านเชิงวิชาการเพื่อจับใจความสำคัญ การแสดงความคิดเห็น การเขียนระดับย่อหน้า และรายละเอียดจำเพาะทางมนุษยศาสตร์และสังคมศาสตร์', 'Academic reading for main ideas and specific details; expressing opinions; paragraph writing for humanities and social science', 'ge-elec', NULL, NULL),
  ('GE-020-002', '3(2-2-5)', 'ภาษาอังกฤษสำหรับสาขาวิทยาศาสตร์และเทคโนโลยี', 'English for Science and Technology', 'การอ่านเชิงวิชาการเพื่อจับใจความสำคัญ การแสดงความคิดเห็น การเขียนระดับย่อหน้า และรายละเอียดจำเพาะทางวิทยาศาสตร์และเทคโนโลยี', 'Academic reading for main ideas and specific details; expressing opinions; paragraph writing for sciences and technology science', 'ge-elec', NULL, NULL),
  ('GE-020-003', '3(3-0-6)', 'ภาษาไทยเชิงสร้างสรรค์', 'Creative Thai', 'การพูดในที่สาธารณะ การพูดเพื่อสร้างแรงบันดาลใจ การนำเสนอเชิงวิชาการ การนำเสนอเพื่อสร้างความสนใจ การอ่านและการฟังเพื่อจับใจความ และการเขียนเพื่อนำเสนอตนเอง', 'Public speaking; inspiration talks; practical academic presentations; comprehensive reading and listening; and autobiography writing', 'ge-elec', NULL, NULL),
  ('GE-020-004', '3(2-2-5)', 'ภาษาจีนเพื่อการสื่อสารในชีวิตประจำวัน', 'Chinese for Daily Life Communication', 'การใช้คำศัพท์ วลี ประโยคภาษาจีนพื้นฐาน การฝึกทักษะการฟัง การออกเสียงและสนทนาในชีวิตประจำวัน', 'Usage of vocabulary, phrases, and basic sentences of Chinese; practicing of listening skill, pronunciation, and communication in daily life', 'ge-elec', NULL, NULL),
  ('GE-020-005', '3(2-2-5)', 'ภาษาจีนเพื่อการสื่อสารในที่ทำงาน', 'Chinese for Workplace Communication', 'การพัฒนาทักษะการฟัง การพูดภาษาจีน การขอข้อมูล การสนทนาทางโทรศัพท์ การนัดหมาย การรับฝากข้อความ เน้นคำศัพท์และข้อความที่ใช้สนทนาในที่ทำงาน', 'Developing Chinese listening and speaking skills; asking for information; talking on the phone; making an appointment; taking messages; emphasizing on vocabulary and expressions used in the workplace', 'ge-elec', NULL, NULL),
  ('GE-020-006', '3(3-0-6)', 'กฎหมายกับการบังคับใช้ในสังคม', 'Laws and Social Orders', 'กฎหมายที่เกี่ยวข้องกับบริบทและการเปลี่ยนแปลงของสังคม สิทธิมนุษยชน กระบวนการยุติธรรมเบื้องต้น กฎหมายป้องกันและปราบปรามยาเสพติด การเจรจาไกล่เกลี่ย หลักธรรมาภิบาล', 'Laws and social orders studies involving social movements and human rights; basic process of judgment; prevention and suppression of narcotics law; mediation process; and a good governance practicality', 'ge-elec', NULL, NULL),
  ('GE-020-007', '3(2-2-5)', 'กีฬาและนันทนาการเพื่อสุขภาพ', 'Sports and Recreation for Health', 'ความสัมพันธ์ของสุขภาพและสมรรถภาพทางกาย หลักโภชนาการ การเล่นกีฬา การออกกำลังกาย และนันทนาการ การวางแผนและการจัดบริการสุขภาพและนันทนาการในรูปแบบต่าง ๆ การเป็นผู้นำนันทนาการ', 'Health related physical fitness; principle of nutrition; sport; exercise; recreation; planning and service management about health and recreation activities; leader of recreation', 'ge-elec', NULL, NULL),
  ('GE-020-008', '3(3-0-6)', 'การพัฒนาธุรกิจในสังคมดิจิทัล', 'Business Development in the Digital Era', 'หลักการเป็นผู้ประกอบการ การบริหารทรัพยากร เวลา การเงิน การบัญชีและระบบการขนส่งเบื้องต้น การตลาดดิจิทัล การสร้างเนื้อหาที่น่าสนใจเพื่อการตลาด การวางแผนการเงิน', 'Entrepreneur studies; resources, time, and money management; accounting skills; basic logistic system; digital marketing; and effective marketing content creation; and money budgeting', 'ge-elec', NULL, NULL),
  ('GE-020-009', '3(3-0-6)', 'ผู้นำแห่งศตวรรษที่ 21', 'Leadership of the 21st Century', 'ผู้นำและผู้ตามที่ดี บุคลิกภาพ การทำงานเป็นทีม บริบทความเปลี่ยนแปลงของสังคมโลก การแก้ปัญหา การคิดวิเคราะห์ การสื่อสาร คุณธรรม จริยธรรม หลักธรรมาภิบาลสำหรับผู้นำ วางแผนการเงินอย่างเป็นระบบ การเป็นนวัตกรสังคม', 'Being a good leader and good supporter with characteristics; a team-working person; understanding context of global shifting; problem solving skills; analytical thinking; interpersonal skills with moral ethics; and good governance practicality; systematic expense planning; and being an innovative person', 'ge-elec', NULL, NULL),
  ('GE-020-010', '3(3-0-6)', 'เศรษฐกิจสีเขียว', 'Green Economy', 'ระบบเศรษฐกิจในท้องถิ่น สถานการณ์เศรษฐกิจในปัจจุบัน เศรษฐกิจ BCG หลักปรัชญาเศรษฐกิจพอเพียง การวางแผนชีวิต และการเงินบนฐานคิดเศรษฐกิจท้องถิ่นอย่างยั่งยืน', 'Local economic system; current economic situations; Bio-Circular-Green Economy (BCG); life planning and financial management based on the concept of sustainable economic system', 'ge-elec', NULL, NULL),
  ('GE-020-011', '3(3-0-6)', 'การแก้ปัญหาอย่างเป็นระบบ', 'Systematic Problem Solving', 'วิเคราะห์ประเด็นปัญหา วิธีการและขั้นตอนในการแก้ไขปัญหา แนวคิดทฤษฎีวิทยาศาสตร์และสังคมศาสตร์ วิธีการทางสถิติเพื่อการแก้ไขปัญหา', 'Analyzing problems; steps or procedures of solving problems; concepts and theory of science and social sciences; statistical methods for problem solving', 'ge-elec', NULL, NULL),
  ('GE-020-012', '3(3-0-6)', 'วิทยาศาสตร์และเทคโนโลยีสร้างสุข', 'Science and Technology for Happiness', 'วิทยาศาสตร์และเทคโนโลยี เทคโนโลยีสารสนเทศและการสื่อสารประยุกต์ ความก้าวหน้าทางนวัตกรรมและผลกระทบของเทคโนโลยีและนวัตกรรมสมัยใหม่ คุณธรรม และจริยธรรมในการใช้เทคโนโลยี การสร้างความสุขจากการใช้เทคโนโลยี', 'Science and technology; information technology and applied communication; innovation progress and the impact of new technology; morality and ethics in technology usage; using technology for your own pleasure', 'ge-elec', NULL, NULL),
  ('GE-020-013', '3(2-2-5)', 'สมุนไพรไทยกับการพัฒนาธุรกิจ', 'Thai Herbs and Business Development', 'ความหมายและความสำคัญของสมุนไพรไทย ส่วนต่าง ๆ ของพืชสมุนไพร หลักเบื้องต้นในการใช้สมุนไพร สมุนไพรกับการดูแลสุขภาพ สมุนไพรเพื่อความงาม ธุรกิจสมุนไพร และการสร้างมูลค่าสมุนไพรไทยกับโอกาสทางธุรกิจ', 'Meaning and importance of Thai herbs; different parts of medicinal plants; basic principle of herbal uses; herb for health care; herb for beauty and cosmetics; herbal business and value creation of Thai herbs and business opportunities', 'ge-elec', NULL, NULL),
  ('GE-020-014', '3(2-2-5)', 'สุนทรียภาพเพื่อชีวิต', 'Aesthetics for Life', 'คุณค่าทางสุนทรียศาสตร์ด้านดนตรี นาฏศิลป์ การละครและศิลปะ การถ่ายภาพ การแสดงศิลปะพื้นเมืองไทยและสากล', 'Aesthetic values in music; classical dance; drama; arts; photography; Thai and international folk art performances', 'ge-elec', NULL, NULL),
  ('GE-020-015', '3(2-2-5)', 'เพศสภาพและเพศวิถีศึกษา', 'Gender and Sexual Orientation Education', 'เพศสภาพ เพศวิถี อนามัยเจริญพันธุ์ พัฒนาการทางเพศ สุขอนามัยของวัยเจริญพันธุ์ การดูแลสุขภาพตามช่วงวัย ค่านิยมและความหลากหลายทางเพศ ความเสมอภาค ความเท่าเทียมทางเพศ สัมพันธภาพระหว่างบุคคล สถานภาพ และสถาบันครอบครัว พฤติกรรมเสี่ยงตามเพศ การป้องกันโรคติดต่อทางเพศสัมพันธ์ การเข้าถึงแหล่งบริการสุขภาพ อิทธิพลของสื่อ สังคมและวัฒนธรรมที่มีผลกระทบต่อเพศสภาพ', 'Gender, sexual orientation, reproductive health, sexual development; personal hygiene of puberty; health care for different age groups; value of sexual and gender diversity; gender equality; interpersonal relationship, status, family unit; gender-based risky sexual behaviors; prevention of sexually transmitted diseases; friendly health-care service access; influence of media, social and cultural influences affecting gender', 'ge-elec', NULL, NULL),
  ('GE-020-016', '3(3-0-6)', 'ปรัชญาการดำเนินชีวิตยุคดิจิทัล', 'Philosophy for Living Life in the Digital Era', 'หลักปรัชญาในการดำเนินชีวิต การดำรงชีวิตในสังคมปัจจุบัน พฤติกรรมมนุษย์ ความเข้าใจตนเองและผู้อื่น ความเข้าใจปัญหาที่อยู่รอบตัว การใช้ดิจิทัลอย่างปลอดภัย ปรับพฤติกรรมให้สอดคล้องกับสังคมในยุคดิจิทัล', 'Principles of philosophy for living life; living in today\'s society; human behaviors; understanding of self and others, and understanding common life problems; using digital technology creatively and safely; and adjusting behaviors to fit in with the digital society', 'ge-elec', NULL, NULL),
  ('GE-020-017', '3(2-2-5)', 'วัยใส ใจสะอาด', 'Youngster with Good Heart', 'ปรับฐานความคิดต้านทุจริตส่วนตนและส่วนรวม ทักษะการปรับกระบวนการคิด จริยธรรมนำพลเมืองในสังคม การยับยั้งและป้องกันการทุจริต ปราบทุจริตด้วยจิตพอเพียง การประยุกต์ใช้หลักการของความพอเพียง ภูมิคุ้มกันสังคมไทยด้วยจิตพอเพียง', 'Mindset enhancement of self and public honesty; mindset improving skills; social leadership ethics; prevention and suppression of corruption; counter-corruption; self-sufficiency concept application; and self-sufficient mindset awareness to protect society', 'ge-elec', NULL, NULL),
  ('SC-001-013', '3(3-0-6)', 'คณิตศาสตร์สำหรับเทคโนโลยีสารสนเทศ', 'Mathematics for Information Technology', 'เซต ทฤษฎีจำนวน การนับ ตรรกศาสตร์ พีชคณิตแบบบูลีน โครงสร้างด้านพีชคณิต ฟังก์ชันเรียกซ้ำ เมทริกซ์ การดำเนินการ และการประยุกต์ใช้ในงานเทคโนโลยีสารสนเทศกับเครื่องมือให้เหมาะสม', 'Set, number theory, counting, logics, Boolean algebra, algebraic structure, recursive function, matrices, operations, and its application for information technology with appropriate tools', 'core', 1, 1),
  ('SC-001-014', '3(2-2-5)', 'สถิติสำหรับเทคโนโลยีสารสนเทศ', 'Statistics for Information Technology', 'การประยุกต์ใช้สถิติสำหรับงานด้านเทคโนโลยีสารสนเทศ สถิติเชิงพรรณา ตัวแปรสุ่มและการแจกแจง ทฤษฎีความน่าจะเป็นขั้นพื้นฐาน ประชากรและการสุ่มตัวอย่าง สถิติการประมาณค่า การทดสอบสมมติฐาน การวิเคราะห์ความถดถอย และเครื่องมือทางสถิติ', 'Applications of statistics in information technology; descriptive statistics; random variable and distribution; elementary probability theory; populations and samples; estimation statistics; hypothesis testing; regression analysis; and statistical tools', 'core', 1, 2),
  ('SC-001-015', '3(2-2-5)', 'การวิจัยสำหรับเทคโนโลยีสารสนเทศทางการแพทย์', 'Research for Medical Information Technology', 'หลักการและแนวคิดในการวิจัย ประเภทการวิจัย องค์ประกอบและขั้นตอนการทำวิจัย จริยธรรมในการวิจัยและการอ้างอิง การออกแบบเครื่องมือวิจัยและการวางแผนวิเคราะห์ข้อมูล การวางแผนการเก็บรวบรวมข้อมูล เทคนิคการวิเคราะห์ข้อมูล การออกภาคสนามเก็บข้อมูล สรุปผลการวิจัย ประยุกต์ใช้ทางด้านเทคโนโลยีสารสนเทศทางการแพทย์', 'Research principles and concepts; research types; composition and process for conducting research; ethics in research and references; design of research tools and data analysis planning; data collection planning and data collection; data analysis techniques; field data collection; medical information technology applications', 'core', 2, 1),
  ('SC-112-101', '3(2-2-5)', 'การเขียนโปรแกรม', 'Programming', 'การเขียนโปรแกรมคอมพิวเตอร์ขั้นแนะนำ ผังงาน ซูโดโค้ด การแก้ปัญหา การคิดเชิงตรรกะ ชนิดข้อมูล ตัวแปร โครงสร้างควบคุม อาร์เรย์ ฟังก์ชัน การนำเข้า/การส่งออกไฟล์', 'Introduction to computer programming: flowchart, pseudocode, problem solving, logical thinking, data types, variables, control structure, array, function, input/output, file', 'major-req', 1, 1),
  ('SC-112-102', '3(2-2-5)', 'แพลตฟอร์มเทคโนโลยี', 'Platform Technology', 'ความรู้เบื้องต้นเกี่ยวกับสถาปัตยกรรมระบบคอมพิวเตอร์ เทคโนโลยีเครื่องคอมพิวเตอร์เสมือน ส่วนประกอบทางด้านฮาร์ดแวร์ หน่วยประมวลผล ระบบบัสภายในและระบบเชื่อมต่ออุปกรณ์ภายนอก หน่วยความจำ หน่วยเก็บบันทึกข้อมูล พื้นฐานระบบปฏิบัติการ การจัดการโปรเซส การจัดการหน่วยความจำ การจัดการกับหน่วยเก็บข้อมูล กรณีศึกษาระบบปฏิบัติการในปัจจุบัน', 'Introduction to computer architecture; virtualization technology; computer hardware; central processing unit; internal and external bus system; system memory; storage unit; introduction to operating system; process management; memory management; storage management; case studies', 'major-req', 1, 1),
  ('SC-112-103', '3(2-2-5)', 'การจัดการระบบฐานข้อมูล', 'Database System Management', 'แนวคิดของระบบฐานข้อมูล แฟ้มข้อมูลและฐานข้อมูล สถาปัตยกรรมของระบบฐานข้อมูล หน่วยข้อมูลและความสัมพันธ์ของหน่วยข้อมูล การออกแบบฐานข้อมูลด้วยวิธีแผนภาพอีอาร์ การออกแบบฐานข้อมูลด้วยวิธีนอร์มัลไลเซชัน โครงสร้างฐานข้อมูลแบบลำดับชั้น แบบเครือข่าย และแบบเชิงสัมพันธ์ คำสั่งภาษาเอสคิวแอล การจัดการฐานข้อมูลแบบ NoSQL การโปรแกรมในระบบการจัดการฐานข้อมูล', 'Database system concepts; files and databases; database system architecture; data entities and relationships; data modeling using entity relation diagrams and normalization technique; hierarchical, network and relational models of databases; SQL language, database retrieval and definition languages; how to integrate database applications; NoSQL (not only SQL) database management; programming in database management systems', 'major-req', 1, 2),
  ('SC-112-104', '3(2-2-5)', 'ระบบปฏิบัติการ', 'Operating System', 'พื้นฐานระบบปฏิบัติการในแพลตฟอร์มต่างๆ การติดตั้งระบบปฏิบัติการ คำสั่งการใช้งานพื้นฐาน การปรับตั้งค่า การจัดการกับบัญชีผู้ใช้งาน การจัดการกับไฟล์และแฟ้มข้อมูล การติดตั้งและใช้งานเครื่องให้บริการ การเชื่อมต่อและการทำงานบนเครื่องระยะไกล การปรับปรุงด้านความมั่นคง', 'Introduction to operating systems; operating system installation; basic commands; configurations; account management; file and directory management; server services installation; connecting and working on remote machines; server hardening', 'major-req', 1, 2),
  ('SC-112-105', '3(3-0-6)', 'กฎหมายและจรรยาบรรณทางวิชาชีพเทคโนโลยีสารสนเทศ', 'Law and Ethics for Information Technology', 'ความรู้เบื้องต้นทางกฎหมายเกี่ยวกับทรัพย์สินทางปัญญาและกฎหมายที่เกี่ยวกับเทคโนโลยีสารสนเทศ พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ.2562 การรับรองสถานะทางกฎหมายของข้อมูลทางอิเล็กทรอนิกส์ ลายมือชื่ออิเล็กทรอนิกส์และการรับรอง หลักเกณฑ์ในการจัดเก็บข้อมูลอิเล็กทรอนิกส์ที่ถูกต้องตามกฎหมาย การทำสัญญาที่มีข้อมูลเป็นอิเล็กทรอนิกส์ ธุรกิจบริการเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์ แนวคิดและความสำคัญของจริยธรรมและปรัชญาแห่งวิชาชีพเทคโนโลยีสารสนเทศ', 'Introduction to intellectual property laws and professional codes of conduct in information technology; Personal Data Protection Act B.E. 2562; certificates in digital information; digital signature and accreditation; principles of digital information collection by law; making contracts with digital information; digital information business; principles and significance of ethical issues in the information technology field; applying appropriate ethics to the IT profession', 'major-req', 1, 2),
  ('SC-112-201', '3(2-2-5)', 'การวิเคราะห์และออกแบบระบบสมัยใหม่', 'Modern System Analysis and Design', 'หลักการวิเคราะห์และออกแบบระบบ วงจรการพัฒนาระบบ การบริหารโครงการ เครื่องมือสนับสนุนการพัฒนาระบบสมัยใหม่ แบบจำลองของระบบงาน การออกแบบระบบ การออกแบบผลลัพธ์ การออกแบบส่วนติดต่อผู้ใช้ กรณีศึกษา', 'Study and practice of principles of system analysis and design; system development cycle; project management; modern system development support tools; model of work system; system design; output design; user interface design; case studies', 'major-req', 2, 1),
  ('SC-112-202', '3(2-2-5)', 'การเขียนโปรแกรมบนเว็บสมัยใหม่', 'Modern Dynamic Web Programming', 'พื้นฐานการทำงานของเว็บแอปพลิเคชัน การติดตั้งโปรแกรมเว็บเซิร์ฟเวอร์ การออกแบบและพัฒนาเว็บโดยใช้เฟรมเวิร์กที่เป็นปัจจุบัน (HTML, CSS, JavaScript, Bootstrap) PHP และ jQuery หรือ React เวอร์ชันที่เป็นปัจจุบัน การบริหารจัดการฐานข้อมูลด้วย MySQL หรือ PostgreSQL, MongoDB, SQLite กรณีศึกษา', 'The basics of web applications; installing a web server program; designing and developing the web using current framework tools (HTML, CSS, JavaScript, Bootstrap); PHP and jQuery or React up-to-date version; managing databases with MySQL or PostgreSQL, MongoDB, SQLite; case studies', 'major-req', 2, 1),
  ('SC-112-203', '3(2-2-5)', 'เครือข่ายคอมพิวเตอร์และความมั่นคง', 'Computer Network and Security', 'สถาปัตยกรรมเครือข่ายคอมพิวเตอร์และโพรโทคอล แบบจำลองอ้างอิงโอเอสไอ เครือข่ายบริเวณเฉพาะที่และบริเวณกว้าง โพรโทคอลทีซีพี/ไอพีและอินเทอร์เน็ต พื้นฐานการกำหนดที่อยู่ การแบ่งเครือข่ายย่อยและการจัดเส้นทาง โปรแกรมประยุกต์ด้านเครือข่ายและบริการอินเทอร์เน็ต หลักความมั่นคงเบื้องต้น ประเภทภัยคุกคาม กลไกการโจมตีและการป้องกัน นโยบายและการปฏิบัติเพื่อความมั่นคงของระบบ', 'Computer network architectures and protocols; OSI reference model; local area networks and wide area networks; TCP/IP protocol and the Internet; basics of addressing, subnetting and routing; network applications and internet services; basic security principles; types of attacks; attack mechanisms and defenses; security policies; authentication systems', 'major-req', 2, 1),
  ('SC-112-204', '3(2-2-5)', 'การจัดการโครงการ', 'Project Management', 'ความหมายของโครงการและความสำคัญของการบริหารโครงการ การวางแผนการดำเนินงานของโครงการ การสร้างกลุ่มงาน การกำหนดขอบเขตและบทบาทของสมาชิกกลุ่ม การจัดกำหนดการและทรัพยากร การประมาณค่าใช้จ่ายของโครงการ การสร้างแผนงานด้วยตารางปฏิบัติงาน เช่น GANTT, PERT และ CPM การวิเคราะห์และการประเมินผลโครงการเพื่อการตัดสินใจและการควบคุม', 'Project definition and significance of project management; project planning; project network and role of network members; project resource management; project cost estimation; using Gantt chart, PERT and CPM for project planning; project analysis and evaluation for decision making and monitoring', 'major-req', 2, 2),
  ('SC-112-205', '3(2-2-5)', 'การทำเหมืองข้อมูล', 'Data Mining', 'แนวคิดในการทำเหมืองข้อมูล กระบวนการทำเหมืองข้อมูล การเตรียมข้อมูล อัลกอริทึมเกี่ยวกับการทำเหมืองข้อมูล โปรแกรมที่ใช้ทำเหมืองข้อมูล หลักการและวิธีการทำเหมืองข้อมูลด้วยการจำแนกข้อมูล การจัดกลุ่ม และการหากฎความสัมพันธ์ การประยุกต์ใช้งานและกรณีศึกษา', 'Data mining concepts; data mining process; data preparation; algorithms on data mining; data mining programs; principles and methods of data mining with data classification, clustering and association rules mining; data mining applications and case studies', 'major-req', 2, 2),
  ('SC-112-206', '3(2-2-5)', 'ระบบสารสนเทศเพื่อการบริหารจัดการองค์กร', 'Information System for Organization Management', 'แนวคิดเกี่ยวกับระบบสารสนเทศเพื่อการจัดการ โครงสร้างของระบบสารสนเทศเพื่อการจัดการ ระบบสารสนเทศในองค์กร เทคโนโลยีในระบบสารสนเทศ ระบบการจัดการและระบบสนับสนุนในองค์กร การลงทุนด้านเทคโนโลยี การรักษาความปลอดภัยระบบสารสนเทศ กรณีศึกษา', 'Concepts of information systems management; structure of management information systems; information systems in organizations; technology in information systems; management and support systems in organizations; technology investment; information system security; case studies of information systems for managing and developing organizations', 'major-req', 2, 2),
  ('SC-112-207', '3(2-2-5)', 'การเขียนโปรแกรมขั้นสูง', 'Advance Programming', 'หลักและแนวคิดการเขียนโปรแกรมเชิงวัตถุ การพัฒนาโปรแกรมส่วนหน้าบ้าน (Front-end) และส่วนหลังบ้าน (Back-end) การพัฒนาโปรแกรมอย่างเต็มรูปแบบ การออกแบบและพัฒนาด้วยจาวาสคริปต์เฟรมเวิร์ก เช่น Laravel, React, Node.js, AngularJS หรือภาษาที่นิยมใช้ในปัจจุบัน การบริหารจัดการฐานข้อมูลที่นิยมใช้ในปัจจุบัน', 'Principles and concepts of object-oriented programming; front-end and back-end development; full-stack development; design and development with JavaScript frameworks such as Laravel, React, Node.js, AngularJS, or currently popular languages; managing currently used databases', 'major-req', 2, 2),
  ('SC-112-208', '3(2-2-5)', 'เวชระเบียนศาสตร์', 'Medical Record Science', 'ความรู้เบื้องต้นของเวชระเบียน แบบฟอร์มทางงานเวชระเบียน การเรียงแบบฟอร์มตามมาตรฐานสากล วิธีการให้เลขที่ การเก็บรักษาเวชระเบียน การตรวจสอบคุณภาพของเวชระเบียน การจัดระบบเวชระเบียนผู้ป่วยนอกและผู้ป่วยใน การจัดทำดรรชนีข้อมูลทางการแพทย์ การเก็บรวบรวมและนำเสนอข้อมูล การจัดการเวชระเบียนสำหรับผู้บริหารโรงพยาบาล และการจัดทำรายงานประจำเดือนและประจำปี', 'Overview of medical record; medical record forms; arranging forms according to international standards; methods for numbering; filing; medical record quality assurance; organizing medical record systems for outpatients and inpatients; medical indexing; collecting and presenting data; medical record management for hospital executives; and monthly and yearly reporting', 'major-req', 2, 2),
  ('SC-112-401', '3(0-9-5)', 'โครงงานเทคโนโลยีสารสนเทศทางการแพทย์ 1', 'Medical Information Technology Project 1', 'โครงงานเทคโนโลยีสารสนเทศทางการแพทย์สำหรับนักศึกษาปี 4 การเขียนโครงงาน การศึกษาความเป็นไปได้ เหตุผลความจำเป็นในการจัดทำโครงงาน การประเมินงบประมาณ การจัดการตารางเวลาทำงาน การวิเคราะห์ออกแบบระบบงาน การนำเสนอผลการดำเนินงาน', 'Medical information technology project for fourth-year students; writing project proposals; feasibility study; rationale and needs for the project; budget estimation; work scheduling; work system design analysis; project result presentation', 'major-req', 4, 1),
  ('SC-112-402', '3(0-9-5)', 'โครงงานเทคโนโลยีสารสนเทศทางการแพทย์ 2', 'Medical Information Technology Project 2', 'โครงงานเทคโนโลยีสารสนเทศทางการแพทย์สำหรับนักศึกษาปี 4 การพัฒนาระบบงาน การติดตั้งและทดสอบระบบงาน การเขียนรายงานโครงงาน และการนำเสนอโครงงาน', 'Medical information technology project for fourth-year students; work system development; setting up and testing the system; writing the project report and presentation', 'major-req', 4, 2),
  ('SC-113-301', '3(2-2-5)', 'ปัญญาประดิษฐ์', 'Artificial Intelligence', 'แนวคิดเกี่ยวกับปัญญาประดิษฐ์ วิธีการแก้ปัญหาทางปัญญาประดิษฐ์แบบต่าง ๆ วิธีการค้นหาคำตอบและการวางแผนงาน การแทนความรู้ในการแก้ปัญหา การประยุกต์ในด้านต่าง ๆ เช่น ระบบผู้ชำนาญการด้านเกม การประมวลผลภาษาธรรมชาติ การพิสูจน์ทฤษฎีบท การควบคุมหุ่นยนต์', 'Concepts of artificial intelligence; solving methods of different types of AI problems; methods of searching for solutions and planning; representation of knowledge to solve problems; applications in various fields such as game-specialist systems, natural language processing, theorem proving, robot control', 'track-a-req', 3, 1),
  ('SC-113-302', '3(2-2-5)', 'การประมวลผลภาษาธรรมชาติเบื้องต้น', 'Introduction to Natural Language Processing', 'การประมวลผลภาษาธรรมชาติ พื้นฐานของทฤษฎีและแบบจำลองทางคณิตศาสตร์สำหรับการประมวลผลภาษาธรรมชาติ อัลกอริทึมและกระบวนการ บทบาทของการประมวลผลภาษาธรรมชาติและการประยุกต์ใช้', 'Basics of Natural Language Processing (NLP); key concepts; levels of NLP; basic theories and mathematical models for NLP; algorithms and methods; their roles and NLP applications', 'track-a-req', 3, 1),
  ('SC-113-303', '3(2-2-5)', 'วิทยาศาสตร์ข้อมูลและการเรียนรู้ของเครื่อง', 'Data Science and Machine Learning', 'วิทยาศาสตร์ข้อมูลเบื้องต้น สถิติเบื้องต้นสำหรับวิทยาศาสตร์ข้อมูล การจัดการและสำรวจข้อมูล การเตรียมและแปลงข้อมูล การแสดงผลข้อมูล แนวคิดการเรียนรู้ของเครื่อง การเรียนรู้แบบมีผู้สอนและไม่มีผู้สอน การจำแนก การจัดกลุ่ม การเลือกแบบจำลองและการประเมินผล การประยุกต์ใช้กับกรณีศึกษา', 'Introduction to data science; basic statistics for data science; data management; exploratory data analysis; data preparation and transformation; data visualization; machine learning concepts; supervised and unsupervised learning; classification, clustering; model selection and evaluation; applying machine learning to case studies', 'track-a-req', 3, 1),
  ('SC-113-304', '3(2-2-5)', 'ระบบสมองกลฝังตัว', 'Embedded System', 'ระบบสมองกลฝังตัว โดยเน้นที่การสื่อสารระหว่างระบบต่าง ๆ การเชื่อมต่อกับภายนอก การประหยัดพลังงาน ความมั่นคงและเสถียรภาพ หลักการออกแบบ วิธีการ เครื่องมือที่ใช้ออกแบบ และกรณีศึกษา', 'Embedded systems, with emphasis on communication among distributed systems; interfacing with external environments; energy conservation; safety and reliability; the course covers design principles, methodologies, design tools, and case studies', 'track-a-req', 3, 1),
  ('SC-113-305', '3(2-2-5)', 'การเรียนรู้เชิงลึก', 'Deep Learning', 'โครงข่ายประสาทเทียม พีชคณิตเชิงเส้น แบ็กพรอพาเกชัน เรกูลาไรเซชัน การปรับจูนไฮเปอร์พารามิเตอร์ อัลกอริทึมสำหรับหาค่าที่เหมาะสมที่สุด โครงข่ายประสาทแบบคอนโวลูชัน โครงข่ายประสาทแบบเกิดซ้ำ หน่วยความจำระยะสั้นแบบยาว โครงข่ายเจนเนอเรทีฟแอดเวอร์ซาเรียล หลักการและสถาปัตยกรรมข้อมูลขนาดใหญ่สำหรับการเรียนรู้เชิงลึก', 'Artificial neural networks; linear algebra; backpropagation; regularization; hyperparameter tuning; optimization algorithms; convolutional neural networks; recurrent neural networks; long short-term memory; generative adversarial networks; big data principles and architecture for deep learning', 'track-a-req', 3, 2),
  ('SC-113-306', '3(2-2-5)', 'เทคโนโลยีบล็อกเชน', 'Blockchain Technology', 'พื้นฐานวิทยาการเข้ารหัสลับ วิทยาการเข้ารหัสลับแบบสมมาตรและอสมมาตร ฟังก์ชันแฮช การพิสูจน์ตัวจริง ลายเซ็นดิจิทัล เทคโนโลยีบล็อกเชน สกุลเงินดิจิทัล บริการพิสูจน์ทราบ สัญญาอัจฉริยะ ระบบ/บริการอัตโนมัติแบบกระจายศูนย์', 'Introduction to cryptography; symmetric and asymmetric cryptography; hash functions; authentication; digital signatures; blockchain technology; cryptocurrency; proof of services; smart contracts; decentralized autonomous systems/services', 'track-a-req', 3, 2),
  ('SC-113-307', '3(2-2-5)', 'ปัญญาประดิษฐ์และการวิเคราะห์ข้อมูลด้านสุขภาพ', 'Artificial Intelligence and Data Analytics for Health', 'ความรู้เบื้องต้นเกี่ยวกับปัญญาประดิษฐ์และการวิเคราะห์ข้อมูล คำสำคัญเกี่ยวกับปัญญาประดิษฐ์ วิธีการเรียนรู้ของเครื่อง การประยุกต์ใช้ปัญญาประดิษฐ์และการวิเคราะห์ข้อมูลด้านสุขภาพ กระบวนการประยุกต์ใช้ และการนำไปใช้คาดการณ์อนาคตเพื่อสุขภาพ', 'Introduction to AI and data analytics; AI terminology; Machine Learning (ML) methods; and the process of applying AI and data analytics for health; also includes applying AI and data analytics in forecasting the future in health', 'track-a-req', 3, 2),
  ('SC-113-308', '3(2-2-5)', 'การวิเคราะห์ข้อมูลเครือข่ายสังคมออนไลน์', 'Social Network Data Analytics', 'ทฤษฎีและหลักการวิเคราะห์ข้อมูลบนสื่อสังคมออนไลน์เบื้องต้น วิธีการสกัดข้อมูลขนาดใหญ่จากสื่อสังคมออนไลน์ วิธีการวิเคราะห์ข้อความบนสื่อสังคมออนไลน์ การประยุกต์ใช้สำหรับองค์กรและธุรกิจ', 'Introduction to theories and principles of data analysis on social media; extracting big data from social media; analyzing text on social media; applications for corporations and businesses', 'track-a-req', 3, 2),
  ('SC-113-317', '3(2-2-5)', 'การวิเคราะห์ข้อมูลขนาดใหญ่', 'Big Data Analytics', 'หลักการและเทคนิคในการวิเคราะห์ข้อมูลขนาดใหญ่และการนำไปประยุกต์ใช้กับธุรกิจ การใช้โปรแกรมประยุกต์และเครื่องมือช่วยในการวิเคราะห์ข้อมูล การสร้าง Visualization เชิงธุรกิจในรูปแบบต่าง ๆ เช่น กราฟ แผนภูมิ', 'Principles and techniques for big data analysis; application and tools for data analytics; principles of data analysis and visualization for business such as graphs and charts', 'track-a-elec', 3, NULL),
  ('SC-113-318', '3(2-2-5)', 'อินเตอร์เน็ตของทุกสรรพสิ่ง', 'Internet of Things', 'หลักการเบื้องต้นและแนวโน้มในเรื่องอินเทอร์เน็ตของทุกสรรพสิ่ง (IoT) กรณีศึกษาการใช้งาน การออกแบบและสร้างอุปกรณ์เชื่อมต่อทางคอมพิวเตอร์ การเชื่อมโยงสื่อสารผ่านระบบบริการอินเทอร์เน็ต ประสบการณ์ผู้ใช้และความปลอดภัยของระบบ', 'Introduction and trends of the Internet of Things (IoT); case studies of using IoT; designing and building connected computing devices; integrating internet services; system user experience; system security', 'track-a-elec', 3, NULL),
  ('SC-113-319', '3(2-2-5)', 'ศาสตร์แห่งการประมวลผลภาพดิจิทัล', 'Science of Digital Image Processing', 'แนวคิดและวิธีการสำหรับการประมวลผลภาพดิจิทัล การสร้างภาพ การหาขอบภาพและการแยกแยะภาพ การมองภาพในสองมิติ วิธีการรับเข้าและส่งออกภาพ ระบบสี การกรองภาพ การแปลงรูปและการแยกแถบสี การปรับปรุงคุณสมบัติของภาพ และการประยุกต์ใช้งานด้านการประมวลผลภาพ', 'A study of concepts and methods for digital image processing; image formation; edge detection and image discrimination; two-dimensional visualization; import and export of images; color systems; image filtering; transformation and color band separation; image enhancement; and applications of image processing', 'track-a-elec', 3, NULL),
  ('SC-113-320', '3(2-2-5)', 'หุ่นยนต์และระบบอัตโนมัติ', 'Robotics and Automation', 'เทคโนโลยีหุ่นยนต์ วิทยาการพัฒนาหุ่นยนต์ ส่วนการควบคุม ส่วนการรับรู้ ส่วนการเข้าใจ ส่วนการใช้งานระบบอัตโนมัติ การประยุกต์หุ่นยนต์และระบบอัตโนมัติกับงานเฉพาะด้าน', 'Robotics technology; robotics development science; control, perception, and understanding components; automation components; applications of robotics and automation for specialized tasks', 'track-a-elec', 3, NULL),
  ('SC-113-321', '3(2-2-5)', 'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่', 'Software Development on Mobile Devices', 'แนวคิดพื้นฐานของการพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่ สถาปัตยกรรมฮาร์ดแวร์และระบบปฏิบัติการสำหรับอุปกรณ์เคลื่อนที่ การพัฒนาโปรแกรมประยุกต์แบบข้ามแพลตฟอร์ม การออกแบบส่วนต่อประสานผู้ใช้ การเชื่อมต่อฐานข้อมูลและเว็บเซิร์ฟเวอร์ การใช้ข้อมูลพิกัดตำแหน่งและการทดสอบโปรแกรมผ่านเครื่องจำลอง', 'Basic concepts of application development for mobile devices; hardware architecture; mobile operating system architecture; cross-platform application development; user interface design; database and web server connectivity; location-based data usage; application testing via simulators', 'track-a-elec', 3, NULL),
  ('SC-113-322', '3(2-2-5)', 'ปัญญาประดิษฐ์และการวิเคราะห์ข้อมูลในงานธุรกิจ', 'Artificial Intelligence and Data Analytics for Business', 'ความรู้เบื้องต้นเกี่ยวกับปัญญาประดิษฐ์และการวิเคราะห์ข้อมูล คำสำคัญเกี่ยวกับปัญญาประดิษฐ์ วิธีการเรียนรู้ของเครื่อง การประยุกต์ใช้ปัญญาประดิษฐ์และการวิเคราะห์ข้อมูลในงานธุรกิจ และการนำไปใช้คาดการณ์อนาคตทางธุรกิจ', 'Introduction to AI and data analytics; AI terminology; Machine Learning (ML) methods; and the process of applying AI and data analytics in business; also includes applying AI and data analytics in forecasting the future of business', 'track-a-elec', 3, NULL),
  ('SC-113-323', '3(2-2-5)', 'ปัญญาประดิษฐ์สำหรับการดำรงชีวิตและการทำงานด้านวิทยาศาสตร์และเทคโนโลยี', 'Artificial Intelligence for Living and Working in Sciences and Technologies', 'แนวคิดพื้นฐาน ประเภท และกลไกของปัญญาประดิษฐ์ แอปพลิเคชันและประสิทธิภาพของปัญญาประดิษฐ์ในการดำรงชีวิต การทำงานด้านวิทยาศาสตร์และเทคโนโลยี การใช้งานเครื่องมือทางปัญญาประดิษฐ์และการประยุกต์ใช้ผ่านกรณีศึกษา', 'Basic concepts, types, and mechanisms of artificial intelligence; applications and performance of AI in daily life; science and technology work; using AI tools; applying AI to work through case studies', 'track-a-elec', 3, NULL),
  ('SC-113-324', '3(2-2-5)', 'ปัญญาประดิษฐ์สำหรับการเกษตร', 'Artificial Intelligence for Agriculture', 'ความรู้เบื้องต้นเกี่ยวกับปัญญาประดิษฐ์ การวิเคราะห์ข้อมูล คำสำคัญเกี่ยวกับปัญญาประดิษฐ์ วิธีการเรียนรู้ของเครื่อง การประยุกต์ใช้ปัญญาประดิษฐ์และการวิเคราะห์ข้อมูลการเกษตร และการนำไปใช้คาดการณ์อนาคตด้านการเกษตร', 'Introduction to Artificial Intelligence; data analysis; AI terminology; machine learning; application of AI and agricultural data analysis; applying AI and data analytics to predict the future of agriculture', 'track-a-elec', 3, NULL),
  ('SC-113-309', '3(2-2-5)', 'เทคโนโลยีคอมพิวเตอร์ทางการแพทย์', 'Medical Computer Technology', 'พื้นฐานของการจัดองค์ประกอบและสถาปัตยกรรมระบบคอมพิวเตอร์ องค์ประกอบของคอมพิวเตอร์พื้นฐาน การแสดงผลของข้อมูล การจัดองค์ประกอบและสถาปัตยกรรมของหน่วยความจำ ระบบอุปกรณ์นำเข้าและแสดงผล หน่วยจัดเก็บข้อมูล หน่วยประมวลผลกลางและอุปกรณ์ต่อพ่วงที่ใช้ในสารสนเทศทางการแพทย์', 'Fundamentals of computer organization and architecture; basic computer components; data representation; memory system organization and architecture; input and output systems; storage systems; CPU and additional computing units used in medical information', 'track-b-req', 3, 1),
  ('SC-113-310', '3(2-2-5)', 'ระบบสารสนเทศทางการแพทย์และสาธารณสุข', 'Medical and Public Health Information System', 'ระบบสารสนเทศทางการแพทย์และสาธารณสุข งานเวชระเบียน งานพยาบาลหน้าห้องตรวจ งานห้องแพทย์ งานห้องผ่าตัด งานทันตกรรม งานหอผู้ป่วยใน งานคลังยาและเวชภัณฑ์ งานห้องปฏิบัติการ งานโภชนาการ งานการเงิน และงานตรวจสุขภาพ', 'Medical and public health information systems; medical records; nursing at the examination room; medical rooms; operating room work; dental work; inpatient work; drug and medical inventory work; laboratory work; nutrition work; financial work; health checkups', 'track-b-req', 3, 1),
  ('SC-113-311', '3(2-2-5)', 'ระบบผู้เชี่ยวชาญทางการแพทย์', 'Medical Expert System', 'ส่วนประกอบของระบบผู้เชี่ยวชาญ การวินิจฉัยปัญหา การวางแผนและการควบคุมการแทนความรู้ ฐานความรู้ การเสาะหาความรู้ ความไม่แน่นอนของกลไกตัดสินใจ ระบบอิงกฎเกณฑ์และระบบอิงกรอบ กรณีศึกษาด้านการพัฒนาระบบผู้เชี่ยวชาญทางการแพทย์', 'Components of expert systems; expert systems in problem solving; planning and control; knowledge representation; knowledge base; knowledge searching; uncertainty of decision-making mechanisms; rule-based and frame-based systems; case studies in medical expert system design', 'track-b-req', 3, 1),
  ('SC-113-312', '3(2-2-5)', 'การบริหารฐานข้อมูลในงานสุขภาพ', 'Database Administration for Healthcare', 'การบริหารฐานข้อมูลในงานสุขภาพ การติดตั้งและปรับปรุงระบบจัดการฐานข้อมูล มาตรฐานและขั้นตอนการปฏิบัติงานด้านฐานข้อมูล พื้นฐานความมั่นคงของฐานข้อมูล การให้และยกเลิกสิทธิ์ในการเข้าถึงฐานข้อมูลในงานสุขภาพ กลไกการรักษาความมั่นคงด้วยวิวและสตอร์โพรซีเยอร์ การตรวจสอบความมั่นคง และตัวอย่างการบริหารฐานข้อมูลในหน่วยงานทางการแพทย์', 'Database management in healthcare; installing and upgrading the DBMS; database standards and procedures; database security basics; granting and revoking access authority to healthcare databases; database security mechanisms using views and stored procedures; database auditing; examples of database administration in healthcare', 'track-b-req', 3, 2),
  ('SC-113-313', '3(2-2-5)', 'การวิเคราะห์ข้อมูลความสัมพันธ์ทางสุขภาพ', 'Data Analysis of Health Relationships', 'การวิเคราะห์ทางสถิติพื้นฐาน การแปลผลและการอนุมานพื้นฐานทางสถิติ ภาพรวมของเทคนิคในห้องปฏิบัติการที่เกี่ยวข้องกับเทคโนโลยีสารสนเทศทางการแพทย์ การวิเคราะห์ข้อมูลทางการแพทย์โดยโปรแกรมคอมพิวเตอร์ แนวคิดการนำเทคโนโลยีไปใช้สำหรับการแพทย์เฉพาะบุคคลและการสาธารณสุข', 'Fundamental statistical analysis; interpretation of statistical results and basic statistical inference; an overview of laboratory techniques related to medical information technology; analysis of medical data by computer program; concept of applying technology for personalized medicine and public health', 'track-b-req', 3, 2),
  ('SC-113-314', '3(2-2-5)', 'เทคโนโลยีความจริงเสมือนและความจริงเสริมทางการแพทย์', 'Virtual Reality and Augmented Reality Technology for Medicine', 'นิยามของความเป็นจริงเสมือนและการประยุกต์ใช้สำหรับสื่อและนวัตกรรมทางการแพทย์ อุปกรณ์ที่เกี่ยวข้องกับความเป็นจริงเสมือน เทคนิคที่ใช้ในการออกแบบและพัฒนาความจริงเสมือนและความจริงเสริม กระบวนการรู้จำภาพและการติดตามเพื่อเสริมการใช้งานภาพวัตถุ 3 มิติ การเพิ่มความสมจริงในการแสดงผลทางการแพทย์', 'Definitions of Virtual Reality (VR) and Augmented Reality (AR) for applications in medical media and innovation; devices used in VR and AR; techniques for designing and developing VR/AR applications; image recognition and tracking process to enrich images with 3D objects; improving realism in VR/AR for medical innovation', 'track-b-req', 3, 2),
  ('SC-113-315', '3(2-2-5)', 'การวิเคราะห์ภาพถ่ายทางการแพทย์', 'Medical Image Analytics', 'แนวคิดในการวิเคราะห์ภาพถ่ายและการสร้างภาพนิทัศน์ทางการแพทย์ ประเภทการเก็บข้อมูลและระบบพิกัดของรูป การควบคุมคุณภาพ การแก้ไขความเข้มของภาพ การลงทะเบียนและการแบ่งกลุ่มภาพ การแบ่งกลุ่มด้วยแบบจำลอง และกรณีศึกษา', 'Concepts of medical image analysis and visualization; data storage types and coordinate systems; quality control; intensity correction; registration and segmentation; model-based segmentation; and case studies', 'track-b-req', 3, 2),
  ('SC-113-316', '3(2-2-5)', 'การเขียนโปรแกรมทางเวชระเบียน', 'Medical Record Programming', 'การเขียนโปรแกรมทางเวชระเบียนเบื้องต้น หลักการทำงานของเวิลด์ไวด์เว็บ การเขียนโปรแกรมด้วยภาษา PHP การใช้ตัวแปร การควบคุมโปรแกรม การสร้างและใช้งานฟังก์ชัน การทำงานกับข้อมูลชนิดต่าง ๆ การสร้างแบบฟอร์มรับข้อมูลจากผู้ใช้ การตรวจสอบข้อมูล การเขียนโปรแกรมเชิงวัตถุ การสร้างรูปภาพกราฟิก', 'Introduction to medical record programming; World Wide Web concepts; PHP programming; variables; program control; creating and using functions; working with various data types; creating data-entry forms; form data validation; object-oriented programming; graphic image creation', 'track-b-req', 4, NULL),
  ('SC-113-325', '3(2-2-5)', 'การพัฒนาแอปพลิเคชันทางการแพทย์', 'Development of Mobile Medical Applications', 'เทคโนโลยีของอุปกรณ์เคลื่อนที่สมัยใหม่ การติดตั้งโปรแกรมสำหรับพัฒนาแอปพลิเคชัน การออกแบบและพัฒนาแอปพลิเคชันบนอุปกรณ์เคลื่อนที่ด้วยจาวาสคริปต์เฟรมเวิร์ก หลักการและการเขียนเอพีไอ การเชื่อมต่อแอปพลิเคชันกับฐานข้อมูล กรณีศึกษาแอปพลิเคชันทางการแพทย์และสาธารณสุข', 'Modern mobile technology; installing programs for application development; designing and developing mobile applications with JavaScript frameworks; API principles and writing; connecting the application to a database; medical and public health application case studies', 'track-b-elec', 3, NULL),
  ('SC-113-326', '3(2-2-5)', 'ระบบแนะนำข้อมูลทางสุขภาพ', 'Health Recommendation System', 'แนวคิดพื้นฐานของระบบแนะนำข้อมูล การแนะนำแบบมีส่วนร่วม การแนะนำแบบอิงเนื้อหา การแนะนำแบบไฮบริด การแนะนำข้อมูลแบบวิธีอื่น การประเมินระบบแนะนำ กรณีศึกษาของระบบแนะนำทางสุขภาพ', 'Introduction to basic concepts of recommendation systems; collaborative recommendation; content-based recommendation; hybrid recommendation; other recommendation methods; evaluation of recommendation systems; case studies of health recommendation systems', 'track-b-elec', 3, NULL),
  ('SC-113-327', '3(2-2-5)', 'ระบบข้อมูลข่าวสารทางการแพทย์และสาธารณสุข', 'Medical and Health Information System', 'แหล่งที่มาของข้อมูลและระบบข้อมูลข่าวสารของการแพทย์และสาธารณสุข การพัฒนาการจัดระเบียนข้อมูลด้านสถิติการเจ็บป่วย การจัดการข้อมูลทางการแพทย์และสาธารณสุข ระบบการจดทะเบียนสถิติชีพ แบบบันทึกสุขภาพ ระบบเวชระเบียน การบันทึกสาเหตุการตายและโรคระบาด การออกแบบและเขียนรายงานเพื่อการบริหาร', 'The origin of medical and health data and information systems; the development of patient record organization; medical and health management information systems; vital record registration systems; health record systems; medical record systems; recording cause of death and epidemiology; designing and writing management reports', 'track-b-elec', 3, NULL),
  ('SC-113-328', '3(2-2-5)', 'อินเทอร์เน็ตของสรรพสิ่งเพื่องานประยุกต์ทางสุขภาพ', 'Internet of Things for Healthcare Applications', 'ภาพรวมเทคโนโลยีอินเทอร์เน็ตของสรรพสิ่ง การประยุกต์ใช้งานทางด้านสุขภาพ เซนเซอร์ทางสุขภาพ ระบบปฏิบัติการสำหรับระบบฝังตัว การสื่อสารที่มีความน่าเชื่อถือสำหรับอินเทอร์เน็ตของสรรพสิ่ง การพัฒนาโปรแกรมประยุกต์ และกรณีศึกษาทางสุขภาพ', 'Overview of Internet of Things technology; healthcare applications; medical sensors; embedded operating system technology; reliable communication protocols for IoT; application development; and healthcare case studies', 'track-b-elec', 3, NULL),
  ('SC-113-329', '3(2-2-5)', 'การสร้างภาพนิทัศน์สารสนเทศทางการแพทย์', 'Data Visualization for Medicine', 'หลักการสร้างภาพนิทัศน์จากข้อมูล การรับรู้ทางทัศนะของมนุษย์ การจับผิดภาพนิทัศน์ การออกแบบภาพนิทัศน์ การสร้างภาพนิทัศน์สำหรับข้อมูลแบบกลุ่ม และหลักการสร้างแดชบอร์ด', 'Introduction to data visualization; human visual perception; spotting misleading visualizations; visualization design; visualization for categorical data; and dashboard construction', 'track-b-elec', 3, NULL),
  ('SC-113-330', '3(2-2-5)', 'การทำเหมืองข้อความทางการแพทย์', 'Medical Text Analytics', 'ความรู้เบื้องต้นในการทำเหมืองข้อความ แก่นของการดำเนินการในการทำเหมืองข้อความ เทคนิคการเตรียมข้อมูล การประยุกต์ใช้ในการจัดประเภทข้อความ การจัดกลุ่มในการวิเคราะห์ข้อความ และการประยุกต์ด้านเหมืองข้อความทางการแพทย์', 'Introduction to text mining; core text mining operations; text mining preprocessing techniques; applications of text categorization; clustering tasks in text analysis; text mining applications in medicine', 'track-b-elec', 3, NULL),
  ('SC-115-301', '1(0-3-0)', 'การเตรียมฝึกประสบการณ์วิชาชีพ', 'Preparation for Professional Internship', 'กิจกรรมเพื่อเตรียมความพร้อมของผู้เรียนก่อนออกฝึกงานภาคอุตสาหกรรม การรับรู้ลักษณะและโอกาสของการประกอบอาชีพ การพัฒนาความรู้ ทักษะ เจตคติ แรงจูงใจ และคุณลักษณะที่เหมาะสมกับวิชาชีพ ผ่านสถานการณ์หรือรูปแบบต่างๆ ที่เกี่ยวข้องกับวิชาชีพนั้น ๆ', 'Activities to prepare students before industrial training; perceiving the nature and opportunities of career paths; developing students\' knowledge, skills, attitude, motivation and characteristics appropriate to the profession using various situations related to that profession', 'internship', 3, 2),
  ('SC-115-401', '6(0-30-0)', 'การเรียนรู้ภาคปฏิบัติเทคโนโลยีสารสนเทศทางการแพทย์ 1', 'Medical Information Technology Operational Learning 1', 'การเรียนรู้ภาคปฏิบัติทางเทคโนโลยีสารสนเทศทางการแพทย์ ลักษณะขององค์กร การปฏิบัติตามแนวทางจริยธรรมธุรกิจและข้อพึงปฏิบัติในการทำงาน การปฏิบัติงานขั้นพื้นฐานตามมาตรฐานที่องค์กรกำหนด ภายใต้การดูแลของพนักงานพี่เลี้ยงจากสถานประกอบการ และมีการประเมินผลตามความร่วมมือของสถานประกอบการและมหาวิทยาลัย', 'Practical medical information technology learning; organizational characteristics; following business ethics guidelines and work practices; performing basic tasks according to organizational standards under the supervision of a mentor from the establishment; performance evaluated in cooperation with the establishment and the university', 'internship', 4, 1),
  ('SC-115-402', '6(0-30-0)', 'การเรียนรู้ภาคปฏิบัติเทคโนโลยีสารสนเทศทางการแพทย์ 2', 'Medical Information Technology Operational Learning 2', 'การเรียนรู้ภาคปฏิบัติทางเทคโนโลยีสารสนเทศทางการแพทย์ขั้นสูงอย่างเป็นระบบจากสถานประกอบการ การเรียนรู้และปรับตัวให้เข้ากับระบบขององค์กร เพื่อนร่วมงาน และผู้ใช้บริการในสภาพการทำงานจริง ครอบคลุมการให้บริการด้านเทคโนโลยีสารสนเทศ และมีการประเมินผลตามความร่วมมือของสถานประกอบการและมหาวิทยาลัย', 'Systematic advanced practical learning in medical information technology from the establishment; learning and adapting to the organization\'s systems, colleagues, and users in real working conditions; covering information technology services; performance evaluated in cooperation with the establishment and the university', 'internship', 4, 2),
  ('SC-114-301', '3(2-2-5)', 'ผู้ประกอบการเทคโนโลยี', 'Information Technology Entrepreneur', 'กระบวนการในการเริ่มต้นเป็นผู้ประกอบการ ปัจจัยความสำเร็จของผู้ประกอบการ การประเมินและตระหนักถึงโอกาสทางธุรกิจ กลยุทธ์สำหรับการก่อตั้งและพัฒนาการลงทุนทางธุรกิจ รูปแบบการลงทุนแบบใหม่สำหรับวิสาหกิจขนาดกลางและขนาดย่อม รวมถึงองค์กรขนาดใหญ่', 'Process of becoming an entrepreneur; success factors of entrepreneurs; evaluation and awareness of business opportunities; strategies for establishing and developing business investment; new forms of investment for small and medium enterprises as well as large organizations', 'free-elec', NULL, NULL),
  ('SC-114-302', '3(2-2-5)', 'การตลาดดิจิทัล', 'Digital Marketing', 'ความรู้เบื้องต้นเกี่ยวกับการตลาดดิจิทัล การวิเคราะห์สถานการณ์ทางการตลาด กระบวนการจัดการทางการตลาด ระบบสารสนเทศทางการตลาด กลยุทธ์และแผนการตลาดดิจิทัล ช่องทางและเทคโนโลยีโฆษณาดิจิทัล การเลือกตลาดเป้าหมายและการวางตำแหน่งผลิตภัณฑ์', 'Introduction to digital marketing; analysis of marketing situations; marketing management process; marketing information systems; digital marketing strategy and plan; digital marketing channels and advertising technologies; target marketing and positioning; product, pricing and promotion management', 'free-elec', NULL, NULL),
  ('SC-114-303', '3(2-2-5)', 'การจัดเก็บและค้นคืนสารสนเทศ', 'Information Storage and Retrieval', 'วิธีการและเทคโนโลยีในการจัดเก็บและเรียกดูสารสนเทศที่อยู่ในรูปเอกสาร รูปภาพ เสียง และภาพเคลื่อนไหว การวิเคราะห์ลักษณะของสารสนเทศ ความคล้ายคลึงของเอกสาร หลักการกำหนดดัชนี วิธีการหาคู่เหมือน และการจัดเก็บค้นคืนสารสนเทศในสื่อรูปแบบต่าง ๆ', 'Methods and technologies for storing and retrieving information in documents, images, audio and video; analysis of information characteristics; similarity between documents; indexing principles; matching methods; storage and retrieval of information across various media', 'free-elec', NULL, NULL),
  ('SC-114-304', '3(2-2-5)', 'การตัดต่อภาพวิดิทัศน์ดิจิทัล', 'Digital Video Editing and Composing', 'กระบวนการและหลักการนำเสนองานด้านการจัดลำดับและการตัดต่อภาพโดยใช้โปรแกรมคอมพิวเตอร์ เน้นการใช้เทคนิคพิเศษ การเลเยอร์และคีย์อิง เอฟเฟกต์ การควบคุมการเคลื่อนไหวและการติดตาม การปรับสี และการนำความรู้ไปประยุกต์ใช้กับงานจริง', 'Methods of composing computer-generated imagery and live images, layering, keying and matting, effects creation, motion control and tracking, image manipulation, retouching, and color correction; applying these tools to develop skills and presentations with meaningful effects', 'free-elec', NULL, NULL),
  ('SC-114-305', '3(2-2-5)', 'การประมวลผลแบบคลาวด์และการใช้งาน', 'Cloud Computing and Implementation', 'สถาปัตยกรรมต่างๆ บนคลาวด์ เช่น SaaS, PaaS, IaaS คลาวด์ส่วนตัว ชุมชนคลาวด์ และคลาวด์สาธารณะ เทคโนโลยีที่ใช้งานกับคลาวด์ เช่น เวอร์ชวลไลเซชัน คลาวด์สตอเรจ ความมั่นคงปลอดภัยบนคลาวด์ มาตรฐานด้านความมั่นคงปลอดภัยสารสนเทศ และวิธีการเคลื่อนย้ายข้อมูลไปสู่คลาวด์', 'Cloud architectures such as SaaS, PaaS, IaaS, private cloud, community cloud, and public cloud; cloud-related technology such as virtualization and cloud storage; cloud security including information security regulations and standards, data protection, incident response, and migration methodology', 'free-elec', NULL, NULL),
  ('SC-114-306', '3(2-2-5)', 'การออกแบบและการบริหารเครือข่ายคอมพิวเตอร์', 'Computer Network Design and Administration', 'ชนิดของอุปกรณ์เครือข่ายและการเชื่อมต่อ การวิเคราะห์และออกแบบโครงสร้างเครือข่าย โพรโทคอลจัดเส้นทาง การออกแบบระบบสวิตชิง VLAN, VPN เครือข่ายไร้สายและเครือข่ายบริเวณกว้าง การตั้งค่าและบริหารจัดการอุปกรณ์เครือข่าย การควบคุมการเข้าถึง และการบริหารประสิทธิภาพและความปลอดภัย', 'Types of network devices and interconnection; network topology analysis and design; routing protocols; design and configuration of switching systems, VLAN, VPN, wireless and wide area networks; router configuration and network device management; access control; performance and security management', 'free-elec', NULL, NULL),
  ('SC-114-307', '3(2-2-5)', 'เครือข่ายคอมพิวเตอร์ไร้สาย', 'Wireless Computer Network', 'การทำงานพื้นฐานของเทคโนโลยีเครือข่ายไร้สายชนิดต่างๆ โดยเน้นเครือข่ายไร้สายท้องถิ่นผ่านโพรโทคอล IEEE 802.11, RFID, Bluetooth และเครือข่ายไร้สายอื่น ๆ กลไกการเข้าถึงสื่อกลาง ความมั่นคงปลอดภัย การสำรวจไซต์ และการออกแบบเครือข่ายไร้สาย', 'Basic operation of various wireless network technologies, focusing on wireless LAN via IEEE 802.11, RFID, Bluetooth and other wireless networks; media access control mechanisms, framing, security, site surveys, and wireless LAN design', 'free-elec', NULL, NULL),
  ('SC-114-308', '3(2-2-5)', 'ระบบแบบกระจาย', 'Distributed System', 'ระบบแบบกระจาย สถาปัตยกรรมและรูปแบบของการเปลี่ยนแปลง เป้าหมายของการออกแบบ ลักษณะเฉพาะของการเรียกกระบวนคำสั่งระยะไกล การให้บริการแฟ้มข้อมูล ไดเรกทอรี ฐานข้อมูลและรายการเปลี่ยนแปลง การป้องกันและรักษาความมั่นคง และกรณีศึกษา', 'Distributed systems; architectural and transaction models and design goals; characteristics of remote procedure calling; file, directory, database and transaction services; collaborating servers and file replication; protection and security; case studies in distributed systems', 'free-elec', NULL, NULL),
  ('SC-114-309', '3(2-2-5)', 'ศูนย์กลางข้อมูลและเทคโนโลยีการจำลองเครื่องเสมือน', 'Data Center and Virtualization Technology', 'การออกแบบศูนย์กลางข้อมูล ความมั่นคงปลอดภัยของศูนย์กลางข้อมูล การแบ่งภาระของเครื่องแม่ข่าย โพรโทคอลของกลุ่มเครื่องแม่ข่าย การจัดการเครื่องแม่ข่าย และประสิทธิภาพของอุปกรณ์ในศูนย์กลางข้อมูล', 'Data center design; data center security; server load balancing; server farm protocols; essential network protocols; server management; performance of data center devices', 'free-elec', NULL, NULL),
  ('SC-114-310', '3(2-2-5)', 'คอมพิวเตอร์กราฟิก', 'Computer Graphics', 'หลักการพื้นฐานและขั้นตอนวิธีซึ่งเป็นรากฐานของคอมพิวเตอร์กราฟิก กระบวนการแรสเตอร์ การแสดงผลปฐมฐานกราฟิก วิวพอร์ต การแปลงเชิงสัมพรรคทางเรขาคณิต การให้แสงและระดับสี การแทนซีนกราฟ และการสร้างภาพเคลื่อนไหวด้วยคอมพิวเตอร์เบื้องต้น', 'Fundamental principles and algorithms underlying computer graphics; graphics processing pipeline; rasterization; primitive graphical output; viewport; geometric affine transformation; graphics programming; lighting and shading; scene graph representation; introduction to computer animation', 'free-elec', NULL, NULL),
  ('SC-114-311', '3(2-2-5)', 'การออกแบบและพัฒนาเกม', 'Game Design and Development', 'การออกแบบและเครื่องมือการพัฒนาเกมคอมพิวเตอร์เบื้องต้น ระบบและเครื่องมือกราฟิกที่ใช้ในเกม สถาปัตยกรรมเกม กระบวนวิธีในการออกแบบเกม การออกแบบปัญญาประดิษฐ์ในเกมและการนำไปใช้ เทคโนโลยีเกมออนไลน์และแนวโน้มเทคโนโลยีใหม่ที่มีผลกระทบต่อการออกแบบเกม', 'Introduction to game design and development tools; graphics systems and tools used in games; game architecture; game design methodology; AI design and implementation in games; online and network game technologies; potential future technology and its impact on game design', 'free-elec', NULL, NULL),
  ('SC-114-312', '3(2-2-5)', 'จักรวาลนฤมิต', 'Metaverse', 'วิวัฒนาการและเทคโนโลยีของจักรวาลนฤมิต การเงินและเศรษฐศาสตร์ของจักรวาลนฤมิต การนำบล็อกเชนมาใช้ในจักรวาลนฤมิต เครื่องมือที่จำเป็นในการสร้างจักรวาลนฤมิต และกรณีศึกษา', 'Evolution and technologies of the Metaverse; finance and economics of the Metaverse; blockchain adoption in the Metaverse; tools required to build the Metaverse; case studies', 'free-elec', NULL, NULL),
  ('SC-114-313', '3(2-2-5)', 'หัวข้อพิเศษ', 'Special Topic', 'หัวข้อทางด้านการพัฒนาและดำเนินงานทางเทคโนโลยีสารสนเทศที่น่าสนใจ เป็นประโยชน์ หรือเป็นที่ต้องการในตลาดแรงงาน', 'Topics in the development and operation of information technology that are interesting, useful, or in demand in the labor market', 'free-elec', NULL, NULL),
  ('SC-114-314', '3(2-2-5)', 'เทคนิคการพยากรณ์เบื้องต้น', 'Introduction to Forecasting Techniques', 'ความรู้เบื้องต้นเกี่ยวกับการพยากรณ์เชิงปริมาณ คุณสมบัติและชนิดของข้อมูลอนุกรมเวลา วิธีการพยากรณ์โดยการปรับให้เรียบแบบค่าเฉลี่ยเคลื่อนที่และแบบเอกซ์โพเนนเชียล วิธีการพยากรณ์แบบปรับตัว เทคนิคการพยากรณ์แบบบอกซ์-เจนกินส์ และการใช้โปรแกรมสำเร็จรูปทางสถิติ', 'Introduction to quantitative forecasting; features and types of time series data; forecasting methods using moving average and exponential smoothing; adaptive forecasting techniques; Box-Jenkins forecasting technique; and use of statistical software packages', 'free-elec', NULL, NULL);

INSERT INTO plos (no, title, description, sort_order) VALUES
  (1, 'คุณธรรมจริยธรรม มีจรรยาบรรณทางวิชาชีพ', 'มีความมุ่งมั่นพัฒนา จิตอาสา มีวินัยตรงต่อเวลา แสดงหน้าที่ความรับผิดชอบต่อตนเอง สังคม และจริยธรรมที่จำเป็นสำหรับการปฏิบัติงานด้านเทคโนโลยีสารสนเทศทางการแพทย์', 1),
  (2, 'ทักษะความรู้เชิงวิชาชีพ', 'มีความรู้ความเข้าใจพื้นฐานระบบสารสนเทศ เครือข่ายคอมพิวเตอร์ การพัฒนาซอฟต์แวร์ ฮาร์ดแวร์ และการประยุกต์ใช้เทคโนโลยีสารสนเทศทางการแพทย์เพื่อแก้โจทย์เฉพาะด้านในอุตสาหกรรมเป้าหมาย', 2),
  (3, 'ทักษะการคิดวิเคราะห์', 'สามารถแยกแยะลักษณะของข้อมูล ความสัมพันธ์ วิเคราะห์ข้อมูล และใช้เครื่องมือที่เหมาะสม นำไปสู่การแก้โจทย์ปัญหาเฉพาะด้านได้', 3),
  (4, 'ทักษะการเรียนรู้ด้วยตนเอง', 'แสดงความสามารถในการเป็นผู้เรียนรู้ตลอดชีวิต โดยค้นคว้าหาความรู้ใหม่และปรับปรุงทักษะวิชาชีพของตนเองให้ทันสมัยอยู่เสมอ', 4),
  (5, 'ทักษะการสื่อสารไทยและอังกฤษ', 'มีความสามารถในการสื่อสารและกระตุ้นให้ทีมเกิดความร่วมมือในการคิดและลงมือทำร่วมกัน รวมทั้งโน้มน้าวและประสานความขัดแย้งที่เกิดขึ้นได้', 5);

INSERT INTO plo_subs (plo_id, text, sort_order) VALUES
  ((SELECT id FROM plos WHERE no=1 LIMIT 1), 'พัฒนาวิธีการใช้เทคโนโลยีสารสนเทศแก้ปัญหาภายใต้จรรยาบรรณวิชาชีพ', 0),
  ((SELECT id FROM plos WHERE no=1 LIMIT 1), 'เข้าใจและอธิบายหัวข้อความซื่อสัตย์ ความรับผิดชอบที่เกี่ยวข้องกับวิชาชีพ', 1),
  ((SELECT id FROM plos WHERE no=1 LIMIT 1), 'ประยุกต์ใช้ความรู้ด้านจริยธรรมและกฎหมายที่เกี่ยวข้องกับ MedIT', 2),
  ((SELECT id FROM plos WHERE no=2 LIMIT 1), 'อธิบายพื้นฐานระบบสารสนเทศและเครือข่ายคอมพิวเตอร์เพื่อแก้โจทย์ปัญหา', 0),
  ((SELECT id FROM plos WHERE no=2 LIMIT 1), 'วิเคราะห์ ออกแบบ และประยุกต์เทคโนโลยีที่เหมาะสมต่อโจทย์ปัญหา', 1),
  ((SELECT id FROM plos WHERE no=2 LIMIT 1), 'พัฒนาระบบแอปพลิเคชันพร้อมใช้งานด้วยวิธีการที่เหมาะสม', 2),
  ((SELECT id FROM plos WHERE no=3 LIMIT 1), 'แยกแยะลักษณะของข้อมูลทางด้านการแพทย์ได้', 0),
  ((SELECT id FROM plos WHERE no=3 LIMIT 1), 'เชื่อมโยงความสัมพันธ์ของข้อมูลทางด้านการแพทย์ได้', 1),
  ((SELECT id FROM plos WHERE no=3 LIMIT 1), 'วิเคราะห์ข้อมูลด้วยเครื่องมือที่เหมาะสมในการแก้โจทย์ปัญหาทางการแพทย์', 2),
  ((SELECT id FROM plos WHERE no=4 LIMIT 1), 'ประเมินความรู้และทักษะของตนเองกับสภาพการณ์ปัจจุบันเพื่อวางแผนพัฒนา', 0),
  ((SELECT id FROM plos WHERE no=4 LIMIT 1), 'ระบุแหล่งความรู้ที่ทันสมัยและน่าเชื่อถือด้าน MedIT', 1),
  ((SELECT id FROM plos WHERE no=4 LIMIT 1), 'ค้นหาความรู้และทักษะวิชาชีพใหม่อยู่เสมอ', 2),
  ((SELECT id FROM plos WHERE no=5 LIMIT 1), 'อธิบายและนำเสนอความรู้ด้วยคำพูดที่ชัดเจนและถูกต้อง', 0),
  ((SELECT id FROM plos WHERE no=5 LIMIT 1), 'เข้าใจและอธิบายศัพท์ทางเทคนิคที่เกี่ยวข้องกับ MedIT ได้', 1),
  ((SELECT id FROM plos WHERE no=5 LIMIT 1), 'ประเมินความรู้ทักษะภาษาอังกฤษพื้นฐานด้วยเครื่องมือที่เหมาะสม', 2);

INSERT INTO ylos (year_no, description) VALUES
  (1, 'รู้และอธิบายองค์ประกอบเทคโนโลยีสารสนเทศทางการแพทย์ และสร้างโปรแกรมที่มีฟังก์ชันตามข้อกำหนดได้'),
  (2, 'เข้าใจซอฟต์แวร์ ฮาร์ดแวร์ ข้อมูลและโครงสร้างพื้นฐาน สร้างแอปพลิเคชันตามข้อกำหนดของ MedIT เหล่านี้ได้'),
  (3, 'คิดวิเคราะห์และออกแบบองค์ประกอบด้านเทคโนโลยีสารสนเทศ ซอฟต์แวร์ ฮาร์ดแวร์ และประยุกต์ใช้ MedIT ได้'),
  (4, 'เข้าใจปัญหา คิดวิเคราะห์และออกแบบองค์ประกอบด้าน MedIT เพื่อแก้โจทย์ปัญหาจริงได้');

INSERT INTO structure_items (label, credit, level, sort_order) VALUES
  ('1. หมวดวิชาศึกษาทั่วไป', 24, 1, 1),
  ('1.1 กลุ่มวิชาบังคับ', 18, 2, 2),
  ('1.2 กลุ่มวิชาเลือก', 6, 2, 3),
  ('2. หมวดวิชาเฉพาะด้าน', 94, 1, 4),
  ('2.1 กลุ่มวิชาแกน', 9, 2, 5),
  ('2.2 กลุ่มวิชาเอกบังคับ', 45, 2, 6),
  ('2.3 กลุ่มวิชาเอกเลือก (1 แขนง)', 27, 2, 7),
  ('2.4 กลุ่มฝึกประสบการณ์วิชาชีพ', 13, 2, 8),
  ('3. หมวดวิชาเลือกเสรี', 6, 1, 9);

INSERT INTO faculty (role, name, qualification, sort_order) VALUES
  ('ผู้ช่วยศาสตราจารย์', 'เจษฎา สิงห์ทองชัย', 'วศ.ด. เทคโนโลยีสารสนเทศ (ม.เทคโนโลยีสุรนารี) · วท.ม. เทคโนโลยีอินเทอร์เน็ตและสารสนเทศ (ม.นเรศวร)', 0),
  ('ผู้ช่วยศาสตราจารย์', 'ณัฐวุฒิ ศรีวิบูลย์', 'ปร.ด. วิทยาการคอมพิวเตอร์ (ม.มหาสารคาม) · วท.ม. เทคโนโลยีสารสนเทศ (ม.มหาสารคาม)', 1),
  ('อาจารย์', 'อัจฉรา สุมังเกษตร', 'วท.ม. วิทยาการคอมพิวเตอร์ (ม.เชียงใหม่) · วท.บ. วิทยาการคอมพิวเตอร์ (สถาบันราชภัฏลำปาง)', 2),
  ('อาจารย์', 'ณรงค์ฤทธิ์ มะสุใส', 'วท.ม. เทคโนโลยีสารสนเทศ (ม.มหาสารคาม) · วท.บ. วิทยาการคอมพิวเตอร์ (ม.มหาสารคาม)', 3),
  ('ผู้ช่วยศาสตราจารย์', 'ธรรมนูญ ปัญญาทิพย์', 'ปร.ด. วิทยาการคอมพิวเตอร์ (ม.มหาสารคาม) · วท.ม. สื่อนฤมิต (ม.มหาสารคาม)', 4);

INSERT INTO career_groups (tag, title, sort_order) VALUES
  ('7.1', 'สายธุรกิจและไอที', 0),
  ('7.2', 'สายการแพทย์และสาธารณสุข', 1),
  ('7.3', 'สายราชการและอื่น ๆ', 2);

INSERT INTO career_items (career_group_id, text, sort_order) VALUES
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'โปรแกรมเมอร์ (Programmer)', 0),
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'นักวิทยาศาสตร์ข้อมูล (Data Scientist)', 1),
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'นักพัฒนาคลังข้อมูล (Data Warehouse Developer)', 2),
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'นักพัฒนาเว็บไซต์ (Web Developer)', 3),
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'นักพัฒนาแอปพลิเคชัน (Application Developer)', 4),
  ((SELECT id FROM career_groups WHERE tag='7.1' LIMIT 1), 'ผู้ประกอบการด้านไอที (IT Entrepreneur)', 5),
  ((SELECT id FROM career_groups WHERE tag='7.2' LIMIT 1), 'นักวิเคราะห์ข้อมูลทางการแพทย์ (Medical Data Analyst)', 0),
  ((SELECT id FROM career_groups WHERE tag='7.2' LIMIT 1), 'นักพัฒนาระบบสารสนเทศทางการแพทย์ (Medical Info. System Developer)', 1),
  ((SELECT id FROM career_groups WHERE tag='7.2' LIMIT 1), 'นักสารสนเทศ (Information Scientist)', 2),
  ((SELECT id FROM career_groups WHERE tag='7.2' LIMIT 1), 'นักวิเคราะห์ภาพถ่ายทางการแพทย์ (Medical Imaging Analyst)', 3),
  ((SELECT id FROM career_groups WHERE tag='7.2' LIMIT 1), 'ผู้ดูแลระบบฐานข้อมูลด้านการแพทย์ (Medical Database Administrator)', 4),
  ((SELECT id FROM career_groups WHERE tag='7.3' LIMIT 1), 'นักวิชาการคอมพิวเตอร์ (Computer Technical Officer)', 0),
  ((SELECT id FROM career_groups WHERE tag='7.3' LIMIT 1), 'ตำรวจ (Police)', 1),
  ((SELECT id FROM career_groups WHERE tag='7.3' LIMIT 1), 'ทหาร (Soldier)', 2),
  ((SELECT id FROM career_groups WHERE tag='7.3' LIMIT 1), 'ครู อาจารย์ และวิทยากรถ่ายทอดความรู้ด้านเทคโนโลยี', 3);

INSERT INTO study_plan_items (year_no, track, sem_no, course_code, custom_name, custom_credit, sort_order) VALUES
  (1, NULL, 1, 'SC-001-013', NULL, NULL, 0),
  (1, NULL, 1, 'SC-112-101', NULL, NULL, 1),
  (1, NULL, 1, 'SC-112-102', NULL, NULL, 2),
  (1, NULL, 1, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 3),
  (1, NULL, 1, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 4),
  (1, NULL, 1, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 5),
  (1, NULL, 2, 'SC-001-014', NULL, NULL, 0),
  (1, NULL, 2, 'SC-112-103', NULL, NULL, 1),
  (1, NULL, 2, 'SC-112-104', NULL, NULL, 2),
  (1, NULL, 2, 'SC-112-105', NULL, NULL, 3),
  (1, NULL, 2, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 4),
  (1, NULL, 2, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 5),
  (2, NULL, 1, 'SC-001-015', NULL, NULL, 0),
  (2, NULL, 1, 'SC-112-201', NULL, NULL, 1),
  (2, NULL, 1, 'SC-112-202', NULL, NULL, 2),
  (2, NULL, 1, 'SC-112-203', NULL, NULL, 3),
  (2, NULL, 1, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 4),
  (2, NULL, 1, NULL, 'วิชาศึกษาทั่วไป (บังคับ)', '3(x-x-x)', 5),
  (2, NULL, 2, 'SC-112-204', NULL, NULL, 0),
  (2, NULL, 2, 'SC-112-205', NULL, NULL, 1),
  (2, NULL, 2, 'SC-112-206', NULL, NULL, 2),
  (2, NULL, 2, 'SC-112-207', NULL, NULL, 3),
  (2, NULL, 2, 'SC-112-208', NULL, NULL, 4),
  (2, NULL, 2, NULL, 'วิชาศึกษาทั่วไป (เลือก)', '3(x-x-x)', 5),
  (2, NULL, 2, NULL, 'เลือกเสรี 1', '3(x-x-x)', 6),
  (3, 'a', 1, 'SC-113-301', NULL, NULL, 0),
  (3, 'a', 1, 'SC-113-302', NULL, NULL, 1),
  (3, 'a', 1, 'SC-113-303', NULL, NULL, 2),
  (3, 'a', 1, 'SC-113-304', NULL, NULL, 3),
  (3, 'a', 1, NULL, 'วิชาเอกเลือก (แขนง A)', '3(2-2-5)', 4),
  (3, 'a', 1, NULL, 'เลือกเสรี 2', '3(x-x-x)', 5),
  (3, 'a', 2, 'SC-113-305', NULL, NULL, 0),
  (3, 'a', 2, 'SC-113-306', NULL, NULL, 1),
  (3, 'a', 2, 'SC-113-307', NULL, NULL, 2),
  (3, 'a', 2, 'SC-113-308', NULL, NULL, 3),
  (3, 'a', 2, 'SC-115-301', NULL, NULL, 4),
  (3, 'b', 1, 'SC-113-309', NULL, NULL, 0),
  (3, 'b', 1, 'SC-113-310', NULL, NULL, 1),
  (3, 'b', 1, 'SC-113-311', NULL, NULL, 2),
  (3, 'b', 1, 'SC-113-312', NULL, NULL, 3),
  (3, 'b', 1, NULL, 'วิชาเอกเลือก (แขนง B)', '3(2-2-5)', 4),
  (3, 'b', 1, NULL, 'เลือกเสรี 2', '3(x-x-x)', 5),
  (3, 'b', 2, 'SC-113-313', NULL, NULL, 0),
  (3, 'b', 2, 'SC-113-314', NULL, NULL, 1),
  (3, 'b', 2, 'SC-113-315', NULL, NULL, 2),
  (3, 'b', 2, 'SC-113-316', NULL, NULL, 3),
  (3, 'b', 2, 'SC-115-301', NULL, NULL, 4),
  (4, 'a', 1, 'SC-112-401', NULL, NULL, 0),
  (4, 'a', 1, 'SC-115-401', NULL, NULL, 1),
  (4, 'a', 2, 'SC-112-402', NULL, NULL, 0),
  (4, 'a', 2, 'SC-115-402', NULL, NULL, 1),
  (4, 'b', 1, 'SC-112-401', NULL, NULL, 0),
  (4, 'b', 1, NULL, 'SC-115-403 การเรียนรู้ภาคปฏิบัติ (แขนง B) 1', '6(0-30-0)', 1),
  (4, 'b', 2, 'SC-112-402', NULL, NULL, 0),
  (4, 'b', 2, NULL, 'SC-115-404 การเรียนรู้ภาคปฏิบัติ (แขนง B) 2', '6(0-30-0)', 1);

INSERT INTO skills (name, category) VALUES
  ('การเขียนโปรแกรมเชิงวัตถุ', 'Programming'),
  ('การพัฒนาเว็บแอปพลิเคชัน', 'Programming'),
  ('การจัดการฐานข้อมูล', 'Data'),
  ('การวิเคราะห์ข้อมูล', 'Data'),
  ('ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง', 'AI/ML'),
  ('ความมั่นคงปลอดภัยไซเบอร์', 'Security'),
  ('เครือข่ายคอมพิวเตอร์', 'Infrastructure'),
  ('ระบบสารสนเทศทางการแพทย์', 'Domain'),
  ('การจัดการโครงการ', 'Soft Skill'),
  ('การสื่อสารและการนำเสนอ', 'Soft Skill');

SET FOREIGN_KEY_CHECKS = 1;SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS course_clos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(30) NOT NULL,
  text TEXT NOT NULL,
  ksec ENUM('K','S','E','C') NOT NULL,
  plo_json VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  CONSTRAINT fk_clo_course FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_prereqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_code VARCHAR(30) NOT NULL,
  to_code VARCHAR(30) NOT NULL,
  type ENUM('hard','weak','co') NOT NULL,
  UNIQUE KEY uniq_edge (from_code, to_code, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO course_clos (course_code, text, ksec, plo_json, sort_order) VALUES
  ('SC-001-013', 'อธิบายหลักการพีชคณิตแบบบูลีนและโครงสร้างเซตที่ใช้ในงานคอมพิวเตอร์ได้', 'K', '[2]', 0),
  ('SC-001-013', 'ประยุกต์ใช้หลักตรรกศาสตร์และเมทริกซ์ในการแก้ปัญหาทางเทคโนโลยีสารสนเทศ', 'S', '[3]', 1),
  ('SC-001-013', 'คำนวณและวิเคราะห์ปัญหาเชิงคณิตศาสตร์ด้วยเครื่องมือที่เหมาะสม', 'S', '[3]', 2),
  ('SC-001-014', 'อธิบายแนวคิดสถิติเชิงพรรณนาและการแจกแจงความน่าจะเป็นเบื้องต้น', 'K', '[2]', 0),
  ('SC-001-014', 'ทดสอบสมมติฐานและวิเคราะห์การถดถอยด้วยเครื่องมือทางสถิติ', 'S', '[3]', 1),
  ('SC-001-014', 'แปลผลข้อมูลทางสถิติเพื่อสนับสนุนการตัดสินใจ', 'S', '[3]', 2),
  ('SC-001-015', 'อธิบายขั้นตอนและจริยธรรมในการทำวิจัยทางเทคโนโลยีสารสนเทศทางการแพทย์', 'K', '[1]', 0),
  ('SC-001-015', 'ออกแบบเครื่องมือวิจัยและวางแผนการเก็บข้อมูลได้', 'S', '[4]', 1),
  ('SC-001-015', 'นำเสนอผลการวิจัยอย่างเป็นระบบและถูกต้องตามหลักวิชาการ', 'C', '[5]', 2),
  ('SC-112-101', 'อธิบายหลักการเขียนโปรแกรมเบื้องต้นและการคิดเชิงตรรกะ', 'K', '[2]', 0),
  ('SC-112-101', 'เขียนโปรแกรมแก้ปัญหาด้วยโครงสร้างควบคุมและฟังก์ชันพื้นฐาน', 'S', '[2]', 1),
  ('SC-112-101', 'ออกแบบผังงานและซูโดโค้ดก่อนพัฒนาโปรแกรมจริง', 'S', '[3]', 2),
  ('SC-112-102', 'อธิบายสถาปัตยกรรมคอมพิวเตอร์และองค์ประกอบฮาร์ดแวร์หลัก', 'K', '[2]', 0),
  ('SC-112-102', 'อธิบายหลักการจัดการโปรเซสและหน่วยความจำเบื้องต้น', 'K', '[2]', 1),
  ('SC-112-102', 'วิเคราะห์กรณีศึกษาระบบปฏิบัติการที่ใช้งานจริง', 'S', '[3]', 2),
  ('SC-112-103', 'อธิบายสถาปัตยกรรมฐานข้อมูลและแบบจำลองข้อมูลเชิงสัมพันธ์', 'K', '[2]', 0),
  ('SC-112-103', 'ออกแบบฐานข้อมูลด้วยแผนภาพ ER และนอร์มัลไลเซชัน', 'S', '[2]', 1),
  ('SC-112-103', 'เขียนคำสั่ง SQL เพื่อจัดการข้อมูลในระบบฐานข้อมูล', 'S', '[3]', 2),
  ('SC-112-104', 'อธิบายหลักการทำงานของระบบปฏิบัติการในแพลตฟอร์มต่าง ๆ', 'K', '[2]', 0),
  ('SC-112-104', 'ติดตั้งและตั้งค่าระบบปฏิบัติการรวมถึงบัญชีผู้ใช้งาน', 'S', '[2]', 1),
  ('SC-112-104', 'ปรับปรุงความมั่นคงของเครื่องแม่ข่ายเบื้องต้น', 'S', '[3]', 2),
  ('SC-112-105', 'อธิบายกฎหมายทรัพย์สินทางปัญญาและ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล', 'K', '[1]', 0),
  ('SC-112-105', 'วิเคราะห์ประเด็นจริยธรรมในการประกอบวิชาชีพเทคโนโลยีสารสนเทศ', 'E', '[1]', 1),
  ('SC-112-105', 'ประยุกต์ใช้หลักจริยธรรมวิชาชีพในการทำงานจริง', 'E', '[1]', 2),
  ('SC-112-201', 'อธิบายวงจรการพัฒนาระบบและเครื่องมือสนับสนุนสมัยใหม่', 'K', '[2]', 0),
  ('SC-112-201', 'วิเคราะห์และออกแบบระบบงานจากความต้องการผู้ใช้', 'S', '[3]', 1),
  ('SC-112-201', 'ออกแบบส่วนติดต่อผู้ใช้ที่เหมาะสมกับระบบงาน', 'S', '[2]', 2),
  ('SC-112-202', 'อธิบายหลักการทำงานของเว็บแอปพลิเคชันและเฟรมเวิร์กสมัยใหม่', 'K', '[2]', 0),
  ('SC-112-202', 'พัฒนาเว็บแอปพลิเคชันด้วยเฟรมเวิร์กที่เป็นปัจจุบัน', 'S', '[2]', 1),
  ('SC-112-202', 'เชื่อมต่อฐานข้อมูลกับเว็บแอปพลิเคชันได้อย่างถูกต้อง', 'S', '[2]', 2),
  ('SC-112-203', 'อธิบายสถาปัตยกรรมเครือข่ายและโพรโทคอล TCP/IP', 'K', '[2]', 0),
  ('SC-112-203', 'กำหนดที่อยู่ไอพีและออกแบบการแบ่งเครือข่ายย่อย', 'S', '[2]', 1),
  ('SC-112-203', 'วิเคราะห์ภัยคุกคามและวางนโยบายความมั่นคงเบื้องต้น', 'S', '[3]', 2),
  ('SC-112-204', 'อธิบายหลักการบริหารโครงการและเครื่องมือวางแผน (GANTT, PERT, CPM)', 'K', '[2]', 0),
  ('SC-112-204', 'จัดทำแผนงานโครงการพร้อมประมาณการทรัพยากรและค่าใช้จ่าย', 'S', '[2]', 1),
  ('SC-112-204', 'ประเมินผลโครงการเพื่อสนับสนุนการตัดสินใจ', 'C', '[3]', 2),
  ('SC-112-205', 'อธิบายกระบวนการและอัลกอริทึมการทำเหมืองข้อมูล', 'K', '[2]', 0),
  ('SC-112-205', 'ประยุกต์ใช้เทคนิคการจำแนกและการจัดกลุ่มข้อมูล', 'S', '[3]', 1),
  ('SC-112-205', 'วิเคราะห์กฎความสัมพันธ์จากชุดข้อมูลจริง', 'S', '[3]', 2),
  ('SC-112-206', 'อธิบายโครงสร้างและบทบาทของระบบสารสนเทศเพื่อการจัดการ', 'K', '[2]', 0),
  ('SC-112-206', 'วิเคราะห์กรณีศึกษาการนำระบบสารสนเทศไปใช้ในองค์กร', 'S', '[3]', 1),
  ('SC-112-206', 'ประเมินความคุ้มค่าของการลงทุนด้านเทคโนโลยีสารสนเทศ', 'C', '[3]', 2),
  ('SC-112-207', 'อธิบายหลักการเขียนโปรแกรมเชิงวัตถุ', 'K', '[2]', 0),
  ('SC-112-207', 'พัฒนาโปรแกรมแบบ Full-stack ด้วยเฟรมเวิร์กสมัยใหม่', 'S', '[2]', 1),
  ('SC-112-207', 'ออกแบบสถาปัตยกรรม Front-end และ Back-end ร่วมกัน', 'S', '[2]', 2),
  ('SC-112-208', 'อธิบายมาตรฐานสากลของการจัดทำเวชระเบียน', 'K', '[2]', 0),
  ('SC-112-208', 'จัดระบบเวชระเบียนผู้ป่วยนอกและผู้ป่วยในตามมาตรฐาน', 'S', '[2]', 1),
  ('SC-112-208', 'จัดทำรายงานเวชระเบียนสำหรับผู้บริหารโรงพยาบาล', 'C', '[5]', 2),
  ('SC-112-401', 'เขียนข้อเสนอโครงงานพร้อมศึกษาความเป็นไปได้', 'S', '[3]', 0),
  ('SC-112-401', 'วิเคราะห์และออกแบบระบบงานตามข้อเสนอโครงงาน', 'S', '[2]', 1),
  ('SC-112-401', 'นำเสนอความก้าวหน้าของโครงงานอย่างเป็นระบบ', 'C', '[5]', 2),
  ('SC-112-402', 'พัฒนาและติดตั้งระบบงานตามที่ออกแบบไว้', 'S', '[2]', 0),
  ('SC-112-402', 'ทดสอบระบบงานและแก้ไขข้อผิดพลาด', 'S', '[3]', 1),
  ('SC-112-402', 'นำเสนอผลงานโครงงานฉบับสมบูรณ์', 'C', '[5]', 2),
  ('SC-113-301', 'อธิบายแนวคิดและวิธีการแก้ปัญหาทางปัญญาประดิษฐ์', 'K', '[2]', 0),
  ('SC-113-301', 'ประยุกต์ใช้เทคนิคการค้นหาคำตอบและการแทนความรู้', 'S', '[3]', 1),
  ('SC-113-301', 'พัฒนาโปรแกรมประยุกต์ปัญญาประดิษฐ์เบื้องต้น', 'S', '[2]', 2),
  ('SC-113-302', 'อธิบายทฤษฎีพื้นฐานของการประมวลผลภาษาธรรมชาติ', 'K', '[2]', 0),
  ('SC-113-302', 'ประยุกต์ใช้อัลกอริทึม NLP กับข้อความจริง', 'S', '[3]', 1),
  ('SC-113-303', 'อธิบายแนวคิดวิทยาศาสตร์ข้อมูลและการเรียนรู้ของเครื่อง', 'K', '[2]', 0),
  ('SC-113-303', 'เตรียมและสำรวจข้อมูลก่อนสร้างแบบจำลอง', 'S', '[3]', 1),
  ('SC-113-303', 'สร้างและประเมินผลแบบจำลองการเรียนรู้ของเครื่อง', 'S', '[3]', 2),
  ('SC-113-304', 'อธิบายหลักการออกแบบระบบสมองกลฝังตัว', 'K', '[2]', 0),
  ('SC-113-304', 'ออกแบบระบบสมองกลฝังตัวที่คำนึงถึงความมั่นคงและพลังงาน', 'S', '[3]', 1),
  ('SC-113-305', 'อธิบายโครงสร้างโครงข่ายประสาทเทียมและการเรียนรู้เชิงลึก', 'K', '[2]', 0),
  ('SC-113-305', 'พัฒนาโครงข่ายประสาทแบบคอนโวลูชันและแบบเกิดซ้ำ', 'S', '[3]', 1),
  ('SC-113-305', 'ปรับจูนไฮเปอร์พารามิเตอร์เพื่อเพิ่มประสิทธิภาพแบบจำลอง', 'S', '[3]', 2),
  ('SC-113-306', 'อธิบายหลักการเข้ารหัสลับและเทคโนโลยีบล็อกเชน', 'K', '[2]', 0),
  ('SC-113-306', 'ประยุกต์ใช้สัญญาอัจฉริยะในระบบกระจายศูนย์', 'S', '[3]', 1),
  ('SC-113-307', 'อธิบายการประยุกต์ปัญญาประดิษฐ์ในงานด้านสุขภาพ', 'K', '[2]', 0),
  ('SC-113-307', 'วิเคราะห์ข้อมูลสุขภาพด้วยเทคนิคปัญญาประดิษฐ์', 'S', '[3]', 1),
  ('SC-113-307', 'ประเมินความเหมาะสมของแบบจำลองกับบริบททางการแพทย์', 'C', '[3]', 2),
  ('SC-113-308', 'อธิบายหลักการวิเคราะห์ข้อมูลบนสื่อสังคมออนไลน์', 'K', '[2]', 0),
  ('SC-113-308', 'สกัดและวิเคราะห์ข้อความจากสื่อสังคมออนไลน์', 'S', '[3]', 1),
  ('SC-113-309', 'อธิบายองค์ประกอบและสถาปัตยกรรมคอมพิวเตอร์ที่ใช้ในงานการแพทย์', 'K', '[2]', 0),
  ('SC-113-309', 'วิเคราะห์การทำงานของอุปกรณ์คอมพิวเตอร์ทางการแพทย์', 'S', '[3]', 1),
  ('SC-113-310', 'อธิบายระบบสารสนเทศทางการแพทย์และสาธารณสุขในหน่วยงานต่าง ๆ', 'K', '[2]', 0),
  ('SC-113-310', 'วิเคราะห์กระบวนงานของระบบสารสนเทศโรงพยาบาล', 'S', '[3]', 1),
  ('SC-113-311', 'อธิบายองค์ประกอบของระบบผู้เชี่ยวชาญทางการแพทย์', 'K', '[2]', 0),
  ('SC-113-311', 'ออกแบบฐานความรู้และกลไกการตัดสินใจของระบบผู้เชี่ยวชาญ', 'S', '[3]', 1),
  ('SC-113-312', 'อธิบายมาตรฐานความมั่นคงของฐานข้อมูลในงานสุขภาพ', 'K', '[2]', 0),
  ('SC-113-312', 'บริหารจัดการสิทธิ์การเข้าถึงฐานข้อมูลผู้ป่วย', 'S', '[2]', 1),
  ('SC-113-312', 'ตระหนักถึงความรับผิดชอบต่อความเป็นส่วนตัวของข้อมูลผู้ป่วย', 'E', '[1]', 2),
  ('SC-113-313', 'อธิบายหลักการวิเคราะห์ทางสถิติสำหรับข้อมูลสุขภาพ', 'K', '[2]', 0),
  ('SC-113-313', 'วิเคราะห์ข้อมูลทางการแพทย์ด้วยโปรแกรมคอมพิวเตอร์', 'S', '[3]', 1),
  ('SC-113-314', 'อธิบายหลักการความจริงเสมือนและความจริงเสริมทางการแพทย์', 'K', '[2]', 0),
  ('SC-113-314', 'พัฒนาสื่อความจริงเสมือนสำหรับการเรียนรู้ทางการแพทย์', 'S', '[2]', 1),
  ('SC-113-315', 'อธิบายแนวคิดการวิเคราะห์และสร้างภาพนิทัศน์ทางการแพทย์', 'K', '[2]', 0),
  ('SC-113-315', 'ประมวลผลและแบ่งกลุ่มภาพถ่ายทางการแพทย์', 'S', '[3]', 1),
  ('SC-113-316', 'อธิบายหลักการเขียนโปรแกรมสำหรับงานเวชระเบียน', 'K', '[2]', 0),
  ('SC-113-316', 'พัฒนาแบบฟอร์มรับข้อมูลและตรวจสอบความถูกต้องของข้อมูล', 'S', '[2]', 1);

INSERT INTO course_prereqs (from_code, to_code, type) VALUES
  ('SC-112-101', 'SC-112-207', 'hard'),
  ('SC-112-101', 'SC-112-202', 'hard'),
  ('SC-112-103', 'SC-112-205', 'hard'),
  ('SC-112-201', 'SC-112-204', 'hard'),
  ('SC-112-101', 'SC-113-301', 'hard'),
  ('SC-001-014', 'SC-113-303', 'hard'),
  ('SC-113-303', 'SC-113-305', 'hard'),
  ('SC-112-103', 'SC-113-312', 'hard'),
  ('SC-112-101', 'SC-113-316', 'hard'),
  ('SC-001-014', 'SC-113-313', 'hard'),
  ('SC-112-401', 'SC-112-402', 'hard'),
  ('SC-115-301', 'SC-115-401', 'hard'),
  ('SC-115-401', 'SC-115-402', 'hard'),
  ('SC-112-102', 'SC-112-104', 'weak'),
  ('SC-112-104', 'SC-112-203', 'weak'),
  ('SC-112-103', 'SC-112-202', 'weak'),
  ('SC-112-205', 'SC-113-308', 'weak'),
  ('SC-113-301', 'SC-113-302', 'weak'),
  ('SC-113-301', 'SC-113-307', 'weak'),
  ('SC-112-203', 'SC-113-306', 'weak'),
  ('SC-112-102', 'SC-113-304', 'weak'),
  ('SC-112-207', 'SC-112-401', 'weak'),
  ('SC-113-303', 'SC-112-401', 'weak'),
  ('SC-112-206', 'SC-113-310', 'weak'),
  ('SC-112-208', 'SC-113-316', 'weak'),
  ('SC-112-101', 'SC-113-314', 'weak'),
  ('SC-112-103', 'SC-113-315', 'weak'),
  ('SC-112-103', 'SC-113-311', 'weak'),
  ('SC-113-312', 'SC-112-401', 'weak'),
  ('SC-113-313', 'SC-112-401', 'weak'),
  ('SC-112-101', 'SC-112-102', 'co'),
  ('SC-112-103', 'SC-112-104', 'co'),
  ('SC-112-201', 'SC-112-202', 'co'),
  ('SC-113-301', 'SC-113-303', 'co'),
  ('SC-113-309', 'SC-113-310', 'co');
