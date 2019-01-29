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

module.exports = {
  handleBoardListGet: handleBoardListGet
};
