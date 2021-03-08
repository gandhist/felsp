import React from 'react'
import { Modal, Button, Image } from "react-bootstrap";
const ModalImage = ({title, body, show, handleClose}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body >
                <div className="embed-responsive embed-responsive-21by9">
                    <iframe src={body} className="embed-responsive-item"></iframe>
                </div>
            {/* <iframe src={body} className="rounded mx-auto d-block fluid" /> */}
                {/* <Image src={body} className="rounded mx-auto d-block" fluid /> */}
            </Modal.Body>
            <Modal.Footer >
                <Button variant="primary" onClick={handleClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalImage
