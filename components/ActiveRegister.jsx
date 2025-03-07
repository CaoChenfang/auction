"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EndGame from "./EndGame";
import { signOut } from "next-auth/react";
import NavBarUser from "./NavBarUser";

export default function ActiveRegister() {

  
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [game, setGame] = useState();
  const [gameData, setGameData] = useState();
  const role = session?.user?.role
  const userEmail = session?.user?.email;
  //The first part is to connect to the server to find out the active game. 
  //Handle the submission button
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

    //async function getGameData() {
     // const res = await fetch('api/getGameData');
     // const resgameData = await res.json();
     // setGameData(resgameData);
   // }
   const interval = setInterval(async () => {
   
    await getGameData();
    await getGame();
  }, 2 * 1000);
    

  return () => clearInterval(interval)
    //getGameData();

  }, []);

  const isactive = () => {
    if (typeof(game) !=="undefined") {
      if (game.length > 0) {
        return game[game.length - 1].isactive;
      } else {
        return "ended";
      }
    } else {
        return "ended";
    }
  }
  //Get the max, min data
  
  const userData = typeof(gameData) !== "undefined"? gameData.filter(x => x.email == userEmail) : [];
  const max = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].max["$numberDecimal"]:0): 0;
  const min = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].min["$numberDecimal"]:0): 0;
  const signal = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].signalvariance["$numberDecimal"]:0): 0;
  const multiplier = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].multiplier["$numberDecimal"]:0): 0;
  //Get type of sample mode 

  //Render usertype and valuation
  
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
  //Render the inactive game
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Randomly create a value
    //Randomly create a value
    const resUserExists = await fetch('api/activeUserExists', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({userEmail})
  
    })
  
    const { user } = await resUserExists.json();
    console.log(userEmail)
    console.log(user)
    
    if (user) {
        setError("User already exists");
        return;
    }
    
  console.log(typeof(max))
  console.log(typeof((Math.random()- 0.5)* 2 * signal))    
  var assignedValue = parseInt(max) + (Math.random()- 0.5)* 2 * parseInt(signal);
  console.log(assignedValue) 
    
   try {
        const res = await fetch('api/activeRegister', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({userEmail, assignedValue})
      });
     
      if (res.ok) {
          const form = e.target;
          form.reset();
          setError("");
          
          //router.push("/");
      } else {
          console.log("Submission failed");
      }
  
        
      } catch (error) {
        console.log("Error when submission:", error);
      }  
      
    }   
  ;
  //Render the instruction for each type of game
  const renderInstruction = () => {
    
      return (<div className="mx-24 bg-green-200">
        <h3 className="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p className="p-4 text-left">
        You need to register as an active user. Upon registering, the system will randomly assign <br />
        you a valuation of the asset.
              
        </p>
      </div>);    
  }
  //Render the form and public info

  const renderForm = () => {    
    return (
      <div>
        <NavBarUser />
        <div className="grid place-items-center h-screen">
        <div>
          Welcome {userEmail}. 
        </div>
        <div>
          {renderInstruction()}
        </div>
        {isactive()==="active"? (  renderUserValuation() ? <div className="text-xl">You have registered. Your valuation is {renderUserValuation()}. You can bid now</div>: <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register as an active user</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <fieldset>
                <legend>Click to register.</legend>
                           
                <br />                
            </fieldset>          
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>): (<div className="grid place-items-center text-xl">
        There is no active game to register
      </div>)}
    </div>
  </div> );
  }

  return (
    <div> 
      {role ==='admin'? <EndGame /> : renderForm()}
    </div>
  );
}