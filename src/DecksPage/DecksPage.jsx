import React from 'react';
import { withStyles } from 'material-ui/styles';
import { auth, firestore } from 'firebase';
import AuthenticationActions from '../flux/actions/AuthenticationActions';
import AuthenticatedUserStore from '../flux/stores/AuthenticatedUserStore';
import UserDecksActions from '../flux/actions/UserDecksActions';
import UserDecksStore from '../flux/stores/UserDecksStore';
import CreatingDeckStore from '../flux/stores/CreatingDeckStore';
import CreatingDeckActions from '../flux/actions/CreatingDeckActions';
import EditingDeckStore from '../flux/stores/EditingDeckStore';
import EditingDeckActions from '../flux/actions/EditingDeckActions';
import DeckDisplay from '../DeckCard/Display';
import DeckEdit from '../DeckCard/Edit';
import stylesheets from './DecksPage.style';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

class DecksPage extends React.Component {

  constructor(props) {
    super(props);
    this.initState();
    this.initStores();
  }

  initState() {
    this.state = {
      decks: UserDecksStore.getState(),
      creatingDeck: CreatingDeckStore.getState(),
      editingDeck: EditingDeckStore.getState()
    }
  }

  initStores() {
    this.removeAuthenticatedUserStoreListener =
      AuthenticatedUserStore.addListener(this.authenticatedUserStoreChanged.bind(this));
    this.removeUserDecksStoreListener = UserDecksStore.addListener(this.userDecksStoreChanged.bind(this));
    this.removeCreatingDeckStoreListener = CreatingDeckStore.addListener(this.creatingDeckStoreChanged.bind(this));
    this.removeEditingDeckStoreListener = EditingDeckStore.addListener(this.editingDeckStoreChanged.bind(this));
  }

  authenticatedUserStoreChanged() {
    const user = AuthenticatedUserStore.getState();
    if (user) {
      UserDecksActions.listen();
    } else {
      AuthenticationActions.ensureSignedInUser();
    }
  }

  userDecksStoreChanged() {
    this.setState({
      decks: UserDecksStore.getState()
    });
  }

  creatingDeckStoreChanged() {
    this.setState({
      creatingDeck: CreatingDeckStore.getState()
    });
  }

  editingDeckStoreChanged() {
    this.setState({
      editingDeck: EditingDeckStore.getState()
    });
  }

  componentWillMount() {
    AuthenticationActions.listen();
    AuthenticationActions.ensureSignedInUser();
  }

  componentWillUnmount() {
    UserDecksStore.unlisten();
    AuthenticationActions.unlisten();
    this.removeStoresListeners();
  }

  removeStoresListeners() {
    this.removeAuthenticatedUserStoreListener.remove();
    this.removeUserDecksStoreListener.remove();
    this.removeCreatingDeckStoreListener.remove();
    this.removeEditingDeckStoreListener.remove();
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div className={classes.decks}>
          {this.renderDecksItems(classes)}
          {this.renderCreatingDeck(classes)}
        </div>
        <Button className={classes.actionButton} fab color="accent" onClick={this.actionButtonClicked.bind(this)}>
          <AddIcon />
        </Button>
      </div>
    );
  }

  renderDecksItems(classes) {
    return this.state.decks.toArray().map(deck => {
      return this.renderDeckItem(classes, deck);
    });
  }

  renderDeckItem(classes, deck) {
    const editingDeck = this.state.editingDeck.get('before');
    if (deck.equals(editingDeck)) {
      return <DeckEdit autoFocus key={deck.id} deck={editingDeck} className={classes.deck}
        validation={(key, value) => key === 'description' || value.length > -1}
        onDeckChanged={this.editingDeckChanged.bind(this)}
        onFinished={this.editingDeckFinished.bind(this)}
        onCanceled={this.editingDeckCanceled.bind(this)}
      />;
    } else {
      return <DeckDisplay className={classes.deck} key={deck.id} deck={deck} options={[
        { label: 'Edit', action: () => this.requestEditDeck(deck) },
        { label: 'Delete', action: () => console.log('Delete deck') }
      ]} />
    }
  }

  requestEditDeck(deck) {
    EditingDeckActions.start(deck);
  }

  editingDeckChanged(deck) {
    EditingDeckActions.updateDeck(deck);
  }

  editingDeckFinished(deck) {
    EditingDeckActions.finish(deck);
  }

  editingDeckCanceled() {
    EditingDeckActions.cancel();
  }

  renderCreatingDeck(classes) {
    if (this.state.creatingDeck) {
        return <DeckEdit autoFocus className={classes.deck}
          validation={(key, value) => key === 'description' || value.length > -1}
          onDeckChanged={this.creatingDeckChanged.bind(this)}
          onFinished={this.creatingDeckFinished.bind(this)}
          onCanceled={this.creatingDeckCanceled.bind(this)}
        />;
    }
    return null;
  }

  actionButtonClicked() {
    CreatingDeckActions.start();
  }

  creatingDeckChanged(deck) {
    CreatingDeckActions.updateDeck(deck);
  }

  creatingDeckFinished(deck) {
    CreatingDeckActions.finish(deck);
  }

  creatingDeckCanceled() {
    CreatingDeckActions.cancel();
  }

}

export default withStyles(stylesheets)(DecksPage);

