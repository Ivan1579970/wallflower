<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$dbname = "wallflower";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

$conn->set_charset("utf8mb4");

$sql = "SELECT name, message, DATE_FORMAT(created_at, '%d.%m.%Y в %H:%i') as date 
        FROM reviews 
        ORDER BY created_at DESC";

$result = $conn->query($sql);

$reviews = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        $reviews[] = [
            'name' => htmlspecialchars($row['name']),
            'message' => htmlspecialchars($row['message']),
            'date' => $row['date']
        ];
    }
}

echo json_encode($reviews);
$conn->close();
?>