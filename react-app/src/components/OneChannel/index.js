import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { OneChannelThunk, DeleteChannelThunk } from '../../store/channel';

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

    let deleted;

    const deleteroute = (e) => {
        e.preventDefault();
        deleted = dispatch(DeleteChannelThunk(channelId))
        if (!deleted.errors) { (history.push(`/`)) }
    }

    return (

        <div style={{ margin: '20px', padding: '10px', border: '1px solid #cccccc' }}>
            {oneChannel && <h1>{oneChannel.name}</h1>}
            <div>
                <button style={{ width: "80px", padding: "4px" }} onClick={createroute}><i className="fa fa-newspaper-o"></i> Create</button>
                <button style={{ width: "80px", padding: "4px" }} onClick={editroute}><i className="fa fa-newspaper-o"></i> Edit</button>
                <button style={{ width: "80px", padding: "4px" }} onClick={deleteroute}><i className="fa fa-newspaper-o"></i> Delete</button>
            </div>
        </div>
    )
}

export default OneChannel
