import React from 'react'

const ProjectHeader = ({children, id}) => {
  return (
    <h2 id={id} className='md:text-lg font-semibold dark:text-white'>{children}</h2>
  )
}

export default ProjectHeader
