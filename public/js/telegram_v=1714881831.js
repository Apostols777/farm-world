jQuery(document).ready(function ($)  {
    let tg = window.Telegram.WebApp;
    tg.expand();
    if (typeof (tg.initDataUnsafe.user) !== "undefined") {
        $send_data = {
            user: tg.initDataUnsafe,
            initData: tg.initData,
            ref_id: null,
        };
        if (typeof (ref_id) !== "undefined") {
            $send_data.ref_id = ref_id;
        }
        $.post('/handler_home', $send_data).done(function(data){
            if (data.status === true) {
                window.location.href = '/connect_ton';
            } else {
                alert('Some problem: '+  JSON.stringify(data));
            }
        });
    } else {
        Swal.fire({
            title: "Oops...",
            text: "Init telegram user error",
            customClass: {
                container: 'swal_alert_game_error',
            }
        });
    }
});