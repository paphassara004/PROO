<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

// ---------- Plain skills list ----------
if ($method === 'GET' && $action === '') {
    respond(['skills' => $db->query('SELECT * FROM skills ORDER BY category, name')->fetchAll()]);
}

// GET ?action=map                -> every course with its mapped skills (the full skill map)
// GET ?action=map&course=SC-...  -> skills mapped to one course
// GET ?action=map&skill=5        -> courses mapped to one skill
if ($method === 'GET' && $action === 'map') {
    if (!empty($_GET['course'])) {
        $stmt = $db->prepare('SELECT cs.id AS mapping_id, s.id AS skill_id, s.name, s.category, cs.weight
                               FROM course_skills cs JOIN skills s ON s.id = cs.skill_id
                               WHERE cs.course_code = ? ORDER BY s.category, s.name');
        $stmt->execute([$_GET['course']]);
        respond(['course_code' => $_GET['course'], 'skills' => $stmt->fetchAll()]);
    }
    if (!empty($_GET['skill'])) {
        $stmt = $db->prepare('SELECT c.code, c.th_name, c.en_name, cs.weight
                               FROM course_skills cs JOIN courses c ON c.code = cs.course_code
                               WHERE cs.skill_id = ? ORDER BY c.code');
        $stmt->execute([$_GET['skill']]);
        respond(['skill_id' => (int)$_GET['skill'], 'courses' => $stmt->fetchAll()]);
    }
    // Full map: every mapping row, useful for building a matrix on the frontend
    $rows = $db->query('SELECT cs.id, cs.course_code, c.th_name AS course_name, cs.skill_id, s.name AS skill_name, s.category, cs.weight
                         FROM course_skills cs
                         JOIN courses c ON c.code = cs.course_code
                         JOIN skills s ON s.id = cs.skill_id
                         ORDER BY c.code, s.category')->fetchAll();
    respond(['mappings' => $rows]);
}

requireAdmin();

// ---------- Manage skills themselves ----------
if ($method === 'POST' && $action === '') {
    $b = jsonInput();
    if (empty($b['name'])) fail('กรุณาระบุชื่อทักษะ', 422);
    $stmt = $db->prepare('INSERT INTO skills (name, category, description) VALUES (?, ?, ?)');
    $stmt->execute([$b['name'], $b['category'] ?? null, $b['description'] ?? null]);
    respond(['message' => 'เพิ่มทักษะสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT' && $action === '') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE skills SET name=?, category=?, description=? WHERE id=?');
    $stmt->execute([$b['name'], $b['category'] ?? null, $b['description'] ?? null, $id]);
    respond(['message' => 'แก้ไขทักษะสำเร็จ']);
}

if ($method === 'DELETE' && $action === '') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM skills WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบทักษะสำเร็จ']);
}

// ---------- Manage course<->skill mapping ----------
// POST ?action=map  body: { course_code, skill_id, weight }
if ($method === 'POST' && $action === 'map') {
    $b = jsonInput();
    if (empty($b['course_code']) || empty($b['skill_id'])) fail('กรุณาระบุรายวิชาและทักษะ', 422);
    $weight = max(1, min(5, (int)($b['weight'] ?? 3)));
    try {
        $stmt = $db->prepare('INSERT INTO course_skills (course_code, skill_id, weight) VALUES (?, ?, ?)
                               ON DUPLICATE KEY UPDATE weight = VALUES(weight)');
        $stmt->execute([$b['course_code'], $b['skill_id'], $weight]);
    } catch (PDOException $e) {
        fail('บันทึกการแมปไม่สำเร็จ: ' . $e->getMessage(), 409);
    }
    respond(['message' => 'บันทึกการแมปทักษะสำเร็จ'], 201);
}

// DELETE ?action=map&id=5
if ($method === 'DELETE' && $action === 'map') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM course_skills WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบการแมปสำเร็จ']);
}

fail('Method not allowed', 405);
