import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MaterialTable from "material-table";

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
  //{ title:'ID', field: 'id' },
  { title:'Princípio Ativo', field: 'substancia' },
  { title:'Concentração', field: 'concentracao' },
  { title:'Marcas', field: 'marcas' },
  { title:'Apresentação', field: 'apresentacao' },
  { title:'Mínimo (R$)', field: 'minino' },
  { title:'Máximo (R$)', field: 'maximo' },
  { title:'Médio (R$)', field: 'mediano' }
];

function App (){
  const text = useFetch('/drugs.csv');
  const data = parseCSV(text);

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
  );
}

export default App;
