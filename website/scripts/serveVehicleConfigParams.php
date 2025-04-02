<?php
$filePath = '/opt/carma/vehicle/config/VehicleConfigParams.yaml';

if (file_exists($filePath)) {
    header('Content-Type: text/plain');
    readfile($filePath);
} else {
    http_response_code(404);
    echo "File not found.";
}
?>