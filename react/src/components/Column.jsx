import { Button, Card, Divider, Group, List, Text } from "@mantine/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDisclosure } from "@mantine/hooks"

import Task from "./Task"
import './Column.css'
import { useCallback, useState } from "react"
import { useToast } from "../contexts/ToastProvider"
import { useData } from "../contexts/DataProvider"
import Delete from "./Delete"
import axiosClient from "../axios-client"
import CreateOrUpdate from "./CreateOrUpdate"
import { useAuth } from "../contexts/AuthProvider"

// eslint-disable-next-line react/prop-types
export default function Column({ column: { name, orderedTasks, id } }) {
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false)
    const [isCreating, setIsCreating] = useState(false)

    const { addAlert } = useToast()
    const { setData } = useData()
    const { setToken } = useAuth()

    const deleteItems = useCallback(() => {
        setIsDeleting(true)
        // eslint-disable-next-line react/prop-types
        axiosClient.delete(`/columns/${id}`)
            .then(() => {
                axiosClient
                    .get('/items')
                    .then(({data}) => {
                        setData(data)
                        setIsDeleting(false)
                        closeDelete()
                        // eslint-disable-next-line react/prop-types
                        addAlert(`All '${name}' items deleted successfully`, 'teal')
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
    }, [addAlert, closeDelete, id, name, setData])

    const createItem = useCallback((itemTitle, itemDescription, itemContent) => {
        setIsCreating(true)
        if (itemTitle.length === 0) {
            setIsCreating(false)
            addAlert('Title should be filled', 'red')
            return
        }

        const payload = {
            title: itemTitle,
            description: itemDescription,
            content: itemContent,
            column_id: id
        }

        axiosClient.post('/items', payload)
            .then(() => {
                axiosClient.get('/items').then(({data}) => {
                    setData(data)
                    setIsCreating(false)
                    closeCreate()
                    addAlert('Item created successfully', 'teal')
                })
                
            })
            .catch(({ response }) => {
                setIsCreating(false)
                addAlert(response.data.message, 'red')

                if (response.status === 401) {
                    setToken(null)
                }
            })
    })

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className={`column-card ${name === 'In progress' ? 'in-progress-card' : ''}`}>
            <Group position="apart" className="column-header">
                <Text><h5>{ name }</h5></Text>
                <div className="button-group">
                    <Button variant='subtle' onClick={openCreate} className="button">
                        <FontAwesomeIcon icon="fa-solid fa-plus" size='lg' />
                    </Button>
                    <Button color="red" variant='subtle' onClick={openDelete} className="delete-button">
                        <FontAwesomeIcon icon="fa-solid fa-trash" size='lg' />
                    </Button>
                </div>
                <CreateOrUpdate title={'Create'} opened={createOpened} close={closeCreate} onCreate={createItem} isCreating={isCreating} />
                <Delete opened={deleteOpened} close={closeDelete} messageDetail={`all items under '${name}'`} titleDetail={'all items in row'} onDelete={deleteItems} isDeleting={isDeleting} />
            </Group>
            <Divider size="md" mt="sm" mb="md" />

            <List
                className="task-list"
            >
                    {
                        // eslint-disable-next-line react/prop-types
                        orderedTasks.length > 0 && orderedTasks.map(task => {
                        return <Task key={task.id} task={task} columnName={name} />
                    })}
            </List>
        </Card>
    )
}