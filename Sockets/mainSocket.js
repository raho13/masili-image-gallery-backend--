const personalData=require('./personalData')

exports = module.exports = function (io) {

    io.on('connection', (socket) => {
        console.log(socket.id,'Hi...')
        personalData(socket)
    })
};
