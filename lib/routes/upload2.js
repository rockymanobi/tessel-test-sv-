var fs = require('fs');

module.exports = function( event, io ){

  return {
    post: function(req, res) {
      var maxSize;
      var image64;
      var xx = new Buffer(0);
      req.pipe(req.busboy);
      req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        //console.log('Field [' + fieldname + ']: value: ' + val);
        if( fieldname === "max-length" ){
          maxSize = val;
        }
        if( fieldname === "image64" ){
          image64 = val;
        }
      });

      req.busboy.on('finish', function(){
        res.render('upload_completed');
        if( image64 && image64.length >= 100 ){
          io.emit("chat message", { file: image64, name: "hoge.jpg", maxSize: maxSize } );
        }
      });

    }
  }

}
