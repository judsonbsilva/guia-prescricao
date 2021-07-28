import React from 'react';

const DrugsTable = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
}) => {

    const xablau = (e) => {
        console.log(e);
    }

    return (
        <table {...getTableProps()} className='table-auto w-full'>
            <thead>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className='bg-gray-100'>
                    {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} className='border px-2 py-2'>
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
                    <tr {...row.getRowProps()} onFocus={xablau}>
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