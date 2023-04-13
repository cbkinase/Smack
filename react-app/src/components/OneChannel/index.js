import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { OneChannelThunk } from '../../store/channel';

function OneChannel() {
    const { channelId } = useParams()
    const dispatch = useDispatch()
    const channels = useSelector(state => state.channels)
    const history = useHistory()
    const [oneChannel, setOneChannel] = useState(null)

    useEffect(() => {
        dispatch(OneChannelThunk(channelId))
    }, [dispatch])

    useEffect(() => {
        if (channels.single_channel) {
            setOneChannel(channels.single_channel)
        }
    }, [channels])

    const createroute = (e) => {
        e.preventDefault();
        history.push('/create')
    }

    const editroute = (e) => {
        e.preventDefault();
        history.push(`/${channelId}/edit`)
    }

    return (
        <div>
            {oneChannel && <h1>{oneChannel.name}</h1>}
            <div>
                <button style={{ width: "80px", padding: "4px"}} onClick={createroute}><i className="fa fa-newspaper-o"></i> Create</button>
                <button style={{ width: "80px", padding: "4px"}}><i className="fa fa-newspaper-o"></i> Edit</button>
                <button style={{ width: "80px", padding: "4px"}} onClick={editroute}><i className="fa fa-newspaper-o"></i> Update</button>
            </div>
        </div>
    )
}

export default OneChannel