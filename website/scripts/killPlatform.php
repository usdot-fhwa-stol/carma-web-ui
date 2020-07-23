<?php
  // Kill the docker system
  shell_exec("/var/www/html/scripts/docker_kill.bash");
  // Move to logout page
  header("Location: ../index.html"); // Move onto main.html
?>