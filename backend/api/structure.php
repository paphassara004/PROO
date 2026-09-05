<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    respond(['items' => $db->query('SELECT * FROM structure_items ORDER BY sort_order')->fetchAll()]);
}

requireAdmin();

if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['label']) || !isset($b['credit'])) fail('กรุณาระบุชื่อหมวดวิชาและหน่วยกิต', 422);
    $stmt = $db->prepare('INSERT INTO structure_items (label, credit, level, sort_order) VALUES (?, ?, ?, ?)');
    $stmt->execute([$b['label'], $b['credit'], $b['level'] ?? 1, $b['sort_order'] ?? 0]);
    respond(['message' => 'เพิ่มสำเร็จ', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $stmt = $db->prepare('UPDATE structure_items SET label=?, credit=?, level=?, sort_order=? WHERE id=?');
    $stmt->execute([$b['label'], $b['credit'], $b['level'] ?? 1, $b['sort_order'] ?? 0, $id]);
    respond(['message' => 'แก้ไขสำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM structure_items WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบสำเร็จ']);
}

fail('Method not allowed', 405);
