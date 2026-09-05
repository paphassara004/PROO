<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

function loadPlosWithSubs(PDO $db, ?int $id = null): array {
    $sql = 'SELECT * FROM plos';
    $params = [];
    if ($id) { $sql .= ' WHERE id = ?'; $params[] = $id; }
    $sql .= ' ORDER BY sort_order, no';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $plos = $stmt->fetchAll();

    $subStmt = $db->prepare('SELECT id, text FROM plo_subs WHERE plo_id = ? ORDER BY sort_order');
    foreach ($plos as &$p) {
        $subStmt->execute([$p['id']]);
        $p['subs'] = $subStmt->fetchAll();
    }
    return $plos;
}

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $rows = loadPlosWithSubs($db, (int)$_GET['id']);
        if (!$rows) fail('PLO not found', 404);
        respond(['plo' => $rows[0]]);
    }
    respond(['plos' => loadPlosWithSubs($db)]);
}

requireAdmin();

// POST body: { no, title, description, subs: ["...", "..."] }
if ($method === 'POST') {
    $b = jsonInput();
    if (empty($b['title'])) fail('กรุณาระบุชื่อ PLO', 422);
    $db->beginTransaction();
    try {
        $stmt = $db->prepare('INSERT INTO plos (no, title, description, sort_order) VALUES (?, ?, ?, ?)');
        $stmt->execute([$b['no'] ?? 0, $b['title'], $b['description'] ?? null, $b['no'] ?? 0]);
        $ploId = $db->lastInsertId();
        $subStmt = $db->prepare('INSERT INTO plo_subs (plo_id, text, sort_order) VALUES (?, ?, ?)');
        foreach (($b['subs'] ?? []) as $i => $s) {
            if (trim($s) !== '') $subStmt->execute([$ploId, $s, $i]);
        }
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        fail('บันทึกไม่สำเร็จ: ' . $e->getMessage(), 500);
    }
    respond(['message' => 'เพิ่ม PLO สำเร็จ', 'id' => $ploId], 201);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $b = jsonInput();
    if (empty($b['title'])) fail('กรุณาระบุชื่อ PLO', 422);
    $db->beginTransaction();
    try {
        $stmt = $db->prepare('UPDATE plos SET no=?, title=?, description=?, sort_order=? WHERE id=?');
        $stmt->execute([$b['no'] ?? 0, $b['title'], $b['description'] ?? null, $b['no'] ?? 0, $id]);
        // Replace sub-PLOs wholesale for simplicity
        $db->prepare('DELETE FROM plo_subs WHERE plo_id=?')->execute([$id]);
        $subStmt = $db->prepare('INSERT INTO plo_subs (plo_id, text, sort_order) VALUES (?, ?, ?)');
        foreach (($b['subs'] ?? []) as $i => $s) {
            if (trim($s) !== '') $subStmt->execute([$id, $s, $i]);
        }
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        fail('แก้ไขไม่สำเร็จ: ' . $e->getMessage(), 500);
    }
    respond(['message' => 'แก้ไข PLO สำเร็จ']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) fail('Missing id', 422);
    $db->prepare('DELETE FROM plos WHERE id=?')->execute([$id]);
    respond(['message' => 'ลบ PLO สำเร็จ']);
}

fail('Method not allowed', 405);
