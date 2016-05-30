<?php
    require_once '../config/version.php';
?>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Teremok</title>
        <meta name="description" content="">
        <meta name="keywords" content="">
        <meta name="author" content="humans.txt">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" href="favicon.ico">

        <!-- preloader styles -->
        <link rel="stylesheet" href="res/themes/default/css/jquery.isLoading.css">

        <!-- basic styles -->
        <link rel="stylesheet" href="res/themes/default/css/basic.css">

        <script type="text/javascript" src="res/js/libs/jquery.js"></script>
        <script type="text/javascript" src="res/js/libs/jquery.cookie.js"></script>
        <script type="text/javascript" src="res/js/libs/jquery.radio.js"></script>
        <script type="text/javascript" src="res/js/libs/jquery-ui.js"></script>
        <script type="text/javascript" src="res/js/libs/jquery.isloading.js"></script>
        <script type="text/javascript" src="res/js/libs/bootstrap.min.js"></script>
        <script type="text/javascript" src="res/js/libs/bootstrap-slider.js"></script>
        <script type="text/javascript" src="res/js/libs/date.format.js"></script>
        <script type="text/javascript" src="res/js/libs/highstock.js"></script>

        <script type="text/javascript" src="res/js/teremok.js?version=<?=VERSION?>"></script>

        <!-- system -->
        <script type="text/javascript" src="res/js/teremok/system.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/hooks.js?version=<?=VERSION?>"></script>

        <script type="text/javascript">
            T.System.setVersion(<?=VERSION?>);
        </script>

        <script type="text/javascript" src="res/js/teremok/system/config.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/router.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/server.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/server/ajax.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/proxy-server.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/user.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/validators.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/system/history.js?version=<?=VERSION?>"></script>

        <!-- models -->
        <script type="text/javascript" src="res/js/teremok/models.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/order.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/step.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/client.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/point.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/point-group.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/user.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/tariff.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/release-note.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/transaction.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/role.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/models/message.js?version=<?=VERSION?>"></script>

        <!--UI-->
        <script type="text/javascript" src="res/js/teremok/ui.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/basic-element.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/button.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/input.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/image.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/preloader.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/indicator.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/preview.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/container.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/main-container.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/link.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/information.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/dialog.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/resources-list.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/sound.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/index.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/line.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/menu.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/main-menu.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/list.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/list-item.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/selectbox.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/full-info-page.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/date.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/form.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/page.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/radio.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/multi-checkbox.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/ui/graph.js?version=<?=VERSION?>"></script>

        <!-- vocabularies -->
        <script type="text/javascript" src="res/js/teremok/vocabularies.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/vocabularies/russian.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/vocabularies/english.js?version=<?=VERSION?>"></script>

        <!-- managers -->
        <script type="text/javascript" src="res/js/teremok/managers.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/managers/data-manager.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/managers/styles-manager.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/managers/list-manager.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/managers/resources-manager.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/managers/statistics-manager.js?version=<?=VERSION?>"></script>

        <!-- controllers -->
        <script type="text/javascript" src="res/js/teremok/controllers.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/controllers/login.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/controllers/inspector.js?version=<?=VERSION?>"></script>
        <script type="text/javascript" src="res/js/teremok/controllers/agent.js?version=<?=VERSION?>"></script>

        <!-- utils -->
        <script type="text/javascript" src="res/js/teremok/utils.js?version=<?=VERSION?>"></script>

        <!-- controllers data -->
        <script type="text/javascript" src="res/js/teremok/templates.js?version=<?=VERSION?>"></script>

    </head>
    <body class="body resource" resource_id="body" resource_type="container">

    </body>
</html>
