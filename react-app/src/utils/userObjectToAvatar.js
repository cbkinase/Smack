export default function userObjectToAvatar(obj, currUser) {
    /*

    Takes in an object that looks like
    {"1" :
        {"avatar": "", "first_name": "", "last_name": ""},
    "2" :
        { ... },
    }

    And returns some JSX to help render the proper icon on the
    left sidebar for direct messages depending on the number of users.

    */
    let new_obj = JSON.parse(JSON.stringify(obj));
    delete new_obj[currUser.id]

    let obj_arr = Object.values(new_obj)

    // This is the avatar we will render when a DM has only 1 other participant

    if (obj_arr.length === 1) {
        return (
            <span><img src={obj_arr[0].avatar} alt="DM" style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
        )
    }

    if (obj_arr.length === 0) {
        // In this case, this is a "self" DM.
        return (
        <span><img src={currUser.avatar} alt="DM" style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
        )

    }

    // Figure out what to do for multi-person DMs later
    // For now:
    // Render the first avatar

    return (
        <span><img src={obj_arr[0].avatar} alt="DM" style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
    )

}
