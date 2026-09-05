<?php
// Public, read-only bundle of everything the React homepage needs in one request.
// No auth required — this mirrors the public curriculum microsite content.
require_once __DIR__ . '/../config/bootstrap.php';

$db = getDB();

$plos = $db->query('SELECT * FROM plos ORDER BY sort_order, no')->fetchAll();
$subStmt = $db->prepare('SELECT text FROM plo_subs WHERE plo_id = ? ORDER BY sort_order');
foreach ($plos as &$p) {
    $subStmt->execute([$p['id']]);
    $p['subs'] = array_column($subStmt->fetchAll(), 'text');
}

$careerGroups = $db->query('SELECT * FROM career_groups ORDER BY sort_order')->fetchAll();
$itemStmt = $db->prepare('SELECT text FROM career_items WHERE career_group_id = ? ORDER BY sort_order');
foreach ($careerGroups as &$g) {
    $itemStmt->execute([$g['id']]);
    $g['items'] = array_column($itemStmt->fetchAll(), 'text');
}

respond([
    'plos'       => $plos,
    'ylos'       => $db->query('SELECT * FROM ylos ORDER BY year_no')->fetchAll(),
    'structure'  => $db->query('SELECT * FROM structure_items ORDER BY sort_order')->fetchAll(),
    'faculty'    => $db->query('SELECT * FROM faculty ORDER BY sort_order')->fetchAll(),
    'careers'    => $careerGroups,
    'groups'     => $db->query('SELECT code, label, sort_order FROM course_groups ORDER BY sort_order')->fetchAll(),
    'courses'    => $db->query('SELECT * FROM courses ORDER BY code')->fetchAll(),
    'clos'       => $db->query('SELECT * FROM course_clos ORDER BY course_code, sort_order')->fetchAll(),
    'prereqs'    => $db->query('SELECT * FROM course_prereqs ORDER BY from_code')->fetchAll(),
]);
