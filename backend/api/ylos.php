<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    respond(['ylos' => $db->query('SELECT * FROM ylos ORDER BY year_no')->fetchAll()]);
}

requireAdmin();

if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['year_no'])) fail('กรุณาระบุปีการศึกษา', 422);
    $stmt = $db->prepare('INSERT INTO ylos (year_no, description) VALUES (?, ?)');
    $stmt->execute([$b['year_no'], $b['description'] ?? null]);
    respond(['message' => 'เพิ่มสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE ylos SET year_no=?, description=? WHERE id=?');
    $stmt->execute([$b['year_no'] ?? 1, $b['description'] ?? null, $id]);
    respond(['message' => 'แก้ไขสำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM ylos WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบสำเร็จ']);
}

fail('Method not allowed', 405);
