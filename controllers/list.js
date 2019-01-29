const handleListsGet = (req, res, db) => {
  const userId = req.userId;
  const { boardId } = req.body;
  if (userId) {
    db.select("*")
      .from("lists")
      .where({ board_id: boardId })
      .then(lists => {
        if (lists.length) {
          res.json(lists);
        } else {
          res.status(400).json("Not found");
        }
      })
      .catch(err => res.status(400).json("error getting lists"));
  }
};

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
        .returning("list_name")
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create list."));
  }
};

module.exports = {
  handleListsGet: handleListsGet,
  handleCreateList: handleCreateList
};
