import {useSearchParams} from "react-router-dom"

const Room = ()=>{
    const [searchParams,setSearchParams] = useSearchParams();
    const name =searchParams.get('name');

    return(<div>
        Hi {name}
    </div>)
}

export default Room 