import React, { useEffect, useState } from 'react';
import login_logo from '../data/assets/login_logo.svg';
import overview from '../data/assets/overview.svg';
import overview2 from '../data/assets/overview_hover.svg';
import Calendar from '../data/assets/Calendar.svg';
import Calendar2 from '../data/assets/Calendar_hover.svg';
import settings from '../data/assets/settings.svg';
import settings2 from '../data/assets/settings_hover.svg';
import search from '../data/assets/search.svg';
import notificaton from '../data/assets/notificaton.svg';
import { BoardContainer } from '../components/Board/styles';
import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Modal, Popover } from 'antd';
import SideModal from '../components/leavePopup/index'
import Notification from "../components/leavePopup/notification";
import share from '../data/assets/share.svg';

const Board = () => {

    const [popup, setPopup] = useState(false)
    const [sideToggle, setSideToggle] = useState(1)
    const [getDatas, setGetDatas] = useState('');

    let userData = JSON.parse(localStorage.getItem('userData'))
    console.log(userData)

    useEffect(() => {
        setGetDatas(JSON.parse(localStorage.getItem("leave_records")))
    }, [])



    return (
        <BoardContainer>
            <div id="BoardContainer" >
                <div id="side_menu">
                    <h1><img src={login_logo} alt="img" />Leave Tracker</h1>
                    <ul>
                        <li className={sideToggle === 1 ? "active" : ""} onClick={() => setSideToggle(1)}><img src={sideToggle === 1 ? overview2 : overview} alt="img" />Home</li>
                        <li className={sideToggle === 3 ? "active" : ""} onClick={() => setSideToggle(3)}><img src={sideToggle === 3 ? Calendar2 : Calendar} alt="img" />Calendar</li>
                    </ul>
                    <ul>
                        <li className={sideToggle === 2 ? "active" : ""} onClick={() => setSideToggle(2)}><img src={sideToggle === 2 ? settings2 : settings} alt="img" />Settings</li>
                    </ul>
                </div>
                <div id="main_menu" style={{ background: sideToggle === 1 ? 'white' : '#FCFAFA' }}>
                    <div id="header">
                        <h2 id="title">{sideToggle === 1 ? "Home" : sideToggle === 2 ? "Settings" : sideToggle === 3 ? "Calendar" : ""}</h2>
                        <div id="mini_block">
                            {sideToggle === 1 ? <button onClick={() => setPopup(true)}>Apply Leave</button> : ""}
                            <img src={search} alt="img" id="search" />
                            <Popover placement="bottomRight" content={<Notification />} style={{ position: 'relative' }}>
                                <img src={notificaton} alt="img" id="notificaton" />
                            </Popover>

                            <div id="mini_block_name">
                                <p>{userData.user.displayName}</p>
                                <img src={userData.user.photoURL} alt="img" id="profile" />
                            </div>
                        </div>
                    </div>

                    {sideToggle === 1 ?
                        <>
                            <div id="score">
                                <div id="score_card">
                                    <h2 id="score">{16 - getDatas.length}</h2>
                                    <p>Available Leaves</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">08</h2>
                                    <p>Previous unused Leaves</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">0{getDatas.length}</h2>
                                    <p>Pending Leaves Requests</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">02</h2>
                                    <p>Rejected Leaves</p>
                                </div>
                            </div>

                            <div id="message">
                                <div id="message_block1">
                                    <h3>SNo</h3>
                                    <h3>Type</h3>
                                    <h3>From</h3>
                                    <h3>To</h3>
                                    <h3>Reason</h3>
                                    <h3>Status</h3>
                                    <h3>Action</h3>
                                </div>
                                {getDatas ?
                                    <div id="message_block2">
                                        {getDatas.map((item, i) =>
                                            <div id="task_container" key={i}>
                                                <p>{i + 1}</p>
                                                <p>{item.leaveType}</p>
                                                <p>{item.from}</p>
                                                <p>{item.to}</p>
                                                <p>{item.reason}</p>
                                                <p style={{ color: '#CB5A08', fontWeight: '600' }}>Pending</p>
                                                <p><DeleteOutlined className='delete_icon' /></p>
                                            </div>
                                        )}

                                    </div>
                                    :
                                    <div id="message_blocks">
                                        <p>No Leaves Applied</p>
                                    </div>
                                }
                            </div>
                        </>
                        :
                        ""
                    }


                    {sideToggle === 2 ?
                        <div id="admin">
                            <div id="admin_block1">
                                <h1>Leave Requests</h1>
                                <p id="share"><img src={share} alt="share" />Share</p>
                            </div>
                            <div id="admin_tab">
                                <h2>All</h2>
                                <h2>Approve</h2>
                                <h2>Pending</h2>
                            </div>
                            <div id="message">
                                <div id="message_block1">
                                    <h3>SNo</h3>
                                    <h3>Name & ID</h3>
                                    <h3>Date</h3>
                                    <h3>Leave Type</h3>
                                    <h3>Reason</h3>
                                    <h3>Action</h3>
                                </div>
                                <div id="message_block2">
                                    <div id="task_container">
                                        <p>1</p>
                                        <div id="profile_box">
                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                            <div id="profile_text">
                                                <h2>Vignesh</h2>
                                                <p>FCHN017</p>
                                            </div>
                                        </div>
                                        <p>25 Feb to 26 Feb, 2022</p>
                                        <p>CL</p>
                                        <p>Friend???s wedding celebration</p>
                                        <div id="btns">
                                            <button>Approve</button>
                                            <button>Reject</button>
                                        </div>
                                    </div>
                                    <div id="task_container">
                                        <p>1</p>
                                        <div id="profile_box">
                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                            <div id="profile_text">
                                                <h2>Vignesh</h2>
                                                <p>FCHN017</p>
                                            </div>
                                        </div>
                                        <p>25 Feb to 26 Feb, 2022</p>
                                        <p>CL</p>
                                        <p>Friend???s wedding celebration</p>
                                        <div id="btns">
                                            <button>Approve</button>
                                            <button>Reject</button>
                                        </div>
                                    </div>
                                    <div id="task_container">
                                        <p>1</p>
                                        <div id="profile_box">
                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                            <div id="profile_text">
                                                <h2>Vignesh</h2>
                                                <p>FCHN017</p>
                                            </div>
                                        </div>
                                        <p>25 Feb to 26 Feb, 2022</p>
                                        <p>CL</p>
                                        <p>Friend???s wedding celebration</p>
                                        <div id="btns">
                                            <button>Approve</button>
                                            <button>Reject</button>
                                        </div>
                                    </div>
                                    <div id="task_container">
                                        <p>1</p>
                                        <div id="profile_box">
                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                            <div id="profile_text">
                                                <h2>Vignesh</h2>
                                                <p>FCHN017</p>
                                            </div>
                                        </div>
                                        <p>25 Feb to 26 Feb, 2022</p>
                                        <p>CL</p>
                                        <p>Friend???s wedding celebration</p>
                                        <div id="btns">
                                            <button>Approve</button>
                                            <button>Reject</button>
                                        </div>
                                    </div>
                                    <div id="task_container">
                                        <p>1</p>
                                        <div id="profile_box">
                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                            <div id="profile_text">
                                                <h2>Vignesh</h2>
                                                <p>FCHN017</p>
                                            </div>
                                        </div>
                                        <p>25 Feb to 26 Feb, 2022</p>
                                        <p>CL</p>
                                        <p>Friend???s wedding celebration</p>
                                        <div id="btns">
                                            <button>Approve</button>
                                            <button>Reject</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        ""}


                </div>

            </div>

            <Modal
                centered
                visible={popup}
                onCancel={() => setPopup(false)}
                width={0}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                bodyStyle={{ backgroundColor: `rgb(0 0 0 / 62%)`, width: '100%', height: `100vh`, position: 'fixed' }}
                style={{ backgroundColor: `transparent`, height: `100%` }}
                maskStyle={{ backgroundColor: `transparent`, height: `fit-content`, padding: `0` }}
            >
                <SideModal setPopup={setPopup} />
            </Modal>
        </BoardContainer>
    )
}
export default Board;