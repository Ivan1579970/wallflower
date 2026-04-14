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

if (!isset($_POST['name']) || !isset($_POST['message'])) {
    echo json_encode(['error' => 'Заполните все поля']);
    exit;
}

$name = trim($_POST['name']);
$message = trim($_POST['message']);

if (empty($name) || empty($message)) {
    echo json_encode(['error' => 'Имя и сообщение не могут быть пустыми']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO reviews (name, message) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Отзыв добавлен']);
} else {
    echo json_encode(['error' => 'Ошибка при добавлении отзыва']);
}

$stmt->close();
$conn->close();
?>