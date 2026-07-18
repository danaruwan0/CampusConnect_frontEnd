import "./reactionBar.css";

import {
    FaRegThumbsUp,
    FaHeart,
    FaLaughSquint,
    FaRegCommentDots
} from "react-icons/fa";


import {
    reactPost,
    removeReaction
} from "../../api/postApi";


import { useState } from "react";


export default function ReactionBar({
    post,
    onComment,
    onReact
}) {


    const userId =
        Number(localStorage.getItem("userId"));


    const [selectedReaction, setSelectedReaction] =
        useState(null);



    const handleReaction = async(type)=>{


        try{


            if(selectedReaction === type){


                await removeReaction(
                    post.postId,
                    userId
                );


                setSelectedReaction(null);


            }

            else{


                await reactPost(
                    post.postId,
                    userId,
                    type
                );


                setSelectedReaction(type);


            }


            // refresh profile data
            if(onReact){
                onReact(
                    post.postId,
                    type
                );
            }


        }

        catch(err){

            console.log(err);

        }


    };




    return (

        <div className="reaction-bar">


            <button

                className={
                    selectedReaction==="LIKE"
                    ?
                    "reaction-btn active"
                    :
                    "reaction-btn"
                }

                onClick={()=>
                    handleReaction("LIKE")
                }

            >

                <FaRegThumbsUp/>

                <span>
                    Like
                </span>

            </button>




            <button

                className={
                    selectedReaction==="LOVE"
                    ?
                    "reaction-btn active"
                    :
                    "reaction-btn"
                }


                onClick={()=>
                    handleReaction("LOVE")
                }

            >

                <FaHeart/>

                <span>
                    Love
                </span>

            </button>




            <button

                className={
                    selectedReaction==="HAHA"
                    ?
                    "reaction-btn active"
                    :
                    "reaction-btn"
                }


                onClick={()=>
                    handleReaction("HAHA")
                }

            >

                <FaLaughSquint/>

                <span>
                    Haha
                </span>

            </button>




            <button

                className="reaction-btn"

                onClick={onComment}

            >

                <FaRegCommentDots/>

                <span>
                    Comment
                </span>

            </button>



        </div>

    );

}