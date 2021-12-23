import React from 'react'

const Loading = ({loading, text='Loading...'}) => {
    return (
        <>
           {loading && <div>{text}</div>} 
        </>
    )
}

export default Loading
