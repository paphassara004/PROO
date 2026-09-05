<?php
// ============================================================
// Lightweight signed-token authentication (no Composer / JWT
// library required — just PHP's built-in hash_hmac).
//
// Token format: base64url(payload_json) . "." . base64url(hmac)
// Payload: { uid, username, role, exp }
// ============================================================

require_once __DIR__ . '/../config/db.php';

function b64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function b64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function createToken(array $payload, int $ttlSeconds = 60 * 60 * 8): string {
    $payload['exp'] = time() + $ttlSeconds;
    $payloadEncoded = b64url_encode(json_encode($payload));
    $signature = b64url_encode(hash_hmac('sha256', $payloadEncoded, APP_SECRET, true));
    return $payloadEncoded . '.' . $signature;
}

function verifyToken(?string $token): ?array {
    if (!$token || strpos($token, '.') === false) return null;
    [$payloadEncoded, $signature] = explode('.', $token, 2);
    $expectedSig = b64url_encode(hash_hmac('sha256', $payloadEncoded, APP_SECRET, true));
    if (!hash_equals($expectedSig, $signature)) return null;
    $payload = json_decode(b64url_decode($payloadEncoded), true);
    if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) return null;
    return $payload;
}

function getBearerToken(): ?string {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if ($auth && preg_match('/Bearer\s+(.*)$/i', $auth, $m)) {
        return trim($m[1]);
    }
    return null;
}

/** Returns the decoded token payload, or halts the request with 401. */
function requireAuth(): array {
    $payload = verifyToken(getBearerToken());
    if (!$payload) {
        fail('Unauthorized: please log in again', 401);
    }
    return $payload;
}

/** Requires the caller to be an authenticated admin, or halts with 403. */
function requireAdmin(): array {
    $payload = requireAuth();
    if (($payload['role'] ?? '') !== 'admin') {
        fail('Forbidden: admin access required', 403);
    }
    return $payload;
}
