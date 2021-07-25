import moment from 'moment';

const hasVar = /\@[a-zA-Z]+:(\w|\s)+\n/
const regDatatime = /(\d{2}(\\|\/)+)/

export const normalizeText = (text) => text ? text.replace(/(\n|\s)+$/, '').replace(/^(\s|\n)+/, '') : '';

export const replaceVars = (vars, template) => template ? template.replace(/{(\w+)}/g, (_, key) => vars[key] || 'FALTANDO') : '';

export const isDatatime = (x) => typeof(x) == 'string' && (/(\d{2}\/){2}\d+/).test(x)

export const isGI = (x) => typeof(x) == 'string' && (/\d+s\d+d/).test(x)

export const isMulti = (x) => typeof(x) == 'string' && (/|/).test(x)

export const getDatatime = (x) => {
  let y = x.split("/").map(Number).reverse();
  y[0] += 2000;
  return moment(y);
}

/* Função para deduzir variáveis a partir das já declaradas*/
export const generateVars = (vars) => {
  let metaVars = {}
  /* Calcula o dia atual de internação*/
  if(isDatatime(vars.admitidoEm)){
    metaVars.admicao = getDatatime(vars.admitidoEm)
    metaVars.dih = metaVars.admicao.diff(moment(), 'days')
  }
  /* Calcula a idade gestacional pela DUM */
  if(isDatatime(vars.dum)){
    metaVars.dum = getDatatime(vars.dum);
    let igdum = moment().diff(metaVars.dum, 'days')
    metaVars.igDum = `IG(DUM ${vars.dum}) ${Math.floor(igdum/7)}s${igdum % 7}d`
  }
  /* Calcula a idade gestacional por um USG */
  if(isMulti(vars.usgIg)){
    let usgInfo = {}
    vars.usgIg.split('|').filter((v) => v).forEach((x) => {
      x = normalizeText(x);
      if(isDatatime(x)){
        usgInfo.didIn = getDatatime(x)
      } else if(isGI(x)){
        let [_, weeks, days] = x.match(/(\d+)s(\d+)d/);
        usgInfo.giStr = x
        usgInfo.gi = Number(weeks) * 7 + Number(days)
      }
    })
    if(usgInfo.gi && usgInfo.didIn){
      let igUsg = moment().diff(usgInfo.didIn, 'days') + usgInfo.gi;
      metaVars.igUsg = `IG(USG ${usgInfo.didIn.format('DD/MM/YY')} ${usgInfo.giStr}) ${Math.floor(igUsg/7)}s${igUsg % 7}d`;
    }
  }
    
  return {...vars, ...metaVars}
}
