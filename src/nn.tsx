import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define interfaces for data structures
interface DataPoint {
  x: number;
  y: number;
}

interface ChartDataPoint {
  x: number;
  actual: number;
  predicted: number;
}

const NeuralNetworkVisualization = () => {
  const [weight, setWeight] = useState<number>(1);
  const learningRate: number = 0.5;
  const [iteration, setIteration] = useState<number>(0);
  const [data, setData] = useState<DataPoint[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentDataPoint, setCurrentDataPoint] = useState<number>(0);

  const generateData = (): DataPoint[] => {
    return Array.from({ length: 10 }, (_, i) => {
      const x = i + 1;
      return { x, y: x * x };
    });
  };

  useEffect(() => {
    setData(generateData());
  }, []);

  const predict = (x: number): number => {
    return weight * x;
  };

  const updateWeight = () => {
    if (currentDataPoint >= data.length) {
      setCurrentDataPoint(0);
      setIteration(iteration + 1);
    }

    const point = data[currentDataPoint];
    const error = point.y - predict(point.x);
    const deltaW = error / point.x;
    const newWeight = weight + learningRate * deltaW;

    setWeight(newWeight);
    setCurrentDataPoint(currentDataPoint + 1);

    const newChartData: ChartDataPoint[] = data.map((point) => ({
      x: point.x,
      actual: point.y,
      predicted: newWeight * point.x,
    }));
    setChartData(newChartData);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Neural Network Weight Tuning (Sequential Update)
      </h2>
      <p className="mb-2">Current Weight: {weight.toFixed(4)}</p>
      <p className="mb-2">
        Current Data Point: {currentDataPoint + 1} / {data.length}
      </p>
      <p className="mb-4">Iteration: {iteration}</p>
      <button onClick={updateWeight} className="mb-4">
        Update Weight
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            name="Actual (Y = X^2)"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#82ca9d"
            name="Predicted (Y = W * X)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NeuralNetworkVisualization;
