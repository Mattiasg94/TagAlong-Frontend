import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import Styles from '../../styles/css/ConfirmModal.module.scss'
import SStyles from '../../styles/css/Shared.module.scss'
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesomeIcon from '../../styles/fontawesome'
import { BehaviorSubject, Subject } from 'rxjs';

type ConfirmModalType = {
    modalIsOpen: any,
    setModalIsOpen: any,
    confirmModalData: { [key: string]: string }
    confirmModalClick: Subject<unknown>
}
const ConfirmModal = ({ modalIsOpen, setModalIsOpen, confirmModalData, confirmModalClick }: ConfirmModalType) => {

    function afterOpenModal() {
        //@ts-ignore
    }
    function handleModalAction(action: string) {
        setModalIsOpen(false);
        confirmModalClick.next({ action: action, event: confirmModalData.event })
    }
    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <div>
            <Modal
                className={Styles.Modal}
                overlayClassName={Styles.Overlay}
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <div>
                    <h3 className={`${SStyles.center} mb-4 mt-3`}>{confirmModalData.title}</h3>
                    <div className={SStyles.ButtonsDiv}>
                        <button className={`${SStyles.button} ${SStyles.def}`} onClick={closeModal}>Close</button>
                        <button className={`${SStyles.button} ${SStyles.del}`} onClick={() => { handleModalAction('delete') }}>{confirmModalData.btn1Text}</button>
                        <button className={`${SStyles.button} ${SStyles.add}`} onClick={() => { handleModalAction('edit') }}>{confirmModalData.btn2Text}</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ConfirmModal