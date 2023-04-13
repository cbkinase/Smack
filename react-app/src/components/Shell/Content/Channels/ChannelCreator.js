import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AddChannelThunk } from '../../../../store/channel'

const CreateChannel = () => {

    const [name, setName] = useState(null)
    const [subject, setSubject] = useState(null)
    const [is_private, setIsPrivate] = useState(null)
    const [is_direct, setIsDirect] = useState(null)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(AddChannelThunk({ name, subject, is_private, is_direct })).then(history.push(`/`))
        .catch(async (res) => {
            const data = await res.json();
            console.log(data, data.errors)
            if (data && data.errors) setErrors(data.errors);
          })
    }

    return (
        <div>
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}</li>)}
            </ul>
            <span>NAME</span>
            <label for="name"></label>
            <input type="text" id="name" placeholder="NAME"
                value={name} onChange={(e) => setName(e.target.value)}></input>
            <span>SUBJECT</span>
            <label for="subject"></label>
            <input type="text" id="subject" placeholder="SUBJECT"
                value={subject} onChange={(e) => setSubject(e.target.value)}></input>
            <span>PRIVATE?</span>
            <label for="isprivate"></label>
            <select name="private" id="isprivate" value={is_private} onChange={(e) => setIsPrivate(e.target.value)}>
                <option value="" disabled selected>(select one)</option>
                <option value={true}>PRIVATE</option>
                <option value={false}>PUBLIC</option>
            </select>
            <span>DIRECT?</span>
            <label for="isdirect"></label>
            <select name="direct" id="isdirect" value={is_direct} onChange={(e) => setIsDirect(e.target.value)}>
                <option value="" disabled selected>(select one)</option>
                <option value={true}>PRIVATE</option>
                <option value={false}>PUBLIC</option>
            </select>
            <button onClick={handleSubmit}>Create channel</button>
        </div>
    )

}

export default CreateChannel