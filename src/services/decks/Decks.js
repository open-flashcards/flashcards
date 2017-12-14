import { firestore } from "firebase";
import Deck from "./Deck";

class Decks {
  static getUserDecks(user) {
    const decksCollection = firestore()
      .collection("users")
      .doc(user.user.uid)
      .collection("decks");

    return new Decks(decksCollection);
  }

  constructor(collection) {
    this._collection = collection;
  }

  push(deckData) {
    return this._collection
      .add({
        ...deckData,
        createTime: firestore.FieldValue.serverTimestamp(),
        updateTime: firestore.FieldValue.serverTimestamp()
      })
      .then(deckRef => {
        // It gets the newly created deck and wraps it inside a Deck proxy
        // object to repass through the promise chain.
        return deckRef.get().then(deckDoc => {
          return new Deck(deckDoc);
        });
      });
  }

  add(deckData) {
    return this.push(deckData);
  }

  getAll() {
    return this._collection.get().then(snapshot => {
      const decks = [];
      snapshot.forEach(doc => {
        decks.push(new Deck(doc));
      });
      return decks;
    });
  }

  getDeck(deckId) {
    return this._collection
      .doc(deckId)
      .get()
      .then(snapshot => {
        return new Deck(snapshot);
      });
  }

  listen({
    onAddDeck = () => {},
    onRemoveDeck = () => {},
    onUpdateDeck = () => {},
    ...cardsListener
  }) {
    // Functions used to stop listening decks' cards.
    // It uses the deck id as the map key.
    const stopListeningCards = {};

    const stop = this._collection.onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        const deck = new Deck(change.doc);

        if (change.type === "added") {
          this._onAddDeck(deck, onAddDeck, stopListeningCards, {
            ...cardsListener
          });
        } else if (change.type === "removed") {
          this._onRemoveDeck(deck, onRemoveDeck, stopListeningCards);
        } else if (change.type === "modified") {
          this._onUpdateDeck(deck, onUpdateDeck);
        }
      });
    });

    return () => {
      for (const key in stopListeningCards) {
        // Stop listening cards when stop listening decks
        stopListeningCards[key]();
      }

      stop();
    };
  }

  _onAddDeck(deck, callback, stopListeningCards, cardsListener) {
    // It also listens to changes in the cards of the deck
    const stop = deck.getCards().listen(cardsListener, deck);
    stopListeningCards[deck.id] = stop;
    callback(deck.asDeckModel());
  }

  _onRemoveDeck(deck, callback, stopListeningCards) {
    stopListeningCards[deck.id](); // stops listening for cards on the removed deck
    delete stopListeningCards[deck.id];
    callback(deck.asDeckModel());
  }

  _onUpdateDeck(deck, callback) {
    callback(deck.asDeckModel());
  }
}

export default Decks;
