const handleCreateCard = (req, res, db) => {
  const userId = req.userId;
  const { cardContent, listId } = req.body;
  if (userId) {
    db.transaction(trx => {
      trx
        .insert({
          list_id: listId,
          card_content: cardContent,
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
  console.log("handleDeleteCard");
};

module.exports = {
  handleCreateCard: handleCreateCard,
  handleDeleteCard: handleDeleteCard
};
