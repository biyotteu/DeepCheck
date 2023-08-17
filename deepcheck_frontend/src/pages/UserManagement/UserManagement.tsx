import React, { useEffect, useState } from "react";
import Wrap from "../../components/wrap/Wrap";
import "./UserManagement.scss";
import ReactPaginate from "react-paginate";
import http from "../../utils/http";
import { ReactComponent as EmployeeCard } from "./employee.svg";
import SideConsoleScore from "../../components/SideConsole/score";

type Log = {
  endpoint: string;
  filelist: string;
  id: number;
  path: string;
  score: number;
  user_id: number;
  uuid: string;
};
type LogDetail = {
  endpoint: string;
  filelist: string[];
  id: number;
  path: string;
  score: number;
  user_id: number;
  uuid: string;
};
// function LogDetail({
//   visible,
//   setVisible,
//   currentLog,
// }: {
//   visible: boolean;
//   setVisible: any;
//   currentLog: Log;
// }) {
//   const [detail, setDetail] = useState<LogDetail>({
//     endpoint: "",
//     filelist: [],
//     id: 0,
//     path: "",
//     score: 0,
//     user_id: 0,
//     uuid: "",
//   });
//   const [origin, setOrigin] = useState("");

//   useEffect(() => {
//     if (currentLog.id < 0) return;
//     http.post("/log/get/", { id: currentLog.id }).then((response) => {
//       const { data } = response;
//       console.log(data);
//       setDetail(data);
//     });

//     const origin_tmp = detail.filelist.filter((item) => {
//       return item.indexOf("/origin.jpg") > 0;
//     });
//     if (origin_tmp.length > 0) {
//       setOrigin(origin_tmp[0]);
//     }
//   }, []);

//   return (
//     <div className="log-overlay" style={{ display: visible ? "flex" : "none" }}>
//       <div className="log-card">
//         <div className="card-header">
//           타입결과
//           <img
//             src="/assets/icons/close.svg"
//             onClick={() => {
//               setVisible(false);
//             }}
//           />
//         </div>
//         <div className="card-content">
//           <div className="half">
//             <img src={origin} />
//           </div>
//           <div className="half">
//             <div className="card-grid">
//               {detail.filelist
//                 .filter((item) => {
//                   return item.indexOf("/origin.jpg") > 0;
//                 })
//                 .map((item, idx) => {
//                   return (
//                     <div key={idx} className="grid-item">
//                       <img src={item} />
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
function LogPage({ currentUser, setUserPage }: any) {
  const [total, setTotal] = useState(0);
  const [logList, setLogList] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [currentLog, setCurrentLog] = useState<Log>({
    endpoint: "",
    filelist: "",
    id: -1,
    path: "",
    score: 0,
    user_id: 0,
    uuid: "",
  });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    http
      .post("/log/total/", {
        user_id: currentUser.id,
      })
      .then((response) => {
        const { data } = response;
        setTotal(data.logtotal);
      });
    http
      .post("/log/loglist/", {
        user_id: currentUser.id,
        start: 0,
        end: 5,
      })
      .then((response) => {
        const { data } = response;
        setLogList(data.loglist);
        console.log(data);
      });
  }, []);
  useEffect(() => {
    http
      .post("/log/loglist/", {
        user_id: currentUser.id,
        start: (page - 1) * 5,
        end: page * 5,
      })
      .then((response) => {
        const { data } = response;
        setLogList(data.loglist);
        console.log(data);
      });
  }, [page]);
  return (
    <>
      {/* <LogDetail
        visible={visible}
        setVisible={setVisible}
        currentLog={currentLog}
      /> */}
      <div className="log-page">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="user-title">로그 관리</div>
          <div
            onClick={() => {
              setUserPage(true);
            }}
            className="go-back"
          >
            뒤로가기
          </div>
        </div>
        <div className="user-content">
          DeepCheck 서비스의 사용자 로그를 관리하는 페이지
        </div>
        <div className="user-search">
          <button className="search-button">
            <EmployeeCard />
          </button>
          <input className="search-input" value={currentUser.username} />
        </div>
        <div className="manage-card">
          <table className="manage-table">
            <tr className="card-header">
              <th className="head-column">이메일</th>
              <th className="head-column">로그보기</th>
              <th className="head-column">삭제</th>
            </tr>
            {logList?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="card-item">
                    <div className="email">{item.endpoint}</div>
                  </td>
                  <td className="card-item">
                    <img
                      className="right-arrow"
                      src="/assets/icons/arrow-right.svg"
                      onClick={() => {
                        setCurrentLog(item);
                        setVisible(true);
                      }}
                    />
                  </td>
                  <td className="card-item">
                    <img
                      className="cancel"
                      src="/assets/icons/cancel.svg"
                      onClick={() => {
                        http.delete("/log/delete/", {
                          data: { id: item.id },
                        });
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
          <div className="pagenation-wrap">
            <ReactPaginate
              // pageRangeDisplayed={5}
              pageCount={5}
              breakLabel="..."
              nextLabel=">"
              onPageChange={(event) => {
                console.log(event.selected);
              }}
              marginPagesDisplayed={1}
              pageRangeDisplayed={5}
              //pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </>
  );
}

type User = {
  id: number;
  username: string;
  permission: boolean;
  password: string;
};
function UserPage({ setUserPage, setCurrentUser }: any) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    http.get("/user/total/").then((response) => {
      const { data } = response;
      setTotal(data?.usertotal);
      console.log(data.usertotal);
    });
    http
      .post("/user/userlist/", {
        start: 0,
        end: 5,
      })
      .then((response) => {
        const { data } = response;
        setUserList(data.userlist);
      });
  }, []);

  useEffect(() => {
    http
      .post("/user/userlist/", {
        start: (page - 1) * 5,
        end: page * 5,
      })
      .then((response) => {
        const { data } = response;
        setUserList(data.userlist);
      });
  }, [page]);

  return (
    <div className="user-page">
      <div className="user-title">사용자 관리</div>
      <div className="user-content">
        DeepCheck 서비스의 사용자를 관리하는 페이지
      </div>
      <div className="user-search">
        <button
          className="search-button"
          onClick={async () => {
            try {
              // http.get("")
            } catch (err) {}
          }}
        >
          <img src="/assets/icons/search.svg" />
        </button>
        <input
          className="search-input"
          value={filter}
          placeholder="검색"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </div>
      <div className="manage-card">
        <table className="manage-table">
          <tr className="card-header">
            <th className="head-column">이메일</th>
            <th className="head-column">로그보기</th>
            <th className="head-column">삭제</th>
          </tr>
          {userList?.map((item, idx) => {
            return (
              <tr key={idx}>
                <td className="card-item">
                  <div className="email">{item.username}</div>
                </td>
                <td className="card-item">
                  <img
                    className="right-arrow"
                    src="/assets/icons/arrow-right.svg"
                    onClick={() => {
                      setCurrentUser(item);
                      setUserPage(false);
                    }}
                  />
                </td>
                <td className="card-item">
                  <img
                    className="cancel"
                    src="/assets/icons/cancel.svg"
                    onClick={() => {
                      // http.delete("/log/delete/", {
                      //   data: { id: item.id },
                      // });
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <div className="pagenation-wrap">
          <ReactPaginate
            // pageRangeDisplayed={5}
            pageCount={total / 5}
            breakLabel="..."
            nextLabel=">"
            onPageChange={(event) => {
              setPage(event.selected);
            }}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            //pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const [isUserPage, setIsUserPage] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: "",
    permission: false,
    password: "",
  });

  return (
    <div className="user-management">
      <Wrap>
        {isUserPage ? (
          <UserPage
            setUserPage={setIsUserPage}
            setCurrentUser={setCurrentUser}
          />
        ) : (
          <LogPage setUserPage={setIsUserPage} currentUser={currentUser} />
        )}
      </Wrap>
    </div>
  );
}

export default UserManagement;
