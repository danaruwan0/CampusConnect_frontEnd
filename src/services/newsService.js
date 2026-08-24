import api from "../api/axios";

export const getNews = async(category)=>{

    const res = await api.get(
        `/api/news/${category}`
    );

    return res.data;

};



export const searchNews = async(keyword)=>{

    const res = await api.get(
        `/api/news/search?keyword=${keyword}`
    );

    return res.data;

};