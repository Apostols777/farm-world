jQuery(document).ready(function ($)  {
    $('body').on('touchend, click', '.sub_menu_box button', function(e) {
        $(this).parent('.sub_menu_box').children('button').removeClass('active');
        $(this).addClass('active');
        $id_div = $(this).attr('data-name');
        $hide_class = $(this).attr('data-class');
        $('.'+$hide_class).hide();
        $('#list_'+$id_div).show();
    });


    $.each($('.timer_on:not(.work_cooldown)'), function() {
        $sec = $(this).attr('data-sec');
        $sec = parseInt($sec);
        $f0 = '%H:%M:%S';
        var d = new Date((new Date()).valueOf() + 1000*$sec);
        $(this).countdown(d, function(event) {
            $(this).addClass('work_cooldown');
            $(this).html(event.strftime($f0));
        }).on('finish.countdown', function(event) {
            $(this).removeClass('work_cooldown');
            location.reload();
        });
    });

    $.each($('.timer_on_days:not(.work_cooldown)'), function() {
        $sec = $(this).attr('data-sec');
        $sec = parseInt($sec);
        $f = '%D:%H:%M:%S';
        var d = new Date((new Date()).valueOf() + 1000*$sec);
        $(this).countdown(d, function(event) {
            $(this).addClass('work_cooldown');
            $(this).html(event.strftime($f));
        }).on('finish.countdown', function(event) {
            $(this).removeClass('work_cooldown');
            location.reload();
        });
    });
    // change_lang_btn
    $('body').on('touchend, click', '.change_lang_btn', function(e) {
        $lang = $(this).attr('data-lang');
        $.post('/handler_settings', {type_req: 'change_lang', lang: $lang}).done(function(data){
            location.reload();
        });

    });
});



