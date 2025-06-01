import React, { useState } from "react";
import Pagination from "../../../components/Pagination";

const learners = [
  {
    name: "Alice",
    email: "alice@example.com",
    joined: "01/01/2024",
    testsTaken: 15,
    avgScore: "82%",
    vocabSetsSaved: 5,
    completionRate: "76%",
    status: "Enable",
  },
  {
    name: "Bob",
    email: "bob@example.com",
    joined: "02/02/2024",
    testsTaken: 9,
    avgScore: "67%",
    vocabSetsSaved: 2,
    completionRate: "40%",
    status: "Disable",
  },
];

const admins = [
  {
    name: "Jane",
    email: "jane@admin.com",
    joined: "01/12/2023",
    testsPosted: 10,
    vocabSetsPosted: 7,
    status: "Enable",
  },
  {
    name: "John",
    email: "john@admin.com",
    joined: "15/12/2023",
    testsPosted: 5,
    vocabSetsPosted: 3,
    status: "Disable",
  },
];

const itemsPerPage = 5;

const UserManagementPage = () => {
  const [learnerUsers, setLearnerUsers] = useState(learners);
  const [adminUsers, setAdminUsers] = useState(admins);
  const [currentPageLearner, setCurrentPageLearner] = useState(1);
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const [activeTab, setActiveTab] = useState<"learner" | "admin">("learner");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });

  const handleToggleStatus = (
    userType: "learner" | "admin",
    index: number,
    pageUsers: any[],
    setUsers: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const user = pageUsers[index];
    const confirmed = window.confirm(
      `Do you want to ${
        user.status === "Enable" ? "disable" : "enable"
      } this user?`
    );
    if (confirmed) {
      const updatedList = [
        ...(userType === "learner" ? learnerUsers : adminUsers),
      ];
      const globalIndex = updatedList.findIndex(
        (u) => u.name === user.name && u.email === user.email
      );
      if (globalIndex !== -1) {
        updatedList[globalIndex].status =
          updatedList[globalIndex].status === "Enable" ? "Disable" : "Enable";
        setUsers(updatedList);
      }
    }
  };

  const paginatedLearners = learnerUsers.slice(
    (currentPageLearner - 1) * itemsPerPage,
    currentPageLearner * itemsPerPage
  );

  const paginatedAdmins = adminUsers.slice(
    (currentPageAdmin - 1) * itemsPerPage,
    currentPageAdmin * itemsPerPage
  );

  return (
    <div className="p-6 font-sans space-y-6">
      {/* Tab bar */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("learner")}
          className={`text-[20px] font-semibold px-4 py-2 rounded-t ${
            activeTab === "learner"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Learner Management
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`text-[20px] font-semibold px-4 py-2 rounded-t ${
            activeTab === "admin"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Admin Management
        </button>
      </div>

      {/* Learner Table */}
      {activeTab === "learner" && (
        <div>
          <h2 className="text-lg font-bold mb-4">Learner Management</h2>
          <div className="grid grid-cols-8 font-semibold text-sm text-gray-500 py-2 border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Joined</div>
            <div>Tests</div>
            <div>Avg Score</div>
            <div>Saved Sets</div>
            <div>Completed</div>
            <div>Status</div>
          </div>
          {paginatedLearners.map((user, idx) => (
            <div
              key={idx}
              className="grid grid-cols-8 py-3 text-sm border-b items-center"
            >
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>{user.joined}</div>
              <div>{user.testsTaken}</div>
              <div>{user.avgScore}</div>
              <div>{user.vocabSetsSaved}</div>
              <div>{user.completionRate}</div>
              <div>
                <button
                  onClick={() =>
                    handleToggleStatus(
                      "learner",
                      idx,
                      paginatedLearners,
                      setLearnerUsers
                    )
                  }
                  className={`px-3 py-1 rounded text-sm font-semibold w-[80px] text-white ${
                    user.status === "Enable" ? "bg-teal-400" : "bg-red-300"
                  }`}
                >
                  {user.status}
                </button>
              </div>
            </div>
          ))}
          <Pagination
            totalItems={learnerUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPageLearner}
            onPageChange={setCurrentPageLearner}
          />
        </div>
      )}

      {/* Admin Table */}
      {activeTab === "admin" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Admin Management</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600 transition"
            >
              + Create Admin
            </button>
          </div>

          <div className="grid grid-cols-6 font-semibold text-sm text-gray-500 py-2 border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Joined</div>
            <div>Tests Posted</div>
            <div>Sets Posted</div>
            <div>Status</div>
          </div>

          {paginatedAdmins.map((admin, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 py-3 text-sm border-b items-center"
            >
              <div>{admin.name}</div>
              <div>{admin.email}</div>
              <div>{admin.joined}</div>
              <div>{admin.testsPosted}</div>
              <div>{admin.vocabSetsPosted}</div>
              <div>
                <button
                  onClick={() =>
                    handleToggleStatus(
                      "admin",
                      idx,
                      paginatedAdmins,
                      setAdminUsers
                    )
                  }
                  className={`px-3 py-1 rounded text-sm font-semibold w-[80px] text-white ${
                    admin.status === "Enable" ? "bg-teal-400" : "bg-red-300"
                  }`}
                >
                  {admin.status}
                </button>
              </div>
            </div>
          ))}

          {/* modal thêm  admin */}
          {showCreateModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-bold mb-4">Create New Admin</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newAdmin.name && newAdmin.email) {
                          setAdminUsers((prev) => [
                            ...prev,
                            {
                              ...newAdmin,
                              joined: new Date().toLocaleDateString("en-GB"),
                              testsPosted: 0,
                              vocabSetsPosted: 0,
                              status: "Enable",
                            },
                          ]);
                          setNewAdmin({ name: "", email: "" });
                          setShowCreateModal(false);
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Pagination
            totalItems={adminUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPageAdmin}
            onPageChange={setCurrentPageAdmin}
          />
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
