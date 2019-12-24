const http = require('http')
const fs = require('fs')
const port = 9000

const server = http.createServer(function(req, res){
	res.writeHead(200, { 'Conten-Type': 'php'})
	fs.readFile('index.php', function(error, data){
		if (error) {
			res.writeHead(404)
			res.write('Error: File not found')
		} else {
			res.write(data)
		}
		res.end()
	})
})


server.listen(port, function(error) {
	if (error) {
		console.log('Ada kesalahan', error)
	}else{
		console.log('Server berjalan di port ' + port)
	}
})
