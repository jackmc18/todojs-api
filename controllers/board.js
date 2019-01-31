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
      .catch(err => res.status(400).json("error getting board list"));
  }
};

const handleBoardGet = (req, res, db) => {
  const userId = req.userId;
  const { boardId } = req.body;
  const board = {
    boardId: boardId,
    boardName: "",
    lists: []
  };

  return handleListsGet(req, res, db)
    .then(lists => {
      if (!lists) {
        console.log("no lists");
        return Promise.reject("no lists");
      } else {
        lists.map(list => {
          board.lists = [
            ...board.lists,
            {
              listId: list.list_id,
              listName: list.list_name,
              cards: []
            }
          ];
        });
        return handleCardsGet(req, res, db, board);
      }
    })
    .then(board => {
      res.json(board);
    })
    .catch(err => Promise.reject(err));
};

const handleListsGet = (req, res, db) => {
  const { boardId } = req.body;
  return db
    .select("*")
    .from("lists")
    .where({ board_id: boardId })
    .then(lists => {
      if (lists.length) {
        return lists;
      } else {
        return [];
      }
    })
    .catch(err => Promise.reject(err));
};

const handleCardsGet = (req, res, db, board) => {
  let listIds = [];
  board.lists.map(list => {
    listIds = [...listIds, list.listId];
  });
  return db
    .select("*")
    .from("cards")
    .whereIn("list_id", listIds)
    .then(cards => {
      cards.map(card => {
        board.lists.map(list => {
          if (list.listId === card.list_id) {
            list.cards = [
              ...list.cards,
              {
                cardId: card.card_id,
                listId: card.list_id,
                cardContent: card.card_content,
                created: card.created
              }
            ];
          }
        });
      });
      return board;
    });
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
        .returning("board_id")
        .then(board_id => {
          res.json(board_id);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create board."));
  }
};

module.exports = {
  handleBoardListGet: handleBoardListGet,
  handleBoardGet: handleBoardGet,
  handleCreateBoard: handleCreateBoard
};
