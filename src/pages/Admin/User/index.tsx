import React, { useState } from "react";
import Pagination from "../../../components/Pagination";
import { FiSearch } from "react-icons/fi";

const mockUsers = [
  {
    name: "Micheal",
    joined: "10/12/2024",
    test: 102,
    rate: "30%",
    status: "Enable",
  },
  {
    name: "Chovy",
    joined: "06/12/2024",
    test: 20,
    rate: "60%",
    status: "Disable",
  },
  {
    name: "Faker",
    joined: "10/11/2024",
    test: 3,
    rate: "100%",
    status: "Enable",
  },
  {
    name: "Kiin",
    joined: "15/10/2024",
    test: 56,
    rate: "10%",
    status: "Enable",
  },
  {
    name: "Micheal",
    joined: "05/10/2024",
    test: 10,
    rate: "10%",
    status: "Enable",
  },
  {
    name: "Chovy",
    joined: "01/10/2024",
    test: 34,
    rate: "10%",
    status: "Enable",
  },
  {
    name: "Kiin",
    joined: "09/09/2024",
    test: 10,
    rate: "100%",
    status: "Enable",
  },
];

const itemsPerPage = 5;

const UserDetailsPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Month");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = (index: number) => {
    const user = paginatedUsers[index];
    const confirmed = window.confirm(
      `Do you want to ${
        user.status === "Enable" ? "disable" : "enable"
      } this user?`
    );
    if (confirmed) {
      const updatedUsers = [...users];
      const globalIndex = users.findIndex(
        (u) => u.name === user.name && u.joined === user.joined
      );
      if (globalIndex !== -1) {
        updatedUsers[globalIndex].status =
          updatedUsers[globalIndex].status === "Enable" ? "Disable" : "Enable";
        setUsers(updatedUsers);
      }
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">User details</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-1.5 rounded-lg bg-[#F6F9FC] border text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 rounded-lg bg-[#F6F9FC] text-sm border"
            >
              <option value="Month">Short by: Month</option>
              <option value="Date">Date</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 font-semibold text-sm text-gray-500 py-2 border-b">
        <div>Name</div>
        <div>Join at</div>
        <div>Test</div>
        <div>Rate</div>
        <div>Status</div>
      </div>

      {/* Table Rows */}
      {paginatedUsers.map((user, idx) => (
        <div
          key={idx}
          className="grid grid-cols-5 py-3 text-sm border-b items-center"
        >
          <div>{user.name}</div>
          <div>{user.joined}</div>
          <div>{user.test}</div>
          <div>{user.rate}</div>
          <div>
            <button
              onClick={() => handleToggleStatus(idx)}
              className={`px-3 py-1 rounded text-sm font-semibold w-[80px] text-white
                ${user.status === "Enable" ? "bg-teal-400" : "bg-red-300"}`}
            >
              {user.status}
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserDetailsPage;
