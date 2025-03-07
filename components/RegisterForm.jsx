"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "./NavBar";
export default function RegisterForm() {
    
    //const [name, setName] = useState("");
    //const [email, setEmail] = useState("");
    //const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    //const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [registerForm, setRegisterForm] = useState(
        {
            name: "",
            email: "",
            password: "",
            isadmin: false,
        }
    )
    const handleChange = (event) => {
       const {name, value, type, checked} = event.target;
       setRegisterForm( preRegisterForm => {
        return {
            ...preRegisterForm, [name]: type === "checkbox" ? checked : value
        }
       })

    }
    const handleSubmit = async(e) => {
        //Prevent refresh
        e.preventDefault();
        console.log(registerForm);
        const {name, email, password, } = registerForm;        
        const role = registerForm.isadmin === false ? "user": "admin";
        if (!registerForm.name || !registerForm.email || !registerForm.password || !role) {
            setError("All fields neccessary");
            return;
        }
        try {

            const resUserExists = await fetch('api/userExists', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({email})

            })

            const { user } = await resUserExists.json();
            
            if (user) {
                setError("User already exists");
                return;
            }

            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({name, email, password, role}),
            });
            if (res.ok) {
                const form = e.target;
                form.reset();
                //router.push("/submitbid");
            } else {
                console.log("User Registration failed")
            }
        } catch (error) {
            console.log("Error when registration:", error)            
        }

    }

    const renderForm = () =>{
        return (
            <div className="grid place-items-center h-screen">
       <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
         <h1 className="text-xl font-bold my-4">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input onChange={handleChange} type="text" placeholder="Full Name" name="name" /*value={registerForm.name}*/></input>
                <input onChange={handleChange} type="text" placeholder="Email" name="email" /*value={registerForm.email}*/></input>
                <input onChange={handleChange} type="password" placeholder="Password" name="password" /*value={registerForm.password}*/></input>
                <div className="flex flex-row justify-content-centerx`">
                <input type="checkbox" checked={registerForm.isadmin} id="isAdmin" onChange={handleChange} name="isadmin" ></input>
                <label htmlFor="isAdmin">Is an admin?</label>
                </div>
               
                <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Register</button>
            </form>
            {error && (<div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
            </div>)}
            <Link className="text-sm mt-3 text-right" href={"/"}>
                Already have an account ? <span className="underline">
                    Login
                </span>
            </Link>
       </div>
    </div>
        )
    }

    return (
        <div>
            <NavBar />
                {renderForm()}
        </div>
    ) 
}