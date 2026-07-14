import React from 'react'
import Link from 'next/link'

const CardProject = ({title, image, category, link=''}) => {
  return (
    <div
      className='flex gap-3 items-center bg-white dark:bg-blue-950 border border-gray-200/80 dark:border-gray-800/80 p-2 rounded-xl shadow-md'
      style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(18,107,241,0.12), 0 8px 10px -6px rgba(18,107,241,0.08)';
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      <div className='w-24 h-24 rounded-lg overflow-hidden'>
        <img src={image} alt="project-image" className='w-full h-full object-cover' />
      </div>
      <div>
        <Link href={link} className='font-semibold md:text-base dark:text-white hover:text-good-blue transition-colors block'>{title}</Link>
        <p className='text-sm text-good-blue font-medium py-2'>{category}</p>
      </div>
    </div>
  )
}

export default CardProject
