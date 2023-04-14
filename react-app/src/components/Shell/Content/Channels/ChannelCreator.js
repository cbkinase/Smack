// import { useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { AddChannelThunk } from '../../../../store/channel'

// const CreateChannel = () => {

//     const [name, setName] = useState(null)
//     const [subject, setSubject] = useState(null)
//     const [is_private, setIsPrivate] = useState(null)
//     const [is_direct, setIsDirect] = useState(null)
//     const [errors, setErrors] = useState([]);
//     const dispatch = useDispatch();
//     const history = useHistory();

//     let created;

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setErrors([]);
//         created = dispatch(AddChannelThunk({ name: name, subject: subject, is_private: Boolean(is_private), is_direct: Boolean(is_direct) }))
//         if (!created.errors) { (history.push(`/`)) }
//     }

//     return (
//         <div style={{ margin: '20px', padding: '10px', border: '1px solid #cccccc' }}>
//             Channel Creater:<br /><br />
//             <ul>
//                 {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}</li>)}
//             </ul>
//             <span>NAME</span>
//             <label htmlFor="name"></label>
//             <input type="text" id="name" placeholder="NAME"
//                 value={name} onChange={(e) => setName(e.target.value)}></input>
//             <span>SUBJECT</span>
//             <label htmlFor="subject"></label>
//             <input type="text" id="subject" placeholder="SUBJECT"
//                 value={subject} onChange={(e) => setSubject(e.target.value)}></input>
//             <span>PRIVATE?</span>
//             <label htmlFor="isprivate"></label>
//             <select name="private" id="isprivate" value={is_private} onChange={(e) => setIsPrivate(e.target.value)}>
//                 <option disabled selected>(select one)</option>
//                 <option value={true}>PRIVATE</option>
//                 <option value={false}>PUBLIC</option>
//             </select>
//             <span>DIRECT?</span>
//             <label htmlFor="isdirect"></label>
//             <select name="direct" id="isdirect" value={is_direct} onChange={(e) => setIsDirect(e.target.value)}>
//                 <option disabled selected>(select one)</option>
//                 <option value={true}>PRIVATE</option>
//                 <option value={false}>PUBLIC</option>
//             </select>
//             <button onClick={handleSubmit}>Create channel</button>
//         </div>
//     )

// }

// export default CreateChannel
