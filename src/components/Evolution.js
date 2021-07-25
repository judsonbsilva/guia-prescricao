import React, { useState } from 'react';
import Handlebars from 'handlebars';
import InputData from './components/InputData';
import { generateVars } from './helpers';

function Text() {
  const [state, setState] = useState({
    today: Date.now(),
    inputVars: {},
    metaVars: {},
    outputVars: {},
    textInput: `@nome: Judson
@leito: 7.2
@admitidoEm: 25/06/21
@dum: 26/01/21
@usgIg: 8s3d | 05/02/21
@tags: polidramio | peso fetal (p90-p97)
@atbs: Meropenem  D1:03/07/21) | Piperacilina(E)
@parto: C | 24/06/21 | 15:60 | iteratividade | com sangramento e tal sem outras intercorrências
@paridade: G1 P2N A0
@evolucao: Paciente, clinicamente estável, no leito, sem queixas. Amamenta, deambula, 
@exameFisico:
    `,
    textTemplate: `#{{dih}}º DIH + {{tags}}
#{{igDum}}
#{{igUsg}}
Paciente internado neste serviço há {{dih}} dias devido a {{tags}}. Evoluiu com parto {{tipoParto}}
no dia {{dataParto}}, procedimento
realizado {{intercorrencias}} intercorrências. {{igDum}}.
Paciente clinicamente estável. Aceitando dieta ofertada. Diurese presente, não evacuou no
dia anterior. Com sono e repouso satisfatórios. Sem queixas. Loquios fisiológicos`,
    output: ''
  });
  
  const setInputVars = (inputVars) => {
    setState({ inputVars })
  }

  const handleChangeTemplate = (ev) => setState({ textTemplate: ev.target.value })
  
  const showOutput = (ev) => {
    setState((state)=> {
      if(state && state.textTemplate && state.inputVars){
        const metaVars = generateVars(state.inputVars);
        const template = Handlebars.compile(state.textTemplate);
        const output = template(metaVars);
        setState({ metaVars, output });
      } else {
        console.log('DEU RUIM', state);
      }
    })
  }

  return (
    <div className="flex h-screen gap-4">
      <div className="flex-1 h-full">
        <InputData textInput={state.textInput} onChange={setInputVars}/>
        <button className="btn btn-primary btn-rounded" onClick={showOutput}>Testar</button>
      </div>
      <div className="flex-1">
        <textarea
            value={state.textTemplate}
            className="h-full w-full resize border border-gray-300 rounded-md"
            onChange={handleChangeTemplate}
        />
      </div>
      <div className="flex-1">
        <blockquote>
          <p className="whitespace-pre-line">{state.output}</p>
        </blockquote>
      </div>
    </div>
  )
}

function App (){
  return (
    <div className="w-screen">
      <Text/>
    </div>
  );
}

export default App;
