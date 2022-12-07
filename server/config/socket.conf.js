function socketConfig(io) {
  const startingRooms = ["game-1", "game-2", "game-3", "game-4"];
  let rooms = ["game-1", "game-2", "game-3", "game-4"];
  io.on("connection", (socket) => {
    let isHost = false;
    const { roomID, username, uid } = socket.handshake.query;
    let roomCount = parseInt(io.sockets.adapter.rooms.get(roomID)?.size);
    if (roomID) {
      socket.join(roomID);
      if (!rooms.includes(roomID)) {
        rooms.push(roomID);
        io.emit("rooms", { rooms });
      }
      isHost = isNaN(roomCount);
      io.to(roomID).emit("user connect", { username, uid, isHost });
    }
    if (!roomID) {
      io.to(socket.id).emit("rooms", { rooms });
    }

    socket.on("new message", ({ body }) => {
      io.to(roomID).emit("new message", { username, body });
    });

    socket.on(
      "end turn",
      ({
        players,
        discardDeck,
        activeCard,
        newActiveCard,
        isReverse,
        turn,
        playDeck,
      }) => {
        io.to(roomID).emit("end turn", {
          players,
          discardDeck,
          activeCard,
          newActiveCard,
          isReverse,
          turn,
          playDeck,
        });
      }
    );

    socket.on("start game", ({ players, playDeck, activeCard }) => {
      io.to(roomID).emit("start game", { players, playDeck, activeCard });
    });

    socket.on("end game", ({ message }) => {
      io.to(roomID).emit("end game", { message });
    });

    socket.on("disconnect", () => {
      io.to(roomID).emit("user disconnect", { username, uid });
      if (roomID) {
        let roomCount = parseInt(io.sockets.adapter.rooms.get(roomID)?.size);
        if (isNaN(roomCount) && !startingRooms.includes(roomID)) {
          rooms = rooms.filter((val) => val !== roomID);
          io.emit("rooms", { rooms });
        }
      }
    });

    socket.on("game active", (activeGame) => {
      io.socket.broadcast.to(roomID).emit("game active", activeGame);
    });

    socket.on(
      "draw card",
      ({
        players,
        playDeck,
        turn,
        draws,
        activeCard,
        discardDeck,
        isReverse,
      }) => {
        io.to(roomID).emit("draw card", {
          players,
          playDeck,
          turn,
          draws,
          activeCard,
          discardDeck,
          isReverse,
        });
      }
    );
  });
}
module.exports = socketConfig;
