<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// GET /api/clos.php                  -> all CLOs grouped nowhere (flat list)
// GET /api/clos.php?course=SC-112-101 -> CLOs for one course
if ($method === 'GET') {
    if (!empty($_GET['course'])) {
        $stmt = $db->prepare('SELECT * FROM course_clos WHERE course_code = ? ORDER BY sort_order');
        $stmt->execute([$_GET['course']]);
        respond(['clos' => $stmt->fetchAll()]);
    }
    respond(['clos' => $db->query('SELECT * FROM course_clos ORDER BY course_code, sort_order')->fetchAll()]);
}

requireAdmin();

// POST body: { course_code, text, ksec, plo: [2,3], sort_order }
if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['course_code']) || empty($b['text']) || empty($b['ksec'])) {
        fail('กรุณาระบุรายวิชา ข้อความ CLO และหมวด KSEC', 422);
    }
    $stmt = $db->prepare('INSERT INTO course_clos (course_code, text, ksec, plo_json, sort_order) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $b['course_code'], $b['text'], $b['ksec'],
        json_encode($b['plo'] ?? [], JSON_UNESCAPED_UNICODE), $b['sort_order'] ?? 0,
    ]);
    respond(['message' => 'เพิ่ม CLO สำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE course_clos SET course_code=?, text=?, ksec=?, plo_json=?, sort_order=? WHERE id=?');
    $stmt->execute([
        $b['course_code'], $b['text'], $b['ksec'],
        json_encode($b['plo'] ?? [], JSON_UNESCAPED_UNICODE), $b['sort_order'] ?? 0, $id,
    ]);
    respond(['message' => 'แก้ไข CLO สำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM course_clos WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบ CLO สำเร็จ']);
}

fail('Method not allowed', 405);
