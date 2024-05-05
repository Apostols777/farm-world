jQuery(document).ready(function ($)  {
    $('body').on('touchend, click', '.craft_tools_btn', function(e) {
        $id = $(this).attr('data-id');

        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Do_you_want_to_craft,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_craft,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_craft', {type_req: 'craft', id: $id}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            // icon: "success",
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
                            window.location.href = '/play';
                            //location.reload();
                        });
                    } else {
                        Swal.fire({
                            // icon: "error",
                            title: "Oops...",
                            html: `${data.error}`,
                            customClass: {
                                container: 'swal_alert_game_error',
                            }
                        });
                    }
                });
            }
        });
    });


    $('body').on('touchend, click', '.disasemble_btn_new', function(e) {
        $id = $(this).attr('data-id');
        $percent = $(this).attr('data-percent');
        $.post('/handler_craft', {type_req: 'disasemble_new', id: $id, 'percent': $percent}).done(function(data){
            if (data.status === true) {
                Swal.fire({
                    title: translate.Successfully,
                    html: ``,
                    customClass: {
                        container: 'swal_alert_game',
                    }
                }).then((result) => {
                    window.location.href = '/storage';
                });
            } else {
                Swal.fire({
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });

    $('body').on('touchend, click', '.claim_disasemble', function(e) {
        $id = $(this).attr('data-id');
        $.post('/handler_craft', {type_req: 'disasemble_claim', id: $id}).done(function(data){
            if (data.status === true) {
                $html = '';
                $.each(data.data.list, function(k,one_p) {
                    $html += '<div><strong>+'+one_p.amount+'</strong> <img src="/public/images/tokens/'+one_p.token.icon+'" width="32"> ('+one_p.token.name+')</div>';
                });
                Swal.fire({
                    title: translate.Successfully,
                    html: translate.You_received+': '+$html,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'swal_alert_game',
                    }}).then((result) => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    // icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });

    let slider_burn = null;
    $('body').on('touchend, click', '.burn_btn', function(e) {
        $alias = $(this).attr('data-res');
        $max = parseInt($(this).attr('data-max'));
        $point_to_one = parseInt($(this).attr('data-point'));
        $('#burn_count_res').text('0');
        $('#burn_count_points').text('0');
        $('#burn_name_res').text($alias);
        $('#burn_btn_confirm').attr('data-count', '0');
        $('#burn_btn_confirm').attr('data-alias', $alias);
        $('burn_name_res').text($alias);

        if(slider_burn !== null) {
            $( "#slider_burn" ).slider( "destroy" );
        }
        var handle_e_burn = $( "#custom-handle-burn" );
        slider_burn = $( "#slider_burn" ).slider({
            range: "min",
            value: 0,
            min: 0,
            max: $max,
            step: 1,
            create: function() {
                handle_e_burn.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                handle_e_burn.text(ui.value);
                $('#burn_count_res').text(ui.value);
                $added_points = parseInt(ui.value) * $point_to_one;
                $('#burn_count_points').text($added_points);
                $('#burn_btn_confirm').attr('data-count', ui.value);
                $('#burn_btn_confirm').attr('data-alias', $alias);
            }
        });
        $('#burn_res_modal').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            modalClass: "modal-drop"
        });
    });
    $('body').on('touchend, click', '#burn_btn_confirm', function(e) {
        $alias = $(this).attr('data-alias');
        $count = parseInt($(this).attr('data-count'));
        $.post('/handler_craft', {type_req: 'burn', alias: $alias, count:$count }).done(function(data){
            if (data.status === true) {
                Swal.fire({
                    title: translate.Successfully,
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'swal_alert_game',
                    }}).then((result) => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    // icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });
});