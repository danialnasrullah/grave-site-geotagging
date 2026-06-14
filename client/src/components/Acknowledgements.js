import React from 'react';
import './Acknowledgements.css';

function Acknowledgements() {
  return (
    <div className="acknowledgements">
      <h1>Acknowledgements</h1>
      <div className="acknowledgements-content">
        <section className="acknowledgement-section">
          <h2>Project Information</h2>
          <p>
            This project was completed as a Directed Research Project under the supervision of Dr. Ali Usman Qasmi by Danial Nasrullah (Batch of 2025).
          </p>
        </section>

        <section className="acknowledgement-section">
          <h2>Supervisor</h2>
          <p>
            Dr. Ali Usman Qasmi has been teaching history at LUMS' School of Humanities and Social Sciences since 2012. Currently, he also serves as the Director of the Gurmani Center for Languages and Literature.
          </p>
        </section>

        <section className="acknowledgement-section">
          <h2>Special Thanks</h2>
          <p>
            Special thanks to Mr. M R Shahid whose extensive research and collected works under the title of "Lahore Mein Madfoon Mashaheer" served as reference books for this project. His personal guidance in field research provided critical information and insights.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Acknowledgements; 