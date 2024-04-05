import { navigateToPage } from "./utility/general";
import { closeBox } from "./components/Qbox";

export const initFormState = {
    exerciseFrequency: {
      value : '',
      label : 'Exercise Frequency (days per week):',
      type : 'number',
      border : false,
      range : [0,7],
      performIntegerCheck : true
    },
    exerciseDuration: {
      value : '',
      label : 'Exercise Duration (minutes per session):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    exerciseIntensity: {
      value : '',
      label : 'Exercise Intensity:',
      type : 'select',
      values : [{value : '', label : 'Select Intensity'},{value : 'low', label : 'Low'},{value : 'moderate', label : 'Moderate'},{value : 'high', label : 'High'}],
      border : false
    },
    dailyStepCount: {
      value : '',
      label : 'Daily Step Count:',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    sleepDuration: {
      value : '',
      label : 'Sleep Duration (hours per night):',
      type : 'number',
      border : false,
      range : [0, 8],
      performIntegerCheck : false
    },
    weightStatus: {
      value : '',
      label : 'Weight Status (in the past six months):',
      type : 'select',
      values : [{value : '', label : 'Select Weight Status'},{value : 'underweight', label : 'Underweight'},{value : 'normal', label : 'Normal'},{value : 'overweight', label : 'Overweight'},{value : 'obese', label : 'Obese'}],
      border : false
    },
    weightChange: {
      value : '',
      label : 'Weight Change (in the past six months):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : false
    },
    fitnessLevel: {
      value : '',
      label : 'Fitness Level (on a scale of 1 to 10):',
      type : 'number',
      border : false,
      range : [1,10],
      performIntegerCheck : true
    },
    appUsageFrequency: {
      value : '',
      label : 'App Usage Frequency (times per week):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    caloricIntake: {
      value : '',
      label : 'Caloric Intake (calories per day):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : false 
    },
  }

export const classNames = {
  getHeight : "getHeight"
}

export const jsx = {
  1 : <p>Differential privacy is a mathematical framework for quantifying the privacy of a set of data
			so that we can guarantee the privacy of the individuals whose sensitive data we want to analyze.
			Differential privacy aims to strike a balance between providing useful information from a dataset
			and protecting the privacy of the individuals whose data it contains.</p>,
  2 : <p>Differential privacy is a mathematical framework for quantifying the privacy of a set of data
	so that we can guarantee the privacy of the individuals whose sensitive data we want to analyze.
	Differential privacy aims to strike a balance between providing useful information from a dataset
	and protecting the privacy of the individuals whose data it contains.</p>,
  3 : <p>Testing page 3 jsx</p>,
  4 : <p>Testing page 4 jsx</p>
}

export const pageMetaData = {
  1 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : <p>Testing page 1 jsx</p>,
    "qBoxAlternateJSX" : "",
    "showQBox" : false
  },
  2 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : <p>Testing page 2 jsx</p>,
    "qBoxAlternateJSX" : "",
    "showQBox" : false
  },
  3 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : <p>Testing page 3 jsx</p>,
    "qBoxAlternateJSX" : "",
    "showQBox" : false
  },
  4 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : <>
                  <b>Form Value Types and Ranges :</b>
                  <table className="page4qBoxTable" style={{width:'100%'}}>
                    <tr>
                      <th>Form Field</th>
                      <th>Type</th>
                      <th>Range</th>
                    </tr>
                    <tr>
                      <td>Exercise Frequency </td>
                      <td><b>Discrete</b></td>
                      <td><b> 0 - 7 </b></td>
                    </tr>
                    <tr>
                      <td>Exercise Duration </td>
                      <td><b>Continuous</b></td>
                      <td><b> 0 - 60 </b></td>
                    </tr>
                    <tr>
                      <td>Exercise Intensity </td>
                      <td><b>Categorical</b></td>
                      <td><b> N/A </b></td>
                    </tr>
                    <tr>
                      <td>Daily Step Count </td>
                      <td><b>Discrete</b></td>
                      <td><b> 0 - 60 </b></td>
                    </tr>
                    <tr>
                      <td>Sleep Duration </td>
                      <td><b>Continuous</b></td>
                      <td><b> 0 - 8 </b></td>
                    </tr>
                    <tr>
                      <td>Weight Status </td>
                      <td><b>Categorical</b></td>
                      <td><b> N/A </b></td>
                    </tr>
                    <tr>
                      <td>Weight Change </td>
                      <td><b>Continuous</b></td>
                      <td><b> 0 - 60 </b></td>
                    </tr>
                    <tr>
                      <td>Fitness Level </td>
                      <td><b>Discrete</b></td>
                      <td><b> 1 - 10 </b></td>
                    </tr>
                    <tr>
                      <td>App Usage Frequency </td>
                      <td><b>Discrete</b></td>
                      <td><b> 0 - 60 </b></td>
                    </tr>
                    <tr>
                      <td>Caloric Intake </td>
                      <td><b>Continuous</b></td>
                      <td><b> 0 - 60 </b></td>
                    </tr>
                  </table>
                </>,
    "qBoxAlternateJSX" : <>
                            <p>
                              <b>About : </b><br/>
                                This section is a simulation of a survey form that collects health data. The form loads with prefilled random values and the fields shown below are either discrete or
                                continuous. The type and range of accepted values are shown in the
                                question box at the bottom right of the screen.  The <b>RESET</b> button clears out any filled values. The <b>RANDOMIZE</b> button populates the fields randomly.
                                The <b>SUBMIT</b> button captures the form values and passes it onto the Noise Tuning section. Fields get highlighted
                                in red if they are not within the correct range.
                            </p>
                         </>,
    "showQBox" : true
  },
  5 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : <>
                  <p>
                    <b>How does differential privacy work?</b><br/>
                      Mathematically speaking, a database is a list of entries where each entry is the set of
                      answers to a collection of questions - like a table where the questions of a survey are
                      the columns and each row is a different survey response. A privacy
                      mechanism is a function that acts on our database and changes some of the entries so
                      that we can no longer identify a particular individual's survey response. Roughly
                      speaking, a privacy mechanism is <b>ε-differentially private</b> for every pair of
                      databases that differ by only one entry. For all possible outputs of the privacy
                      mechanism and for all adversaries trying to access the data,  the probability of getting the 
                      same answer when querying both the modified and unmodified databases is extremely close to 100%. 
                      This means that if we ask the first dataset a question we can expect to get a very similar answer to
                      what we would have gotten if we had asked the same question to a version of that dataset without a given row.
                  </p>

                  <p>
                    <b>What is Epsilon - ε?</b><br/>
                    The Greek letter “epsilon” is our privacy parameter. It tells us how much the output of a
                    query can change when a single entry of the dataset is changed. We want epsilon to be
                    small, so that removing a response from the dataset doesn't change it in a noticeable
                    way.
                  </p>

                  <p>
                    <b>What is the Sensitivity of a function?</b><br/>
                    The sensitivity of a function is the maximum difference in outputs in applying that
                    function to two datasets that differ in only one entry.
                  </p>

                  <p>
                    <b>What is b?</b><br/>
                    In terms of Local DP the <b>b</b> value is a ratio of Sensitivity to Epsilon. 
                    In terms of the two distributions - Laplace and Gaussian, it is called the scale parameter and
                    is used in the respective equations to produce the probability distributions seen in the graph. Its value determines
                    the how tight/flat the distribution is. A smaller <b>b</b> value will give a much tighter/pointier
                    graph, while a larger value will produce a flatter graph.
                  </p>

                  <p>
                    <b>What is the use of the graph?</b><br/>
                    The graph shows the probability distributions of noise values. The distribution is selected from the dropdown - Laplace or Gaussain. 
                    Both the distributions are centered around 0 and depending on the scale - <b>b</b> the distribution tightens or flattens out. 
                    For smaller values of b, the probability of getting noise values closer to 0 are much higher (owing 
                    to the pointy nature of the graph) and increasing the chances of smaller sampled noise values; leading to a lower
                    flucattion of the privatized result from the original response - <b>lower privacy but higher usbaility</b>. On the contrary, 
                    a higher b value would reduce the probability of getting values close to 0 (owing to a flatter graph) and increasing the chances of higher sampled noise values; ultimately causing a greater fluctuation 
                    in the privatized result from its raw counterpart - <b>higher privacy but lower usability</b>.
                  </p>
                </>, 
    "qBoxAlternateJSX" : <>
                            <p>
                              <b>About : </b><br/>
                              In this section, we showcase how a user response can be privatized with LDP by adding noise to the data (as depicted in <b onClick={()=>{closeBox();navigateToPage('page2')}}><u>image</u></b>).
                              The table shows the user's response before and after noise is applied to it.
                              The graph on the right presents the distribution being used to add noise to the initial response, based on the Laplace or Gaussian distribution selected from the corresponding dropdown. 
                              This distribution is where the noise values added to the response are sampled from. 
                              The tightness and spread of the distribution are controlled by the Sensitivity and Epsilon(ε) sliders which ultimatley govern the probabilty of getting lower/higher noise values. 
                              The <b>Confirm Changes</b> button takes the noised values from the table and passes it onto the next section.
                            </p>
                         </>,
    "showQBox" : true
  },
  6 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : "",
    "qBoxAlternateJSX" : <>
                            <p>
                              <b>About : </b><br/>
                              The data shown in this section is a JSON representation of the privatized data, that is ready for use. The noise adjustment done in the previous step adds plausible
                              deniability to it. This step depicts the part of the <b onClick={()=>{closeBox();navigateToPage('page2');}}><u>image</u></b> where the privatized data is ready to be transferred
                              from the data producer to the untrusted data curator. The data can be downloaded locally either in JSON or CSV formats.
                            </p>
                         </>,
    "showQBox" : false
  },
  7 : {
    "smallScreen" : false,
    "pageJSX" : "",
    "qBoxJSX" : "",
    "qBoxAlternateJSX" : <></>,
    "showQBox" : false
  }
}

export const pageNumbers = {
  'page1' : 1,
  'page2' : 2,
  'page3' : 3,
  'surveyForm' : 4,
  'intermediate' : 5,
  'finalResults' : 6,
  'goingForward' : 7,
}