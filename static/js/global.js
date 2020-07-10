window['randint'] = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};
window['vm'] = {};


// $(document).keypress(function(e){
//     if ( ( e.ctrlKey == true ) && ( e.keyCode == 13 || e.keyCode == 10 ) ) {
//         var selected_text = window.getSelection().toString();
//         var page_url = window.location.href;
//         if ( selected_text != '' ) {
//             $.ajax({
//                 type: "POST",
//                 url: "/send_error.php",
//                 data: { "error_text": selected_text, "page_url": page_url },
//                 success: function( data ) {
//                     obj = $.parseJSON( data );
//                     if ( obj.ErrorMessage ) {
//                         alert( obj.ErrorMessage );
//                     }
//                     else if ( obj.Success ) {
//                         alert( obj.SendMessage );
//                     }
//                 }
//             });
//         }
//     }
// });
