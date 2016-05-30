<?php
    $files = $_REQUEST['filenames'];

    foreach ($files as $file) {
        include($file);
    }