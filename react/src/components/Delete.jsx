import { Button, Modal, Space, Text } from '@mantine/core'
import './Delete.css'

// eslint-disable-next-line react/prop-types
export default function Delete({ opened, close, messageDetail, onDelete: deleteItem, isDeleting, titleDetail }) {
    return (
        <Modal opened={opened} onClose={close} title={`Delete ${titleDetail ? titleDetail : 'item'}`}>
            <Text><h6>{`Delete ${messageDetail} ?`}</h6></Text>
            <Space h="md" />
            <div className='modal-delete-button'>
                <Button onClick={deleteItem} loading={isDeleting} loaderPosition="left"><h6>Delete</h6></Button>
            </div>
        </Modal>
    )
}