import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
//import MaterialTable from "material-table";
import { useTable, usePagination, useFilters } from 'react-table';

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const text = await response.text();
      setData(text);
    }
    fetchData();
  }, [url]);

  return data;
};

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
    rows,
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
      pageSize: 5
    }
  }, useFilters, usePagination);

  console.log(data);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilterInput(value);
    setFilter('substancia', value)
  };

  return (
    <div className='w-full h-full'>
    <input
      value={filterInput}
      onChange={handleFilterChange}
      placeholder={'Buscar'}
    />
    <table {...getTableProps()} className='table-fixed w-full'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} className='px-4 py-2'>
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
                        className='border px-4 py-4 h-1/5'
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                })}
              </tr>
            )
          })}
      </tbody>
      <tfoot>
      <div className="inline-flex">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => previousPage()} disabled={!canPreviousPage}
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          onClick={() => nextPage()} disabled={!canNextPage}
        >
          <span className="material-icons-outlined">arrow_forward</span>
        </button>
      </div>
       <div>
        <p>{pageIndex + 1} de {pageOptions.length}</p>
       </div>
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
      </tfoot>
    </table>
    </div>
  );
/*  const tableInstance = useTable({ columns, data })

  return (
    <div className="w-screen h-screen">
      <MaterialTable
        columns={columns}
        data={data}
        title="Medicações e Preços"
        options={{
          paging: true
        }}
        onPageChange={()=>{
          console.log(arguments);
        }}
      />       
    </div>
  );*/

}

export default App;
