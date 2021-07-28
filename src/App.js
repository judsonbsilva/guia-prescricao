import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
  useSortBy
} from 'react-table';

import DrugsTable from './components/DrugsTable';
import FilterInput from './components/FilterInput';

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
    args.tam = row.substancia.length;
    args.marcas = ([...new Set(row.marcas.split((/\|/g)))]).join(', ');
//    .replace(/\|/g, ', ');
    args.substancia = row.substancia.replace(/;/g, ', ');
    let apres = row.resumoApresentacao.split(/\|/g);
    args.concentracao = apres.slice(0, apres.length -2).join(' + ');
    args.apresentacao = apres.slice(apres.length -2, apres.length).join(', ');

    return { ...row, ...args };
  })
}
const columns = [
  { Header:'Tamanho', accessor: 'tam' },
  { Header:'Princípio ativo', accessor: 'substancia' },
  { Header:'Concentração', accessor: 'concentracao' },
  { Header:'Marcas', accessor: 'marcas' },
  { Header:'Apresentação', accessor: 'apresentacao' },
  { Header:'Mínimo (R$)', accessor: 'minino' },
  { Header:'Máximo (R$)', accessor: 'maximo' },
  { Header:'Médio (R$)', accessor: 'mediano' }
];


function App (){
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if(data.length === 0){
      (async () => {
        const response = await fetch('/drugs.csv');
        const text = await response.text();
        const data = parseCSV(text);
        setData(data);
      })();
    }
  });

  /*const {
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
  }*/
  
  const tableInstance = useTable({
      columns,
      data,
      initialState: {
        pageSize: 10,
        hiddenColumns: ['tam'],
        sortBy: [
          { id: 'tam', desc: false }
          /*{ id: 'substancia', desc: false },
          { id: 'marcas', desc: false }*/
        ]
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className='w-full h-screen px-4 bg-gray-50'>
     <header className="flex flex-wrap md:h-1/6 sm:h-14">
       <div className="flex-auto md:w-full sm:w-1/2">
        <h1 className="w-full md:text-xl font-semibold mt-2 sm:text-base">Guia de Prescrição</h1>
        <div className="w-full flex-none md:text-sm font-medium text-gray-500 sm:text-xs">Por Judson Barroso</div>
      </div>
      <div className="flex-auto md:w-full sm:w-1/2">
        <FilterInput {...tableInstance}/>
      </div>
    </header>
    <div className="flex h-4/6 overflow-y-auto">
      {data.length === 0 ? 
        'Carregando...'
        :
        <DrugsTable {...tableInstance}/>
      }
    </div>
    <footer className="flex h-1/6">
    <div className="inline-flex h-14 py-2">
        <button
          //className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => tableInstance.previousPage()} disabled={!tableInstance.canPreviousPage}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Anterior</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          //className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => tableInstance.nextPage()} disabled={!tableInstance.canNextPage}
        >
          <span className="sr-only">Posterior</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="relative font-medium">
          <p className='inline-block text-gray-800 text-center align-middle py-2 px-4'>
          {tableInstance.state.pageIndex + 1} de {tableInstance.pageOptions.length}
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
