import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/session";
import OpenModalButton from "../../OpenModalButton";
import LoginFormModal from "../../LoginFormModal";
import SignupFormModal from "../../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  // ###### EDIT USER ######

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const handleEditUser = async (e) => {
    // e.preventDefault();
    // const data = await dispatch(login(email, password));
    // if (data) {
    //   setErrors(data);
    // }
  };


  return (

    <>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="topright-avatar-btn" onClick={openMenu}>
          <img style={{ borderRadius: '4px', width: '26px', height: '26px' }} src={user.avatar} alt={user.first_name + " " + user.last_name} />
        </button>

        <div className={ulClassName} ref={ulRef} style={{ padding: '0px', margin: '0px' }}>

          {/* =================== */}
          {/* VIEW USER INFO */}
          <div style={{ display: 'none' }}>
            <div className="profile-popup" style={{ padding: '12px 0px 2px 0px', margin: '0px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0px', margin: '0px' }}>

                  <div style={{ padding: '0px', margin: '0px' }}><img style={{ borderRadius: '4px', width: '38px', height: '38px' }} src={user.avatar} alt={user.first_name + " " + user.last_name} /></div>
                  <div style={{ padding: '0px', margin: '0px 0px 0px 10px', fontWeight: 700 }}>{user.first_name} {user.last_name}</div>

                </div>

                <div><button className="edit-user-btn">Edit</button></div>

              </div>

              <div>{user.email}</div>
              <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 14px 0px', padding: '0px' }}></div>
              <div>{user.bio}</div>
              <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 0px 0px', padding: '0px' }}></div>
              <div><button className="logout-btn" onClick={handleLogout}>Sign out of Smack</button></div>

            </div>
          </div>
          {/* =================== */}

          {/* =================== */}
          {/* EDIT USER INFO */}
          <div style={{ display: 'block' }}>
            <div className="profile-popup" style={{ padding: '12px 0px 2px 0px', margin: '0px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0px', margin: '0px' }}>

                  <div style={{ padding: '0px', margin: '0px' }}><img style={{ borderRadius: '4px', width: '38px', height: '38px' }} src={user.avatar} alt={user.first_name + " " + user.last_name} /></div>
                  <div style={{ padding: '0px', margin: '0px 0px 0px 10px', fontWeight: 700 }}>{user.first_name} {user.last_name}</div>

                </div>

              </div>
              <form onSubmit={handleEditUser}>
                <input className="login-input-field" type="text" value={avatar} onChange={(e) => setFirstName(e.target.value)} placeholder={user.avatar}
                  required />
                <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 14px 0px', padding: '0px' }}></div>
                <input className="login-input-field" type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} placeholder={user.first_name}
                  required />
                <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 14px 0px', padding: '0px' }}></div>
                <input className="login-input-field" type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} placeholder={user.last_name}
                  required />
                <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 14px 0px', padding: '0px' }}></div>
                <div>{user.bio}</div>
                <div style={{ borderTop: '1px solid #cfcfcf', margin: '14px 0px 0px 0px', padding: '0px' }}></div>

                <div><button className="save-useredit-btn" type="submit" onClick={handleLogout}>Save</button></div>
              </form>
            </div>
          </div>
          {/* =================== */}

        </div>

      </div>


    </>


  );
}


export default ProfileButton;
