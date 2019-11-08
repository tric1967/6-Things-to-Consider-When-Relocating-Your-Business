var deparam = function (querystring) {
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    var params = {}, pair, d = decodeURIComponent;
    for (var i = querystring.length - 1; i >= 0; i--) {
        pair = querystring[i].split('=');
        params[d(pair[0])] = d(pair[1] || '');
    }

    return params;
};


function addParams(link, uuid) {
    return link.attr('href') +
        '&presell_id=' + $('#presell_id').val() +
        '&site_id=4c7879a2-da7b-4fe9-af69-8926cfc40072' +
        '&user_agent=' + encodeURIComponent(navigator.userAgent) +
        '&referrer=' + encodeURIComponent(document.referrer) +
        '&uuid=' + uuid +
        '&affiliate_id=' + $('#affiliate_id').val()
}

$(document).ready(function () {
    var auto_savings_links = $('.auto_savings_link');
        link = auto_savings_links.first()
    ;

    const uuid = $('#user_id').val();

    const cta_length = $('#cta_value').val().length;
    if(cta_length < 20){
      $('#bottom_cta').addClass('short_cta');
      if($('#side_cta').length){
        $('#side_cta').addClass('short_cta');
      }
    }
    if(cta_length > 38){
      $('#bottom_cta').addClass('big_cta');
      if($('#side_cta').length){
        $('#side_cta').addClass('big_cta');
      }
    }

    auto_savings_links.click(function(e){
        e.preventDefault();
            // console.log($(this).attr('href') + '&uuid=' + data + '&presell_id='+$('#presell_id').val());
            let test_running = $('#is_test_running'),
                logo = $('.logo').attr('src')
            ;
            window.location =
                $(this).attr('href') +
                '&uuid=' + uuid +
                '&presell_id='+$('#presell_id').val() +
                (test_running.val() ? '&logo=' + logo : '')
            ;
        });

    //just to hotfix major and evenmore
  $('.auto_savings_link_1').click(function(e){
    e.preventDefault();
    let test_running = $('#is_test_running'),
      logo = $('.logo').attr('src')
    ;
    window.location =
      $(this).attr('href') +
      '&uuid=' + uuid +
      '&presell_id='+$('#presell_id').val() +
      (test_running.val() ? '&logo=' + logo : '')
    ;
  });

    let url = addParams(link, uuid),
        params = deparam(url)
    ;

    if ( !params.affid ) {
        auto_savings_links.each(function(index, value){
            params = deparam(addParams($(value), uuid));
            if(params.affid) {
                return false;
            }
        });
    }

    delete params.uuid;

    var affid = 0,
        presell_name = $('#presell_id_unmd5').val(),
        aux_affid = presell_name.match(/\d+/) !== null ? presell_name.match(/\d+/)[0] : '0'
    ;

    if (params.affid) {
        affid = params.affid;
        delete params.affid;
    } else if (aux_affid.length > 2) {
            affid = aux_affid;
    }

    params.affiliate_id = affid;
    params.user_id = uuid;
    params.ip = $('#ip').val();

    $.ajax({
        url: 'https://api.uselenox.com/api/v2/external/presell_step_log.php',
        data: params
    });
});
