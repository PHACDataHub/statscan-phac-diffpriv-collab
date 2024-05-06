<b>What is differential privacy?</b>

Differential privacy is a mathematical framework for quantifying the privacy of a set of data so that we can guarantee the privacy of the individuals whose sensitive data we want to analyze. Differential privacy aims to strike a balance between providing useful information from a dataset and protecting the privacy of the individuals whose data it contains.

<b>How does differential privacy work?</b>

Mathematically speaking, a database is a list of entries where each entry is the set of answers to a collection of questions – like a table where the questions of a survey are the columns and each row is a different person’s response survey response. A privacy mechanism is a function that acts on our database and changes some of the entries so that we can no longer identify a particular individual’s survey response. Roughly speaking, a privacy mechanism is $\epsilon$-differentially private for every pair of databases that differ in only one entry and for all possible outputs of the privacy mechanism and for all adversaries trying to access the data the ratio of the probabilities of getting a certain answer to a query applied to the first dataset and getting that same output from a query applied to the second dataset is very, very close to 1. This means that if we ask the first data set a question we can expect to get a very similar answer to what we would have gotten if we had asked the same answer to a different data set. This can be very useful to us if one of our data sets is provably private!

<b>What is $\epsilon$?</b>

The Greek letter “epsilon” is our privacy parameter. It tells us how much the output of a query can change when a single entry of the dataset is changed. We want epsilon to be small, so that adding one persons data to the dataset doesn’t change it in a noticeable way.

<b>What is the sensitivity of a function?</b>

The sensitivity of a function is the maximum difference in outputs in applying that function to two datasets that differ in only one entry.

<b>Noise function (Laplace Mechanism):</b>

![image](https://github.com/PHACDataHub/statscan-phac-diffpriv-collab/assets/46490790/60724929-50f5-4ed1-9b5a-e45233ac9424)

<b>Command to run pipeline:</b>
<li>python simulator.py</li>
<li>python simulator.py --config_file {file_path}</li>

