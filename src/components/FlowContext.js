import React from "react";

const FlowContext = React.createContext({
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
@paridade: G1P2NA0
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
    output: '',

    setInput: () => {
        
    }
});

export default FlowContext;
