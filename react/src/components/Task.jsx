import { Button, Card, Text } from "@mantine/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDisclosure } from '@mantine/hooks'

import './Task.css'
import Delete from "./Delete"
import { useCallback, useState } from "react"
import axiosClient from "../axios-client"
import { useToast } from "../contexts/ToastProvider"
import { useData } from "../contexts/DataProvider"
import CreateOrUpdate from "./CreateOrUpdate"
import { useAuth } from "../contexts/AuthProvider"

// eslint-disable-next-line react/prop-types
export default function Task({ task, columnName }) {
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isFetching, setIsFetching] = useState(false)
    const [fetchedData, setFetchedData] = useState(null)

    const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const { addAlert } = useToast()
    const { setData } = useData()
    const { setToken } = useAuth()

    const deleteItem = useCallback(() => {
        setIsDeleting(true)
        // eslint-disable-next-line react/prop-types
        axiosClient.delete(`/items/${task.id}`)
            .then(() => {
                axiosClient
                    .get('/items')
                    .then(({data}) => {
                        setData(data)
                        setIsDeleting(false)
                        closeDelete()
                        // eslint-disable-next-line react/prop-types
                        addAlert('item deleted successfully', 'teal')
                    })
            })
            .catch(({ response }) => {
                setIsDeleting(false)
                closeDelete()
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    // eslint-disable-next-line react/prop-types
    }, [addAlert, closeDelete, setData, setToken, task.id])

    const fetchItem = useCallback(() => {
        openUpdate()
        setIsFetching(true)
        axiosClient.get(`/items/${task.id}`)
            .then(({ data }) => {
                // setItemTitle(title)
                // setItemDescription(description)
                // setItemContent(content)
                setFetchedData(data)
                setIsFetching(false)
            })
            .catch(({ response }) => {
                setIsFetching(false)
                closeUpdate()
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    }, [addAlert, closeUpdate, openUpdate, setToken, task.id])

    const updateItem = useCallback((itemTitle, itemDescription, itemContent) => {
        setIsUpdating(true)
        if (itemTitle.length === 0) {
            setIsUpdating(false)
            addAlert('Title should be filled', 'red')
            return
        }

        const payload = {
            title: itemTitle,
            description: itemDescription,
            content: itemContent
        }

        axiosClient.put(`/items/${task.id}`, payload)
            .then(() => {
                axiosClient.get('/items').then(({data}) => {
                    setData(data)
                    setIsUpdating(false)
                    closeUpdate()
                    addAlert('Item updated successfully', 'teal')
                })
            })
            .catch(({ response }) => {
                setIsUpdating(false)
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    }, [addAlert, closeUpdate, setData, setToken, task.id])

    const [isMovingLeft, setIsMovingLeft] = useState(false)
    const moveItemLeft = useCallback(() => {
        setIsMovingLeft(true)

        const payload = {
            start_column_id: task.column_id,
            destination_column_id: task.column_id - 1,
            task_id: task.id
        }

        axiosClient.put('/item/basic-switch', payload)
            .then(() => {
                axiosClient.get('/items').then(({data}) => {
                    setIsMovingLeft(false)
                    setData(data)
                    addAlert('Item moved left successfully', 'teal')
                })
            })
            .catch(({ response }) => {
                setIsMovingLeft(false)
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    }, [addAlert, setData, setToken, task.column_id, task.id])

    const [isMovingRight, setIsMovingRight] = useState(false)
    const moveItemRight = useCallback(() => {
        setIsMovingRight(true)

        const payload = {
            start_column_id: task.column_id,
            destination_column_id: task.column_id + 1,
            task_id: task.id
        }

        axiosClient.put('/item/basic-switch', payload)
            .then(() => {
                axiosClient.get('/items').then(({data}) => {
                    setIsMovingRight(false)
                    setData(data)
                    addAlert('Item moved right successfully', 'teal')
                })
            })
            .catch(({ response }) => {
                setIsMovingRight(false)
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    }, [addAlert, setData, setToken, task.column_id, task.id])

    return (
        <Card
            shadow="sm" 
            padding="sm" 
            radius="sm" 
            mb="md" 
            withBorder 
            className="task-card">
            <Text className="title">
                <h6>
                    { 
                        // eslint-disable-next-line react/prop-types
                        task.title }
                </h6>
            </Text>
            { 
                // eslint-disable-next-line react/prop-types
                task.description && task.description.length > 0 && <Text className="description-container">
                    <p style={{ fontWeight: 300, fontSize: '0.9em' }} className="description">
                        {
                            // eslint-disable-next-line react/prop-types
                            task.description }
                    </p>
                </Text> 
            }
            <div className="item-button-bar">
                <Button loading={isMovingLeft} loaderPosition="center" onClick={moveItemLeft} className="item-button" variant='subtle' disabled={columnName === 'To do'}>
                    {!isMovingLeft && <FontAwesomeIcon icon="fa-solid fa-arrow-left" size='md' />}
                </Button>
                <Button className="item-button" variant='subtle' onClick={fetchItem}>
                    <FontAwesomeIcon icon="fa-solid fa-pencil" size='md' />
                </Button>
                <Button className="item-button" color="red" variant='subtle' onClick={openDelete}>
                    <FontAwesomeIcon icon="fa-solid fa-trash" size='md' />
                </Button>
                <Button loading={isMovingRight} loaderPosition="center" onClick={moveItemRight} className="item-button" variant='subtle' disabled={columnName === 'Done'}>
                    {!isMovingRight && <FontAwesomeIcon icon="fa-solid fa-arrow-right" size='md' />}
                </Button>
            </div>
            <CreateOrUpdate opened={updateOpened} close={closeUpdate} title={'Update'} onUpdate={updateItem} isUpdating={isUpdating} isFetching={isFetching} task={fetchedData} />
            <Delete opened={deleteOpened} close={closeDelete} messageDetail={`'${task.title}'`} onDelete={deleteItem} isDeleting={isDeleting} />
        </Card>
    )
}