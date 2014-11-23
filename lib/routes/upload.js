/* 
* ファイルを直でぶち込んだ版
* */
var fs = require('fs');

module.exports = function( event, io ){

  return {
    post: function(req, res) {
      var maxSize;
      var xx = new Buffer(0);
      req.pipe(req.busboy);
      req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if( fieldname === "max-length" ){
          maxSize = val;
        }
      });

      req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        file.on('data',function(chunk){
         if(chunk) xx = Buffer.concat( [ xx ,chunk]);
        });
        file.on('end',function(){
          io.emit("chat message", { file: xx.toString('base64'), name: filename, maxSize: maxSize } );
          res.render('upload_completed');
        });

      });

    }
  }

}
