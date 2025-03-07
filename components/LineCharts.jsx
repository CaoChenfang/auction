import React, { PureComponent } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, Line,
  LineChart,
  ReferenceDot
} from 'recharts';


export default function LineCharts({maxprice, minprice, auctionlength, remainingtime}) {
    //Create data for the chart
    const data = []; 
    const reserve =  minprice;
    const current_price = parseFloat(((maxprice-minprice)/auctionlength*remainingtime)) + parseFloat(minprice) ;
    const current_time = Math.floor(auctionlength-remainingtime);
    const currentprice = parseFloat(current_price).toFixed(2);
    
    for (let i = 0; i <= 10 ; i++) {
        
        let d = {
            time: auctionlength*i/10,
            price: Math.floor(maxprice - (maxprice-minprice)/10*(i)),
        };
        data.push(d);
    }
    //console.log(remainingtime)
    //console.log(current_price)
  return  (
    
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 30, right: 10, bottom: 30, left: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      <XAxis dataKey="time" type="number" />
      <YAxis  label={{ value: 'Price', angle: -90, position: 'insideLeft' }}/> 
      <ReferenceDot x={current_time} y={current_price} label={{ value: currentprice, angle: 0, position: 'top' }} r={10} fill="red" stroke="none" />     
    </LineChart>    
  );
}
