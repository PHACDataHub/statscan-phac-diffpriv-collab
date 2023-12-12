import React from 'react'
import { useContext } from 'react';
import Plot from 'react-plotly.js';
import { contexts } from '../contexts/AppContext';

function LaplaceDistPlot() {
  const { sensitivity,epsilon } = useContext(contexts.App.context);
  const range = (start,end,step) => {
    const range = []
    for(let x = start;x <= end; x += step){
        range.push(x);
    }
    return range;
  }

  //const u = 0;
  const u = 0;//Math.random() - 0.5;
  const b = sensitivity / epsilon;
  const x = range(-0.5+u,0.5+u,0.001);
  const laplacePDF = (x) => {
    return Math.exp(-Math.abs(x-u)/b)/(2*b);
  }

  return (
    <>
    <Plot
        data={[
          {
            x: x,
            y: x.map(el => laplacePDF(el)),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
          }
        ]}
        layout={ {width: 400, height: 400, title: 'Laplace Distribution'} }
      />
    </>
  )
}

export default LaplaceDistPlot