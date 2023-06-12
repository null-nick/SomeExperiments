<?php
$DC_COLORS = [
    '#329AFE',
    '#8B31FD',
    '#DA5653',
    '#F7B139',
    '#4BD199'
];
$DC_PLACES = [
    'MIA, Miami FL, USA',
    'AMS, Amsterdam, NL',
    'MIA, Miami FL, USA',
    'AMS, Amsterdam, NL',
    'SIN, Singapore, SG'
];
$DC_IP = [
    '149.154.175.50',
    '149.154.167.50',
    '149.154.175.100',
    '149.154.167.91',
    '91.108.56.100'
];
$DC_ICONS = [
    'ic_pluto',
    'ic_venus',
    'ic_aurora',
    'ic_vesta',
    'ic_flora',
]
?>
<html lang="en">
<head>
    <title>DataCenter Status | OwlGram</title>
    <meta name='viewport' content='width=device-width, user-scalable=0'>
    <link href="css/app.css?v=4" rel="preload" as="style">
    <link rel="stylesheet" href="css/app.css?v=4">
    <link href="css/button.css" rel="preload" as="style">
    <link rel="stylesheet" href="css/button.css">
    <link rel="icon" type="image/x-icon" href="https://owlgram.org/favicon.ico">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700%7CGoogle+Sans:400,500%7CProduct+Sans:400&amp;display=swap&amp;lang=en" as="style" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700%7CGoogle+Sans:400,500%7CProduct+Sans:400&amp;display=swap&amp;lang=en" crossorigin>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.8.1/lottie.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="js/button.js"></script>
    <script src="js/blob_drawable.js"></script>
    <script src="js/dc_blob_animation.js"></script>
    <script src="js/app.js?v=11"></script>
</head>
<body oncontextmenu="return false;">
<div class="top_menu">
    <a href="/">
        <img class="logo_top" src="//owlgram.org/img/owlgram.svg" alt="logo"/>
    </a>
    <div class="right_text_container">
        <div>
            <div>
                LAST UPDATE
            </div>
            <div id="loading_date" class="placeholder"></div>
        </div>
    </div>
</div>
<div class="top_bar">
    <div id="header_loader">
    </div>
    <div>
        Here you can see the various status of <a target="_blank" href="https://core.telegram.org/api/datacenter">Media Datacenter</a> in realtime from the section below
    </div>
    <div class="material_button" onclick="refreshPage()">
        <div class="c-button">
            <div>
                <img src="img/restart.svg" alt="icon_restart">
                <div>Refresh Page</div>
            </div>
            <div class="c-ripple js-ripple">
                <span class="c-ripple__circle"></span>
            </div>
        </div>
    </div>
</div>
<div class="top_bar">
    <div class="header_text">
        Datacenter Status
    </div>
    <?php
    for ($i = 0;$i < count($DC_COLORS); $i++) {
        ?>
        <div class="item_ripple c-button_white loading" id="dc<?php echo $i+1;?>_tab">
            <div>
                <div>
                    <blob-animation style="display: none;"><?php echo $DC_COLORS[$i]; ?></blob-animation>
                    <img src="img/<?php echo $DC_ICONS[$i]; ?>.svg" alt="datacenter_icon">
                </div>
                <div>
                    <div>
                        <?php echo $DC_PLACES[$i] . ' - DC' . ($i + 1); ?>
                    </div>
                    <div>
                        <?php echo $DC_IP[$i]; ?>
                    </div>
                    <div id="dc<?php echo $i+1;?>_status"></div>
                </div>
                <div>
                    <div class="placeholder"></div>
                    <div class="placeholder"></div>
                    <div class="placeholder"></div>
                </div>
            </div>
            <?php
            if ($i < count($DC_COLORS) - 1) {
                ?>
                <div class="divider"></div>
                <?php
            }
            ?>
            <div class="c-ripple_white js-ripple">
                <span class="c-ripple_white__circle"></span>
            </div>
        </div>
        <?php
    }
    ?>
</div>
</body>
</html>