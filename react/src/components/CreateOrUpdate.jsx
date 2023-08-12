import { Button, Loader, Modal, TextInput, Textarea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import './CreateOrUpdate.css'
import { useToast } from "../contexts/ToastProvider"

// eslint-disable-next-line react/prop-types
export default function CreateOrUpdate({ title: modalTitle, opened, close, onCreate: createItem, onUpdate: updateItem, isCreating, isFetching, isUpdating, task }) {
    const { addAlert } = useToast()

    // eslint-disable-next-line react/prop-types
    const [itemTitle, setItemTitle] = useState('')
    const maxTitleLength = 90
    const handleTitle = useCallback((event) => {
        const newTitle = event.target.value
        if (newTitle && newTitle.length > maxTitleLength) {
            addAlert('Maximum title length reached', 'red')
            return
        }

        setItemTitle(newTitle)
    }, [addAlert])

    // eslint-disable-next-line react/prop-types
    const [itemDescription, setItemDescription] = useState('')
    const maxDescriptionLength = 40
    const handleDescription = useCallback((event) => {
        const newDescription = event.target.value
        if (newDescription && newDescription.length > maxDescriptionLength) {
            addAlert('Maximum description length reached', 'red')
            return
        }

        setItemDescription(newDescription)
    }, [addAlert])

    // eslint-disable-next-line react/prop-types
    const [itemContent, setItemContent] = useState('')
    const maxContentLength = 10000
    const handleContent = useCallback((event) => {
        const newContent = event.target.value
        if (newContent && newContent.length > maxContentLength) {
            addAlert('Maximum content length reached', 'red')
            return
        }

        setItemContent(newContent)
    }, [addAlert])

    useEffect(() => {
        if (task) {
            setItemTitle(task.title)
            setItemDescription(task.description)
            setItemContent(task.content)
        }
    }, [task])

    const onClose = useCallback(() => {
        setItemTitle('')
        setItemDescription('')
        setItemContent('')
        close()
    }, [close])

    const handleCreateOrUpdate = () => modalTitle === 'Create' ? createItem(itemTitle, itemDescription, itemContent) : updateItem(itemTitle, itemDescription, itemContent)

    return (
        <Modal size="xl" title={`${modalTitle} item`} onClose={onClose} opened={opened}>
            {isFetching ? (
                <Loader variant="dots" />
            ) : (
                <>
                    <TextInput value={itemTitle} onChange={handleTitle} mb="xs" multiline={true} withAsterisk label="Title" variant="filled" description={`${itemTitle ? itemTitle.length : 0}/${maxTitleLength}`} />
                    <TextInput value={itemDescription} onChange={handleDescription} mb="xs" label="Description" variant="filled" description={`${itemDescription ? itemDescription.length : 0}/${maxDescriptionLength}`} />
                    <Textarea value={itemContent} onChange={handleContent} mb="xl" label="Content" variant="filled" autosize={true} minRows={4} maxRows={13} description={`${itemContent ? itemContent.length : 0}/${maxContentLength}`} />
                    <div className="modal-create-update-button">
                        <Button onClick={handleCreateOrUpdate} loading={modalTitle === 'Create' ? isCreating : isUpdating} loaderPosition="left"><h6>{ modalTitle }</h6></Button>
                    </div>
                </>
            )}
            
        </Modal>
    )
}