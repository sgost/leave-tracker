import React, { useEffect, useState, useRef } from 'react';
import login_logo from '../data/assets/login_logo.svg';
import overview from '../data/assets/overview.svg';
import overview2 from '../data/assets/overview_hover.svg';
import admin from '../data/assets/admin.svg';
import admin2 from '../data/assets/admin_hover.svg';
import Calendar from '../data/assets/Calendar.svg';
import Calendar2 from '../data/assets/Calendar_hover.svg';
import settings from '../data/assets/settings.svg';
import settings2 from '../data/assets/settings_hover.svg';
import logout from '../data/assets/logout.svg';
import logout_hover from '../data/assets/logout_hover.svg';
import search from '../data/assets/search.svg';
import notificaton from '../data/assets/notificaton.svg';
import Edit_user from '../data/assets/Edit_user.svg';
import { BoardContainer } from '../components/Board/styles';
import { DeleteOutlined, SettingOutlined, CalendarOutlined, UpOutlined, DownOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Empty, Popover, Drawer, Badge, message, Result, Modal, notification } from 'antd';
import SideModal from '../components/leavePopup/index'
import Notification from "../components/leavePopup/notification";
import share from '../data/assets/share.svg';
import emptyFile from '../data/assets/empty-file.gif';
import axios from 'axios';
import { getHeaders, baseURL } from "../utils/urls"
import { navigate } from "gatsby"
import Loader from "../components/loader";
import NotificationSound from "../utils/notification.mp3"
import AddEmployee from "../components/Forms/AddEmployee";
import EditUser from "../components/Forms/EditUser";
import LeaveDetails from "../components/Forms/LeaveDetails";

const Board = () => {

    const urlGlobal = baseURL;

    let userData = typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('userData'))

    let userDataMain = userData?.user;
    const [popup, setPopup] = useState(false);
    const [sideToggle, setSideToggle] = useState(userDataMain?.role === 'admin' ? 3 : 1);
    const [sideSubOpen, setSideSubOpen] = useState(false);
    const [sideToggleSub, setSideToggleSub] = useState({ name: '', value: '' });
    const [userLeaveData, setUserLeaveData] = useState([]);
    const [activeLoader, setActiveLoader] = useState(false);
    const [adminToggle, setAdminToggle] = useState(userDataMain?.role === 'admin' ? 'pending' : 'approved');
    const [visible, setVisible] = useState(false);
    const [addEmp, setAddEmp] = useState(false);
    const [barOpen, setbarOpen] = useState(false);
    const [leaveDetail, setLeaveDetail] = useState(false);
    const [leaveDetailContent, setLeaveDetailContent] = useState('');
    const [descType, setDescType] = useState('');
    const [descId, setDescId] = useState('');
    const [name, setName] = useState('');
    const [Email, setEMail] = useState('');

    const headers = getHeaders(userData?.tokens?.accessToken);

    useEffect(() => {
        if (userData) {
            getLeaves();
            getUsers();
        } else {
            logOut();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Call to fetch the number of leaves by user
    const getLeaves = () => {
        setActiveLoader(true);
        axios({
            method: 'GET',
            url: `${urlGlobal}/api/v2/leaves`,
            headers: headers
        }).then((res) => {
            setActiveLoader(false);
            setUserLeaveData(res?.data);
        }).catch((_err) => {
            setActiveLoader(false);
            console.log('Error', _err);
        })
    }



    // Function to split letters in user name to use as DP
    const nameProf = (name) => {
        let text = name;
        const myArray = text?.split(" ");
        return (myArray && (myArray[0] ? myArray[0][0] : '') + ' ' + (myArray[1] ? myArray[1][0] : ''))
    }


    // Call for logout and cleanup the localstorage
    const logOut = () => {
        typeof localStorage !== `undefined` && localStorage.removeItem('userData');
        navigate(`/`);
        openNotificationWithIcon(`success`, 'Logout Successfully');
    }


    // Approve Reject popup function
    const desecision = (type, id) => {
        setDescType(type);
        setDescId(id);
        setVisible(true);
        setLeaveDetail(false);
    }


    // call to action on leave (APPROVE, REJECT, DELETE)
    const approveLeave = (type, leaveId) => {
        setActiveLoader(true);
        axios({
            method: type === 'delete' ? 'Delete' : 'PUT',
            url: `${urlGlobal}/api/v2/leaves${type !== 'delete' ? '/' + type : ''}/${leaveId}`,
            headers: headers
        }).then((res) => {
            getLeaves();
            setLeaveDetail(false);
            openNotificationWithIcon('success', res?.data?.message);
            playAudio();
        }).catch((_err) => {
            setActiveLoader(false);
            setLeaveDetail(false);
            console.log('Error', _err);
        })
    }


    // Call to add employee
    const addUser = (name, Email, id) => {
        setActiveLoader(true);
        let conditionAPI;
        if (id) {
            conditionAPI = axios({
                method: 'DELETE',
                url: `${urlGlobal}/api/v2/users/${id}`,
                headers: headers
            })
        } else {
            conditionAPI = axios({
                method: 'POST',
                url: `${urlGlobal}/api/v2/users`,
                data: {
                    name: name,
                    email: Email
                },
                headers: headers
            })
        }
        conditionAPI.then((res) => {
            openNotificationWithIcon(`success`, id ? `${res?.data?.user?.name} removed` : `${res?.data?.user?.name} added successfully`);
            setAddEmp(false);
            setActiveLoader(false);
            playAudio();
            getUsers();
            setName("");
            setEMail("");
        }).catch((_err) => {
            setActiveLoader(false);
            openNotificationWithIcon('error', `User exists aready`);
            getUsers();
            setName("");
            setEMail("");
        })
    }



    // Function for validation
    const [error, setError] = useState('')
    const validation = (name, mail) => {
        let x;
        if (!name) {
            x = 'red'
        } else {
            x = ''
        }
        if (!mail) {
            x = 'red'
        } else {
            x = ''
        }

        return x;
    }

    function checkValidation() {
        setError(validation())
        openNotificationWithIcon(`error`, `Field should not be empty`);
    }
    // setError((validation()))


    // notification conformation sound function
    const audioPlayer = useRef(null);

    function playAudio() {
        audioPlayer.current.play();
    }

    const leaveMap = userLeaveData?.leaves?.filter((item) => item.status === adminToggle)

    const openNotificationWithIcon = (type, data) => {
        notification[type]({
            message: data,
            placement: 'top'
        });
    };


    const openLeaveDetailsFun = (item, desType) => {
        setLeaveDetail(true);
        setLeaveDetailContent({ item, desType });
    }


    // Call to get users
    const [usersData, setUsersData] = useState([]);
    const getUsers = () => {
        axios({
            method: 'GET',
            url: `${urlGlobal}/api/v2/users?page=0&limit=0`,
            headers: headers
        }).then((res) => {
            setUsersData(res?.data?.users);
            console.log(usersData)
        }).catch((_err) => {
            console.log('Error', _err);
        })
    }


    const [editUserPop, setEditUserPop] = useState(false);
    const [editUserPopDetails, setEditUserPopDetails] = useState(false);
    const [empName, setEmpName] = useState('');
    const [empDesignation, setEmpDesignation] = useState('');
    const [empUsed, setEmpUsed] = useState('');
    const [empLeft, setEmpLeft] = useState('');
    const editUserFun = (item) => {
        setEditUserPop(true);
        setEditUserPopDetails(item);
        setEmpName(item.name);
        setEmpDesignation(item.jobRole ? item.jobRole : 'Employee');
        setEmpUsed(item.allowance?.cos?.used + item.allowance?.gen?.used);
        setEmpLeft(item.allowance?.cos?.remaining + item.allowance?.gen?.remaining);
    }

    // Call to edit, delete user form DB
    const editUserFunOk = () => {
        setActiveLoader(true);
        const data = {
            name: empName,
            jobRole: empDesignation
        }
        if (empName || empName || empDesignation || empUsed || empLeft) {
            axios({
                method: 'PATCH',
                url: `${urlGlobal}/api/v2/users/${editUserPopDetails?.id}`,
                data: data,
                headers: headers
            }).then((resp) => {
                openNotificationWithIcon(`success`, 'Changes updated');
                console.log(resp);
                setEditUserPop(false);
                getUsers();
                setActiveLoader(false);
            }).catch(() => {
                setActiveLoader(false);
                openNotificationWithIcon(`error`, 'User update failed');
            })
        } else {
            openNotificationWithIcon(`error`, 'No changes to update');
        }
    }



    // Setting variables manually for leave count in User dash board
    const leaveApproved = userLeaveData?.leaves?.filter((item) => item.status === 'approved')
    const leaveRejected = userLeaveData?.leaves?.filter((item) => item.status === 'rejected')
    const leavePending = userLeaveData?.leaves?.filter((item) => item.status === 'pending')
    const userRealData = userLeaveData?.leaves?.filter((item) => item.status === adminToggle)
    useEffect(() => {
        if (sideSubOpen === false) {
            setSideToggleSub({ name: '', value: '' })
        }
    }, [sideSubOpen])

    return (
        <BoardContainer>
            {activeLoader && <Loader />}
            <audio ref={audioPlayer} src={NotificationSound}>
                <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions" />
            </audio>
            <div id="BoardContainer" >
                <div id="side_menu" style={{ width: !barOpen && '6vw', transition: `0.5s ease-in-out` }}>
                    <span id='drag_button' onClick={() => setbarOpen(!barOpen)}>
                        <Popover placement="right" content={barOpen ? 'Tap To Minimize' : 'Tap To Expand'}>
                            {barOpen ?
                                <RightOutlined />
                                :
                                <LeftOutlined />
                            }
                        </Popover>
                    </span>

                    <h1><img src={login_logo} alt="img" />{barOpen && 'Leave Tracker'}</h1>
                    <ul>
                        {userDataMain?.role === 'user' &&
                            <li className={sideToggle === 1 ? "active" : ""} role="presentation" onClick={() => { setSideToggle(1); setSideToggleSub({ name: '', value: '' }) }}><img src={sideToggle === 1 ? overview2 : overview} alt="img" />{barOpen && 'Home'}</li>}
                        <li className={sideToggle === 2 ? "active" : ""} role="presentation" onClick={() => { setSideToggle(2); setSideToggleSub({ name: '', value: '' }) }}><img src={sideToggle === 2 ? Calendar2 : Calendar} alt="img" />{barOpen && 'Calendar'}</li>
                        {userDataMain?.role === 'admin' ?
                            <li className={sideToggle === 3 ? "active" : ""} role="presentation" onClick={() => {
                                setSideToggle(3);
                                setSideSubOpen(!sideSubOpen);
                            }}><img src={sideToggle === 3 ? admin2 : admin} alt="img" />{barOpen && 'Admin Portal'} {barOpen && <span style={{ marginLeft: `5px` }}>{sideSubOpen ? <UpOutlined /> : <DownOutlined />}</span>}</li>
                            :
                            <li className={sideToggle === 3 ? "active" : ""} role="presentation" onClick={() => { setSideToggle(3) }}><img src={sideToggle === 3 ? admin2 : admin} alt="img" />{barOpen && `User Portal`}</li>
                        }
                        {sideSubOpen && barOpen &&
                            <div id="menu_dropdown">
                                <span id={sideToggleSub.value === 1 && "active"} onClick={() => setSideToggleSub({ name: 'Employee List', value: 1 })}>Employee List</span>
                            </div>
                        }
                    </ul>
                    <ul>
                        <li className={sideToggle === 4 ? "active" : ""} role="presentation" onClick={() => { setSideToggle(4) }}><img src={sideToggle === 4 ? settings2 : settings} alt="img" />{barOpen && 'Settings'}</li>
                    </ul>


                    <ul id="logout">
                        <li onClick={logOut} role="presentation"> <img src={logout_hover} alt="img" className="imghover" /><img src={logout} alt="img" className="image" />{barOpen && 'logout'}</li>
                    </ul>
                </div>
                <div id="main_menu" style={{ background: sideToggle === 1 ? 'white' : '#FCFAFA' }}>
                    <div id="header">
                        <h2 id="title">{sideToggle === 1 ? "Home" : sideToggle === 2 ? "Calendar" : sideToggle === 3 ? (userDataMain?.role === 'admin' ? "Admin Portal" : "User Portal") : sideToggle === 4 ? "Settings" : ""} {sideToggleSub.name && sideToggle === 3 && `(${sideToggleSub.name})`}</h2>
                        <div id="mini_block">
                            {sideToggle === 1 && <button onClick={() => setPopup(true)}>Apply Leave</button>}
                            {sideToggle === 3 && userDataMain?.role === 'admin' && <button onClick={() => setAddEmp(true)}>Add Employee</button>}
                            <img src={search} alt="img" id="search" />
                            <Popover placement="bottomRight" content={<Notification />} style={{ position: 'relative' }}>
                                <Badge count={userLeaveData?.leaves?.length}>
                                    <img src={notificaton} alt="img" id="notificaton" />
                                </Badge>
                            </Popover>

                            <div id="mini_block_name">
                                <p id="profile-icon">{userDataMain && nameProf(userDataMain?.name).toUpperCase()}</p>
                                <p id="name_main">{userDataMain?.name}<span>{userDataMain?.role}</span></p>
                                {/* <img src={userDataMain?.photoURL} alt="img" id="profile" /> */}
                            </div>
                        </div>
                    </div>

                    {sideToggle === 1 && sideToggleSub.value === '' &&
                        <>
                            <div id="score">
                                <div id="score_card">
                                    <h2 id="score">02</h2>
                                    <p>Available Leaves</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">{leaveApproved?.length < 10 ? `0${leaveApproved?.length}` : leaveApproved?.length}</h2>
                                    <p>Approved Leaves</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">{leavePending?.length < 10 ? `0${leavePending?.length}` : leavePending?.length}</h2>
                                    <p>Pending Leaves Requests</p>
                                </div>
                                <div id="score_card">
                                    <h2 id="score">{leaveRejected?.length < 10 ? `0${leaveRejected?.length}` : leaveRejected?.length}</h2>
                                    <p>Rejected Leaves</p>
                                </div>
                            </div>

                            <div id="message">
                                {userLeaveData?.leaves?.length > 0 ?
                                    <>
                                        <div id="message_block1">
                                            <h3>SNo</h3>
                                            <h3>Type</h3>
                                            <h3>From</h3>
                                            <h3>To</h3>
                                            <h3>Reason</h3>
                                            <h3>Status</h3>
                                            <h3>Action</h3>
                                        </div>
                                        <div id="message_block2">
                                            {userLeaveData?.leaves?.reverse().map((item, i) =>
                                                <div id="task_container" key={i}>
                                                    <p onClick={() => openLeaveDetailsFun(item, 'home')}>{userLeaveData?.leaves?.length - i}</p>
                                                    <p style={{ padding: `0` }} onClick={() => openLeaveDetailsFun(item, 'home')}>{item?.type === "gen" ? 'Paid' : 'Cassual'}</p>
                                                    <p onClick={() => openLeaveDetailsFun(item, 'home')}>{item?.startDate}</p>
                                                    <p onClick={() => openLeaveDetailsFun(item, 'home')}>{item?.endDate}</p>
                                                    <p onClick={() => openLeaveDetailsFun(item, 'home')}>{item?.reason}</p>
                                                    <p style={{
                                                        color: item?.status === 'pending' ? '#CB5A08' :
                                                            item?.status === 'approved' ? '#00D241'
                                                                :
                                                                item?.status === 'rejected' ? '#FF0000' :
                                                                    '', fontWeight: '600'
                                                    }} onClick={() => openLeaveDetailsFun(item, 'home')}>
                                                        {item?.status === 'pending' ? 'Pending' :
                                                            item?.status === 'approved' ? 'Approved'
                                                                :
                                                                item?.status === 'rejected' ? 'Rejected' :
                                                                    ''}
                                                    </p>
                                                    <p onClick={() => desecision('delete', item?.id)}><DeleteOutlined className='delete_icon' /></p>
                                                </div>
                                            )}

                                        </div>
                                    </>
                                    :
                                    <div id="message_blocks">
                                        <Empty
                                            image={emptyFile}
                                            imageStyle={{
                                                height: 200,
                                            }}
                                            description={
                                                <span style={{ fontSize: `20px`, fontWeight: `bold`, color: `#6BA1DF` }}>
                                                    No Leaves Applied
                                                </span>
                                            }
                                        />
                                    </div>
                                }
                            </div>
                        </>

                    }


                    {sideToggle === 2 && sideToggleSub.value === '' &&
                        <Result
                            icon={<CalendarOutlined />}
                            title="Hello, Calender comming soon!"
                        />

                    }

                    {sideToggle === 3 && sideToggleSub.value === '' &&
                        <div id="admin">
                            <div id="admin_block1">
                                <h1>Leave Requests</h1>
                                <p id="share"><img src={share} alt="share" />Share</p>
                            </div>
                            <div id="admin_tab">
                                {userDataMain?.role === 'admin' && <h2 role='presentation' onClick={() => setAdminToggle('pending')} className={adminToggle === 'pending' && "active"}>Pending</h2>}
                                <h2 role='presentation' onClick={() => setAdminToggle('approved')} className={adminToggle === 'approved' && "active"}>Approved</h2>
                                <h2 role='presentation' onClick={() => setAdminToggle('rejected')} className={adminToggle === 'rejected' && "active"}>Rejected</h2>
                            </div>
                            {leaveMap?.length !== 0 ?
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
                                        {userRealData?.map((item, i) =>
                                            <div>
                                                {item.status === adminToggle &&
                                                    <div id="task_container">
                                                        <p>{i + 1}</p>
                                                        <div id="profile_box">
                                                            <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                                            <div id="profile_text" onClick={() => openLeaveDetailsFun(item, 'pending')}>
                                                                <h2 style={{ fontSize: `0.9vw` }}>{item?.username}</h2>
                                                                <p style={{ fontSize: `0.9vw` }}>{item?.userId[0] + item?.userId[1] + item?.userId[2] + item?.userId[3] + item?.userId[4]}</p>
                                                            </div>
                                                        </div>
                                                        <p onClick={() => openLeaveDetailsFun(item, 'pending')}>{item?.startDate} to {item?.endDate}</p>
                                                        <p onClick={() => openLeaveDetailsFun(item, 'pending')}>{item?.type === 'cos' ? 'CL' : 'PL'}</p>
                                                        <p style={{
                                                            whiteSpace: 'nowrap',
                                                            width: '16vw',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }} onClick={() => openLeaveDetailsFun(item, 'pending')}>{item?.reason}</p>
                                                        <div id="btns">
                                                            {item.status === 'approved' ? <p style={{
                                                                color: `#00D241`, fontSize: `1.2vw`, fontWeight: `700`
                                                            }}>Approved</p> : item.status === 'rejected' ?
                                                                <p style={{
                                                                    color: `#FF0000`, fontSize: `1.2vw`, fontWeight: `700`
                                                                }}>Rejected</p> :
                                                                <>
                                                                    <button onClick={() => { desecision('approve', item?.id) }}>Approve</button>
                                                                    <button onClick={() => { desecision('reject', item?.id) }}>Reject</button>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                :
                                <Empty
                                    image={emptyFile}
                                    imageStyle={{
                                        height: 250,
                                        width: 200,
                                        margin: '7vw auto auto auto',
                                    }}
                                    description={
                                        <span style={{ fontSize: `20px`, fontWeight: `bold`, color: `#6BA1DF` }}>
                                            No {adminToggle} leaves!
                                        </span>
                                    }
                                />
                            }
                        </div>
                    }


                    {sideToggle === 4 &&
                        <Result
                            icon={<SettingOutlined />}
                            title="Hello, Calender comming soon!"
                        />

                    }



                    {sideToggle === 3 && sideToggleSub.value === 1 &&
                        <div id="admin_home">
                            <div id="admin" className='admin'>
                                {usersData?.length !== 0 ?
                                    <div id="message">
                                        <div id="message_block1">
                                            <h3>SNo</h3>
                                            <h3>Emp. Name & ID</h3>
                                            <h3>Designation</h3>
                                            <h3>No.of Leave Used</h3>
                                            <h3>No.of Leave Left</h3>
                                            <h3>Action</h3>
                                        </div>
                                        <div id="message_block2">
                                            {usersData?.map((item, i) =>
                                                <div>
                                                    {item?.role !== 'admin' &&
                                                        <div id="task_container">
                                                            <p>{i + 1}</p>
                                                            <div id="profile_box">
                                                                <img src="https://i.pinimg.com/550x/4b/0e/d9/4b0ed906554fb9f66b1afabea90eb822.jpg" alt="img" id="profile" />
                                                                <div id="profile_text">
                                                                    <h2 style={{ fontSize: `0.9vw` }}>{item?.name}</h2>
                                                                    <p style={{ fontSize: `0.9vw` }}>FJl7h1</p>
                                                                </div>
                                                            </div>
                                                            <p>{item?.role}</p>
                                                            <p>4</p>
                                                            <p style={{
                                                                whiteSpace: 'nowrap',
                                                                width: '16vw',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>12</p>
                                                            <div id="btns">
                                                                <img src={Edit_user} alt="Edit_user" onClick={() => editUserFun(item)} />
                                                                <DeleteOutlined style={{ color: `red`, marginLeft: `15px`, fontSize: `23px` }} onClick={() => addUser(null, null, item.id)} />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    :
                                    <Empty
                                        image={emptyFile}
                                        imageStyle={{
                                            height: 250,
                                            width: 200,
                                            margin: '7vw auto auto auto',
                                        }}
                                        description={
                                            <span style={{ fontSize: `20px`, fontWeight: `bold`, color: `#6BA1DF` }}>
                                                No Users!
                                            </span>
                                        }
                                    />
                                }
                            </div>
                        </div>
                    }

                </div>

            </div>
            <Drawer
                visible={popup}
                onClose={() => setPopup(false)}
                width="fit-content"
            >
                <SideModal setPopup={setPopup} headers={headers} getLeaves={getLeaves} userDataMain={userDataMain} setActiveLoader={setActiveLoader} playAudio={playAudio} openNotificationWithIcon={openNotificationWithIcon} />
            </Drawer>

            <Modal
                title="Add Employee"
                centered
                visible={addEmp}
                onCancel={() => { setAddEmp(false) }}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                okText='Continue'
            >
                <AddEmployee name={name} Email={Email} setName={setName} setEMail={setEMail} addUser={addUser} error={error} checkValidation={checkValidation} />
            </Modal>

            {/* Edit User Modal */}
            <Modal
                title="Edit user"
                centered
                visible={editUserPop}
                onCancel={() => { setEditUserPop(false); getUsers() }}
                okText='Save Edit'
                cancelText='Revert Changes'
                onOk={() => editUserFunOk()}
            >
                <EditUser editUserPopDetails={editUserPopDetails} empName={empName} empDesignation={empDesignation} setEmpName={setEmpName} setEmpDesignation={setEmpDesignation} setEmpUsed={setEmpUsed} setEmpLeft={setEmpLeft} />
            </Modal>

            <Modal
                centered
                visible={leaveDetail}
                onCancel={() => { setLeaveDetail(false) }}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                okText='Continue'
            >
                <LeaveDetails leaveDetailContent={leaveDetailContent} desecision={desecision} />
            </Modal>

            <Modal
                title="Confirmation"
                centered
                visible={visible}
                onOk={() => { approveLeave(descType === 'approve' ? 'approve' : descType === 'reject' ? 'reject' : 'delete', descId); setVisible(false) }}
                onCancel={() => { setVisible(false) }}
                width={1000}
                okText={descType === 'approve' ? 'Approve' : descType === 'reject' ? 'Reject' : 'Delete'}
                cancelText='Back'
            >
                <p style={{ fontSize: `24px`, color: `#333333`, fontWeight: `600`, margin: `51px 0` }}>Are you sure you want to {descType === 'approve' ? 'Approve' : descType === 'reject' ? 'Reject' : 'Delete'}?</p>
            </Modal>
        </BoardContainer >
    )
}
export default Board;