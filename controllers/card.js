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
    console.log("handling delete card for card:", cardId);
    db.transaction(trx => {
      trx
        .del()
        .from("cards")
        .where("card_id", "=", cardId)
        .then(res.status(200).json())
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }
};

module.exports = {
  handleCreateCard: handleCreateCard,
  handleDeleteCard: handleDeleteCard
};
