import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
//import MaterialTable from "material-table";
import { useTable, usePagination, useFilters } from 'react-table';

const parseCSV = (data) => {
  return !data ? [] : Papa.parse(data, { header: true }).data.map((row) => {
    let args = {};
    
    const brands = row.marcas.split(/\|/g).map((x) => ({ nome: x }));
    const pricesMin = row.valoresMin.split(/\|/g).map((x) => Number(x));
    const pricesMax = row.valoresMax.split(/\|/g).map((x) => Number(x));
    const pricesMed = row.valoresMed.split(/\|/g).map((x) => Number(x));
      
    args.options = brands.map((brand, i) => {
      return {
        ...brand,
        min: pricesMin[i],
        max: pricesMax[i],
        med: pricesMed[i]
      }
    });

    args.marcas = row.marcas.replace(/\|/g, ', ');
    args.substancia = row.substancia.replace(/;/g, ', ');
    let apres = row.resumoApresentacao.split(/\|/g);
    args.concentracao = apres.slice(0, apres.length -2).join(' + ');
    args.apresentacao = apres.slice(apres.length -2, apres.length).join(', ');

    return { ...row, ...args };
  })
}
const columns = [
  { Header:'Princípio ativo', accessor: 'substancia' },
  { Header:'Concentração', accessor: 'concentracao' },
  { Header:'Marcas', accessor: 'marcas' },
  { Header:'Apresentação', accessor: 'apresentacao' },
  { Header:'Mínimo (R$)', accessor: 'minino' },
  { Header:'Máximo (R$)', accessor: 'maximo' },
  { Header:'Médio (R$)', accessor: 'mediano' }
];

const pageSizeOptions = [10, 50]

function App (){
  const [data, setData] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  
  useEffect(() => {
    if(data.length == 0){
      (async ()=> {
        const response = await fetch('/drugs.csv');
        const text = await response.text();
        const data = parseCSV(text);
        setData(data);
      })();
    }
  });
  
  // Input element
  /*= React.useCallback(() => {
    const text = useFetch('/drugs.csv');
    return parseCSV(text)
  });*/

  //const text = useFetch('/drugs.csv');
  //const data = parseCSV(text);
  /*const columns = React.useMemo(() => [
    { Header:'Princípio Ativo', accessor: 'substancia' },
    { Header:'Concentração', accessor: 'concentracao' },
    { Header:'Marcas', accessor: 'marcas' },
    { Header:'Apresentação', accessor: 'apresentacao' },
    { Header:'Mínimo (R$)', accessor: 'minino' },
    { Header:'Máximo (R$)', accessor: 'maximo' },
    { Header:'Médio (R$)', accessor: 'mediano' }
  ],[]);*/

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    //rows,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
 nextPage,
  setPageSize,
     canPreviousPage,
     canNextPage,
     setFilter,
  } = useTable({
    columns,
    data,
    initialState: {
      pageSize: 10
    }
  }, useFilters, usePagination);

  console.log(data);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilterInput(value);
    setFilter('substancia', value)
  };

  return (
    <div className='w-full h-screen px-4 bg-gray-50'>
     <header className="flex flex-wrap md:h-1/6 sm:h-14">
       <div className="flex-auto md:w-full sm:w-1/2">
        <h1 className="w-full md:text-xl font-semibold mt-2 sm:text-base">Guia de Prescrição</h1>
        <div className="w-full flex-none md:text-sm font-medium text-gray-500 sm:text-xs">Por Judson Barroso</div>
      </div>
      <div className="flex-auto md:w-full sm:w-1/2">
      <form className="relative">
        <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={'Buscar medicamento'}
          className='focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10 bg-gray-100 my-2'
        />  
      </form>
      </div>
    </header>
    <div className="flex h-4/6 overflow-y-auto">
    <table {...getTableProps()} className='table-auto w-full'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} className='bg-gray-800 mar'>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} className='px-2 py-2 text-white h-10'>
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
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className='border px-4 py-4'
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
    </div>
    <footer className="flex h-1/6">
    <div className="inline-flex h-14 py-2">
        <button
          //className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => previousPage()} disabled={!canPreviousPage}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span class="sr-only">Anterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          //className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => nextPage()} disabled={!canNextPage}
        >
          <span class="sr-only">Posterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <div className="relative font-medium">
          <p className='inline-block text-gray-800 text-center align-middle py-2 px-4'>
          {pageIndex + 1} de {pageOptions.length}
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
/*  
<div>Go to page:</div>
       <input
         type="number"
         defaultValue={pageIndex + 1 || 1}
         onChange={e => {
           const page = e.target.value ? Number(e.target.value) - 1 : 0
           gotoPage(page)
         }}
       />
       <select
         value={pageSize}
         onChange={e => {
           setPageSize(Number(e.target.value))
         }}
       >
         {pageSizeOptions.map(pageSize => (
           <option key={pageSize} value={pageSize}>
             Show {pageSize}
           </option>
         ))}
       </select>
        


*/

}

export default App;
