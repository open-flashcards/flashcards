import Operation from './Operation';

/**
 * Deletes a deck by ID.
 */
class DeleteDeck extends Operation {

  constructor(storage) {
    super(storage);
  }

  execute(id) {
    const index = this.data.decks.findIndex(deck => deck.id === id);
    if (index !== -1) {
      return this.doExecute();
    } else {
      throw new Error(`Not found deck with id: ${id}`);
    }
  }

  doExecute(index) {
    const deck = this.data.decks.splice(index, 1)[0];
    removeCards(this.data, deck);
    this.commit();
    return deck;
  }
  
}

function removeCards(data, deck) {
  deck.cards.forEach(it => removeCard(data, it));
}

function removeCard(data, id) {
  const index = data.cards.findIndex(it => it.id === id);
  data.cards.splice(index, 1);
}

export default DeleteDeck;
