import { useState } from "react"
import { Link } from "react-router-dom";
const Landing = ()=>{
    const [name,setName] = useState(""); 
    const handler = ()=>{
        
    }
    return(<div>
        <input type="text"onChange={(e)=>{setName(e.target.value)}}/>
        <Link to={`/room?name=${name}`} onClick={()=>{}}>Join</Link>
    </div>)
}

export default Landing;