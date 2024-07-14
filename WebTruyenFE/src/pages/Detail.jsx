import { useParams } from "react-router-dom"
import { NovelDetail } from "../components/novelDetail"
import { signal, useSignal } from "@preact/signals-react"
import { useEffect, useState } from "react"
import { callApiFEGet } from "../apis/service"
import { GetStoryDetail } from "../apis/apis"

export const Detail = () => {
    const [novelDetail, setDetail] = useState({})
    const params = useParams()
    const id = params.id
    const setNovel = async()=>{
        callApiFEGet(GetStoryDetail, id).then((response) => setDetail(response))
    }
    useEffect(() => {
        setNovel()
    },[])

    return <>
    <NovelDetail novel={novelDetail} setNovel={setNovel}/>
    </>
}