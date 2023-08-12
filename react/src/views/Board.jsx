import { useCallback, useEffect, useMemo, useState } from 'react'

import { useData } from '../contexts/DataProvider'
import Column from '../components/Column'
import './Board.css'
import Navbar from '../components/Navbar'
import axiosClient from '../axios-client'
import { Loader } from '@mantine/core'

import { useAuth } from '../contexts/AuthProvider'


export default function Board() {
    const { data, setData } = useData()
    const { setToken } = useAuth()

    const columnOrder = useMemo(() => {
        if (data.length > 0) {
            return ["To do", "In progress", "Done"]
        }
    }, [data])
    const [isLoading, setIsLoading] = useState(false)

    const fetchItems = useCallback(() => {
        setIsLoading(true)
        axiosClient
            .get('/items')
            .then(({data}) => {
                setData(data)
                setIsLoading(false)
            })
            .catch(response => {
                setIsLoading(false)

                if (response.status === 401) {
                    setToken(null)
                }
            })
    }, [setData, setToken])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    return (
        <>
            {(isLoading || data.length !== 3) ? (
                <div className='loader'>
                    <Loader size="xl" variant="dots" />
                </div>
            ) : (
                <div className='app-container'>
                    <Navbar />
                    <div className='board'>
                        {data.length > 0 && columnOrder.map(columnName => {
                            const column = data.find(column => column.name === columnName)
                            return <Column key={column.id} column={column} />
                        })}
                    </div>
                </div>
            )}
        </>
    )
}