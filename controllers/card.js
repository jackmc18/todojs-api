const handleCreateCard = (req, res, db) => {
  const userId = req.userId;
  const { cardContent, listId, cardPosition } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .insert({
          list_id: listId,
          card_content: cardContent,
          card_position: cardPosition,
          created: new Date()
        })
        .into("cards")
        .returning("*")
        .then(cardInfo => {
          res.json(cardInfo[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to create list."));
  }
};

const handleDeleteCard = (req, res, db) => {
  const userId = req.userId;
  const { cardId } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .del()
        .from("cards")
        .where("card_id", "=", cardId)
        .returning("*")
        .then(deletedCard => {
          return handleDecrementCards(db, deletedCard);
        })
        .then(deletedCard => {
          res.json(deletedCard[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }
};

const handleEditCardContent = (req, res, db) => {
  const userId = req.userId;
  const { cardId, cardContent } = req.body;
  if (userId) {
    db.from("cards")
      .where({ card_id: cardId })
      .update({ card_content: cardContent })
      .returning("*")
      .then(updatedCard => {
        res.status(200).json(updatedCard[0]);
      })
      .catch(err => res.status(400).json("Unable to edit card."));
  }
};

const handleMoveCard = (req, res, db) => {
  const userId = req.userId;
  const {
    cardId,
    oldCardList,
    newCardList,
    oldCardPosition,
    newCardPosition
  } = req.body;
  if (userId) {
    db.from("cards")
      .where({ list_id: oldCardList })
      .andWhere("card_position", ">", oldCardPosition)
      .decrement("card_position", 1)
      .then(() => {
        return db
          .from("cards")
          .where({ list_id: newCardList })
          .where("card_position", ">=", newCardPosition)
          .increment("card_position", 1);
      })
      .then(() => {
        return db
          .from("cards")
          .where({ card_id: cardId })
          .update({ card_position: newCardPosition, list_id: newCardList })
          .returning("*");
      })
      .then(card => {
        res.json(card[0]);
      });
  }
};

const handleDecrementCards = (db, deletedCard) => {
  return db("cards")
    .where("list_id", "=", deletedCard[0].list_id)
    .andWhere("card_position", ">", deletedCard[0].card_position)
    .andWhere("card_id", "!=", deletedCard[0].card_id)
    .decrement("card_position", 1)
    .then(res => {
      return deletedCard;
    })
    .catch(err => res.status(400));
};

module.exports = {
  handleCreateCard: handleCreateCard,
  handleDeleteCard: handleDeleteCard,
  handleEditCardContent: handleEditCardContent,
  handleMoveCard: handleMoveCard
};
