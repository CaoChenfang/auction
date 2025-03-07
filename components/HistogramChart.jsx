import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function HistogramChart(props) {
  function histogram(data, size) {
      let min = props.min;
      let max = props.max;
  
      for (const item of data) {
          if (item < min) min = item;
          else if (item > max) max = item;
      }
  
      const bins = Math.ceil((max - min+1) / size);
  
      const histogram = new Array(bins).fill(0);
  
      for (const item of data) {
          histogram[Math.floor((item - min) / size)]++;
      }
      const _histogram = histogram.map((item,index) => {return({"name": JSON.stringify(index), "frequency": item})})
  
      return _histogram;
  }
  //console.log(props.props);
  if (typeof(props.props) !== 'undefined' && props.props.length > 0) {
      const data = histogram(props.props,1);
      //console.log(data)
      return (
          <div  className="grid place-items-center">
          <BarChart
            width={700}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="name" height={30} stroke="#8884d8" />             
            <Bar dataKey="frequency" fill="#82ca9d" />
          </BarChart>
       

          </div>
          
      );
  } else {
      return (<div>

      </div>)
  }

}
