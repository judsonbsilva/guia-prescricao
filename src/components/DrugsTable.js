import React, { useState } from 'react';

const DrugsTable = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    focus
}) => {

    const xablau = (a,b) => {
        console.log(a,b);
    }

    return (
        <table
            {...getTableProps()}
            className='table-auto w-full'
            tabIndex={-1}
        >
            <thead>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className='bg-gray-100'>
                    {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} className='border px-2 py-2 text-sm'>
                        {column.render('Header')}
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps()}
                        className={`bg-white ${focus === i ? 'bg-gray-800 text-white' : ''}`}
                    >
                        {row.cells.map(cell => {
                            return (
                            <td
                                {...cell.getCellProps()}
                                className='border px-4 py-4 text-center'
                            >
                                {cell.render('Cell')}
                            </td>
                            )
                        })}
                    </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default DrugsTable