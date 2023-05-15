export default function userObjectToNameList(obj, currUserId) {
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
   delete new_obj[currUserId]
    return Object.values(new_obj)
    .map((user) =>`${user.first_name} ${user.last_name}`)
    .join(", ")
}
