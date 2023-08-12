import { createContext, useCallback, useContext, useState } from "react"

const DataContext = createContext({
    data: [],
    setData: () => {}
})

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
    const [data, _setData] = useState([]);

    const setData = useCallback(data => {
        data.forEach((column) => {
            const orderedTasks = []

            for (const taskId of column.task_ids) {
                const foundTask = column.tasks.find(task => task.id === taskId)
                if (foundTask) {
                    orderedTasks.push(foundTask)
                }
            }

            column.orderedTasks = orderedTasks.reverse()
        })


        // const orderedTasks = data.task_ids.map(taskId => taskId === data.tasks.find(task => task.id === taskId)).filter(Boolean)
        // data.orderedTasks = orderedTasks
        // console.log(data)
        _setData(data)
    }, [_setData])

    return (
        <DataContext.Provider value={{ 
            data,
            setData
        }}>
            { children }
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)