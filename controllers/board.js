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
          res.json([]);
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
  return handleBoardInfoGet(req, res, db, board)
    .then(board => {
      return handleListsGet(req, res, db, board);
    })
    .then(board => {
      return handleCardsGet(req, res, db, board);
    })
    .then(board => {
      //console.log(board);
      res.json(board);
    })
    .catch(err => Promise.reject(err));
};

const handleBoardInfoGet = (req, res, db, board) => {
  const { boardId } = req.body;
  return db
    .select("*")
    .from("boards")
    .where({ board_id: boardId })
    .then(boardInfo => {
      board.boardName = boardInfo[0].board_name;
      return board;
    });
};

const handleListsGet = (req, res, db, board) => {
  const { boardId } = req.body;
  return db
    .select("*")
    .from("lists")
    .where({ board_id: boardId })
    .orderBy("list_position")
    .then(lists => {
      if (lists.length) {
        lists.map(list => {
          board.lists = [
            ...board.lists,
            {
              listId: list.list_id,
              listName: list.list_name,
              listPosition: list.list_position,
              cards: []
            }
          ];
        });
      }
      return board;
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
    .orderBy("card_position")
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
                cardPosition: card.card_position,
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
