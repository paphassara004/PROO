<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    respond(['faculty' => $db->query('SELECT * FROM faculty ORDER BY sort_order')->fetchAll()]);
}

requireAdmin();

if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['name'])) fail('กรุณาระบุชื่ออาจารย์', 422);
    $stmt = $db->prepare('INSERT INTO faculty (role, name, qualification, sort_order) VALUES (?, ?, ?, ?)');
    $stmt->execute([$b['role'] ?? null, $b['name'], $b['qualification'] ?? null, $b['sort_order'] ?? 0]);
    respond(['message' => 'เพิ่มสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE faculty SET role=?, name=?, qualification=?, sort_order=? WHERE id=?');
    $stmt->execute([$b['role'] ?? null, $b['name'], $b['qualification'] ?? null, $b['sort_order'] ?? 0, $id]);
    respond(['message' => 'แก้ไขสำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM faculty WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบสำเร็จ']);
}

fail('Method not allowed', 405);
