export default function isSelfDM(channel, user) {
    if (!channel.is_direct) return false
    let memberObj = channel.Members
    let new_obj = JSON.parse(JSON.stringify(memberObj));
    delete new_obj[user.id]
    let obj_arr = Object.values(new_obj)
    return obj_arr.length === 0
  }
