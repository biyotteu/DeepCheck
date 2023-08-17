import React, { useState } from "react";
import Wrap from "../../components/wrap/Wrap";
import "./UserManagement.scss";
import ReactPaginate from "react-paginate";

function LogPage() {
  return <div className="log-page"></div>;
}
function UserPage() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState([
    {
      email: "test@asdfsadf.com",
      folderId: "sadfsafdfdsafasd",
    },
    {
      email: "test@asdfsadf.com",
      folderId: "sadfsafdfdsafasd",
    },
    {
      email: "test@asdfsadf.com",
      folderId: "sadfsafdfdsafasd",
    },
    {
      email: "test@asdfsadf.com",
      folderId: "sadfsafdfdsafasd",
    },
    {
      email: "test@asdfsadf.com",
      folderId: "sadfsafdfdsafasd",
    },
  ]);

  return (
    <div className="user-page">
      <div className="user-title">사용자 관리</div>
      <div className="user-content">
        DeepCheck 서비스의 사용자를 관리하는 페이지
      </div>
      <div className="user-search">
        <button className="search-button">
          <img src="/assets/icons/search.svg" />
        </button>
        <input className="search-input" />
      </div>
      <div className="manage-card">
        <table className="manage-table">
          <tr className="card-header">
            <th className="head-column">이메일</th>
            <th className="head-column">로그보기</th>
            <th className="head-column">삭제</th>
          </tr>
          {userList.map((item, idx) => {
            return (
              <tr key={idx}>
                <td className="card-item">
                  <div className="email">{item.email}</div>
                </td>
                <td className="card-item">
                  <img
                    className="right-arrow"
                    src="/assets/icons/arrow-right.svg"
                  />
                </td>
                <td className="card-item">
                  <img className="cancel" src="/assets/icons/cancel.svg" />
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
  );
}

function UserManagement() {
  const [isUserPage, setIsUserPage] = useState(true);
  return (
    <div className="user-management">
      <Wrap>{isUserPage ? <UserPage /> : <LogPage />}</Wrap>
    </div>
  );
}

export default UserManagement;
