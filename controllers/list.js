const handleCreateList = (req, res, db) => {
  const userId = req.userId;
  const { listName, listPosition, boardId } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .insert({
          board_id: boardId,
          list_name: listName,
          list_position: listPosition,
          created: new Date()
        })
        .into("lists")
        .returning(["list_id", "list_name"])
        .then(listInfo => {
          res.json(listInfo[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create list."));
  }
};

module.exports = {
  handleCreateList: handleCreateList
};
