import React from 'react'
import { useContext } from 'react';
import { contexts } from '../contexts/AppContext';
import Plot from 'react-plotly.js';

function LaplaceDistPlot() {
  const { sensitivity,epsilon,noiseType } = useContext(contexts.App.context);
  const range = (start,end,step) => {
    const range = []
    for(let x = start;x <= end; x += step){
        range.push(x);
    }
    return range;
  }

  const u = 0;//Math.random() - 0.5;
  const b = sensitivity / epsilon;
  const x = range(-0.5+u,0.5+u,0.001);

  const laplacePDF = (x) => {
    return Math.exp(-Math.abs(x-u)/b)/(2*b);
  }
  const gaussianPDF = (x) => {
    const denominator = Math.sqrt(2 * Math.PI) * b;
    return Math.exp(- Math.pow(x - u, 2)/(2 * Math.pow(b, 2))) / denominator;
  }

  return (
    <>
    <Plot
        data={[
          {
            x: x,
            y: x.map(el => noiseType === "laplace" ? laplacePDF(el) : gaussianPDF(el)),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'rgb(173, 239, 209)'},
          }
        ]}
        layout={ {width: 350, height: 350, 
              font: {
              size: 10,
              color: 'white'
              },
              title: `${noiseType == "laplace" ? "Laplace" : "Gaussian"} Distribution`,
              plot_bgcolor: '#00203FFF',
              paper_bgcolor: '#00203FFF',
              yaxis: {
                  title : {
                    text : 'Probabilities'
                  },
                  tickcolor: "rgba(255,0,0,0.75)",
                  tickwidth: 7,
                  
                  gridcolor: "rgba(128,128,128,0.25)",
                  gridwidth: 3,
                  
                  zerolinecolor: "green",
                  zerolinewidth: 2,
                  range: [-1,10]
                },
              xaxis: {
                  title : {
                    text: 'Noise Values'
                  },
                  tickcolor: "blue",
                  tickwidth: 3,
                  
                  gridcolor: "rgba(128,128,128,0.25)",
                  gridwidth: 2,      
              }
             } }
      />
    </>
  )
}

export default LaplaceDistPlot