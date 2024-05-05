jQuery(document).ready(function ($)  {

    function createToolModal(data) {
        $div = $('#one_tool_modal');
        $div.find('#title_page_box > .title_page > span').text(data.title);
        $div.find('#rarity_text').html(data.rarity);
        $div.find('#tools_icon').html('<img src="/public/images/tools/'+data.icon+'">');
        $div.find('#cooldown_tool').text(parseInt(data.cooldown) / 60);
        $div.find('#energy_cost_tool').text(data.energy_cost);
        $div.find('#durability_cost_tool').text(data.durability_cost);
        $div.find('#tek_durability_tool').text(data.durability);
        $div.find('#max_durability_tool').text(data.max_durability);
        $div.find('#tek_durability_tool_in_percent').attr('style', 'width: '+(parseInt(data.durability)/(parseInt(data.max_durability) / 100))+'%');
        $reward_icons = '';
        $reward_profit = '';
        $.each(data.rewards, function(k,revard) {
            $reward_icons += '<img src="/public/images/tokens/'+revard.icon+'">';
            $reward_profit += '+'+revard.amount+' '+revard.name+'; ';
        });
        $div.find('#profit_tool').html($reward_profit);
        $div.find('#token_icon').html($reward_icons);

        $('#is_sale_tool').hide();
        if(data.in_sell === true) {
            $('#is_sale_tool').show();
        }

        $('#mining_tool_timer').html('');
        if(data.timer !== null) {
            $('#mining_tool_timer').html('<span class="timer_on" data-sec="'+data.timer+'"></span>');
        }

        $('#mine_btn').html('');
        if(data.buttons.can_mine === true) {
            $('#mine_btn').html('<button type="button" class="btn btn_green mine_btn" data-id="'+data.id+'">'+translate.Mine+'</button>');
        }

        $('#repeare_btn').html('');
        if(data.buttons.can_repeare === true) {
            $price_repeare = data.price_repeare;
            $('#repeare_btn').html('<button type="button" class="btn btn_grey repeare_btn" data-id="'+data.id+'"  data-price="'+$price_repeare+'">'+translate.Repair_for+' '+$price_repeare+' '+translate.gold+'</button>');
        }

        $('#sell_btn').html('');
        if(data.buttons.can_sell === true) {
            $('#sell_btn').html('<a type="button" class="btn btn_grey sell_btn" href="/sell_item/'+data.id+'">'+translate.Sell+'</a>');
        }
        $('#storage_btn').html('');
        if(data.buttons.can_storage === true) {
            $('#storage_btn').html('<button type="button" class="btn btn_grey unequip_btn" data-id="'+data.id+'">'+translate.Unequip+'</button>');
        }

        if(data.selector_mine !== null) {
            $all_hours = [];
            $.each(data.selector_mine, function(k,sel_info) {
                if(sel_info['can_select'] === true) {
                    $all_hours.push(sel_info['hours']);
                }
            });
            if($all_hours.length > 0) {
                $('.slider_mine').show();
                $min = $all_hours[0];
                $max = $all_hours[$all_hours.length - 1];
                $('#mine_btn').children('button').attr('data-count', $max);
                $.each(data.selector_mine, function(k,sel_info) {
                    if(parseInt(sel_info['hours']) === parseInt($max)) {
                        $div.find('#durability_cost_tool').text(sel_info.durability);
                        $div.find('#energy_cost_tool').text(sel_info.energy);
                        $div.find('#cooldown_tool').text($max);
                        $reward_icons = '';
                        $reward_profit = '';
                        $.each(sel_info.reward, function(k2,revard) {
                            $reward_icons += '<img src="/public/images/tokens/'+revard.icon+'">';
                            $reward_profit += '+'+revard.amount+' '+revard.name+'; ';
                        });
                        $div.find('#profit_tool').html($reward_profit);
                        $div.find('#token_icon').html($reward_icons);
                    }
                });
                var handle = $( "#custom-handle" );
                handle.text( $max );
                $( "#slider" ).slider({
                    range: "min",
                    value: $max,
                    min: $min,
                    max: $max,
                    step: 1,
                    create: function() {
                        handle.text( $( this ).slider( "value" ) );
                    },
                    slide: function( event, ui ) {
                        handle.text( ui.value );
                        $.each(data.selector_mine, function(k,sel_info) {
                            if(parseInt(sel_info['hours']) === parseInt(ui.value)) {
                                $div.find('#durability_cost_tool').text(sel_info.durability);
                                $div.find('#energy_cost_tool').text(sel_info.energy);
                                $div.find('#cooldown_tool').text(ui.value);
                                $reward_icons = '';
                                $reward_profit = '';
                                $.each(sel_info.reward, function(k2,revard) {
                                    $reward_icons += '<img src="/public/images/tokens/'+revard.icon+'">';
                                    $reward_profit += '+'+revard.amount+' '+revard.name+'; ';
                                });
                                $div.find('#profit_tool').html($reward_profit);
                                $div.find('#token_icon').html($reward_icons);
                                $('#mine_btn').children('button').attr('data-count', ui.value);
                            }
                        });
                    }
                });
            } else {
                $('.slider_mine').hide();
                $('#mine_btn').html('');
            }
        } else {
            $('.slider_mine').hide();
        }

        $('#one_tool_modal').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            modalClass: "modal-tool"
        });
    }
    function createListToolsModal(data, slot) {
        $html =  `<div class="one_list_tool_modal">`;
        $html +=  `<div class="icon"><img src="/public/images/tools/${data.icon}"/></div>`;
        $html +=  `<div class="durability"><span>${data.durability}/${data.max_durability}</span></div>`;
        $html +=  `<div class="rarity_stars rarity_stars_${data.level}"><span></span></div><div class="buttons">`;

        if(data.buttons.can_equip === true) {
            $html +=  `<button type="button" class="btn btn_green equip_btn" data-id="${data.id}" data-slot="${slot}">`+translate.Equip+`</button>`;
        }
        if(data.in_sell === true) {
            $html += `<span class="is_sale_label">IS SALE</span>`;
        }
        $html +=  `</div></div>`;
        return $html;
    }
    /*
    function createListPacksModal(data) {
        $html =  `<div class="one_list_pack_modal">`;
        $html +=  `<div class="name">${data.name}</div>`;
        $html +=  `<div class="buttons"><button type="button" class="btn btn_green open_pack_btn" data-id="${data.id}">Open</button>`;
        $html +=  `</div></div>`;
        return $html;
    }
    function createListStorageToolsModal(data) {
        $html =  `<div class="one_list_tool_modal">`;
        $html +=  `<div class="icon"><img src="/public/images/tools/${data.icon}"/></div>`;
        $html +=  `<div class="durability"><span>${data.durability}/${data.max_durability}</span></div>`;
        $html +=  `<div class="rarity_stars rarity_stars_${data.level}"><span></span></div><div class="buttons">`;
        if(data.buttons.can_sell === true) {
            $html +=  `<a type="button" class="btn btn_green sell_btn" href="/sell_item/${data.id}">Sell</a>`;
        }
        if(data.in_sell === true) {
            $html += `<span class="is_sale_label">IS SALE</span>`;
        }
        if(data.in_eqip === true) {
            $html += `<span class="is_equip_label">IS EQUIP</span>`;
        }
        $html +=  `</div></div>`;
        return $html;
    }
*/
    $('body').on('touchend, click', '.modal_tool_btn', function(e) {
        $slot = $(this).attr('data-slot');
        $.post('/handler_play', {type_req: 'modal_one_tool', slot: $slot}).done(function(data){
            if (data.status === true) {
                createToolModal(data.data.tool);
            } else {
                Swal.fire({
                    //icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });
    $('body').on('touchend, click', '.modal_insert_tool_btn', function(e) {
        $id_slot = $(this).attr('data-slot');
        $.post('/handler_play', {type_req: 'modal_insert_tool', slot: $id_slot}).done(function(data){
            if (data.status === true) {
                $('#list_tools_modal').find('#title_page_box > .title_page > span').text(translate.Equip);
                $html = '';
                $('#list_tools_modal').find('#tools_lists_box').html('');
                $.each(data.data.tool, function(k,one_tool) {
                    $html += createListToolsModal(one_tool, $id_slot);
                });
                $('#list_tools_modal').find('#tools_lists_box').html($html);
                $('#list_tools_modal').modal({
                    escapeClose: false,
                    clickClose: false,
                    showClose: false,
                    modalClass: "modal-tool"
                });
            } else {
                Swal.fire({
                    //icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });

    $('body').on('touchend, click', '.modal_unlock_slot_btn', function(e) {
        $id_slot = $(this).attr('data-slot');
        $.post('/handler_play', {type_req: 'unlock_slot_info', id: $id_slot}).done(function(data){
            if (data.status === true) {
                $html = '';
                $.each(data.data.list, function(k,one_p) {
                    $html += '<div><strong>-'+one_p.amount+'</strong> <img src="/public/images/tokens/'+one_p.token.icon+'" width="32"> ('+one_p.token.name+')</div>';
                });
                Swal.fire({
                    title: translate.Are_you_sure,
                    html: translate.Your_resources_will_be_debited + ': '+$html,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: translate.Yes_unlock,
                    customClass: {
                        container: 'swal_alert_game',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.post('/handler_play', {type_req: 'unlock_slot', id: $id_slot}).done(function(data){
                            if (data.status === true) {
                                Swal.fire({
                                    title: translate.Successfully,
                                    html: ``,
                                    // icon: "success",
                                    customClass: {
                                        container: 'swal_alert_game',
                                    }
                                }).then((result) => {
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
                    }
                });
            }
        });
    });

    $('body').on('touchend, click', '.equip_btn', function(e) {
        $id_tool = $(this).attr('data-id');
        $slot = $(this).attr('data-slot');
        $.post('/handler_play', {type_req: 'equip', id: $id_tool, slot: $slot}).done(function(data){
            if (data.status === true) {
                location.reload();
            } else {
                Swal.fire({
                    //icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });
    $('body').on('touchend, click', '.unequip_btn', function(e) {
        $id_tool = $(this).attr('data-id');
        $.post('/handler_play', {type_req: 'unequip', id: $id_tool}).done(function(data){
            if (data.status === true) {
                location.reload();
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

    $('body').on('touchend, click', '.repeare_btn', function(e) {
        $id_tool = $(this).attr('data-id');
        $price = $(this).attr('data-price');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Do_you_want_to_repair+" "+$price+" <img src='/public/images/tokens/gold_shadow.png'>",
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_repair,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_play', {type_req: 'repeare', id: $id_tool}).done(function(data){
                    if (data.status === true) {
                        location.reload();
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
    $('body').on('touchend, click', '.mine_btn', function(e) {
        $id_tool = $(this).attr('data-id');
        $count = $(this).attr('data-count');
        $.post('/handler_play', {type_req: 'mine', id: $id_tool, count: $count}).done(function(data){
            if (data.status === true) {
                Swal.fire({
                    title: translate.Successfully,
                    html: translate.You_received+`: ${data.data.mine}`,
                    customClass: {
                        container: 'swal_alert_game',
                    }
                }).then((result) => {
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

    /*
     * DROP
     */

    let drop_array = {
        6: 0,
        5: 0,
    };
    if (typeof (show_drop_modal) !== "undefined") {
        if(show_drop_modal === true) {
            $('#drop_modal').modal({
                escapeClose: false,
                clickClose: false,
                showClose: false,
                modalClass: "modal-drop"
            });
            $('#drop_modal').on($.modal.BEFORE_CLOSE, function(event, modal) {
                $.post('/handler_play', {type_req: 'close_modal_drop'}).done(function(data){});
            });
        }
    }
    $('body').on('touchend, click', '.drop_btn_popup', function(e) {
        $('#drop_modal').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            modalClass: "modal-drop"
        });
    });
    $('body').on('touchend, click', '.buy_drop_btn', function(e) {
        console.log(1);
        $id_pack = $(this).attr('data-id');
        if(drop_array[$id_pack] === 0) {
            drop_array[$id_pack] = 1;
        } else {
            drop_array[$id_pack] = 0;
        }
        $all_summ = 0;
        $count_active_pack = 0;
        $.each(drop_array, function(id_drop,count) {
            $('#select_counter_pack_'+id_drop).text(count);
            if(count > 0) {
                $('.buy_drop_btn[data-id="'+id_drop+'"]').children('img').attr('src', '/public/images/btn_remove.png');
                $ton = $('.buy_drop_btn[data-id="'+id_drop+'"]').parent('.one_pack_check_btn').parent('.one_pack_buttons').children('.one_pack_price').children('.value').text();
                $all_summ += parseFloat($ton);
                $count_active_pack += 1;
            } else {
                $('.buy_drop_btn[data-id="'+id_drop+'"]').children('img').attr('src', '/public/images/btn_add.png');
            }
        });
        $('#boxs_complete_drops').find('.complete_ton_value').text(Math.floor( $all_summ * 100 ) / 100);
        $('#counter_select_packs').text($count_active_pack);
        if($count_active_pack >= 2) {
            $('.bonus_complete_box').removeClass('bonus_complete_box_no_active');
        } else {
            $('.bonus_complete_box').addClass('bonus_complete_box_no_active');
        }
        if($count_active_pack > 0) {
            $('.buy_complete_drop_btn').addClass('active');
        } else {
            $('.buy_complete_drop_btn').removeClass('active');
        }
    });

    $('body').on('touchend, click', '.open_pack_btn', function(e) {
        $id_pack = $(this).attr('data-id');
        $.post('/handler_play', {type_req: 'open_pack', id: $id_pack}).done(function(data){
            if (data.status === true) {
                Swal.fire({
                    title: "Successfully!",
                    html: data.data.pack,
                    customClass: {
                        container: 'swal_alert_game',
                    }
                }).then((result) => {
                    location.reload();
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
    $('body').on('touchend, click', '.buy_complete_drop_btn', function(e) {
        $capcha = $('#capsha_code_drop').attr('src');
        Swal.fire({
            title: "Captcha",
            html: 'Send: <img src="'+$capcha+'" width="115" style="width: 115px;">',
            input: "number",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Confirm",
            showLoaderOnConfirm: true,
            customClass: {
                container: 'swal_alert_game',
            },
            preConfirm: async (login) => {
                return login;
                //
                // try {
                //     if(parseInt(login) !== parseInt(id_user)) {
                //         return Swal.showValidationMessage("Wrong  capcha");
                //     }
                //
                // } catch (error) {
                //     Swal.showValidationMessage(`Request failed: ${error}`);
                // }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_settings', {packs: drop_array, type_req: 'buy_pack_in_game', capcha: result.value}).done(function (data) {
                    if (data.status === true) {
                        Swal.fire({
                            title: "Transaction confirm!",
                            text: "Add pack in your storage!",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
                            $.post('/handler_play', {type_req: 'close_modal_drop'}).done(function(data){});
                            location.reload();
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
            }
        });
    });
    /*
    $('body').on('touchend, click', '.buy_complete_drop_btn', async function(e) {
        fetch('/handler_settings',{
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: JSON.stringify({packs: drop_array, type_req: 'buy_pack'})
        }).then(function(response){
            return response.json();
        }).then(async function (data) {
            if (data.status === true) {
                $id_insert = data.data.id;
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [
                        {
                            address: data.data.admin_ton_address,
                            amount: data.data.amount,
                            payload: data.data.payload
                        }
                    ]
                }
                try {
                    console.log(transaction);
                    const result = await tonConnectUI.sendTransaction(transaction);
                    $.post('/handler_settings', {
                        boc: result.boc,
                        id: $id_insert,
                        type_req: 'confirm_invoice'
                    }).done(function (data) {
                        if (data.status === true) {
                            Swal.fire({
                                title: "Transaction confirm!",
                                text: "Wait < 1 min to add pack in your storage!",
                                //icon: "success",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showDenyButton: true,
                                showCancelButton: false,
                                confirmButtonText: "Ok",
                                customClass: {
                                    container: 'swal_alert_game',
                                }
                            }).then((result) => {
                                $.post('/handler_play', {type_req: 'close_modal_drop'}).done(function(data){});
                                location.reload();
                            });
                        } else {
                            throw new Error(data.error);
                        }
                    });
                } catch (e) {
                    throw new Error(e.message);
                }
            } else {
                throw new Error(data.error);
            }
        }).catch((err) => {
            Swal.fire({
               // icon: "error",
                title: "Oops...",
                text: `Error create invoice: ${err.message}`,
                customClass: {
                    container: 'swal_alert_game_error',
                }
            });
        });
    });
*/
    /*
    * REFS
    */
    $('body').on('touchend, click', '.show_ref_details_btn', function(e) {
        $('#info_refferal_modal').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            modalClass: "modal-drop"
        });
    });
    /*
    * ENERGY
    */

    var slider_buy_energy = document.getElementById("slider_buy_energy");
    if(slider_buy_energy) {
        $max_l = parseInt((config_energy.max_energy - config_energy.init_energy) / config_energy.koef);
        var handle_e = $( "#custom-handle-e" );
        let slider_ener = $( "#slider_buy_energy" ).slider({
            range: "min",
            value: 0,
            min: 0,
            max: $max_l,
            step: 1,
            create: function() {
                handle_e.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                if(config_energy.init_food > 0) {
                    if((config_energy.init_energy +  parseInt(ui.value) * config_energy.koef) <= config_energy.max_energy) {
                        handle_e.text(ui.value);
                        $('#change_swap_food_counter').text(ui.value);
                        $energy_r = config_energy.init_energy + parseInt(ui.value) * config_energy.koef;
                        $percent = Math.round($energy_r / (config_energy.max_energy / 100));
                        $('#line_enerdy_modal_added').attr('style', 'width: ' + $percent + '%;');
                        $('#line_enerdy_modal_added').parent('.line_energy').parent('.energy_line').children('.value_energy').text('Energy ' + $energy_r + '/' + config_energy.max_energy);
                    }
                }
            }
        });
        $('body').on('touchend, click', '.add_energy_btn', function(e) {
            $('#add_energy_modal').modal({
                escapeClose: false,
                clickClose: false,
                showClose: false,
                modalClass: "modal-drop"
            });
        });
        $('body').on('touchend, click', '#add_energy_btn', function(e) {
            $current_select = slider_ener.slider( "value" );
            $value = parseInt($current_select);
            if((config_energy.init_energy +  ($value + 1) * config_energy.koef) <= config_energy.max_energy) {
                slider_ener.slider( "value",  $value + 1);
                handle_e.text($value + 1);
                $('#change_swap_food_counter').text($value + 1);
                $energy_r = config_energy.init_energy +  ($value + 1) * config_energy.koef;
                $percent = Math.round($energy_r / (config_energy.max_energy / 100));
                $('#line_enerdy_modal_added').attr('style', 'width: ' + $percent + '%;');
                $('#line_enerdy_modal_added').parent('.line_energy').parent('.energy_line').children('.value_energy').text('Energy ' + $energy_r + '/' + config_energy.max_energy);
            }
        });
        $('body').on('touchend, click', '#remove_energy_btn', function(e) {
            $current_used_food = $('#change_swap_food_counter').text();
            if(parseInt($current_used_food) > 0) {
                $current_select = slider_ener.slider("value");
                $value = parseInt($current_select);
                slider_ener.slider("value", $value - 1);
                handle_e.text($value - 1);
                $('#change_swap_food_counter').text($value - 1);
                $energy_r = config_energy.init_energy + ($value - 1) * config_energy.koef;
                $percent = Math.round($energy_r / (config_energy.max_energy / 100));
                $('#line_enerdy_modal_added').attr('style', 'width: ' + $percent + '%;');
                $('#line_enerdy_modal_added').parent('.line_energy').parent('.energy_line').children('.value_energy').text('Energy ' + $energy_r + '/' + config_energy.max_energy);
            }
        });
        $('body').on('touchend, click', '.confirm_exchange_energy_btn', function(e) {
            $current_used_food = $('#change_swap_food_counter').text();
            $.post('/handler_play', {type_req: 'buy_energy', count: parseInt($current_used_food)}).done(function(data){
                if (data.status === true) {
                    Swal.fire({
                        title: translate.Successfully,
                        html: translate.You_received+' '+(parseInt($current_used_food) * config_energy.koef)+' energy',
                        customClass: {
                            container: 'swal_alert_game',
                        }
                    }).then((result) => {
                        location.reload();
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
        $('body').on('touchend, click', '.confirm_buy_max_energy_btn', function(e) {
            Swal.fire({
                title: translate.Are_you_sure,
                html: translate.Are_you_sure_you_want_to_increase_your_maximum + '?<br/>'+translate.You_will_spend_FOOD,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: translate.Yes,
                customClass: {
                    container: 'swal_alert_game',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post('/handler_play', {type_req: 'up_max_energy'}).done(function(data){
                        if (data.status === true) {
                            Swal.fire({
                                title: translate.Successfully,
                                html: ``,
                                // icon: "success",
                                customClass: {
                                    container: 'swal_alert_game',
                                }
                            }).then((result) => {
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
                }
            });
        });
    }


    $('body').on('touchend, click', '#connect_to_channel', function(e) {
        e.preventDefault();
        $.post('/handler_play', {type_req: 'connect_to_channel'}).done(function(data){
            if (data.status === true) {
                window.location.href = 'https://t.me/farmworldton';
            } else {
                Swal.fire({
                    //icon: "error",
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });
    /*
    * Factories
    */
    $('body').on('touchend, click', '.build_slot_factoies_btn', function(e) {
        $id_f = $(this).attr('data-id');
        $count_stone = $(this).attr('data-price');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.To_build_the_foundation_you_will_spend+" "+$count_stone+" <img src='/public/images/tokens/stone.png'>",
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_build,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_factories', {type_req: 'build_slot', id: $id_f}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
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
            }
        });
    });
    $('body').on('touchend, click', '.build_factoies_btn', function(e) {
        $id_f = $(this).attr('data-id');
        $.post('/handler_factories', {type_req: 'build_info', id: $id_f}).done(function(data){
            if (data.status === true) {
                $html_spend = '';
                $.each(data.data.items, function(k,one_item) {
                    $html_spend += '<span class="spend_one_item"><span class="value">'+one_item.value+'</span><span class="icon"><img src="'+one_item.icon+'" width="'+one_item.width+'"/></span></span>';
                });
                Swal.fire({
                    title: translate.Are_you_sure,
                    html: translate.To_build_a_factory_you_will_spend+"<br/>"+$html_spend,
                    // icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: translate.Yes_build,
                    customClass: {
                        container: 'swal_alert_game',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.post('/handler_factories', {type_req: 'build', id: $id_f}).done(function(data){
                            if (data.status === true) {
                                Swal.fire({
                                    title: translate.Successfully,
                                    html: ``,
                                    showCancelButton: false,
                                    customClass: {
                                        container: 'swal_alert_game',
                                    }
                                }).then((result) => {
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
                    }
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

    $('body').on('touchend, click', '.up_level_factories_btn', function(e) {
        $id_f = $(this).attr('data-id');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Your_resources_will_be_spent_on_increasing_the_level_of_the_trading_post,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_increase,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_factories', {type_req: 'level_up', id: $id_f}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            showCancelButton: false,
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
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
            }
        });
    });
    $('body').on('touchend, click', '.craft_factories_btn', function(e) {
        $id_f = $(this).attr('data-id');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Your_resources_will_be_spent_on_creating_the_material,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_create,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_factories', {type_req: 'craft', id: $id_f}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            showCancelButton: false,
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
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
            }
        });
    });

    /*
    * BAFS
    */
    $('body').on('touchend, click', '.bufs_btn', function(e) {
        $id = $(this).attr('data-id');
        $.each($('#one_tool_bafs_modal').find('.activate_baf_btn'), function(k,sel_info) {
            $(this).attr('data-id-tool', $id);
        });
        $('#one_tool_bafs_modal').modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            modalClass: "modal-dialog"
        });
    });
    $('body').on('touchend, click', '.activate_baf_btn', function(e) {
        $id_baf = $(this).attr('data-id');
        $id_tool = $(this).attr('data-id-tool');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Your_resources_will_be_spent_on_activating_a_temporary_improvement,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_improve,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_factories', {type_req: 'add_baf', id: $id_baf, id_tool:$id_tool}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            showCancelButton: false,
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
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
            }
        });
    });

});



