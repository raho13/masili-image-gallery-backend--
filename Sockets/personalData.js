
exports = module.exports = function (socket) {
        socket.on('test',data=>{
            console.log(data)
            //io.sockets.emit('test',data)
            // io.to(socket.id).emit('test',data)
        })
};
