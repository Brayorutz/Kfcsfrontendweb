<?php
/**
 * KFCS PHP API Backend
 * Replaces the Node.js/Express server for cPanel hosting.
 * PHP 8.0+ required. Place this file at: public_html/api/index.php
 */

session_start();
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// ─── Configuration ────────────────────────────────────────────────────────────
define('DATA_DIR',          __DIR__ . '/../data/');
define('FINANCIAL_DIR',     __DIR__ . '/../financial-records/');
define('GENERAL_DIR',       __DIR__ . '/../general-downloads/');
define('DIR_FILES_DIR',     __DIR__ . '/../data/director-files/');
define('NEWS_DIR',          __DIR__ . '/../attached_assets/news/');
define('MANAGER_USERNAME',  'manager');
define('MAX_UPLOAD_BYTES',  100 * 1024 * 1024);
define('FINANCIAL_CATS', [
    'Annual Reports',
    'Financial Statements',
    'Audit Reports',
    'Board Minutes',
    'Others',
]);

// Ensure writable directories exist
foreach ([DATA_DIR, FINANCIAL_DIR, GENERAL_DIR, DIR_FILES_DIR, NEWS_DIR] as $d) {
    if (!is_dir($d)) mkdir($d, 0755, true);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function respond(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $msg, int $status = 400): never {
    respond(['message' => $msg], $status);
}

function load(string $file, mixed $default = []): mixed {
    $p = DATA_DIR . $file;
    if (!file_exists($p)) return $default;
    return json_decode(file_get_contents($p), true) ?? $default;
}

function save(string $file, mixed $data): void {
    file_put_contents(DATA_DIR . $file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

function uuid4(): string {
    $d = random_bytes(16);
    $d[6] = chr(ord($d[6]) & 0x0f | 0x40);
    $d[8] = chr(ord($d[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
}

function require_auth(): void {
    if (empty($_SESSION['userId'])) fail('Not authenticated', 401);
}

function require_manager(): void {
    if (($_SESSION['role'] ?? '') !== 'manager') fail('Forbidden', 403);
}

function manager_password(): string {
    $p = DATA_DIR . 'manager-password.txt';
    if (!file_exists($p)) {
        $default = 'kfcs@Manager2024';
        file_put_contents($p, $default);
        return $default;
    }
    return trim(file_get_contents($p));
}

function store_upload(array $file, string $dest_dir): array {
    if ($file['error'] !== UPLOAD_ERR_OK) fail('Upload error code ' . $file['error'], 400);
    if ($file['size'] > MAX_UPLOAD_BYTES) fail('File too large (max 100 MB)', 400);
    $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = time() . '-' . uuid4() . ($ext ? ".$ext" : '');
    if (!move_uploaded_file($file['tmp_name'], $dest_dir . $filename))
        fail('Could not save uploaded file', 500);
    return [
        'filename'     => $filename,
        'originalName' => $file['name'],
        'size'         => $file['size'],
        'mimetype'     => $file['type'],
    ];
}

// ─── Routing ──────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api prefix and normalise
$path = preg_replace('#^/api#', '', $uri);
$path = '/' . trim($path, '/');

// Named-param route matcher
function route(string $pattern, string $path, array &$p = []): bool {
    $rx = preg_replace('#:([a-zA-Z_]+)#', '(?P<$1>[^/]+)', $pattern);
    if (!preg_match('#^' . $rx . '$#', $path, $m)) return false;
    foreach ($m as $k => $v) { if (is_string($k)) $p[$k] = $v; }
    return true;
}

$p = []; // route params

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/directors/login') {
    $b        = json_decode(file_get_contents('php://input'), true) ?? [];
    $username = trim($b['username'] ?? '');
    $password = $b['password'] ?? '';
    if (!$username || !$password) fail('Username and password required');

    if ($username === MANAGER_USERNAME) {
        if ($password !== manager_password()) fail('Invalid credentials', 401);
        $_SESSION['userId'] = 'manager';
        $_SESSION['role']   = 'manager';
        respond(['role' => 'manager', 'username' => MANAGER_USERNAME, 'fullName' => 'Manager']);
    }

    foreach (load('directors.json') as $d) {
        if ($d['username'] === $username) {
            if (!password_verify($password, $d['passwordHash'])) fail('Invalid credentials', 401);
            $_SESSION['userId'] = $d['id'];
            $_SESSION['role']   = 'director';
            respond([
                'role'               => 'director',
                'username'           => $d['username'],
                'fullName'           => $d['fullName'],
                'id'                 => $d['id'],
                'mustChangePassword' => $d['mustChangePassword'] ?? true,
            ]);
        }
    }
    fail('Invalid credentials', 401);
}

if ($method === 'POST' && $path === '/directors/logout') {
    session_destroy();
    respond(['success' => true]);
}

if ($method === 'GET' && $path === '/directors/me') {
    if (empty($_SESSION['userId'])) fail('Not authenticated', 401);
    if ($_SESSION['role'] === 'manager')
        respond(['role' => 'manager', 'username' => MANAGER_USERNAME, 'fullName' => 'Manager', 'id' => 'manager']);
    foreach (load('directors.json') as $d) {
        if ($d['id'] === $_SESSION['userId'])
            respond([
                'role'               => 'director',
                'username'           => $d['username'],
                'fullName'           => $d['fullName'],
                'id'                 => $d['id'],
                'mustChangePassword' => $d['mustChangePassword'] ?? false,
            ]);
    }
    fail('Session invalid', 401);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MANAGER PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/manager/change-password') {
    require_manager();
    $b = json_decode(file_get_contents('php://input'), true) ?? [];
    if (empty($b['currentPassword']) || empty($b['newPassword']))
        fail('Current and new passwords are required');
    if ($b['currentPassword'] !== manager_password()) fail('Current password is incorrect', 401);
    file_put_contents(DATA_DIR . 'manager-password.txt', $b['newPassword']);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  DIRECTOR ACCOUNTS
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'GET' && $path === '/directors/accounts') {
    require_manager();
    $list = array_map(fn($d) => [
        'id'        => $d['id'],
        'username'  => $d['username'],
        'fullName'  => $d['fullName'],
        'createdAt' => $d['createdAt'],
    ], load('directors.json'));
    respond(array_values($list));
}

if ($method === 'POST' && $path === '/directors/accounts') {
    require_manager();
    $b        = json_decode(file_get_contents('php://input'), true) ?? [];
    $username = trim($b['username'] ?? '');
    $fullName = trim($b['fullName'] ?? '');
    if (!$username || !$fullName) fail('username and fullName are required');
    $directors = load('directors.json');
    foreach ($directors as $d) {
        if ($d['username'] === $username) fail('Username already exists', 409);
    }
    $id      = uuid4();
    $account = [
        'id'                 => $id,
        'username'           => $username,
        'passwordHash'       => password_hash('123456', PASSWORD_BCRYPT),
        'fullName'           => $fullName,
        'createdAt'          => date('c'),
        'mustChangePassword' => true,
    ];
    $directors[] = $account;
    save('directors.json', $directors);
    respond(['id' => $id, 'username' => $username, 'fullName' => $fullName,
             'createdAt' => $account['createdAt'], 'mustChangePassword' => true], 201);
}

if ($method === 'DELETE' && route('/directors/accounts/:id', $path, $p)) {
    require_manager();
    $id        = $p['id'];
    $directors = load('directors.json');
    $new       = array_values(array_filter($directors, fn($d) => $d['id'] !== $id));
    if (count($new) === count($directors)) fail('Director not found', 404);
    save('directors.json', $new);
    // Remove their files
    $files    = load('director-files.json');
    $toDelete = array_filter($files, fn($f) => $f['directorId'] === $id);
    foreach ($toDelete as $f) @unlink(DIR_FILES_DIR . $f['filename']);
    save('director-files.json', array_values(array_filter($files, fn($f) => $f['directorId'] !== $id)));
    respond(['success' => true]);
}

if ($method === 'POST' && $path === '/directors/change-password') {
    require_auth();
    if (($_SESSION['role'] ?? '') !== 'director') fail('Forbidden', 403);
    $b = json_decode(file_get_contents('php://input'), true) ?? [];
    if (empty($b['currentPassword']) || empty($b['newPassword']))
        fail('currentPassword and newPassword are required');
    if (strlen($b['newPassword']) < 6) fail('New password must be at least 6 characters');
    $directors = load('directors.json');
    foreach ($directors as &$d) {
        if ($d['id'] === $_SESSION['userId']) {
            if (!password_verify($b['currentPassword'], $d['passwordHash']))
                fail('Current password is incorrect', 401);
            if ($b['currentPassword'] === $b['newPassword'])
                fail('New password must be different from the current password');
            $d['passwordHash']       = password_hash($b['newPassword'], PASSWORD_BCRYPT);
            $d['mustChangePassword'] = false;
            save('directors.json', $directors);
            respond(['success' => true]);
        }
    }
    fail('Director not found', 404);
}

// ─────────────────────────────────────────────────────────────────────────────
//  DIRECTOR FILES
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/directors/files') {
    require_manager();
    if (empty($_FILES['file'])) fail('No file uploaded', 400);
    $directorId  = $_POST['directorId'] ?? '';
    if (!$directorId) fail('directorId is required', 400);
    $fileInfo    = store_upload($_FILES['file'], DIR_FILES_DIR);
    $directors   = load('directors.json');
    $dirFiles    = load('director-files.json');
    $uploadedAt  = date('c');

    if ($directorId === 'all') {
        if (empty($directors)) fail('No director accounts exist yet', 400);
        $created = [];
        foreach ($directors as $d) {
            $meta       = array_merge(['id' => uuid4(), 'directorId' => $d['id'],
                                       'uploadedAt' => $uploadedAt, 'uploadedBy' => MANAGER_USERNAME], $fileInfo);
            $dirFiles[] = $meta;
            $created[]  = $meta;
        }
        save('director-files.json', $dirFiles);
        respond(['broadcastCount' => count($created), 'files' => $created], 201);
    }

    $exists = !empty(array_filter($directors, fn($d) => $d['id'] === $directorId));
    if (!$exists) fail('Director not found', 400);
    $meta       = array_merge(['id' => uuid4(), 'directorId' => $directorId,
                               'uploadedAt' => $uploadedAt, 'uploadedBy' => MANAGER_USERNAME], $fileInfo);
    $dirFiles[] = $meta;
    save('director-files.json', $dirFiles);
    respond($meta, 201);
}

if ($method === 'GET' && $path === '/directors/files') {
    require_auth();
    $files = load('director-files.json');
    if ($_SESSION['role'] === 'manager') {
        if (!empty($_GET['directorId']))
            $files = array_values(array_filter($files, fn($f) => $f['directorId'] === $_GET['directorId']));
        respond(array_values($files));
    }
    respond(array_values(array_filter($files, fn($f) => $f['directorId'] === $_SESSION['userId'])));
}

if ($method === 'DELETE' && route('/directors/files/:id', $path, $p)) {
    require_manager();
    $id    = $p['id'];
    $files = load('director-files.json');
    $found = null;
    $new   = [];
    foreach ($files as $f) { if ($f['id'] === $id) $found = $f; else $new[] = $f; }
    if (!$found) fail('File not found', 404);
    @unlink(DIR_FILES_DIR . $found['filename']);
    save('director-files.json', $new);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  SERVE DIRECTOR FILES (auth-gated binary delivery)
//  Called when URL is /director-files/{filename}
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'GET' && preg_match('#^/director-files/(?P<name>[^/]+)$#', $path, $m)) {
    require_auth();
    $filename = basename($m['name']);
    $files    = load('director-files.json');
    $record   = null;
    foreach ($files as $f) { if ($f['filename'] === $filename) { $record = $f; break; } }
    if (!$record) fail('File not found', 404);
    if ($_SESSION['role'] === 'director' && $record['directorId'] !== $_SESSION['userId'])
        fail('Forbidden', 403);
    $filepath = DIR_FILES_DIR . $filename;
    if (!file_exists($filepath)) fail('File not found on disk', 404);
    // Override JSON header for binary delivery
    header('Content-Type: ' . ($record['mimetype'] ?? 'application/octet-stream'));
    header('Content-Length: ' . filesize($filepath));
    header('Content-Disposition: inline; filename="' . addslashes($record['originalName']) . '"');
    header('Cache-Control: private, no-store');
    readfile($filepath);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
//  FINANCIAL FILES
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/manager/financial-files') {
    require_manager();
    if (empty($_FILES['file'])) fail('No file uploaded', 400);
    $category = $_POST['category'] ?? '';
    if (!$category) fail('category is required', 400);
    $fileInfo   = store_upload($_FILES['file'], FINANCIAL_DIR);
    $records    = load('financial-records.json');
    $meta       = array_merge(['id' => uuid4(), 'category' => $category, 'uploadedAt' => date('c')], $fileInfo);
    $records[]  = $meta;
    save('financial-records.json', $records);
    respond($meta, 201);
}

if ($method === 'GET' && $path === '/manager/financial-files') {
    require_manager();
    respond(load('financial-records.json'));
}

if ($method === 'DELETE' && route('/manager/financial-files/:id', $path, $p)) {
    require_manager();
    $id      = $p['id'];
    $records = load('financial-records.json');
    $found   = null;
    $new     = [];
    foreach ($records as $r) { if ($r['id'] === $id) $found = $r; else $new[] = $r; }
    if (!$found) fail('File not found', 404);
    @unlink(FINANCIAL_DIR . $found['filename']);
    save('financial-records.json', $new);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'GET' && $path === '/manager/categories') {
    require_manager();
    $financial = array_map(fn($n) => ['name' => $n, 'viewOnly' => true, 'isFinancial' => true], FINANCIAL_CATS);
    $custom    = array_map(fn($c) => ['name' => $c['name'], 'viewOnly' => false,
                                      'isFinancial' => false, 'createdAt' => $c['createdAt']],
                           load('custom-categories.json'));
    respond(array_merge($financial, $custom));
}

if ($method === 'POST' && $path === '/manager/categories') {
    require_manager();
    $b    = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($b['name'] ?? '');
    if (!$name) fail('Category name is required');
    $custom   = load('custom-categories.json');
    $allNames = array_merge(FINANCIAL_CATS, array_column($custom, 'name'));
    foreach ($allNames as $n) {
        if (strtolower($n) === strtolower($name)) fail('Category already exists', 409);
    }
    $cat      = ['name' => $name, 'createdAt' => date('c')];
    $custom[] = $cat;
    save('custom-categories.json', $custom);
    respond(['name' => $name, 'viewOnly' => false, 'isFinancial' => false, 'createdAt' => $cat['createdAt']], 201);
}

if ($method === 'DELETE' && route('/manager/categories/:name', $path, $p)) {
    require_manager();
    $name = urldecode($p['name']);
    if (in_array($name, FINANCIAL_CATS, true)) fail('Cannot delete built-in financial categories', 400);
    $custom = load('custom-categories.json');
    $new    = array_values(array_filter($custom, fn($c) => strtolower($c['name']) !== strtolower($name)));
    if (count($new) === count($custom)) fail('Category not found', 404);
    save('custom-categories.json', $new);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  GENERAL DOWNLOADS
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/manager/downloads') {
    require_manager();
    if (empty($_FILES['file'])) fail('No file uploaded', 400);
    $fileInfo    = store_upload($_FILES['file'], GENERAL_DIR);
    $downloads   = load('general-downloads.json');
    $meta        = array_merge([
        'id'          => uuid4(),
        'description' => $_POST['description'] ?? '',
        'category'    => $_POST['category'] ?? 'General',
        'uploadedAt'  => date('c'),
    ], $fileInfo);
    $downloads[] = $meta;
    save('general-downloads.json', $downloads);
    respond($meta, 201);
}

if ($method === 'GET' && $path === '/manager/downloads') {
    require_manager();
    respond(load('general-downloads.json'));
}

if ($method === 'DELETE' && route('/manager/downloads/:id', $path, $p)) {
    require_manager();
    $id        = $p['id'];
    $downloads = load('general-downloads.json');
    $found     = null;
    $new       = [];
    foreach ($downloads as $f) { if ($f['id'] === $id) $found = $f; else $new[] = $f; }
    if (!$found) fail('File not found', 404);
    @unlink(GENERAL_DIR . $found['filename']);
    save('general-downloads.json', $new);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'GET' && $path === '/public/all-downloads') {
    $financial = array_map(fn($f) => [
        'id'           => $f['id'],
        'filename'     => $f['filename'],
        'originalName' => $f['originalName'],
        'category'     => $f['category'],
        'description'  => '',
        'uploadedAt'   => $f['uploadedAt'],
        'size'         => $f['size'],
        'mimetype'     => $f['mimetype'],
        'viewOnly'     => true,
        'fileUrl'      => '/financial-records/' . $f['filename'],
    ], load('financial-records.json'));

    $general = array_map(fn($f) => [
        'id'           => $f['id'],
        'filename'     => $f['filename'],
        'originalName' => $f['originalName'],
        'category'     => $f['category'] ?? 'General',
        'description'  => $f['description'] ?? '',
        'uploadedAt'   => $f['uploadedAt'],
        'size'         => $f['size'],
        'mimetype'     => $f['mimetype'],
        'viewOnly'     => in_array($f['category'] ?? '', FINANCIAL_CATS, true),
        'fileUrl'      => '/general-downloads/' . $f['filename'],
    ], load('general-downloads.json'));

    respond(array_merge($financial, $general));
}

if ($method === 'GET' && $path === '/public/downloads') {
    respond(load('general-downloads.json'));
}

if ($method === 'GET' && $path === '/public/financial-files') {
    $records = load('financial-records.json');
    if (!empty($_GET['category']))
        $records = array_values(array_filter($records,
            fn($f) => strtolower($f['category']) === strtolower($_GET['category'])));
    respond(array_values($records));
}

// ─────────────────────────────────────────────────────────────────────────────
//  NEWS
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'GET' && $path === '/news') {
    respond(load('news.json', []));
}

if ($method === 'POST' && $path === '/news') {
    require_manager();
    $title    = $_POST['title']   ?? '';
    $excerpt  = $_POST['excerpt'] ?? '';
    $content  = $_POST['content'] ?? '';
    $date     = $_POST['date']    ?? '';
    $videoUrl = $_POST['videoUrl'] ?? '';
    if (!$title || !$excerpt || !$content || !$date)
        fail('title, excerpt, content, date are required');

    $imagePath = '';
    if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fi = store_upload($_FILES['image'], NEWS_DIR);
        $imagePath = '/attached_assets/news/' . $fi['filename'];
    }

    $news  = load('news.json', []);
    $maxId = 0;
    foreach ($news as $n) { if ($n['id'] > $maxId) $maxId = $n['id']; }
    $item  = ['id' => $maxId + 1, 'title' => $title, 'excerpt' => $excerpt,
               'content' => $content, 'image' => $imagePath, 'date' => $date, 'videoUrl' => $videoUrl];
    $news[] = $item;
    save('news.json', $news);
    respond($item, 201);
}

if ($method === 'PUT' && route('/news/:id', $path, $p)) {
    require_manager();
    $id   = (int)$p['id'];
    $news = load('news.json', []);
    foreach ($news as &$item) {
        if ($item['id'] !== $id) continue;
        if (!empty($_POST['title']))   $item['title']   = $_POST['title'];
        if (!empty($_POST['excerpt'])) $item['excerpt'] = $_POST['excerpt'];
        if (!empty($_POST['content'])) $item['content'] = $_POST['content'];
        if (!empty($_POST['date']))    $item['date']    = $_POST['date'];
        if (isset($_POST['videoUrl'])) $item['videoUrl'] = $_POST['videoUrl'];
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            if (!empty($item['image']) && str_starts_with($item['image'], '/attached_assets/news/'))
                @unlink(NEWS_DIR . basename($item['image']));
            $fi = store_upload($_FILES['image'], NEWS_DIR);
            $item['image'] = '/attached_assets/news/' . $fi['filename'];
        }
        save('news.json', $news);
        respond($item);
    }
    fail('News item not found', 404);
}

if ($method === 'DELETE' && route('/news/:id', $path, $p)) {
    require_manager();
    $id   = (int)$p['id'];
    $news = load('news.json', []);
    $found = null;
    $new   = [];
    foreach ($news as $n) { if ($n['id'] === $id) $found = $n; else $new[] = $n; }
    if (!$found) fail('News item not found', 404);
    if (!empty($found['image']) && str_starts_with($found['image'], '/attached_assets/news/'))
        @unlink(NEWS_DIR . basename($found['image']));
    save('news.json', $new);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EMAIL  (uses cPanel's built-in mail)
// ─────────────────────────────────────────────────────────────────────────────

if ($method === 'POST' && $path === '/send-email') {
    $b       = json_decode(file_get_contents('php://input'), true) ?? [];
    $subject = $b['subject'] ?? 'Website Notification';
    $text    = $b['text'] ?? 'No content provided.';
    $to      = 'info@kabiangafcs.co.ke';
    $headers = implode("\r\n", [
        'From: website@kabiangafcs.co.ke',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . PHP_VERSION,
    ]);
    @mail($to, $subject, $text, $headers);
    respond(['success' => true]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  404 catch-all
// ─────────────────────────────────────────────────────────────────────────────
fail('API endpoint not found', 404);
