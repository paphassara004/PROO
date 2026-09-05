<?php
// ============================================================
// Database connection (PDO / MySQL)
// Edit these values to match your local phpMyAdmin / MySQL setup
// ============================================================

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'skillmapping');
define('DB_USER', 'root');
define('DB_PASS', '');       // XAMPP default root password is usually empty
define('DB_CHARSET', 'utf8mb4');

// Secret key used to sign auth tokens — CHANGE THIS before deploying for real use
define('APP_SECRET', 'skillmapping-super-secret-change-me-2026');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Database connection failed', 'detail' => $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}
