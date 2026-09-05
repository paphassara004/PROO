<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    respond(['edges' => $db->query('SELECT * FROM course_prereqs ORDER BY from_code')->fetchAll()]);
}

requireAdmin();

// POST body: { from_code, to_code, type: 'hard'|'weak'|'co' }
if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['from_code']) || empty($b['to_code']) || empty($b['type'])) {
        fail('กรุณาระบุวิชาต้นทาง ปลายทาง และประเภทความสัมพันธ์', 422);
    }
    if (!in_array($b['type'], ['hard', 'weak', 'co'], true)) fail('ประเภทไม่ถูกต้อง', 422);
    try {
        $stmt = $db->prepare('INSERT INTO course_prereqs (from_code, to_code, type) VALUES (?, ?, ?)');
        $stmt->execute([$b['from_code'], $b['to_code'], $b['type']]);
    } catch (PDOException $e) {
        fail('เพิ่มความสัมพันธ์ไม่สำเร็จ (อาจซ้ำ): ' . $e->getMessage(), 409);
    }
    respond(['message' => 'เพิ่มความสัมพันธ์สำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM course_prereqs WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบความสัมพันธ์สำเร็จ']);
}

fail('Method not allowed', 405);
