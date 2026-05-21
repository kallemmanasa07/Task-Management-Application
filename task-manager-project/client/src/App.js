import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await axios.get(
      "http://localhost:5000/tasks"
    );

    setTasks(res.data);
  };

  // Add Task
  const addTask = async () => {
    if (!title) return;

    await axios.post(
      "http://localhost:5000/tasks",
      {
        title,
        dueDate,
      }
    );

    setTitle("");
    setDueDate("");

    fetchTasks();
  };

  // Delete Task
  const deleteTask = async (id) => {
    await axios.delete(
      `http://localhost:5000/tasks/${id}`
    );

    fetchTasks();
  };

  // Edit Task
  const editTask = (task) => {
    setTitle(task.title);

    setDueDate(task.dueDate);

    setEditId(task.id);
  };

  // Update Task
  const updateTask = async () => {
    const task = tasks.find(
      (t) => t.id === editId
    );

    await axios.put(
      `http://localhost:5000/tasks/${editId}`,
      {
        title,
        dueDate,
        status: task.status,
      }
    );

    setTitle("");
    setDueDate("");
    setEditId(null);

    fetchTasks();
  };

  // Change Status
  const changeStatus = async (
    task,
    newStatus
  ) => {
    await axios.put(
      `http://localhost:5000/tasks/${task.id}`,
      {
        title: task.title,
        dueDate: task.dueDate,
        status: newStatus,
      }
    );

    fetchTasks();
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !== "Completed"
    ).length;

  return (
    <div
      style={{
        minHeight: "100vh",

        background: darkMode
          ? "#1e1e1e"
          : "#f0f4ff",

        color: darkMode
          ? "white"
          : "black",

        padding: "20px",

        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "800px",

          margin: "auto",

          background: darkMode
            ? "#2c2c2c"
            : "white",

          padding: "30px",

          borderRadius: "10px",

          boxShadow:
            "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >
          <h1>Task Manager</h1>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>
        </div>

        {/* Statistics Cards */}
        <div
          style={{
            display: "flex",

            gap: "15px",

            marginBottom: "20px",

            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,

              background: "#d1ecf1",

              padding: "15px",

              borderRadius: "8px",
            }}
          >
            <h3>Total Tasks</h3>

            <h2>{totalTasks}</h2>
          </div>

          <div
            style={{
              flex: 1,

              background: "#b7f7c2",

              padding: "15px",

              borderRadius: "8px",
            }}
          >
            <h3>Completed</h3>

            <h2>
              {completedTasks}
            </h2>
          </div>

          <div
            style={{
              flex: 1,

              background: "#ffe69c",

              padding: "15px",

              borderRadius: "8px",
            }}
          >
            <h3>Pending</h3>

            <h2>{pendingTasks}</h2>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"

          placeholder="Search Task"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            width: "100%",

            padding: "10px",

            marginBottom: "20px",

            borderRadius: "5px",
          }}
        />

        {/* Input Section */}
        <div
          style={{
            display: "flex",

            gap: "10px",

            marginBottom: "20px",

            flexWrap: "wrap",
          }}
        >
          <input
            type="text"

            placeholder="Task"

            value={title}

            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }

            style={{
              flex: 1,

              padding: "10px",
            }}
          />

          <input
            type="date"

            value={dueDate}

            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

          {editId ? (
            <button
              onClick={
                updateTask
              }
            >
              Update
            </button>
          ) : (
            <button
              onClick={addTask}
            >
              Add
            </button>
          )}
        </div>

        {/* Task List */}
        {tasks
          .filter((task) =>
            task.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )

          .map((task) => (
            <div
              key={task.id}

              style={{
                background:
                  task.status ===
                  "Completed"
                    ? "#b7f7c2"
                    : new Date(
                        task.dueDate
                      ) <
                      new Date()
                    ? "#ffb3b3"
                    : "#ffe69c",

                padding: "15px",

                marginBottom:
                  "15px",

                borderRadius:
                  "8px",
              }}
            >
              <h3>{task.title}</h3>

              {/* Status */}
              <p>
                <strong>
                  Status:
                </strong>{" "}

                {task.status ===
                "Completed" ? (
                  <span
                    style={{
                      color:
                        "green",

                      fontWeight:
                        "bold",
                    }}
                  >
                    Completed
                  </span>
                ) : new Date(
                    task.dueDate
                  ) <
                  new Date() ? (
                  <span
                    style={{
                      color: "red",

                      fontWeight:
                        "bold",
                    }}
                  >
                    Overdue
                  </span>
                ) : (
                  <span
                    style={{
                      color:
                        "orange",

                      fontWeight:
                        "bold",
                    }}
                  >
                    Pending
                  </span>
                )}
              </p>

              {/* Due Date */}
              <p>
                <strong>
                  Due Date:
                </strong>{" "}
                {task.dueDate}
              </p>

              {/* Days Left / Overdue */}
              <p>
                {task.status !==
                "Completed" ? (
                  new Date(
                    task.dueDate
                  ) <
                  new Date() ? (
                    <span
                      style={{
                        color:
                          "red",

                        fontWeight:
                          "bold",
                      }}
                    >
                      Overdue by{" "}
                      {Math.ceil(
                        (new Date() -
                          new Date(
                            task.dueDate
                          )) /
                          (1000 *
                            60 *
                            60 *
                            24)
                      )}{" "}
                      Days
                    </span>
                  ) : (
                    <span
                      style={{
                        color:
                          "green",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {Math.ceil(
                        (new Date(
                          task.dueDate
                        ) -
                          new Date()) /
                          (1000 *
                            60 *
                            60 *
                            24)
                      )}{" "}
                      Days Left
                    </span>
                  )
                ) : (
                  <span
                    style={{
                      color:
                        "green",

                      fontWeight:
                        "bold",
                    }}
                  >
                    Submitted on
                    time
                  </span>
                )}
              </p>

              {/* Buttons */}
              <button
                onClick={() =>
                  editTask(task)
                }

                style={{
                  marginRight:
                    "10px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteTask(
                    task.id
                  )
                }

                style={{
                  marginRight:
                    "10px",
                }}
              >
                Delete
              </button>

              {/* Status Dropdown */}
              <select
                value={task.status}

                onChange={(e) =>
                  changeStatus(
                    task,
                    e.target.value
                  )
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;