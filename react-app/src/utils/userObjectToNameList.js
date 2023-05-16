export default function userObjectToNameList(obj, currUser) {
    /* Takes in an object that looks like
    {"1" :
        {"avatar": "", "first_name": "", "last_name": ""},
    "2" :
        { ... },
    }

    And converts it into a string where the the first and last names of
    all non-self users are comma separated.

    */
   let new_obj = JSON.parse(JSON.stringify(obj));
   delete new_obj[currUser.id]
   let obj_arr = Object.values(new_obj)
   if (obj_arr.length === 0) {
    return `${currUser.first_name} ${currUser.last_name} (You)`
   }
    return obj_arr
    .map((user) =>`${user.first_name} ${user.last_name}`)
    .join(", ")
}
