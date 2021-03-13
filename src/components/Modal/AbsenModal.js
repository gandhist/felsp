import React from 'react'
import { Modal, Button } from "react-bootstrap";

const AbsenModal = ({title, body, show, handleClose}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body >
                here
            </Modal.Body>
            <Modal.Footer >
                <Button variant="primary" onClick={handleClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AbsenModal
