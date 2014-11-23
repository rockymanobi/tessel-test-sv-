function showLoading(){
  var $loadingDiv = $('.COMPONENT-PROGRESS');
  $loadingDiv.addClass("ACTIVE").promise();
  setTimeout(function(){
    $loadingDiv.addClass("VISIBLE");
  },50);
}

$(document).ready( function(){

  // アップロードボタンは消しておく
  $('.submit_wrap').addClass('hide');

  $('.upload-image-button').on('click',function(e){
    e.preventDefault();
    showLoading();
    
    $('#inputfile').remove;  
    
    
    $('#image-upload-form').submit();

  });

  // 写真をとったら画面に反映
  $('input[name=image]').on('change', function () {

    $('.submit_wrap').addClass('hide');
    $('.bummybtn').css("background-image", "none");

    if (!this.files.length) {
      return;
    }
    var file = this.files[0];

    // file size validation
    var fileSizeMB = file.size / 1024 / 1024;
    if ( fileSizeMB <= 3 ) { 
    }else{
      alert( "画像がサイズが大きすぎます！");
      return; 
    }

    $('.submit_wrap').removeClass('hide');

    var image = document.getElementById('js-preview-photo');
    var mpImg = new MegaPixImage(file);
    mpImg.render(image, {maxWidth: 600, maxHeight: 600});
    image.onload = function(){
      var image64El = document.getElementById('image64');
      image64El.value = image.src;
      $('.bummybtn').css("background-image", "url("+ image.src +")");

    };


  });
});
