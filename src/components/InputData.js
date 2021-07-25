import React from 'react';
import { normalizeText } from '../helpers';
/*
function InputData({ textInput, onChange }){
     * Quando o input muda, divide pelo '@', verifica as novas variáveis, 
     * filtra as que não tem chave ou valor e lista as que tem no objeto
     * inputVars
  
    const updateVars = (input) => {
        let inputsVars = {};
        input.split('@')
            .filter((v) => v)
            .forEach((block) => {
                let [key, value] = block.split(":")
                value = normalizeText(value)
                if(key && value)
                    inputsVars[key] = value;
            })
        /**
         * Chama a função de mudança para atualizar a lista de variáveis
        
        onChange(inputsVars);
    };

    const handleChangeInput = (ev) => {
        updateVars(ev.target.value)
    }

    updateVars(textInput);
    
    return (
        <textarea
            value={textInput}
            className="h-2/3 w-full resize border border-gray-300 rounded-md"
            onChange={handleChangeInput}
        />
    )
} */

class InputData extends React.Component {
    constructor(props) {
        super(props)
        this.state = { textInput: props.textInput }
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }
    
    updateVars(input) {
        let inputsVars = {};
        if( input ){
            input.split('@')
                .filter((v) => v)
                .forEach((block) => {
                    let [key, value] = block.split(":")
                    value = normalizeText(value)
                    if(key && value)
                        inputsVars[key] = value;
                })
        }
        this.props.onChange(inputsVars);
    }

    componentDidMount() {
        this.updateVars(this.props.textInput)
    }

    handleChangeInput(ev){
        this.updateVars(ev.target.value)
    }
  
    render() {
        return (
            <textarea
                value={this.state.textInput}
                className="h-2/3 w-full resize border border-gray-300 rounded-md"
                onChange={this.handleChangeInput}
            />
        )
    }
}

  export default InputData;