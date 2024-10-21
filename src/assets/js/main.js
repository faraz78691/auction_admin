$(document).ready(function(){
  $('.ct_toggle_bar').click(function(){
    $('main').toggleClass('ct_collapsed_sidebar')
});
$('.ct_close_menu').click(function(){
    $('main').removeClass('ct_collapsed_sidebar')
});
AOS.init();

})
jQuery(document).ready(function() {

  $(".chat-list a").click(function() {
      $(".chatbox").addClass('showbox');
      return false;
  });

  $(".chat-icon").click(function() {
      $(".chatbox").removeClass('showbox');
  });


});


// jQuery(document).ready(function() {
//   jQuery('.ct_loader_main').fadeOut();

//   $('.ct_dropdown a').click(function(){
//     $('.ct_dropdown').toggleClass('ct_drop_show')
//   })
// });

AOS.init();





// Step form Js E



