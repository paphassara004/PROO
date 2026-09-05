<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// GET /api/courses.php?action=groups -> list of course_groups (for filter chips)
if ($method === 'GET' && ($_GET['action'] ?? '') === 'groups') {
    $rows = $db->query('SELECT code, label, sort_order FROM course_groups ORDER BY sort_order')->fetchAll();
    respond(['groups' => $rows]);
}

// GET /api/courses.php            -> list (supports ?group=&search=&year=)
// GET /api/courses.php?id=5       -> single course by id
// GET /api/courses.php?code=SC-...-> single course by code
if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $db->prepare('SELECT * FROM courses WHERE id = ? LIMIT 1');
        $stmt->execute([$_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) fail('Course not found', 404);
        respond(['course' => $row]);
    }
    if (!empty($_GET['code'])) {
        $stmt = $db->prepare('SELECT * FROM courses WHERE code = ? LIMIT 1');
        $stmt->execute([$_GET['code']]);
        $row = $stmt->fetch();
        if (!$row) fail('Course not found', 404);
        respond(['course' => $row]);
    }

    $where = [];
    $params = [];
    if (!empty($_GET['group'])) {
        $where[] = 'group_code = ?';
        $params[] = $_GET['group'];
    }
    if (!empty($_GET['year'])) {
        $where[] = 'year_no = ?';
        $params[] = (int)$_GET['year'];
    }
    if (!empty($_GET['search'])) {
        $where[] = '(code LIKE ? OR th_name LIKE ? OR en_name LIKE ?)';
        $like = '%' . $_GET['search'] . '%';
        array_push($params, $like, $like, $like);
    }
    $sql = 'SELECT * FROM courses';
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY code';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond(['courses' => $stmt->fetchAll(), 'count' => $stmt->rowCount()]);
}

// Everything below requires admin rights
requireAdmin();

// POST /api/courses.php -> create
if ($method === 'POST') {
    $b = jsonInput();
    required($b, ['code', 'th_name']);
    $stmt = $db->prepare('INSERT INTO courses (code, credit_text, th_name, en_name, th_desc, en_desc, group_code, year_no, sem_no)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    try {
        $stmt->execute([
            $b['code'], $b['credit_text'] ?? null, $b['th_name'], $b['en_name'] ?? null,
            $b['th_desc'] ?? null, $b['en_desc'] ?? null, $b['group_code'] ?? null,
            $b['year_no'] ?? null, $b['sem_no'] ?? null,
        ]);
    } catch (PDOException $e) {
        fail('บันทึกไม่สำเร็จ (รหัสวิชาอาจซ้ำ): ' . $e->getMessage(), 409);
    }
    respond(['message' => 'เพิ่มรายวิชาสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

// PUT /api/courses.php?id=5 -> update
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    required($b, ['code', 'th_name']);
    $stmt = $db->prepare('UPDATE courses SET code=?, credit_text=?, th_name=?, en_name=?, th_desc=?, en_desc=?, group_code=?, year_no=?, sem_no=? WHERE id=?');
    $stmt->execute([
        $b['code'], $b['credit_text'] ?? null, $b['th_name'], $b['en_name'] ?? null,
        $b['th_desc'] ?? null, $b['en_desc'] ?? null, $b['group_code'] ?? null,
        $b['year_no'] ?? null, $b['sem_no'] ?? null, $id,
    ]);
    respond(['message' => 'แก้ไขรายวิชาสำเร็จ']);
}

// DELETE /api/courses.php?id=5
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM courses WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบรายวิชาสำเร็จ']);
}

fail('Method not allowed', 405);

function required(array $body, array $fields): void {
    foreach ($fields as $f) {
        if (empty($body[$f])) fail("กรุณาระบุ: $f", 422);
    }
}
