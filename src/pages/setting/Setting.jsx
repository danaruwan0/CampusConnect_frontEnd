import React, { useEffect, useState } from "react";
import "./setting.css";

import {
    FiInfo,
    FiRefreshCw,
    FiGlobe,
    FiSun,
    FiShield,
    FiFileText,
    FiHelpCircle,
    FiLock,
    FiChevronRight,
    FiChevronDown,
    FiMail
} from "react-icons/fi";

import defaultProfile from "../../assets/Default profile.jpg";

import { getProfile } from "../../api/profileApi";

import { useNavigate } from "react-router-dom";


export default function Setting(){


const navigate = useNavigate();


const userId = Number(localStorage.getItem("userId"));


const [profile,setProfile] = useState(null);


const [open,setOpen] = useState("");



useEffect(()=>{

loadProfile();

},[]);



const loadProfile = async()=>{

try{

const data = await getProfile(userId);

setProfile(data);

}

catch(err){

console.log(err);

}

};



const toggle=(name)=>{


setOpen(
open === name ? "" : name
);


};





return(

<div className="setting-page">



<div className="setting-header">


<h1>
Settings
</h1>


<p>
Customize your CampusConnect experience, manage your account, and control your privacy preferences.
</p>


</div>








{/* ACCOUNT */}



<div className="setting-card">


<h2>
Account
</h2>



<div
className="account-box"
onClick={()=>navigate("/profile")}
>


<img

src={
profile?.profileImage || defaultProfile
}

onError={(e)=>e.target.src=defaultProfile}

/>



<div>

<h3>
{profile?.fullName || "CampusConnect User"}
</h3>


<p>
{profile?.email || "student@campusconnect.com"}
</p>


<span>
View Profile
</span>


</div>



<FiChevronRight/>

</div>


</div>









{/* APPLICATION */}



<div className="setting-card">


<h2>
Application
</h2>



<div className="setting-item">

<div className="setting-left">

<FiInfo/>


<div>

<h3>
App Version
</h3>


<p>
CampusConnect v1.0v
</p>


</div>

</div>


</div>





<div className="setting-item">


<div className="setting-left">

<FiRefreshCw/>


<div>

<h3>
Application Update
</h3>


<p>
Your app is running latest version
</p>


</div>


</div>



<FiChevronRight/>


</div>




</div>









{/* PREFERENCE */}



<div className="setting-card">


<h2>
Preferences
</h2>





<div className="setting-item">


<div className="setting-left">

<FiGlobe/>


<div>

<h3>
Language
</h3>


<p>
English (Default)
</p>


</div>


</div>



<select>

<option>
English
</option>


<option disabled>
Sinhala (Coming Soon)
</option>


<option disabled>
Tamil (Coming Soon)
</option>


</select>


</div>






<div className="setting-item">


<div className="setting-left">

<FiSun/>


<div>

<h3>
Theme
</h3>


<p>
Light mode enabled
</p>


</div>


</div>



<select>


<option>
Light
</option>


<option disabled>
Dark (Coming Soon)
</option>


</select>



</div>


</div>









{/* SECURITY */}



<div className="setting-card">


<h2>
Security & Privacy
</h2>






{/* PRIVACY */}


<div 
className="accordion-item"

onClick={()=>toggle("privacy")}

>


<div className="setting-left">


<FiShield/>


<div>

<h3>
Privacy Policy
</h3>


<p>
Learn how we protect your data
</p>


</div>


</div>



{

open==="privacy"

?

<FiChevronDown/>

:

<FiChevronRight/>

}


</div>




{
open==="privacy"

&&

<div className="accordion-content">


<h4>
Your Privacy Matters
</h4>


<p>

CampusConnect respects your privacy and protects your personal information.

</p>


<p>

We collect only required information such as your profile details, posts, messages, and account activities to provide better services.

</p>


<p>

Your personal information is never sold or shared with unauthorized third parties.

</p>


</div>

}









{/* SECURITY */}



<div

className="accordion-item"

onClick={()=>toggle("security")}

>


<div className="setting-left">


<FiLock/>


<div>

<h3>
Account Security
</h3>


<p>
Password and login protection
</p>


</div>


</div>



{

open==="security"

?

<FiChevronDown/>

:

<FiChevronRight/>

}


</div>





{

open==="security"

&&


<div className="accordion-content">


<h4>
Keep Your Account Safe
</h4>


<p>

Use a strong password and avoid sharing your login information with others.

</p>


<p>

CampusConnect provides secure authentication to protect your account access.

</p>


<p>

If you notice suspicious activity, contact our support team immediately.

</p>


</div>


}









{/* TERMS */}




<div

className="accordion-item"

onClick={()=>toggle("terms")}

>


<div className="setting-left">


<FiFileText/>


<div>


<h3>
Terms & Conditions
</h3>


<p>
Read CampusConnect usage rules
</p>


</div>


</div>



{

open==="terms"

?

<FiChevronDown/>

:

<FiChevronRight/>

}


</div>





{

open==="terms"

&&


<div className="accordion-content">


<h4>
CampusConnect Terms
</h4>


<p>

Users must provide accurate information when creating an account.

</p>


<p>

Users should respect other students and avoid harmful or inappropriate content.

</p>


<p>

CampusConnect reserves the right to improve services and update platform policies.

</p>


</div>


}



</div>









{/* SUPPORT */}



<div className="setting-card">


<h2>
Support
</h2>




<div className="accordion-item">


<div className="setting-left">


<FiMail/>


<div>


<h3>
Support Email
</h3>


<p>
campusconnect@gmail.com
</p>


</div>


</div>


</div>







<div className="accordion-item">


<div className="setting-left">


<FiHelpCircle/>


<div>

<h3>
Help Center
</h3>


<p>
Get assistance from CampusConnect team
</p>


</div>


</div>



</div>




</div>







</div>


);


}