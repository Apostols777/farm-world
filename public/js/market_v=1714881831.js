jQuery(document).ready(function ($)  {
    let filter_market = {
        WOOD: false,
        FOOD: false,
        GOLD: false,
        STONE: false,
        PLANKS: false,
        SOUP: false,
        INGOT: false,
        sort: 'floor',
        page: 1,
        min_count: 0,
        min_count_m: 0
    };
    var load_market_id = document.getElementById("load_market_id");
    if(load_market_id) {
        if($('.one_filter_token[data="WOOD"]').hasClass("one_filter_token_active") ) {
            filter_market.WOOD = true;
        }
        if($('.one_filter_token[data="FOOD"]').hasClass("one_filter_token_active") ) {
            filter_market.FOOD = true;
        }
        if($('.one_filter_token[data="GOLD"]').hasClass("one_filter_token_active") ) {
            filter_market.GOLD = true;
        }
        if($('.one_filter_token[data="STONE"]').hasClass("one_filter_token_active") ) {
            filter_market.STONE = true;
        }
        if($('.one_filter_token[data="PLANKS"]').hasClass("one_filter_token_active") ) {
            filter_market.PLANKS = true;
        }
        if($('.one_filter_token[data="SOUP"]').hasClass("one_filter_token_active") ) {
            filter_market.SOUP = true;
        }
        if($('.one_filter_token[data="INGOT"]').hasClass("one_filter_token_active") ) {
            filter_market.INGOT = true;
        }
        if($('.one_sort_token[data="floor"]').hasClass("one_sort_token_active") ) {
            filter_market.sort = 'floor';
        }
        if($('.one_sort_token[data="price"]').hasClass("one_sort_token_active") ) {
            filter_market.sort = 'price';
        }
        filter_market.min_count = parseInt($('#min_count_filter_input').val());
        filter_market.min_count_m = parseInt($('#min_count_filter_input_m').val());
        loadItems();
    }
    $('body').on('touchend, click', '.one_filter_token', function(e) {
        $data = $(this).attr('data');
        if ( $(this).hasClass("one_filter_token_active") ) {
            $(this).removeClass('one_filter_token_active');
            filter_market[$data] = false;
        } else {
            $(this).addClass('one_filter_token_active');
            filter_market[$data] = true;
        }
        $('#load_market_id').html('');
        filter_market.page = 1;
        loadItems();
    });
    $('body').on('touchend, click', '.one_sort_token', function(e) {
        $('.one_sort_token').removeClass('one_sort_token_active');
        $(this).addClass('one_sort_token_active');
        filter_market.sort = $(this).attr('data');
        filter_market.page = 1;
        $('#load_market_id').html('');
        loadItems();
    });
    $('body').on('touchend, click', '.load_more_items', function(e) {
        filter_market.page += 1;
        loadItems();
    });

    function renderOneMarketResource(data) {
        $html =  `<div class="one_market_tool_window">`;
        $html +=  `<span class="ton_icon"><img src="/public/images/tokens/ton.png"/></span>`;
        $html +=  `<div class="icon_box"><span class="icon"><img src="/public/images/tokens/${data.icon}"/></span><span class="count_box">x${data.count}</span></div>`;
        $html +=  `<div class="price_box"><span>${data.price}</span></div>`;
        $html +=  `<div class="price_one_box"><span>${data.price_one}</span></div>`;
        $html +=  `<div class="button_b">`;
        if(data.can_buy === true) {
            $html +=  `<button type="button" class="btn btn_green buy_item_btn" data-id="${data.id}" data-icon="tokens/${data.icon}" data-count="${data.count}" data-price="${data.price}">`+translate.Buy+`</button>`;
        } else {
            $html +=  `<button type="button" class="btn btn_green buy_item_btn" disabled>`+translate.Buy+`</button>`;
        }
        $html +=  `</div>`;
        $html +=  `</div>`;
        return $html;
    }

    function loadItems() {
        console.log(filter_market);
        $.post('/handler_market', {type_req: 'load_items', type: 'resourse', filter: filter_market}).done(function(data){
            if (data.status === true) {
                $html = '';
                $.each(data.data.list, function(k,one_item) {
                    $html += renderOneMarketResource(one_item);
                });
                $('#load_market_id').append($html);
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
    $('#min_count_filter_input').on('keyup', function(e){
        $val = $(this).val();
        if($val !== '') {
            $('#load_market_id').html('');
            filter_market.page = 1;
            filter_market.min_count = parseInt($val);
            loadItems();
        }
    });
    $('#min_count_filter_input_m').on('keyup', function(e){
        $val = $(this).val();
        if($val !== '') {
            $('#load_market_id').html('');
            filter_market.page = 1;
            filter_market.min_count_m = parseInt($val);
            loadItems();
        }
    });

    $('body').on('touchend, click', '#btn_sell_item', function(e) {
        $id_tool = $(this).attr('data-id');
        $price = $('#input_price').val();
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.Do_you_want_to_offer_this_tool+" "+$price+" <img src='/public/images/tokens/ton.png'>",
            //  icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_sell,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_market', {type_req: 'sell_item', id: $id_tool, price: $price}).done(function(data){
                    if (data.status === true) {
                        Swal.fire({
                            title: translate.Successfully,
                            html: ``,
                            customClass: {
                                container: 'swal_alert_game',
                            }
                        }).then((result) => {
                            window.location.href = '/play';
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

    $('body').on('touchend, click', '.disable_sell_item_btn', function(e) {
        $id_item = $(this).attr('data-id');
        $.post('/handler_market', {type_req: 'disable_sell_item', id: $id_item}).done(function(data){
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
                    title: "Oops...",
                    html: `${data.error}`,
                    customClass: {
                        container: 'swal_alert_game_error',
                    }
                });
            }
        });
    });


    $('body').on('touchend, click', '.btn_sell_resourse', function(e) {
        $alias_resourse = $(this).attr('data-id');
        $alias_icon = $(this).attr('data-icon');
        $age = $(this).attr('data-age');
        $capcha_img = $(this).parent('.one_line_sell_box_button').children('img').attr('src');
        $count = $('#input_count_'+$alias_resourse).val();
        $price = $('#input_price_'+$alias_resourse).val();
        $count = parseFloat($count);
        if($age === '1') {
            $html_text = translate.Do_you_want_to_offer+" "+$count+" <img src='/public/images/tokens/"+$alias_icon+"'> "+translate.for_sale_for+" "+$price+" <img src='/public/images/tokens/ton.png'><br/><span style='color: #faa;font-size: 12px;'>"+translate.You_will_be_deducted+" 3 <img src='/public/images/tokens/"+$alias_icon+"' width='24'> "+translate.for_placing_an_order+"</span><br/>Capcha: <img src='"+$capcha_img+"' width='115' style='width: 115px;'>";
        } else if ($age === '2') {
            $html_text = translate.Do_you_want_to_offer+" "+$count+" <img src='/public/images/tokens/"+$alias_icon+"'> "+translate.for_sale_for+" "+$price+" <img src='/public/images/tokens/ton.png'><br/>Capcha: <img src='"+$capcha_img+"' width='115' style='width: 115px;'>";
        }
        Swal.fire({
            title: translate.Are_you_sure,
            html: $html_text,
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
            preConfirm: async (capcha_code) => {
                return capcha_code;
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_market', {type_req: 'sell_resourse', alias: $alias_resourse, price: $price, count: $count, capcha: result.value}).done(function (data) {
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

    $('body').on('touchend, click', '.buy_item_btn', function(e) {
        $id = $(this).attr('data-id');
        $buy_icon = $(this).attr('data-icon');
        $buy_count = $(this).attr('data-count');
        $buy_price = $(this).attr('data-price');
        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.You_want_to_buy+" "+$buy_count+" <img src='/public/images/"+$buy_icon+"'> "+translate.for+" "+$buy_price+" <img src='/public/images/tokens/ton.png'>",
            //  icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_buy,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_market', {type_req: 'buy', id: $id}).done(function(data){
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

    var sell_resources_page = document.getElementById("sell_resources_page");
    if(sell_resources_page) {
        $current_floor = {
            WOOD: 0,
            FOOD: 0,
            GOLD: 0,
            STONE: 0,
            PLANKS: 0,
            SOUP: 0,
            INGOT: 0,
        };
        let timerChecktokensFlor = setInterval(() => {
            $.post('/tokens.php?access_token=BkWpf4X4A5QswyesLVHo5qxGKfqwwx', {}).done(function(data){
                if(data.FOOD) {
                    $current_floor.FOOD = data.FOOD;
                    $('#current_floor_FOOD').text(parseFloat(data.FOOD));
                }
                if(data.WOOD) {
                    $current_floor.WOOD = data.FOOD;
                    $('#current_floor_WOOD').text(parseFloat(data.WOOD));
                }
                if(data.GOLD) {
                    $current_floor.GOLD = data.GOLD;
                    $('#current_floor_GOLD').text(parseFloat(data.GOLD));
                }
                if(data.STONE) {
                    $current_floor.STONE = data.STONE;
                    $('#current_floor_STONE').text(parseFloat(data.STONE));
                }
                if(data.PLANKS) {
                    $current_floor.PLANKS = data.PLANKS;
                    $('#current_floor_PLANKS').text(parseFloat(data.PLANKS));
                }
                if(data.SOUP) {
                    $current_floor.SOUP = data.SOUP;
                    $('#current_floor_SOUP').text(parseFloat(data.SOUP));
                }
                if(data.INGOT) {
                    $current_floor.INGOT = data.INGOT;
                    $('#current_floor_INGOT').text(parseFloat(data.INGOT));
                }
            });
        }, 5000);
        setTimeout(() => { clearInterval(timerChecktokensFlor); }, 60000);
    }

    $('#input_price_FOOD, #input_count_FOOD').on('keyup', function(e){
        $ton = $('#input_price_FOOD').val();
        $count = $('#input_count_FOOD').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_FOOD').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.FOOD / 2)) {
                $('#calc_all_f_FOOD').addClass('alert_floor');
            } else {
                $('#calc_all_f_FOOD').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_WOOD, #input_count_WOOD').on('keyup', function(e){
        $ton = $('#input_price_WOOD').val();
        $count = $('#input_count_WOOD').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_WOOD').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.WOOD / 2)) {
                $('#calc_all_f_WOOD').addClass('alert_floor');
            } else {
                $('#calc_all_f_WOOD').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_GOLD, #input_count_GOLD').on('keyup', function(e){
        $ton = $('#input_price_GOLD').val();
        $count = $('#input_count_GOLD').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_GOLD').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.GOLD / 2)) {
                $('#calc_all_f_GOLD').addClass('alert_floor');
            } else {
                $('#calc_all_f_GOLD').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_STONE, #input_count_STONE').on('keyup', function(e){
        $ton = $('#input_price_STONE').val();
        $count = $('#input_count_STONE').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_STONE').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.STONE / 2)) {
                $('#calc_all_f_STONE').addClass('alert_floor');
            } else {
                $('#calc_all_f_STONE').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_PLANKS, #input_count_PLANKS').on('keyup', function(e){
        $ton = $('#input_price_PLANKS').val();
        $count = $('#input_count_PLANKS').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_PLANKS').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.PLANKS / 2)) {
                $('#calc_all_f_PLANKS').addClass('alert_floor');
            } else {
                $('#calc_all_f_PLANKS').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_SOUP, #input_count_SOUP').on('keyup', function(e){
        $ton = $('#input_price_SOUP').val();
        $count = $('#input_count_SOUP').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_SOUP').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.SOUP / 2)) {
                $('#calc_all_f_SOUP').addClass('alert_floor');
            } else {
                $('#calc_all_f_SOUP').removeClass('alert_floor');
            }
        }
    });

    $('#input_price_INGOT, #input_count_INGOT').on('keyup', function(e){
        $ton = $('#input_price_INGOT').val();
        $count = $('#input_count_INGOT').val();
        if($ton !== '' && $count !== '') {
            $select_floor = parseFloat($ton) / parseFloat($count);
            $('#calc_all_f_INGOT').text($select_floor.toFixed(8));
            if($select_floor < ($current_floor.INGOT / 2)) {
                $('#calc_all_f_INGOT').addClass('alert_floor');
            } else {
                $('#calc_all_f_INGOT').removeClass('alert_floor');
            }
        }
    });

    //============
    $('#input_count_swap_stone_FOOD').on('keyup', function(e){
        $food = $('#input_count_swap_stone_FOOD').val();
        $koef = $('#input_count_swap_stone_FOOD').attr('data-koef');
        if($food !== '' && $koef !== '') {
            $count_stone = parseFloat($food) * parseFloat($koef);
            $('#input_price_stone_FOOD').val($count_stone.toFixed(2));
        }
    });
    $('#input_price_stone_FOOD').on('keyup', function(e){
        $stone = $('#input_price_stone_FOOD').val();
        $koef = $('#input_count_swap_stone_FOOD').attr('data-koef');
        if($stone !== '' && $koef !== '') {
            $food = parseFloat($stone) / parseFloat($koef);
            $('#input_count_swap_stone_FOOD').val($food.toFixed(2));
        }
    });

    $('#input_count_swap_stone_WOOD').on('keyup', function(e){
        $wood = $('#input_count_swap_stone_WOOD').val();
        $koef = $('#input_count_swap_stone_WOOD').attr('data-koef');
        if($wood !== '' && $koef !== '') {
            $count_stone = parseFloat($wood) * parseFloat($koef);
            $('#input_price_stone_WOOD').val($count_stone.toFixed(2));
        }
    });
    $('#input_price_stone_WOOD').on('keyup', function(e){
        $stone = $('#input_price_stone_WOOD').val();
        $koef = $('#input_count_swap_stone_WOOD').attr('data-koef');
        if($stone !== '' && $koef !== '') {
            $wood = parseFloat($stone) / parseFloat($koef);
            $('#input_count_swap_stone_WOOD').val($wood.toFixed(2));
        }
    });

    $('#input_count_swap_stone_GOLD').on('keyup', function(e){
        $gold = $('#input_count_swap_stone_GOLD').val();
        $koef = $('#input_count_swap_stone_GOLD').attr('data-koef');
        if($gold !== '' && $koef !== '') {
            $count_stone = parseFloat($gold) * parseFloat($koef);
            $('#input_price_stone_GOLD').val($count_stone.toFixed(2));
        }
    });
    $('#input_price_stone_GOLD').on('keyup', function(e){
        $stone = $('#input_price_stone_GOLD').val();
        $koef = $('#input_count_swap_stone_GOLD').attr('data-koef');
        if($stone !== '' && $koef !== '') {
            $gold = parseFloat($stone) / parseFloat($koef);
            $('#input_count_swap_stone_GOLD').val($gold.toFixed(2));
        }
    });

    $('body').on('touchend, click', '.btn_buy_stone', function(e) {
        $count = $(this).parent('.right_part').parent('.buy_stone_resourse').find('input[name="count"]').val();
        $value = $(this).parent('.right_part').parent('.buy_stone_resourse').find('input[name="value"]').val();
        $alias_token = $(this).attr('data-id');
        $buy_icon = $(this).attr('data-icon');

        Swal.fire({
            title: translate.Are_you_sure,
            html: translate.You_want_to_buy+" "+$value+" <img src='/public/images/tokens/stone.png' width='32'> "+translate.for+" "+$count+" <img src='/public/images/tokens/"+$buy_icon+"'>",
            //  icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: translate.Yes_buy,
            customClass: {
                container: 'swal_alert_game',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/handler_market', {type_req: 'buy_stone', value: $value, count: $count, alias: $alias_token}).done(function(data){
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