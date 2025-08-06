"use client";

import { useState, useMemo, useEffect } from "react";
import UserTable from "./UserTable";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import EditUserDialog from "./EditUserDialog";

export default function RegisteredStudents() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/users.json");
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        const users = await res.json();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setData([]);
      }
    };

    getUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // console.log(`Delete user with ID: ${id}`);
  };

  return (
    <div className="w-full space-y-3 p-2">
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Registered Students
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        View and manage all student registered for the course
      </p>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by student name..."
      />

      <UserTable
        data={paginatedData}
        handleSort={handleSort}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        totalItems={sortedData.length}
      />

      <EditUserDialog
        user={selectedUser}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
