import React from 'react';
import Base from '../Base';
import styles from './Delete.module.css';
import Button from '../../../Button';

const Delete = ({ deck, ...rest }) => {

  const renderContent = () => {
    return (
      <div className={styles.content}>
        <div className={styles.message}>
          <span>Are you sure you want to delete the deck </span>
          <span className='has-text-weight-bold has-text-danger'>
            {deck.name}
          </span>
          <span> ?</span>
        </div>
        <div className='is-size-7 has-text-grey-lighter'>
          <span className={'has-text-weight-bold'}>{deck.cards.size} cards</span>
          <span> will be permanently lost.</span>
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button outlined type='danger' className='margin-right-0_5' onClick={buttonConfirmClicked}>
          Yes
        </Button>
        <Button outlined className='margin-left-0_5' onClick={buttonCancelClicked}>
          No
        </Button>
      </div>
    );
  };

  const buttonConfirmClicked = () => {
    if (rest.onConfirm)
      rest.onConfirm();
  };

  const buttonCancelClicked = () => {
    if (rest.onCancel)
      rest.onCancel();
  };

  const classes = {
    header: 'has-bg-danger'
  };

  return (
    <Base
      className={rest.className}
      classes={classes}
      deck={deck}
      title={'Delete deck?'}
      content={renderContent()}
      footer={renderFooter()}
    />
  );
};

export default Delete;