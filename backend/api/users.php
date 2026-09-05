<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();
$me = requireAdmin(); // every action on this endpoint is admin-only

if ($method === 'GET') {
    respond(['users' => $db->query('SELECT id, username, full_name, role, created_at FROM users ORDER BY id')->fetchAll()]);
}

// Creating users happens via auth.php?action=register (kept there so it's easy to find),
// this endpoint focuses on editing role/full_name and deleting.
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $role = in_array($b['role'] ?? 'user', ['admin', 'user'], true) ? $b['role'] : 'user';
    $stmt = $db->prepare('UPDATE users SET full_name=?, role=? WHERE id=?');
    $stmt->execute([$b['full_name'] ?? null, $role, $id]);
    respond(['message' => 'แก้ไขผู้ใช้สำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    if ((int)$id === (int)$me['uid']) fail('ไม่สามารถลบบัญชีของตนเองได้', 400);
    $db->prepare('DELETE FROM users WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบผู้ใช้สำเร็จ']);
}

fail('Method not allowed', 405);
