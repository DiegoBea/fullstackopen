import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  let good = props.good;
  let bad = props.bad;
  let neutral = props.neutral;
  let total = good + bad + neutral;

  let stats = (
    <table>
      <StatisticLine value={good} text="Good" />
      <StatisticLine value={neutral} text="Neutral" />
      <StatisticLine value={bad} text="Bad" />
      <StatisticLine value={total} text="All" />
      <StatisticLine value={(good - bad) / total} text="Average" />
      <StatisticLine value={(good * 100) / total + "%"} text="Positive" />
    </table>
  );

  let noFeedback = <div>No feedback given</div>;

  return total !== 0 ? stats : noFeedback;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button label="Good" onClick={() => setGood((total) => total + 1)} />
      <Button
        label="Neutral"
        onClick={() => setNeutral((total) => total + 1)}
      />
      <Button label="Bad" onClick={() => setBad((total) => total + 1)} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
