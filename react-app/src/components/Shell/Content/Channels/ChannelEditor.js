import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { EditChannelThunk } from '../../../../store/channel'
import { DeleteChannelThunk } from '../../../../store/channel'

const EditChannel2 = () => {

    const { channelId } = useParams()
    const [name, setName] = useState(null)
    const [subject, setSubject] = useState(null)
    const [is_private, setIsPrivate] = useState(false)
    const [is_direct, setIsDirect] = useState(false)
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    let edited;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        edited = dispatch(EditChannelThunk(channelId, { name: name, subject: subject, is_private: Boolean(is_private), is_direct: Boolean(is_direct) }))
        if (!edited.errors) { (history.push(`/channels/${channelId}`)) }
    }


    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(DeleteChannelThunk(channelId));
        return history.push(`/channels/explore`)
    }
    return (
        <div style={{ margin: '20px', padding: '10px', border: '1px solid #cccccc' }}>
            Channel Editor:<br /><br />
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
            {/* <span>PRIVATE?</span>
            <label htmlFor="isprivate"></label>
            <select name="private" id="isprivate" value={is_private} onChange={(e) => setIsPrivate(e.target.value)}>
                <option disabled selected>(select one)</option>
                <option value={true}>PRIVATE</option>
                <option value={false}>PUBLIC</option>
            </select>
            <span>DIRECT?</span>
            <label htmlFor="isdirect"></label>
            <select name="direct" id="isdirect" value={is_direct} onChange={(e) => setIsDirect(e.target.value)}>
                <option disabled selected>(select one)</option>
                <option value={true}>PRIVATE</option>
                <option value={false}>PUBLIC</option>
            </select> */}
            <button onClick={handleSubmit}>Edit channel</button>

            <button onClick={handleDelete}>Delete channel</button>
        </div>
    )

}

export default EditChannel2
