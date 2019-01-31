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
      lists.map(list => {
        // var tempCards = [];
        // handleCardsGet(req, res, db, list).then(cards => {
        //   console.log("returned cards:", cards);
        //   tempCards = cards;
        // });
        // console.log("temp cards:", tempCards);
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
    })
    .then(resp => {
      console.log("board:", resp);
      res.json(resp);
    });
};

const handleListsGet = (req, res, db) => {
  const { boardId } = req.body;
  return db
    .select("*")
    .from("lists")
    .where({ board_id: boardId })
    .then(lists => {
      if (lists.length) {
        console.log("lists:", lists);
        return lists;
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("error getting list"));
};

const handleCardsGet = (req, res, db, board) => {
  console.log("getting cards");
  let listIds = [];
  board.lists.map(list => {
    listIds = [...listIds, list.listId];
  });
  return db
    .select("*")
    .from("cards")
    .whereIn("list_id", listIds)
    .then(cards => {
      console.log("cards:", cards);
      cards.map(card => {
        board.lists.map(list => {
          if (list.listId === card.list_id) {
            list.cards = [...list.cards, card];
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
        .returning("board_name")
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
