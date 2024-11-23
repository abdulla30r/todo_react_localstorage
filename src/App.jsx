import { useState, useEffect } from "react";
import { Button, Input, List, Select, Modal, Checkbox, Tag, DatePicker, TimePicker } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [taskDate, setTaskDate] = useState(null);
  const [taskTime, setTaskTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortOption, setSortOption] = useState("none"); // Default sorting option

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim() || !taskDate || !taskTime) return;
    const newEntry = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority,
      date: taskDate.format("YYYY-MM-DD"),
      time: taskTime.format("HH:mm"),
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
    setPriority("Medium");
    setTaskDate(null);
    setTaskTime(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setPriority(task.priority);
    setTaskDate(dayjs(task.date));
    setTaskTime(dayjs(task.time, "HH:mm"));
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (!newTask.trim() || !taskDate || !taskTime) return;
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              text: newTask,
              priority,
              date: taskDate.format("YYYY-MM-DD"),
              time: taskTime.format("HH:mm"),
            }
          : task
      )
    );
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask("");
    setPriority("Medium");
    setTaskDate(null);
    setTaskTime(null);
  };

  const getPriorityTag = (priority) => {
    const color = {
      High: "red",
      Medium: "blue",
      Low: "green",
    }[priority];
    return <Tag color={color}>{priority}</Tag>;
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedTasks = [...tasks];

    if (option === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (option === "date") {
      sortedTasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    } else if (option === "status") {
      sortedTasks.sort((a, b) => a.completed - b.completed);
    }

    setTasks(sortedTasks);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#1A00E2" }}>To Do</h1>
      <Input placeholder="Enter a new task" value={newTask} onChange={(e) => setNewTask(e.target.value)} style={{ marginBottom: "10px" }} />
      <DatePicker placeholder="Select Date" value={taskDate} onChange={setTaskDate} style={{ width: "100%", marginBottom: "10px" }} />
      <TimePicker placeholder="Select Time" value={taskTime} onChange={setTaskTime} style={{ width: "100%", marginBottom: "10px" }} />
      <Select value={priority} onChange={setPriority} style={{ width: "100%", marginBottom: "10px" }}>
        <Option value="High">High</Option>
        <Option value="Medium">Medium</Option>
        <Option value="Low">Low</Option>
      </Select>
      <Button type="primary" onClick={addTask} block>
        Add Task
      </Button>
      <Select value={sortOption} onChange={handleSort} style={{ width: "100%", marginTop: "20px" }}>
        <Option value="none">No Sorting</Option>
        <Option value="priority">Sort by Priority</Option>
        <Option value="date">Sort by Date & Time</Option>
        <Option value="status">Sort by Status</Option>
      </Select>
      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            key={task.id}
            actions={[
              <Checkbox key={`${task.id}-checkbox`} checked={task.completed} onChange={() => toggleComplete(task.id)}>
                {task.completed ? "Completed" : "Complete"}
              </Checkbox>,
              <EditOutlined key={`${task.id}-edit`} onClick={() => openEditModal(task)} style={{ cursor: "pointer", marginRight: "10px" }} />,
              <DeleteOutlined key={`${task.id}-delete`} onClick={() => deleteTask(task.id)} style={{ cursor: "pointer", color: "red" }} />,
            ]}
          >
            <div>
              <div
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  marginBottom: "5px",
                }}
              >
                {task.text}
              </div>
              <div>
                <Tag color="blue">{task.date}</Tag>
                <Tag color="purple">{task.time}</Tag>
                {getPriorityTag(task.priority)}
              </div>
            </div>
          </List.Item>
        )}
      />
      <Modal title="Edit Task" visible={isModalOpen} onOk={handleEdit} onCancel={() => setIsModalOpen(false)}>
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} style={{ marginBottom: "10px" }} />
        <DatePicker placeholder="Select Date" value={taskDate} onChange={setTaskDate} style={{ width: "100%", marginBottom: "10px" }} />
        <TimePicker placeholder="Select Time" value={taskTime} onChange={setTaskTime} style={{ width: "100%", marginBottom: "10px" }} />
        <Select value={priority} onChange={setPriority} style={{ width: "100%" }}>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default App;
