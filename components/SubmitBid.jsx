"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EndGame from "./EndGame";
import { signOut } from "next-auth/react";
import NavBarUser from "./NavBarUser";
import React from 'react';
import { useCountdown } from './useCountdown';
import LineCharts from "./LineCharts";

export default function SubmitBid() {

  const [userbid, setBid] = useState();
  const [error, setError] = useState("");
  //const [game, setGame] = useState([{ winner: '',
 // maxnumbid: 0,
 // gamelength: 0,
 // gametype: 'open',
  //isactive:'ended'}]);
  //const [gameData, setGameData] = useState([]);
  const [game, setGame] = useState();
  const [gameData, setGameData] = useState();
  const { data: session } = useSession();
  const router = useRouter();
  const [submissionTime, setSubmissionTime] = useState(Date.now());
  const role = session?.user?.role
  const useremail = session?.user?.email;
  //The first part is to connect to the server to find out the active game.
  //Get the last game and check the game status
 
  
  //Collect the game and game data to start with
  useEffect( () => {
    async function getGameData() {
      try {
        const res = await fetch('api/getGameData', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
        });
        
        if (res.ok) {
          const resData = await res.json();
          if (typeof resData !== 'undefined' && resData.length > 0 ) {
            setGameData(resData);
          }
          
        }    
      } catch (err) {
        console.error(err);
      }
    
    }

    async function getGame() {
      try {
        const res = await fetch('api/getGame', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
        });
        
        if (res.ok) {
          const resData = await res.json();
          if (typeof resData !== 'undefined' && resData.length > 0 ) {
            setGame(resData);
          }
          
        }    
      } catch (err) {
        console.error(err);
      }
    
    }
    getGameData();  
    getGame();
   
   const interval = setInterval(async () => {
   
    await getGameData();
    await getGame();
  }, 5 * 1000);
    

  return () => clearInterval(interval)
 
  }, []);
  

 
  //Get the status of the game
  const isactive = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].isactive;
    } else {
      return 'ended';
    }
  }
  //console.log(isactive());
  //Get the max number of bid
  const maxnumbid = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].maxnumbid;
    } else {
      return 0;
    }
  }

  //Get the type of the game
  const auctiontype = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].auctiontype;
    } else {
      return "";
    }
  }
  // Get max, min 
  const max = typeof(game) !=="undefined" ? (game.length > 0? parseInt(game[game.length - 1].max["$numberDecimal"]):0): 0;
  const min = typeof(game) !=="undefined" ? (game.length > 0? parseInt(game[game.length - 1].min["$numberDecimal"]):0): 0;
  const multiplier = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].multiplier["$numberDecimal"]:0): 0;
  const gamelength = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].gamelength:0): 0;
  const updated = typeof(game) !=="undefined" ? (game.length > 0? Date.parse(game[game.length - 1].updated).valueOf():0): 0;
  const remainTime =  Date.now() < (updated + gamelength*60*1000) ? ((updated + gamelength*60*1000)-Date.now()):0;
  const targetTime = updated + gamelength*60*1000;
  const current_price = parseFloat(((max*multiplier-min)/gamelength*remainTime/60/1000)) + parseFloat(min) ;    
  const currentprice = parseFloat(current_price).toFixed(2);
  //console.log(currentprice)
  //Render the user valuation
  const renderUserValuation = () => {
    if (typeof(userData)==="undefined") {
        return "";
    } 
    if (userData.length === 0) {
        return "";
    }
    var userValuation = Math.round(userData[0].valuation['$numberDecimal']*100)/100
    return userValuation.toString();
  }
  //Create a countdown Timer

  const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
      <div className={isDanger ? 'countdown danger' : 'countdown'}>
        <p>{value}</p>
        <span>{type}</span>
      </div>
    );
  };

  const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="show-counter">
        <a          
          target="_blank"
          rel="noopener noreferrer"
          className="countdown-link"
        >
          <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
          <p>:</p>
          <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
          <p>:</p>
          <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
        </a>
      </div>
    );
  };
  
  const CountdownTimer = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
  
    if (days + hours + minutes + seconds <= 0) {
      return (<></>);
    } else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };



  //Get the average winning bid 
  const gameAverageBid = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) { 
      if (typeof ( game[game.length - 1].useraveragebid)!== 'undefined') {
        return game[game.length - 1].useraveragebid['$numberDecimal'].toString();     
      }      
     
    }   return ""; }
  //Get the winner 
  const getWinner = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].winner) !== 'undefined' && game[game.length - 1].winner.length > 0) {
          const _game = game[game.length - 1].winner;
          return _game;
      } else {
        return "";
      }     
    } else {
      return "";
    }
  }
  //Get the winning bids
  const getWinningBids = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].winningbids) !== 'undefined') {
          const _game = game[game.length - 1].winningbids['$numberDecimal'].toString();    
         
          return _game;
      } else {
        return "";
      }
     
    } else {
      return "";
    }
  }
  //Get the current highest bid
  //Calculate the winner 
  const calculateWinner = (_gameData) => {
    if ( typeof _gameData !== 'undefined' && _gameData.length > 0) {            
      var simplifiedGameData = _gameData.map(item => {
        return {"email": item.email, 
        "lastbid":  item.bid.length > 0 ? parseFloat(item.bid[item.bid.length - 1]['$numberDecimal'].toString()):0,
        "updated": item.updated,
      }; });
      var _bidList = simplifiedGameData.map(item=>item.lastbid);
      //console.log("The list of bid", _bidList)
      //find closest indexes
      
      const maxNumber = Math.max(_bidList);
      const index = _bidList.map( (x,index) => { if(x === maxNumber) return index}).filter(item => item !== undefined);
      const _winnerList = simplifiedGameData.filter((el,i) => index.some(j => i === j));
      const _winnerEmail = _winnerList.map(item => item.email);
      const _winnerBids = _winnerList.map(item => item.lastbid);
      return {
        userwinner: _winnerEmail, 
        winningbid: _winnerBids,
        averagebid:_winnerBids,
        
      }     

    } else {
      return {
        userwinner: [], 
        winningbid: [],
        averangebid: 0,
       
      }
    }

  }

  //Get the highest bid
  const highestbid = calculateWinner(gameData).winningbid.length > 0 ? calculateWinner(gameData).winningbid[0] :0

  
 
  //Get the game data of the current player
  const userData = typeof(gameData) !== "undefined"? gameData.filter(x => x.email == useremail) : [];  
  //Handle the submission button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auction_type = auctiontype();
    if (auctiontype()==="dutch") {
      setBid(currentprice);
    }
    console.log(userbid)
    if (auctiontype()==="open") {
      if (userbid < highestbid && highestbid > 0) {
        setError("Error bid. You need to submit a bid higher than the current highest bid");
        return;
      }
    }
   
    if (userbid < min) {
      setError("Error bid");
      return;
    }
    if (!useremail || !userbid) {
      setError("You need all fields to submit");
      return;
    }
    const userNumBid = (typeof userData.bid === 'undefined')? 0: userData.bid.length;
    if (userNumBid>=maxnumbid()) {      
      setError("You have exceeded the number of bids");
      return;
    }

    if( (Date.now()-submissionTime)/1000 < 10) {
      setSubmissionTime(Date.now());  
      setError("Only allow to submit one number in 10 seconds. Try again in 10 seconds");
      
    } else {
      try {
        const res = await fetch('api/submitBid', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({useremail, userbid})
      });
      if (auction_type==="dutch") {
        const userwinner = useremail;
        const winningbid = userbid;
        const averagebid = userbid;
        const res_ok = await fetch('api/endGame', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({userwinner, winningbid, averagebid})
      });

      }
      setSubmissionTime(Date.now());   
      if (res.ok) {
          const form = e.target;
          form.reset();
          setError("");
          
          //router.push("/");
      } else {
          console.log("Submission failed")
      }
  
        
      } catch (error) {
        console.log("Error when submission:", error)
      }
  
      
    }
   
  };
  //Render the instruction for each type of game
  const renderInstruction = () => {
    if (auctiontype()==="sealedfirstprice" || auctiontype()==="sealedsecondprice" ) {
      return (<div class="mx-24 bg-green-200">
        <h3 class="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p class="p-4 text-left">
        Currently, the {auctiontype()==="sealedfirstprice" ? "sealed first price": "sealed second price"} auction is active. The students can choose to bid any number above {min} . <br />
        The maximum number of bid is {maxnumbid()}. Only 1 submission is allowed in 10 seconds. <br />
        All bids are sealed. The winner is the one with the {auctiontype()==="sealedfirstprice" ? "": "second"}  highest bid.         
        <br />
        In case of multiple highest bids, the winner is the earliest bidder.       
        </p>
      </div>)
    }
    if (auctiontype()==="open") {
      return (<div class="mx-24 bg-green-200">
        <h3 class="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p class="p-4 text-left">
        Currently, the open auction is active. The students can choose to submit any bid above {min} and current highest bid. <br />
        The students can see the current highest bid and change their bids
        <br />
        The maximum number of submission is {maxnumbid()}. Only 1 submission is allowed in 10 seconds. <br />
        The winner is the one with the highest bid
        </p>
      </div>)
    }
    if (auctiontype()==="dutch") {
      return (<div class="mx-24 bg-green-200">
        <h3 class="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p class="p-4 text-left">
        Currently, the dutch auction is active. The students can choose to submit. <br />
        The price linearly decreases over time. The one who submit the first bid is the winner.     
        
        </p> 
      </div>)
    }
  }
  //Render the form and public info

  const renderForm = () => {
    const userNumBid = (typeof(userData.bid) !== 'undefined') ? userData.bid.length: 0;
    if (isactive() === 'active'&& remainTime > 0) {
      return ( <div>
      <NavBarUser />
      <div className="grid place-items-center h-screen">
      <div>
        Welcome {useremail}. { renderUserValuation() ? <> Your valuation is {renderUserValuation()}</>:<div></div>}.
      </div>
      <div>
        {renderInstruction()}
      </div>

      {renderUserValuation() ? (
        <div>
           <div>
        {auctiontype()==="dutch"? <LineCharts maxprice = {max*multiplier}  minprice = {min} auctionlength = {gamelength}  remainingtime= {remainTime/(60*1000)} />: <></>}
           </div>
           <div>
              <CountdownTimer targetDate={targetTime} />
            </div>
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
      <h1 className="text-xl font-bold my-4">Bid Submission</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {auctiontype()==="dutch" ? (<></>):(<input
          onChange={(e) => setBid(e.target.value)}
          type="number"
          step="any"
          min="0" 
          max="100"
          placeholder="Enter your bid"
          
        />)}          
        <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
          Submit
        </button>
        {error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
        )}

      </form>
    </div>
    
      {auctiontype()==="open"? (<div>The current highest bid is {highestbid}</div>): (<div></div>)}

      </div>

      ):(<div>
          The auction is active. You need to register as an active user to bid.
        </div>)}                
      </div>
    </div>)
    }

    if (isactive() === 'active'&& remainTime === 0) {
      return ( 
      <div>
      <NavBarUser />
      <div className="grid place-items-center h-screen">
      <div>
        Welcome {useremail}. { renderUserValuation() ? <> Your valuation is {renderUserValuation()}</>:<div></div>}.
      </div>
      <div>
        {renderInstruction()}
      </div>
      <div>
        The auction is active but the bidding period already ended.
      </div>      
      </div>
      </div>)
    }

    if (isactive() !=='active') {
      return ( <div> 
      <NavBarUser />
      <div className="grid place-items-center p-20">
        There is no active game.
      <br/>
        The game&apos; winner is {getWinner()}. <br/> 
      <br />
        The winning number is {getWinningBids()}. <br />
        The average bid is { gameAverageBid()}</div></div>
      )
    }   
    
  }

  return (
    <div> 
      {role ==='admin'? <EndGame /> : renderForm()}
    </div>
  );
}