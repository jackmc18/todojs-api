const handleCreateList = (req, res, db) => {
  const userId = req.userId;
  const { listName, boardId } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .insert({
          board_id: boardId,
          list_name: listName,
          created: new Date()
        })
        .into("lists")
        .returning("list_id")
        .then(trx.commit)
        .then(res.json("hello"))
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create list."));
  }
};

module.exports = {
  handleCreateList: handleCreateList
};
