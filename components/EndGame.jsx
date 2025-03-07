"use client";
import  NavBar  from "@/components/NavBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HistogramChart from "./HistogramChart";
import { useCountdown } from './useCountdown';
import { signOut } from "next-auth/react";

export default function EndGame() {

  const [userbid, setBid] = useState();
  const [error, setError] = useState("");
  const [game, setGame] = useState();
  const [gameData, setGameData] = useState();
  const { data: session } = useSession();
  const router = useRouter();


  const useremail = session?.user?.email;
  //The first part is to connect to the server to find out the active game.
  //Get the last game and check the game status
   
  //Collect the game and game data to start with
  useEffect( () => {
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
          setGame(resData)
        }    
        
      } catch (err) {
        console.error(err);
      }     
    
    }
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
    getGameData();
    getGame();

    //async function getGameData() {
     // const res = await fetch('api/getGameData');
     // const resgameData = await res.json();
     // setGameData(resgameData);
   // }
   const interval = setInterval(async () => {
    await getGame();
    await getGameData();
  }, 5 * 1000);
    

  return () => clearInterval(interval)
    //getGameData();

  }, []);
  
  //console.log(gameData);
  //console.log(game[0].maxnumbid);
 
   //Get the type of the game
  const auctiontype = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].auctiontype;
    } else {
      return "";
    }
  }
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

  //Calculate the winner 
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
      
      const maxNumber = Math.max(..._bidList);
      const index = _bidList.map((x,index) => { if(x === maxNumber) return index}).filter(item => item !== undefined);
      const _winnerList = simplifiedGameData.filter((el,i) => index.some(j => i === j));
      const _winnerEmail = _winnerList.map(item => item.email);
      const _winnerBids = _winnerList.map(item => item.lastbid);
      return {
        userwinner: _winnerEmail, 
        winningbid: _winnerBids,
        averagebid:_winnerBids,
        bidlist:_bidList,
        
      }     

    } else {
      return {
        userwinner: [], 
        winningbid: [],
        averangebid: 0,
        bidlist: [],
      }
    }

  }

  const {userwinnerlist, winningbidlist, averagebidlist, bidlist} = calculateWinner(gameData);
  console.log(calculateWinner(gameData))
  
  // Get max, min 
  const max = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].max["$numberDecimal"]:0): 0;
  const min = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].min["$numberDecimal"]:0): 0;
  const multiplier = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].multiplier["$numberDecimal"]:0): 0;
  const gamelength = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].gamelength:0): 0;
  const updated = typeof(game) !=="undefined" ? (game.length > 0? Date.parse(game[game.length - 1].updated).valueOf():0): 0;
  const remainTime =  Date.now() < (updated + gamelength*60*1000) ? ((updated + gamelength*60*1000)-Date.now()):0;
  const targetTime = updated + gamelength*60*1000;
  const current_price = parseFloat(((max*multiplier-min)/gamelength*remainTime/60/1000)) + parseFloat(min) ;    
  const currentprice = parseFloat(current_price).toFixed(2);

   //Get the average winning bid 
  
  const gameAverageBid = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) { 
      if (typeof ( game[game.length - 1].useraveragebid)!== 'undefined') {
        return game[game.length - 1].useraveragebid['$numberDecimal'].toString();     
      }      
     
    }   return ""; }
  //
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
  
  //Get the number of game
  const getNumbOfGame = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game.length;
    } else {
      return 0;
    }
  }
  const numberofgame = getNumbOfGame();
  //Get the game data of the current player
  const userGameData = () => {
    if (typeof gameData !== 'undefined' && gameData.length > 0 ) {
     const data = gameData.filter((item)=>item.email===useremail);
    if (typeof data!== 'undefined'&&data.length > 0) {
      return data[0];
    } else {
      return {
        email: useremail,
        bid: [],
      } ;
    }
    } else {
      return {
        email: useremail,
        bid: [],
      } ;
    }
  }
  //console.log(userGameData());
  //Render the public information 
  const renderPublicInfo = (_gameData) => {
    if (typeof(_gameData) !== 'undefined'&&_gameData.length > 0) {
      if(_gameData[0].bid.length > 0) {
        return ( <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-auto border-collapse border border-slate-400 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>                
              <th className="border border-slate-300 px-6 py-3">Student ID</th>
              <th className="border border-slate-300 px-6 py-3">5 Latest Bids</th> 
              <th className="border border-slate-300 px-6 py-3">Latest Bid</th>      
              <th className="border border-slate-300 px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {_gameData.map((item,index)=> {
              return (
                <tr  key={JSON.stringify(index)}>                   
                  <td className="border border-slate-300 px-6 py-3">{ item.email.slice(0,7) }</td>
                  <th className="border border-slate-300 px-6 py-3">{item.bid.length === 1? <span></span>: item.bid.slice(Math.max(item.bid.length-6,0), -1).map((usernumber,index)=>{
                        return (
                          <span key={JSON.stringify(index)} className="line-through lowercase font-light">{usernumber['$numberDecimal'].toLocaleString()}, </span>
                          
                        )
                      }) 
                    
                  }</th> 
                  <td className="border border-slate-300 px-6 py-3">{ item.bid[item.bid.length - 1]['$numberDecimal'].toLocaleString()}</td>          
                  <td className="border border-slate-300 px-6 py-3">{ item.updated.slice(11,23) }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        
      )

      }
       
    }
  }
  //Handle the submission button
  const handleSubmit = async () => {
    
  if (auctiontype()==="sealedfirstprice") {
    console.log(calculateWinner(gameData).userwinner)
    if (typeof calculateWinner(gameData).userwinner !== 'undefined' && calculateWinner(gameData).userwinner.length > 0) {
     
      var userwinner = calculateWinner(gameData).userwinner[0];
      var winningbid = calculateWinner(gameData).winningbid[0];
      var averagebid = calculateWinner(gameData).averagebid[0];
    } else {
      var userwinner = "";
      var winningbid = 0;
      var averagebid = 0;
    }
} else {
  if (typeof calculateWinner(gameData).userwinner !== 'undefined' && calculateWinner(gameData).userwinner.length > 0) {
    var userwinner = calculateWinner(gameData).userwinner[0];
    var winningbid = calculateWinner(gameData).winningbid[0];
    var averagebid = calculateWinner(gameData).averagebid[0];
  } else {
    var userwinner = "";
    var winningbid = 0;
    var averagebid = 0;
  }
    

}



      try {
      const res = await fetch('api/endGame', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({userwinner, winningbid, averagebid})
    });   
    if (res.ok) {
       
        setError("");
        
        //router.push("/");
    } else {
        console.log("Submission failed")
    }
      
    } catch (error) {
      console.log("Error when submission:", error) 
    }
   
  };
  //Render the form and public info
  

  const renderForm = () => {
    const userNumBid = (typeof userGameData().bid === 'undefined')? 0: userGameData().bid.length;
    return (
      isactive() === 'active'? <div className="grid place-items-center h-screen">
       
      <div >                   
          <button onClick={handleSubmit} className="bg-green-600 text-white font-bold cursor-pointer px-2 py-2">
            End the game
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}     
      </div>
     
    </div> : <div className="grid place-items-center p-20">The game&apos;winner is {getWinner()}  <br />
    The winning bid is {getWinningBids()}
    <br />
    The common valuation is {max}.
    <br />
    The payoff for the winner is {parseFloat(getWinningBids())-parseFloat(max)}.        
    </div>
    );
  }

  return (
    <div> 
         <NavBar />
         <div className="grid place-items-center p-10">
          <h1 className="font-semibold text-xl"> Welcome {useremail} to game management portal !</h1>
          <div>
        {isactive()==="active" ? (auctiontype()==="open"? "The open auction is active" : (auctiontype()==="dutch"? "The dutch auction is active":"The first price sealed auction is active")):""}
        </div>
        <div>
              <CountdownTimer targetDate={targetTime} />
          </div>
          <HistogramChart props={bidlist} max = {max*multiplier + 1} min = {min}/>    
          {renderForm()}
          {renderPublicInfo(gameData)}     
        </div>
           
      
      
    </div>
    
  );
}