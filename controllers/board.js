const handleBoardListGet = (req, res, db) => {
  const userId = req.userId;
  if (userId) {
    db.select("*")
      .from("boards")
      .where({ owner_id: userId })
      .then(boards => {
        if (boards.length) {
          res.json(boards);
        } else {
          res.status(400).json("Not found");
        }
      })
      .catch(err => res.status(400).json("error getting user"));
  }
};

const handleCreateBoard = (req, res, db) => {
  const userId = req.userId;
  const { boardName } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .insert({
          owner_id: userId,
          board_name: boardName,
          created: new Date()
        })
        .into("boards")
        .returning("board_name")
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create board."));
  }
};

module.exports = {
  handleBoardListGet: handleBoardListGet,
  handleCreateBoard: handleCreateBoard
};
