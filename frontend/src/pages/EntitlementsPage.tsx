import React, { useState } from 'react'
import dayjs from 'dayjs'

const EntitlementsPage: React.FC = () => {
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count + 1);
    }
    const decrement = () => {
        setCount(count - 1);
    }
    return (
        <div>
            <h1>Entitlements Page</h1>
            <p>Count: {count}</p>
            <p>Current Date: {dayjs().format('YYYY-MM-DD')}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    )
}
export default EntitlementsPage