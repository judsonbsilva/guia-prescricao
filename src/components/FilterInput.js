import React, { useState } from 'react';
import {
    useAsyncDebounce
} from 'react-table';

function FilterInput({
    globalFilter,
    setGlobalFilter,
    setFilter
}){
    const [value, setValue] = useState(globalFilter)
    const onChange = value => {

        let name = value;
        let concentration = '';
        let apresentation = '';
        if((/,/g).test(value)){
            let parts = value.split(/\s?,\s?/g);
            name = parts[0];
            concentration = parts[1];
            apresentation = parts[2];
        }
        setGlobalFilter(name)
        setFilter('concentracao', concentration)
        setFilter('apresentacao', apresentation);
    }

    return (
    <form className="relative" onSubmit={ e => {
        e.preventDefault()
    }}>
        <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
        <input
          value={value}
          onChange={e => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={'Buscar medicamento'}
          className='focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10 bg-gray-100 my-2'
        />  
      </form>
    )
}

export default FilterInput