let todoList = document.getElementById("todos");
let submit = document.getElementById("submit");
let input = document.getElementById("input");
let isCompleted;

const addTodo = async () => {
  let todo = document.getElementById("input").value;
  if (todo === "") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Please enter a todo",
    });
    return;
  }
  todoList.innerHTML = "";
  let todoBody = { title: todo };
  let res = await fetch("http://localhost:3000/addtodo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoBody),
  });
  let data = await res.json();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Todo added successfully",
  });
  readTodos();
};

const readTodos = async () => {
  let res = await fetch("http://localhost:3000/alltodos");
  let data = await res.json();
  todoList.innerHTML = "";
  data.data.forEach((todo) => {
    let li = document.createElement("li");
    li.classList.add("todo");
    li.innerHTML = `${todo.title}
        <button class="update" id="update" onclick="updateTodo('${todo._id}')">Update Todo</button> 
        <button class="delete" id="delete" onclick="deleteTodo('${todo._id}')">Delete Todo</button>`;
    todoList.appendChild(li);
    input.value = "";
  });
};

const deleteTodo = async (id) => {
  try {
    let res = await fetch(`http://localhost:3000/deletetodo/${id}`, {
      method: "POST",
    });
    if (res.ok) {
      readTodos();
      let timerInterval;
      Swal.fire({
        title: "Todo delete successfully!",
        html: "<b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {});
    } else {
      Swal.fire({
        title: "Sorry!",
        text: "Failed to delete user!",
        icon: "error",
      });
    }

    readTodos();
  } catch (error) {
    console.log("error", error);
  }
};

const updateTodo = async (id) => {
  const { value: todo } = await Swal.fire({
    title: "Enter updated todo",
    input: "text",
    inputLabel: "Your new todo",
    inputPlaceholder: "Write something",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  if (todo) {
    Swal.fire(`Your new todo is ${todo}`);
  }
  let todoBody = { title: todo };
  let res = await fetch(`http://localhost:3000/updatetodo/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoBody),
  });
  let data = await res.json();
  readTodos();
};
window.onload = readTodos;
window.deleteTodo = deleteTodo;
window.updateTodo = updateTodo;
submit.addEventListener("click", addTodo);
