import React, { useState } from 'react';
import axios from 'axios';

import styles from './Feedback.module.scss';
import { useModal } from '../../store/ModalContext';
import { useUser } from '../../store/UserContext';
import { useSnackbar } from '../../store/SnackbarContext';

function FeedbackModal() {
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();
  // eslint-disable-next-line
  const [snackbar, snackbarDispatch] = useSnackbar();
  const [user] = useUser();
  
  const [sender, setSender] = useState<string>(user.email);
  const [message, setMessage] = useState<string>("");
  const [messageError, setMessageError] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const authHeaders = {
      'authorization': user ? user.token : null,
    };

    try {
      if (!message) {
        setMessageError(true);
        throw new Error('A message is required');
      }

      const result = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/feedback`, {sender: sender, message: message}, {
        headers: authHeaders,
      });

      if (result.status === 200) {
        modalDispatch({type: 'hide'});
        snackbarDispatch({type: 'show', payload: {
          status: 'success',
          message: 'Feedback Sent',
        }});
      }
    } catch (error) {
      snackbarDispatch({type: 'show', payload: {
        status: 'error',
        message: error.message,
      }});
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>From (optional)
        <input
          type="email"
          defaultValue={sender}
          onChange={(event: any) => setSender(event.currentTarget.value)}
        />
      </label>
      <label className={messageError ? styles.error : ''}>Message
        <textarea
          value={message}
          onChange={(event: any) => {
            setMessageError(false);
            setMessage(event.currentTarget.value);
          }}
        />
      </label>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          className="button button--brown"
          onClick={() => modalDispatch({type: 'hide'})}
        >Cancel</button>
        <button
          type="submit"
          className="button"
        >Submit</button>
      </div>
    </form>
  );
};

function Feedback() {
  // eslint-disable-next-line
  const [modal, modalDispatch] = useModal();

  const showFeedbackForm = () => {
    modalDispatch({
      type: 'show',
      payload: {
        title: `All Feedback is Welcome`,
        node: <FeedbackModal />,
        classOverride: styles.modalClass,
      }
    });
  };

  return(
    <div
      className={styles.feedback}
      onClick={showFeedbackForm}
    >Feedback</div>
  );
};

export default Feedback;