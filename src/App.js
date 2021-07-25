import React, { Component, useMemo } from 'react';
import Papa from 'papaparse';
import MaterialTable from "material-table";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      columns: [
        //{ title:'ID', field: 'id' },
        { title:'Princípio Ativo', field: 'substancia' },
        { title:'Concentração', field: 'concentracao' },
        { title:'Marcas', field: 'marcas' },
        { title:'Apresentação', field: 'apresentacao' },
        { title:'Mínimo (R$)', field: 'minino' },
        { title:'Máximo (R$)', field: 'maximo' },
        { title:'Médio (R$)', field: 'mediano' }
      ]
    };
  }

  async loadData() {
    const response = await fetch("/resumo_medicamentos.csv");
    let temp = await response.text();
    temp = Papa.parse(temp, { header: true });
    temp = temp.data.map((row) => {
      let newRow = {};
      
      const brands = row.marcas.split(/\|/g).map((x) => ({ nome: x }));
      const pricesMin = row.valoresMin.split(/\|/g).map((x) => Number(x));
      const pricesMax = row.valoresMax.split(/\|/g).map((x) => Number(x));
      const pricesMed = row.valoresMed.split(/\|/g).map((x) => Number(x));
        
      newRow.options = brands.map((brand, i) => {
        return {
          ...brand,
          min: pricesMin[i],
          max: pricesMax[i],
          med: pricesMed[i]
        }
      });

      newRow.marcas = row.marcas.replace(/\|/g, ', ');
      newRow.substancia = row.substancia.replace(/;/g, ', ');
      let apres = row.resumoApresentacao.split(/\|/g);
      newRow.concentracao = apres.slice(0, apres.length -2).join(' + ');
      newRow.apresentacao = apres.slice(apres.length -2, apres.length).join(', ');

      return { ...row, ...newRow };
    });

    this.setState({ data: temp });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="w-screen h-screen">
        <MaterialTable
          columns={this.state.columns}
          data={this.state.data}
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
}

export default App;
