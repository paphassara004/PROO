<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../middleware/auth.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $action === 'login') {
    $body = jsonInput();
    $username = trim($body['username'] ?? '');
    $password = (string)($body['password'] ?? '');

    if ($username === '' || $password === '') {
        fail('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 422);
    }

    $stmt = getDB()->prepare('SELECT id, username, password_hash, full_name, role FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        fail('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
    }

    $token = createToken([
        'uid'      => $user['id'],
        'username' => $user['username'],
        'role'     => $user['role'],
    ]);

    respond([
        'token' => $token,
        'user'  => [
            'id'        => $user['id'],
            'username'  => $user['username'],
            'full_name' => $user['full_name'],
            'role'      => $user['role'],
        ],
    ]);
}

if ($method === 'GET' && $action === 'me') {
    $payload = requireAuth();
    $stmt = getDB()->prepare('SELECT id, username, full_name, role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$payload['uid']]);
    $user = $stmt->fetch();
    if (!$user) fail('User not found', 404);
    respond(['user' => $user]);
}

if ($method === 'POST' && $action === 'register') {
    // Only an existing admin may create new accounts
    requireAdmin();
    $body = jsonInput();
    $username = trim($body['username'] ?? '');
    $password = (string)($body['password'] ?? '');
    $fullName = trim($body['full_name'] ?? '');
    $role = in_array($body['role'] ?? 'user', ['admin', 'user'], true) ? $body['role'] : 'user';

    if ($username === '' || strlen($password) < 6) {
        fail('ชื่อผู้ใช้ต้องไม่ว่าง และรหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 422);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    try {
        $stmt = getDB()->prepare('INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([$username, $hash, $fullName ?: null, $role]);
    } catch (PDOException $e) {
        fail('สร้างผู้ใช้ไม่สำเร็จ (ชื่อผู้ใช้อาจซ้ำ)', 409);
    }
    respond(['message' => 'สร้างผู้ใช้สำเร็จ', 'id' => getDB()->lastInsertId()], 201);
}

if ($method === 'POST' && $action === 'change-password') {
    $payload = requireAuth();
    $body = jsonInput();
    $current = (string)($body['current_password'] ?? '');
    $new = (string)($body['new_password'] ?? '');

    if (strlen($new) < 6) fail('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 422);

    $stmt = getDB()->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$payload['uid']]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($current, $row['password_hash'])) {
        fail('รหัสผ่านปัจจุบันไม่ถูกต้อง', 401);
    }
    $newHash = password_hash($new, PASSWORD_BCRYPT);
    $upd = getDB()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $upd->execute([$newHash, $payload['uid']]);
    respond(['message' => 'เปลี่ยนรหัสผ่านสำเร็จ']);
}

fail('Unknown auth action', 404);
