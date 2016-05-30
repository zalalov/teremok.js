<?php
    $templates = glob('./*.html');

    foreach ($templates as $template) {
        include($template);
    }
