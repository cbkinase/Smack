import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch} from 'react-redux'
import { AddChannelThunk } from '../../../../store/channel'

const CreateChannel = () => {

    const [name, setName] = useState(null)
    const [subject, setSubject] = useState(null)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let created;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        created = dispatch(AddChannelThunk({ name: name, subject: subject, is_private: false, is_direct: false }))
        // should be to specific channel id of newly created channel
        if (!created.error) { (navigate(`/channels/explore`)) }
    }

    return (
        <div style={{ margin: '20px', padding: '10px', border: '1px solid #cccccc' }}>
            Channel Creater:<br /><br />
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="signuperror">{error}</li>)}
            </ul>
            <span>NAME</span>
            <label htmlFor="name"></label>
            <input type="text" id="name" placeholder="NAME"
                value={name} onChange={(e) => setName(e.target.value)}></input>
            <span>SUBJECT</span>
            <label htmlFor="subject"></label>
            <input type="text" id="subject" placeholder="SUBJECT"
                value={subject} onChange={(e) => setSubject(e.target.value)}></input>
            <button onClick={handleSubmit}>Create channel</button>
        </div>
    )

}

export default CreateChannel
