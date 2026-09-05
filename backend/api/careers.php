<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

function loadCareerGroups(PDO $db): array {
    $groups = $db->query('SELECT * FROM career_groups ORDER BY sort_order')->fetchAll();
    $itemStmt = $db->prepare('SELECT id, text FROM career_items WHERE career_group_id = ? ORDER BY sort_order');
    foreach ($groups as &$g) {
        $itemStmt->execute([$g['id']]);
        $g['items'] = $itemStmt->fetchAll();
    }
    return $groups;
}

if ($method === 'GET') {
    respond(['groups' => loadCareerGroups($db)]);
}

requireAdmin();

// POST body: { tag, title, items: ["...", "..."] }
if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['title'])) fail('กรุณาระบุชื่อกลุ่มอาชีพ', 422);
    $db->beginTransaction();
    try {
        $stmt = $db->prepare('INSERT INTO career_groups (tag, title, sort_order) VALUES (?, ?, ?)');
        $stmt->execute([$b['tag'] ?? null, $b['title'], $b['sort_order'] ?? 0]);
        $gid = $db->lastInsertId();
        $itemStmt = $db->prepare('INSERT INTO career_items (career_group_id, text, sort_order) VALUES (?, ?, ?)');
        foreach (($b['items'] ?? []) as $i => $t) {
            if (trim($t) !== '') $itemStmt->execute([$gid, $t, $i]);
        }
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        fail('บันทึกไม่สำเร็จ: ' . $e->getMessage(), 500);
    }
    respond(['message' => 'เพิ่มสำเร็จ', 'id' => $gid], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare('UPDATE career_groups SET tag=?, title=?, sort_order=? WHERE id=?');
        $stmt->execute([$b['tag'] ?? null, $b['title'], $b['sort_order'] ?? 0, $id]);
        $db->prepare('DELETE FROM career_items WHERE career_group_id=?')->execute([$id]);
        $itemStmt = $db->prepare('INSERT INTO career_items (career_group_id, text, sort_order) VALUES (?, ?, ?)');
        foreach (($b['items'] ?? []) as $i => $t) {
            if (trim($t) !== '') $itemStmt->execute([$id, $t, $i]);
        }
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        fail('แก้ไขไม่สำเร็จ: ' . $e->getMessage(), 500);
    }
    respond(['message' => 'แก้ไขสำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM career_groups WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบสำเร็จ']);
}

fail('Method not allowed', 405);
