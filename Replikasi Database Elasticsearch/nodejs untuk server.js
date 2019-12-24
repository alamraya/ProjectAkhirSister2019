var http = require('http');
var url = require('url');
var fs = require('fs');

function serve(ip, port)
{
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Hello, \n");
            res.write("Saat Ini, Anda Mengakses Server dengan Ip dan Port berikut : "+ip+":"+port+"\n");
            res.end();
        }).listen(port, ip);
        console.log('Server running at http://'+ip+':'+port+'/');
}

serve('127.0.0.1', 9000);
serve('127.0.0.1', 9001);
serve('127.0.0.1', 9002);