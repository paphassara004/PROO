<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// GET /api/studyplan.php?year=1              -> all items for year 1 (track is NULL)
// GET /api/studyplan.php?year=3&track=a      -> all items for year 3, track A
// GET /api/studyplan.php                     -> everything, grouped
if ($method === 'GET') {
    $sql = "SELECT sp.*, c.th_name AS course_th_name, c.en_name AS course_en_name, c.credit_text AS course_credit_text
            FROM study_plan_items sp
            LEFT JOIN courses c ON c.code = sp.course_code";
    $where = [];
    $params = [];
    if (isset($_GET['year'])) { $where[] = 'sp.year_no = ?'; $params[] = (int)$_GET['year']; }
    if (isset($_GET['track'])) { $where[] = 'sp.track = ?'; $params[] = $_GET['track']; }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY sp.year_no, sp.track, sp.sem_no, sp.sort_order';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond(['items' => $stmt->fetchAll()]);
}

requireAdmin();

// POST body: { year_no, track, sem_no, course_code, custom_name, custom_credit, sort_order }
if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['year_no']) || empty($b['sem_no'])) fail('กรุณาระบุปีและภาคการศึกษา', 422);
    $stmt = $db->prepare('INSERT INTO study_plan_items (year_no, track, sem_no, course_code, custom_name, custom_credit, sort_order)
                           VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $b['year_no'], $b['track'] ?? null, $b['sem_no'], $b['course_code'] ?? null,
        $b['custom_name'] ?? null, $b['custom_credit'] ?? null, $b['sort_order'] ?? 0,
    ]);
    respond(['message' => 'เพิ่มสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE study_plan_items SET year_no=?, track=?, sem_no=?, course_code=?, custom_name=?, custom_credit=?, sort_order=? WHERE id=?');
    $stmt->execute([
        $b['year_no'], $b['track'] ?? null, $b['sem_no'], $b['course_code'] ?? null,
        $b['custom_name'] ?? null, $b['custom_credit'] ?? null, $b['sort_order'] ?? 0, $id,
    ]);
    respond(['message' => 'แก้ไขสำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM study_plan_items WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบสำเร็จ']);
}

fail('Method not allowed', 405);
